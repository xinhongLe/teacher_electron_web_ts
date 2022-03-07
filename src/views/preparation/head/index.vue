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
                    :class="[tabIndex === item.type ? 'active' : '']"
                    v-for="(item, index) in titleList"
                    :key="index"
                    @click="clickTab(index)"
                >
                    {{ item.title }}
                </p>
            </div>
        </div>
        <div class="window-list-warp" v-show="tabIndex === ClassroomType.WindowClasses && !showClassArrangement">
            <div class="slide-btn prev" :class="{ hidden: !isShowSlideBtn, 'disable': isDisablePrev }" @click="slidePrev">
                <i class="el-icon-arrow-left"></i>
            </div>
            <div class="window-list" ref="windowListWarpRef">
                <div class="window-list-swiper" ref="windowListRef" :style="{'transform': `translateX(-${translateX}px)`}">
                    <div
                        class="window-item"
                        v-for="item in winList"
                        :key="item.WindowID"
                        :class="{ active: currentWindowInfo.WindowID === item.WindowID }"
                        @click="updateCurrentWindow(item)"
                        :ref="windowItemRefs.set"
                    >
                        {{ item.WindowName }}
                    </div>
                </div>
            </div>
            <div class="slide-btn next" :class="{ hidden: !isShowSlideBtn, 'disable': isDisableNext }" @click="slideNext">
                <i class="el-icon-arrow-right"></i>
            </div>
        </div>
        <div class="right">
            <div class="btn" v-show="tabIndex === ClassroomType.WindowClasses && !showClassArrangement" @click="edit">
                <el-icon :size="16" :style="{ marginRight: '4px' }"
                    ><edit /></el-icon
                >编辑课件
            </div>
            <div class="btn exit" @click="$emit('update:showClassArrangement', false)" v-if="showClassArrangement">
                <img src="@/assets/images/preparation/icon_tuichu.svg" />退出排课
            </div>
            <div class="btn" @click="$emit('update:showClassArrangement', true)" v-else>
                <img src="@/assets/images/preparation/icon_paike.svg" />去排课
            </div>
            <div class="refresh-warp" @click="reload" v-show="!showClassArrangement"/>
        </div>
    </div>
</template>

<script lang="ts">
import { MutationTypes, store } from "@/store";
import { GetLastSelectBookRes, ClassroomType } from "@/types/preparation";
import { findFirstId } from "@/utils";
import { computed, defineComponent, inject, ref, watch } from "vue";
import emitter from "@/utils/mitt";
import { getLastSelectBook, setLastSelectBook } from "../api";
import { Edit } from "@element-plus/icons-vue";
import useBook from "../hooks/useBook";
import { useTemplateRefsList, useElementSize } from "@vueuse/core";
import { windowInfoKey } from "@/hooks/useWindowInfo";
import useSubjectPublisherBookList, { subjectPublisherBookList } from "@/hooks/useSubjectPublisherBookList";
export default defineComponent({
    name: "head",
    components: {
        Edit
    },
    props: {
        showClassArrangement: {
            type: Boolean
        }
    },
    setup(props, { emit }) {
        const titleList = [{ title: "数智课堂", type: ClassroomType.WindowClasses }, { title: "翻转课堂", type: ClassroomType.Classes }];
        const { winList, currentWindowInfo, updateCurrentWindow } = inject(windowInfoKey)!;
        const tabIndex = ref(ClassroomType.WindowClasses);
        let selectBook: GetLastSelectBookRes;
        const windowListRef = ref<HTMLDivElement>();
        const windowListWarpRef = ref<HTMLDivElement>();
        const isShowSlideBtn = ref(false);
        const translateX = ref(0);
        const slideIndex = ref(0);
        const windowItemRefs = useTemplateRefsList<HTMLDivElement>();
        const { width } = useElementSize(windowListRef);
        const {
            subjectPublisherBookValue,
            cascaderProps,
            teacherBookChapter
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

        const edit = () => {
            emitter.emit("editWindow", null);
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

        watch(width, (v) => {
            isShowSlideBtn.value = v > windowListWarpRef.value!.offsetWidth;
        });
        const reload = () => {
            emitter.emit("preparationReLoad", null);
        };

        watch(teacherBookChapter, (value) => {
            store.commit(MutationTypes.SET_SELECT_CHAPTER_ID, value);
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
                store.commit(
                    MutationTypes.SET_SUBJECT_PUBLISHER_BOOK_VALUE,
                    value
                );
            },
            {
                deep: true
            }
        );

        useSubjectPublisherBookList().then(async () => {
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
            clickTab,
            winList,
            windowListRef,
            tabIndex,
            teacherBookChapter,
            currentWindowInfo,
            updateCurrentWindow,
            windowItemRefs,
            windowListWarpRef,
            isShowSlideBtn,
            isDisablePrev,
            isDisableNext,
            slideIndex,
            translateX,
            slideNext,
            slidePrev,
            edit,
            ClassroomType,
            reload
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
            &.exit {
                background-color: #FF6B6B;
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
