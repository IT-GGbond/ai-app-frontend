import { axiosGet, axiosPost } from "../utils/axiosRequest";

// 可以定义接口的返回值类型是什么，这样通过接口调用，返回的数据就知道类型，并且编写代码的时候有提示
export const sessionApi = {
  getList(userId: string) {
    return axiosGet(`http://localhost:8080/session/list?userId=${userId}`);
  },
  getDetail(userId: string, sessionId: string) {
    return axiosGet(
      `http://localhost:8080/session/detail?userId=${userId}&sessionId=${sessionId}`,
    );
  },
};
