import { join, resolve } from "path";

interface IListItem {
    title: string,
    contents: {content: string}[]
}

interface ICardItem {
    title: string,
    pages: {
        title: string,
        processes: {process: string}[],
        designs: {design: string}[]
    }[]
}

export interface IFileData {
    title: string,
    list: IListItem[],
    cards: ICardItem[],
    list2: IListItem[]
}

const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");

const fs = require("fs");

const mkdir = (path: string) => {
    const dirCache: any = {};
    const arr = path.split("\\").join("/").split("/");
    let dir = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (!dirCache[dir] && !fs.existsSync(dir)) {
            dirCache[dir] = true;
            fs.mkdirSync(dir);
        }
        dir = dir + "/" + arr[i];
    }
};

export const exportWord = (filePath:string, fileData:IFileData, styleType:number) => {
    let PATH: string | null = process.env.NODE_ENV === "development" ? join(__dirname, `../extraResources/exportWord/${styleType === 1 ? "template.docx" : "template_table.docx"}`) : join(__dirname, `../extraResources/exportWord/${styleType === 1 ? "template.docx" : "template_table.docx"}`);

    let content = fs.readFileSync(PATH, "binary");

    let zip = new PizZip(content);
    let doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true
    });
    doc.render(fileData);
    const buf = doc.getZip().generate({
        type: "nodebuffer",
        compression: "DEFLATE"
    });

    // 不存在文件夹要先创建文件夹
    if (!fs.existsSync(resolve(filePath))) {
        mkdir(resolve(filePath));
    }

    fs.writeFileSync(resolve(filePath), buf);
    PATH = null;
    content = null;
    zip = null;
    doc = null;
};
