import React, { useState, useEffect } from 'react';
import './App.css';
import { supabase } from './supabaseClient';

// Import components
import Header from './components/Header';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import UploadForm from './components/UploadForm';
import Milestones from './components/Milestones';
import MediaModal from './components/MediaModal';

// Default seed assets if localStorage is empty
const DEFAULT_MEDIA_ITEMS = [
  {
    id: 'seed-1',
    title: 'Thiên thần say ngủ',
    url: '/seed-assets/baby_sleeping.png',
    urls: ['/seed-assets/baby_sleeping.png'],
    type: 'image',
    date: '2026-06-15',
    age: '1 tháng tuổi',
    category: 'Sinh Hoạt',
    description: 'Bé ngủ ngoan như một chú cún con bé bỏng. Khoảnh khắc bình yên nhất trong ngày của cả ba mẹ.',
    isFavorite: false
  },
  {
    id: 'seed-2',
    title: 'Chiếc giỏ ấm áp',
    url: '/seed-assets/baby_basket.png',
    urls: ['/seed-assets/baby_basket.png'],
    type: 'image',
    date: '2026-07-02',
    age: '2 tháng tuổi',
    category: 'Vui Chơi',
    description: 'Lần đầu tiên ba mẹ đưa bé đi chụp hình dã ngoại ngoài trời. Bé nằm ngoan ngoãn trong giỏ cói xinh xắn với những đóa hoa nhí rực rỡ.',
    isFavorite: false
  },
  {
    id: 'seed-3',
    title: 'Bé cười toe toét',
    url: '/seed-assets/baby_smiling.png',
    urls: ['/seed-assets/baby_smiling.png'],
    type: 'image',
    date: '2026-07-10',
    age: '2 tháng rưỡi',
    category: 'Sinh Hoạt',
    description: 'Nụ cười giòn giã nhất của bé khi ba mẹ trêu đùa. Mong con cả đời luôn giữ mãi nụ cười hồn nhiên này trên môi.',
    isFavorite: true
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [mediaItems, setMediaItems] = useState([]);
  const [milestonesState, setMilestonesState] = useState({});
  const [currentTheme, setCurrentTheme] = useState('cream');
  
  // Modal states
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalEditMode, setModalEditMode] = useState(false);
  
  // Custom delete confirmation states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState(null);

  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('baby_is_logged_in') === 'true');
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Sync login state to localStorage
  useEffect(() => {
    localStorage.setItem('baby_is_logged_in', isLoggedIn);
  }, [isLoggedIn]);

  // Redirect from upload view if not logged in
  useEffect(() => {
    if (!isLoggedIn && currentView === 'upload') {
      setCurrentView('home');
    }
  }, [isLoggedIn, currentView]);

  // 1. Initial State Loading
  useEffect(() => {
    const savedMedia = localStorage.getItem('baby_media_items');
    if (savedMedia) {
      try {
        const parsed = JSON.parse(savedMedia);
        // Ensure every item has a urls array of images
        const migrated = parsed.map(item => ({
          ...item,
          urls: item.urls || (item.url ? [item.url] : [])
        }));
        setMediaItems(migrated);
      } catch (e) {
        console.error("Error parsing media items from localStorage", e);
        setMediaItems(DEFAULT_MEDIA_ITEMS);
      }
    } else {
      setMediaItems(DEFAULT_MEDIA_ITEMS);
      localStorage.setItem('baby_media_items', JSON.stringify(DEFAULT_MEDIA_ITEMS));
    }

    const savedMilestones = localStorage.getItem('baby_milestones_state');
    if (savedMilestones) {
      try {
        setMilestonesState(JSON.parse(savedMilestones));
      } catch (e) {
        console.error("Error parsing milestones from localStorage", e);
        setMilestonesState({});
      }
    }

    const savedTheme = localStorage.getItem('baby_app_theme') || 'cream';
    setCurrentTheme(savedTheme);

    // Fetch remote state from Supabase
    const fetchRemoteDb = async () => {
      try {
        const { data, error } = await supabase
          .from('baby_journal_db')
          .select('db_state')
          .eq('id', 1)
          .single();

        if (error) {
          // If row doesn't exist, we insert the initial state
          if (error.code === 'PGRST116') {
            console.log("No remote database found. Creating initial database record...");
            const initialState = {
              mediaItems: DEFAULT_MEDIA_ITEMS,
              milestonesState: {}
            };
            const { error: insertError } = await supabase
              .from('baby_journal_db')
              .insert({ id: 1, db_state: initialState });
            if (insertError) {
              console.error("Failed to insert initial remote database:", insertError);
            } else {
              setMediaItems(DEFAULT_MEDIA_ITEMS);
              setMilestonesState({});
              localStorage.setItem('baby_media_items', JSON.stringify(DEFAULT_MEDIA_ITEMS));
              localStorage.setItem('baby_milestones_state', JSON.stringify({}));
            }
          } else {
            console.error("Error fetching database from Supabase:", error.message);
          }
          return;
        }

        if (data && data.db_state) {
          const remoteState = data.db_state;
          if (remoteState.mediaItems) {
            // Ensure every item has a urls array of images
            const migrated = remoteState.mediaItems.map(item => ({
              ...item,
              urls: item.urls || (item.url ? [item.url] : [])
            }));
            setMediaItems(migrated);
            localStorage.setItem('baby_media_items', JSON.stringify(migrated));
          }
          if (remoteState.milestonesState) {
            setMilestonesState(remoteState.milestonesState);
            localStorage.setItem('baby_milestones_state', JSON.stringify(remoteState.milestonesState));
          }
          console.log("Successfully synchronized database from Supabase!");
        }
      } catch (err) {
        console.error("Failed to load remote database from Supabase:", err);
      }
    };
    fetchRemoteDb();
  }, []);

  // 2. Sync Theme with HTML element attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('baby_app_theme', currentTheme);
  }, [currentTheme]);

  // 3. Local Storage Synchronizations & Cloudinary Sync
  const saveMediaToStorage = (items) => {
    localStorage.setItem('baby_media_items', JSON.stringify(items));
  };

  const saveMilestonesToStorage = (state) => {
    localStorage.setItem('baby_milestones_state', JSON.stringify(state));
  };

  const syncToSupabase = async (items, milestones) => {
    // Only logged in users (parents) can save changes to Supabase
    const isLoggedInUser = localStorage.getItem('baby_is_logged_in') === 'true';
    if (!isLoggedInUser) return;
    try {
      const dbState = {
        mediaItems: items,
        milestonesState: milestones
      };
      
      const { error } = await supabase
        .from('baby_journal_db')
        .upsert({ id: 1, db_state: dbState, updated_at: new Date().toISOString() });

      if (error) {
        console.error("Failed to sync database to Supabase:", error.message);
        throw new Error(`Đồng bộ dữ liệu thất bại: ${error.message}`);
      } else {
        console.log("Successfully synchronized database to Supabase!");
      }
    } catch (err) {
      console.error("Error during Supabase sync:", err);
      throw err;
    }
  };

  // 4. State Modification Callbacks
  const handleUpload = async (newItem) => {
    const updated = [newItem, ...mediaItems];
    setMediaItems(updated);
    saveMediaToStorage(updated);
    await syncToSupabase(updated, milestonesState);
  };

  const handleFavoriteToggle = (item, e) => {
    const updated = mediaItems.map(m => 
      m.id === item.id ? { ...m, isFavorite: !m.isFavorite } : m
    );
    setMediaItems(updated);
    saveMediaToStorage(updated);
    syncToSupabase(updated, milestonesState);

    // If modal is open displaying this item, update it
    if (selectedMedia && selectedMedia.id === item.id) {
      setSelectedMedia({ ...selectedMedia, isFavorite: !selectedMedia.isFavorite });
    }
  };

  const handleDelete = (item, e) => {
    setMediaToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const executeDelete = () => {
    if (!mediaToDelete) return;
    const item = mediaToDelete;
    const updated = mediaItems.filter(m => m.id !== item.id);
    setMediaItems(updated);
    saveMediaToStorage(updated);

    // Unlink from milestones
    const updatedMilestones = { ...milestonesState };
    let milestoneChanged = false;
    Object.keys(updatedMilestones).forEach(key => {
      if (updatedMilestones[key].mediaId === item.id) {
        updatedMilestones[key].mediaId = null;
        milestoneChanged = true;
      }
    });

    if (milestoneChanged) {
      setMilestonesState(updatedMilestones);
      saveMilestonesToStorage(updatedMilestones);
    }

    // Close modal if deleting the item currently in view
    if (selectedMedia && selectedMedia.id === item.id) {
      setIsModalOpen(false);
      setSelectedMedia(null);
    }

    setDeleteConfirmOpen(false);
    setMediaToDelete(null);
    syncToSupabase(updated, milestoneChanged ? updatedMilestones : milestonesState);
  };

  const handleEditClick = (item, e) => {
    setSelectedMedia(item);
    setModalEditMode(true);
    setIsModalOpen(true);
  };

  const handleCardClick = (item) => {
    setSelectedMedia(item);
    setModalEditMode(false);
    setIsModalOpen(true);
  };

  const handleSaveMediaDetails = (updatedItem) => {
    const updated = mediaItems.map(m => 
      m.id === updatedItem.id ? updatedItem : m
    );
    setMediaItems(updated);
    saveMediaToStorage(updated);
    
    // Update active modal item state
    setSelectedMedia(updatedItem);
    syncToSupabase(updated, milestonesState);
  };

  const handleMilestoneUpdate = (id, milestoneValue) => {
    const updated = {
      ...milestonesState,
      [id]: milestoneValue
    };
    setMilestonesState(updated);
    saveMilestonesToStorage(updated);
    syncToSupabase(mediaItems, updated);
  };

  return (
    <div className="app-container">
      
      {/* Decorative Blobs */}
      <div className="bg-decorations">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      {/* Header bar */}
      <Header 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
        isLoggedIn={isLoggedIn}
        onLogout={() => setIsLoggedIn(false)}
        onLoginClick={() => setLoginModalOpen(true)}
      />

      {/* Main Sections */}
      <main className="app-main">
        {currentView === 'home' && (
          <Hero 
            onViewChange={setCurrentView} 
            onMediaClick={handleCardClick}
            isLoggedIn={isLoggedIn}
            mediaItems={mediaItems.length > 0 ? mediaItems : DEFAULT_MEDIA_ITEMS}
          />
        )}

        {currentView === 'gallery' && (
          <Gallery 
            mediaItems={mediaItems}
            onMediaClick={handleCardClick}
            onFavoriteToggle={handleFavoriteToggle}
            onDeleteClick={handleDelete}
            onEditClick={handleEditClick}
            isLoggedIn={isLoggedIn}
          />
        )}

        {currentView === 'upload' && (
          <UploadForm 
            onUpload={handleUpload}
            onViewChange={setCurrentView}
          />
        )}

        {currentView === 'milestones' && (
          <Milestones 
            milestonesState={milestonesState}
            onMilestoneUpdate={handleMilestoneUpdate}
            isLoggedIn={isLoggedIn}
          />
        )}
      </main>

      {/* Lightbox Details Modal */}
      <MediaModal 
        item={selectedMedia}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedMedia(null); }}
        onSave={handleSaveMediaDetails}
        startInEditMode={modalEditMode}
        isLoggedIn={isLoggedIn}
      />

      {/* Custom Delete Confirmation Dialog */}
      {deleteConfirmOpen && mediaToDelete && (
        <div className="modal-backdrop confirm-dialog-backdrop" onClick={() => { setDeleteConfirmOpen(false); setMediaToDelete(null); }}>
          <div className="confirm-dialog-card" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-dialog-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3 className="confirm-dialog-title">Xóa Kỷ Niệm Này?</h3>
            <p className="confirm-dialog-desc">
              Bạn có chắc chắn muốn xóa bỏ kỷ niệm <strong>"{mediaToDelete.title}"</strong> khỏi cuốn nhật ký không?
              Hành động này sẽ xóa tệp vĩnh viễn và không thể hoàn tác.
            </p>
            <div className="confirm-dialog-actions">
              <button 
                type="button" 
                className="btn btn-secondary confirm-btn-cancel" 
                onClick={() => { setDeleteConfirmOpen(false); setMediaToDelete(null); }}
              >
                Hủy Bỏ
              </button>
              <button 
                type="button" 
                className="btn confirm-btn-delete" 
                onClick={executeDelete}
              >
                Xóa Vĩnh Viễn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal 
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={() => {
          setIsLoggedIn(true);
          setLoginModalOpen(false);
        }}
      />

    </div>
  );
}

