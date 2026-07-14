import React, { useState, useEffect } from 'react';

export default function MediaCard({ item, onCardClick, onFavoriteToggle, onDeleteClick, onEditClick, isLoggedIn }) {
  const [rotation, setRotation] = useState(0);

  // Set a subtle random rotation on load to make the polaroids look organic
  useEffect(() => {
    const randomAngle = (Math.random() * 8 - 4).toFixed(1); // Between -4deg and +4deg
    setRotation(parseFloat(randomAngle));
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const stopPropagation = (callback) => (e) => {
    e.stopPropagation();
    callback(item, e);
  };

  const heartIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );

  const editIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );

  const trashIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );

  const playIcon = (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(255,255,255,0.85)',
      borderRadius: '50%',
      width: '3rem',
      height: '3rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      zIndex: 2,
      pointerEvents: 'none'
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '3px', color: 'var(--text-heading)' }}>
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    </div>
  );

  const hasMultiple = item.urls && item.urls.length > 1;

  return (
    <div 
      className={`polaroid-wrapper ${hasMultiple ? 'multi-stack' : ''}`} 
      style={{ transform: `rotate(${rotation}deg)` }}
      onClick={() => onCardClick(item)}
    >
      {/* Decorative back polaroid 2 (if 3 or more images exist) */}
      {hasMultiple && item.urls.length >= 3 && (
        <div className="polaroid-bg polaroid-bg-2">
          {item.urls[2] && (
            <div className="polaroid-bg-inner">
              <img src={item.urls[2]} alt="" className="polaroid-bg-img-preview" />
            </div>
          )}
        </div>
      )}

      {/* Decorative back polaroid 1 */}
      {hasMultiple && (
        <div className="polaroid-bg polaroid-bg-1">
          {item.urls[1] && (
            <div className="polaroid-bg-inner">
              <img src={item.urls[1]} alt="" className="polaroid-bg-img-preview" />
            </div>
          )}
        </div>
      )}

      <div className="polaroid">
        <div className="polaroid-pin" />
        
        <div className="polaroid-image-container">
          <span className="media-badge">
            {item.type === 'video' ? 'VIDEO' : 'ẢNH'}
          </span>
          
          {item.type === 'video' ? (
            <>
              {/* Show a video preview or simple cover */}
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
              loading="lazy"
            />
          )}
        </div>

        <div className="polaroid-caption">{item.title || 'Khoảnh khắc của bé'}</div>
        <div className="polaroid-date">
          {formatDate(item.date)} {item.age ? `• ${item.age}` : ''}
        </div>

        {isLoggedIn && (
          <div className="polaroid-actions">
            <button 
              className={`action-btn fav-btn ${item.isFavorite ? 'active' : ''}`}
              onClick={stopPropagation(onFavoriteToggle)}
              title={item.isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}
              aria-label="Yêu thích"
            >
              {heartIcon}
            </button>
            
            <button 
              className="action-btn"
              onClick={stopPropagation(onEditClick)}
              title="Chỉnh sửa thông tin"
              aria-label="Chỉnh sửa"
            >
              {editIcon}
            </button>

            <button 
              className="action-btn"
              onClick={stopPropagation(onDeleteClick)}
              title="Xóa khỏi album"
              aria-label="Xóa"
            >
              {trashIcon}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
