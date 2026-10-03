import Link from 'next/link';
import { img } from '@/lib/tmdb';

export default function Row({ title, items = [], type, href, viewAllHref }) {
  if (!items?.length) return null;
  const link = viewAllHref || href;
  return (
    <section className="row">
      <h2>
        {title}
        {link && <Link href={link}>View All</Link>}
      </h2>
      <div className="strip">
        {items.map((i) => {
          const t = i.media_type || type;
          if (t === 'person') return null;
          return (
            <Link key={t + i.id} href={`/${t}/${i.id}`} className="card" title={i.title || i.name}>
              {i.poster_path
                ? <img src={img(i.poster_path)} alt={i.title || i.name} loading="lazy" />
                : <span className="ph">{i.title || i.name}</span>
              }
            </Link>
          );
        })}
      </div>
    </section>
  );
}
