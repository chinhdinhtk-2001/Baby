import React, { useState, useEffect } from 'react';

export default function MediaModal({ item, isOpen, onClose, onSave, startInEditMode = false, isLoggedIn }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [age, setAge] = useState('');
  const [category, setCategory] = useState('Khác');
  const [description, setDescription] = useState('');

  // Slide index for multi-image carousel
  const [activeSlide, setActiveSlide] = useState(0);

  // Sync state with selected item when it changes
  useEffect(() => {
    if (item) {
      setTitle(item.title || '');
      setDate(item.date || '');
      setAge(item.age || '');
      setCategory(item.category || 'Khác');
      setDescription(item.description || '');
      setIsEditing(startInEditMode && isLoggedIn);
      setActiveSlide(0); // Reset active slide to first image
    }
  }, [item, startInEditMode, isLoggedIn]);

  if (!isOpen || !item) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSave({
      ...item,
      title,
      date,
      age,
      category,
      description
    });
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const closeIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );

  const imagesList = item.urls && item.urls.length > 0 ? item.urls : [item.url];
  const hasMultipleImages = imagesList.length > 1;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Đóng">
          {closeIcon}
        </button>

        {/* Left Side: Media Pane (Giant Polaroid Card) */}
        <div className="modal-media-pane">
          <div className="modal-giant-polaroid">
            {/* Pink Sticky Tape */}
            <div className="polaroid-pin" style={{ width: '70px', height: '28px', top: '-14px', zIndex: 12, transform: 'translateX(-50%) rotate(-3deg)' }} />
            
            {/* Photo Container */}
            <div className="polaroid-image-container" style={{ width: '100%', paddingBottom: '86%', borderRadius: '2px' }}>
              {item.type === 'video' ? (
                <video 
                  src={item.url} 
                  controls 
                  autoPlay 
                  playsInline
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                <>
                  {/* Carousel Image */}
                  <img 
                    src={imagesList[activeSlide]} 
                    alt={`${item.title || 'Kỷ niệm'} - Ảnh ${activeSlide + 1}`} 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />

                  {/* Navigation Arrows */}
                  {hasMultipleImages && (
                    <>
                      <button 
                        type="button" 
                        className="carousel-arrow left"
                        onClick={() => setActiveSlide(prev => (prev === 0 ? imagesList.length - 1 : prev - 1))}
                        aria-label="Hình trước"
                      >
                        &lt;
                      </button>
                      
                      <button 
                        type="button" 
                        className="carousel-arrow right"
                        onClick={() => setActiveSlide(prev => (prev === imagesList.length - 1 ? 0 : prev + 1))}
                        aria-label="Hình sau"
                      >
                        &gt;
                      </button>

                      {/* Dot Indicators */}
                      <div className="carousel-dots">
                        {imagesList.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className={`carousel-dot ${idx === activeSlide ? 'active' : ''}`}
                            onClick={() => setActiveSlide(idx)}
                            aria-label={`Ảnh ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
            
            {/* Polaroid caption & date written inside the polaroid */}
            <div className="polaroid-caption" style={{ fontSize: '1.35rem', marginTop: '1.2rem', whiteSpace: 'normal', height: 'auto', padding: '0 0.5rem', textOverflow: 'unset', overflow: 'visible', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
              {item.title || 'Khoảnh khắc của bé'}
            </div>
            <div className="polaroid-date" style={{ fontSize: '0.82rem', marginTop: '0.4rem', fontWeight: '500' }}>
              {formatDate(item.date)} {item.age ? `• ${item.age}` : ''}
            </div>
          </div>
        </div>

        {/* Right Side: Details Pane */}
        <div className="modal-details-pane">
          {isEditing ? (
            <form className="edit-mode-form" onSubmit={handleSave}>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-heading)', marginBottom: '0.5rem' }}>
                Sửa Kỷ Niệm
              </h2>

              <div className="form-group">
                <label className="form-label">Tiêu đề</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  className="form-control"
                  required
                  maxLength={30}
                  placeholder="Nhập tiêu đề..."
                />
              </div>

              <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Ngày ghi nhận</label>
                  <input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Độ tuổi của bé</label>
                  <input 
                    type="text" 
                    value={age} 
                    onChange={(e) => setAge(e.target.value)} 
                    className="form-control"
                    placeholder="Ví dụ: 3 tháng tuổi"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phân loại</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  className="select-input"
                  style={{ width: '100%' }}
                >
                  <option value="Khác">Khác</option>
                  <option value="Sinh Hoạt">Sinh Hoạt (Ngủ, ăn, tắm...)</option>
                  <option value="Vui Chơi">Vui Chơi (Chơi đồ chơi, dã ngoại...)</option>
                  <option value="Cột Mốc Vàng">Cột Mốc Vàng (Lẫy, bò, đi, nói...)</option>
                  <option value="Gia Đình">Bên Gia Đình</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Lời kể / Nhật ký</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className="form-control"
                  rows="4"
                  maxLength={500}
                  placeholder="Viết một vài dòng nhật ký cho bé..."
                  style={{ resize: 'none' }}
                />
              </div>

              <div className="form-actions" style={{ marginTop: 'auto', gap: '0.5rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsEditing(false)}
                  style={{ padding: '0.5rem 1.25rem' }}
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ padding: '0.5rem 1.25rem' }}
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="modal-header">
                <h2 className="modal-title">{item.title || 'Khoảnh khắc đáng nhớ'}</h2>
                <div className="modal-meta-row" style={{ marginTop: '0.5rem' }}>
                  <span className="modal-meta-tag">{formatDate(item.date)}</span>
                  {item.age && <span className="modal-meta-tag">{item.age}</span>}
                  <span className="modal-meta-tag">{item.category || 'Khác'}</span>
                </div>
              </div>

              <div className="modal-body" style={{ flex: 1 }}>
                <p className="modal-desc">
                  {item.description || 'Không có mô tả cho bức ảnh này. Hãy thêm những ghi chú đáng yêu để lưu trữ kỷ niệm trọn vẹn hơn.'}
                </p>
              </div>

              {isLoggedIn && (
                <div className="form-actions" style={{ borderTop: '1px dashed var(--accent-light)', paddingTop: '1rem', marginTop: 'auto' }}>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => setIsEditing(true)}
                    style={{ padding: '0.5rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Chỉnh Sửa
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
