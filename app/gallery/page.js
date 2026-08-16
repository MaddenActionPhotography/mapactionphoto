"use client";

import { useEffect, useState } from "react";

export default function Gallery() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | open | error
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("code");
    if (fromUrl) {
      setCode(fromUrl.toUpperCase());
      openGallery(fromUrl);
    }
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  async function openGallery(rawCode) {
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: rawCode }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setData(json);
      setStatus("open");
    } catch (e) {
      setError(e.message);
      setStatus("error");
    }
  }

  function submit(e) {
    e.preventDefault();
    openGallery(code);
  }

  return (
    <main className="gallery-page">
      <div className="wrap">
        <a className="logo gallery-logo" href="/">
          <img src="/map-logo.png" alt="M.A.P. Sports Photography" />
        </a>

        {status !== "open" ? (
          <div className="panel gallery-gate">
            <span className="eyebrow">Client galleries</span>
            <h1 className="gallery-h1">Your gallery</h1>
            <p>
              Enter the access code from your invitation email to view your
              photos.
            </p>
            <form onSubmit={submit}>
              <div className="field">
                <label htmlFor="code">Gallery access code</label>
                <input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="ABC123"
                  autoCapitalize="characters"
                />
              </div>
              {error ? <p className="form-error">{error}</p> : null}
              <button className="btn" type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Opening…" : "Open my gallery"}
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="gallery-head">
              <span className="eyebrow">
                {data.gallery.sport || "Game gallery"}
                {data.gallery.event_date ? ` · ${data.gallery.event_date}` : ""}
              </span>
              <h1 className="gallery-h1">{data.gallery.title}</h1>
              <p className="gallery-note">
                Proofs are watermarked. Note the file names of the shots you
                want, then contact me to purchase — $8 per image, $20 per poster
                edit. Your clean, full-resolution files unlock with the download
                code I send you.
              </p>
            </div>

            {data.photos.length === 0 ? (
              <p className="admin-muted">
                No photos in this gallery yet — check back shortly.
              </p>
            ) : (
              <div className="proof-grid">
                {data.photos.map((p) => (
                  <button
                    key={p.id}
                    className="proof"
                    onClick={() => setLightbox(p)}
                    aria-label={`Enlarge ${p.filename}`}
                  >
                    <img src={p.url} alt={p.filename} loading="lazy" />
                    <span>{p.filename}</span>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {lightbox ? (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
        >
          <button
            className="lightbox-close"
            aria-label="Close"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
          <img
            src={lightbox.url}
            alt={lightbox.filename}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </main>
  );
}
