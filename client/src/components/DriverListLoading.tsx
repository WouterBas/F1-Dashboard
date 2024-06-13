const DriverListLoading = () => {
  return (
    <>
      {[...Array(20)].map((_, index) => (
        <li
          key={index}
          className={`flex h-4 w-[79px] items-center justify-end sm:h-5 md:h-6 lg:h-7`}
        >
          <div className="h-4/5 w-full animate-pulse rounded-sm bg-neutral-700"></div>
        </li>
      ))}
    </>
  );
};
export default DriverListLoading;
