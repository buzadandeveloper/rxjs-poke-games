const keyTitle = 'poke-best-turns';

export const saveBestTurns = (characters: number, group: number, turns: number) => {
  const key = `${keyTitle}_${characters}_${group}`;
  localStorage.setItem(key, String(turns));
};

export const loadBestTurns = (characters: number, group: number) => {
  const key = `${keyTitle}_${characters}_${group}`;
  const savedBestTurns = localStorage.getItem(key);
  return savedBestTurns ? Number(savedBestTurns) : 0;
};
