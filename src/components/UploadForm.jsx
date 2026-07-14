import React, { useState, useRef } from 'react';
import { supabase } from '../supabaseClient';

export default function UploadForm({ onUpload, onViewChange }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10)); // default today
  const [age, setAge] = useState('');
  const [category, setCategory] = useState('Sinh Hoạt');
  const [description, setDescription] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Multiple Images & Interactive Cropper States
  const [selectedImages, setSelectedImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Active crop editing states (linked to selectedImages[activeIndex])
  const [rawImgUrl, setRawImgUrl] = useState('');
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [initWidth, setInitWidth] = useState(0);
  const [initHeight, setInitHeight] = useState(0);

  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const processFiles = async (filesList) => {
    if (!filesList || filesList.length === 0) return;

    setErrorMessage('');
    setIsCompiling(true);

    const files = Array.from(filesList).filter(f => f.type.startsWith('image/'));
    if (files.length === 0) {
      setErrorMessage('Vui lòng chỉ chọn các tệp hình ảnh (PNG, JPG, WebP...).');
      setIsCompiling(false);
      return;
    }

    const newImages = [];
    const containerWidth = 350;
    const containerHeight = 300;
    const containerRatio = containerWidth / containerHeight;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (file.size > 20 * 1024 * 1024) {
          throw new Error(`Ảnh "${file.name}" vượt quá kích thước giới hạn 20MB.`);
        }

        const rawUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(file);
        });

        const cropData = await new Promise((resolve) => {
          const img = new Image();
          img.src = rawUrl;
          img.onload = () => {
            const imgRatio = img.width / img.height;
            let w, h, x, y;
            if (imgRatio > containerRatio) {
              // Landscape
              h = containerHeight;
              w = containerHeight * imgRatio;
              x = (containerWidth - w) / 2;
              y = 0;
            } else {
              // Portrait
              w = containerWidth;
              h = containerWidth / imgRatio;
              x = 0;
              y = (containerHeight - h) / 2;
            }
            resolve({ w, h, x, y });
          };
        });

        newImages.push({
          id: `img-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 5)}`,
          file,
          rawUrl,
          zoom: 1,
          offset: { x: cropData.x, y: cropData.y },
          initWidth: cropData.w,
          initHeight: cropData.h
        });
      }

      // Add to existing selected images list
      const updatedList = [...selectedImages, ...newImages];
      setSelectedImages(updatedList);

      // Set the first newly added image as active if none was active before
      const nextActiveIndex = selectedImages.length > 0 ? activeIndex : 0;
      setActiveIndex(nextActiveIndex);
      
      const activeImg = updatedList[nextActiveIndex];
      setRawImgUrl(activeImg.rawUrl);
      setInitWidth(activeImg.initWidth);
      setInitHeight(activeImg.initHeight);
      setOffset(activeImg.offset);
      setZoom(activeImg.zoom);

      // Auto-extract first file's name as title if blank
      if (!title && files[0]) {
        const nameWithoutExt = files[0].name.substring(0, files[0].name.lastIndexOf('.')) || files[0].name;
        setTitle(nameWithoutExt.substring(0, 30)); // Truncate filename to 30 characters to prevent layout break
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Lỗi xử lý file.');
    } finally {
      setIsCompiling(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const switchActiveImage = (newIndex) => {
    // 1. Save current active cropper state to list
    const updated = [...selectedImages];
    if (updated[activeIndex]) {
      updated[activeIndex] = {
        ...updated[activeIndex],
        zoom,
        offset
      };
      setSelectedImages(updated);
    }

    // 2. Load crop state of the new active target
    const target = updated[newIndex];
    if (target) {
      setRawImgUrl(target.rawUrl);
      setInitWidth(target.initWidth);
      setInitHeight(target.initHeight);
      setOffset(target.offset);
      setZoom(target.zoom);
      setActiveIndex(newIndex);
    }
  };

  const removeSelectedImage = (indexToRemove, e) => {
    e.stopPropagation();
    const updated = selectedImages.filter((_, idx) => idx !== indexToRemove);
    
    if (updated.length === 0) {
      setSelectedImages([]);
      setRawImgUrl('');
      setTitle('');
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      return;
    }

    let nextActiveIndex = activeIndex;
    if (activeIndex >= updated.length) {
      nextActiveIndex = updated.length - 1;
    }

    setSelectedImages(updated);
    
    const target = updated[nextActiveIndex];
    setRawImgUrl(target.rawUrl);
    setInitWidth(target.initWidth);
    setInitHeight(target.initHeight);
    setOffset(target.offset);
    setZoom(target.zoom);
    setActiveIndex(nextActiveIndex);
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setOffset({ x: newX, y: newY });

    // Sync to list in real-time
    setSelectedImages(prev => {
      const updated = [...prev];
      if (updated[activeIndex]) {
        updated[activeIndex].offset = { x: newX, y: newY };
      }
      return updated;
    });
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleZoomChange = (newZoom) => {
    const prevZoom = zoom;
    const currentW = initWidth * prevZoom;
    const currentH = initHeight * prevZoom;
    
    const newW = initWidth * newZoom;
    const newH = initHeight * newZoom;
    
    // Zoom from center
    const centerX = offset.x + currentW / 2;
    const centerY = offset.y + currentH / 2;
    
    const newX = centerX - newW / 2;
    const newY = centerY - newH / 2;
    
    setZoom(newZoom);
    setOffset({ x: newX, y: newY });

    // Sync to list in real-time
    setSelectedImages(prev => {
      const updated = [...prev];
      if (updated[activeIndex]) {
        updated[activeIndex].zoom = newZoom;
        updated[activeIndex].offset = { x: newX, y: newY };
      }
      return updated;
    });
  };

  const getCroppedImgBase64 = (imageObj) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = imageObj.rawUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 700;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, 700, 600);
        
        const scaleFactor = 2; // container size W:350 H:300 is 1/2 of canvas
        const finalX = imageObj.offset.x * scaleFactor;
        const finalY = imageObj.offset.y * scaleFactor;
        const finalW = imageObj.initWidth * imageObj.zoom * scaleFactor;
        const finalH = imageObj.initHeight * imageObj.zoom * scaleFactor;
        
        ctx.drawImage(img, finalX, finalY, finalW, finalH);
        
        const base64 = canvas.toDataURL('image/jpeg', 0.85);
        resolve(base64);
      };
    });
  };

  const base64ToBlob = (base64Data) => {
    const arr = base64Data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const uploadToSupabaseStorage = async (base64Data) => {
    const blob = base64ToBlob(base64Data);
    
    // Generate a unique file name
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.jpg`;
    const filePath = `photos/${fileName}`;

    const { data, error } = await supabase.storage
      .from('baby-journal')
      .upload(filePath, blob, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new Error(error.message);
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('baby-journal')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedImages.length === 0) {
      setErrorMessage('Vui lòng chọn ít nhất một hình ảnh để tải lên.');
      return;
    }

    setIsUploading(true);
    setErrorMessage('');

    try {
      // 1. Generate cropped base64 representations for all selected images
      const croppedBase64s = [];
      for (let i = 0; i < selectedImages.length; i++) {
        const cropped = await getCroppedImgBase64(selectedImages[i]);
        croppedBase64s.push(cropped);
      }

      // 2. Upload all images to Supabase Storage in parallel
      const cloudUrls = await Promise.all(
        croppedBase64s.map(base64 => uploadToSupabaseStorage(base64))
      );

      // 3. Prepare new item record
      const newItem = {
        id: 'media-' + Date.now(),
        title: title || 'Khoảnh khắc đáng yêu',
        url: cloudUrls[0], // primary display image
        urls: cloudUrls,    // all images list
        type: 'image',
        date,
        age: age || undefined,
        category,
        description,
        isFavorite: false
      };

      // 4. Save to local storage registry
      await onUpload(newItem);
      
      // 5. Reset Form
      setTitle('');
      setDate(new Date().toISOString().substring(0, 10));
      setAge('');
      setCategory('Sinh Hoạt');
      setDescription('');
      setSelectedImages([]);
      setRawImgUrl('');
      setActiveIndex(0);
      
      // 6. Redirect to Gallery
      onViewChange('gallery');
    } catch (err) {
      console.error(err);
      setErrorMessage(`Lỗi tải lên: ${err.message}. Vui lòng kiểm tra lại kết nối mạng hoặc cấu hình Supabase (URL, API Key, và tạo Public Storage Bucket tên là 'baby-journal').`);
    } finally {
      setIsUploading(false);
    }
  };

  const cloudIcon = (
    <svg className="drop-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 13V21M12 13L9 16M12 13L15 16" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20.38 12.04A6 6 0 0 0 19 2H18a6.5 6.5 0 0 0-6.19 4.54A6 6 0 0 0 5 11.23A4.2 4.2 0 0 0 5.4 19.5h14.2a4.2 4.2 0 0 0 .78-7.46Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const isDisabled = isCompiling || isUploading;

  return (
    <section className="upload-section">
      <div className="section-header">
        <h2 className="section-title">Đăng Tải Kỷ Niệm</h2>
        <p className="section-subtitle">
          Tải một hoặc nhiều hình ảnh cùng lúc để lưu giữ trọn vẹn kỷ niệm của bé yêu trên đám mây.
        </p>
      </div>

      <div className="upload-card">
        <form className="upload-form" onSubmit={handleSubmit}>
          {errorMessage && (
            <div style={{
              backgroundColor: '#FEF2F2',
              color: '#DC2626',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              border: '1px solid #FEE2E2',
              fontFamily: 'var(--font-sub)',
              lineHeight: '1.4'
            }}>
              {errorMessage}
            </div>
          )}

          {/* Cloud Drag Zone */}
          <div 
            className={`drop-zone ${isDragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{ pointerEvents: selectedImages.length > 0 ? 'none' : 'auto' }}
          >
            {isUploading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem', pointerEvents: 'none' }}>
                <div className="logo-icon" style={{ width: '3rem', height: '3rem', border: '3px solid var(--accent-light)', borderTopColor: 'var(--accent-color)', borderRadius: '50%', animation: 'float-blob 1.2s infinite linear' }} />
                <p className="drop-text" style={{ fontWeight: '600', color: 'var(--accent-dark)' }}>Đang đăng tải các ảnh lên đám mây Cloudinary...</p>
                <p className="drop-subtext">Quá trình này có thể mất vài giây tùy vào số lượng hình ảnh.</p>
              </div>
            ) : isCompiling ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem', pointerEvents: 'none' }}>
                <div className="logo-icon" style={{ width: '3rem', height: '3rem', border: '3px solid var(--accent-light)', borderTopColor: 'var(--accent-color)', borderRadius: '50%', animation: 'float-blob 1.5s infinite linear' }} />
                <p className="drop-text">Đang xử lý hình ảnh...</p>
              </div>
            ) : selectedImages.length > 0 ? (
              <div className="crop-adjust-section" onClick={(e) => e.stopPropagation()} style={{ pointerEvents: 'auto', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <p className="crop-instructions" style={{ margin: '0 0 0.75rem 0', fontFamily: 'var(--font-sub)', fontSize: '0.9rem', color: 'var(--text-heading)', fontWeight: '500' }}>
                  👉 Nhấp & kéo ảnh khớp khung. Chọn các ảnh bên dưới để chỉnh lần lượt.
                </p>
                
                {/* Active Cropper Viewport */}
                <div 
                  className="crop-frame"
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  style={{ 
                    touchAction: 'none',
                    position: 'relative',
                    overflow: 'hidden',
                    width: '350px',
                    height: '300px',
                    borderRadius: '16px',
                    border: '2px solid var(--accent-light)',
                    backgroundColor: '#f5f5f4',
                    cursor: isDragging ? 'grabbing' : 'grab',
                    boxShadow: '0 8px 16px var(--shadow-color)'
                  }}
                >
                  {rawImgUrl && (
                    <img 
                      src={rawImgUrl} 
                      alt="Crop Adjust" 
                      draggable="false"
                      style={{
                        position: 'absolute',
                        left: `${offset.x}px`,
                        top: `${offset.y}px`,
                        width: `${initWidth * zoom}px`,
                        height: `${initHeight * zoom}px`,
                        userSelect: 'none',
                        pointerEvents: 'none',
                        maxWidth: 'none',
                        maxHeight: 'none'
                      }}
                    />
                  )}
                </div>

                {/* Zoom Controller */}
                <div className="zoom-slider-container" style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '350px', gap: '0.75rem', margin: '1.25rem 0 1rem 0' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-color)', fontFamily: 'var(--font-sub)' }}>Thu nhỏ</span>
                  <input 
                    type="range" 
                    min="1" 
                    max="3.5" 
                    step="0.01" 
                    value={zoom} 
                    onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                    className="zoom-slider"
                    style={{ flex: 1, accentColor: 'var(--accent-color)', height: '6px', borderRadius: '3px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-color)', fontFamily: 'var(--font-sub)' }}>Phóng to</span>
                </div>

                {/* Thumbnails list switcher */}
                <div className="cropper-thumbnails-list">
                  {selectedImages.map((img, idx) => (
                    <div 
                      key={img.id}
                      className={`cropper-thumb-wrapper ${idx === activeIndex ? 'active' : ''}`}
                      onClick={() => switchActiveImage(idx)}
                    >
                      <img src={img.rawUrl} alt={`Thumb ${idx + 1}`} />
                      <button 
                        type="button" 
                        className="thumb-remove-btn" 
                        onClick={(e) => removeSelectedImage(idx, e)}
                        title="Xóa ảnh này"
                        disabled={isDisabled}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                  
                  {/* Add more images button */}
                  <label className="cropper-add-more-btn" title="Thêm hình ảnh khác">
                    <input 
                      type="file" 
                      onChange={handleChange}
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                      disabled={isDisabled}
                    />
                    <span>+</span>
                  </label>
                </div>

              </div>
            ) : (
              <>
                <input 
                  type="file" 
                  className="file-input" 
                  ref={fileInputRef}
                  onChange={handleChange}
                  accept="image/*"
                  multiple
                />
                {cloudIcon}
                <p className="drop-text">Kéo & thả một hoặc nhiều hình ảnh vào đây</p>
                <p className="drop-subtext">hoặc nhấn để chọn hình ảnh từ thiết bị</p>
                <p className="drop-subtext" style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--accent-dark)' }}>
                  * Các tệp ảnh sẽ được lưu trữ trực tuyến và bảo mật 100% trên Cloudinary.
                </p>
              </>
            )}
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Tên kỷ niệm / Tiêu đề</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="form-control"
                placeholder="Ví dụ: Lễ đầy tháng của bé, Buổi chiều đi công viên..."
                required
                maxLength={30}
                disabled={isDisabled}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Ngày ghi nhận</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                className="form-control"
                required
                disabled={isDisabled}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Độ tuổi của bé</label>
              <input 
                type="text" 
                value={age} 
                onChange={(e) => setAge(e.target.value)} 
                className="form-control"
                placeholder="Ví dụ: 3 tháng tuổi, 1 tuổi..."
                disabled={isDisabled}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Chuyên mục</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="select-input"
                style={{ width: '100%' }}
                disabled={isDisabled}
              >
                <option value="Sinh Hoạt">Sinh Hoạt (Ăn, ngủ, tắm...)</option>
                <option value="Vui Chơi">Vui Chơi (Đồ chơi, đi dạo...)</option>
                <option value="Cột Mốc Vàng">Cột Mốc Vàng (Lẫy, đi, nói...)</option>
                <option value="Gia Đình">Bên Gia Đình</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div className="form-group form-group-full">
              <label className="form-label">Nhật ký đi kèm (Mô tả)</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="form-control"
                rows="3"
                placeholder="Lưu lại những câu chuyện, khoảnh khắc đáng yêu đằng sau loạt ảnh này..."
                style={{ resize: 'none' }}
                maxLength={500}
                disabled={isDisabled}
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isDisabled || selectedImages.length === 0}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {isUploading ? 'Đang Đăng Tải Lên Đám Mây...' : 'Lưu Vào Cuốn Nhật Ký'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
