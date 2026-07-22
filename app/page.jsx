import {
  profile,
  projects,
  experience,
  skills,
  education,
} from "../data/resume.js";
import {
  IconExternal,
  IconGitHub,
  IconLinkedIn,
  IconMail,
  IconPin,
} from "./icons.jsx";

export default function Page() {
  const { links } = profile;
  return (
    <>
      <header className="nav">
        <div className="nav-inner">
          <span className="brand">
            vincent rizzo<span className="dot">.</span>
          </span>
          <nav className="nav-links">
            <a href="#projects">Projects</a>
            <a href="#experience">Experience</a>
            <a href="#skills">Stack</a>
            <a href="#education">Education</a>
          </nav>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="hero" id="top">
          <div className="pronoun">{profile.pronouns}</div>
          <h1>
            Senior Data Scientist <em>&amp; AI Engineer</em>
          </h1>
          <div className="title">{profile.name}</div>
          <div className="tagline">{profile.tagline}</div>
          <p className="summary">{profile.summary}</p>
          <div className="meta-row">
            <span className="pill loc">
              <IconPin /> {profile.location}
            </span>
            <a className="pill" href={`mailto:${links.email}`}>
              <IconMail /> {links.email}
            </a>
            <a className="pill" href={links.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn">
              <IconLinkedIn /> LinkedIn
            </a>
            <a className="pill" href={links.github} target="_blank" rel="noopener" aria-label="GitHub">
              <IconGitHub /> GitHub
            </a>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects">
          <div className="eyebrow">Selected projects</div>
          <h2>Where the engineering lives</h2>
          <p className="lead">
            AI-engineering work, projects first. Each pairs a hard language problem with the
            cheapest model that solves it, plus an evaluation harness to measure it.
          </p>
          <div className="grid">
            {projects.map((proj) => (
              <div className="card" key={proj.title}>
                <span className="tag">{proj.tag}</span>
                <h3>{proj.title}</h3>
                <p className="blurb">{proj.blurb}</p>
                <ul className="tight">
                  {proj.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
                <div className="stack">
                  {proj.stack.map((s) => (
                    <span className="chip" key={s}>
                      {s}
                    </span>
                  ))}
                </div>
                {proj.link && (
                  <div className="stack">
                    <a className="pill" href={proj.link} target="_blank" rel="noopener">
                      {proj.linkLabel || "View deck"} <IconExternal />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* EXPERIENCE */}
        <section id="experience">
          <div className="eyebrow">Experience</div>
          <h2>Six years, one mission</h2>
          <div className="xp">
            {experience.map((x) => (
              <div className="xp-item" key={x.org}>
                <div className="when">
                  {x.period}
                  <span className="place">{x.place}</span>
                </div>
                <div>
                  <h3>{x.role}</h3>
                  <div className="org">{x.org}</div>
                  <p className="desc">{x.note}</p>
                  {x.tags.length > 0 && (
                    <div className="stack">
                      {x.tags.map((t) => (
                        <span className="chip" key={t}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills">
          <div className="eyebrow">Stack</div>
          <h2>Tools I reach for</h2>
          <div className="skillcols">
            {skills.map((col) => (
              <div key={col.group}>
                <h4>{col.group}</h4>
                <div className="stack">
                  {col.items.map((s) => (
                    <span className="chip" key={s}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* EDUCATION */}
        <section id="education">
          <div className="eyebrow">Education</div>
          <h2>Foundations</h2>
          {education.map((e) => (
            <div className="edu-item" key={e.school}>
              <h3>{e.school}</h3>
              <div className="deg">{e.degree}</div>
              <div className="when">{e.period}</div>
              {e.note && <p className="note">{e.note}</p>}
            </div>
          ))}
        </section>

        {/* FOOTER */}
        <footer className="foot">
          <span className="fnote">
            © 2026 {profile.name}. All rights reserved.
          </span>
          <div className="flinks">
            <a className="pill" href={`mailto:${links.email}`} aria-label="Email">
              <IconMail /> Email
            </a>
            <a className="pill" href={links.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn">
              <IconLinkedIn /> LinkedIn
            </a>
            <a className="pill" href={links.github} target="_blank" rel="noopener" aria-label="GitHub">
              <IconGitHub /> GitHub
            </a>
          </div>
        </footer>
      </main>
    </>
  );
}
