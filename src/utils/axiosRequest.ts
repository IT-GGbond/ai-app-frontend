import axios from "axios"

function axiosGet(url = '') {
    return axios.get(url).then(res => res.data)
}

// post的请求体自动序列化，携带请求头，服务器返回的数据在response的data属性中，已经自动parse
async function axiosPost(url = '', data = {}) {
    const res = await axios.post(url, data)
    return res.data
}
// 如何统一封装，axios的特点：拦截器
// 避免在每个 API 调用处重复写相同的错误提示逻辑。
// 1. 处理响应, baseURL
// 2. 错误处理（业务错误/请求错误），弹窗显示
export {
    axiosGet,
    axiosPost,
}