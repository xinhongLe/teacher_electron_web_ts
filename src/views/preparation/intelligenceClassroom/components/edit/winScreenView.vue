<template>
    <div class="view-box">
        <ScreenView
            ref="screenRef"
            :slide="slide"
            :isInit="isInit"
            @openCard="openCard"
            @pagePrev="pagePrev()"
            @pageNext="pageNext()"
            @offScreen="offScreen"
            :keyDisabled="dialogVisible"
            @openMenu="showCollapse = !showCollapse"
        />
        <div class="right-fixed" v-if="showCollapse">
            <div class="right-content">
                <div class="text title">页列表</div>
                <div :class="['text', index === i ? 'active' : '']" @click="index = i" v-for="(item, i) in pageList" :key="item.ID">
                    {{ item.Name }}
                </div>
            </div>
        </div>
        <!-- 弹卡-->
        <open-card-view-dialog v-if="dialogVisible" :list="cardList" @close="dialogVisible = false"/>
    </div>
</template>

<script lang="ts">
import { ElMessage } from "element-plus";
import OpenCardViewDialog from "./openCardViewDialog.vue";
import { computed, defineComponent, PropType, ref } from "vue";
import { CardProps, PageProps } from "@/views/preparation/intelligenceClassroom/api/props";

export default defineComponent({
    name: "winCardViewDialog",
    components: { OpenCardViewDialog },
    props: {
        list: {
            type: Array as PropType<CardProps[]>,
            default: () => []
        },
        activePageIndex: {
            type: Number,
            default: 0
        }
    },
    emits: ["offScreen"],
    setup(props, { emit }) {
        const index = ref(props.activePageIndex);
        const isInit = ref(true);
        const slideView = ref({});
        const keyDisabled = ref(false);
        const showCollapse = ref(false);

        const pageList = computed(() => {
            let allPages: PageProps[] = [];
            props.list.forEach(item => {
                allPages = allPages.concat(...item.PageList);
            });
            return allPages.filter(item => item.State);
        });

        const slide = computed(() => pageList.value[index.value].Json);

        const pagePrev = async () => {
            if (index.value === 0) {
                ElMessage.warning("已经是第一页");
                return;
            }
            index.value--;
            isInit.value = false;
        };

        const pageNext = async () => {
            if (index.value === pageList.value.length - 1) {
                return ElMessage.warning("已经是最后页");
            }
            index.value++;
            isInit.value = true;
        };

        const dialogVisible = ref(false);
        const cardList = ref<PageProps[]>([]);
        const openCard = async (data: any) => {
            if (!data[0] || !data[0].cards) return;

            const cards = [...data[0].cards];
            let slides: any = [];

            cards.forEach(item => {
                slides = slides.concat(item.slides);
            });

            let allPages: PageProps[] = [];
            props.list.forEach(item => {
                allPages = allPages.concat(...item.PageList);
            });

            const pages: PageProps[] = [];
            for (let i = 0; i < slides.length; i++) {
                const find = allPages.find(item => item.Json.id === slides[i].id);
                if (find) {
                    pages.push(find);
                }
            }
            if (pages.length === 0) {
                ElMessage.warning("该弹卡已删除");
                return;
            }
            console.log(pages);
            dialogVisible.value = true;
            cardList.value = pages;
        };

        const closeOpenCard = () => {
            dialogVisible.value = false;
            keyDisabled.value = false;
        };

        const screenRef = ref();
        const execPrev = () => {
            screenRef.value.execPrev();
        };

        const execNext = () => {
            screenRef.value.execNext();
        };
        const offScreen = () => {
            emit("offScreen");
        };

        const setScreening = (flag: boolean) => {
            screenRef.value.setScreening(flag);
        };
        return {
            pageList,
            slide,
            keyDisabled,
            isInit,
            slideView,
            dialogVisible,
            cardList,
            showCollapse,
            index,
            pageNext,
            pagePrev,
            openCard,
            screenRef,
            execPrev,
            execNext,
            closeOpenCard,
            offScreen,
            setScreening
        };
    }
});
</script>

<style scoped lang="scss">
.view-box {
    :deep(.el-overlay) {
        z-index: 999999 !important;
    }

    :deep(.el-dialog) {
        --el-dialog-margin-top: 5vh;

        .slide-list {
            background-color: #fff;
        }
    }

    :deep(.el-dialog__body) {
        height: 80vh !important;
        width: 100%;
        overflow-y: auto;
    }

    .right-fixed {
        position: fixed;
        left: 0;
        top: 0;
        background-color: #fff;
        width: 240px;
        height: 100vh;
        z-index: 99999;

        .right-content {
            height: 100%;
            width: 100%;
            overflow: auto;
        }

        .text {
            padding: 0 20px;
            cursor: pointer;
            height: 40px;
            line-height: 40px;
            font-size: 14px;
            border-bottom: 0.1px solid #f0f0f0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            &.title {
                padding: 0 10px;
                font-size: 16px;
            }

            &.active {
                color: #409eff;
                background-color: #ecf5ff;
            }
        }
    }

    .fixed-box {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 40px;
        height: 40px;
        border: 1px solid #666;
        border-radius: 50%;
        color: #666;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        font-size: 18px;
        cursor: pointer;

        &:hover {
            border: 1px solid #333;
            color: #333;
        }
    }

    .showCollapseClass {
        left: 242px;
    }

    .hideCollapseClass {
        left: 0;
    }
}</style>
