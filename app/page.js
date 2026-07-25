export default function Home() {
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
            <div className="hero-feature">
              <img
                src="/photos/poster-parker-kipp.jpg"
                alt="Custom dual-sport athlete poster — baseball and hockey"
              />
            </div>
            <div className="hero-caption">Signature poster edit · M.A.P.</div>
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
            <div className="poster-card">
              <img
                src="/photos/poster-jasmine.jpg"
                alt="Custom figure skating athlete poster"
              />
            </div>
            <div className="poster-card">
              <img
                src="/photos/poster-jett.jpg"
                alt="Custom hockey athlete poster"
              />
            </div>
            <div className="poster-card">
              <img
                src="/photos/poster-parker.jpg"
                alt="Custom baseball athlete poster"
              />
            </div>
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
              <span className="ratio">Collectible</span>
              <h3>Trading Card</h3>
              <p>
                Your athlete on their own card — front action shot, back
                stats. Made to be traded, kept, and shown off.
              </p>
            </div>
            <div className="product">
              <span className="ratio">Cover story</span>
              <h3>Magazine Cover</h3>
              <p>
                A magazine-style cover treatment that puts your athlete on the
                front page of their own season.
              </p>
            </div>
            <div className="product">
              <span className="ratio">Everyday</span>
              <h3>Phone Wallpaper</h3>
              <p>Their highlight, on their lock screen. Sized perfectly for any phone.</p>
            </div>
            <div className="product">
              <span className="ratio">Class of…</span>
              <h3>Senior Graphic</h3>
              <p>
                Senior-year artwork that marks the milestone — built for
                announcements, parties, and posts.
              </p>
            </div>
            <div className="product">
              <span className="ratio">Squad</span>
              <h3>Team Poster</h3>
              <p>
                The whole roster, one design. Team posters, schedule graphics,
                and season recap collages.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="work">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Recent work</span>
            <h2>Shot from the sideline.</h2>
            <p>Real games, real athletes, edited one frame at a time.</p>
          </div>
          <div className="work-row">
            <div className="work">
              <img
                src="/photos/action-hockey-dark.jpg"
                alt="Youth hockey player skating with the puck"
              />
              <span>Hockey · Game action</span>
            </div>
            <div className="work">
              <img
                src="/photos/action-dance.jpg"
                alt="Dance team lift during a competition routine"
              />
              <span>Dance · Competition day</span>
            </div>
            <div className="work">
              <img
                src="/photos/action-hockey-white.jpg"
                alt="Hockey player follow-through on a shot"
              />
              <span>Hockey · The release</span>
            </div>
            <div className="work">
              <img
                src="/photos/action-skater.jpg"
                alt="Figure skater in a low spiral on the ice"
              />
              <span>Figure skating · On the edge</span>
            </div>
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
            <div className="panel">
              <h3>Request coverage</h3>
              <div className="field">
                <label htmlFor="f-name">Your name</label>
                <input id="f-name" type="text" placeholder="First and last name" />
              </div>
              <div className="field">
                <label htmlFor="f-sport">Sport &amp; level</label>
                <select id="f-sport" defaultValue="Hockey — Youth">
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
                <input id="f-date" type="date" />
              </div>
              <div className="field">
                <label htmlFor="f-loc">Field / location</label>
                <input id="f-loc" type="text" placeholder="Field, rink, or venue" />
              </div>
              <button className="btn" type="button">
                Request this date
              </button>
              <p className="pay-note">
                Pay your way: Venmo, PayPal, or card. A $20 booking fee holds
                your date.
              </p>
            </div>
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
    </>
  );
}
