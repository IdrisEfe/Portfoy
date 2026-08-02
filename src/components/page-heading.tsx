export function PageHeading({ index, eyebrow, title, body }: { index: string; eyebrow: string; title: string; body: string }) {
  return <header className="page-heading"><span>{index}</span><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{body}</p></div></header>;
}
