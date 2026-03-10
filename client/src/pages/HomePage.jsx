import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-page">

      {/* ── Hero Section ── */}
      <section className="hero-section">
        <div className="hero-badge">
          <span className="hero-badge-dot"></span>
          AI-Powered Requirements Analysis
        </div>
        <h1 className="hero-title">
          Stop Shipping Software With
          <span className="hero-title-highlight"> Bad Requirements</span>
        </h1>
        <p className="hero-subtitle">
          ReqClarity AI automatically detects ambiguity, non-testability, and
          incompleteness in your SRS documents — then rewrites them using AI.
          Free, fast, and built for engineers.
        </p>

        {/* ── CTA Buttons ── */}
        <div className="hero-actions">
          <Link to="/upload" className="btn-hero-primary">
            Analyze My SRS <span className="btn-arrow">→</span>
          </Link>
          <a
            href="https://github.com/urzarai/ReqClarity_AI"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-hero-secondary"
          >
            View on GitHub
          </a>
        </div>

        <p className="hero-note">
          Free to use · No sign-up required · Supports PDF &amp; TXT
        </p>
      </section>

      {/* ── Stats Bar ── */}
      <section className="stats-bar">
        <div className="stat-item">
          <span className="stat-number">50–70%</span>
          <span className="stat-label">of software failures caused by poor requirements</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-number">3</span>
          <span className="stat-label">defect types detected automatically</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-number">&lt;30s</span>
          <span className="stat-label">to analyze 100 requirements</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-number">Free</span>
          <span className="stat-label">open source, no licensing costs</span>
        </div>
      </section>

      {/* ── Problem Section ── */}
      <section className="problem-section">
        <div className="section-label">The Problem</div>
        <h2 className="section-title">Requirements Are the Root Cause</h2>
        <p className="section-subtitle">
          Vague, untestable, and incomplete requirements silently destroy
          software projects — yet most teams still review them manually.
        </p>
        <div className="problem-cards">
          <div className="problem-card problem-ambiguity">
            <div className="problem-icon">🔀</div>
            <h3>Ambiguous</h3>
            <p>
              Words like <em>"fast"</em>, <em>"efficient"</em>, and{' '}
              <em>"user-friendly"</em> mean different things to different people.
            </p>
            <div className="problem-example">
              <span className="example-label">Example</span>
              <span className="example-bad">
                "The system shall respond quickly."
              </span>
            </div>
          </div>
          <div className="problem-card problem-testability">
            <div className="problem-icon">🧪</div>
            <h3>Non-Testable</h3>
            <p>
              Requirements without measurable criteria can never be verified —
              making testing impossible.
            </p>
            <div className="problem-example">
              <span className="example-label">Example</span>
              <span className="example-bad">
                "The UI should be intuitive and easy to use."
              </span>
            </div>
          </div>
          <div className="problem-card problem-incomplete">
            <div className="problem-icon">🧩</div>
            <h3>Incomplete</h3>
            <p>
              Missing actors, preconditions, or constraints leave developers
              guessing and cause rework.
            </p>
            <div className="problem-example">
              <span className="example-label">Example</span>
              <span className="example-bad">
                "Shall allow uploading files."
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="features-section">
        <div className="section-label">What We Do</div>
        <h2 className="section-title">A Smarter Way to Review Requirements</h2>
        <p className="section-subtitle">
          ReqClarity AI combines rule-based NLP detection with LLM-powered
          rewrites for maximum accuracy.
        </p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrap feature-icon-blue">
              <span>📄</span>
            </div>
            <h3>Upload Any SRS</h3>
            <p>
              Drag and drop your PDF or plain text SRS document. We extract and
              parse every requirement automatically.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrap feature-icon-amber">
              <span>🔍</span>
            </div>
            <h3>Instant Defect Detection</h3>
            <p>
              Our rule-based NLP engine scans for ambiguous words, weak modals,
              missing actors, and untestable terms in milliseconds.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrap feature-icon-indigo">
              <span>🤖</span>
            </div>
            <h3>AI-Powered Rewrites</h3>
            <p>
              Llama 3.3 generates context-aware rewrites for flagged requirements
              with clear explanations for every change.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrap feature-icon-green">
              <span>📊</span>
            </div>
            <h3>Quality Score &amp; Report</h3>
            <p>
              Get a 0–100 quality score, issue breakdown charts, and an
              exportable PDF report for your team.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrap feature-icon-cyan">
              <span>🔄</span>
            </div>
            <h3>Hybrid Detection Engine</h3>
            <p>
              Combines fast rule-based pattern matching with deep AI semantic
              understanding for higher precision and recall.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrap feature-icon-purple">
              <span>🕓</span>
            </div>
            <h3>Analysis History</h3>
            <p>
              Every analysis is saved locally. Revisit past reports, track
              improvement over document versions, and compare results.
            </p>
          </div>
        </div>
      </section>

      {/* ── How It Works Section ── */}
      <section className="how-section">
        <div className="section-label">How It Works</div>
        <h2 className="section-title">From Upload to Insights in Seconds</h2>
        <div className="steps-container">
          <div className="step-item">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Upload Your Document</h3>
              <p>
                Upload a PDF or TXT file of your SRS. ReqClarity extracts the
                text and splits it into individual requirements.
              </p>
            </div>
          </div>
          <div className="step-connector"></div>
          <div className="step-item">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Automated Detection</h3>
              <p>
                The rule-based NLP engine scans each requirement for ambiguity,
                non-testability, and incompleteness defects.
              </p>
            </div>
          </div>
          <div className="step-connector"></div>
          <div className="step-item">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>AI Generates Rewrites</h3>
              <p>
                For every flagged requirement, Llama 3.3 suggests a clearer,
                more precise rewrite with a full explanation.
              </p>
            </div>
          </div>
          <div className="step-connector"></div>
          <div className="step-item">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Review &amp; Export</h3>
              <p>
                Browse your quality score, accept or reject suggestions, and
                export a full PDF report for your project.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default HomePage;