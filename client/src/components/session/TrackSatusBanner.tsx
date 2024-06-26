const TrackSatusBanner = ({
  textColor,
  borderColor,
  trackStatus,
  icon,
}: {
  textColor: string;
  borderColor: string;
  trackStatus: string;
  icon: JSX.Element;
}) => {
  return (
    <p
      className={`${textColor} ${borderColor} absolute right-0 z-10 flex items-center gap-2 rounded-sm border bg-neutral-800/75 px-1 text-xs sm:right-2 sm:top-2 sm:px-1.5 sm:py-0.5 sm:text-sm md:right-3 md:top-3 md:rounded md:border-2 md:px-2 md:py-1 md:text-base lg:text-lg`}
    >
      {icon}
      {trackStatus}
    </p>
  );
};
export default TrackSatusBanner;
