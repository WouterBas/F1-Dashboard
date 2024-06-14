import Link from "next/link";
const Header = () => {
  return (
    <header className="flex w-fit">
      <h1 className="text-2xl font-semibold uppercase sm:text-3xl md:text-4xl lg:text-[42px]">
        <Link href="/"> F1 Dashboard</Link>
      </h1>
    </header>
  );
};
export default Header;
