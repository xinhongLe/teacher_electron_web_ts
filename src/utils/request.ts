import axios, { AxiosRequestConfig, AxiosRequestHeaders, Method } from "axios";
import { ElMessage, ILoadingInstance } from "element-plus";
import { clear, get, STORAGE_TYPES } from "./storage";
import router from "@/router/index";
import { initAllState } from "@/store";
import loading from "@/components/loading";

const http = axios.create({
    baseURL: "/",
    timeout: 150000
});

let loadingInstance: ILoadingInstance;

http.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        if (get(STORAGE_TYPES.SET_TOKEN)) {
            config.headers = {
                "Content-Type": "application/json-patch+json",
                ...config.headers,
                Token: get(STORAGE_TYPES.SET_TOKEN),
                Authorization: "Bearer" + " " + get(STORAGE_TYPES.SET_TOKEN)
            };
        }
        if (!config.headers?.noLoading) {
            loading.show();
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

http.interceptors.response.use(
    (response) => {
        loading.hide();
        const res = response.data;
        if (res.resultCode === 103) {
            ElMessage({
                message: "登录超时请重新登录",
                type: "error",
                duration: 5 * 1000
            });
            clear();
            initAllState();
            router.push("/login");
        } else if (res.resultCode !== 200) {
            ElMessage({
                message: res.resultDesc,
                type: "error",
                duration: 5 * 1000
            });
        }
        return response;
    },
    (error) => {
        loadingInstance?.close && loadingInstance.close();
        ElMessage({
            message: "请求失败",
            type: "error",
            duration: 5 * 1000
        });
        return Promise.reject(error);
    }
);

interface IRequest<T> {
    baseURL: string | undefined;
    url: string;
    method: Method;
    headers?: AxiosRequestHeaders
    data?: T
}

function request<T, U>(options: IRequest<T>): Promise<U> {
    return new Promise(resolve => {
        http(options).then(res => {
            resolve(res.data);
        });
    });
}

export default request;
