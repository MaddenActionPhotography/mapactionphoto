import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const FROM = "M.A.P. Bookings <bookings@madactionphotos.com>";

function clean(v, max = 500) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  // Honeypot: real people never fill this hidden field.
  if (clean(body.website)) {
    return NextResponse.json({ ok: true });
  }

  const data = {
    name: clean(body.name, 120),
    email: clean(body.email, 200).toLowerCase(),
    phone: clean(body.phone, 40),
    sport: clean(body.sport, 80),
    game_date: clean(body.game_date, 20) || null,
    location: clean(body.location, 200),
    notes: clean(body.notes, 1500),
  };

  if (!data.name || !data.email || !data.sport) {
    return NextResponse.json(
      { error: "Please fill in your name, email, and sport." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return NextResponse.json(
      { error: "That email address doesn't look right." },
      { status: 400 }
    );
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );

  const { error: dbError } = await supabase
    .from("booking_requests")
    .insert(data);

  if (dbError) {
    console.error("Supabase insert failed:", dbError);
    return NextResponse.json(
      { error: "Couldn't save your request. Please try again in a moment." },
      { status: 500 }
    );
  }

  // Email alert to Rick. A failure here should NOT fail the booking —
  // the request is already safely in the database.
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const dateText = data.game_date || "Not specified";
    await resend.emails.send({
      from: FROM,
      to: process.env.BOOKING_NOTIFY_EMAIL,
      replyTo: data.email,
      subject: `New booking request — ${data.sport} · ${dateText}`,
      html: `
        <div style="background:#0B0B0D;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
          <div style="max-width:560px;margin:0 auto;background:#141419;border:1px solid rgba(201,162,75,.35);padding:28px;">
            <div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#C9A24B;margin-bottom:8px;">M.A.P. Sports Photography</div>
            <h1 style="margin:0 0 20px;font-size:22px;color:#F2F0EB;text-transform:uppercase;letter-spacing:.02em;">New booking request</h1>
            <table style="width:100%;border-collapse:collapse;color:#F2F0EB;font-size:15px;">
              ${row("Name", data.name)}
              ${row("Email", data.email)}
              ${row("Phone", data.phone || "—")}
              ${row("Sport / level", data.sport)}
              ${row("Game date", dateText)}
              ${row("Location", data.location || "—")}
              ${row("Notes", data.notes || "—")}
            </table>
            <p style="margin:24px 0 0;font-size:13px;color:#B9BEC7;">Reply to this email to respond directly to ${data.name}.</p>
          </div>
        </div>`,
    });
  } catch (mailError) {
    console.error("Resend send failed:", mailError);
  }

  return NextResponse.json({ ok: true });
}

function row(label, value) {
  const safe = String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");
  return `<tr>
    <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,.08);color:#C9A24B;font-size:11px;letter-spacing:.14em;text-transform:uppercase;width:130px;vertical-align:top;">${label}</td>
    <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,.08);">${safe}</td>
  </tr>`;
}
