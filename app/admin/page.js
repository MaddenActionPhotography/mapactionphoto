"use client";

import { useEffect, useState } from "react";

async function api(payload) {
  const res = await fetch("/api/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Request failed.");
  return json;
}

export default function Admin() {
  const [authed, setAuthed] = useState(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [galleries, setGalleries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [busy, setBusy] = useState("");
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    api({ action: "session" })
      .then((r) => setAuthed(Boolean(r.authed)))
      .catch(() => setAuthed(false));
  }, []);

  useEffect(() => {
    if (authed) refreshGalleries();
  }, [authed]);

  async function refreshGalleries() {
    try {
      const r = await api({ action: "listGalleries" });
      setGalleries(r.galleries);
    } catch (e) {
      setError(e.message);
    }
  }

  async function loadPhotos(g) {
    setSelected(g);
    setPhotos([]);
    try {
      const r = await api({ action: "listPhotos", gallery_id: g.id });
      setPhotos(r.photos);
    } catch (e) {
      setError(e.message);
    }
  }

  async function signIn(e) {
    e.preventDefault();
    setError("");
    try {
      await api({ action: "login", password });
      setAuthed(true);
      setPassword("");
    } catch (e) {
      setError(e.message);
    }
  }

  async function createGallery(e) {
    e.preventDefault();
    setError("");
    setBusy("creating");
    const f = e.currentTarget;
    try {
      const r = await api({
        action: "createGallery",
        title: f.title.value,
        client_name: f.client_name.value,
        client_email: f.client_email.value,
        sport: f.sport.value,
        event_date: f.event_date.value,
      });
      f.reset();
      await refreshGalleries();
      await loadPhotos(r.gallery);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy("");
    }
  }

  async function uploadFiles(fileList, kind) {
    if (!selected || !fileList?.length) return;
    setError("");
    const files = Array.from(fileList);
    setProgress({ done: 0, total: files.length, kind });

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const { url, key } = await api({
          action: "uploadUrl",
          slug: selected.slug,
          filename: file.name,
          contentType: file.type || "image/jpeg",
          kind,
        });

        const put = await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": file.type || "image/jpeg" },
          body: file,
        });
        if (!put.ok) throw new Error(`Upload failed for ${file.name}`);

        await api({
          action: "savePhoto",
          gallery_id: selected.id,
          filename: file.name,
          key,
          kind,
          sort_order: i,
        });
      } catch (e) {
        setError(`${e.message} (stopped at ${file.name})`);
        break;
      }
      setProgress({ done: i + 1, total: files.length, kind });
    }

    await loadPhotos(selected);
    setTimeout(() => setProgress(null), 2500);
  }

  if (authed === null) {
    return (
      <main className="admin-wrap">
        <p className="admin-muted">Loading…</p>
      </main>
    );
  }

  if (!authed) {
    return (
      <main className="admin-wrap">
        <form className="panel admin-login" onSubmit={signIn}>
          <h1 className="admin-h1">M.A.P. Admin</h1>
          <div className="field">
            <label htmlFor="pw">Password</label>
            <input
              id="pw"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          </div>
          {error ? <p className="form-error">{error}</p> : null}
          <button className="btn" type="submit">
            Sign in
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-wrap">
      <div className="admin-head">
        <h1 className="admin-h1">M.A.P. Admin</h1>
        <button
          className="btn ghost"
          onClick={async () => {
            await api({ action: "logout" });
            setAuthed(false);
          }}
        >
          Sign out
        </button>
      </div>

      {error ? <p className="form-error">{error}</p> : null}

      <div className="admin-grid">
        <section className="panel">
          <h2 className="admin-h2">New gallery</h2>
          <form onSubmit={createGallery}>
            <div className="field">
              <label htmlFor="g-title">Gallery title</label>
              <input
                id="g-title"
                name="title"
                required
                placeholder="Jr Hurricanes vs Rose City — Aug 22"
              />
            </div>
            <div className="field">
              <label htmlFor="g-client">Client name</label>
              <input id="g-client" name="client_name" placeholder="Parent's name" />
            </div>
            <div className="field">
              <label htmlFor="g-email">Client email</label>
              <input id="g-email" name="client_email" type="email" placeholder="parent@example.com" />
            </div>
            <div className="field">
              <label htmlFor="g-sport">Sport</label>
              <input id="g-sport" name="sport" placeholder="Hockey — Youth" />
            </div>
            <div className="field">
              <label htmlFor="g-date">Event date</label>
              <input id="g-date" name="event_date" type="date" />
            </div>
            <button className="btn" type="submit" disabled={busy === "creating"}>
              {busy === "creating" ? "Creating…" : "Create gallery"}
            </button>
          </form>
        </section>

        <section className="panel">
          <h2 className="admin-h2">Galleries</h2>
          {galleries.length === 0 ? (
            <p className="admin-muted">No galleries yet.</p>
          ) : (
            <ul className="admin-list">
              {galleries.map((g) => (
                <li key={g.id}>
                  <button
                    className={`admin-gallery ${selected?.id === g.id ? "on" : ""}`}
                    onClick={() => loadPhotos(g)}
                  >
                    <strong>{g.title}</strong>
                    <span>
                      Code {g.access_code}
                      {g.event_date ? ` · ${g.event_date}` : ""}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {selected ? (
        <section className="panel admin-selected">
          <h2 className="admin-h2">{selected.title}</h2>
          <p className="admin-code">
            Access code: <b>{selected.access_code}</b>
          </p>
          <p className="admin-muted">
            Client link: https://www.madactionphotos.com/gallery?code=
            {selected.access_code}
          </p>

          <div className="admin-uploads">
            <div className="field">
              <label htmlFor="up-proofs">
                Upload watermarked proofs (what clients browse)
              </label>
              <input
                id="up-proofs"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => uploadFiles(e.target.files, "proof")}
              />
            </div>
            <div className="field">
              <label htmlFor="up-orig">
                Upload clean originals (unlocked after purchase — same filenames)
              </label>
              <input
                id="up-orig"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => uploadFiles(e.target.files, "original")}
              />
            </div>
          </div>

          {progress ? (
            <p className="admin-progress">
              Uploading {progress.kind}s… {progress.done} of {progress.total}
            </p>
          ) : null}

          <p className="admin-muted">
            {photos.length} photo{photos.length === 1 ? "" : "s"} ·{" "}
            {photos.filter((p) => p.original_key).length} with originals
          </p>
          <ul className="admin-photos">
            {photos.map((p) => (
              <li key={p.id}>
                {p.filename}
                {p.original_key ? <em> · original ✓</em> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
