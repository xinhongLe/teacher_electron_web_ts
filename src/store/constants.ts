export const enum MutationTypes {
    UPDATE_USERINFO = "UPDATE_USERINFO",
    UPDATE_SELECT_CLASS_INFO = "UPDATE_SELECT_CLASS_INFO",
    RESET_STATE = "RESET_STATE",
    UPDATE_SEARCH_STUDENT = "UPDATE_SEARCH_STUDENT",
    UPDATE_STUDENT_LIST = "UPDATE_STUDENT_LIST",
    /**
     * 更新班级列表
     */
    UPDATE_GRADE_LIST = "UPDATE_GRADE_LIST",
    /**
     * 显示班级编辑或创建班级弹框
     */
    SHOW_CLASS_DIALOG = "SHOW_CLASS_DIALOG",
    /**
     * 关闭班级弹窗
     */
    CLOSE_CLASS_DIALOG = "CLOSE_CLASS_DIALOG"
}

export const enum ActionTypes {
    /**
     * 请求班级列表
     */
    FETCH_CLASS_LIST = "FETCH_CLASS_LIST",
    /**
     * 请求学生列表
     */
    FETCH_STUDENT_LIST = "FETCH_STUDENT_LIST"
}
