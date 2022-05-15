import http from "./http-common";

class TeamsDataService {
  async getAll(token) {
    const response = await http.get("/Teams");
    return response.data;
  }

  get(id) {
    return http.get(`/Teams/${id}`);
  }

  create(data) {
    return http.post("/Teams/create", data);
  }

  update(id, data) {
    return http.put(`/Teams/${id}`, data);
  }

  delete(id) {
    return http.delete(`/Teams/${id}`);
  }
}

export default new TeamsDataService();
