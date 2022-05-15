import axios from "axios";
export default axios.create({
  baseURL: "https://graph.microsoft.com/v1.0",
  headers: {
    "Content-type": "application/json",
  },
});
