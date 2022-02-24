<template>
    <div class="preparation-header flex-between-center">
        <div class="left">
            <el-cascader
                v-model="subjectPublisherBookValue"
                :props="cascaderProps"
                :options="subjectPublisherBookList"
            ></el-cascader>
            <div class="header-title">
                <p
                    :class="[tabIndex === index ? 'active' : '']"
                    v-for="(item, index) in titleList"
                    :key="index"
                    @click="clickTab(index)"
                >
                    {{ item.title }}
                </p>
            </div>
        </div>
        <div class="window-list-warp" v-show="tabIndex === 1">
            <div class="slide-btn prev" :class="{ hidden: !isShowSlideBtn, 'disable': isDisablePrev }" @click="slidePrev">
                <i class="el-icon-arrow-left"></i>
            </div>
            <div class="window-list" ref="windowListWarpRef">
                <div class="window-list-swiper" ref="windowListRef" :style="{'transform': `translateX(-${translateX}px)`}">
                    <div
                        class="window-item"
                        v-for="(item, index) in windowList"
                        :key="item"
                        :class="{ active: windowActiveIndex === index }"
                        @click="windowActiveIndex = index"
                        :ref="windowItemRefs.set"
                    >
                        {{ item }}
                    </div>
                </div>
            </div>
            <div class="slide-btn next" :class="{ hidden: !isShowSlideBtn, 'disable': isDisableNext }" @click="slideNext">
                <i class="el-icon-arrow-right"></i>
            </div>
        </div>
        <div class="right">
            <div class="btn" v-show="tabIndex === 1">
                <el-icon :size="16" :style="{ marginRight: '4px' }"
                    ><edit /></el-icon
                >编辑课件
            </div>
            <div class="btn">
                <img src="@/assets/images/preparation/icon_paike.svg" />去排课
            </div>
            <div class="refresh-warp" @click="reload" />
        </div>
    </div>
</template>

