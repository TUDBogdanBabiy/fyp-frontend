import {
  listService,
  addService,
  updateService,
  deleteService
} from "../../api/AttractionService";

const SET_ATTRACTIONS = "SET_ATTRACTIONS";

const state = {
  attractions: []
};

const getters = {
  attractions: state => state.attractions
};

const actions = {
  async updateAttraction(context, { id, data }) {
    await updateService.update(id, data);
    return await context.dispatch("listAttractions");
  },
  async deleteAttraction(context, id) {
    await deleteService.delete(id);
    return await context.dispatch("listAttractions");
  },
  async addAttraction(context, data) {
    await addService.create(data);
    return await context.dispatch("listAttractions");
  },
  async listAttractions(context) {
    const attractions = await listService.list();
    context.commit(SET_ATTRACTIONS, attractions);
  }
};

const mutations = {
  [SET_ATTRACTIONS](state, attractions) {
    state.attractions = attractions;
  }
};

export default {
  state,
  actions,
  getters,
  mutations
};
