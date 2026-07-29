import { pokeMemoryGameStore } from '#stores';
import { useObservableState } from 'observable-hooks';
import { DeckCard } from './deck-card';
import { getRequestStatus } from '#utils';
import { cn } from '#lib';
import { PageLoader } from '#components';

export const DeckList = () => {
  const gameState = useObservableState(pokeMemoryGameStore.gameState$, null);

  const { isLoading } = getRequestStatus(gameState?.status);

  const isEven = (gameState?.deck || []).length % 2 === 0;

  if (isLoading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-4 items-center">
      <div
        className={cn('grid gap-4', isEven ? 'grid-cols-2' : 'max-sm:grid-cols-2 grid-cols-3 pb-4')}
      >
        {gameState?.deck.map((pokemon, index) => (
          <DeckCard
            key={index}
            name={pokemon.name}
            src={pokemon.src}
            isFlipped={pokemon.isFlipped}
            onSelectCard={() => pokeMemoryGameStore.flipCard(index)}
          />
        ))}
      </div>
    </div>
  );
};