<script lang="ts">
import { getCourseByCourseBag } from "@/api";
import { MutationTypes, store } from "@/store";
import { GetLastSelectBookRes } from "@/types/preparation";
import { findFirstId } from "@/utils";
import { computed, defineComponent, ref, watch } from "vue";
import emitter from "@/utils/mitt";
import { getLastSelectBook, setLastSelectBook } from "../api";
import { Edit } from "@element-plus/icons-vue";
import useBook from "../hooks/useBook";
import { useTemplateRefsList, useElementSize } from "@vueuse/core";
export default defineComponent({
    name: "head",
    components: {
        Edit
    },
    setup(props, { emit }) {
        const titleList = [{ title: "翻转课堂" }, { title: "数智课堂" }];
        const windowList = [
            "窗1名称",
            "窗2名称发的",
            "窗2名称窗2名称窗2名称窗",
            "窗2名称窗2名称窗2名称窗2",
            "窗2名称窗2名称窗2名称窗2名",
            "窗2名称窗2名称窗2名称窗2名称",
            "窗2名称窗2名称窗2名称窗2名称窗",
            "窗2名称窗2名称窗2名称窗2名称窗2",
            "窗2名称窗2名称窗2名称窗2名称窗2名"
        ];
        const windowActiveIndex = ref(0);
        const tabIndex = ref(0);
        const courseBagDetail = ref<getCourseByCourseBag>();
        let selectBook: GetLastSelectBookRes;
        let isFirst = true;
        const windowListRef = ref<HTMLDivElement>();
        const windowListWarpRef = ref<HTMLDivElement>();
        const isShowSlideBtn = ref(false);
        const translateX = ref(0);
        const slideIndex = ref(0);
        const windowItemRefs = useTemplateRefsList<HTMLDivElement>();
        const { width } = useElementSize(windowListRef);
        const {
            subjectPublisherBookList,
            subjectPublisherBookValue,
            teacherBookChapterList,
            cascaderProps,
            teacherBookChapter,
            getTeacherBookChapters,
            getSubjectPublisherBookList
        } = useBook();
        const maxTranslateX = computed(() => width.value - (windowListWarpRef.value?.offsetWidth || 0));
        const isDisablePrev = computed(() => translateX.value === 0);
        const isDisableNext = computed(() => translateX.value >= maxTranslateX.value);

        const clickTab = (index: number) => {
            tabIndex.value = index;
        };

        const slideNext = () => {
            if (isDisableNext.value) return;
            const x = translateX.value + windowItemRefs.value[slideIndex.value].offsetWidth;
            translateX.value = x > maxTranslateX.value ? maxTranslateX.value : x;
            slideIndex.value++;
        };

        const slidePrev = () => {
            if (isDisablePrev.value) return;
            const x = translateX.value - windowItemRefs.value[slideIndex.value].offsetWidth;
            translateX.value = x < 0 ? 0 : x;
            if (translateX.value === 0) {
                slideIndex.value = 0;
            } else {
                slideIndex.value--;
            }
        };

        const clickBtn = () => {
            tabIndex.value = 0;
            store.commit(MutationTypes.SET_VIEW_COURSE_DETAIL_ING, false);
            store.commit(MutationTypes.SET_SELECT_COURSE_BAG, {});
        };

        watch(width, (v) => {
            isShowSlideBtn.value = v > windowListWarpRef.value!.offsetWidth;
        });
        const reload = () => {
            emitter.emit("preparationReLoad", null);
        };

        watch(teacherBookChapter, (value) => {
            store.commit(MutationTypes.SET_SELECT_CHAPTER_ID, value);
            store.commit(MutationTypes.SET_SELECT_COURSE_BAG, {});
            setLastSelectBook({
                bookID: subjectPublisherBookValue.value[2],
                chapterID: value,
                subjectID: subjectPublisherBookValue.value[0]
            });
        });

        watch(tabIndex, (value) => {
            emit("update:tabIndex", value);
        });

        watch(
            subjectPublisherBookValue,
            (value) => {
                getTeacherBookChapters(value[2]).then(() => {
                    if (
                        selectBook &&
                        Object.keys(selectBook).length !== 0 &&
                        isFirst
                    ) {
                        isFirst = false;
                        return (teacherBookChapter.value =
                            selectBook.ChapterID);
                    }
                    if (courseBagDetail.value) {
                        const { ChapterName } = courseBagDetail.value!;
                        const info = teacherBookChapterList.value.find(
                            ({ Name }) => ChapterName === Name
                        );
                        const id = info
                            ? info.ID
                            : teacherBookChapterList.value[0].ID;
                        teacherBookChapter.value = id;
                        return (courseBagDetail.value = undefined);
                    }
                    teacherBookChapter.value =
                        teacherBookChapterList.value[0]?.ID;
                });
                store.commit(
                    MutationTypes.SET_SUBJECT_PUBLISHER_BOOK_VALUE,
                    value
                );
            },
            {
                deep: true
            }
        );

        watch(
            [
                () => store.state.preparation.isClickDetail,
                subjectPublisherBookList
            ],
            (v) => {
                const [isClickDetail] = v;
                const { selectCourseBag } = store.state.preparation;
                if (isClickDetail) {
                    const { Type, ID } = selectCourseBag;
                    const courseBagData =
                        Type === 1
                            ? {
                                courseBagID: ID!
                            }
                            : {
                                courseBagTeacherID: ID!
                            };
                    getCourseByCourseBag(Type!, courseBagData).then((res) => {
                        store.commit(MutationTypes.SET_IS_CLICK_DETAIL, false);
                        if (res.resultCode === 200) {
                            courseBagDetail.value = res.result;
                            const { SubjectName, AlbumName, PublishName } =
                                courseBagDetail.value!;
                            subjectPublisherBookList.value.forEach((item) => {
                                if (item.Lable === SubjectName) {
                                    item.Children &&
                                        item.Children.forEach((item1) => {
                                            if (item1.Lable === PublishName) {
                                                item1.Children &&
                                                    item1.Children.forEach(
                                                        (item2) => {
                                                            if (
                                                                item2.Lable ===
                                                                AlbumName
                                                            ) {
                                                                subjectPublisherBookValue.value =
                                                                    [
                                                                        item.Value,
                                                                        item1.Value,
                                                                        item2.Value
                                                                    ];
                                                                return false;
                                                            }
                                                        }
                                                    );
                                            }
                                        });
                                }
                            });
                        } else {
                            findFirstId(
                                [subjectPublisherBookList.value[0]],
                                subjectPublisherBookValue.value
                            );
                        }
                    });
                }
            }
        );

        getSubjectPublisherBookList().then(async () => {
            if (store.state.preparation.isClickDetail) return;
            const selectBookRes = await getLastSelectBook({
                subjectID: ""
            });
            if (selectBookRes.resultCode === 200) {
                selectBook = selectBookRes.result;
            }
            if (Object.keys(selectBookRes.result).length !== 0) {
                const { BookID, PublisherID, SubjectID } = selectBook;
                subjectPublisherBookValue.value = [
                    SubjectID,
                    PublisherID,
                    BookID
                ];
            } else {
                findFirstId(
                    [subjectPublisherBookList.value[0]],
                    subjectPublisherBookValue.value
                );
            }
        });

        return {
            titleList,
            subjectPublisherBookValue,
            subjectPublisherBookList,
            cascaderProps,
            teacherBookChapterList: computed(() => [
                ...teacherBookChapterList.value
            ]),
            clickTab,
            windowListRef,
            tabIndex,
            clickBtn,
            teacherBookChapter,
            windowList,
            windowActiveIndex,
            windowItemRefs,
            windowListWarpRef,
            isShowSlideBtn,
            isDisablePrev,
            isDisableNext,
            slideIndex,
            translateX,
            slideNext,
            slidePrev,
            reload,
            getTeacherBookChapters
        };
    }
});
</script>

