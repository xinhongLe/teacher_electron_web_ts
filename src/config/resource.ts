export enum RESOURCE_TYPE {
    /**
     * 教案
     */
    LESSON_PLAN = "8C47DA084A9D3107B43A0ACD8679384C",
    /**
     * 导学案
     */
    STUDY_GUIDE = "8C47DA08DAA14E9AB73EE649614830BC",
    /**
     * 课件
     */
    COURSEWARD = "8C47DA089BAA57ECEF2B0B6AAE5CAC84",
    /**
     * 微课视频
     */
    MICRO_CLASS_VIDEO = "8C47DA0850B078C35D92D5612B800407",
    /**
     * 试卷
     */
    TEST_PAPER = "8C47DA0807BDB51631E3EBB0D7C88F8D",
    /**
     * 电子课本
     */
    ELECTRONIC_TEST_BOOK = "8C47DA080BC3C892C470D8C0681323A5",
    /**
     * 教具
     */
    TEACHING_AIDS = "8C47DA0818CB7747E6A5ACBD6AC2EC42",
    /**
     * 工具
     */
    TOOL = "8C47DA0823D0950663B3A370010320CA",
    /**
     * 素材
     */
    MATERIAL = "8C47DA08B6D468D1D53B828ECDB48BE7",
    /**
     * 其他
     */
    OTHER = "8C47DA0859DBCAFF8E976A835735C617"

}

export const iconResources = {
    selfStudy: {
        [RESOURCE_TYPE.LESSON_PLAN]: require("@/assets/images/preparation/resources/icon_jiaoan_star.png"),
        [RESOURCE_TYPE.STUDY_GUIDE]: require("@/assets/images/preparation/resources/icon_daoxuean_star.png"),
        [RESOURCE_TYPE.COURSEWARD]: require("@/assets/images/preparation/resources/icon_cjkejian_star.png"),
        [RESOURCE_TYPE.MICRO_CLASS_VIDEO]: require("@/assets/images/preparation/resources/icon_shipin1_star.png"),
        [RESOURCE_TYPE.TEST_PAPER]: require("@/assets/images/preparation/resources/icon_xianshang_star.png"),
        [RESOURCE_TYPE.ELECTRONIC_TEST_BOOK]: require("@/assets/images/preparation/resources/icon_keben_star.png"),
        [RESOURCE_TYPE.TEACHING_AIDS]: require("@/assets/images/preparation/resources/pic_shizhong_small_star.png"),
        [RESOURCE_TYPE.TOOL]: require("@/assets/images/preparation/resources/pic_datiqi.png"),
        [RESOURCE_TYPE.MATERIAL]: require("@/assets/images/preparation/resources/icon_sucai_star.png"),
        [RESOURCE_TYPE.OTHER]: require("@/assets/images/preparation/resources/icon_other_star.png")
    },

    other: {
        [RESOURCE_TYPE.LESSON_PLAN]: require("@/assets/images/preparation/resources/icon_jiaoan.png"),
        [RESOURCE_TYPE.STUDY_GUIDE]: require("@/assets/images/preparation/resources/icon_daoxuean.png"),
        [RESOURCE_TYPE.COURSEWARD]: require("@/assets/images/preparation/resources/icon_cjkejian.png"),
        [RESOURCE_TYPE.MICRO_CLASS_VIDEO]: require("@/assets/images/preparation/resources/icon_shipin1.png"),
        [RESOURCE_TYPE.TEST_PAPER]: require("@/assets/images/preparation/resources/icon_xianshang.png"),
        [RESOURCE_TYPE.ELECTRONIC_TEST_BOOK]: require("@/assets/images/preparation/resources/icon_keben.png"),
        [RESOURCE_TYPE.TEACHING_AIDS]: require("@/assets/images/preparation/resources/pic_shizhong_small.png"),
        [RESOURCE_TYPE.TOOL]: require("@/assets/images/preparation/resources/pic_datiqi.png"),
        [RESOURCE_TYPE.MATERIAL]: require("@/assets/images/preparation/resources/icon_sucai.png"),
        [RESOURCE_TYPE.OTHER]: require("@/assets/images/preparation/resources/icon_other.png")
    }
};

export const textResources = {
    [RESOURCE_TYPE.LESSON_PLAN]: "教案",
    [RESOURCE_TYPE.STUDY_GUIDE]: "导学案",
    [RESOURCE_TYPE.COURSEWARD]: "课件",
    [RESOURCE_TYPE.MICRO_CLASS_VIDEO]: "微课视频",
    [RESOURCE_TYPE.TEST_PAPER]: "试卷",
    [RESOURCE_TYPE.ELECTRONIC_TEST_BOOK]: "电子课本",
    [RESOURCE_TYPE.TEACHING_AIDS]: "教具",
    [RESOURCE_TYPE.TOOL]: "工具",
    [RESOURCE_TYPE.MATERIAL]: "素材",
    [RESOURCE_TYPE.OTHER]: "其他"
};

export const typeResources = {
    [RESOURCE_TYPE.LESSON_PLAN]: 0,
    [RESOURCE_TYPE.STUDY_GUIDE]: 1,
    [RESOURCE_TYPE.COURSEWARD]: 2,
    [RESOURCE_TYPE.MICRO_CLASS_VIDEO]: 3,
    [RESOURCE_TYPE.TEST_PAPER]: 4,
    [RESOURCE_TYPE.ELECTRONIC_TEST_BOOK]: 5,
    [RESOURCE_TYPE.TEACHING_AIDS]: 6,
    [RESOURCE_TYPE.TOOL]: 7,
    [RESOURCE_TYPE.MATERIAL]: 8,
    [RESOURCE_TYPE.OTHER]: 9
};
