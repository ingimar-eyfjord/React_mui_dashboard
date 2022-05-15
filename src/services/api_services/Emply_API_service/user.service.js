import AuthService from "../auth.service";
import http from "../http-common";

class EmplyService {


  async RetrieveDepartments(token){
    const response = await http.get(`/Emply/depertments`);
    return response.data;
  }

  async GetUserWUUID() {
  const user = AuthService.getCurrentUser();
    const response = await http.get(`/Emply/user/UserUUID/${user.id}`, {
    });
    return response.data;
  }

  async GetMasterDataID(EmplyUUID, token) {
    const response = await http.get(`/Emply/employee/${EmplyUUID}/masterData`);
    return response.data;
  }

  async GetContactDataID(EmplyUUID, token) {
    const response = await http.get(`/Emply/employee/${EmplyUUID}/contactData`);
    return response.data;
  }

  async GetEmployeeByEmail(email, token) {
  const user = AuthService.getCurrentUser();

    const response = await http.get(`/Emply/employee/${user.email}`);
    return response.data;
  }

  async UpdateEmployeeInfo(data, employeeId, token){
    const response = await http.put(`/Emply/employee/${employeeId}/masterData`, data);
    return response.data;
  }

  async GetAllEmplyEmployees(token){
    const response = await http.get(`/Emply/employees`);
    return response.data;
  }

  async GetAllEmplyUsers(token){
    const response = await http.get(`/Emply/users`);
    return response.data;
  }
}


export default new EmplyService();
