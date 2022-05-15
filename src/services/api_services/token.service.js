class TokenService {
    getLocalRefreshToken() {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.refreshToken;
    }
    getLocalAccessToken() {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.accessToken;
    }
    getLocalBearerToken() {
        const user = JSON.parse(localStorage.getItem("user"));
        return user?.Bearer;
      }
    updateLocalAccessToken(token) {
      let user = JSON.parse(localStorage.getItem("user"));
      user.accessToken = token;
      localStorage.setItem("user", JSON.stringify(user));
    }
    getUser() {
      return JSON.parse(localStorage.getItem("user"));
    }
    getRoles() {
      const user = JSON.parse(localStorage.getItem("user"));
        return user?.Role;
    }
    getUserID() {
        let user = JSON.parse(localStorage.getItem("user"));
        return user?.id;
      }
    setUser(user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
    removeUser() {
      localStorage.removeItem("user");
    }
  }
  export default new TokenService();