<template>
    <div class="pageListComponents">
        <div :class=" fullscreenStyle ? 'me-work fullscreen' : 'me-work'">
            <ScreenView
                class="me-work-screen"
                :inline="true"
                ref="screenRef"
                :slide="page"
                @pagePrev="prevCard()"
                @pageNext="nextCard()"
            />
            <div
                v-if="!fullscreenStyle"
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
        const prevCard = async () => {
            if (selected.value === 0) {
                return ElMessage({ type: "warning", message: "已经是第一页" });
            }
            selected.value--;
            emit("changeRemark", pageList.value[selected.value].Remark);
            page.value = await getPageDetail(pageList.value[selected.value], pageList.value[selected.value].originType);
        };
        const nextCard = async () => {
            if (selected.value === pageList.value.length - 1) {
                return ElMessage({ type: "warning", message: "已经是最后一页" });
            }
            selected.value++;
            console.log(pageList.value[selected.value], "vvvvv");
            emit("changeRemark", pageList.value[selected.value].Remark);
            page.value = await getPageDetail(pageList.value[selected.value], pageList.value[selected.value].originType);
        };
        const fullscreenStyle = ref(false);
        const fullScreen = () => {
            fullscreenStyle.value = !fullscreenStyle.value;
        };
        return {
            page,
            hasCheck,
            selected,
            pageList,
            prevCard,
            selectPage,
            nextCard,
            fullScreen,
            fullscreenStyle
        };
    }
});
</script>

<style lang="scss" scoped>
.pageListComponents{
    display: flex;
    flex: 1;
    ::v-deep .slide-list{
        background-color: #fff;
    }
}
.fullscreen{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100% - 56px);
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
