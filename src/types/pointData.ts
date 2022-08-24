//埋点接口
interface IYunRole {
    RoleName: string;
    RoleCode: string;
}
interface ISubject {
    SubjectID: string;
    SubjectName: string;
}
interface IClass {
    ClassID: string;
    ClassName: string;
}
interface IGrade {
    GradeID: string;
    GradeName: string;
}
export interface createBuryingPointData {
    TrackPlatform: string;
    DeviceType: string;
    Mac: string;
    Platform: string;
    DeviceId: string;
    Display: string;
    // Ip: string;
    Token: string;
    UserId: string;
    UserType: number;
    UserName: string;
    UserGender: string;
    UserRole: IYunRole[];
    SubjectId?: string; //科目ID
    SubjectName?: string; //科目名称
    UserSubject: ISubject[]; //科目名称
    TeachAge: string; //教龄
    GradeId: string; //年级id
    GradeName: string; //年级名称
    UserGrade: IGrade[]; //年级
    ClassId?: string; //班级id
    ClassName?: string; //班级名称
    UserClass: IClass[];
    NetType: string;
    PlantId: string; //平台id
    PlantName: string | undefined; //平台名称
    TrackData: {
        //跟踪数据
        Event: number | string; //事件行为(1,2,3,4,5,6)
        EventId: string | undefined;
        PageName: string; //页面名称 -事件源：评测中心，课后延时，班级管理等
        // StayTime: number; //当前页停留时间
        TabName: string | undefined; //区域名称 按钮名称
        Class: {
            //班级信息
            ClassId: string; //班级id
            OrgId: string; //组织id
        };
        Lesson: {
            //课程信息
            SubjectId: string; //科目id
            SubjectName: string; //科目名称
            PublishId: string; //版本id
            PublishName: string; //版本名称
            AlbumId: string; //书册id
            AlbumName: string; //书册名称
            GradeId: string; //年级id
            GradeName: string; //年级名称
            LessonId: string; //课程id
            LessonNam: string; //课程名称
            ChapterId: string; //章节id
            ChapterName: string; //章节名称
        };
        SearchKey: string; //搜索关键词
        ToolsFromSubject: string; //教具所属学科
        ResourceCenter: {
            ResourceId: string;
            ResourceName: string;
            ResourceType: string;
            ResourceFormat: string;
            KnowledgePoints: string;
            Catalog: string;
            ParentKnowledge: string;
            StageId: string;
            StageName: string;
            SubjectId: string;
            SubjectName: string;
            BookId: string;
            BookName: string;
            ChapterId: string;
            ChapterName: string;
            Sharer: string;
            Sender: string;
        };
    };
}
