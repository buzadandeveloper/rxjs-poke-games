const technologies = [
  { name: 'React', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg' },
  { name: 'RxJS', logo: 'https://rxjs.dev/generated/images/marketing/home/Rx_Logo-512-512.png' },
];

export const ProjectInfo = () => {
  return (
    <section className="mx-auto max-w-xl" aria-labelledby="project-info-title">
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body gap-4 p-5">
          <div className="flex items-center gap-3">
            <div className="avatar-group -space-x-3">
              {technologies.map((technology) => (
                <div key={technology.name} className="avatar">
                  <div className="w-12 rounded-full border-2 border-base-100 bg-white p-2">
                    <img src={technology.logo} alt={`${technology.name} logo`} />
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div className="badge badge-primary badge-outline">Learning project</div>
              <h1 id="project-info-title" className="mt-1 text-lg font-bold">
                React + RxJS Poké Games
              </h1>
            </div>
          </div>

          <p className="text-sm leading-6 text-base-content/70">
            A small playground for learning RxJS and seeing how observables, streams, and operators
            work in a React application.
          </p>

          <div className="flex flex-wrap gap-2">
            <span className="badge badge-primary badge-soft">React</span>
            <span className="badge badge-secondary badge-soft">RxJS</span>
            <span className="badge badge-accent badge-soft">TypeScript</span>
          </div>
        </div>
      </div>
    </section>
  );
};
