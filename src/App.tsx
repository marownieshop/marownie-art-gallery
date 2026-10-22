import React, { useState } from 'react';
import './index.css';

export default function App() {
  // Состояния для конфигуратора товара
  const [selectedSize, setSelectedSize] = useState('11 x 14 in');
  const [selectedPrice, setSelectedPrice] = useState('$39');
  const [selectedMaterial, setSelectedMaterial] = useState('Fine Art Paper');
  const [selectedFrame, setSelectedFrame] = useState('Natural Oak');
  const [activeRoom, setActiveRoom] = useState('living');

  // Данные размеров и цен
  const sizes = [
    { size: '8 x 10 in', price: '$29' },
    { size: '11 x 14 in', price: '$39' },
    { size: '16 x 20 in', price: '$59' },
    { size: '20 x 24 in', price: '$79' },
    { size: '24 x 36 in', price: '$109' },
  ];

  const materials = [
    { name: 'Fine Art Paper', price: '$39' },
    { name: 'Canvas (gallery wrap)', price: '$59' },
    { name: 'Framed Print', price: '$89' },
  ];

  const frames = [
    { name: 'Natural Oak', color: '#d4b595' },
    { name: 'Black', color: '#2c2723' },
    { name: 'White', color: '#f5f2eb' },
    { name: 'Gold', color: '#c5a059' },
  ];

  // Изображения комнат для нижней секции
  const rooms = [
    { id: 'living', name: 'Living Room', img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=400&q=80' },
    { id: 'bedroom', name: 'Bedroom', img: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=400&q=80' },
    { id: 'office', name: 'Office', img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&q=80' },
    { id: 'dining', name: 'Dining Room', img: 'https://images.unsplash.com/photo-1617806118233-18e1c0c22468?auto=format&fit=crop&w=400&q=80' },
  ];

  return (
    <div className="app-wrapper">
      {/* 1. Шапка сайта */}
      <header className="header">
        <h1 className="logo">MAROWNIE Art</h1>
        <nav className="nav">
          <a href="#home">Home</a>
          <a href="#gallery">Gallery</a>
          <a href="#collections">Collections</a>
          <a href="#about">About</a>
        </nav>
        <div className="header-icons">
          <span>🔍</span>
          <span>♡</span>
          <span>🛍️</span>
        </div>
      </header>

      {/* Основной контент */}
      <main className="main-container">
        
        {/* Заголовок блока */}
        <div className="section-header">
          <h2 className="page-title">See Art in Your Space</h2>
          <p className="page-subtitle">
            Try your favorite artwork in your home before you order. Choose the size, frame and print material — and see how it looks on your wall.
          </p>
        </div>

        {/* Трехколоночная сетка */}
        <div className="product-grid">

          {/* КОЛОНКА 1: Информация о картине */}
          <div className="info-card">
            <img 
              src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80" 
              alt="Tuscan Sunset" 
            />
            <h3>Tuscany Sunset</h3>
            <p className="artist">Olga Petrova</p>
            <p className="artist" style={{ fontSize: '11px', marginTop: '-8px', marginBottom: '12px' }}>Oil on canvas, 2023</p>
            <p className="desc">
              A peaceful view of Tuscany, where warm light and soft colors create a feeling of calm and harmony.
            </p>
            
            <div style={{ marginTop: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>Available as print</p>
              <ul className="prints-list">
                <li>✓ High-quality fine art print</li>
                <li>✓ Canvas print (gallery wrap)</li>
                <li>✓ Framed print</li>
              </ul>
            </div>
            <p style={{ fontSize: '12px', marginTop: '16px', color: '#7a7067', cursor: 'pointer' }}>More details →</p>
          </div>

          {/* КОЛОНКА 2: Интерактивная сцена с комнатой */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div 
              className="scene-container" 
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80')` }}
            >
              {/* Картина на стене */}
              <div className="artwork-on-wall" style={{ border: selectedFrame === 'Natural Oak' ? '6px solid #d4b595' : selectedFrame === 'Black' ? '6px solid #2c2723' : selectedFrame === 'White' ? '6px solid #f5f2eb' : '6px solid #c5a059' }}>
                <img 
                  src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80" 
                  alt="Preview" 
                  style={{ display: 'block', width: '180px' }}
                />
              </div>
            </div>
          </div>

          {/* КОЛОНКА 3: Конфигуратор товара (Размер, Материал, Рама) */}
          <div className="configurator">
            
            {/* Шаг 1: Размер */}
            <div className="config-section">
              <p className="config-title">1. Choose size</p>
              <div className="options-grid">
                {sizes.map((item) => (
                  <button 
                    key={item.size}
                    className={`option-btn ${selectedSize === item.size ? 'active' : ''}`}
                    onClick={() => { setSelectedSize(item.size); setSelectedPrice(item.price); }}
                  >
                    <span className="size-text">{item.size}</span>
                    <span className="price-text">{item.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Шаг 2: Материал */}
            <div className="config-section">
              <p className="config-title">2. Choose material</p>
              <div className="options-grid-2">
                {materials.map((mat) => (
                  <button 
                    key={mat.name}
                    className={`option-btn ${selectedMaterial === mat.name ? 'active' : ''}`}
                    onClick={() => setSelectedMaterial(mat.name)}
                  >
                    <span className="size-text" style={{ fontSize: '11px' }}>{mat.name}</span>
                    <span className="price-text">{mat.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Шаг 3: Рама */}
            <div className="config-section">
              <p className="config-title">3. Choose frame <span style={{ fontSize: '10px', color: '#8c8278' }}>(for framed prints)</span></p>
              <div className="frames-grid">
                {frames.map((fr) => (
                  <button 
                    key={fr.name}
                    className={`frame-btn ${selectedFrame === fr.name ? 'active' : ''}`}
                    onClick={() => setSelectedFrame(fr.name)}
                  >
                    <div className="frame-circle" style={{ backgroundColor: fr.color }}></div>
                    <span>{fr.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Итоговая цена и кнопка покупки */}
            <div className="total-price">{selectedPrice}</div>
            <div className="price-sub">{selectedSize}, {selectedMaterial}</div>

            <button className="btn-primary">Add to Cart</button>
            <button className="btn-secondary">♡ Save to Wishlist</button>

          </div>

        </div>

        {/* НИЖНЯЯ СЕКЦИЯ: Выбор комнат (Try in Different Rooms) */}
        <div style={{ marginTop: '60px' }}>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', marginBottom: '8px' }}>Try in Different Rooms</h3>
          <p style={{ color: '#6e6760', fontSize: '13px', marginBottom: '20px' }}>See how the artwork fits your style and space — from living rooms to bedrooms, offices and more.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {rooms.map((room) => (
              <div 
                key={room.id} 
                onClick={() => setActiveRoom(room.id)}
                style={{ cursor: 'pointer', border: activeRoom === room.id ? '2px solid #505342' : '1px solid #e0d8cf', borderRadius: '6px', overflow: 'hidden', background: '#fff' }}
              >
                <img src={room.img} alt={room.name} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                <p style={{ padding: '10px', fontSize: '13px', fontWeight: 500 }}>{room.name}</p>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
