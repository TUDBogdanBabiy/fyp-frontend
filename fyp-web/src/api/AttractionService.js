import ApiService from "./ApiService";

const listService = new ApiService({ resource: "attractions" });
const addService = new ApiService({ resource: "attractions/add" });
const deleteService = new ApiService({ resource: "attractions/delete" });
const updateService = new ApiService({ resource: "attractions/update" });
export { listService, addService, updateService, deleteService };
