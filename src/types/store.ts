import { IBookItem, ICustomBookItem, IResourceItem } from "@/api/resource";
import { Class, ClassStudent } from "./myStudent";
import { BookList } from "./preparation";

export interface UserInfoState {
    name?: string;
    account?: string;
    Schools?: {
        ID: string,
        UserCenterSchoolID: string,
        Name: string
    }[],
    schoolId: string;
    schoolName: string;
    userCenterUserID: string;
    id: string;
}

export interface MyStudentState {
    selectClassInfo: Class,
    classList: Class[],
    allStudentList: ClassStudent[],
    isShowClassDialog: boolean,
    isEditClassDialog: boolean,
    classDialogInfo?: Class,
    searchStudent: string
}

export interface PreparationState {
    /**
     * 是否正在查看课包详情
     */
    isViewCourseDetailIng: boolean,
    /**
     * 选择的章节id
     */
    selectChapterID: string,
    /**
     * 选择的教材
     */
    subjectPublisherBookValue: ICustomBookItem | undefined,
    /**
     * 教材列表菜单
     */
    subjectPublisherBookList: IBookItem[],
    /**
     * 是否在拖拽精品素材
     */
    isDraggingElement: boolean,
    /**
     * 是否是点击详情跳转的
     */
    isClickDetail: boolean,
    /**
     * 窗卡页下一步按钮位置
     */
    selectNextType: string,
    /**
     * 选择的课时id
     */
    selectLessonId: string,
    /**
     * 当前编辑的窗卡页信息
     */
    editWindowInfo: {
        id: string,
        name: string,
        originType: number,
        lessonId: string,
        allWindowNames: string[]
    },
    /**
     * 学段s
     */
    term: {
        id: string;
        code: string;
    }
}

export interface CommonState {
    /**
     * 是否在拖拽
     */
    isDragging: boolean,
    /**
     * 是否显示查看题目弹框
     */
    isShowQuestion: boolean,
    /**
     * 是否显示查看视频弹框
     */
    isShowVideo: boolean,
    /**
     * 是否显示窗卡
     */
    isShowWincard: boolean,
    /**
     * 窗ID
     */
    wincard: {
        id: string;
        isMySelf: boolean;
    };
    /**
     * 查看题目的信息
     */
    viewQuestionInfo: {
        type: number,
        id: string,
        deleteQuestionIds?: string[],
        courseBagId: string
    }
    /**
     * 查看视频的信息
     */
    viewVideoInfo: {
        id: string
    },
    /**
     * 备教端是否被嵌套在某个iframe里
     */
    isIframe: boolean,
    /**
     * 预览文件弹窗
     */
    showScreenViewFile: boolean,
    /**
     * 展示资源暂存
     */
    resource: IResourceItem | null
}
export interface RootState {
    userInfo: UserInfoState,
    preparation: PreparationState,
    common: CommonState,
    myStudent: MyStudentState
}
