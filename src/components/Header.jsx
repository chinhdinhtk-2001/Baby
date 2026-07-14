import React, { useState } from 'react';

export default function Header({ currentView, onViewChange, currentTheme, onThemeChange, isLoggedIn, onLogout, onLoginClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Cute pacifier/baby carriage SVG icon
  const babyIcon = (
    <svg className="logo-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="7" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 11v6M9 17h6M12 17a3 3 0 1 0 0 6 3 3 0 1 0 0-6z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="6" r="1" fill="currentColor" />
      <circle cx="14" cy="6" r="1" fill="currentColor" />
      <path d="M10 8.5c1 1 3 1 4 0" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );

  const handleNavClick = (view) => {
    onViewChange(view);
    setIsMenuOpen(false);
  };

  const hamburgerIcon = (
    <svg className={`hamburger-icon ${isMenuOpen ? 'open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" className="line-top" />
      <line x1="3" y1="12" x2="21" y2="12" className="line-mid" />
      <line x1="3" y1="18" x2="21" y2="18" className="line-bot" />
    </svg>
  );

  return (
    <header className="app-header">
      <a href="#home" className="header-logo" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>
        {babyIcon}
        <span className="logo-text">Nhật Ký Của Khang</span>
      </a>

      {/* Desktop view navigation */}
      <nav className="desktop-nav app-nav">
        <a 
          href="#home" 
          className={`nav-link ${currentView === 'home' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
        >
          Trang Chủ
        </a>
        <a 
          href="#gallery" 
          className={`nav-link ${currentView === 'gallery' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); handleNavClick('gallery'); }}
        >
          Bộ Sưu Tập
        </a>
        {isLoggedIn && (
          <a 
            href="#upload" 
            className={`nav-link ${currentView === 'upload' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleNavClick('upload'); }}
          >
            Đăng Tải
          </a>
        )}
        <a 
          href="#milestones" 
          className={`nav-link ${currentView === 'milestones' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); handleNavClick('milestones'); }}
        >
          Cột Mốc Vàng
        </a>
      </nav>

      {/* Controls: Theme buttons and Hamburger toggle */}
      <div className="header-controls">
        {/* Desktop Theme Selector (hidden on mobile in CSS) */}
        <div className="theme-selector desktop-theme-selector" title="Chọn tông màu giao diện">
          <button 
            className={`theme-btn cream ${currentTheme === 'cream' ? 'active' : ''}`}
            onClick={() => onThemeChange('cream')}
            aria-label="Tông kem ấm áp"
          />
          <button 
            className={`theme-btn pink ${currentTheme === 'pink' ? 'active' : ''}`}
            onClick={() => onThemeChange('pink')}
            aria-label="Tông hồng dễ thương"
          />
          <button 
            className={`theme-btn blue ${currentTheme === 'blue' ? 'active' : ''}`}
            onClick={() => onThemeChange('blue')}
            aria-label="Tông xanh dịu mát"
          />
          <button 
            className={`theme-btn purple ${currentTheme === 'purple' ? 'active' : ''}`}
            onClick={() => onThemeChange('purple')}
            aria-label="Tông tím oải hương"
          />
        </div>

        {/* Login/Logout Button on desktop */}
        {isLoggedIn ? (
          <div className="login-status-desktop">
            <span className="username-tag">chinbon</span>
            <button className="logout-btn" onClick={onLogout} title="Đăng xuất">
              Đăng xuất
            </button>
          </div>
        ) : (
          <button className="login-btn-header" onClick={onLoginClick} title="Đăng nhập làm ba mẹ">
            Đăng nhập
          </button>
        )}

        {/* Mobile Hamburger menu toggle button */}
        <button 
          className="menu-toggle-btn" 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          aria-label="Mở trình đơn" 
          aria-expanded={isMenuOpen}
        >
          {hamburgerIcon}
        </button>
      </div>

      {/* Mobile Drawer Menu Overlay */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsMenuOpen(false)}>
          <nav className="mobile-menu-drawer" onClick={(e) => e.stopPropagation()}>
            <a 
              href="#home" 
              className={`mobile-menu-link ${currentView === 'home' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
            >
              Trang Chủ
            </a>
            <a 
              href="#gallery" 
              className={`mobile-menu-link ${currentView === 'gallery' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleNavClick('gallery'); }}
            >
              Bộ Sưu Tập
            </a>
            {isLoggedIn && (
              <a 
                href="#upload" 
                className={`mobile-menu-link ${currentView === 'upload' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavClick('upload'); }}
              >
                Đăng Tải
              </a>
            )}
            <a 
              href="#milestones" 
              className={`mobile-menu-link ${currentView === 'milestones' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleNavClick('milestones'); }}
            >
              Cột Mốc Vàng
            </a>

            {/* Mobile login actions */}
            <div className="mobile-login-section" style={{ padding: '1rem 0', borderTop: '1px dashed var(--accent-light)', borderBottom: '1px dashed var(--accent-light)', margin: '1rem 0' }}>
              {isLoggedIn ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span className="mobile-username" style={{ fontSize: '0.9rem', color: 'var(--text-color)', fontWeight: 600 }}>Tài khoản: chinbon</span>
                  <button className="mobile-logout-btn btn btn-secondary" onClick={() => { onLogout(); setIsMenuOpen(false); }} style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <button className="mobile-login-btn btn btn-primary" onClick={() => { onLoginClick(); setIsMenuOpen(false); }} style={{ width: '100%', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  Đăng nhập làm ba mẹ
                </button>
              )}
            </div>

            {/* Mobile Theme Selector inside the drawer */}
            <div className="mobile-theme-section">
              <span className="theme-label">Tông màu giao diện</span>
              <div className="theme-selector mobile-theme-selector">
                <button 
                  className={`theme-btn cream ${currentTheme === 'cream' ? 'active' : ''}`}
                  onClick={() => onThemeChange('cream')}
                  aria-label="Tông kem ấm áp"
                />
                <button 
                  className={`theme-btn pink ${currentTheme === 'pink' ? 'active' : ''}`}
                  onClick={() => onThemeChange('pink')}
                  aria-label="Tông hồng dễ thương"
                />
                <button 
                  className={`theme-btn blue ${currentTheme === 'blue' ? 'active' : ''}`}
                  onClick={() => onThemeChange('blue')}
                  aria-label="Tông xanh dịu mát"
                />
                <button 
                  className={`theme-btn purple ${currentTheme === 'purple' ? 'active' : ''}`}
                  onClick={() => onThemeChange('purple')}
                  aria-label="Tông tím oải hương"
                />
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
