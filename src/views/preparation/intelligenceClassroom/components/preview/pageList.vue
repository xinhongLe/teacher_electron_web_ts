<template>
    <div class="pageListComponents">
        <div class="me-work" :class=" fullscreenStyle ? 'fullscreen' : ''">
            <ScreenView
                class="me-work-screen"
                :inline="true"
                ref="screenRef"
                :slide="page"
                @pagePrev="pagePrev"
                @pageNext="pageNext"
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
import useHome from "@/hooks/useHome";
export default defineComponent({
    props: ["pageListOption"],
    setup(props, { emit }) {
        const { getPageDetail } = useHome();
        const pageList = ref([]);
        const page = ref({});
        const { hasCheck, selected } = pageListServer();
        onMounted(() => {
            selected.value = 0;
            selectPage(selected.value);
        });
        watch(
            () => props.pageListOption,
            () => {
                pageList.value = props.pageListOption;
                selected.value = 0;
                selectPage(selected.value);
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
            if (selected.value > 0) {
                selected.value--;
                emit("changeRemark", pageList.value[selected.value].Remark);
                page.value = await getPageDetail(pageList.value[selected.value], pageList.value[selected.value].originType);
            }
            if (selected.value === 0) {
                emit("firstPage");
            }
        };

        const nextCard = () => {
            screenRef.value.execNext();
        };

        const pageNext = async () => {
            if (selected.value === pageList.value.length - 1) {
                emit("lastPage");
            }
            if (selected.value === 0) {
                selected.value++;
                emit("changeRemark", pageList.value[selected.value].Remark);
            } else {
                selected.value++;
                emit("changeRemark", pageList.value[selected.value].Remark);
                page.value = await getPageDetail(pageList.value[selected.value], pageList.value[selected.value].originType);
            }
        };
        const fullscreenStyle = ref(false);
        const fullScreen = () => {
            fullscreenStyle.value = true;
        };
        const clockFullScreen = () => {
            fullscreenStyle.value = false;
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
            fullScreen,
            fullscreenStyle,
            pageNext,
            clockFullScreen
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
