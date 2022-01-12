import axios, { AxiosRequestConfig, AxiosRequestHeaders, Method } from "axios";
import { ElMessage } from "element-plus";
import { clear, get, STORAGE_TYPES } from "./storage";
import router from "@/router/index";
import { initAllState } from "@/store";
import loading from "@/components/loading";

const http = axios.create({
    baseURL: "/",
    timeout: 150000
});

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
            router.push("/login");
            // 登录超时，外部系统返回登录页
            if (window.location.href.indexOf("iframeToken") > -1 && window.top) {
                if (window.parent && window.parent.window && window.parent.window[0] && window.parent.window[0].location && window.parent.window[0].location.ancestorOrigins) {
                    window.top.location.href = `${window.parent.window[0].location.ancestorOrigins[0]}?isReset=true`;
                } else if (window.top && window.top.parent) {
                    window.top.location.href = `${window.top.parent}?isReset=true`;
                } else if (window.location && window.location.origin) {
                    window.top.location.href = `${window.location.origin}?isReset=true`;
                }
            }
            initAllState();
        } else if (res.resultCode !== 200) {
            res.resultDesc && ElMessage({
                message: res.resultDesc,
                type: "error",
                duration: 5 * 1000
            });
        }
        return response;
    },
    (error) => {
        loading.hide();
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

interface Request<T, U> {
    options: IRequest<T>,
    callback: (value: U | PromiseLike<U>)=> void
}

const queueMap = new Map();

class Queue<T, U> {
    requestList: Request<T, U>[] = []
    isRequesting = false
    add(data: Request<T, U>) {
        this.requestList.push(data);
        this.start();
    }

     start = async () => {
         if (this.isRequesting || this.requestList.length === 0) return;
         this.isRequesting = true;
         const [request] = this.requestList.splice(0, 1);
         try {
             const res = await http(request.options);
             request.callback(res.data);
         } catch (error) {
             // eslint-disable-next-line @typescript-eslint/ban-ts-comment
             // @ts-ignore
             request.callback({});
         }

         setTimeout(() => { // 300毫秒之后才能再次执行
             this.isRequesting = false;
             if (this.requestList.length !== 0) {
                 this.start();
             } else {
                 queueMap.delete(request.options.url);
             }
         }, 300);
     }
}

function request<T, U>(options: IRequest<T>): Promise<U> {
    return new Promise(resolve => {
        if (queueMap.has(options.url)) {
            const queue = queueMap.get(options.url);
            queue.add({ options, callback: resolve });
        } else {
            const queue = new Queue<T, U>();
            queueMap.set(options.url, queue);
            queue.add({ options, callback: resolve });
        }
    });
}

export default request;
