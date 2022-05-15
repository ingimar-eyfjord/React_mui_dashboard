import http from "./http-common";

class ProjectDataService {
  async getAll() {
    const response = await http.get(`/Project`);
    return response.data;
  }

  get(id) {
    return http.get(`/Project/${id}`);
  }

  create(data) {
    return http.post("/Project", data);
  }

  update(id, data) {
    console.log(id, data)
    return http.put(`/Project/${id}`, data);
  }

  delete(id) {
    return http.delete(`/Project/${id}`);
  }

  async GetAllInTeam(team) {
    const response = await http.get(`/Project/team/${team}`);
    return response.data;
  }
}

export default new ProjectDataService();
