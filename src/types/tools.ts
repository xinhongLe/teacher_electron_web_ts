export interface Tools {
    ID: string,
    Name: string,
    Sort: number,
    State: number,
    Url: string,
    File:{
        Bucket: string,
        Extention: string,
        FileMD5: string,
        FileName: string,
        FilePath: string,
        ID: string,
        SN: number,
        Type: number,
    }
}

export type ToolListRes = Tools[]
    