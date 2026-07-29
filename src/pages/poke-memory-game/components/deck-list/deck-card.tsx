import { useState } from 'react';
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
  const [shouldRenderImage, setShouldRenderImage] = useState(isFlipped);

  const handleCardClick = () => {
    onSelectCard();
    setShouldRenderImage(true);
  };

  return (
    <div
      className={cn(
        'transition duration-700 transform-3d cursor-pointer',
        isFlipped && 'rotate-y-180',
      )}
      onTransitionEnd={() => !isFlipped && setShouldRenderImage(false)}
      onClick={() => handleCardClick()}
    >
      <div className="absolute backface-hidden">
        <BackCard />
      </div>
      <div className="rotate-y-180 backface-hidden">
        <FrontCard name={name} src={src} shouldRenderImage={shouldRenderImage} />
      </div>
    </div>
  );
};
