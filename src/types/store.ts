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

export interface RootState {
    userInfo: UserInfoState,
    myStudent: MyStudentState
}
