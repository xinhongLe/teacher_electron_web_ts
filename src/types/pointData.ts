//埋点接口
export interface createBuryingPointData {
    device_type: String;
    mac: string;
    platform: string;
    device_id: string;
    display: string;
    ip: string;
    token: string;
    user_id: string;
    nettype: string;
    EnumUserType: number;
    plantid: string;
    plantName: string;
    trackData: {
        event: string | undefined;
        pageName: string;
        stayTime: string | number;
        tabName: string | undefined;
        lesson: {
            subjectid: string;
            subjectName: string;
            publishId: string;
            publishName: string;
            alubmId: string;
            alubmName: string;
            lessonId: string;
            lessonName: string;
            chapterId: string;
            chapterName: string;
        };
        class: {
            classid: string;//班级id
            orgid: string;//组织id
        };
        searchKey: string
    }

}