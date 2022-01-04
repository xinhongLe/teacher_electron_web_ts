export const enum QuestionTypeEnum {
    /**
     * 1 ABC类型选择题
     */
    SELECT_ALPHABAT = 1,
    /**
     *  2 123类型选择题
     */
    SELECT_NUMBER,
    /**
     * 3 TF判断题
     */
    SELECT_TF,
    /**
     * 4√×判断题
     */
    SELECT_OKCANCEL,
    /**
     * 5 填空题
     */
    BLANK,
    /**
     * 6 应用题
     */
    APPLICATION,
    /**
     * 7 语音题
     */
    VOICE,
    /**
     * 8 解答题
     */
    SOLVE,
}

/**
 * 做题结果
 */
export enum QuestionResultTypeEnum {
    /**
     * 未做
     */
    NOT_DONE,
    /**
     * 正确的
     */
    RIGHT,
    /**
     * 错误
     */
    ERROR,
    /**
     * 不确定的
     */
    NOT_SURE
}
