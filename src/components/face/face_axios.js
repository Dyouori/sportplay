import axios from "axios";
import Element from "element-ui";

const request = axios.create({
    baseURL: "http://localhost:9000",
    timeout: 15000,
    headers: { 'Content-Type': "application/json; charset=utf-8" }
});

// console.log("拿到token:", token);

request.interceptors.request.use(config => {
    const token = localStorage.getItem("token") // 直接获取，不需要JSON.parse
    console.log("拿到token:", token);
    
    config.headers['token'] = token;
    config.headers['face_token'] = localStorage.getItem("face_token");
    return config;
});

request.interceptors.response.use(
    ({ data }) => {
        if ([200, 201].includes(data.code)) return data;
        Element.Message.error(data.msg, { duration: 3000 });
        return Promise.reject(data.msg);
    },
    ({ msg }) => {
        Element.Message.error(msg, { duration: 3000 });
        return Promise.reject(msg);
    }
);

export default request;
