import { Link } from "react-router-dom";
import "../styles/home.css";

export default function Home({ user }) {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />

        <div className="hero-lines" />

        <div className="hero-content">
          <p className="hero-badge">AI-POWERED LEARNING PLATFORM</p>

          <h1 className="hero-title">
            Learn smarter.
            <br />
            Teach better.
            <br />
            <span>Powered by AI.</span>
          </h1>

          <p className="hero-description">
            Discover courses, access instructor resources and ask intelligent
            questions directly from your learning material.
          </p>

          <div className="hero-actions">
            <Link to="/courses" className="hero-primary-button">
              Explore Courses
            </Link>

            {!user && (
              <Link to="/register" className="hero-secondary-button">
                Get Started
              </Link>
            )}
          </div>
        </div>

        <div className="hero-demo">
          <div className="demo-window">
            <div className="demo-topbar">
              <span />
              <span />
              <span />
            </div>

            <div className="demo-content">
              <div className="demo-file">
                <div className="demo-file-icon">PDF</div>

                <div>
                  <strong>Machine Learning Notes</strong>
                  <p>Course Resource</p>
                </div>
              </div>

              <div className="demo-question">
                What is supervised learning?
              </div>

              <div className="demo-answer">
                <span className="ai-dot" />

                <p>
                  Supervised learning trains a model using labelled examples to
                  learn the relationship between inputs and expected outputs.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <span />
        </div>
      </section>

      <section className="features-section">
  <div className="features-heading">
    <p className="section-label">BUILT FOR MODERN LEARNING</p>

    <h2>
      More than just another
      <br />
      <span>course platform.</span>
    </h2>

    <p className="section-description">
      SkillShare Pro connects structured courses, instructor resources and
      AI-powered learning tools in one platform.
    </p>
  </div>

  <div className="features-grid">
    <div className="feature-card feature-large">
      <span className="feature-number">01</span>

      <div>
        <p className="feature-tag">AI LEARNING</p>
        <h3>Ask questions directly from course resources.</h3>
        <p>
          Select a PDF resource and use SkillShare AI to understand concepts,
          explanations and learning material.
        </p>
      </div>

      <div className="feature-orbit">
        <div className="orbit-circle orbit-one" />
        <div className="orbit-circle orbit-two" />
        <div className="orbit-core">AI</div>
      </div>
    </div>

    <div className="feature-card">
      <span className="feature-number">02</span>

      <div>
        <p className="feature-tag">FOR STUDENTS</p>
        <h3>Discover. Enroll. Learn.</h3>
        <p>
          Explore available courses, enroll instantly and access learning
          resources from instructors.
        </p>
      </div>
    </div>

    <div className="feature-card">
      <span className="feature-number">03</span>

      <div>
        <p className="feature-tag">FOR INSTRUCTORS</p>
        <h3>Teach without the clutter.</h3>
        <p>
          Create courses, upload PDF resources and manage learning content from
          your instructor dashboard.
        </p>
      </div>
    </div>
  </div>
</section>
<section className="process-section">
  <div className="process-heading">
    <p className="section-label">HOW IT WORKS</p>

    <h2>
      Start learning in
      <br />
      <span>four simple steps.</span>
    </h2>
  </div>

  <div className="process-container">
    <div className="process-line">
      <div className="process-line-glow" />
    </div>

    <div className="process-step">
      <div className="process-node">01</div>

      <div className="process-content">
        <p>CREATE ACCOUNT</p>
        <h3>Join SkillShare Pro.</h3>
        <span>
          Create your account and enter a platform built for focused learning.
        </span>
      </div>
    </div>

    <div className="process-step">
      <div className="process-node">02</div>

      <div className="process-content">
        <p>EXPLORE</p>
        <h3>Find your course.</h3>
        <span>
          Browse available courses and discover learning material that interests
          you.
        </span>
      </div>
    </div>

    <div className="process-step">
      <div className="process-node">03</div>

      <div className="process-content">
        <p>ENROLL</p>
        <h3>Access resources.</h3>
        <span>
          Enroll in a course and instantly access PDF resources shared by the
          instructor.
        </span>
      </div>
    </div>

    <div className="process-step">
      <div className="process-node">04</div>

      <div className="process-content">
        <p>ASK AI</p>
        <h3>Learn with context.</h3>
        <span>
          Select a course resource and ask SkillShare AI questions while you
          learn.
        </span>
      </div>
    </div>
  </div>
</section>
<section className="final-section">
  <div className="final-orbit final-orbit-one" />
  <div className="final-orbit final-orbit-two" />

  <div className="final-cta">
    <p className="section-label">START LEARNING</p>

    <h2>
      Your next course is
      <br />
      <span>one click away.</span>
    </h2>

    <p>
      Explore courses, learn from instructor resources and use AI to understand
      your learning material.
    </p>

    <div className="final-actions">
      <Link to="/courses" className="hero-primary-button">
        Explore Courses
      </Link>

      {!user && (
        <Link to="/register" className="hero-secondary-button">
          Create Account
        </Link>
      )}
    </div>
  </div>

  <div className="contact-section">
    <div className="contact-intro">
      <p className="section-label">CONTACT</p>

      <h3>
        Have a question?
        <br />
        <span>Let's talk.</span>
      </h3>

      <p>
        Questions about SkillShare Pro, courses or the platform? Send us a
        message.
      </p>
    </div>

    <div className="contact-card">
      <input type="text" placeholder="Your name" />
      <input type="email" placeholder="Your email" />

      <textarea
        placeholder="Your message"
        rows="5"
      />

      <button type="button">
        Send Message
      </button>
    </div>
  </div>

  <footer id="contact" className="home-footer">
    <div className="footer-brand">
      <h3>SkillShare Pro</h3>
      <p>Learn. Share. Grow.</p>
    </div>

    <div className="footer-links">
      <Link to="/">Home</Link>
      <Link to="/courses">Courses</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </div>

    <p className="footer-copy">
      © 2026 SkillShare Pro
    </p>
  </footer>
</section>
    </div>
  );
}