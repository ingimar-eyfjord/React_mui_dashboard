import http from "./http-common";

class ScheduleDataService {
  getAll() {
    return http.get("/Schedule");
  }

  get(id) {
    return http.get(`/Schedule/${id}`);
  }
  
  async ExportReport(param) {
    try {
      const data = await http.get(`/Schedule/start/${param.start}/end/${param.end}`);
      if(data.data.length === 0){
        return data.data;
      }
      return data.data;
    } catch (error) {
      return []
    }
  }

  async GetNexDaysOnSchedule(date) {
    const data = await http.get(`/Schedule/NextDays/${date}`);
    return await data.data;
  }

  async GetByDayAndUser(param) {
    const data = await http.get(`/Schedule/user/${param.UserUUID}/start/${param.start}/end/${param.end}`);
    return data;
  }
  async GetBooked(param) {
    const data = await http.get(`/Schedule/start/${param.start}/end/${param.end}/tables`);
    return data;
  }
 
  async GetHoursForTheMonth(param) {
    const data = await http
      .get(`/Schedule/team/${param.team}/month/${param.start}/sum/hours`)
      .catch(function (error) {
        console.log(error);
        return error;
      });
    return data;
  }
  async ExportScheduleMonthlyByTeam(param) {
    try {
      const data = await http.get(`/Schedule/team/${param.team}/month/${param.start}`);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  async GetMonthlyHours(param) {
    try {
      const data = await http.get(`/Schedule/month/${param.start}/sum/hours`);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  async GetMonthlyHoursByUserArray(param) {
    try {
      const data = await http.get(`/Schedule/users/${param.set}/month/${param.start}/sum/hours`);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  async GetScheduledHoursForUserPeriod(param) {
    try {
      const data = await http.get(`/Procedure/GetScheduledHoursForUserPeriod/${JSON.stringify(param)}`);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async pingTrueFalse(param) {
    try {
      const data = await http.get(`/Schedule/user/${param.uuid}/start/${param.start}/end/${param.end}/ping`);
      return data;
    } catch (error) {
      return error;
    }
  }

  create(data) {
    return http.post("/Schedule", data);
  }

  async Import(param) {
    try {
      const data = await http.post(`/Schedule/import`, param);
      return data;
    } catch (error) {
      return "error";
    }
}

  update(id, data) {
    return http.put(`/Schedule/${id}`, data);
  }

  delete(id) {
    return http.delete(`/Schedule/${id}`);
  }


}

export default new ScheduleDataService();

