const DriverListLoading = () => {
  return (
    <>
      {[...Array(20)].map((_, index) => (
        <li
          key={index}
          className={`flex h-4 w-[51px] items-center justify-end sm:h-5 sm:w-[58px] md:h-6 md:w-[68px] lg:h-7 lg:w-[79px]`}
        >
          <div className="h-4/5 w-full animate-pulse rounded-sm bg-neutral-700"></div>
        </li>
      ))}
    </>
  );
};
export default DriverListLoading;
