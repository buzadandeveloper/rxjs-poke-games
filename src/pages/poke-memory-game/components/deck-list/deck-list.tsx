import { pokeMemoryGameStore } from '#stores';
import { useObservableState } from 'observable-hooks';
import { DeckCard } from './deck-card';
import { getRequestStatus } from '#utils';
import { cn } from '#lib';
import { useEffect } from 'react';
import { PageLoader } from '#components';

export const DeckList = () => {
  const gameState = useObservableState(pokeMemoryGameStore.gameState$, null);

  const { isLoading } = getRequestStatus(gameState?.status);

  const isEven = (gameState?.deck || []).length % 2 === 0;

  useEffect(() => {
    console.log(gameState);
  }, [gameState]);

  if (isLoading) return <PageLoader />;

  return (
    <div className={cn('grid gap-4', isEven ? 'grid-cols-2' : 'grid-cols-3')}>
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
  );
};
