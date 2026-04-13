import request from "../utils/request";

// 如何携带参数
export const llmApi = {
  getLlm(content: string) {
    const res = request('GET', `/llm?content=${content}`);
    return res;
  },
};
