import { BackCard } from './back-card';

interface DeckCardProps {
  src: string;
}

export const DeckCard = ({ src }: DeckCardProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="card border border-primary overflow-hidden bg-linear-to-b from-(--color-primary) to-[#2d7dc1]">
        <figure className="p-4">
          <img
            src={src}
            // alt={name}
            className="size-24 object-contain opacity-0 transition-opacity duration-300"
            onLoad={(e) => {
              e.currentTarget.classList.remove('opacity-0');
              e.currentTarget.classList.add('opacity-100');
            }}
          />
        </figure>
      </div>
      <BackCard />
    </div>
  );
};
