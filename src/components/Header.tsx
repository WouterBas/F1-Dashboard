import Link from "next/link";
const Header = () => {
  return (
    <header className=" flex items-center justify-between">
      <h1 className="text-2xl font-semibold uppercase sm:text-4xl">
        <Link href="/"> F1 Dashboard</Link>
      </h1>
    </header>
  );
};
export default Header;
