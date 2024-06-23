import Link from "next/link";
const Header = () => {
  return (
    <h1 className="text-2xl font-semibold uppercase sm:text-3xl md:text-4xl lg:text-[42px]">
      <Link href="/"> F1 Dashboard</Link>
    </h1>
  );
};
export default Header;
