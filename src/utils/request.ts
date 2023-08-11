import axios, { AxiosRequestConfig, AxiosRequestHeaders, Method } from "axios";
import { ElMessage, MessageHandler } from "element-plus";
import { clear, get, STORAGE_TYPES } from "./storage";
import router from "@/router/index";
import { initAllState, store } from "@/store";
import loading from "@/components/loading";
import isElectron from "is-electron";
import moment from "moment";

const http = axios.create({
    baseURL: "/",
    timeout: 300000
});

let errMessageInstance: MessageHandler | undefined;

http.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        if (get(STORAGE_TYPES.SET_TOKEN)) {
            config.headers = {
                "Content-Type": "application/json-patch+json",
                ...config.headers,
                Token: get(STORAGE_TYPES.SET_TOKEN),
                startTime: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
                Authorization: "Bearer" + " " + get(STORAGE_TYPES.SET_TOKEN),
                OrgId: store.state.userInfo.schoolId
                    ? store.state.userInfo.schoolId
                    : get(STORAGE_TYPES.CURRENT_USER_INFO)?.schoolId
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

let messageInterface: MessageHandler | null = null;

http.interceptors.response.use(
    (response) => {
        if (!response.config.headers?.noLoading) loading.hide();
        const res = response.data;
        if (res.resultCode === 103) {
            if (!messageInterface) {
                messageInterface = ElMessage({
                    message: "登录超时请重新登录",
                    type: "error",
                    duration: 5 * 1000,
                    onClose: () => {
                        messageInterface = null;
                    }
                });
            }
            clear();
            window.electron.ipcRenderer.invoke("closeSuspension");
            window.electron.ipcRenderer.invoke("logout");
            initAllState();
        } else if (res.resultCode !== 200) {
            res.resultDesc &&
            ElMessage({
                message: res.resultDesc,
                type: "error",
                duration: 5 * 1000
            });
        }
        return response;
    },
    (error) => {
        loading.hide();
        if (error?.config && error.config.url === "Api/Track/create") {
            //
        } else {
            if (errMessageInstance) return;
            errMessageInstance = ElMessage({
                message: "请求失败",
                type: "error",
                duration: 5 * 1000,
                onClose: () => {
                    errMessageInstance = undefined;
                }
            });
        }
        return Promise.reject(error);
    }
);

interface IRequest<T>{
    baseURL: string | undefined;
    url: string;
    method: Method;
    headers?: AxiosRequestHeaders;
    data?: T;
    responseType?: string;
}

interface Request<T, U> {
    options: IRequest<T>;
    callback: (value: U | PromiseLike<U>) => void;
}

const queueMap = new Map();

class Queue<T, U> {
    requestList: Request<T, U>[] = [];
    isRequesting = false;
    add(data: Request<T, U>) {
        this.requestList.push(data);
        this.start();
    }

    start = async () => {
        if (this.isRequesting || this.requestList.length === 0) return;
        this.isRequesting = true;
        const [request] = this.requestList.splice(0, 1);
        try {
            const res = await http(request.options as any);
            request.callback(res.data);
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            request.callback({});
        }

        setTimeout(() => {
            // 300毫秒之后才能再次执行
            this.isRequesting = false;
            if (this.requestList.length !== 0) {
                this.start();
            } else {
                queueMap.delete(request.options.url);
            }
        }, 300);
    };
}

function request<T, U>(options: IRequest<T>): Promise<U> {
    return new Promise((resolve) => {
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
