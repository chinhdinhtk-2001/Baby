import React, { useState, useEffect } from 'react';
import MediaCard from './MediaCard';

export default function Gallery({ mediaItems, onMediaClick, onFavoriteToggle, onDeleteClick, onEditClick, isLoggedIn }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tất Cả');
  const [sortBy, setSortBy] = useState('newest');
  
  // Date Range Search States
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18;

  // Reset pagination to page 1 when any search query, filter, sort, or date range changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeCategory, sortBy, startDate, endDate]);

  const categories = ['Tất Cả', 'Yêu Thích', 'Sinh Hoạt', 'Vui Chơi', 'Cột Mốc Vàng', 'Gia Đình', 'Khác'];

  // Filtering Logic
  const filteredItems = mediaItems
    .filter(item => {
      // 1. Search Query
      const matchesSearch = 
        item.title.toLowerCase().includes(search.toLowerCase()) || 
        (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
      
      // 2. Category Filter
      let matchesCategory = true;
      if (activeCategory === 'Yêu Thích') {
        matchesCategory = item.isFavorite;
      } else if (activeCategory !== 'Tất Cả') {
        matchesCategory = item.category === activeCategory;
      }

      // 3. Date Range Filter
      let matchesDate = true;
      if (startDate) {
        matchesDate = matchesDate && item.date >= startDate;
      }
      if (endDate) {
        matchesDate = matchesDate && item.date <= endDate;
      }

      return matchesSearch && matchesCategory && matchesDate;
    })
    .sort((a, b) => {
      // Sorting logic
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      
      if (sortBy === 'newest') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

  // Pagination calculation
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const searchIcon = (
    <svg className="search-icon" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );

  const cameraIcon = (
    <svg className="empty-icon" viewBox="0 0 24 24">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );

  const calendarIcon = (
    <svg className="calendar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );

  // Background float decorations (matching Hero page)
  const beeIcon = (
    <svg className="floating-element" style={{ width: '4rem', height: '4rem', bottom: '15%', left: '4%', color: 'var(--accent-color)', zIndex: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 1 3 3v2a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" />
      <path d="M9 7a5 5 0 0 0 6 0" />
      <path d="M12 12c-2.5 0-5 2-5 5.5s2.5 4.5 5 4.5 5-1 5-4.5S14.5 12 12 12Z" />
      <path d="M8 14.5c-.8.8-2 1-3 .5s-1.3-1.8-.8-2.8.8-2 2-2.5 2.2 0 2.2.8" />
      <path d="M16 14.5c.8.8 2 1 3 .5s-1.3-1.8-.8-2.8-.8-2-2-2.5-2.2 0-2.2.8" />
      <path d="M12 19v-4" />
    </svg>
  );

  const bearIcon = (
    <svg className="floating-element" style={{ width: '3.5rem', height: '3.5rem', top: '18%', left: '2%', color: 'var(--accent-color)', zIndex: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z" />
      <path d="M8 10a2.5 2.5 0 1 1-4-2c0-1.2 1-2 2-2a2.5 2.5 0 0 1 2 4Z" />
      <path d="M16 10a2.5 2.5 0 1 0 4-2c0-1.2-1-2-2-2a2.5 2.5 0 0 0-2 4Z" />
      <path d="M9.5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" />
      <path d="M14.5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" />
      <path d="M12 17a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
      <path d="M10.5 16.5c.8.5 2.2.5 3 0" />
    </svg>
  );

  const birdIcon = (
    <svg className="floating-element" style={{ width: '3.5rem', height: '3.5rem', top: '22%', right: '2%', color: 'var(--accent-color)', zIndex: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8A4.5 4.5 0 0 0 11.5 3.5C7.5 3.5 5 6 5 10c0 4 2.5 6.5 6.5 6.5A4.5 4.5 0 0 0 16 12V8Z" />
      <path d="M16 10h4l-3-3" />
      <path d="M7 14c-1 1-3 1.5-4 1a2 2 0 0 1 0-3.5" />
      <path d="M11 16.5V20M8 20h6" />
      <circle cx="10" cy="8.5" r="0.8" fill="currentColor" />
    </svg>
  );

  const rockingHorseIcon = (
    <svg className="floating-element" style={{ width: '4rem', height: '4rem', bottom: '10%', right: '4%', color: 'var(--accent-color)', zIndex: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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

  return (
    <section className="gallery-section" style={{ position: 'relative', overflow: 'hidden' }}>
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

      <div className="section-header" style={{ position: 'relative', zIndex: 2 }}>
        <h2 className="section-title">Cuốn Album Kỷ Niệm</h2>
        <p className="section-subtitle">
          Nơi lưu giữ từng nụ cười, bước chân và khoảnh khắc đáng yêu nhất của bé yêu được sắp xếp khoa học theo thời gian.
        </p>
      </div>

      {/* Toolbar Filter */}
      <div className="gallery-toolbar">
        
        {/* Categories Tabs */}
        <div className="toolbar-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="toolbar-controls">
          
          {/* Search box */}
          <div className="search-container">
            {searchIcon}
            <input 
              type="text" 
              placeholder="Tìm kiếm tiêu đề, nhật ký..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Date Range search picker */}
          <div className="date-range-container">
            {calendarIcon}
            <div className="date-input-wrapper">
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                className="date-picker-input"
                aria-label="Từ ngày"
                title="Từ ngày"
              />
              <span className="date-separator">đến</span>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                className="date-picker-input"
                aria-label="Đến ngày"
                title="Đến ngày"
              />
            </div>
            {(startDate || endDate) && (
              <button 
                type="button" 
                className="clear-dates-btn"
                onClick={() => { setStartDate(''); setEndDate(''); }}
                title="Xóa bộ lọc thời gian"
              >
                &times;
              </button>
            )}
          </div>

          {/* Sort selection */}
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="select-input"
            aria-label="Sắp xếp"
          >
            <option value="newest">Mới nhất trước</option>
            <option value="oldest">Cũ nhất trước</option>
          </select>

        </div>
      </div>

      {/* Polaroid Grid */}
      <div className="gallery-grid">
        {paginatedItems.length > 0 ? (
          paginatedItems.map(item => (
            <MediaCard 
              key={item.id}
              item={item}
              onCardClick={onMediaClick}
              onFavoriteToggle={onFavoriteToggle}
              onDeleteClick={onDeleteClick}
              onEditClick={onEditClick}
              isLoggedIn={isLoggedIn}
            />
          ))
        ) : (
          <div className="empty-state">
            {cameraIcon}
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-heading)' }}>
              Không tìm thấy kỷ niệm nào
            </h3>
            <p style={{ color: '#a8a29e', maxWidth: '350px' }}>
              Hãy thử thay đổi bộ lọc, từ khóa tìm kiếm hoặc đăng tải những khoảnh khắc mới của bé yêu ngay bây giờ nhé!
            </p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <button 
            type="button" 
            className="pagination-btn pagination-nav-btn" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            aria-label="Trang trước"
          >
            &lt;
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
            <button
              key={pageNum}
              type="button"
              className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
              onClick={() => setCurrentPage(pageNum)}
            >
              {pageNum}
            </button>
          ))}

          <button 
            type="button" 
            className="pagination-btn pagination-nav-btn" 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            aria-label="Trang sau"
          >
            &gt;
          </button>
        </div>
      )}
    </section>
  );
}
