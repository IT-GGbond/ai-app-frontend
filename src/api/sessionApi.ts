import { axiosGet, axiosPost } from "../utils/axiosRequest";

export const sessionApi = {
  create(userId: string) {
    return axiosGet(`http://localhost:8080/session/create?userId=${userId}`);
  },
  getList(userId: string) {
    return axiosGet(`http://localhost:8080/session/list?userId=${userId}`);
  },
  getDetail(userId: string, sessionId: string) {
    return axiosPost(
      `http://localhost:8080/session/detail?userId=${userId}&sessionId=${sessionId}`,
    );
  },
};
