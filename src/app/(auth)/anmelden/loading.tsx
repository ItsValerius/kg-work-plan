const loading = () => {
  return (
    <main
      role="status"
      aria-busy="true"
      aria-label="Anmeldung wird geladen"
      className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-[1fr_minmax(0,440px)] md:items-center md:gap-16 md:py-16 lg:px-8"
    >
      <div aria-hidden="true" className="space-y-5">
        <span className="skeleton h-5 w-40" />
        <span className="skeleton hidden size-28 rounded-full md:block" />
        <span className="skeleton h-12 w-56" />
        <span className="skeleton h-5 w-full max-w-sm" />
      </div>
      <span aria-hidden="true" className="skeleton h-80 rounded-xl" />
    </main>
  );
};

export default loading;
