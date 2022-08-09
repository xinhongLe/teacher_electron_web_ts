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

export const exportWord = (filePath:string, fileData:IFileData, styleType:number) => {
    let PATH: string | null = process.env.NODE_ENV === "development" ? join(__dirname, `./extraResources/exportWord/${styleType === 1 ? "template.docx" : "template_table.docx"}`) : join(__dirname, `../extraResources/exportWord/${styleType === 1 ? "template.docx" : "template_table.docx"}`);

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

    fs.writeFileSync(resolve(filePath), buf);
    PATH = null;
    content = null;
    zip = null;
    doc = null;
};
