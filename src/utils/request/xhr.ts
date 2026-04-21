// 原生ajax，直接return 误区： 在 onload 里的 return 只会返回给回调，不会返回给 xhrGet
// 思考：怎么让调用方获得异步函数的返回值
// 改进：改成 Promise 版本，让调用方用 async/await 或 then 拿结果。
function xhrGet(url: string) {
  const xhr = new XMLHttpRequest();
  // 参数直接携带在open，但是最好对url做编码，避免中文乱码
  xhr.open("GET", url);
  xhr.timeout = 3000;
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      console.log("成功获取");
    }
    // 其他错误处理
  };
  xhr.onerror = function() {
    // 无法发出请求，例如网络中断或者无效的 URL
    console.log('请检查你的网络或者路径是否正确');
  }

  // 超时处理
  xhr.ontimeout = function() {
    alert('网络异常，请稍后重试')
  }
  xhr.send();
  console.log("同步代码执行完毕");
}

function xhrPost(url: string, body: any) {
  const xhr = new XMLHttpRequest();
  // 参数直接携带在open
  xhr.open("POST", url);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.responseType = 'json';

  xhr.onload = function () {
    // 后端设置了响应头的 Content-Type为json，这里的数据要转换为对象
    // 1. 手动 JSON.parse
    // console.log(JSON.parse(xhr.response));
    // 2. xhr设置responseType为 json，自动 parse，打印出来的就是对象
    console.log(xhr.response);
    console.log("成功post");
  };
  xhr.send(JSON.stringify(body));

  console.log("同步代码执行完毕");
}

export { xhrGet, xhrPost };
