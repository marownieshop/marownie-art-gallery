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
  ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Menu, Search, X,
} from 'lucide-react';
import {
  Link, Route, Switch, useLocation, Router as WouterRouter,
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
    <article className={`art-card reveal ${index % 2 ? 'reveal-delay' : ''}`} data-testid={`card-artwork-${artwork.slug}`}>
      <Link href={`/artwork/${artwork.slug}`} className="artwork-link art-card-image" aria-label={`View ${artwork.title} by ${artistName}`}>
        <img className="art-image" src={artwork.image} alt={`${artwork.status === 'sample' ? 'Illustrative sample artwork' : 'Artwork'}: ${artwork.title}`} />
        <span className="image-index">0{index + 1}</span>
        <span className="image-arrow" aria-hidden="true"><ArrowUpRight size={18} /></span>
      </Link>
      <div className="art-card-copy">
        <div>
          <h3 className="serif art-title">{artwork.title}</h3>
          <Link href={`/artists/${artwork.artistSlug}`} className="art-artist" data-testid={`link-artwork-artist-${artwork.slug}`}>
            {artistName}
          </Link>
        </div>
        <span className="art-price" data-testid={`text-price-${artwork.slug}`}>
          {artwork.price ? (
            <>
              <span className="art-price-value">{formatArtworkPrice(artwork.price.amount)}</span>
              <span className="art-price-label">{artwork.price.status === 'sample' ? 'Illustrative sample price' : 'Listed price'}</span>
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
    { href: '/discover', label: 'Discover Art' },
    { href: '/artists', label: 'Artists' },
    { href: '/about', label: 'About' },
  ];
  return (
    <header className="site-header">
      <div className="header-inner page-wrap">
        <Link href="/" className="wordmark" aria-label="Marownie Art home" onClick={() => setMenuOpen(false)}>
          <span className="wordmark-name">marownie<span>.</span></span>
          <span className="wordmark-caption">A considered art gallery</span>
        </Link>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          {links.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
              className={`nav-link ${location === item.href || (item.href === '/artists' && location.startsWith('/artists/')) ? 'active' : ''}`} aria-current={location === item.href || (item.href === '/artists' && location.startsWith('/artists/')) ? 'page' : undefined}
              data-testid={`link-nav-${item.label.toLowerCase()}`}>
              {item.label}
            </Link>
          ))}
          <Link href="/discover" className="nav-inquire" onClick={() => setMenuOpen(false)} data-testid="link-nav-explore">Explore the collection <ArrowUpRight size={14} /></Link>
        </nav>
        <button className="mobile-menu" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} data-testid="button-mobile-menu">
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
          <span className="eyebrow">Find your way</span>
          <Link href="/discover" data-testid="link-footer-discover">Discover artwork</Link>
          <Link href="/artists" data-testid="link-footer-artists">Meet the artists</Link>
          <Link href="/about" data-testid="link-footer-about">About Marownie</Link>
        </div>
        <div className="footer-contact">
          <span className="eyebrow">Contact & follow</span>
          <p data-testid="text-footer-contact-placeholder">Email · Details coming soon</p>
          <p data-testid="text-footer-social-placeholder">Instagram · Coming soon</p>
        </div>
        <div className="footer-note">
          <span className="eyebrow">A note on this collection</span>
          <p>Artwork, artist, and price details shown here are illustrative samples, not real catalog listings.</p>
        </div>
      </div>
      <div className="page-wrap footer-bottom"><span>© {new Date().getFullYear()} Marownie Art</span><span>Made for looking a little closer.</span></div>
    </footer>
  );
}

function SiteShell({ children }: { children: ReactNode }) {
  return <><Header /><main>{children}</main><Footer /></>;
}

