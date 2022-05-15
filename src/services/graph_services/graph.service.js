import http from "./http-common";
import imageHTTP from "./http-Image";

class GraphInfoService {
  async getMe(token) {
    const response = await http.get("/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
  async GetMePic(token, user) {
    const response = await http
      .get(`/users/${user}/photos/120x120/$value`, {
        headers: {
          "Content-Type": "image/jpg",
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      })
      .catch(function (error) {
        // console.clear();
      });
    if (response === undefined) {
      return undefined;
    } else {
      return response.data;
    }
  }

  async GetUserInfo(token, email) {
    const response = await http
      .get(`/users/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch(function (error) {
        // console.clear();
      });
    if (response === undefined) {
      return undefined;
    } else {
      return response.data;
    }
  }
  async UpdateTask(token, data, todoTaskListId, taskId){
    const response = await http.patch(`/me/todo/lists/${todoTaskListId}/tasks/${taskId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
  async GetPresence(token, email) {
    const response = await http.get(`/users/${email}/presence`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  async ChangeImage(token, imageFile) {
    const response = await imageHTTP.put(`/me/photo/$value`, imageFile, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }
  async GetAdmins(token, id) {
    const response = await imageHTTP.get(`/groups/${id}/members`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  async GetProjectGroups(token, startsWith) {
    const response = await imageHTTP.get(`/groups?$filter=startswith(displayName,'${startsWith}')`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  

  // function initiateXMLHttpRequest(cb) {
  //     var token = retrieveAccessToken();
  //     var xhr = new XMLHttpRequest();
  //     xhr.responseType = 'application/json'
  //     if (token) {
  //       xhr.open('GET', `https://graph.microsoft.com/v1.0/me`, true);
  //       xhr.setRequestHeader('Authorization', `Bearer ${token}`);
  //       xhr.send(null);
  //     }

  //     xhr.onreadystatechange = function () {
  //       var DONE = 4;
  //       var OK = 200;
  //       if (xhr.readyState == DONE) {
  //         if (xhr.status == OK) cb(xhr);
  //       }
  //     };
  //   }
  //   function AjaxGetMe() {
  //     var token = retrieveAccessToken();
  //     return Promise.resolve($.ajax({
  //       type: "GET",
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //       },
  //       url: `https://graph.microsoft.com/v1.0/me`,
  //     }));
  //   }

  // get(id) {
  //     return http.get(`/Locations/${id}`);
  // }

  // create(data) {
  //     return http.post("/Locations/create", data);
  // }

  // update(id, data) {
  //     return http.put(`/Locations/${id}`, data);
  // }

  // delete(id) {
  //     return http.delete(`/Locations/${id}`);
  // }
}

export default new GraphInfoService();
