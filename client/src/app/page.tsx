import Form from "@/components/Form";
import { apiService } from "@/services/api.service";
import { Session } from "@/types/defentions";
import Link from "next/link";

export default async function Home() {
  async function fetchSessions() {
    const response = await apiService.get("session/all", {
      next: { revalidate: 600 },
    });
    const data: Session[] = await response.json();
    return data;
  }

  const sessions: Session[] = await fetchSessions();

  return (
    <>
      <main className="col-span-2 grid h-[calc(100dvh-36px)] items-center">
        <Form sessions={sessions} />
      </main>
      <Link className="absolute bottom-2 right-2" href="/admin">
        admin
      </Link>
    </>
  );
}
