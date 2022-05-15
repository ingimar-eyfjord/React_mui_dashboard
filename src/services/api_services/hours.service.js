import http from "./http-common";
import moment from "moment"
class HoursDataService {
  getAll() {
    return http.get("/Hours");
  }

  get(id) {
    return http.get(`/Hours/${id}`);
  }

  create(data) {
    return http.post("/Hours", data);
  }

  update(id, data) {
    return http.put(`/Hours/${id}`, data);
  }

  delete(id) {
    return http.delete(`/Hours/${id}`);
  }
  Bulkdelete(payload) {
    return http.delete("/Hours/delete/bulk", {
      data:
        payload
    });
  }
  async ExportHoursForPerson(param) {
    const data = await http.get(`/Hours/user/${param.uuid}/start/${param.start}/end/${param.end}`);
    return data;
  }

  async ExportReport(param) {
    const data = await http.get(`/Hours/start/${param.start}/end/${param.end}`);
    return data;
  }

  async sumByMonth(param) {
    const params = {
      start: param.start,
      end: param.end,
      user: param.userUUID
    }
    const data = await http.get(`/Hours/user/${params.user}/start/${params.start}/end/${params.end}/sum/hours`);
    return data;
  }

  async getHoursInSalaryPeriod(param) {
    const data = await http.get(`/Hours/user/${param.user_uuid}/period/${param.period_id}?filter=${JSON.stringify(param.filter)}`);
    return data;
  }

  async Treenation(param) {
    const params = {
      start: moment().startOf("month").startOf("day").format(),
      end: moment().endOf("month").endOf("day").format(),
    }
    const data = await http.get(`/Hours/user/${param}/start/${params.start}/end/${params.end}/sum/meetings`);
    return data;
  }
  async AvgContacts(param) {
    const params = {
      start: moment().startOf("month").startOf("day").format(),
      end: moment().endOf("month").endOf("day").format(),
    }

    const data = await http.get(`/Hours/user/${param}/start/${params.start}/end/${params.end}/avg/contacts`);
    return data;

  }

}

export default new HoursDataService();

