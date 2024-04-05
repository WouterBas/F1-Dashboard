import Form from "@/components/Form";
import { Session } from "@/types/defentions";

export default async function Home() {
  async function fetchSessions() {
    const respone = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions`, {
      next: { revalidate: 600 },
    });
    const data = await respone.json();
    return data;
  }

  const sessions: Session[] = await fetchSessions();

  return (
    <>
      <main className="col-span-2 grid h-[calc(100dvh-36px)] items-center">
        <Form sessions={sessions} />
      </main>
    </>
  );
}
