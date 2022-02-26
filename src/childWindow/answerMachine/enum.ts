export enum PADModeQuestionType {
    /**
     * 单选题
     */
    "单选题" = 1,
    /**
     * 多选题
     */
     "多选题",
    /**
     * 判断题
     */
    "判断题"
}

export enum MachineModeQuestionType {
    /**
     * 单选题
     */
    "单选题" = 1,
    /**
     * 多选题
     */
     "多选题" = 4,
    /**
     * 判断题
     */
    "判断题" = 2
}

export enum AnswerMode {
    PAD,
    AnswerMachine
}
