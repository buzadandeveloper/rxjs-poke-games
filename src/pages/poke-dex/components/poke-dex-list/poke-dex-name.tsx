interface PokeDexNameProps {
  id: number;
  name: string;
}

export const PokeDexName = ({ id, name }: PokeDexNameProps) => {
  return (
    <div className="flex items-baseline justify-between">
      <h2 className="card-title text-base capitalize">{name}</h2>
      <span className="text-xs text-base-content/40 font-mono">#{String(id).padStart(3, '0')}</span>
    </div>
  );
};
