import { pokeMemoryGameStore } from '#stores';
import { DeckCard } from './deck-card';
import { cn } from '#lib';
import { PageLoader } from '#components';
import type { PokemonMap } from '#stores/poke-memory-game/poke-memory-game-store-types';

interface DeckListProps {
  deck: PokemonMap[];
  isLoading: boolean;
}

export const DeckList = ({ deck, isLoading }: DeckListProps) => {
  const isEven = (deck || []).length % 2 === 0;

  if (isLoading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-4 items-center">
      <div
        className={cn('grid gap-4', isEven ? 'grid-cols-2' : 'max-sm:grid-cols-2 grid-cols-3 pb-4')}
      >
        {deck.map((pokemon, index) => (
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
