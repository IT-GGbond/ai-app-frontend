import axios from "axios"

function axiosGet(url = '') {
    return axios.get(url).then(res => res.data)
}

// post的请求体自动序列化，携带请求头，服务器返回的数据在response的data属性中，已经自动parse
async function axiosPost(url = '', data = {}) {
    const res = await axios.post(url, data)
    return res.data
}

export {
    axiosGet,
    axiosPost,
}