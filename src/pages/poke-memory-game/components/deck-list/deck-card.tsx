import { BackCard } from './back-card';
import { FrontCard } from './front-card';
import { cn } from '#lib';

interface DeckCardProps {
  name: string;
  src: string;
  onSelectCard: () => void;
  isFlipped: boolean;
}

export const DeckCard = ({ name, src, onSelectCard, isFlipped }: DeckCardProps) => {
  return (
    <div
      className={cn(
        'h-full w-full transition duration-700 transform-3d cursor-pointer',
        isFlipped && 'rotate-y-180',
      )}
      onClick={() => onSelectCard()}
    >
      <div className="absolute backface-hidden">
        <BackCard />
      </div>
      <div className="rotate-y-180 backface-hidden">
        <FrontCard name={name} src={src} isFlipped={isFlipped} />
      </div>
    </div>
  );
};
