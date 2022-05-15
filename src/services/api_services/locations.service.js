import http from "./http-common";

class LocationsDataService {
  async getAll() {
    const response = await http.get("/Locations");
    return response.data;
  }
  get(id) {
    return http.get(`/Locations/${id}`);
  }
  create(data) {
    return http.post("/Locations", data);
  }
  update(id, data) {
    return http.put(`/Locations/${id}`, data);
  }
  delete(id) {
    return http.delete(`/Locations/${id}`);
  }
}

export default new LocationsDataService();
