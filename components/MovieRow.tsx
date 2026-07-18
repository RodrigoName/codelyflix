import MovieCard from "./MovieCard";

type Item = { id: number | string; title: string; poster: string | null };

export default function MovieRow({
  title,
  items,
  basePath,
}: {
  title: string;
  items: Item[];
  basePath: "filme" | "serie";
}) {
  if (!items || items.length === 0) return null;

  return (
    <section className="px-6 md:px-12 mb-10">
      <h2 className="text-xl md:text-2xl font-semibold mb-4">{title}</h2>
      <div className="row-scroll flex gap-4 overflow-x-auto pb-4">
        {items.map((item) => (
          <MovieCard
            key={item.id}
            id={item.id}
            title={item.title}
            poster={item.poster}
            href={`/${basePath}/${item.id}`}
          />
        ))}
      </div>
    </section>
  );
}
