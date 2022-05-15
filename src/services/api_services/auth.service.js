import http from "./http-common";

import TokenService from "./token.service";

class AuthService {
  async login(parameters) {
    const response = await http.post("/auth/signin", {token: parameters});
    if (response.data.accessToken) {
      TokenService.setUser(response.data);
    }
    return response.data;
  }

  logout() {
    TokenService.removeUser();
  }

  register(username, email, password) {
    return http.post("/auth/signup", {
      username,
      email,
      password,
    });
  }

  getCurrentUser() {
    return TokenService.getUser();
  }
}
export default new AuthService();
