import http from "./http-common";

class SupplementDataService {
  async GetEverything() {
    const response = await http.get(`/Supplements`);
    return response.data;
  }

  get(id) {
    return http.get(`/Supplements/${id}`);
  }

  create(data) {
    return http.post("/Supplements", data);
  }

  update(id, data) {
    return http.put(`/Supplements/${id}`, data);
  }

  delete(id) {
    return http.delete(`/Supplements/${id}`);
  }
  
}

export default new SupplementDataService();
