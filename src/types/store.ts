import { Class, ClassStudent } from "./myStudent";
import { CourseBag } from "./preparation";

export interface UserInfoState {
    name?: string;
    account?: string;
    Schools?: {
        ID: string,
        Name: string
    }[],
    id: string
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
    subjectPublisherBookValue: string[],
    /**
     * 选择的课时
     */
    selectCourseBag: CourseBag,
    /**
     * 是否在拖拽精品素材
     */
    isDraggingElement: boolean
}

export interface CommonState {
    /**
     * 是否在拖拽
     */
    isDragging: boolean
}

export interface RootState {
    userInfo: UserInfoState,
    preparation: PreparationState,
    common: CommonState,
    myStudent: MyStudentState
}
