<template>
    <div>
        <div class="me-work">
        <ViewArea
            :pageData="page"
            :width="page.pageSetting ? page.pageSetting.width : 1280"
            :height="page.pageSetting ? page.pageSetting.height : 720"
            ref="work"
        />
        <!-- @updateCurrentStep="updateCurrentStep"
        @nextPage="nextPage"
        @prevPage="prevPage" -->
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
                {{ item.name }}
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
import { computed, defineComponent, onMounted, ref } from "vue-demi";
import pageListServer from "../../hooks/pageList";
import ViewArea from "./viewArea.vue";
export default defineComponent({
    props: ["pageListOption"],
    components: { ViewArea },
    setup(props) {
        const pageList = computed(() => props.pageListOption);
        const page = ref({});
        const { hasCheck, selected, getPageData } = pageListServer();
        onMounted(() => {
            selectPage(0);
        });
        const selectPage = async (index) => {
            selected.value = index;
            const newPage = pageList.value.length > 0 ? pageList.value[index] : {};
            if (pageList.value.length > 0) {
                if (newPage.isGetData) {
                    page.value = newPage;
                } else {
                    const { elements, steps, pageSetting } = await getPageData({ pageID: newPage.id, type: newPage.type, originType: 1 });
                    newPage.isGetData = true;
                    newPage.elements = elements;
                    newPage.steps = steps;
                    newPage.pageSetting = pageSetting || {};
                    page.value = newPage;
                }
            } else {
                page.value = {};
            }
        };
        return {
            page,
            hasCheck,
            selected,
            pageList,
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
    color:#5560f1;
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
