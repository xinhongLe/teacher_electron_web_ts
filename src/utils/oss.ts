import OSS from "ali-oss";
import SparkMD5 from "spark-md5";
import { getOssToken } from "@/api";
import { throttle } from "lodash";
import { IOssPaths, IOssUploadRes } from "@/types/oss";

// 上传
export const cooOss = function (
    file: File & Blob,
    OssPaths: IOssPaths
): Promise<IOssUploadRes | null> {
    return new Promise((resolve) => {
        fileMd5(file, async (md5) => {
            const fileExtension =
                file.name.split(".")[file.name.split(".").length - 1];
            const name = md5;
            const objectKey = OssPaths.Path + "/" + name + "." + fileExtension;
            const ossToken = await getToken();
            const region = "oss-cn-shanghai";
            const accessKeyId = ossToken && ossToken.AccessKeyId;
            const accessKeySecret = ossToken && ossToken.AccessKeySecret;
            const securityToken = ossToken && ossToken.SecurityToken;
            const bucket = OssPaths.Bucket;
            const client = new OSS({
                region: region,
                accessKeyId: accessKeyId,
                accessKeySecret: accessKeySecret,
                stsToken: securityToken,
                bucket: bucket,
            });
            return client
                .multipartUpload(objectKey, file, {})
                .then(() => {
                    return resolve({
                        code: 200,
                        objectKey: objectKey,
                        name: name,
                        fileExtension: fileExtension,
                        msg: "ok",
                        md5,
                    });
                })
                .catch((err: Error) => {
                    console.error("上传出错了", err);
                });
        });
    });
};

const getToken = throttle(async function () {
    const time = Number(localStorage.getItem("ossTokenExpireTime") || 0);
    const currentTime = new Date().getTime();
    if (currentTime > time) {
        const res = await getOssToken();
        if (res.resultCode === 200) {
            localStorage.setItem(
                "ossTokenExpireTime",
                `${new Date().getTime() + 3000000}`
            );
            localStorage.setItem(
                "ossToken",
                JSON.stringify(res.result.ossToken)
            );
            return res.result.ossToken;
        } else {
            return JSON.parse(<string>localStorage.getItem("ossToken"));
        }
    } else {
        return JSON.parse(<string>localStorage.getItem("ossToken"));
    }
}, 500);

// const getToken = async() => {
//     const time = Number(localStorage.getItem("ossTokenExpireTime") || 0);
//     const currentTime = new Date().getTime();
//     if (currentTime > time) {
//         const res = await getOssToken();
//         if (res.resultCode === 200) {
//             localStorage.setItem("ossTokenExpireTime", new Date().getTime() + 3000000);
//             localStorage.setItem(
//                 "ossToken",
//                 JSON.stringify(res.result.ossToken)
//             );
//             return res.result.ossToken;
//         } else {
//             return JSON.parse(localStorage.getItem('ossToken'));
//         }
//     } else {
//         return JSON.parse(localStorage.getItem('ossToken'));
//     }
// }

const fileMd5 = (file: File & Blob, callback: (md5: string) => void) => {
    const blobSlice = File.prototype.slice;
    const chunkSize = 2097152; // 2MB
    const chunks = Math.ceil(file.size / chunkSize);
    let currentChunk = 0;
    const spark = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();
    fileReader.onload = (e: any) => {
        spark.append(e.target.result); // Append array buffer
        currentChunk++;

        if (currentChunk < chunks) {
            loadNext();
        } else {
            const md5 = spark.end(); // 得到md5
            spark.destroy(); // 释放缓存
            callback(md5);
        }
    };

    fileReader.onerror = () => {
        console.warn("oops, something went wrong.");
    };

    const loadNext = () => {
        const start = currentChunk * chunkSize;
        const end =
            start + chunkSize >= file.size ? file.size : start + chunkSize;

        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    };

    loadNext();
};

// 下载
export const getOssUrl = async (key: string, bucket: string) => {
    const ossToken = await getToken();
    const region = "oss-cn-shanghai";
    const accessKeyId = ossToken && ossToken.AccessKeyId;
    const accessKeySecret = ossToken && ossToken.AccessKeySecret;
    const securityToken = ossToken && ossToken.SecurityToken;

    const client = new OSS({
        region: region,
        accessKeyId: accessKeyId,
        accessKeySecret: accessKeySecret,
        stsToken: securityToken,
        bucket: bucket,
    });
    const url = client.signatureUrl(key);
    return url;
};
