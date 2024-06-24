export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="col-span-2 grid grid-rows-[1fr_auto]">{children}</main>
    </>
  );
}
