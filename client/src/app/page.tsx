import Form from "@/components/Form";
import { apiService } from "@/services/api.service";
import { SessionList } from "@/types";

export default async function Home() {
  async function fetchSessions() {
    const response = await apiService.get("session/all", {
      next: { revalidate: 600 },
    });
    const data: SessionList[] = await response.json();
    return data;
  }

  const sessions: SessionList[] = await fetchSessions();

  return (
    <>
      <main className="col-span-2 grid h-[calc(100dvh-36px)] items-center">
        <Form sessions={sessions} />
      </main>
    </>
  );
}