function Home() {
  return (
    <>
      <section className="home-hero page-wrap">
        <div className="hero-text">
          <p className="eyebrow hero-kicker"><span className="kicker-dot" /> Independent art, thoughtfully found</p>
          <h1 className="serif">Art that<br />makes room<br /><em>for feeling.</em></h1>
          <p className="hero-deck">A place to look closely at material, scale, and the space a work makes.</p>
          <Link href="/discover" className="text-link hero-link">Find your next favourite <ArrowRight size={16} /></Link>
          <div className="hero-footnote"><span>01 / 04</span><span>Explore work with meaning</span></div>
        </div>
        <div className="hero-art-wrap">
          <Link href="/artwork/quiet-weather" className="hero-art-link artwork-link" aria-label="View A Kind of Weather by Mara Ellison">
            <img className="art-image" src={artworks[0].image} alt="Illustrative abstract painting in burgundy, rust and ivory" />
          </Link>
          <div className="hero-art-caption"><span className="caption-rule" /><div><span className="caption-title serif">A Kind of Weather</span><span className="caption-sub">Illustrative sample · Mara Ellison</span></div></div>
          <span className="hero-side-note">A COLLECTION IN GOOD COMPANY</span>
        </div>
        <span className="hero-index serif">A more personal way to look</span>
      </section>

      <section className="intro-strip">
        <div className="page-wrap intro-inner">
          <span className="eyebrow">A little less noise.</span>
          <p className="serif">The work first: <em>material, scale, space.</em> The meaning is yours to make.</p>
          <Link href="/about" className="circle-link" aria-label="Read about Marownie"><ArrowDownRight size={21} /></Link>
        </div>
      </section>

      <section className="featured-section page-wrap">
        <div className="section-heading">
          <div><span className="eyebrow">A place to begin · illustrative sample works</span><h2 className="serif">Selected works</h2></div>
          <Link href="/discover" className="text-link">View the collection <ArrowRight size={16} /></Link>
        </div>
        <div className="art-grid home-grid">{artworks.slice(0, 3).map((art, i) => <ArtworkCard key={art.slug} artwork={art} index={i} />)}</div>
      </section>

      <section className="artist-teaser">
        <div className="page-wrap teaser-inner">
          <div className="teaser-copy"><span className="eyebrow">Illustrative profile placeholders</span><h2 className="serif">Artists,<br /><em>in their own time.</em></h2><p>Artist-approved details are not yet supplied. These sample names are not real artist listings.</p><Link href="/artists" className="text-link">See sample profiles <ArrowRight size={16} /></Link></div>
          <div className="teaser-artists">
            {artists.slice(0, 3).map((artist, i) => (
              <Link href={`/artists/${artist.slug}`} className="artist-line" key={artist.slug}>
                <span className="artist-line-index">0{i + 1}</span><span className="artist-line-name serif">{artist.name}</span><span className="artist-line-type">Sample profile</span><ArrowUpRight size={16} />
              </Link>
            ))}
            <span className="artist-line-note">Sample artist names for demonstration</span>
          </div>
        </div>
      </section>

      <section className="closing-invite page-wrap">
        <span className="eyebrow">Take your time</span>
        <h2 className="serif">Good art keeps<br /><em>good company.</em></h2>
        <Link href="/discover" className="button-link">Spend a little time here <ArrowRight size={16} /></Link>
        <span className="closing-mark" aria-hidden="true">m.</span>
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
  const categories = ['Everything', ...new Set(artworks.map((artwork) => artwork.category).filter((value): value is string => Boolean(value)))];
  const mediums = [...new Set(artworks.map((artwork) => artwork.medium).filter((value): value is string => Boolean(value)))].sort((a, b) => a.localeCompare(b));
  const years = [...new Set(artworks.map((artwork) => artwork.year).filter((value): value is string => Boolean(value)))].sort((a, b) => Number(b) - Number(a));
  const filtered = useMemo(() => artworks.filter((art) => {
    const matchesCategory = category === 'Everything' || art.category === category;
    const matchesMedium = medium === 'All mediums' || art.medium === medium;
    const matchesYear = year === 'All years' || art.year === year;
    const needle = query.trim().toLowerCase();
    const searchablePrice = art.price
      ? `${art.price.amount} ${formatArtworkPrice(art.price.amount)}`
      : '';
    const matchesText = !needle || `${art.title} ${getArtistName(art.artistSlug)} ${art.medium ?? ''} ${art.year ?? ''} ${art.dimensions ?? ''} ${art.category ?? ''} ${art.availability ?? ''} ${art.edition ?? ''} ${searchablePrice}`.toLowerCase().includes(needle);
    return matchesCategory && matchesMedium && matchesYear && matchesText;
  }).sort((a, b) => {
    if (sort === 'title') return a.title.localeCompare(b.title);
    const yearA = a.year ? Number(a.year) : undefined;
    const yearB = b.year ? Number(b.year) : undefined;
    if (yearA === undefined && yearB === undefined) return a.title.localeCompare(b.title);
    if (yearA === undefined) return 1;
    if (yearB === undefined) return -1;
    const yearDifference = sort === 'oldest' ? yearA - yearB : yearB - yearA;
    return yearDifference || a.title.localeCompare(b.title);
  }), [category, medium, query, sort, year]);
  return (
    <div className="page-wrap inner-page discover-page">
      <div className="page-heading">
        <span className="eyebrow">The collection · illustrative samples</span>
        <h1 className="serif">Find what <em>moves you.</em></h1>
        <p>Browse these illustrative records by medium and year, or search the listed details.</p>
      </div>
      <div className="collection-toolbar">
          <div className="category-tabs" role="group" aria-label="Filter by artwork category">
          {categories.map((item) => <button type="button" key={item} className={`filter-chip ${category === item ? 'selected' : ''}`} aria-pressed={category === item} onClick={() => setCategory(item)} data-testid={`filter-${item.toLowerCase().replace(' ', '-')}`}>{item}</button>)}
        </div>
        <label className="search-box"><Search size={16} aria-hidden="true" /><span className="sr-only">Search artwork</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the collection" data-testid="input-artwork-search" /></label>
      </div>
      <div className="catalog-controls" aria-label="Additional catalogue filters">
        <label className="catalog-select-label" htmlFor="catalog-medium">Medium
          <select id="catalog-medium" value={medium} onChange={(event) => setMedium(event.target.value)} data-testid="select-catalog-medium">
            <option>All mediums</option>
            {mediums.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <label className="catalog-select-label" htmlFor="catalog-year">Year
          <select id="catalog-year" value={year} onChange={(event) => setYear(event.target.value)} data-testid="select-catalog-year">
            <option>All years</option>
            {years.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <label className="catalog-select-label" htmlFor="catalog-sort">Sort by
          <select id="catalog-sort" value={sort} onChange={(event) => setSort(event.target.value)} data-testid="select-catalog-sort">
            <option value="newest">Year · newest</option>
            <option value="oldest">Year · oldest</option>
            <option value="title">Title · A–Z</option>
          </select>
        </label>
        {(category !== 'Everything' || medium !== 'All mediums' || year !== 'All years' || query || sort !== 'newest') && (
          <button type="button" className="text-link clear-catalog" onClick={() => { setCategory('Everything'); setMedium('All mediums'); setYear('All years'); setQuery(''); setSort('newest'); }} data-testid="button-clear-catalog">
            Reset filters
          </button>
        )}
      </div>
      <div className="results-line"><span>{filtered.length} {filtered.length === 1 ? 'work' : 'works'} to explore</span><span>Illustrative sample collection</span></div>
      {filtered.length ? <div className="art-grid discover-grid">{filtered.map((art, i) => <ArtworkCard key={art.slug} artwork={art} index={i} />)}</div> : (
        <div className="empty-results"><span className="empty-mark serif">m.</span><h2 className="serif">Nothing just yet.</h2><p>Try another word or browse the whole collection.</p><button className="text-link" type="button" onClick={() => { setQuery(''); setCategory('Everything'); setMedium('All mediums'); setYear('All years'); setSort('newest'); }}>Clear filters <ArrowRight size={16} /></button></div>
      )}
      <p className="sample-disclaimer">All works, names, catalog values, and prices on this page are illustrative placeholders and do not represent a real catalog.</p>
    </div>
  );
}

function Artists() {
  return (
    <div className="page-wrap inner-page artists-page">
      <div className="page-heading artist-page-heading">
        <span className="eyebrow">Illustrative profile placeholders</span>
        <h1 className="serif">Artist profiles,<br /><em>when details are ready.</em></h1>
        <p>Artist-approved biographies and statements have not been provided. These sample names are not real artist listings.</p>
      </div>
      <div className="artist-directory">
        {artists.map((artist, i) => {
          const sampleWork = getArtworksByArtist(artist.slug)[0];
          return (
            <article className="artist-profile" key={artist.slug}>
              {sampleWork ? (
                <Link href={`/artists/${artist.slug}`} className="artist-image-link artwork-link" aria-label={`View illustrative sample profile for ${artist.name}`}>
                  <img className="art-image" src={sampleWork.image} alt={`Illustrative sample artwork associated with placeholder artist ${artist.name}`} />
                  <span className="artist-image-number">0{i + 1}</span>
                </Link>
              ) : (
                <div className="artist-image-link artist-image-empty" aria-hidden="true"><span>m.</span></div>
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
      <div className="artist-footnote"><span className="eyebrow">A transparent beginning</span><p>All names and associated artworks shown here are illustrative placeholders. No biographies, statements, or career claims are implied.</p></div>
    </div>
  );
}

function ArtistProfile({ params }: { params: { slug: string } }) {
  const artist = getArtistBySlug(params.slug);
  if (!artist) {
    return <div className="page-wrap missing-art"><span className="eyebrow">Artist not found</span><h1 className="serif">This profile<br /><em>is not here.</em></h1><Link href="/artists" className="text-link"><ArrowLeft size={16} /> Return to artists</Link></div>;
  }

  const artistWorks = getArtworksByArtist(artist.slug);
  const biography = artist.status === 'verified' ? artist.artistApprovedBiography : undefined;
  const statement = artist.status === 'verified' ? artist.artistApprovedStatement : undefined;

  return (
    <div className="page-wrap inner-page artist-detail-page">
      <Link href="/artists" className="back-link"><ArrowLeft size={15} /> Back to artists</Link>
      <section className="artist-detail-heading">
        <span className="eyebrow">{artist.status === 'sample' ? 'Illustrative sample artist · not a real listing' : 'Artist profile'}</span>
        <h1 className="serif">{artist.name}</h1>
        <div className="artist-information-panel">
          <article>
            <span className="eyebrow">Artist-approved biography</span>
            {biography ? <p>{biography}</p> : <p className="missing-information">Not supplied.</p>}
          </article>
          <article>
            <span className="eyebrow">Artist statement</span>
            {statement ? <p className="serif">{statement}</p> : <p className="missing-information">Not supplied.</p>}
          </article>
          {artist.status === 'sample' && <p className="sample-disclaimer">This sample profile is not a real artist listing. No biography or artist statement has been invented.</p>}
        </div>
      </section>
      <section className="artist-works-section">
        <div className="section-heading">
          <div><span className="eyebrow">Illustrative sample works</span><h2 className="serif">Associated artworks</h2></div>
          <span className="artist-work-count">{artistWorks.length} {artistWorks.length === 1 ? 'sample work' : 'sample works'}</span>
        </div>
        {artistWorks.length ? (
          <div className="art-grid related-grid">{artistWorks.map((artwork, index) => <ArtworkCard artwork={artwork} index={index} key={artwork.slug} />)}</div>
        ) : (
          <p className="missing-information">No artworks have been supplied for this artist.</p>
        )}
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
        <img src={artworks[1].image} alt="Illustrative sample abstract artwork in soft earth and muted rose tones" />
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
        <div className="page-wrap about-status-inner"><span className="eyebrow">A first look, not a finished catalogue</span><h2 className="serif">This is Marownie<br /><em>at the beginning.</em></h2><p>Artwork, artist, and price details shown here are illustrative samples only. Artist-approved profiles, submissions, and purchasing are future possibilities—not available features today. Artwork pages include a conceptual in-room preview, not augmented reality.</p><Link href="/discover" className="button-link">Explore the sample collection <ArrowRight size={16} /></Link></div>
      </section>
    </div>
  );
}

function ArtworkDetail({ params }: { params: { slug: string } }) {
  const artwork = getArtworkBySlug(params.slug);
  if (!artwork) return <div className="page-wrap missing-art"><span className="eyebrow">Work not found</span><h1 className="serif">This work is<br /><em>not listed.</em></h1><Link href="/discover" className="text-link"><ArrowLeft size={16} /> Return to the collection</Link></div>;
  const related = artworks.filter((item) => item.slug !== artwork.slug && item.artistSlug !== artwork.artistSlug).slice(0, 2);
  const artist = getArtistBySlug(artwork.artistSlug);
  const fieldValue = (value?: string) => value
    ? <span className={artwork.status === 'sample' ? 'sample-field-value' : 'verified-field-value'}>{artwork.status === 'sample' ? `Sample only · ${value}` : value}</span>
    : <span className="missing-information">Not supplied</span>;
  return (
    <div className="page-wrap detail-page">
      <Link href="/discover" className="back-link"><ArrowLeft size={15} /> Back to the collection</Link>
      <section className="detail-layout">
        <div className="detail-image"><img src={artwork.image} alt={`${artwork.status === 'sample' ? 'Illustrative sample artwork' : 'Artwork'}: ${artwork.title}`} /><span className="eyebrow">{artwork.status === 'sample' ? 'Illustrative sample artwork' : 'Artwork'}</span></div>
        <div className="detail-copy">
          <span className={`record-status ${artwork.status}`} role="note">{artwork.status === 'sample' ? 'Illustrative sample · not verified' : 'Verified catalog record'}</span>
          <h1 className="serif">{artwork.title}</h1>
          {artist ? <Link href={`/artists/${artist.slug}`} className="detail-artist" data-testid="link-detail-artist">{artist.name}<ArrowUpRight size={14} /></Link> : <p className="missing-information">Artist details not supplied.</p>}
          <div className="detail-rule" />
          <dl className="detail-facts" aria-label="Artwork catalog details">
            <div><dt>Year</dt><dd>{fieldValue(artwork.year)}</dd></div>
            <div><dt>Medium</dt><dd>{fieldValue(artwork.medium)}</dd></div>
            <div><dt>Dimensions</dt><dd>{fieldValue(artwork.dimensions)}</dd></div>
            <div><dt>Work type</dt><dd>{fieldValue(artwork.category)}</dd></div>
            <div><dt>Availability</dt><dd>{artwork.availability ?? <span className="missing-information">Not supplied</span>}</dd></div>
            <div><dt>Edition</dt><dd>{artwork.edition ?? <span className="missing-information">Not supplied</span>}</dd></div>
            <div><dt>Price</dt><dd>{artwork.price ? <span className="detail-price-block"><span className="detail-price-value">{formatArtworkPrice(artwork.price.amount)}</span><span className="detail-price-label">{artwork.price.status === 'sample' ? 'Illustrative sample price' : 'Listed price'}</span></span> : <span className="missing-information">Not supplied</span>}</dd></div>
          </dl>
          <p className="detail-disclaimer">Artwork names and catalog values on this page are illustrative placeholders, not verified listing information.</p>
          <p className="detail-action-note">Purchasing and direct artwork inquiries are not available in this sample experience.</p>
          <WallPreview artwork={artwork} />
        </div>
      </section>
      <section className="related-section"><div className="section-heading"><div><span className="eyebrow">Keep looking</span><h2 className="serif">Along the way</h2></div><Link href="/discover" className="text-link">See all works <ArrowRight size={16} /></Link></div><div className="art-grid related-grid">{related.map((item, i) => <ArtworkCard artwork={item} index={i} key={item.slug} />)}</div></section>
    </div>
  );
}

type RoomStyle = 'living' | 'reading';
type PreviewScale = 'small' | 'medium' | 'large';

function WallPreview({ artwork }: { artwork: Artwork }) {
  const [roomStyle, setRoomStyle] = useState<RoomStyle>('living');
  const [scale, setScale] = useState<PreviewScale>('medium');
  const [aspectRatio, setAspectRatio] = useState(1);
  const frameStyle = {
    '--preview-ratio': String(aspectRatio),
  } as CSSProperties;

  return (
    <section className="wall-preview-section" aria-labelledby="wall-preview-title">
      <div className="wall-preview-heading">
        <div>
          <span className="eyebrow">A sense of scale</span>
          <h2 id="wall-preview-title" className="serif">See it at home.</h2>
        </div>
        <p>A conceptual room study, made to help you imagine the work in a lived-in space.</p>
      </div>
      <div className="wall-preview-controls">
        <div className="preview-setting">
          <span id="preview-room-label" className="preview-setting-label">Room</span>
          <div className="preview-button-group" role="group" aria-labelledby="preview-room-label">
            <button type="button" className={roomStyle === 'living' ? 'selected' : ''} aria-pressed={roomStyle === 'living'} onClick={() => setRoomStyle('living')} data-testid="button-preview-living-room">Living room</button>
            <button type="button" className={roomStyle === 'reading' ? 'selected' : ''} aria-pressed={roomStyle === 'reading'} onClick={() => setRoomStyle('reading')} data-testid="button-preview-reading-corner">Reading corner</button>
          </div>
        </div>
        <div className="preview-setting">
          <span id="preview-scale-label" className="preview-setting-label">Displayed scale</span>
          <div className="preview-button-group" role="group" aria-labelledby="preview-scale-label">
            {(['small', 'medium', 'large'] as const).map((option) => (
              <button key={option} type="button" className={scale === option ? 'selected' : ''} aria-pressed={scale === option} onClick={() => setScale(option)} data-testid={`button-preview-scale-${option}`}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className={`room-mockup room-${roomStyle} scale-${scale}`} data-testid="wall-preview-scene">
        <img className="room-interior-photo" src={roomStyle === 'living' ? '/interiors/gallery-living-room.jpg' : '/interiors/reading-corner.jpg'} alt={roomStyle === 'living' ? 'Warm minimalist living room with a broad blank wall above a low wooden cabinet' : 'Quiet reading corner with a blank plaster wall and olive chair'} />
        <div className="room-art-placement">
          <div className="room-art-frame" style={frameStyle}>
            <div className="room-art-mat">
              <img
                src={artwork.image}
                alt={`${artwork.title}, shown in a sample ${roomStyle === 'living' ? 'living room' : 'reading corner'} interior`}
                onLoad={(event) => {
                  const image = event.currentTarget;
                  if (image.naturalWidth && image.naturalHeight) {
                    setAspectRatio(image.naturalWidth / image.naturalHeight);
                  }
                }}
                data-testid="image-wall-preview-artwork"
              />
            </div>
          </div>
        </div>
        <span className="room-mockup-mark" aria-hidden="true">marownie · room study</span>
      </div>
      <div className="wall-preview-footnote"><span>Conceptual room mockup · not augmented reality</span><span>Displayed scale is illustrative, not a fit guarantee.</span></div>
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
