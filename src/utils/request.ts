const baseUrl = "http://localhost:8000";

// 如何添加参数？？
const request = (method: "GET" | "POST", url: string, body?: undefined) => {
  const xhr = new XMLHttpRequest();
  xhr.open(method, baseUrl + url);
  // 返回数据处理，xhr事件监听
  // xhr.onreadystatechange = () => {
  //   // 1. 请求成功
  //   if(xhr.readyState === 4 && xhr.status === 200) {
  //     console.log(xhr.response);
  //     return xhr.response;
  //   }
  // };

  // post请求体
  xhr.send(body);

  // 请求完成
  xhr.onload = () => {
    console.log(xhr.status, xhr.response);
    return xhr.response;
  };
  xhr.onerror = () => {
    console.log("请求失败");
    return { code: 20001, data: "", message: "网络错误" };
  };
  return undefined;
};

export default request;
