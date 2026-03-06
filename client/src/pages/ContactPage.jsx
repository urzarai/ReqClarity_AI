import { useState } from 'react';
import './ContactPage.css';

const INITIAL_FORM = { name: '', email: '', subject: '', message: '' };

function ContactPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/contact`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setForm(INITIAL_FORM);
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg('Could not connect to the server. Please try again later.');
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">

        {/* ── Left Panel — Info ── */}
        <div className="contact-info">
          <div className="contact-info-badge">Get In Touch</div>
          <h1 className="contact-info-title">We'd Love to Hear From You</h1>
          <p className="contact-info-subtitle">
            Have a question about ReqClarity AI, found a bug, or want to
            collaborate? Send us a message and we'll get back to you.
          </p>

          <div className="contact-details">
            <div className="contact-detail-item">
              <div className="contact-detail-icon">🎓</div>
              <div>
                <h4>Academic Project</h4>
                <p>This tool is built as a capstone research project on automated SRS quality analysis.</p>
              </div>
            </div>
            <div className="contact-detail-item">
              <div className="contact-detail-icon">🐛</div>
              <div>
                <h4>Bug Reports</h4>
                <p>Found an issue? We appreciate detailed bug reports to help improve the tool.</p>
              </div>
            </div>
            <div className="contact-detail-item">
              <div className="contact-detail-icon">💡</div>
              <div>
                <h4>Feature Suggestions</h4>
                <p>Have an idea to make ReqClarity better? We're always open to suggestions.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Panel — Form ── */}
        <div className="contact-form-panel">
          <div className="contact-form-card">
            <h2 className="contact-form-title">Send a Message</h2>
            <p className="contact-form-subtitle">
              Fill out the form below and we'll respond as soon as possible.
            </p>

            {/* Success State */}
            {status === 'success' && (
              <div className="contact-alert contact-alert-success">
                <span className="alert-icon">✅</span>
                <div>
                  <strong>Message sent!</strong>
                  <p>Thanks for reaching out. Check your inbox for a confirmation email.</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {status === 'error' && (
              <div className="contact-alert contact-alert-error">
                <span className="alert-icon">❌</span>
                <div>
                  <strong>Failed to send</strong>
                  <p>{errorMsg}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Full Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-input"
                    placeholder="Enter your Full Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    disabled={status === 'loading'}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    placeholder="Enter your Email ID"
                    value={form.email}
                    onChange={handleChange}
                    required
                    disabled={status === 'loading'}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject" className="form-label">
                  Subject <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="form-input"
                  placeholder="e.g. Bug report, Feature request, General question"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  disabled={status === 'loading'}
                />
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">
                  Message <span className="required">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  className="form-input form-textarea"
                  placeholder="Write your message here..."
                  value={form.message}
                  onChange={handleChange}
                  rows={6}
                  required
                  disabled={status === 'loading'}
                />
              </div>

              <button
                type="submit"
                className="contact-submit-btn"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <>
                    <span className="spinner"></span>
                    Sending...
                  </>
                ) : (
                  'Send Message →'
                )}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ContactPage;