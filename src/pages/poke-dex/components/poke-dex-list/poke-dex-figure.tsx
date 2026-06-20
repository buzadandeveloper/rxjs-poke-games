interface PokeDexFigureProps {
  name: string;
  src: string;
}

export const PokeDexFigure = ({ name, src }: PokeDexFigureProps) => {
  return (
    <figure className="bg-base-200 py-2 px-4">
      <img
        src={src}
        alt={name}
        className="h-32 w-32 object-contain opacity-0 transition-opacity duration-300"
        onLoad={(e) => {
          e.currentTarget.classList.remove('opacity-0');
          e.currentTarget.classList.add('opacity-100');
        }}
      />
    </figure>
  );
};
