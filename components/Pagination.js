export default function Pagination({ page, total, params }) {
  if (total <= 1) return null;
  const href = (n) => `/search?${new URLSearchParams({ ...params, page: n })}`;
  const nums = [...new Set([1, 2, 3, total, page - 1, page, page + 1])].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const items = [];
  nums.forEach((n, i) => { if (i && n - nums[i - 1] > 1) items.push(`d${n}`); items.push(n); });
  const nav = (label, text, to, off) => off
    ? <span className="b off" aria-hidden="true">{text}</span>
    : <a href={href(to)} aria-label={label}>{text}</a>;
  return (
    <div className="pgw">
      <nav className="pg" aria-label="Pagination">
        {nav('First page', '«', 1, page <= 1)}
        {nav('Previous page', '‹', page - 1, page <= 1)}
        {items.map((n) => typeof n === 'string'
          ? <span key={n} className="dots">…</span>
          : <a key={n} href={href(n)} className={n === page ? 'on' : ''} aria-current={n === page ? 'page' : undefined}>{n}</a>)}
        {nav('Next page', '›', page + 1, page >= total)}
        {nav('Last page', '»', total, page >= total)}
      </nav>
      <p className="pginfo">Page {page} of {total}</p>
    </div>
  );
}