// ── Login modal subcomponent ────────────────────────────────────────────────
function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Reset inputs when opened/closed
  useEffect(() => {
    if (isOpen) {
      setUsername('');
      setPassword('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (username === 'chinbon' && password === '14022001') {
      onLoginSuccess();
      setError('');
    } else {
      setError('Tên đăng nhập hoặc mật khẩu chưa chính xác rồi ba mẹ ơi! 🐻');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="confirm-dialog-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '380px', padding: '2rem' }}>
        <div className="confirm-dialog-icon" style={{ backgroundColor: 'rgba(250, 160, 160, 0.1)', color: 'var(--accent-color)' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '2rem', height: '2rem' }}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h3 className="confirm-dialog-title" style={{ margin: '1rem 0 0.5rem 0', fontFamily: 'var(--font-heading)' }}>Ba Mẹ Đăng Nhập</h3>
        <p className="confirm-dialog-desc" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Đăng nhập tài khoản để có quyền tải lên, chỉnh sửa và quản lý các kỷ niệm của bé yêu.
        </p>

        <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-heading)' }}>Tên đăng nhập:</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              className="login-modal-input"
              placeholder="Nhập tên đăng nhập..."
              required
              autoFocus
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-heading)' }}>Mật khẩu:</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="login-modal-input"
              placeholder="Nhập mật khẩu..."
              required
            />
          </div>

          {error && (
            <p style={{ fontSize: '0.8rem', color: '#ef4444', margin: 0, textAlign: 'left', lineHeight: '1.4' }}>
              {error}
            </p>
          )}

          <div className="confirm-dialog-actions" style={{ marginTop: '0.5rem', width: '100%' }}>
            <button 
              type="button" 
              className="login-modal-btn login-modal-btn-secondary" 
              onClick={onClose}
            >
              Hủy Bỏ
            </button>
            <button 
              type="submit" 
              className="login-modal-btn login-modal-btn-primary"
            >
              Đăng Nhập
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