<style lang="scss" scoped>
.preparation-header {
    width: 100%;
    height: 60px;
    padding: 0 20px;
    user-select: none;
    background-color: #fff;
    box-shadow: inset 0px -1px 0px 0px #e9ecf0;
    .left {
        display: flex;
    }
    .window-list-warp {
        padding: 12px 76px;
        flex: 1;
        height: 100%;
        display: flex;
        justify-content: center;
        overflow: hidden;
        .slide-btn {
            height: 100%;
            width: 20px;
            border-radius: 4px;
            background-color: var(--app-color-primary);
            flex-shrink: 0;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;

            &.disable {
                color: #A7AAB4;
                background-color: #eff0f4;
            }
            &.hidden {
                visibility: hidden;
            }
            &.next {
                margin-left: 12px;
            }
            &.prev {
                margin-right: 12px;
            }
        }

        .window-list {
            height: 100%;
            display: flex;
            align-items: center;
            border-radius: 4px;
            overflow: hidden;
            flex: 1;
            .window-list-swiper {
                background: #f0f4ff;
                display: flex;
                transition: transform 0.3s;
                margin: 0 auto;
            }
            .window-item {
                max-width: 210px;
                @include text-ellipsis;
                padding: 0 20px;
                font-size: 16px;
                font-weight: 600;
                color: var(--app-color-primary);
                line-height: 20px;
                cursor: pointer;
                line-height: 36px;
                height: 100%;
                position: relative;
                flex-shrink: 0;
                &::before {
                    position: absolute;
                    content: "";
                    width: 1px;
                    height: 14px;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    background-color: var(--app-color-primary);
                    opacity: 0.2;
                }
                &:last-child {
                    &::before {
                        display: none;
                    }
                }
                &.active {
                    background-color: var(--app-color-primary);
                    color: #fff;
                    border-radius: 4px;
                }
            }
        }
    }
    .right {
        display: flex;
        align-items: center;
        .btn {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 112px;
            height: 36px;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
            img {
                margin-right: 4px;
            }
            &:first-child {
                border: 1px solid var(--app-color-primary);
                color: var(--app-color-primary);
            }
            &:nth-child(2) {
                background-color: #ff7802;
                color: #fff;
                margin-left: 12px;
            }
        }
        .refresh-warp {
            cursor: pointer;
            width: 16px;
            height: 16px;
            margin-left: 20px;
            background: url("../../../assets/images/preparation/icon_shuaxin_rest.svg");
        }
    }
    .header-title {
        margin-left: 40px;
        display: flex;
        align-items: center;
        font-size: 24px;
        font-weight: 600;
        color: #a7aab4;
        p {
            cursor: pointer;
            &:first-child {
                margin-right: 32px;
            }
            &.active {
                color: #19203d;
                position: relative;
                &::before {
                    content: "";
                    position: absolute;
                    width: 100%;
                    height: 3px;
                    bottom: -18px;
                    background-color: var(--app-color-primary);
                }
            }
        }
    }
    .header-refresh {
        cursor: pointer;
        display: flex;
        align-content: center;
        line-height: 14px;
        width: 460px;
        justify-content: flex-end;
        img {
            width: 13px;
            height: 13px;
            vertical-align: middle;
            margin-right: 2px;
        }
    }
}
</style>
