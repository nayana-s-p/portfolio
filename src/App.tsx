import { useEffect, useState } from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  Code2,
  Database,
  Download,
  Layers3,
  MapPin,
  Menu,
  Pause,
  Phone,
  Play,
  Sparkles,
  Wrench,
  X,
} from 'lucide-react';
import { education, experience, languages, profile, projects, skillGroups } from './content';
import { AmbientMotion, CraftStory, PortraitFigure, SystemStory } from './Experience';
import { useMotion } from './useMotion';

const skillIcons = {
  code: Code2,
  layout: Layers3,
  server: Code2,
  database: Database,
  brain: BrainCircuit,
  chart: BarChart3,
  spark: Sparkles,
  tool: Wrench,
  layers: Layers3,
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [motionPaused, setMotionPaused] = useState(false);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useMotion(motionPaused, reduced);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className={`portfolio ${reduced ? 'motion-reduced' : ''} ${motionPaused ? 'motion-paused' : ''}`} data-motion={motionPaused || reduced ? 'paused' : 'playing'}>
      <div className="portfolio-atmosphere" aria-hidden="true"><AmbientMotion paused={motionPaused} reduced={reduced} /></div>
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Nayana S Parthan, home">
          <span className="wordmark-monogram">N<span>.</span></span>
          <span className="wordmark-name">Nayana S Parthan</span>
        </a>

        <button
          className="menu-button"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>

        <nav id="site-navigation" className={`site-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#experience" onClick={closeMenu}>Experience</a>
          <a href="#story" onClick={closeMenu}>Approach</a>
          <a href="#projects" onClick={closeMenu}>Projects</a>
          <a href="#skills" onClick={closeMenu}>Skills</a>
          <a href="#process" onClick={closeMenu}>Process</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
          <a className="nav-resume" href={`${import.meta.env.BASE_URL}assets/Nayana_S_Parthan_CV.pdf`} download>
            <Download size={15} /> <span>Resume</span>
          </a>
        </nav>
        <button className="motion-toggle" type="button" onClick={() => setMotionPaused(!motionPaused)} disabled={reduced} aria-pressed={motionPaused || reduced} aria-label={reduced ? 'Motion disabled by system preference' : motionPaused ? 'Resume ambient animation' : 'Pause ambient animation'}>
          {motionPaused || reduced ? <Play size={14} /> : <Pause size={14} />}
          <span>{motionPaused || reduced ? 'STILL' : 'MOTION'}</span>
        </button>
      </header>

      <main id="main">
        <section id="home" className="hero section-shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> FULL STACK DEVELOPER <span className="eyebrow-divider">/</span> AI/ML DEVELOPER</p>
            <h1 id="hero-title"><span className="hero-greeting">Hello, I’m</span><span className="hero-name"><span className="hero-name-line">Nayana </span><em className="hero-name-line">S Parthan.</em></span></h1>
            <p className="hero-lede">Building thoughtful digital experiences with <em>logic, curiosity,</em> and a little imagination.</p>
            <p className="hero-summary">{profile.introduction}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#projects">Explore my work <ArrowUpRight size={17} /></a>
              <a className="button button-text" href="#contact">Let’s connect <ArrowRight size={16} /></a>
            </div>
            <div className="hero-location"><MapPin size={15} /><span>{profile.location}</span></div>
          </div>

          <PortraitFigure paused={motionPaused} reduced={reduced} />

          <a className="scroll-cue" href="#about" aria-label="Scroll to about section"><span>SCROLL TO EXPLORE</span><ArrowDownRight size={17} /></a>
          <span className="hero-index" aria-hidden="true">01 / 08</span>
        </section>

        <section id="about" className="about section-shell" aria-labelledby="about-title">

          <div className="section-kicker"><span>01 / A LITTLE ABOUT ME</span><span className="kicker-rule" /></div>
          <div className="about-layout">
            <div className="about-heading">
              <p className="script-note">Thoughtful by nature.</p>
              <h2 id="about-title">I like making<br />technology feel<br /><em>more human.</em></h2>
              <div className="about-stamp"><Sparkles size={16} /><span>ALWAYS LEARNING<br />ALWAYS BUILDING</span></div>
            </div>
            <div className="about-copy">
              <p className="about-intro">A developer who enjoys bringing ideas to life, from the first data point to the final interface.</p>
              <p>{profile.summary}</p>
              <p>My project work includes healthcare management and predictive analysis, and I’m especially interested in AI-driven healthcare solutions.</p>
              <div className="focus-list" aria-label="Areas of interest">
                <span><i>01</i> Full stack applications</span>
                <span><i>02</i> Machine learning & data</span>
                <span><i>03</i> Healthcare technology</span>
              </div>
            </div>
          </div>
        </section>

        <section id="experience" className="experience section-shell" aria-labelledby="experience-title">

          <div className="section-kicker"><span>02 / EXPERIENCE</span><span className="kicker-rule" /><span className="section-aside">A JOURNEY THROUGH CODE & CURIOSITY</span></div>
          <div className="section-heading">
            <h2 id="experience-title">Where I’ve<br /><em>grown.</em></h2>
            <p>Building a strong foundation across application development, APIs, databases, and applied machine learning.</p>
          </div>
          <div className="experience-list">
            {experience.map((item, index) => (
              <article className="experience-item" key={`${item.company}-${item.role}`}>
                <div className="experience-marker"><span>0{index + 1}</span><i /></div>
                <div className="experience-main">
                  <div className="experience-meta">{item.dates && <span>{item.dates}</span>}<span className="experience-location"><MapPin size={13} />{item.location}</span></div>
                  <h3>{item.role}</h3>
                  <p className="experience-company">{item.company}</p>
                  <ul>{item.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul>
                </div>
                <div className={`experience-seal seal-${index}`} aria-hidden="true">{index === 2 ? <BrainCircuit /> : index === 1 ? <Code2 /> : <Layers3 />}</div>
              </article>
            ))}
          </div>
        </section>

        <SystemStory paused={motionPaused} reduced={reduced} />

        <section id="projects" className="projects section-shell" aria-labelledby="projects-title">

          <div className="section-kicker"><span>04 / SELECTED PROJECTS</span><span className="kicker-rule" /><span className="section-aside">MADE WITH PURPOSE</span></div>
          <div className="section-heading projects-heading">
            <h2 id="projects-title">A few things<br /><em>I’ve worked on.</em></h2>
            <p>Applications and experiments in full stack development, healthcare, data, and machine learning.</p>
          </div>
          <div className="projects-viewport" tabIndex={0} role="region" aria-label="Selected projects"><div className="project-grid">
            {projects.map(project => (
              <article className={`project-card project-${project.tone}`} key={project.number}>
                <div className="project-art" aria-hidden="true">
                  <span className="project-art-number">{project.number}</span>
                  <div className="project-art-orbit" />
                  <div className="project-art-mark">{project.mark}</div>
                  <span className="project-art-label">{project.category}</span>
                  <span className="project-art-spark">✳</span>
                </div>
                <div className="project-content">
                  <p className="project-subtitle">{project.subtitle}</p>
                  <h3>{project.name}</h3>
                  <p className="project-description">{project.description}</p>
                  <ul className="project-details">{project.details.map(detail => <li key={detail}>{detail}</li>)}</ul>
                  <div className="project-tech" aria-label="Technologies">
                    {project.technologies.map(technology => <span key={technology}>{technology}</span>)}
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="projects-rail" aria-hidden="true"><span>SCROLL TO EXPLORE</span><span className="projects-progress"><i /></span><span>{projects.length.toString().padStart(2, '0')} SELECTED PROJECTS</span></div></div>
        </section>

        <section id="skills" className="skills section-shell" aria-labelledby="skills-title">

          <div className="section-kicker"><span>05 / MY TOOLKIT</span><span className="kicker-rule" /><span className="section-aside">TOOLS, IDEAS & PRACTICE</span></div>
          <div className="section-heading skills-heading">
            <h2 id="skills-title"><span className="skills-title-line">Curious by nature.</span><span className="skills-title-line"><em>Technical by practice.</em></span></h2>
            <p>A broad toolkit for turning a problem into a working, considered solution.</p>
          </div>
          <div className="skill-grid">
            {skillGroups.map(group => {
              const Icon = skillIcons[group.icon as keyof typeof skillIcons];
              return <article className="skill-card" key={group.title}>
                <div className="skill-card-heading"><span className="skill-icon"><Icon size={18} /></span><h3>{group.title}</h3></div>
                <div className="skill-tags">{group.items.map(item => <span key={item}>{item}</span>)}</div>
              </article>;
            })}
          </div>
        </section>

        <CraftStory paused={motionPaused} reduced={reduced} />

        <section className="education section-shell" aria-label="Education and languages">

          <div className="education-column">
            <div className="section-kicker"><span>07 / EDUCATION</span><span className="kicker-rule" /></div>
            <h2>A foundation<br /><em>for what’s next.</em></h2>
            <div className="education-list">
              {education.map(item => <article className="education-item" key={item.degree}>
                <span className="education-mark">✳</span>
                <div><p>{item.dates || 'COMPUTER SCIENCE'}</p><h3>{item.degree}</h3><span>{item.subject}</span><small>{item.institution}</small></div>
              </article>)}
            </div>
          </div>
          <div className="languages-column">
            <div className="section-kicker"><span>07 / LANGUAGES</span><span className="kicker-rule" /></div>
            <h2>Words that<br /><em>bring us closer.</em></h2>
            <ul className="language-list">
              {languages.map(language => <li key={language.name}><span>{language.name}</span><span>{language.level || 'Proficiency not specified'}</span></li>)}
            </ul>
          </div>
        </section>

        <section id="contact" className="contact section-shell" aria-labelledby="contact-title">

          <div className="contact-decoration" aria-hidden="true"><span>✳</span><i /></div>
          <div className="section-kicker"><span>08 / LET’S MAKE SOMETHING MEANINGFUL</span><span className="kicker-rule" /></div>
          <div className="contact-content">
            <p className="contact-note">Have an idea, opportunity, or a good question?</p>
            <h2 id="contact-title">I’d love to<br /><em>hear from you.</em></h2>
            <a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={21} /></a>
            <div className="contact-details">
              <a href={`tel:${profile.phone.replaceAll(' ', '')}`}><Phone size={15} />{profile.phone}</a>
              <span><MapPin size={15} />{profile.location}</span>
            </div>
            <a className="contact-resume" href={`${import.meta.env.BASE_URL}assets/Nayana_S_Parthan_CV.pdf`} download><Download size={16} /> Download my resume</a>
          </div>
        </section>
      </main>

      <footer className="site-footer section-shell">
        <a className="footer-wordmark" href="#home">N<span>.</span></a>
        <p>© {new Date().getFullYear()} {profile.name}. Made with care in Kerala.</p>
        <a href="#home">Back to top <ArrowUpRight size={14} /></a>
      </footer>
    </div>
  );
}

export default App;
