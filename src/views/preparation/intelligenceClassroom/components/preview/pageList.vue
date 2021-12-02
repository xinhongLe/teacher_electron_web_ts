<template>
    <div>
        <div class="me-work">
            <ScreenView
                class="me-work-screen"
                :inline="true"
                ref="screenRef"
                :slide="page"
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
import { computed, defineComponent, onMounted, ref, watch } from "vue-demi";
import pageListServer from "../../hooks/pageList";
import useHome from "@/hooks/useHome";
// import ViewArea from "./viewArea.vue";
// import { originType } from "@/config/index";
export default defineComponent({
    props: ["pageListOption"],
    // components: { ViewArea },
    setup(props) {
        const { getPageDetail } = useHome();
        const pageList = computed(() => props.pageListOption);
        const page = ref({});
        const { hasCheck, selected } = pageListServer();
        onMounted(() => {
            selectPage(0);
        });
        watch(
            () => props.pageListOption,
            () => {
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
                    console.log(newPage, "newpage");
                    console.log(pageList.value[index]);
                    page.value = await getPageDetail(pageList.value[index]);
                }
            } else {
                page.value = {};
            }
        };
        const prevStep = () => {
            console.log("上一步触发");
        };
        return {
            page,
            hasCheck,
            selected,
            pageList,
            prevStep,
            selectPage
        };
    }
});
</script>

<style lang="scss" scoped>
.me-work {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
}
.me-work-screen {
    width: 1280px;
    height: 720px;
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
