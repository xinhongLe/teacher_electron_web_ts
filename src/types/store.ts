import { Class, ClassStudent } from "./myStudent";

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
     * 是否显示去排课按钮
     */
    isShowCourseBtn: boolean,
    /**
     * 选择的章节id
     */
    selectChapterID: string,
    /**
     * 选择的教材
     */
    subjectPublisherBookValue: string[]
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
