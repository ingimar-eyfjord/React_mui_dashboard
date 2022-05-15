import axios from "axios";
import { Providers } from "@microsoft/mgt";
import TokenService from "./token.service";

async function GetToken(){
  let token;
  try {
    token = await Providers.globalProvider.getAccessToken({
      scopes: ["User.Read"],
    });
  } catch (error) {
    console.log(error)
  }
 return token
}

const instance = axios.create({
  baseURL: "https://api-dev.dialogueone.com/api",
  headers: {
    "Content-type": "application/json",
  },
});

instance.interceptors.request.use(
  async config => {
    const AccessToken = TokenService.getLocalAccessToken();
    const useruuid = TokenService.getUserID();
    const token = await GetToken()
    if (token) {
      config.headers.MSBearerToken = token
      config.headers["x-access-token"] = AccessToken;
      config.headers["useruuid"] = useruuid;
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    if (originalConfig.url !== "/auth/signin" && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        await instance.post("/auth/refreshtoken", {
          refreshToken: TokenService.getLocalRefreshToken(),
        }).then(function (data){
          const { accessToken } = data.data;
          TokenService.updateLocalAccessToken(accessToken);
          return instance(originalConfig);
        })
        .catch(function (_error) {
          return Promise.reject(_error);
        });
      }
    }
    return Promise.reject(err);
  }
);
export default instance