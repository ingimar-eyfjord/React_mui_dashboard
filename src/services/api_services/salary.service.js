import http from "./http-common";

class SalaryService {
  find_periods_in_year(year) {
    return http.get(`/Salary/periods/year/${year}`);
  }

  find_periods_in_year_name(year) {
    return http.get(`/Salary/periods/year/${year}/name`);
  }

  find_period_by_month(month) {
    return http.get(`/Salary/period/month/${month}`);
  }
  get_period_by_date(param) {
    return http.get(
      `/Salary/period/between/${param.now}/user/${param.UserUUID}/sum/hours`
    );
  }
  get_period_using_date(param) {
    return http.get(`/Salary/period/date/${param}`);
  }

  export_salary(param) {
    return http.get(`/Salary/export/period/${param.id}`);
  }

  get_current_period() {
    return http.get(`/Salary/period/current`);
  }

  async create_period(data) {
    try {
      const create = await http.post("/Salary/period", data);
      return create;
    } catch (error) {
      return error;
    }
  }

  update_period(id, data) {
    return http.put(`/Salary/period/${id}`, data);
  }

  delete_period(id) {
    return http.delete(`/Salary/period/${id}`);
  }
}

export default new SalaryService();
