import http from "./http-common";

class TaskDataService {
  async GetAllInTeam(param) {
    const response = await http.get(`/Task/team/${param}`);
    return response.data;
  }
  async getAll() {
    const response = await http.get(`/Task`);
    return response.data;
  }
  get(id) {
    return http.get(`/Task/${id}`);
  }
  create(data) {
    return http.post("/Task", data);
  }
  update(id, data) {
    console.log(id, data)
    return http.put(`/Task/${id}`, data);
  }
  delete(id) {
    return http.delete(`/Task/${id}`);
  }
}

export default new TaskDataService();
