async function fetchGet(url: string) {
//   return fetch(url, {
//     method: "GET",
//   });
    const res = await fetch(url, {
      method: "GET",
    });
    return res.json(); // 直接返回resolve服务器数据的Promise
}

function fetchPost(url = "", data = {}) {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    // 需要手动序列化，加上头部
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(res => res.json());
}

//  Failed to execute 'fetch' on 'Window': Request with GET/HEAD method cannot have body.
// async function fecthRequest(method: "GET" | "POST", url= '', data= {}) {
//   const response = await fetch(url, {
//     method,
//     body: JSON.stringify(data),
//   });
//   return response.json()
// }

export { fetchGet, fetchPost };
