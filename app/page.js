"use client";

import { useEffect, useState } from "react";

const POSTERS = [
  { src: "/photos/poster-parker-kipp.jpg", alt: "Custom dual-sport athlete poster — baseball and hockey" },
  { src: "/photos/poster-jasmine.jpg", alt: "Custom figure skating athlete poster" },
  { src: "/photos/poster-jett.jpg", alt: "Custom hockey athlete poster" },
  { src: "/photos/poster-parker.jpg", alt: "Custom baseball athlete poster" },
];

const WORK_HOCKEY = [
  { src: "/photos/action-hockey-dark.jpg", alt: "Youth hockey player skating with the puck", label: "Hockey · Game action" },
  { src: "/photos/action-hockey-white.jpg", alt: "Hockey player follow-through on a shot", label: "Hockey · The release" },
];

const WORK_ARTISTIC = [
  { src: "/photos/action-dance.jpg", alt: "Dance team lift during a competition routine", label: "Dance · Competition day" },
  { src: "/photos/action-skater.jpg", alt: "Figure skater in a low spiral on the ice", label: "Figure skating · On the edge" },
];

function Rotator({ photos, className, aspect, onOpen, startIndex = 0, showLabel = false }) {
  const [i, setI] = useState(startIndex);

  useEffect(() => {
    if (photos.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % photos.length), 5000);
    return () => clearInterval(t);
  }, [photos.length]);

  const current = photos[i];

  return (
    <div
      className={`rotator ${className || ""}`}
      style={{ aspectRatio: aspect }}
      role="button"
      tabIndex={0}
      aria-label={`${current.alt} — click to enlarge`}
      onClick={() => onOpen(current)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(current);
        }
      }}
    >
      {photos.map((p, idx) => (
        <img key={p.src} src={p.src} alt={idx === i ? p.alt : ""} className={idx === i ? "active" : ""} />
      ))}
      {showLabel && current.label ? <span className="rot-label">{current.label}</span> : null}
      {photos.length > 1 ? (
        <div className="rot-dots" aria-hidden="true">
          {photos.map((p, idx) => (
            <i key={p.src} className={idx === i ? "on" : ""} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function BookingForm() {
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [errorMsg, setErrorMsg] = useState("");

  async function submit(e) {
    e.preventDefault();
    const f = e.currentTarget;
    const payload = {
      name: f.name.value,
      email: f.email.value,
      phone: f.phone.value,
      sport: f.sport.value,
      game_date: f.game_date.value,
      location: f.location.value,
      notes: f.notes.value,
      website: f.website.value,
    };
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  }

  if (status === "done") {
    return (
      <div className="panel">
        <h3>Request received</h3>
        <p>
          Thanks — your request is in. I&apos;ll confirm availability and get
          back to you within 24 hours to lock in your date.
        </p>
        <p className="pay-note">
          Once confirmed, a $20 booking fee holds your slot — Venmo, PayPal,
          or card.
        </p>
      </div>
    );
  }

  return (
    <form className="panel" onSubmit={submit}>
      <h3>Request coverage</h3>
      <div className="field">
        <label htmlFor="f-name">Your name</label>
        <input id="f-name" name="name" type="text" required placeholder="First and last name" />
      </div>
      <div className="field">
        <label htmlFor="f-email">Email</label>
        <input id="f-email" name="email" type="email" required placeholder="you@example.com" />
      </div>
      <div className="field">
        <label htmlFor="f-phone">Phone (optional)</label>
        <input id="f-phone" name="phone" type="tel" placeholder="(503) 555-0123" />
      </div>
      <div className="field">
        <label htmlFor="f-sport">Sport &amp; level</label>
        <select id="f-sport" name="sport" defaultValue="Hockey — Youth">
          <option>Hockey — Youth</option>
          <option>Hockey — High School</option>
          <option>Baseball — Youth</option>
          <option>Baseball — High School</option>
          <option>Figure Skating</option>
          <option>Dance</option>
          <option>Football</option>
          <option>Other (tell me below)</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="f-date">Game date</label>
        <input id="f-date" name="game_date" type="date" />
      </div>
      <div className="field">
        <label htmlFor="f-loc">Field / location</label>
        <input id="f-loc" name="location" type="text" placeholder="Field, rink, or venue" />
      </div>
      <div className="field">
        <label htmlFor="f-notes">Anything else? (optional)</label>
        <textarea id="f-notes" name="notes" rows={3} placeholder="Team name, jersey number, game time…" />
      </div>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", opacity: 0 }}
      />
      {status === "error" ? <p className="form-error">{errorMsg}</p> : null}
      <button className="btn" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Request this date"}
      </button>
      <p className="pay-note">
        Pay your way: Venmo, PayPal, or card. A $20 booking fee holds your date.
      </p>
    </form>
  );
}

export default function Home() {
  const [lightbox, setLightbox] = useState(null);

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

  const open = (photo) => setLightbox(photo);

  return (
    <>
      <nav>
        <div className="wrap nav-inner">
          <a className="logo" href="#top" aria-label="M.A.P. Sports Photography home">
            <img src="/map-logo.png" alt="M.A.P. Sports Photography" />
          </a>
          <div className="nav-links">
            <a href="#pricing">Pricing</a>
            <a href="#artwork">Athlete Artwork</a>
            <a href="#work">Recent Work</a>
            <a href="#book">Book</a>
            <a href="#book">Galleries</a>
            <a className="btn ghost" href="#book">
              Check availability
            </a>
          </div>
        </div>
      </nav>

      <header id="top">
        <div className="streaks" aria-hidden="true">
          <div className="streak s1"></div>
          <div className="streak s2"></div>
          <div className="streak s3"></div>
        </div>
        <div className="wrap hero-grid">
          <div className="hero">
            <span className="eyebrow">
              Portland &amp; Vancouver Metro · Youth to Varsity &amp; Beyond
            </span>
            <h1>
              Today&apos;s game.
              <br />
              <span className="gold">Tomorrow&apos;s memory.</span>
            </h1>
            <p>
              Professional action photography and custom digital athlete
              artwork. Every session delivers professionally edited images
              straight to you — plus optional posters, wallpapers, and graphics
              that celebrate your athlete for years to come.
            </p>
            <div className="hero-cta">
              <a className="btn" href="#book">
                Book a session
              </a>
              <a className="btn ghost" href="#artwork">
                See athlete artwork
              </a>
            </div>
            <div className="digital-tag">
              100% digital delivery — print anywhere you choose
            </div>
          </div>
          <div>
            <Rotator
              photos={POSTERS}
              className="hero-feature"
              aspect="16 / 9"
              onOpen={open}
            />
            <div className="hero-caption">
              Signature poster edits · click any photo to enlarge
            </div>
          </div>
        </div>
      </header>

      <section id="pricing">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Simple pricing</span>
            <h2>Pay only for the shots you love.</h2>
            <p>
              A small booking fee locks in your game. I shoot the action, edit
              the best frames, and post your private gallery — then you pick
              the images and artwork you actually want. No packages, no bundles
              you don&apos;t need.
            </p>
          </div>
          <div className="cards">
            <div className="card">
              <h3>Book Your Game</h3>
              <div className="price">
                $20 <small>booking fee</small>
              </div>
              <ul>
                <li>Reserves your date</li>
                <li>Full-game action coverage</li>
                <li>Professionally edited gallery</li>
                <li>Browse before you buy</li>
              </ul>
              <a className="btn" href="#book">
                Book a game
              </a>
            </div>
            <div className="card">
              <h3>Digital Images</h3>
              <div className="price">
                $8 <small>/ image</small>
              </div>
              <ul>
                <li>Hand-pick your favorites</li>
                <li>High-resolution download</li>
                <li>Personal-use rights included</li>
                <li>Print anywhere you choose</li>
              </ul>
              <a className="btn ghost" href="#book">
                Open my gallery
              </a>
            </div>
            <div className="card feature">
              <h3>Poster Edit</h3>
              <div className="price">
                $20 <small>/ poster</small>
              </div>
              <ul>
                <li>Custom athlete poster design</li>
                <li>Built from your favorite shot</li>
                <li>High-resolution digital file</li>
                <li>The keepsake of the season</li>
              </ul>
              <a className="btn" href="#artwork">
                Explore artwork
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="artwork">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Custom athlete artwork</span>
            <h2>More than photos. A whole lineup.</h2>
            <p>
              Every piece is designed from your athlete&apos;s real game action
              — bold typography, cinematic lighting, delivered as a
              high-resolution digital file you can print anywhere or share
              everywhere. Recent poster edits:
            </p>
          </div>
          <div className="poster-strip">
            {POSTERS.slice(1).map((p) => (
              <div
                key={p.src}
                className="poster-card"
                role="button"
                tabIndex={0}
                aria-label={`${p.alt} — click to enlarge`}
                onClick={() => open(p)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    open(p);
                  }
                }}
              >
                <img src={p.src} alt={p.alt} />
              </div>
            ))}
          </div>
          <div className="lineup">
            <div className="product">
              <span className="ratio">Signature</span>
              <h3>Athlete Poster</h3>
              <p>
                The centerpiece. A custom-designed poster built around your
                athlete&apos;s best moment of the season.
              </p>
            </div>
            <div className="product">
              <span className="ratio">Everyday</span>
              <h3>Phone Wallpaper</h3>
              <p>Their highlight, on their lock screen. Sized perfectly for any phone.</p>
            </div>
          </div>
          <p className="coming-soon">
            <b>Coming soon:</b> trading cards, magazine covers, senior
            graphics &amp; team posters.
          </p>
        </div>
      </section>

      <section id="work">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Recent work</span>
            <h2>Shot from the sideline.</h2>
            <p>
              Real games, real athletes, edited one frame at a time. Click any
              photo for a closer look.
            </p>
          </div>
          <div className="work-row">
            <Rotator
              photos={WORK_HOCKEY}
              className="work-tile"
              aspect="3 / 2"
              onOpen={open}
              showLabel
            />
            <Rotator
              photos={WORK_ARTISTIC}
              className="work-tile"
              aspect="3 / 2"
              onOpen={open}
              startIndex={1}
              showLabel
            />
          </div>
        </div>
      </section>

      <section id="book">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Book a session</span>
            <h2>Lock in your game date.</h2>
            <p>
              Tell me the sport, date, and location. I&apos;ll confirm
              availability and hold your slot.
            </p>
          </div>
          <div className="split">
            <BookingForm />
            <div className="panel">
              <h3>Client galleries</h3>
              <p>
                Already had your game shot? Your gallery is private,
                password-protected, and yours to browse. Purchased images
                unlock with the download code you receive after checkout.
              </p>
              <div className="field">
                <label htmlFor="g-code">Gallery access code</label>
                <input id="g-code" type="text" placeholder="Enter your code" />
              </div>
              <button className="btn ghost" type="button">
                Open my gallery
              </button>
              <p className="pay-note">
                All products are delivered digitally — you own the files and
                can print them at any provider you choose.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap foot-grid">
          <div>
            <div className="logo-foot" style={{ marginBottom: ".7rem" }}>
              <img src="/map-logo.png" alt="M.A.P. Sports Photography" />
            </div>
            <div>Today&apos;s Game. Tomorrow&apos;s Memory.</div>
            <div>Portland &amp; Vancouver Metro</div>
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: ".4rem" }}>
              Payments accepted
            </div>
            Venmo · PayPal · All major cards
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: ".4rem" }}>
              Digital delivery only
            </div>
            You receive high-resolution files —
            <br />
            print anywhere you choose.
          </div>
        </div>
      </footer>

      {lightbox ? (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
          onClick={() => setLightbox(null)}
        >
          <button
            className="lightbox-close"
            aria-label="Close enlarged photo"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  );
}