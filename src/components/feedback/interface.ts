export interface IFile {
    Name: string,
    MD5: string,
    OssName: string,
    OssExtention: string,
    BucketName: string
}

export interface ISubmitFeedBackData {
    ActionName: string,
    ClientName: string,
    SubjectID: string | null,
    FeedBackFiles: IFile[],
    Content: string
}
