import { Select } from './select';
import { pokeMemoryGameStore } from '#stores';

const COMBINATIONS = [2, 3];

export const SelectDeck = () => {
  const deckSetup = pokeMemoryGameStore.initialGameState$.value.deckSetup;

  return (
    <div className="flex gap-4">
      <Select
        label="Characters:"
        defaultValue={deckSetup.characters}
        options={COMBINATIONS}
        onChange={(e) =>
          pokeMemoryGameStore.selectDeck({
            characters: Number(e.target.value),
          })
        }
      />
      <Select
        label="Groups:"
        defaultValue={deckSetup.groups}
        options={COMBINATIONS}
        onChange={(e) =>
          pokeMemoryGameStore.selectDeck({
            groups: Number(e.target.value),
          })
        }
      />
    </div>
  );
};
