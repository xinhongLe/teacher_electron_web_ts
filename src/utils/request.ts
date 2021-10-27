import axios, { AxiosRequestConfig } from "axios";
import { ElMessage, ElLoading, ILoadingInstance, ElTreeV2 } from "element-plus";
import { clear, get } from "./storage";
import router from "@/router/index";
import { IResponse } from "@/types/response";

const http = axios.create({
    baseURL: "/",
    timeout: 150000,
});

let loadingInstance: ILoadingInstance;

http.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        if (get("SET_TOKEN")) {
            config.headers = {
                "Content-Type": "application/json-patch+json",
                ...config.headers,
                Token: get("SET_TOKEN"),
                Authorization: "Bearer" + " " + get("SET_TOKEN"),
            };
        }
        if (!config.headers?.noLoading) loadingInstance = ElLoading.service({});

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

http.interceptors.response.use(
    (response) => {
        loadingInstance.close();
        const res = response.data;
        if (res.resultCode === 103) {
            ElMessage({
                message: "登录超时请重新登录",
                type: "error",
                duration: 5 * 1000,
            });
            clear();
            router.push("/login");
        } else if (res.resultCode !== 200) {
            ElMessage({
                message: res.resultDesc,
                type: "error",
                duration: 5 * 1000,
            });
        }
        return response;
    },
    (error) => {
        loadingInstance.close();
        ElMessage({
            message: "请求失败",
            type: "error",
            duration: 5 * 1000,
        });
        return Promise.reject(error);
    }
);

interface IRequest<T> {
    baseURL: string | undefined;
    url: string;
    method: string;
    data?: T
}

function request(options: IRequest<T>) : Promise<> {
    return new Promise(resolve => {
        http(options).then(res => {
            resolve(res.data);
        })
    })
}

export default request;
