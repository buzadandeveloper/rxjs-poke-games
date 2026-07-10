export const BackCard = () => {
  return (
    <div className="card size-32 bg-linear-to-b from-(--color-primary) to-[#2d7dc1]">
      <div className="flex h-full w-full items-center justify-center">
        <div className="size-10 rounded-full border-2 border-white bg-white relative overflow-hidden shadow-inner">
          <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 bg-black" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-3 rounded-full border-2 border-black bg-white" />
          </div>
          <div className="absolute inset-0 top-0 h-1/2 bg-red-500" />
        </div>
      </div>
    </div>
  );
};
