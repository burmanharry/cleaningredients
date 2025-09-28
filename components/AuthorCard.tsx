// components/AuthorCard.tsx
type Author = {
  name: string;
  title?: string;
  avatarUrl?: string;
  sameAs?: string[];
};

export default function AuthorCard({ author }: { author: Author }) {
  return (
    <div className="mt-4 flex items-center gap-3 rounded-xl border p-4">
      {author.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={author.avatarUrl}
          alt={author.name}
          className="h-10 w-10 rounded-full"
        />
      ) : (
        <div className="h-10 w-10 rounded-full bg-neutral-200" />
      )}
      <div>
        <div className="font-medium">{author.name}</div>
        {author.title && (
          <div className="text-sm text-neutral-600">{author.title}</div>
        )}
      </div>
    </div>
  );
}
