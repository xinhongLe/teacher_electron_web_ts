export const enum MutationTypes {
    // common

    /**
     * 设置是否在拖拽中
     */
    SET_IS_DRAGGING = "SET_IS_DRAGGING",
    /**
     * 设置显示或隐藏查看题目弹框
     */
    SET_IS_SHOW_QUESTION = "SET_IS_SHOW_QUESTION",
    /**
     * 设置显示或隐藏查看视频弹框
     */
    SET_IS_SHOW_VIDEO = "SET_IS_SHOW_VIDEO",
    /**
     * 设置显示窗卡页
     */
    SET_IS_WINCARD = "SET_IS_WINCARD",
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
     * 设置是否在查看课包详情
     */
    SET_VIEW_COURSE_DETAIL_ING = "SET_VIEW_COURSE_DETAIL_ING",
    /**
     * 备课页面的教材iD
     */
    SET_SUBJECT_PUBLISHER_BOOK_VALUE = "SET_SUBJECT_PUBLISHER_BOOK_VALUE",
    /**
     * 设置教材列表
     */
    SET_SUBJECT_PUBLISHER_BOOK_LIST = "SET_SUBJECT_PUBLISHER_BOOK_LIST",
    /**
     * 设置是否在拖拽精品素材
     */
    SET_IS_DRAGGING_ELEMENT = "SET_IS_DRAGGING_ELEMENT",
    /**
     * 设置是否是点击详情跳转的
     */
    SET_IS_CLICK_DETAIL = "SET_IS_CLICK_DETAIL",
    /**
     * 设置备教端是否被嵌套在某个iframe里
     */
    SET_IS_IFRAME = "SET_IS_IFRAME",
    /**
     * 设置备教端iframe状态在local：1 被嵌在iframe， 0 备教端
     */
    LOCAL_IS_IFRAME = "LOCAL_IS_IFRAME",
    /**
     * 设置窗卡页下一步按钮位置
     */
    SET_SELECT_NEXT_TYPE = "SET_SELECT_NEXT_TYPE",
    /**
     * 设置备课页面选择的课时id
     */
    SET_SELECT_LESSON_ID = "SET_SELECT_LESSON_ID",
    /**
     * 设置当前编辑窗的信息
     */
    SET_EDIT_WINDOW_INFO = "SET_EDIT_WINDOW_INFO",
    /**
     * 设置学段
     */
    SET_TERM = "SET_TERM",
    /**
     * 设置选中学校
     */
    UPDATE_SELECTED_SCHOOL = "UPDATE_SELECTED_SCHOOL",
    /**
     * 弹框展示文件
     */
    SET_SHOW_VIEW_FILE = "SET_SHOW_VIEW_FILE",
    /**
     * 新增全屏预览资源
     */
    SET_FULLSCREEN_RESOURCE = "SET_FULLSCREEN_RESOURCE",
    /**
     * 移除全屏预览资源
     */
    REMOVE_FULLSCREEN_RESOURCE = "REMOVE_FULLSCREEN_RESOURCE",
    /**
     * 设置单开资源活跃窗口
     */
    SET_FULLSCREEN_RESOURCE_ACTIVE = "SET_FULLSCREEN_RESOURCE_ACTIVE"
}

export const enum ActionTypes {
    /**
     * 请求班级列表
     */
    FETCH_CLASS_LIST = "FETCH_CLASS_LIST",
    /**
     * 请求学生列表
     */
    FETCH_STUDENT_LIST = "FETCH_STUDENT_LIST",
}
