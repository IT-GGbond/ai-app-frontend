import { axiosPost } from "../utils/axiosRequest";
import request from "../utils/request";
interface LlmReq {
  content: string;
  userId: string;
  sessionId: string;
}

// 如何携带参数
export const llmApi = {
  getLlm(content: string) {
    const res = request("GET", `/llm?content=${content}`);
    return res;
  },

  // llmNew
  sendToLlmNew(body: LlmReq) {
    return axiosPost("http://localhost:8080/llmNew", body);
  },
};
