export const BackCard = () => {
  return (
    <div className="card size-32 bg-linear-to-b from-(--color-primary) to-[#2d7dc1]">
      <div className="flex h-full w-full items-center justify-center">
        <div className="relative size-9 overflow-hidden rounded-full border-2 border-white bg-white shadow-inner">
          <div className="absolute inset-x-0 top-0 h-1/2 bg-red-500" />
          <div className="absolute inset-x-0 top-1/2 z-10 h-0.5 -translate-y-1/2 bg-black" />
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="size-3 rounded-full border-2 border-black bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
};
