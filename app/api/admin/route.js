import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const COOKIE = "map_admin";

function db() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );
}

function r2() {
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
}

function tokenFor(pw) {
  return crypto.createHash("sha256").update(`map::${pw}`).digest("hex");
}

async function isAuthed() {
  const jar = await cookies();
  const v = jar.get(COOKIE)?.value;
  return Boolean(v && v === tokenFor(process.env.ADMIN_PASSWORD || ""));
}

function slugify(s) {
  return (
    String(s)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "gallery"
  );
}

function accessCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += chars[crypto.randomInt(0, chars.length)];
  }
  return out;
}

function safeName(name) {
  return String(name).replace(/[^A-Za-z0-9._-]/g, "_").slice(0, 120);
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const action = body.action;

  // ---- login / logout ----
  if (action === "login") {
    const pw = String(body.password || "");
    const expected = process.env.ADMIN_PASSWORD || "";
    if (!expected) {
      return NextResponse.json(
        { error: "Admin password is not configured." },
        { status: 500 }
      );
    }
    if (pw !== expected) {
      return NextResponse.json({ error: "Wrong password." }, { status: 401 });
    }
    const jar = await cookies();
    jar.set(COOKIE, tokenFor(expected), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    return NextResponse.json({ ok: true });
  }

  if (action === "logout") {
    const jar = await cookies();
    jar.delete(COOKIE);
    return NextResponse.json({ ok: true });
  }

  if (action === "session") {
    return NextResponse.json({ authed: await isAuthed() });
  }

  // ---- everything below requires auth ----
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const supabase = db();

  if (action === "createGallery") {
    const title = String(body.title || "").trim();
    if (!title) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }
    const slug = `${slugify(title)}-${crypto.randomBytes(3).toString("hex")}`;
    const row = {
      title: title.slice(0, 160),
      slug,
      access_code: accessCode(),
      client_name: String(body.client_name || "").trim().slice(0, 120) || null,
      client_email:
        String(body.client_email || "").trim().toLowerCase().slice(0, 200) || null,
      sport: String(body.sport || "").trim().slice(0, 80) || null,
      event_date: String(body.event_date || "").trim() || null,
    };
    const { data, error } = await supabase
      .from("galleries")
      .insert(row)
      .select()
      .single();
    if (error) {
      console.error("createGallery:", error);
      return NextResponse.json(
        { error: "Could not create the gallery." },
        { status: 500 }
      );
    }
    return NextResponse.json({ gallery: data });
  }

  if (action === "listGalleries") {
    const { data, error } = await supabase
      .from("galleries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) {
      console.error("listGalleries:", error);
      return NextResponse.json({ error: "Could not load galleries." }, { status: 500 });
    }
    return NextResponse.json({ galleries: data || [] });
  }

  if (action === "listPhotos") {
    const { data, error } = await supabase
      .from("photos")
      .select("id, filename, proof_key, original_key, sort_order")
      .eq("gallery_id", body.gallery_id)
      .order("sort_order", { ascending: true });
    if (error) {
      console.error("listPhotos:", error);
      return NextResponse.json({ error: "Could not load photos." }, { status: 500 });
    }
    return NextResponse.json({ photos: data || [] });
  }

  // Presigned PUT so the browser uploads straight to R2 (no size limit via Vercel)
  if (action === "uploadUrl") {
    const kind = body.kind === "original" ? "originals" : "proofs";
    const slug = String(body.slug || "").trim();
    const filename = safeName(body.filename || "");
    if (!slug || !filename) {
      return NextResponse.json({ error: "Missing file info." }, { status: 400 });
    }
    const key = `${kind}/${slug}/${filename}`;
    try {
      const url = await getSignedUrl(
        r2(),
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET,
          Key: key,
          ContentType: String(body.contentType || "image/jpeg"),
        }),
        { expiresIn: 900 }
      );
      return NextResponse.json({ url, key });
    } catch (e) {
      console.error("uploadUrl:", e);
      return NextResponse.json(
        { error: "Could not prepare the upload." },
        { status: 500 }
      );
    }
  }

  if (action === "savePhoto") {
    const gallery_id = body.gallery_id;
    const filename = safeName(body.filename || "");
    const key = String(body.key || "");
    if (!gallery_id || !filename || !key) {
      return NextResponse.json({ error: "Missing photo info." }, { status: 400 });
    }

    if (body.kind === "original") {
      const { error } = await supabase
        .from("photos")
        .update({ original_key: key })
        .eq("gallery_id", gallery_id)
        .eq("filename", filename);
      if (error) {
        console.error("savePhoto original:", error);
        return NextResponse.json({ error: "Could not save." }, { status: 500 });
      }
      return NextResponse.json({ ok: true });
    }

    const { data: existing } = await supabase
      .from("photos")
      .select("id")
      .eq("gallery_id", gallery_id)
      .eq("filename", filename)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("photos")
        .update({ proof_key: key })
        .eq("id", existing.id);
      if (error) {
        console.error("savePhoto update:", error);
        return NextResponse.json({ error: "Could not save." }, { status: 500 });
      }
      return NextResponse.json({ ok: true });
    }

    const { error } = await supabase.from("photos").insert({
      gallery_id,
      filename,
      proof_key: key,
      sort_order: Number.isFinite(body.sort_order) ? body.sort_order : 0,
    });
    if (error) {
      console.error("savePhoto insert:", error);
      return NextResponse.json({ error: "Could not save." }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}
