import http from "./http-common";

class BankDataService {

  async getDebitHours(param) {
    const data= await http.get(`/Ledger/user/${param.user_uuid}/period/${param.period_id}/debit?filter=${JSON.stringify(param.filter)}`);

    return data;
  }

  async getCreditHours(param) {
    const data= await http.get(`/Ledger/user/${param.user_uuid}/period/${param.period_id}/credit?filter=${JSON.stringify(param.filter)}`);
    return data;
  }

  async getNetHoursInSalaryPeriod(param) {
    const data= await http.get(`/Ledger/user/${param.user_uuid}/period/${param.period_id}/net?filter=${JSON.stringify(param.filter)}`);
    return data;
  }

  async getLedgerByUser(param) {
      const data = await http.get(`/Ledger/user/${param.user_uuid}/period/${param.id}?filter=${JSON.stringify(param.filter)}`);
      return data;
  }

  async create (data) {
    const response = await http.post("/Ledger", data)
    return response
  }

  async getBySalaryPeriod (period_id) {
    return http.get(`/Ledger/period/${period_id}`);
  }


}

export default new BankDataService();