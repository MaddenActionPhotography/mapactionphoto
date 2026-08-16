import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const code = String(body.code || "").trim().toUpperCase();
  if (!code) {
    return NextResponse.json(
      { error: "Please enter your gallery code." },
      { status: 400 }
    );
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );

  const { data: gallery, error } = await supabase
    .from("galleries")
    .select("id, title, slug, sport, event_date, client_name, status")
    .eq("access_code", code)
    .maybeSingle();

  if (error) {
    console.error("gallery lookup:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  if (!gallery || gallery.status !== "active") {
    return NextResponse.json(
      { error: "That code doesn't match a gallery. Double-check and try again." },
      { status: 404 }
    );
  }

  const { data: photos } = await supabase
    .from("photos")
    .select("id, filename, proof_key, sort_order")
    .eq("gallery_id", gallery.id)
    .order("sort_order", { ascending: true });

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });

  const withUrls = [];
  for (const p of photos || []) {
    try {
      const url = await getSignedUrl(
        client,
        new GetObjectCommand({
          Bucket: process.env.R2_BUCKET,
          Key: p.proof_key,
        }),
        { expiresIn: 3600 }
      );
      withUrls.push({ id: p.id, filename: p.filename, url });
    } catch (e) {
      console.error("sign proof failed:", p.proof_key, e);
    }
  }

  return NextResponse.json({
    gallery: {
      title: gallery.title,
      sport: gallery.sport,
      event_date: gallery.event_date,
      client_name: gallery.client_name,
    },
    photos: withUrls,
  });
}
