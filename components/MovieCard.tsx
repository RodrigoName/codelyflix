import Link from "next/link";

export default function MovieCard({
  id,
  title,
  poster,
  href,
}: {
  id: number | string;
  title: string;
  poster: string | null;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="card-hover flex-shrink-0 w-40 md:w-48 rounded overflow-hidden bg-surface"
    >
      <div className="aspect-[2/3] bg-neutral-800">
        {poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poster} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-500 text-xs p-2 text-center">
            {title}
          </div>
        )}
      </div>
    </Link>
  );
}
