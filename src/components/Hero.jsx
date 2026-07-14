import React from 'react';

export default function Hero({ onViewChange, onMediaClick, isLoggedIn, mediaItems = [] }) {
  // SVG drawing of a cute bee
  const beeIcon = (
    <svg className="floating-element" style={{ width: '4rem', height: '4rem', bottom: '15%', left: '8%', color: 'var(--accent-color)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 1 3 3v2a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" />
      <path d="M9 7a5 5 0 0 0 6 0" />
      <path d="M12 12c-2.5 0-5 2-5 5.5s2.5 4.5 5 4.5 5-1 5-4.5S14.5 12 12 12Z" />
      <path d="M8 14.5c-.8.8-2 1-3 .5s-1.3-1.8-.8-2.8.8-2 2-2.5 2.2 0 2.2.8" />
      <path d="M16 14.5c.8.8 2 1 3 .5s1.3-1.8.8-2.8-.8-2-2-2.5-2.2 0-2.2.8" />
      <path d="M12 19v-4" />
    </svg>
  );

  // SVG drawing of a cute teddy bear
  const bearIcon = (
    <svg className="floating-element" style={{ width: '3.5rem', height: '3.5rem', top: '18%', left: '4%', color: 'var(--accent-color)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z" />
      <path d="M8 10a2.5 2.5 0 1 1-4-2c0-1.2 1-2 2-2a2.5 2.5 0 0 1 2 4Z" />
      <path d="M16 10a2.5 2.5 0 1 0 4-2c0-1.2-1-2-2-2a2.5 2.5 0 0 0-2 4Z" />
      <path d="M9.5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" />
      <path d="M14.5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" />
      <path d="M12 17a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
      <path d="M10.5 16.5c.8.5 2.2.5 3 0" />
    </svg>
  );

  // SVG drawing of a cute little bird
  const birdIcon = (
    <svg className="floating-element" style={{ width: '3.5rem', height: '3.5rem', top: '22%', right: '4%', color: 'var(--accent-color)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8A4.5 4.5 0 0 0 11.5 3.5C7.5 3.5 5 6 5 10c0 4 2.5 6.5 6.5 6.5A4.5 4.5 0 0 0 16 12V8Z" />
      <path d="M16 10h4l-3-3" />
      <path d="M7 14c-1 1-3 1.5-4 1a2 2 0 0 1 0-3.5" />
      <path d="M11 16.5V20M8 20h6" />
      <circle cx="10" cy="8.5" r="0.8" fill="currentColor" />
    </svg>
  );

  // SVG drawing of a rocking horse
  const rockingHorseIcon = (
    <svg className="floating-element" style={{ width: '4rem', height: '4rem', bottom: '10%', right: '12%', color: 'var(--accent-color)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 20c3-2 15-2 18 0" />
      <path d="M7 20v-5M17 20v-5" />
      <path d="M7 15h10v-3l-2-2H9L7 12v3Z" />
      <path d="M9 10V6l-3 1M18 10V5h-3" />
    </svg>
  );

  const starIcon = (
    <svg className="sparkle" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7.2-6.3-4.8-6.3 4.8 2.3-7.2-6-4.6h7.6z" />
    </svg>
  );

  // Play icon overlay for videos in the stack
  const playIcon = (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(255,255,255,0.85)',
      borderRadius: '50%',
      width: '2.5rem',
      height: '2.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      zIndex: 2,
      pointerEvents: 'none'
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '2px', color: 'var(--text-heading)' }}>
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    </div>
  );

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Get favorited items
  const favoriteItems = mediaItems.filter(item => item.isFavorite);

  // Fallback: If no photos are favorited, show the first 2 photos in mediaItems
  const itemsToDisplay = favoriteItems.length > 0 
    ? favoriteItems 
    : mediaItems.slice(0, 2);

  // Limit homepage stack to maximum 4 items
  const stackItems = itemsToDisplay.slice(0, 4);

  return (
    <section className="hero-section">
      {bearIcon}
      {beeIcon}
      {birdIcon}
      {rockingHorseIcon}

      {/* Floating sparkles */}
      <div className="sparkle-decorations">
        <div className="sparkle sparkle-1">{starIcon}</div>
        <div className="sparkle sparkle-2">{starIcon}</div>
        <div className="sparkle sparkle-3">{starIcon}</div>
        <div className="sparkle sparkle-4">{starIcon}</div>
      </div>

      <div className="hero-left">
        <span className="hero-sub">Lưu Giữ Trọn Vẹn Tuổi Thơ</span>
        <h1 className="hero-title">Kho Báu Kỷ Niệm Của Nguyễn Minh Khang</h1>
        <p className="hero-desc">
          Mỗi khoảnh khắc đều đánh dấu một cột mốc trong hành trình con đến với thế giới và lớn lên trong vòng tay của gia đình.
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={() => onViewChange('gallery')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.25rem' }}>
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            Khám Phá Album
          </button>
          {isLoggedIn && (
            <button className="btn btn-secondary" onClick={() => onViewChange('upload')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.25rem' }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
              Tải Ảnh Lên
            </button>
          )}
        </div>
      </div>

      <div className="hero-right">
        <div className="polaroid-stack">
          {stackItems.map((item, index) => {
            const wrapperClass = `polaroid-wrapper polaroid-wrapper-${index + 1}`;
            return (
              <div 
                key={item.id}
                className={wrapperClass}
                onClick={() => onMediaClick(item)}
                style={{ cursor: 'pointer' }}
              >
                <div className="polaroid">
                  <div className="polaroid-pin" />
                  <div className="polaroid-image-container">
                    <span className="media-badge">
                      {item.type === 'video' ? 'VIDEO' : 'ẢNH'}
                    </span>
                    {item.type === 'video' ? (
                      <>
                        <video 
                          src={item.url} 
                          className="polaroid-img" 
                          muted
                          preload="metadata"
                          playsInline
                        />
                        {playIcon}
                      </>
                    ) : (
                      <img 
                        src={item.url} 
                        alt={item.title} 
                        className="polaroid-img" 
                      />
                    )}
                  </div>
                  <div className="polaroid-caption">{item.title || 'Khoảnh khắc của bé'}</div>
                  <div className="polaroid-date">{formatDate(item.date)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
