<template>
    <div class="preparation-header flex-between-center">
        <div class="left">
            <el-cascader
                :modelValue="subjectPublisherBookValue"
                :props="cascaderProps"
                :options="subjectPublisherBookList"
                @change="onChange"
            ></el-cascader>
            <div class="header-title">
                <p
                    :class="[tabIndex === item.type ? 'active' : '']"
                    v-for="(item, index) in titleList"
                    :key="index"
                    @click="clickTab(item.type)"
                >
                    {{ item.title }}
                </p>
            </div>
        </div>
        <window-list v-show="tabIndex === ClassroomType.WindowClasses && !showClassArrangement"/>
        <div class="right">
            <div class="btn" v-show="tabIndex === ClassroomType.WindowClasses && !showClassArrangement" @click="edit" :class="{disable: winList.length === 0}">
                <el-icon :size="16" :style="{ marginRight: '4px' }"
                    ><edit /></el-icon
                >编辑课件
            </div>
            <div class="btn exit" @click="updateShowClassArrangement(false)" v-if="showClassArrangement">
                <img src="@/assets/images/preparation/icon_tuichu.svg" />退出排课
            </div>
            <div class="btn" @click="updateShowClassArrangement(true)" v-else>
                <img src="@/assets/images/preparation/icon_paike.svg" />去排课
            </div>
            <div class="refresh-warp" @click="reload" v-show="!showClassArrangement"/>
        </div>
    </div>
</template>

<script lang="ts">
import { MutationTypes, store } from "@/store";
import { ClassroomType } from "@/types/preparation";
import { computed, defineComponent, inject, ref, watch } from "vue";
import emitter from "@/utils/mitt";
import { Edit } from "@element-plus/icons-vue";
import useBook from "../hooks/useBook";
import { windowInfoKey } from "@/hooks/useWindowInfo";
import useSubjectPublisherBookList, { subjectPublisherBookList } from "@/hooks/useSubjectPublisherBookList";
import WindowList from "@/components/windowList/index.vue";
import useOpenWindow from "@/hooks/useOpenWindow";
import { useRouter } from "vue-router";
export default defineComponent({
    name: "head",
    components: {
        Edit,
        WindowList
    },
    props: {
        showClassArrangement: {
            type: Boolean
        }
    },
    setup(props, { emit }) {
        const titleList = [{ title: "翻转课堂", type: ClassroomType.Classes }, { title: "数智课堂", type: ClassroomType.WindowClasses }];
        const { updateCurrentWindow, currentWindowInfo, winList } = inject(windowInfoKey)!;
        const tabIndex = ref(ClassroomType.WindowClasses);
        const subjectPublisherBookValue = computed(() => store.state.preparation.subjectPublisherBookValue);
        const {
            cascaderProps
        } = useBook();

        const router = useRouter();

        const clickTab = (index: number) => {
            tabIndex.value = index;
        };

        const edit = () => {
            if (winList.value.length === 0) return;
            store.commit(MutationTypes.SET_EDIT_WINDOW_INFO, {
                id: currentWindowInfo.WindowID,
                name: currentWindowInfo.WindowName,
                lessonId: currentWindowInfo.LessonID,
                originType: currentWindowInfo.OriginType,
                allWindowNames: winList.value.map((item) => item.WindowName)
            });
            router.push("/windowcard-edit");
        };

        const reload = () => {
            emitter.emit("preparationReLoad", null);
        };

        const onChange = (value : string[]) => {
            store.commit(
                MutationTypes.SET_SUBJECT_PUBLISHER_BOOK_VALUE,
                value
            );
        };

        const updateShowClassArrangement = (flag: boolean) => {
            emit("update:showClassArrangement", flag);
        };

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

        useSubjectPublisherBookList();

        useOpenWindow(tabIndex, updateCurrentWindow, updateShowClassArrangement);

        return {
            titleList,
            subjectPublisherBookValue,
            subjectPublisherBookList,
            cascaderProps,
            clickTab,
            tabIndex,
            updateCurrentWindow,
            edit,
            winList,
            onChange,
            ClassroomType,
            updateShowClassArrangement,
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
                &.disable {
                    border-color: #ccc;
                    color: #ccc;
                    cursor: default;
                }
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
