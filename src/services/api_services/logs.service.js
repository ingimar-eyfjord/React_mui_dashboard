import http from "./http-common";

class LogsDataService {
  async getAll() {
    const response = await http.get("/Logs");
    return response.data;
  }

  async getAllwithOptions(options) {
    const limit = options.limit;
    const offset = options.offset;
    let link = "/Logs";

    if (limit) {
      link = link + `?limit=${limit}`;
    }
    if (offset) {
      link = link + `?offset=${offset}`;
    }
    if (limit && offset) {
      link = `/Logs?limit=${limit}&offset=${offset}`;
    }

    const response = await http.get(link);
    return response.data;
  }

  async GetLogsForUser(UserUUID, Limit) {
    const response = await http.get(`/Logs/user/${UserUUID}/limit/${Limit}`);
    return response;
  }

  get(id) {
    return http.get(`/Logs/${id}`);
  }

  create(data) {
    return http.post("/Logs", data);
  }

  update(id, data) {
    return http.put(`/Logs/${id}`, data);
  }

  delete(id) {
    return http.delete(`/Logs/${id}`);
  }
}

export default new LogsDataService();
