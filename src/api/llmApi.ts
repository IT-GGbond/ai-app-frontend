import { axiosPost } from "../utils/axiosRequest";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import request from "../utils/request";
interface LlmReq {
  content: string;
  userId: string;
  sessionId: string | undefined;
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

  // llmSSE
  async sendToLlmSSE(body: LlmReq, callback: (ev) => void) {
    const ctrl = new AbortController();
    await fetchEventSource("http://localhost:8080/llmSSE", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: ctrl.signal,
      onmessage(ev) {
        if (ev.data === "[DONE]") {
          // 利用fetch原生正常终止
          ctrl.abort();
        }
        callback(ev);
      },
    });
  },
};
