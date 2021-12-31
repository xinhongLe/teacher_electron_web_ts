<template>
    <div class="pageListComponents" id="pageListComponents">
        <div class="me-work">
            <div class="screen-views">
                <ScreenView
                    class="me-work-screen"
                    :inline="true"
                    ref="screenRef"
                    :slide="screenViewPage"
                    :useScale="false"
                    :isInit="isInit"
                    @pagePrev="pagePrev()"
                    @pageNext="pageNext()"
                />
                <Tagging ref="taggingRef" class="taggingComponents"></Tagging>
            </div>
            <div class="me-page">
                <div class="me-page-list">
                    <div
                        class="me-page-item"
                        :class="selected === index && 'active'"
                        v-for="(item, index) in pageList"
                        :key="index"
                        @click="selectPage(index, item)"
                    >
                        {{ item.Name }}
                    </div>
                </div>
                <div class="me-page-step">
                    <div><i class="el-icon-arrow-left"></i>上一页</div>
                    <div>下一页<i class="el-icon-arrow-right"></i></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import useHome from "@/hooks/useHome";
import { defineComponent, ref, watch } from "vue-demi";
import { ElMessage } from "element-plus";
import { getWinCardDBData } from "@/utils/database";
import Tagging from "./tagging.vue";
export default defineComponent({
    props: ["pageListOption"],
    components: { Tagging },
    setup(props, { emit }) {
        const selected = ref(0);
        const pageList = ref([]);
        const screenViewPage = ref({});
        const canvasRef = ref();
        const isInit = ref(true);
        const screenRef = ref();
        const switchFlag = ref(false);
        const taggingRef = ref();
        const { transformType, getPageDetail } = useHome();
        watch(
            () => props.pageListOption,
            () => {
                if (switchFlag.value) {
                    switchFlag.value = false;
                    pageList.value = props.pageListOption.pages;
                    selected.value = pageList.value.length - 1;
                    pageNextEnd();
                } else {
                    pageList.value = props.pageListOption.pages;
                    selected.value = -1;
                    pageNext();
                }
            }
        );
        // 下一步
        const pageNext = async () => {
            if (pageList.value.length === 0) {
                screenViewPage.value = {};
            }
            if (selected.value === pageList.value.length - 1) {
                isInit.value = true;
                emit("lastPage");
            } else {
                selected.value++;
                isInit.value = true;
                getDataBase(pageList.value[selected.value].ID, pageList.value[selected.value]);
            }
        };
        // 上一步
        const pagePrev = async () => {
            if (selected.value > 0) {
                selected.value--;
                isInit.value = false;
                getDataBase(pageList.value[selected.value].ID, pageList.value[selected.value]);
                return;
            }
            if (selected.value === 0) {
                console.log("上一页");
                isInit.value = false;
                switchFlag.value = true;
                emit("firstPage");
            }
        };
        const nextCard = () => {
            isInit.value = true;
            screenRef.value.execNext();
        };
        const prevCard = () => {
            isInit.value = false;
            screenRef.value.execPrev();
        };
        const pageNextEnd = async () => {
            if (pageList.value.length > 0) {
                isInit.value = false;
                getDataBase(pageList.value[selected.value].ID, pageList.value[selected.value]);
            } else {
                screenViewPage.value = {};
            }
        };
        const getDataBase = async(str, obj) => {
            if (transformType(obj.Type) === -1) {
                ElMessage({ type: "warning", message: "暂不支持该页面类型" });
                screenViewPage.value = {};
                return false;
            }
            const dbResArr = await getWinCardDBData(str);
            if (dbResArr.length > 0) {
                screenViewPage.value = JSON.parse(dbResArr[0].result);
            } else {
                await getPageDetail(obj, obj.originType, (res) => {
                    if (res && res.id) {
                        screenViewPage.value = res;
                    }
                });
            }
        };
        const selectPage = (index, item) => {
            selected.value = index;
            getDataBase(pageList.value[index].ID, pageList.value[index]);
        };
        const addElement = () => {
            taggingRef.value.addElement();
        };
        return {
            selected,
            pageList,
            screenViewPage,
            canvasRef,
            screenRef,
            isInit,
            selectPage,
            addElement,
            pagePrev,
            pageNext,
            nextCard,
            prevCard,
            taggingRef
        };
    }
});
</script>

<style lang="scss" scoped>
.activeElements{
    background: red !important;
}
.elements{
    position: absolute;
    top: calc(50% - 20px);
    left: calc(50% - 10px);
    width: 20px;
    height: 40px;
    background: #000;
}
.pageListComponents{
    :deep(.el-overlay){
        z-index: 9999 !important;
    }
    :deep(.el-dialog.is-fullscreen){
        --el-dialog-width: 94%;
        --el-dialog-margin-top: 0;
        margin-bottom: 0;
        height: 96%;
        overflow: auto;
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        flex: 1;
    }
    :deep(.el-dialog__body){
        width: 100%;
        display: flex;
        flex: 1;
        min-width: 0;
        min-height: 0;
        overflow-y: auto;
    }
}
.pageListComponents{
    display: flex;
    flex: 1;
    min-width: 0;
    ::v-deep .slide-list{
        background-color: #fff;
    }
}
.fullscreen{
    position: fixed;
    top: 0;
    left: 0;
    width: calc(100% - 22rem);
    height: calc(100% - 85px);
}
.me-work {
    position: relative;
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
.me-work-screen {
    width: 100%;
    height: 100%;
}
.screen-views{
    display: flex;
    flex: 1;
    min-width: 0;
    min-height: 0;
    position: relative;
    .taggingComponents{
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
    }
}
.me-page {
    min-width: 0;
    background-color: #fff;
    display: flex;
    flex-wrap: nowrap;
    padding: 15px;
    background-color: #fff;
    .me-page-list{
        display: flex;
        flex: 1;
        min-width: 0;
        min-height: 0;
        overflow-y: hidden;
        overflow-x: auto;
        .me-page-item {
            background-color: #f0f3ff;
            color: #5560f1;
            padding: 0px 10px;
            box-sizing: border-box;
            text-align: center;
            height: 32px;
            display: flex;
            align-items: center;
            font-size: 16px;
            white-space: nowrap;
            margin-right: 10px;
            border: 1px solid #f0f3ff;
            border-radius: 5px;
            cursor: pointer;
            position: relative;
        }
        .me-page-item.active {
            border: 2px solid #6675f4;
        }
    }
    .me-page-step{
        display: flex;
        background: #fff;
        div{
            width: 98px;
            height: 36px;
            background: #4B71EE;
            color:#fff;
            border-radius: 4px;
            margin-left: 20px;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }
    }
}

.me-page-item {
    background-color: #f0f3ff;
    color: #5560f1;
    padding: 0px 10px;
    box-sizing: border-box;
    text-align: center;
    height: 32px;
    display: flex;
    align-items: center;
    // min-width: 100px;
    font-size: 16px;
    white-space: nowrap;
    margin-right: 10px;
    border: 1px solid #f0f3ff;
    border-radius: 5px;
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
