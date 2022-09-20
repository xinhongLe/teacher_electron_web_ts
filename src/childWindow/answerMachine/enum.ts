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

export function getChoiceQuestion() {
    const list = [];
    for (let i = 1; i <= 8; i++) {
        const item = {
            value: String(i),
            label: String(i),
            children: [
                {
                    value: "",
                    label: ""
                }
            ]
        };
        let numberChoice = "1";
        let englishChoice = "A";
        for (let j = 1; j < i; j++) {
            numberChoice += ` ${j + 1}`;
            englishChoice += ` ${String.fromCharCode(j + 65)}`;
        }
        item.children = [
            {
                value: englishChoice,
                label: englishChoice
            },
            {
                value: numberChoice,
                label: numberChoice
            }
        ];
        list.push(item);
    }
    return list;
}
