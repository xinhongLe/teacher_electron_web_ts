export const enum MutationTypes {
    // common

    /**
     * 设置是否在拖拽中
     */
    SET_IS_DRAGGING = "SET_IS_DRAGGING",
    /**
     * 重置common module
     */
    COMMON_RESET_STATE = "COMMON_RESET_STATE",

    // userInfo
    UPDATE_USERINFO = "UPDATE_USERINFO",
    /**
     * 重置userInfo module
     */
    USER_INFO_RESET_STATE = "USER_INFO_RESET_STATE",

    // myStudent
    /**
     * 重置myStudent module
     */
    MY_STUDENT_RESET_STATE = "MY_STUDENT_RESET_STATE",
    UPDATE_SELECT_CLASS_INFO = "UPDATE_SELECT_CLASS_INFO",
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
    CLOSE_CLASS_DIALOG = "CLOSE_CLASS_DIALOG",

    // preparation

    /**
     * 重置preparation module
     */

     PREPARATION_STUDENT_RESET_STATE = "PREPARATION_STUDENT_RESET_STATE",

    /**
     * 设置备课页面选择的章节id
     */
    SET_SELECT_CHAPTER_ID = "SET_SELECT_CHAPTER_ID",
    /**
     * 设置备课页面去排课按钮的显示
     */
    SET_SHOW_COURSE_BTN = "SET_SHOW_COURSE_BTN",
    /**
     * 备课页面的教材iD
     */
    SET_SUBJECT_PUBLISHER_BOOK_VALUE = "SET_SUBJECT_PUBLISHER_BOOK_VALUE",
    /**
     * 设置备课页面选择的课时信息
     */
    SET_SELECT_COURSE_BAG = "SET_SELECT_COURSE_BAG"
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
