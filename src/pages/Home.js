import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Logo from "../assets/logo.png";
import "./Home.css";

const Home = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      quote:
        "CodeCollab cut our onboarding time in half. New hires can now pair program with seniors from day one.",
      author: "Sarah Johnson",
      title: "Engineering Lead, TechCorp",
      avatar: "👩‍💼",
    },
    {
      quote:
        "The real-time collaboration is seamless. We've reduced merge conflicts by 80% since switching.",
      author: "Mike Chen",
      title: "Senior Developer, StartupXYZ",
      avatar: "👨‍💻",
    },
    {
      quote:
        "Remote code reviews have never been easier. The mobile support means I can review PRs anywhere.",
      author: "Emily Rodriguez",
      title: "CTO, InnovateLab",
      avatar: "👩‍💻",
    },
  ];

  const features = [
    {
      icon: "⚡",
      title: "Real-time Collaboration",
      description:
        "See teammates' cursors and edits instantly with our low-latency sync technology.",
      color: "#FFD700",
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      description:
        "End-to-end encrypted rooms with permission controls for sensitive projects.",
      color: "#32CD32",
    },
    {
      icon: "💻",
      title: "Multi-language Support",
      description:
        "Supports 50+ languages with syntax highlighting and intelligent autocomplete.",
      color: "#FF6B6B",
    },
    {
      icon: "🤝",
      title: "Team Management",
      description:
        "Invite team members, assign roles, and track changes with version history.",
      color: "#4ECDC4",
    },
    {
      icon: "📱",
      title: "Mobile Friendly (Soon)",
      description:
        "Review code and make quick edits even when you're away from your desk.",
      color: "#45B7D1",
    },
    {
      icon: "🔔",
      title: "Smart Notifications (Soon)",
      description: "Get alerts for mentions, comments, and merge requests.",
      color: "#96CEB4",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container">
      {/* Animated background */}
      <div className="animated-bg">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
      </div>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="logo-container">
            <img
              src={Logo}
              alt="Collaborative Code Editor Logo"
              className="logo"
            />
            <span className="logo-text">CodeCollab</span>
          </div>

          <div className="hero-text">
            <h1 className="hero-title">
              <span className="gradient-text">Real-time</span> Collaborative
              Coding
              <div className="title-underline"></div>
            </h1>
            <p className="hero-subtitle">
              Build, debug, and deploy together with your team in our
              feature-rich coding environment. Experience the future of
              collaborative development.
            </p>
          </div>

          <div className="stats-bar">
            <div className="stat">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Active Developers</span>
            </div>
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Companies</span>
            </div>
            <div className="stat">
              <span className="stat-number">99.9%</span>
              <span className="stat-label">Uptime</span>
            </div>
          </div>

          <div className="cta-buttons">
            {currentUser ? (
              <>
                <button
                  className="cta-button primary"
                  onClick={() => navigate("/dashboard")}
                >
                  <span className="button-content">
                    <span className="button-icon">🚀</span>
                    Go to Dashboard
                  </span>
                </button>
                <button
                  className="cta-button secondary"
                  onClick={() => navigate("/logout")}
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <button
                  className="cta-button primary"
                  onClick={() => navigate("/signup")}
                >
                  <span className="button-content">
                    <span className="button-icon">✨</span>
                    Get Started Free
                  </span>
                </button>
                <button
                  className="cta-button secondary"
                  onClick={() => navigate("/login")}
                >
                  Log In
                </button>
                <button
                  className="cta-button outline"
                  onClick={() => navigate("/join-room")}
                >
                  <span className="button-content">
                    <span className="button-icon">👀</span>
                    Try as Guest
                  </span>
                </button>
              </>
            )}
          </div>
        </div>

        <div className="hero-image">
          <div className="code-editor-mockup">
            <div className="editor-header">
              <div className="window-controls">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <div className="file-tabs">
                <div className="file-tab active">index.js</div>
                <div className="file-tab">styles.css</div>
                <div className="file-tab">package.json</div>
                <div className="file-tab add-tab">+</div>
              </div>
            </div>
            <div className="editor-content">
              <div className="line-numbers">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
                <span>8</span>
                <span>9</span>
              </div>
              <pre className="code-content">{`// Welcome to CodeCollab!
function greetTeam() {
  console.log("Happy coding!");
  
  // Multiple cursors visible
  // when collaborating
  
  return "Build amazing things together";
}`}</pre>
              <div className="collaborator-cursors">
                <div
                  className="cursor user-1"
                  style={{ top: "40px", left: "180px" }}
                >
                  <span className="user-avatar">👩‍💻</span>
                  <span className="cursor-line"></span>
                  <span className="user-name">Sarah</span>
                </div>
                <div
                  className="cursor user-2"
                  style={{ top: "80px", left: "220px" }}
                >
                  <span className="user-avatar">👨‍💻</span>
                  <span className="cursor-line"></span>
                  <span className="user-name">Mike</span>
                </div>
              </div>
              <div className="typing-indicator">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Development Disclaimer */}{" "}
      <div className="dev-disclaimer">
        {" "}
        <p>
          {" "}
          <span className="disclaimer-icon">⚠️</span>{" "}
          <strong>Development Notice:</strong> All statistics, testimonials, and
          company references on this page are fictional and used for
          development/demo purposes only.{" "}
        </p>{" "}
      </div>
      {/* Features Section */}
      <div className="features-section">
        <div className="section-header">
          <h2 className="section-title">Why developers love CodeCollab</h2>
          <p className="section-subtitle">
            Powerful features designed for modern development teams
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card"
              style={{ "--accent-color": feature.color }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <div className="card-hover-effect"></div>
            </div>
          ))}
        </div>
      </div>
      {/* Testimonials Section */}
      <div className="testimonials-section">
        <h2 className="section-title">Trusted by developers at</h2>
        <div className="company-logos">
          <div className="company-logo">Google</div>
          <div className="company-logo">Microsoft</div>
          <div className="company-logo">Amazon</div>
          <div className="company-logo">Netflix</div>
          <div className="company-logo">Spotify</div>
        </div>

        <div className="testimonials-carousel">
          <div className="testimonial-container">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`testimonial ${
                  index === currentTestimonial ? "active" : ""
                }`}
              >
                <div className="quote-icon">"</div>
                <div className="quote">{testimonial.quote}</div>
                <div className="author">
                  <div className="avatar">{testimonial.avatar}</div>
                  <div className="info">
                    <div className="name">{testimonial.author}</div>
                    <div className="title">{testimonial.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="testimonial-indicators">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`indicator ${
                  index === currentTestimonial ? "active" : ""
                }`}
                onClick={() => setCurrentTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Final CTA */}
      <div className="final-cta">
        <div className="cta-content">
          <h2>Ready to transform how your team codes?</h2>
          <p>
            Join thousands of developers already collaborating on CodeCollab
          </p>
          <button
            className="cta-button primary large"
            onClick={() => navigate(currentUser ? "/dashboard" : "/signup")}
          >
            <span className="button-content">
              <span className="button-icon">👨‍💻</span>
              {currentUser ? "Open Dashboard" : "Start Coding Now"}
            </span>
          </button>
        </div>
        <div className="cta-decoration">
          <div className="decoration-circle"></div>
          <div className="decoration-line"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
