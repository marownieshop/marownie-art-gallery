
import { type CSSProperties, type ReactNode, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  artists,
  artworks,
  getArtistBySlug,
  getArtistName,
  getArtworkBySlug,
  getArtworksByArtist,
  type Artwork,
} from '@/data/catalog';
import NotFound from '@/pages/not-found';
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Heart,
  Menu,
  Search,
  X,
} from 'lucide-react';
import {
  Link,
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function formatArtworkPrice(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

function ArtworkCard({ artwork, index = 0 }: { artwork: Artwork; index?: number }) {
  const artistName = getArtistName(artwork.artistSlug);

  return (
    <article className={`art-card reveal ${index % 2 ? 'reveal-delay' : ''}`}>
      <Link
        href={`/artwork/${artwork.slug}`}
        className="artwork-link art-card-image"
        aria-label={`View ${artwork.title} by ${artistName}`}
      >
        <img className="art-image" src={artwork.image} alt={`Sample artwork: ${artwork.title}`} />
        <span className="image-index">0{index + 1}</span>
        <span className="image-arrow" aria-hidden="true"><ArrowUpRight size={18} /></span>
      </Link>
      <div className="art-card-copy">
        <div>
          <h3 className="serif art-title">{artwork.title}</h3>
          <Link href={`/artists/${artwork.artistSlug}`} className="art-artist">
            {artistName}
          </Link>
        </div>
        <span className="art-price">
          {artwork.price ? (
            <>
              <span className="art-price-value">{formatArtworkPrice(artwork.price.amount)}</span>
              <span className="art-price-label">Illustrative sample price</span>
            </>
          ) : (
            <span className="art-price-value missing-information">Price not supplied</span>
          )}
        </span>
      </div>
    </article>
  );
}

function Header() {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/discover', label: 'Gallery' },
    { href: '/artists', label: 'Artists' },
    { href: '/about', label: 'About' },
  ];

  return (
    <header className="site-header">
      <div className="header-inner page-wrap">
        <Link href="/" className="wordmark" aria-label="Marownie Art home" onClick={() => setMenuOpen(false)}>
          <span className="wordmark-name">marownie<span>.</span></span>
          <span className="wordmark-caption">Art for thoughtful spaces</span>
        </Link>

        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`nav-link ${location === item.href || (item.href === '/artists' && location.startsWith('/artists/')) ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/discover" className="nav-inquire" onClick={() => setMenuOpen(false)}>
            Explore the gallery <ArrowUpRight size={14} />
          </Link>
        </nav>

        <button
          className="mobile-menu"
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-wrap footer-main">
        <div className="footer-brand">
          <span className="wordmark-name">marownie<span>.</span></span>
          <p>A quieter way to find the work that stays with you.</p>
        </div>
        <div className="footer-nav">
          <span className="eyebrow">Explore</span>
          <Link href="/discover">Discover artwork</Link>
          <Link href="/artists">Meet the artists</Link>
          <Link href="/about">About Marownie</Link>
        </div>
        <div className="footer-contact">
          <span className="eyebrow">A considered beginning</span>
          <p>Art, material, and space.</p>
          <p>Made for looking a little closer.</p>
        </div>
        <div className="footer-note">
          <span className="eyebrow">A note on this collection</span>
          <p>Artwork, artist, and price details shown here are illustrative samples, not real catalog listings.</p>
        </div>
      </div>
      <div className="page-wrap footer-bottom">
        <span>© {new Date().getFullYear()} Marownie Art</span>
        <span>Art for thoughtful spaces.</span>
      </div>
    </footer>
  );
}

function SiteShell({ children }: { children: ReactNode }) {
  return <><Header /><main>{children}</main><Footer /></>;
}

function Home() {
  const [size, setSize] = useState('16 × 20 in');
  const [material, setMaterial] = useState('Fine Art Paper');
  const [frame, setFrame] = useState('Natural Oak');
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState('');

  const sizes: Record<string, number> = {
    '8 × 10 in': 45,
    '11 × 14 in': 65,
    '16 × 20 in': 95,
    '20 × 24 in': 135,
    '24 × 36 in': 185,
  };

  const materials: Record<string, number> = {
    'Fine Art Paper': 0,
    Canvas: 45,
    'Framed Print': 75,
  };

  const frames: Record<string, number> = {
    'Natural Oak': 35,
    Black: 30,
    White: 30,
    Gold: 45,
  };

  const price = sizes[size] + materials[material] +
    (material === 'Framed Print' ? frames[frame] : 0);

  const spaces = [
    { name: 'Living Room', artwork: artworks[0], number: '01' },
    { name: 'Bedroom', artwork: artworks[1], number: '02' },
    { name: 'Creative Space', artwork: artworks[2], number: '03' },
    { name: 'Quiet Corners', artwork: artworks[3], number: '04' },
  ];

  return (
    <>
      <section className="mw-hero page-wrap">
        <div className="mw-hero-copy">
          <span className="mw-eyebrow"><span className="mw-dot" /> ART FOR THOUGHTFUL SPACES</span>
          <h1 className="mw-title">Your space.<br />Your story.<br /><em>Your art.</em></h1>
          <p className="mw-description">
            Discover art that brings warmth, character, and a little more meaning
            to the places you call home.
          </p>
          <div className="mw-hero-actions">
            <Link href="/discover" className="mw-button mw-button-dark">
              Explore the gallery <ArrowRight size={17} />
            </Link>
            <Link href="/about" className="mw-text-link">Our philosophy <ArrowUpRight size={16} /></Link>
          </div>
          <div className="mw-hero-note">
            <span>ART, CHOSEN WITH CARE</span><span>01 — 04</span>
          </div>
        </div>

        <div className="mw-hero-visual">
          <div className="mw-art-surround">
            <div className="mw-art-frame">
              <img src={artworks[0].image} alt="Illustrative sample abstract artwork" />
            </div>
            <span className="mw-art-stamp">A STUDY IN FORM & FEELING</span>
          </div>
          <div className="mw-art-caption">
            <div>
              <span className="mw-caption-label">A WORK TO LIVE WITH</span>
              <h2 className="serif">{artworks[0].title}</h2>
              <p>Illustrative sample artwork</p>
            </div>
            <Link href={`/artwork/${artworks[0].slug}`} className="mw-round-link" aria-label="View sample artwork">
              <ArrowUpRight size={20} />
            </Link>
          </div>
          <span className="mw-vertical-note">MAROWNIE ART GALLERY</span>
        </div>
      </section>

      <section className="mw-manifesto">
        <div className="page-wrap mw-manifesto-inner">
          <span className="mw-eyebrow">A MORE PERSONAL APPROACH</span>
          <p className="serif">Art is not simply something you see.<br /><em>It is something you feel.</em></p>
          <span className="mw-manifesto-mark">m.</span>
        </div>
      </section>

      <section className="page-wrap mw-customizer">
        <div className="mw-customizer-image">
          <span className="mw-eyebrow">MAKE IT YOURS</span>
          <div className="mw-customizer-picture">
            <img src={artworks[0].image} alt="Illustrative sample artwork preview" />
          </div>
          <p className="mw-image-footnote">Sample artwork · Preview for inspiration</p>
        </div>

        <div className="mw-customizer-panel">
          <span className="mw-eyebrow">YOUR ART, YOUR WAY</span>
          <h2 className="serif mw-customizer-title">Made to fit<br /><em>your space.</em></h2>
          <p className="mw-description">
            Explore sizes and finishes to imagine how your chosen artwork could look in your home.
          </p>

          <div className="mw-option-group">
            <div className="mw-option-heading"><span>01 — Choose a size</span><span>{size}</span></div>
            <div className="mw-size-options">
              {Object.keys(sizes).map((option) => (
                <button key={option} type="button"
                  className={`mw-option-button ${size === option ? 'is-selected' : ''}`}
                  aria-pressed={size === option}
                  onClick={() => { setSize(option); setNotice(''); }}>
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="mw-option-group">
            <div className="mw-option-heading"><span>02 — Choose a finish</span></div>
            <div className="mw-material-options">
              {Object.keys(materials).map((option) => (
                <button key={option} type="button"
                  className={`mw-option-button ${material === option ? 'is-selected' : ''}`}
                  aria-pressed={material === option}
                  onClick={() => { setMaterial(option); setNotice(''); }}>
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="mw-option-group">
            <div className="mw-option-heading">
              <span>03 — Frame colour</span>
              <span>{material === 'Framed Print' ? 'Included in estimate' : 'Preview option'}</span>
            </div>
            <div className="mw-frame-options">
              {[
                { name: 'Natural Oak', colour: '#c4a77d' },
                { name: 'Black', colour: '#292923' },
                { name: 'White', colour: '#fffdf9' },
                { name: 'Gold', colour: '#b59a62' },
              ].map((option) => (
                <button key={option.name} type="button"
                  className={`mw-frame-choice ${frame === option.name ? 'is-selected' : ''}`}
                  aria-pressed={frame === option.name}
                  onClick={() => { setFrame(option.name); setNotice(''); }}>
                  <span className="mw-frame-swatch" style={{ backgroundColor: option.colour }} />
                  <span>{option.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mw-price-row">
            <div>
              <span className="mw-caption-label">ILLUSTRATIVE ESTIMATE</span>
              <p className="mw-price">${price.toFixed(2)}</p>
            </div>
            <button type="button" className={`mw-save-button ${saved ? 'is-saved' : ''}`}
              aria-pressed={saved} onClick={() => setSaved(!saved)}>
              <Heart size={17} fill={saved ? 'currentColor' : 'none'} />
              {saved ? 'Saved' : 'Save'}
            </button>
          </div>

          <button type="button" className="mw-button mw-button-dark mw-add-button"
            onClick={() => setNotice('This is a design preview. Ordering is not available yet.')}>
            Explore this selection <ArrowRight size={17} />
          </button>
          {notice && <p className="mw-feedback" role="status">{notice}</p>}
          <p className="mw-demo-note">
            All prices and configuration options are demonstration examples, not actual offers.
            No purchase will be made.
          </p>
        </div>
      </section>

      <section className="mw-spaces-section">
        <div className="page-wrap">
          <div className="mw-section-heading">
            <div>
              <span className="mw-eyebrow">ART MEETS EVERYDAY LIFE</span>
              <h2 className="serif">Find its place<br /><em>in your world.</em></h2>
            </div>
            <Link href="/discover" className="mw-text-link">Browse sample works <ArrowRight size={16} /></Link>
          </div>
          <div className="mw-space-grid">
            {spaces.map((space) => (
              <Link href={`/artwork/${space.artwork.slug}`} className="mw-space-card" key={space.name}>
                <div className="mw-space-image">
                  <img src={space.artwork.image} alt={`Illustrative artwork for ${space.name.toLowerCase()}`} />
                  <span>{space.number}</span>
                  <span className="mw-space-arrow"><ArrowUpRight size={18} /></span>
                </div>
                <div className="mw-space-caption">
                  <h3 className="serif">{space.name}</h3>
                  <span>Explore <ArrowRight size={14} /></span>
                </div>
              </Link>
            ))}
          </div>
          <p className="mw-demo-note">These are sample artwork images, not photographs of actual room installations.</p>
        </div>
      </section>

      <section className="mw-values page-wrap">
        <div>
          <span className="mw-eyebrow">THE MAROWNIE POINT OF VIEW</span>
          <h2 className="serif">Thoughtful by nature.</h2>
        </div>
        <div className="mw-value-list">
          <article><span>01</span><div><h3 className="serif">Art comes first</h3><p>A considered way to discover artwork and its details.</p></div></article>
          <article><span>02</span><div><h3 className="serif">Honest by design</h3><p>Sample content is clearly labelled while the gallery takes shape.</p></div></article>
          <article><span>03</span><div><h3 className="serif">Space to feel</h3><p>Find a work that feels at home in your own world.</p></div></article>
        </div>
      </section>

      <section className="mw-closing">
        <div className="page-wrap mw-closing-inner">
          <span className="mw-eyebrow">TAKE A CLOSER LOOK</span>
          <h2 className="serif">Make room for<br /><em>something meaningful.</em></h2>
          <Link href="/discover" className="mw-button mw-button-light">
            Discover the collection <ArrowRight size={17} />
          </Link>
          <span className="mw-closing-mark">m.</span>
        </div>
      </section>
    </>
  );
}

function Discover() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Everything');
  const [medium, setMedium] = useState('All mediums');
  const [year, setYear] = useState('All years');
  const [sort, setSort] = useState('newest');

  const categories = ['Everything', ...new Set(artworks.map((art) => art.category).filter((v): v is string => Boolean(v)))];
  const mediums = [...new Set(artworks.map((art) => art.medium).filter((v): v is string => Boolean(v)))].sort();
  const years = [...new Set(artworks.map((art) => art.year).filter((v): v is string => Boolean(v)))].sort((a, b) => Number(b) - Number(a));

  const filtered = useMemo(() => artworks.filter((art) => {
    const matchesCategory = category === 'Everything' || art.category === category;
    const matchesMedium = medium === 'All mediums' || art.medium === medium;
    const matchesYear = year === 'All years' || art.year === year;
    const needle = query.trim().toLowerCase();
    const searchablePrice = art.price ? `${art.price.amount} ${formatArtworkPrice(art.price.amount)}` : '';
    const matchesText = !needle || `${art.title} ${getArtistName(art.artistSlug)} ${art.medium ?? ''} ${art.year ?? ''} ${art.dimensions ?? ''} ${art.category ?? ''} ${searchablePrice}`.toLowerCase().includes(needle);
    return matchesCategory && matchesMedium && matchesYear && matchesText;
  }).sort((a, b) => {
    if (sort === 'title') return a.title.localeCompare(b.title);
    const aYear = a.year ? Number(a.year) : undefined;
    const bYear = b.year ? Number(b.year) : undefined;
    if (aYear === undefined && bYear === undefined) return a.title.localeCompare(b.title);
    if (aYear === undefined) return 1;
    if (bYear === undefined) return -1;
    return (sort === 'oldest' ? aYear - bYear : bYear - aYear) || a.title.localeCompare(b.title);
  }), [category, medium, query, sort, year]);

  return (
    <div className="page-wrap inner-page discover-page">
      <div className="page-heading">
        <span className="eyebrow">The collection · illustrative samples</span>
        <h1 className="serif">Find what <em>moves you.</em></h1>
        <p>Browse sample records by medium and year, or search the listed details.</p>
      </div>
      <div className="collection-toolbar">
        <div className="category-tabs" role="group" aria-label="Filter by artwork category">
          {categories.map((item) => (
            <button key={item} type="button" className={`filter-chip ${category === item ? 'selected' : ''}`}
              aria-pressed={category === item} onClick={() => setCategory(item)}>
              {item}
            </button>
          ))}
        </div>
        <label className="search-box">
          <Search size={16} aria-hidden="true" /><span className="sr-only">Search artwork</span>
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the collection" />
        </label>
      </div>
      <div className="catalog-controls">
        <label className="catalog-select-label">Medium
          <select value={medium} onChange={(event) => setMedium(event.target.value)}>
            <option>All mediums</option>{mediums.map((v) => <option key={v}>{v}</option>)}
          </select>
        </label>
        <label className="catalog-select-label">Year
          <select value={year} onChange={(event) => setYear(event.target.value)}>
            <option>All years</option>{years.map((v) => <option key={v}>{v}</option>)}
          </select>
        </label>
        <label className="catalog-select-label">Sort by
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="newest">Year · newest</option>
            <option value="oldest">Year · oldest</option>
            <option value="title">Title · A–Z</option>
          </select>
        </label>
        {(category !== 'Everything' || medium !== 'All mediums' || year !== 'All years' || query || sort !== 'newest') && (
          <button type="button" className="text-link" onClick={() => { setCategory('Everything'); setMedium('All mediums'); setYear('All years'); setQuery(''); setSort('newest'); }}>
            Reset filters
          </button>
        )}
      </div>
      <div className="results-line"><span>{filtered.length} {filtered.length === 1 ? 'work' : 'works'} to explore</span><span>Illustrative samples</span></div>
      {filtered.length ? (
        <div className="art-grid discover-grid">{filtered.map((art, i) => <ArtworkCard key={art.slug} artwork={art} index={i} />)}</div>
      ) : (
        <div className="empty-results"><h2 className="serif">Nothing just yet.</h2><p>Try another word or browse the whole collection.</p>
          <button className="text-link" type="button" onClick={() => { setQuery(''); setCategory('Everything'); setMedium('All mediums'); setYear('All years'); setSort('newest'); }}>Clear filters <ArrowRight size={16} /></button>
        </div>
      )}
      <p className="sample-disclaimer">All works, names, catalog values, and prices are illustrative placeholders.</p>
    </div>
  );
}

function Artists() {
  return (
    <div className="page-wrap inner-page artists-page">
      <div className="page-heading">
        <span className="eyebrow">Illustrative profile placeholders</span>
        <h1 className="serif">Artists,<br /><em>in their own time.</em></h1>
        <p>Artist-approved biographies and statements have not been supplied. These sample names are not real artist listings.</p>
      </div>
      <div className="artist-directory">
        {artists.map((artist, i) => {
          const sampleWork = getArtworksByArtist(artist.slug)[0];
          return (
            <article className="artist-profile" key={artist.slug}>
              {sampleWork && (
                <Link href={`/artists/${artist.slug}`} className="artist-image-link artwork-link">
                  <img className="art-image" src={sampleWork.image} alt={`Sample artwork for ${artist.name}`} />
                  <span className="artist-image-number">0{i + 1}</span>
                </Link>
              )}
              <div className="artist-profile-copy">
                <span className="eyebrow">Illustrative sample artist</span>
                <h2 className="serif"><Link href={`/artists/${artist.slug}`}>{artist.name}</Link></h2>
                <p>Artist-approved profile information has not been supplied.</p>
                <Link href={`/artists/${artist.slug}`} className="text-link">View sample profile <ArrowRight size={16} /></Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function ArtistProfile({ params }: { params: { slug: string } }) {
  const artist = getArtistBySlug(params.slug);
  if (!artist) {
    return <div className="page-wrap missing-art"><h1 className="serif">Artist not found.</h1><Link href="/artists" className="text-link"><ArrowLeft size={16} /> Return to artists</Link></div>;
  }
  const artistWorks = getArtworksByArtist(artist.slug);
  const biography = artist.status === 'verified' ? artist.artistApprovedBiography : undefined;
  const statement = artist.status === 'verified' ? artist.artistApprovedStatement : undefined;

  return (
    <div className="page-wrap inner-page artist-detail-page">
      <Link href="/artists" className="back-link"><ArrowLeft size={15} /> Back to artists</Link>
      <section className="artist-detail-heading">
        <span className="eyebrow">{artist.status === 'sample' ? 'Illustrative sample artist' : 'Artist profile'}</span>
        <h1 className="serif">{artist.name}</h1>
        <div className="artist-information-panel">
          <article><span className="eyebrow">Artist-approved biography</span><p>{biography || 'Not supplied.'}</p></article>
          <article><span className="eyebrow">Artist statement</span><p className="serif">{statement || 'Not supplied.'}</p></article>
          {artist.status === 'sample' && <p className="sample-disclaimer">This sample profile is not a real artist listing.</p>}
        </div>
      </section>
      <section className="artist-works-section">
        <div className="section-heading"><div><span className="eyebrow">Illustrative sample works</span><h2 className="serif">Associated artworks</h2></div></div>
        {artistWorks.length ? <div className="art-grid related-grid">{artistWorks.map((art, i) => <ArtworkCard key={art.slug} artwork={art} index={i} />)}</div> : <p>No sample artworks supplied.</p>}
      </section>
    </div>
  );
}

function About() {
  return (
    <div className="about-page">
      <section className="about-hero page-wrap">
        <div className="about-title"><span className="eyebrow">A gallery, in the making</span><h1 className="serif">For the art<br />that finds <em>you.</em></h1></div>
        <div className="about-intro"><span className="large-asterisk" aria-hidden="true">✳</span><p className="serif">Marownie is being shaped around a simple idea: finding art should feel as thoughtful as living with it.</p><span className="eyebrow">Our starting point</span></div>
      </section>
      <section className="about-image-band">
        <img src={artworks[1].image} alt="Illustrative sample abstract artwork" />
        <div className="image-band-label"><span className="eyebrow">A collection is more than a catalogue</span><span className="serif">It is a way of seeing.</span></div>
      </section>
      <section className="about-values page-wrap">
        <div className="about-values-heading"><span className="eyebrow">What matters to us</span><h2 className="serif">Considered,<br /><em>not complicated.</em></h2></div>
        <div className="value-list">
          <article><span className="value-no">01</span><div><h3 className="serif">Material before mythology</h3><p>We start with the work and its documented details. We do not invent a story when the artist has not supplied one.</p></div></article>
          <article><span className="value-no">02</span><div><h3 className="serif">Clarity over mystique</h3><p>Known details should be easy to find; missing information should be labeled plainly.</p></div></article>
          <article><span className="value-no">03</span><div><h3 className="serif">Room for your reading</h3><p>We offer a considered frame, not a verdict on what a work should mean.</p></div></article>
        </div>
      </section>
      <section className="about-status">
        <div className="page-wrap about-status-inner">
          <span className="eyebrow">A first look, not a finished catalogue</span>
          <h2 className="serif">This is Marownie<br /><em>at the beginning.</em></h2>
          <p>Artwork, artist, and price details are illustrative samples. Purchasing is not available yet.</p>
          <Link href="/discover" className="button-link">Explore the sample collection <ArrowRight size={16} /></Link>
        </div>
      </section>
    </div>
  );
}

function ArtworkDetail({ params }: { params: { slug: string } }) {
  const artwork = getArtworkBySlug(params.slug);
  if (!artwork) return <div className="page-wrap missing-art"><h1 className="serif">Work not found.</h1><Link href="/discover" className="text-link"><ArrowLeft size={16} /> Return to the collection</Link></div>;

  const related = artworks.filter((item) => item.slug !== artwork.slug && item.artistSlug !== artwork.artistSlug).slice(0, 2);
  const artist = getArtistBySlug(artwork.artistSlug);
  const fieldValue = (value?: string) => value
    ? <span className={artwork.status === 'sample' ? 'sample-field-value' : 'verified-field-value'}>{artwork.status === 'sample' ? `Sample only · ${value}` : value}</span>
    : <span className="missing-information">Not supplied</span>;

  return (
    <div className="page-wrap detail-page">
      <Link href="/discover" className="back-link"><ArrowLeft size={15} /> Back to the collection</Link>
      <section className="detail-layout">
        <div className="detail-image">
          <img src={artwork.image} alt={`Sample artwork: ${artwork.title}`} />
          <span className="eyebrow">Illustrative sample artwork</span>
        </div>
        <div className="detail-copy">
          <span className="record-status sample">Illustrative sample · not verified</span>
          <h1 className="serif">{artwork.title}</h1>
          {artist ? <Link href={`/artists/${artist.slug}`} className="detail-artist">{artist.name}<ArrowUpRight size={14} /></Link> : <p>Artist details not supplied.</p>}
          <div className="detail-rule" />
          <dl className="detail-facts">
            <div><dt>Year</dt><dd>{fieldValue(artwork.year)}</dd></div>
            <div><dt>Medium</dt><dd>{fieldValue(artwork.medium)}</dd></div>
            <div><dt>Dimensions</dt><dd>{fieldValue(artwork.dimensions)}</dd></div>
            <div><dt>Work type</dt><dd>{fieldValue(artwork.category)}</dd></div>
            <div><dt>Availability</dt><dd>{artwork.availability || 'Not supplied'}</dd></div>
            <div><dt>Edition</dt><dd>{artwork.edition || 'Not supplied'}</dd></div>
            <div><dt>Price</dt><dd>{artwork.price ? `${formatArtworkPrice(artwork.price.amount)} · illustrative sample price` : 'Not supplied'}</dd></div>
          </dl>
          <p className="detail-disclaimer">Artwork names and catalog values are illustrative placeholders, not verified listing information.</p>
          <p className="detail-action-note">Purchasing and direct artwork inquiries are not available in this sample experience.</p>
          <WallPreview artwork={artwork} />
        </div>
      </section>
      <section className="related-section">
        <div className="section-heading"><div><span className="eyebrow">Keep looking</span><h2 className="serif">Along the way</h2></div><Link href="/discover" className="text-link">See all works <ArrowRight size={16} /></Link></div>
        <div className="art-grid related-grid">{related.map((item, i) => <ArtworkCard artwork={item} index={i} key={item.slug} />)}</div>
      </section>
    </div>
  );
}

type RoomStyle = 'living' | 'reading';
type PreviewScale = 'small' | 'medium' | 'large';

function WallPreview({ artwork }: { artwork: Artwork }) {
  const [roomStyle, setRoomStyle] = useState<RoomStyle>('living');
  const [scale, setScale] = useState<PreviewScale>('medium');
  const [aspectRatio, setAspectRatio] = useState(1);
  const frameStyle = { '--preview-ratio': String(aspectRatio) } as CSSProperties;

  return (
    <section className="wall-preview-section" aria-labelledby="wall-preview-title">
      <div className="wall-preview-heading">
        <div><span className="eyebrow">A sense of scale</span><h2 id="wall-preview-title" className="serif">See it at home.</h2></div>
        <p>A conceptual room study to help you imagine the work in a lived-in space.</p>
      </div>
      <div className="wall-preview-controls">
        <div className="preview-setting">
          <span id="preview-room-label" className="preview-setting-label">Room</span>
          <div className="preview-button-group" role="group" aria-labelledby="preview-room-label">
            <button type="button" className={roomStyle === 'living' ? 'selected' : ''} onClick={() => setRoomStyle('living')}>Living room</button>
            <button type="button" className={roomStyle === 'reading' ? 'selected' : ''} onClick={() => setRoomStyle('reading')}>Reading corner</button>
          </div>
        </div>
        <div className="preview-setting">
          <span id="preview-scale-label" className="preview-setting-label">Displayed scale</span>
          <div className="preview-button-group" role="group" aria-labelledby="preview-scale-label">
            {(['small', 'medium', 'large'] as const).map((option) => (
              <button key={option} type="button" className={scale === option ? 'selected' : ''} onClick={() => setScale(option)}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className={`room-mockup room-${roomStyle} scale-${scale}`}>
        <img className="room-interior-photo" src={roomStyle === 'living' ? '/interiors/gallery-living-room.jpg' : '/interiors/reading-corner.jpg'}
          alt={roomStyle === 'living' ? 'Sample living room interior' : 'Sample reading corner interior'} />
        <div className="room-art-placement">
          <div className="room-art-frame" style={frameStyle}>
            <div className="room-art-mat">
              <img src={artwork.image} alt={`${artwork.title}, shown in a conceptual room mockup`}
                onLoad={(event) => {
                  const image = event.currentTarget;
                  if (image.naturalWidth && image.naturalHeight) setAspectRatio(image.naturalWidth / image.naturalHeight);
                }} />
            </div>
          </div>
        </div>
        <span className="room-mockup-mark">marownie · room study</span>
      </div>
      <div className="wall-preview-footnote"><span>Conceptual room mockup · not augmented reality</span><span>Displayed scale is illustrative.</span></div>
    </section>
  );
}

function Router() {
  return (
    <SiteShell>
      <RoutedErrorBoundary>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/discover" component={Discover} />
          <Route path="/artists" component={Artists} />
          <Route path="/artists/:slug" component={ArtistProfile} />
          <Route path="/about" component={About} />
          <Route path="/artwork/:slug" component={ArtworkDetail} />
          <Route component={NotFound} />
        </Switch>
      </RoutedErrorBoundary>
    </SiteShell>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
