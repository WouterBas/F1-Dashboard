import { CircuitList } from "@/types";
import { apiService } from "@/services/api.service";
import CreateCircuitFrom from "@/components/admin/CreateCircuitForm";

const CreateCircuit = async () => {
  const respones = await apiService.get("circuit/all");
  const circuitList: CircuitList[] = await respones.json();

  return <CreateCircuitFrom circuitList={circuitList} />;
};
export default CreateCircuit;
