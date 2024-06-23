import Header from "@/components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header>
        <Header />
      </header>
      <main className="grid grid-rows-[1fr_auto]">{children}</main>
    </>
  );
}
