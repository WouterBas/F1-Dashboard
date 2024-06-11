import Login from "@/components/Login";
import CreateCircuit from "@/components/CreateCircuit";
import { cookies } from "next/headers";
import { apiService } from "@/services/api.service";

const Page = async () => {
  const nextCookies = cookies();
  const accessToken = nextCookies.get("F1-Dashboard");

  try {
    await apiService.get(`auth/login`, {
      headers: {
        Cookie: `F1-Dashboard=${accessToken?.value}`,
      },
    });
    return <CreateCircuit />;
  } catch (error) {
    return <Login />;
  }
};

export default Page;
