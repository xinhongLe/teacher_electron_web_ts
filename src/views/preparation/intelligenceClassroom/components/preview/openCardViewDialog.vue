<template>
    <el-dialog v-model="visible" :fullscreen="true" title="" :close-on-click-modal="false" center @close="close">
        <ScreenView ref="screenRef" :isInit="isInit" @pagePrev="execPrev" @pageNext="execNext" :inline="true"  :slide="slideView"/>
        <template #footer>
          <span class="dialog-footer">
              <div class="cardLis-class">
                  <div
                      class="me-page-item"
                      :class="selected === index && 'active'"
                      v-for="(item, index) in cardList"
                      @click="checkPage(index)"
                      :key = item.ID>
                      {{item.Name}}
                  </div>
              </div>
          </span>
        </template>
    </el-dialog>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
import useHome from "@/hooks/useHome";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { get, STORAGE_TYPES } from "@/utils/storage";
import { getWinCardDBData } from "@/utils/database";
export default defineComponent({
    name: "openCardViewDia",
    props: {
        dialogVisible: {
            type: Boolean,
            require: true
        },
        cardList: {
            type: Array,
            default: () => []
        }
    },
    emits: ["update:dialogVisible"],
    setup(props, { emit }) {
        const route = useRoute();
        const visible = computed(() => props.dialogVisible);
        const slideView = ref({});
        const cardList = ref([]);
        const selected = ref(0);
        const { getPageDetail } = useHome();
        const isInit = ref(true);
        onMounted(async() => {
            cardList.value = props.cardList;
            console.log(cardList.value, "cardList.value");
            getDataBase(cardList.value[0].id);
            console.log(slideView, "slideview");
        });
        const close = () => {
            emit("update:dialogVisible", false);
        };
        const checkPage = async (index) => {
            selected.value = index;
            getDataBase(cardList.value[index].id);
        };
        const execPrev = async() => {
            if (selected.value === 0) {
                return ElMessage({ type: "warning", message: "已经是第一页" });
            }
            selected.value--;
            isInit.value = false;
            getDataBase(cardList.value[selected.value].id);
        };
        const execNext = async () => {
            if (selected.value === cardList.value.length - 1) {
                return ElMessage({ type: "warning", message: "已经是最后一页" });
            }
            selected.value++;
            isInit.value = true;
            getDataBase(cardList.value[selected.value].id);
        };
        const getDataBase = async (str) => {
            const dbResArr = await getWinCardDBData(str);
            console.log(dbResArr.length, dbResArr);
            if (dbResArr.length > 0) {
                slideView.value = JSON.parse(dbResArr[0].result);
            } else {
                const pageIdIng = get(STORAGE_TYPES.SET_PAGEIDING);
                if (pageIdIng && pageIdIng === str) {
                    const interval = setInterval(async () => {
                        const dbResArr = await getWinCardDBData(str);
                        if (dbResArr.length > 0) {
                            clearInterval(interval);
                            slideView.value = JSON.parse(dbResArr[0].result);
                        }
                    }, 300);
                } else if (pageIdIng && pageIdIng !== str) {
                    const interval = setInterval(async () => {
                        if (!pageIdIng) {
                            clearInterval(interval);
                            await getPageDetail(str, (res) => {
                                if (res && res.id) {
                                    slideView.value = res;
                                }
                            });
                        }
                    }, 300);
                } else {
                    await getPageDetail(str, (res) => {
                        if (res && res.id) {
                            slideView.value = res;
                        }
                    });
                }
            }
        };
        return {
            visible,
            isInit,
            slideView,
            selected,
            checkPage,
            close,
            execPrev,
            execNext
        };
    }
});
</script>

<style scoped lang="scss">
.cardLis-class{
    display: flex;
    justify-content: flex-start;
    overflow-y: auto;
    .me-page-item {
        background-color: #f0f3ff;
        color: #444;
        padding: 10px 20px;
        box-sizing: border-box;
        text-align: center;
        min-width: 100px;
        font-size: 14px;
        white-space: nowrap;
        margin-right: 10px;
        border: 2px solid #f0f3ff;
        cursor: pointer;
        position: relative;
    }

    .me-page-item.active {
        border: 2px solid #6675f4;
    }
}
</style>
