<template>
    <div class="pageListComponents">
        <div class="me-work">
            <ScreenView
                class="me-work-screen"
                :inline="true"
                ref="screenRef"
                :slide="screenViewPage"
                :useScale="false"
            />
            <div class="me-page">
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
        </div>
    </div>
</template>

<script>
import useHome from "@/hooks/useHome";
import { defineComponent, ref, watch } from "vue-demi";
import { ElMessage } from "element-plus";
export default defineComponent({
    props: ["pageListOption"],
    setup(props) {
        const selected = ref(0);
        const pageList = ref([]);
        const screenViewPage = ref({});
        const { transformType, getPageDetail } = useHome();
        watch(
            () => props.pageListOption,
            () => {
                pageList.value = props.pageListOption.pages;
                selected.value = -1;
                pageNext(selected.value);
            }
        );
        const getDataBase = async(str, obj) => {
            console.log(obj, pageList.value);
            if (transformType(obj.Type) === -1) {
                ElMessage({ type: "warning", message: "暂不支持该页面类型" });
                screenViewPage.value = {};
                return false;
            }
            await getPageDetail(obj, obj.originType, (res) => {
                if (res && res.id) {
                    screenViewPage.value = res;
                }
            });
        };
        const pageNext = () => {
            console.log(pageList.value);
            selected.value++;
            getDataBase(pageList.value[selected.value].ID, pageList.value[selected.value]);
        };
        const selectPage = (index, item) => {
            selected.value = index;
            getDataBase(pageList.value[index].ID, pageList.value[index]);
        };
        return {
            selected,
            pageList,
            screenViewPage,
            selectPage
        };
    }
});
</script>

<style lang="scss" scoped>
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
.me-page {
    min-width: 0;
    background-color: #fff;
    display: flex;
    flex-wrap: nowrap;
    padding: 15px;
    background-color: #fff;
    overflow-y: hidden;
    overflow-x: auto;
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
