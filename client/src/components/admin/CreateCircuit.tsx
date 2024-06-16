import { CircuitList } from "@/types";
import { apiService } from "@/services/api.service";
import CreateCircuitFrom from "@/components/admin/CreateCircuitForm";
import AdminInitializer from "@/components/admin/AdminInitializer";

const CreateCircuit = async () => {
  const respones = await apiService.get("circuit/all");
  const circuitList: CircuitList[] = await respones.json();

  return (
    <AdminInitializer circuitList={circuitList}>
      <CreateCircuitFrom circuitList={circuitList} />
    </AdminInitializer>
  );
};
export default CreateCircuit;
