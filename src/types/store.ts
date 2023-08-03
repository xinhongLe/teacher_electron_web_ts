import {IBookItem, ICustomBookItem, IResourceItem} from "@/api/resource";
import {Class, ClassStudent} from "./myStudent";
import {BookList} from "./preparation";

export interface ICurrentSelectClass {
    ClassAixueshiId?: string;
    ClassUserCenterId?: string;
    ClassName?: string;
    GradeId?: string;
    GradeName?: string;
}

export interface UserInfoState {
    name?: string;
    account?: string;
    Schools?: {
        ID: string;
        UserCenterSchoolID: string;
        Name: string;
    }[];
    schoolId: string;
    schoolName: string;
    userCenterUserID: string;
    id: string;
    currentSelectClass: ICurrentSelectClass;
    classList: ICurrentSelectClass[]
}

export interface MyStudentState {
    selectClassInfo: Class;
    classList: Class[];
    allStudentList: ClassStudent[];
    isShowClassDialog: boolean;
    isEditClassDialog: boolean;
    classDialogInfo?: Class;
    searchStudent: string;
}

export interface PreparationState {
    /**
     * 是否正在查看课包详情
     */
    isViewCourseDetailIng: boolean;
    /**
     * 选择的章节id
     */
    selectChapterID: string;
    /**
     * 选择的教材
     */
    subjectPublisherBookValue: ICustomBookItem | undefined;
    /**
     * 教材列表菜单
     */
    subjectPublisherBookList: IBookItem[];
    /**
     * 是否在拖拽精品素材
     */
    isDraggingElement: boolean;
    /**
     * 是否是点击详情跳转的
     */
    isClickDetail: boolean;
    /**
     * 窗卡页下一步按钮位置
     */
    selectNextType: string;
    /**
     * 选择的课时id
     */
    selectLessonId: string;
    /**
     * 当前编辑的窗卡页信息
     */
    editWindowInfo: {
        id: string;
        name: string;
        originType: number;
        lessonId: string;
        allWindowNames: string[];
    };
    /**
     * 学段s
     */
    term: {
        id: string;
        code: string;
    };
}

export interface IViewResourceData extends Partial<IResourceItem> {
    id: string;
    wincardName?: string;
    courseBagId?: string;
    deleteQuestionIds?: string[];
    type?: number;
    openMore?: boolean;
    isSystem?: number;
}

export interface IShowResourceFullScreen {
    component: string;
    resource: IViewResourceData;
}

export interface ISingleResourceFullScreen {
    question?: IShowResourceFullScreen;
    video?: IShowResourceFullScreen;
}

export interface IDownloading {
    id: string;
    name: string;
    type: string;
    data: IResourceItem;
    timestamp: number;
    status: number; // 0: 待下载 1: 下载中 2: 已完成 3: 已取消 4: 下载失败
}

export interface CommonState {
    /**
     * 是否在拖拽
     */
    isDragging: boolean;
    /**
     * 备教端是否被嵌套在某个iframe里
     */
    isIframe: boolean;
    /**
     * 展示资源暂存
     */
    resource: IResourceItem | null;
    /**
     * 需要全屏展示的资源列表
     */
    showResourceFullScreen: IShowResourceFullScreen[];
    /**
     * 单开资源
     */
    singleResourceFullScreen: ISingleResourceFullScreen;
    /**
     * 单开资源活跃窗口
     */
    activeWindow: string;
    /**
     * 当前选中的备课包数据
     */
    currentPackageData: any
    /**
     * 课表中进入课件资源
     */
    currentKebiaoResource: boolean
    /**
     * 备课进入课件资源
     */
    currentBeikeResource: boolean
    /**
     * 从哪儿进入的课件资源
     */
    resourceIntoType: number,
    /**
     * 下载中的列表
     */
    downloading: IDownloading[];
}
export interface WrongBookState {
    questionBasket?: any[];
    baskTotal?: number;
    currentClassId: string;
    currentBookId: string;
    currentPaperName: string;
    currentGeneratePaperId: string;
    currentSelectedBookName: string;
    currentSubjectId: string;
    currentPureQuestion: any;
}

export interface RootState {
    userInfo: UserInfoState;
    preparation: PreparationState;
    common: CommonState;
    myStudent: MyStudentState;
    wrongbook: WrongBookState;
}
