function WallPreview({ artwork }: { artwork: Artwork }) {
  const [roomStyle, setRoomStyle] = useState<
    'living' | 'reading' | 'own'
  >('living');

  const [scale, setScale] = useState<
    'small' | 'medium' | 'large'
  >('medium');

  const [uploadedRoom, setUploadedRoom] = useState<string | null>(
    null
  );

  const [positionX, setPositionX] = useState(50);
  const [positionY, setPositionY] = useState(45);

  const [uploadError, setUploadError] = useState('');

  const handleRoomUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Пожалуйста, выберите изображение.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Размер файла не должен превышать 10 МБ.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setUploadedRoom(reader.result);
        setRoomStyle('own');
        setUploadError('');
        setPositionX(50);
        setPositionY(45);
      }
    };

    reader.onerror = () => {
      setUploadError('Не удалось загрузить изображение. Попробуйте ещё раз.');
    };

    reader.readAsDataURL(file);
  };

  const scaleWidths = {
    small: '24%',
    medium: '34%',
    large: '46%',
  };

  const isOwnRoom = roomStyle === 'own' && uploadedRoom !== null;

  const artworkStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${positionX}%`,
    top: `${positionY}%`,
    width: scaleWidths[scale],
    maxHeight: '75%',
    objectFit: 'contain',
    transform: 'translate(-50%, -50%)',
    boxShadow: '0 12px 28px rgba(35, 27, 20, 0.24)',
    border: '7px solid #f8f5ef',
    outline: '1px solid rgba(65, 48, 35, 0.18)',
    transition:
      'width 250ms ease, left 150ms ease, top 150ms ease',
  };

  return (
    <section className="wall-preview-section">
      <div className="wall-preview-heading">
        <div>
          <p className="wall-preview-eyebrow">ART IN YOUR SPACE</p>
          <h2>Найдите идеальное место для искусства</h2>
          <p className="wall-preview-description">
            Представьте, как картина будет выглядеть в вашем интерьере.
            Выберите комнату или загрузите собственную фотографию.
          </p>
        </div>
      </div>

      <div className="wall-preview-layout">
        <div className="wall-preview-controls">
          <div className="wall-preview-control-group">
            <h3>Выберите интерьер</h3>

            <div className="wall-preview-room-options">
              <button
                type="button"
                className={`wall-preview-option ${
                  roomStyle === 'living' ? 'is-active' : ''
                }`}
                onClick={() => setRoomStyle('living')}
                aria-pressed={roomStyle === 'living'}
              >
                <span className="wall-preview-option-icon">⌂</span>
                <span>
                  <strong>Гостиная</strong>
                  <small>Тёплый минимализм</small>
                </span>
              </button>

              <button
                type="button"
                className={`wall-preview-option ${
                  roomStyle === 'reading' ? 'is-active' : ''
                }`}
                onClick={() => setRoomStyle('reading')}
                aria-pressed={roomStyle === 'reading'}
              >
                <span className="wall-preview-option-icon">◫</span>
                <span>
                  <strong>Уголок для чтения</strong>
                  <small>Спокойная атмосфера</small>
                </span>
              </button>

              <button
                type="button"
                className={`wall-preview-option ${
                  roomStyle === 'own' ? 'is-active' : ''
                }`}
                onClick={() => setRoomStyle('own')}
                aria-pressed={roomStyle === 'own'}
              >
                <span className="wall-preview-option-icon">＋</span>
                <span>
                  <strong>Моя комната</strong>
                  <small>Загрузите своё фото</small>
                </span>
              </button>
            </div>
          </div>

          <div className="wall-preview-control-group">
            <h3>Размер картины</h3>

            <div className="wall-preview-size-options">
              {(
                [
                  ['small', 'Маленький'],
                  ['medium', 'Средний'],
                  ['large', 'Большой'],
                ] as const
              ).map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  className={`wall-preview-size-button ${
                    scale === value ? 'is-active' : ''
                  }`}
                  onClick={() => setScale(value)}
                  aria-pressed={scale === value}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {roomStyle === 'own' && (
            <div className="wall-preview-control-group">
              <h3>Фотография вашего интерьера</h3>

              <label className="wall-preview-upload-button">
                <span>↑</span>
                {uploadedRoom
                  ? 'Загрузить другое фото'
                  : 'Выбрать фотографию'}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleRoomUpload}
                  hidden
                />
              </label>

              <p className="wall-preview-help">
                Подойдут фотографии в формате JPG, PNG или WEBP,
                размером до 10 МБ.
              </p>

              {uploadError && (
                <p className="wall-preview-error" role="alert">
                  {uploadError}
                </p>
              )}

              {!uploadedRoom && (
                <p className="wall-preview-help">
                  После загрузки фотографии картина появится поверх
                  изображения комнаты.
                </p>
              )}
            </div>
          )}

          <div className="wall-preview-control-group">
            <h3>Расположение картины</h3>

            <label
              className="wall-preview-slider-label"
              htmlFor="wall-position-x"
            >
              По горизонтали
              <span>{positionX}%</span>
            </label>

            <input
              id="wall-position-x"
              className="wall-preview-slider"
              type="range"
              min="10"
              max="90"
              value={positionX}
              onChange={(event) =>
                setPositionX(Number(event.target.value))
              }
            />

            <label
              className="wall-preview-slider-label"
              htmlFor="wall-position-y"
            >
              По вертикали
              <span>{positionY}%</span>
            </label>

            <input
              id="wall-position-y"
              className="wall-preview-slider"
              type="range"
              min="15"
              max="80"
              value={positionY}
              onChange={(event) =>
                setPositionY(Number(event.target.value))
              }
            />
          </div>

          <button
            type="button"
            className="wall-preview-reset-button"
            onClick={() => {
              setScale('medium');
              setPositionX(50);
              setPositionY(45);
            }}
          >
            Сбросить настройки
          </button>
        </div>

        <div className="wall-preview-visual">
          <div
            className={`wall-preview-scene ${
              roomStyle === 'living'
                ? 'wall-preview-scene-living'
                : roomStyle === 'reading'
                  ? 'wall-preview-scene-reading'
                  : 'wall-preview-scene-own'
            }`}
            style={
              isOwnRoom
                ? {
                    backgroundImage: `url("${uploadedRoom}")`,
                  }
                : undefined
            }
          >
            {!isOwnRoom && (
              <>
                <div className="wall-preview-ceiling" />
                <div className="wall-preview-floor" />

                {roomStyle === 'living' ? (
                  <>
                    <div className="wall-preview-window">
                      <div />
                      <div />
                    </div>

                    <div className="wall-preview-sofa">
                      <span />
                      <span />
                      <span />
                    </div>

                    <div className="wall-preview-plant">
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                    </div>

                    <div className="wall-preview-side-table" />
                  </>
                ) : (
                  <>
                    <div className="wall-preview-reading-window">
                      <div />
                      <div />
                    </div>

                    <div className="wall-preview-armchair">
                      <span />
                    </div>

                    <div className="wall-preview-bookshelf">
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                    </div>

                    <div className="wall-preview-reading-lamp">
                      <span />
                    </div>
                  </>
                )}
              </>
            )}

            {isOwnRoom ? (
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="wall-preview-artwork"
                style={artworkStyle}
              />
            ) : (
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="wall-preview-artwork"
                style={artworkStyle}
              />
            )}

            {isOwnRoom && (
              <div className="wall-preview-own-label">
                Предварительный просмотр
              </div>
            )}
          </div>

          <div className="wall-preview-caption">
            <div>
              <strong>{artwork.title}</strong>
              <span>Предварительный просмотр в интерьере</span>
            </div>

            <span className="wall-preview-caption-mark">
              MAROWNIE
            </span>
          </div>

          <p className="wall-preview-disclaimer">
            Визуализация предназначена для оценки расположения и размера.
            Реальные пропорции и освещение могут отличаться.
          </p>
        </div>
      </div>
    </section>
  );
}
