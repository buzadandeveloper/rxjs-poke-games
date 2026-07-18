interface FrontCardProps {
  name: string;
  src: string;
  isFlipped: boolean;
}

export const FrontCard = ({ name, src, isFlipped }: FrontCardProps) => {
  return (
    <div className="card size-32 overflow-hidden bg-linear-to-b from-(--color-primary) to-[#2d7dc1]">
      <figure className="p-4">
        <div className="size-24 ">
          {isFlipped && <img src={src} alt={name} className="object-contain" />}
        </div>
      </figure>
    </div>
  );
};
