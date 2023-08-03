import axios, { AxiosRequestConfig, AxiosRequestHeaders, Method } from "axios";

const httpPPt = axios.create({
    baseURL: "https://ppt-parse.aixueshi.top"
});

interface IRequest<T> {
    baseURL?: string | undefined;
    url: string;
    method: Method;
    headers?: AxiosRequestHeaders
    data?: T,
    processData?: boolean,
    enctype?: string
    contentType?: boolean
}

function request<T, U>(options: IRequest<T>): Promise<U> {
    return new Promise(resolve => {
        httpPPt(options).then(res => {
            resolve(res.data);
        });
    });
}

export function parsePPTX(pptxFile: any): Promise<any> {
    const formData = new FormData();
    formData.append("file", pptxFile);
    return request({
        url: "/ppt-parse",
        method: "POST",
        data: formData,
        contentType: false,
        enctype: "multipart/form-data"
    });
}
