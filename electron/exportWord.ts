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
const path = require("path");
const __dirname = path.resolve();

const PATH = process.env.NODE_ENV === "development" ? path.resolve(__dirname, "./extraResources/exportWord/template1.docx") : path.resolve(__dirname, "../template1.docx");

const content = fs.readFileSync(PATH, "binary");

const zip = new PizZip(content);

export const exportWord = (filePath:string, fileData:IFileData) => {
    let doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true
    });
    doc.render(fileData);
    const buf = doc.getZip().generate({
        type: "nodebuffer",
        compression: "DEFLATE"
    });
    fs.writeFileSync(path.resolve(filePath), buf);
    doc = null;
};
