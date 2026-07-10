import { Select } from './select';
import { pokeMemoryGameStore } from '#stores';

const COMBINATIONS = [2, 3, 4, 5];

export const SelectDeck = () => {
  const deckSetup = pokeMemoryGameStore.deckSetup$.value;

  return (
    <div className="flex gap-4">
      <Select
        label="Characters:"
        defaultValue={deckSetup.items}
        options={COMBINATIONS}
        onChange={(e) =>
          pokeMemoryGameStore.selectDeck({
            items: Number(e.target.value),
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
