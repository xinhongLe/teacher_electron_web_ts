<template>
    <div class="pageListComponents">
        <div class="me-work">
            <ScreenView
                class="me-work-screen"
                :inline="true"
                ref="screenRef"
                :slide="page"
                @pagePrev="pagePrev"
                @pageNext="pageNext"
            />
            <div
                class="me-page"
                :style="{ paddingBottom: hasCheck ? '40px' : '15px' }"
            >
                <div
                    class="me-page-item"
                    :class="selected === index && 'active'"
                    v-for="(item, index) in pageList"
                    :key="index"
                    @click="selectPage(index)"
                >
                    {{ item.Name }}
                    <div
                        class="page-checkbox"
                        v-if="hasCheck"
                        @click.stop="() => null"
                    >
                        <el-checkbox v-model="item.isChecked"></el-checkbox>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent, onMounted, ref, watch } from "vue-demi";
import pageListServer from "../../hooks/pageList";
import { ElMessage } from "element-plus";
import useHome from "@/hooks/useHome";
export default defineComponent({
    props: ["pageListOption"],
    setup(props, { emit }) {
        const { getPageDetail } = useHome();
        const pageList = ref([]);
        const page = ref({});
        const { hasCheck, selected } = pageListServer();
        onMounted(() => {
            selectPage(0);
        });
        watch(
            () => props.pageListOption,
            () => {
                pageList.value = props.pageListOption;
                selectPage(0);
            }
        );
        const selectPage = async (index) => {
            selected.value = index;
            const newPage =
                pageList.value.length > 0 ? pageList.value[index] : {};
            if (pageList.value.length > 0) {
                if (newPage.isGetData) {
                    page.value = newPage;
                } else {
                    emit("changeRemark", pageList.value[index].Remark);
                    page.value = await getPageDetail(pageList.value[index], pageList.value[index].originType);
                }
            } else {
                page.value = {};
            }
        };
        const screenRef = ref();

        const prevCard = () => {
            screenRef.value.execPrev();
        };

        const pagePrev = async () => {
            if (selected.value === 0) {
                return ElMessage({ type: "warning", message: "已经是第一页" });
            }
            selected.value--;
            emit("changeRemark", pageList.value[selected.value].Remark);
            page.value = await getPageDetail(pageList.value[selected.value], pageList.value[selected.value].originType);
        };

        const nextCard = () => {
            screenRef.value.execNext();
        };

        const pageNext = async () => {
            if (selected.value === pageList.value.length - 1) {
                return ElMessage({ type: "warning", message: "已经是最后一页" });
            }
            selected.value++;
            emit("changeRemark", pageList.value[selected.value].Remark);
            page.value = await getPageDetail(pageList.value[selected.value], pageList.value[selected.value].originType);
        };
        return {
            screenRef,
            page,
            hasCheck,
            selected,
            pageList,
            prevCard,
            pagePrev,
            selectPage,
            nextCard,
            pageNext
        };
    }
});
</script>

<style lang="scss" scoped>
.pageListComponents{
    display: flex;
    flex: 1;
    ::v-deep .slide-content{
        width: 100% !important;
        height: 100% !important;
    }
    ::v-deep .scale-content{
        width: 100% !important;
        height: 100% !important;
    }
    ::v-deep .screen-slide{
        width: 100% !important;
        height: 100% !important;
        transform: scale(1) !important;
        >div:nth-of-type(1){
            width: 100% !important;
            height: 100% !important;
            >.screen-element{
                width: 100% !important;
                height: 100% !important;
            }
        }
    }
    ::v-deep .element-content> .player{
        width: 100% !important;
        height: 100% !important;
        transform: scale(1) !important;
    }
    ::v-deep .base-element-video{
        width: 100% !important;
        height: 100% !important;
    }
}
.me-work {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
}
.me-work-screen {
    width: 100%;
    height: 100%;
}
.me-page {
    min-width: 0;
    background-color: #fff;
    display: flex;
    flex-wrap: nowrap;
    padding: 15px;
    background-color: #fff;
    border-top: 1px solid #ccc;
    overflow-x: auto;
}

.me-page-item {
    background-color: #f0f3ff;
    color: #5560f1;
    padding: 14px 10px;
    box-sizing: border-box;
    text-align: center;
    /*min-width: 100px;*/
    font-size: 20px;
    white-space: nowrap;
    margin-right: 10px;
    border: 2px solid #f0f3ff;
    border-radius: 10px;
    cursor: pointer;
    position: relative;
}

.me-page-item.active {
    border: 2px solid #6675f4;
}

.page-checkbox {
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
}
</style>
