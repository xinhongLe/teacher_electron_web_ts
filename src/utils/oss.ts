import OSS from "ali-oss";
import SparkMD5 from "spark-md5";
import { getOssToken } from "@/api";
import { throttle } from "lodash";
import { UploadFile } from "element-plus/lib/components/upload/src/upload.type";
import { IOssPaths, IOssUploadRes } from "@/types/oss";

// 上传
export const cooOss = function(file: UploadFile & Blob, OssPaths: IOssPaths): Promise<IOssUploadRes | null> {
    return new Promise((resolve) => {
        fileMd5(file, async (md5) => {
            const fileExtension = file.name.split(".")[
                file.name.split(".").length - 1
            ];
            const name = md5;
            const objectKey =
                OssPaths.Path + "/" + name + "." + fileExtension;
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
                bucket: bucket
            });
            return client.multipartUpload(objectKey, file, {}).then(() => {
                return resolve({
                    code: 200,
                    objectKey: objectKey,
                    name: name,
                    fileExtension: fileExtension,
                    msg: "ok",
                    md5
                });
            }).catch((err: Error) => {
                console.log(err);
                console.error("上传出错了");
            });
        });
    });
};

const getToken = throttle(async function() {
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

const fileMd5 = (file: UploadFile & Blob, callback: (md5: string) => void) => {
    const fileReader = new FileReader();
    const spark = new SparkMD5(); // 创建md5对象（基于SparkMD5）
    if (file.size > 1024 * 1024 * 10) {
        const data = file.slice(0, 1024 * 1024 * 10); // 将文件进行分块 file.slice(start,length)
        fileReader.readAsBinaryString(data); // 将文件读取为二进制码
    } else {
        fileReader.readAsBinaryString(file);
    }

    fileReader.onload = (e) => {
        spark.appendBinary(<string>e.target?.result);
        const md5 = spark.end();
        callback(md5);
    };
};

// 下载
export const downloadFile = async (key: string, bucket: string) => {
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
        bucket: bucket
    });
    const url = client.signatureUrl(key);
    return url;
};
