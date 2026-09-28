import React, { useState, useEffect, useRef } from 'react';
import './Home.css';

export default function Home() {
  // Main State: false = closed (100% visual artwork), true = open (split layout)
  const [loginOpen, setLoginOpen] = useState(false);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Eye Tracking & Face States
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });

  // Subtle Mouse Parallax Coordinates
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const visualSectionRef = useRef(null);
  const heroBubbleRef = useRef(null);

  // Global mouse tracker for eyes and parallax
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      // 1. Eye movement tracking towards cursor
      if (heroBubbleRef.current) {
        const bRect = heroBubbleRef.current.getBoundingClientRect();
        const bCenterX = bRect.left + bRect.width / 2;
        const bCenterY = bRect.top + bRect.height / 2;
        const dx = e.clientX - bCenterX;
        const dy = e.clientY - bCenterY;
        const dist = Math.hypot(dx, dy);

        // Max eye travel distance in pixels
        const maxLook = 14;
        const lookStrength = Math.min(maxLook, dist / 22);
        const angle = Math.atan2(dy, dx);
        const ex = Math.cos(angle) * lookStrength;
        const ey = Math.sin(angle) * lookStrength;

        setEyeOffset({ x: ex, y: ey });
      }

      // 2. Parallax background coordinates
      if (visualSectionRef.current) {
        const rect = visualSectionRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const normX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width / 2)));
        const normY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height / 2)));
        setMouseOffset({ x: normX, y: normY });
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  // Periodic natural blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 150);
    }, 4200);

    return () => clearInterval(blinkInterval);
  }, []);

  const handleOpenLogin = (e) => {
    e.stopPropagation();
    setLoginOpen(true);
  };

  const handleCloseLogin = (e) => {
    e?.stopPropagation();
    setLoginOpen(false);
    setLoginSuccess(false);
    setIsSubmitting(false);
    setIsPasswordFocused(false);
  };

  // Login button automatically closes the animation video/panel
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setLoginSuccess(true);

    // Automatically close the login panel cleanly and smoothly
    setTimeout(() => {
      setIsSubmitting(false);
      setLoginSuccess(false);
      setIsPasswordFocused(false);
      handleCloseLogin();
    }, 350);
  };

  // Keyboard accessibility: ESC closes the login panel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && loginOpen) {
        handleCloseLogin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loginOpen]);

  // Parallax offsets based on depth layers
  // Layer 1 (Background): 2px - 4px
  const bgTransform = `translate(${mouseOffset.x * 3}px, ${mouseOffset.y * 3}px)`;
  // Layer 2 (Middle): 5px - 8px
  const midTransform = `translate(${mouseOffset.x * 6.5}px, ${mouseOffset.y * 6.5}px)`;
  // Layer 3 (Foreground / Hero): 9px - 12px
  const foreTransform = `translate(${mouseOffset.x * 10}px, ${mouseOffset.y * 10}px)`;

  // Eyes & Mouth movement:
  // When typing/focusing password -> eyes move to the left side!
  // Otherwise -> eyes follow cursor wherever it moves
  const currentEyeX = isPasswordFocused ? -16 : eyeOffset.x;
  const currentEyeY = isPasswordFocused ? 1 : eyeOffset.y;
  const currentMouthX = isPasswordFocused ? -5 : eyeOffset.x * 0.32;
  const currentMouthY = isPasswordFocused ? 2 : eyeOffset.y * 0.32;

  return (
    <div className="page-canvas">
      {/* Ambient background blur blobs */}
      <div className="ambient-backdrop-blob blob-lavender" />
      <div className="ambient-backdrop-blob blob-sky" />
      <div className="ambient-backdrop-blob blob-blush" />

      {/* Main Split Layout Container */}
      <main className={`login-container ${loginOpen ? 'login-open' : ''}`}>
        
        {/* =================================================================
            1. VISUAL SECTION (100% when closed -> 68% when open)
            Contains original 3D collection of 16 decorative objects + Hero
            ================================================================= */}
        <section
          className="visual-section"
          ref={visualSectionRef}
          aria-label="3D Bubble Artwork"
        >
          {/* Subtle Ambient Vignette & Depth Glow */}
          <div className="visual-depth-overlay" />

          {/* -------------------------------------------------------------
              LAYER 1: BACKGROUND LAYER (Deep & Soft, Parallax 2-4px)
              ------------------------------------------------------------- */}
          <div className="parallax-layer layer-background" style={{ transform: bgTransform }}>
            {/* 1. Large Transparent Glass Sphere */}
            <div className="bubble-item item-glass-sphere-lg">
              <div className="bubble-float float-dur-8">
                <div className="bubble-rotate rotate-slow-reverse">
                  <div className="bubble-shape shape-glass-sphere" />
                </div>
              </div>
            </div>

            {/* 8a. Small Transparent Bubbles */}
            <div className="bubble-item item-tiny-bubble-1">
              <div className="bubble-float float-dur-5 float-del-1">
                <div className="bubble-shape shape-tiny-glass" />
              </div>
            </div>

            {/* 8b. Small Transparent Bubble 2 */}
            <div className="bubble-item item-tiny-bubble-2">
              <div className="bubble-float float-dur-6 float-del-2">
                <div className="bubble-shape shape-tiny-glass" />
              </div>
            </div>

            {/* 13. Small Glowing Orb */}
            <div className="bubble-item item-glowing-orb">
              <div className="bubble-float float-dur-7 float-del-3">
                <div className="bubble-shape shape-glowing-orb" />
              </div>
            </div>

            {/* 14. Thin Glass Ring */}
            <div className="bubble-item item-thin-glass-ring">
              <div className="bubble-float float-dur-9 float-del-1">
                <div className="bubble-rotate rotate-slow">
                  <div className="bubble-shape shape-glass-ring" />
                </div>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------
              LAYER 2: MIDDLE LAYER (Medium 3D Shapes, Parallax 5-8px)
              ------------------------------------------------------------- */}
          <div className="parallax-layer layer-middle" style={{ transform: midTransform }}>
            {/* 2. Purple Jelly Blob */}
            <div className="bubble-item item-purple-jelly">
              <div className="bubble-float float-dur-6 float-del-1">
                <div className="bubble-drift drift-dur-7">
                  <div className="bubble-shape shape-purple-jelly" />
                </div>
              </div>
            </div>
            

            {/* 3. Blue Liquid Sphere */}
            <div className="bubble-item item-blue-liquid">
              <div className="bubble-float float-dur-7 float-del-2">
                <div className="bubble-rotate rotate-slow">
                  <div className="bubble-shape shape-blue-liquid" />
                </div>
              </div>
            </div>

            {/* 4. Yellow Translucent Capsule */}
            <div className="bubble-item item-yellow-capsule">
              <div className="bubble-float float-dur-5 float-del-3">
                <div className="bubble-rotate rotate-tilt-slow">
                  <div className="bubble-shape shape-yellow-capsule" />
                </div>
              </div>
            </div>

            {/* 5. Pink Glass Bubble */}
            <div className="bubble-item item-pink-glass">
              <div className="bubble-float float-dur-6 float-del-4">
                <div className="bubble-shape shape-pink-glass" />
              </div>
            </div>

            {/* 7. 3D Rounded Rectangle (Left Side Top Corner) */}
            <div className="bubble-item item-rounded-crystal">
              <div className="bubble-float float-dur-8 float-del-2">
                <div className="bubble-rotate rotate-tilt-slow">
                  <div className="bubble-shape shape-crystal" />
                </div>
              </div>
            </div>

            
            

            {/* 9b. 3D Triangle Prism (From Reference Video) */}
            <div className="bubble-item item-3d-triangle">
              <div className="bubble-float float-dur-6 float-del-2">
                <div className="bubble-rotate rotate-tilt-slow">
                  <div className="bubble-shape shape-3d-triangle">
                    <svg className="triangle-3d-svg" viewBox="0 0 60 70" width="52" height="62" fill="none">
                      <defs>
                        <linearGradient id="triFacetLeft" x1="10%" y1="0%" x2="90%" y2="100%">
                          <stop offset="0%" stopColor="#93c5fd" />
                          <stop offset="45%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#1d4ed8" />
                        </linearGradient>
                        <linearGradient id="triFacetRight" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#2563eb" />
                          <stop offset="55%" stopColor="#1d4ed8" />
                          <stop offset="100%" stopColor="#172554" />
                        </linearGradient>
                        <linearGradient id="triHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                          <stop offset="100%" stopColor="rgba(255,255,255,0.15)" />
                        </linearGradient>
                      </defs>
                      {/* Left Light Facet */}
                      <path d="M30 6 L8 54 L30 62 Z" fill="url(#triFacetLeft)" />
                      {/* Right Shadow Facet */}
                      <path d="M30 6 L52 54 L30 62 Z" fill="url(#triFacetRight)" />
                      {/* Specular Ridge Line */}
                      <line x1="30" y1="6" x2="30" y2="62" stroke="url(#triHighlight)" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* 10. Floating Diamond */}
            <div className="bubble-item item-floating-diamond">
              <div className="bubble-float float-dur-6 float-del-3">
                <div className="bubble-rotate rotate-diamond">
                  <div className="bubble-shape shape-diamond" />
                </div>
              </div>
            </div>

            {/* 15. Small Capsule */}
            <div className="bubble-item item-small-capsule">
              <div className="bubble-float float-dur-4 float-del-2">
                <div className="bubble-rotate rotate-tilt-small">
                  <div className="bubble-shape shape-small-capsule" />
                </div>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------
              LAYER 3: FOREGROUND LAYER (Hero Bubble + Key Accents, Parallax 8-12px)
              ------------------------------------------------------------- */}
          <div className="parallax-layer layer-foreground" style={{ transform: foreTransform }}>
            {/* 6. Chrome Ring */}
            <div className="bubble-item item-chrome-ring">
              <div className="bubble-float float-dur-7">
                <div className="bubble-rotate rotate-tilt-ring">
                  <div className="bubble-shape shape-chrome-ring" />
                </div>
              </div>
            </div>

            {/* 11. Metallic Sphere */}
            <div className="bubble-item item-metallic-sphere">
              <div className="bubble-float float-dur-5 float-del-1">
                <div className="bubble-shape shape-metallic-sphere" />
              </div>
            </div>

            {/* 12. Irregular Organic Blob */}
            <div className="bubble-item item-organic-blob">
              <div className="bubble-float float-dur-8 float-del-3">
                <div className="bubble-shape shape-organic-blob" />
              </div>
            </div>

            {/* 16. ONE LARGE CENTRAL HERO BUBBLE (Original Soft Iridescent Hero Orb with Eyes and Mouth) */}
            <div className="bubble-item item-hero-bubble" ref={heroBubbleRef}>
              <div className="bubble-float float-hero">
                <div className="bubble-drift drift-hero">
                  <div className="bubble-shape shape-hero-bubble">
                    {/* 3D Specular Highlights and Glass Reflections */}
                    <div className="hero-specular-primary" />
                    <div className="hero-specular-secondary" />
                    <div className="hero-inner-caustic" />
                    <div className="hero-bottom-glow" />

                    {/* Cute Interactive Character Face inside Hero Bubble */}
                    <div className={`bubble-face ${isPasswordFocused ? 'password-mode' : ''} ${isBlinking ? 'blinking' : ''} ${loginSuccess ? 'happy-mode' : ''}`}>
                      <div
                        className="bubble-eyes-wrapper"
                        style={{
                          transform: `translate(${currentEyeX}px, ${currentEyeY}px)`,
                        }}
                      >
                        <div className="bubble-eye eye-left">
                          <div className="eye-pill">
                            <div className="eye-glint" />
                            <div className="eye-glint-sub" />
                          </div>
                        </div>
                        <div className="bubble-eye eye-right">
                          <div className="eye-pill">
                            <div className="eye-glint" />
                            <div className="eye-glint-sub" />
                          </div>
                        </div>
                      </div>

                      <div
                        className="bubble-mouth-wrapper"
                        style={{
                          transform: `translate(${currentMouthX}px, ${currentMouthY}px)`,
                        }}
                      >
                        {isPasswordFocused ? (
                          <div className="bubble-mouth-whistle" />
                        ) : loginSuccess ? (
                          <svg className="bubble-mouth-smile happy" width="30" height="18" viewBox="0 0 30 18" fill="none">
                            <path d="M4 3C8 14 22 14 26 3" stroke="#14131b" strokeWidth="4.5" strokeLinecap="round" />
                          </svg>
                        ) : (
                          <svg className="bubble-mouth-smile" width="28" height="15" viewBox="0 0 28 15" fill="none">
                            <path d="M4 4C7.5 12 20.5 12 24 4" stroke="#14131b" strokeWidth="4.2" strokeLinecap="round" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------
              LOGIN CTA TRIGGER (Clearly visible when closed)
              ------------------------------------------------------------- */}
          <div className="login-trigger-wrapper">
            <button
              type="button"
              className="login-trigger-btn"
              onClick={handleOpenLogin}
              aria-label="Open Login Form"
            >
              <span className="trigger-text">LOGIN</span>
             
            </button>
          
          </div>
        </section>

        {/* =================================================================
            2. LOGIN PANEL (0% when closed -> 32% when open)
            Animated split-layout transition with staggered content entrance
            ================================================================= */}
        <section
          className="login-section"
          aria-label="User Login"
          aria-hidden={!loginOpen}
        >
          {/* Close Button in Top-Right Corner */}
          <button
            type="button"
            className="login-close-btn"
            onClick={handleCloseLogin}
            aria-label="Close Login Panel"
            tabIndex={loginOpen ? 0 : -1}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Staggered Login Container */}
          <div className="login-content-stagger">
            
            
           

            

            {/* Step 3 & 4: Headings */}
            <div className="stagger-item stagger-heading">
              <h1 className="login-title">Welcome Back!</h1>
            </div>

            <div className="stagger-item stagger-subtitle">
              <p className="login-subtitle">Enter Your Details Below</p>
            </div>

            {/* Form */}
            <form className="login-form" onSubmit={handleFormSubmit}>
              
              {/* Step 5: Email Field */}
              <div className="stagger-item stagger-email input-field-block">
                <label htmlFor="user-email" className="field-label">Email</label>
                <div className="field-input-box">
                  <input
                    id="user-email"
                    type="email"
                    className="clean-text-input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsPasswordFocused(false)}
                    required
                    tabIndex={loginOpen ? 0 : -1}
                    autoComplete="email"
                  />
                  <div className="input-focus-line" />
                </div>
              </div>

              {/* Step 6: Password Field with Show/Hide Toggle */}
              <div className="stagger-item stagger-password input-field-block">
                <label htmlFor="user-password" className="field-label">Password</label>
                <div className="field-input-box password-box">
                  <input
                    id="user-password"
                    type={showPassword ? 'text' : 'password'}
                    className="clean-text-input password-input"
                    placeholder="•••••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setIsPasswordFocused(true);
                    }}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    required
                    tabIndex={loginOpen ? 0 : -1}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={loginOpen ? 0 : -1}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    )}
                  </button>
                  <div className="input-focus-line" />
                </div>
              </div>

              {/* Step 7: Remember Me & Forgot Password */}
              <div className="stagger-item stagger-options form-options-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    className="native-checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    tabIndex={loginOpen ? 0 : -1}
                  />
                  <span className="styled-checkbox">
                    <svg className="check-icon" viewBox="0 0 12 10">
                      <polyline points="1.5 5 4.5 8 10.5 2" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="checkbox-text">Remember me</span>
                </label>

                <a
                  href="#forgot"
                  className="forgot-link"
                  onClick={(e) => e.preventDefault()}
                  tabIndex={loginOpen ? 0 : -1}
                >
                  Forgot password?
                </a>
              </div>

              {/* Step 8: Login Buttons */}
              <div className="stagger-item stagger-button form-action-group">
                <button
                  type="submit"
                  className={`submit-login-btn ${isSubmitting ? 'loading' : ''} ${loginSuccess ? 'success' : ''}`}
                  disabled={isSubmitting}
                  tabIndex={loginOpen ? 0 : -1}
                >
                  {isSubmitting ? (
                    <span className="submit-spinner" />
                  ) : loginSuccess ? (
                    <span className="submit-success-text">✓ Signed In</span>
                  ) : (
                    'Log in'
                  )}
                </button>

                {/* Google Sign In */}
                <button
                  type="button"
                  className="google-auth-btn"
                  onClick={() => alert('Log in with Google')}
                  tabIndex={loginOpen ? 0 : -1}
                >
                  <svg className="google-svg" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.15C3.25 21.31 7.31 24 12 24z" />
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27 0-.78.13-1.55.38-2.27V6.58H1.27C.46 8.2 0 10.05 0 12s.46 3.8 1.27 5.42l4.01-3.15z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.69 1.27 6.58l4.01 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                  </svg>
                  <span>Log in with Google</span>
                </button>
              </div>

              {/* Sign Up Footer */}
              <div className="stagger-item stagger-footer signup-prompt">
                <span className="prompt-muted">Don't have an account?</span>
                <a
                  href="#signup"
                  className="prompt-signup-link"
                  onClick={(e) => e.preventDefault()}
                  tabIndex={loginOpen ? 0 : -1}
                >
                  Sign Up
                </a>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
