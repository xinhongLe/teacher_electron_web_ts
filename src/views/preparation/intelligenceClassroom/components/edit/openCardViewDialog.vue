<template>
    <el-dialog v-model="visible" :close-on-click-modal="false" :fullscreen="true" width="80%" title="" center @close="close">
        <ScreenView ref="screenRef" :inline="true" :isInit="isInit" @pagePrev="execPrev" @pageNext="execNext" :slide="slideView"/>
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

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import useHome from "@/hooks/useHome";
import { getWinCardDBData } from "@/utils/database";
import { ElMessage } from "element-plus";
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
    emits: ["closeOpenCard"],
    setup(props, { emit }) {
        const visible = computed(() => props.dialogVisible);
        const slideView = ref({});
        const cardList = ref<any[]>([]);
        const selected = ref(0);
        const isInit = ref(true);
        const { getPageDetail } = useHome();
        onMounted(async () => {
            cardList.value = props.cardList;
            _getPageDetail(selected.value);
        });
        const execPrev = () => {
            if (selected.value === 0) {
                return ElMessage({ type: "warning", message: "已经是第一页" });
            }
            selected.value--;
            isInit.value = false;
            _getPageDetail(selected.value);
        };
        const execNext = () => {
            if (selected.value === cardList.value.length - 1) {
                return ElMessage({ type: "warning", message: "已经是最后一页" });
            }
            selected.value++;
            isInit.value = true;
            _getPageDetail(selected.value);
        };
        const checkPage = async (index: number) => {
            selected.value = index;
            _getPageDetail(selected.value);
        };
        const _getPageDetail = async (index:number) => {
            const dbResArr = await getWinCardDBData(cardList.value[index].ID);
            if (dbResArr.length > 0) {
                slideView.value = JSON.parse(dbResArr[0].result);
            } else {
                await getPageDetail(cardList.value[index], 1, (res: any) => {
                    if (res && res.id) {
                        slideView.value = res;
                    }
                });
            }
        };
        const close = () => {
            emit("closeOpenCard");
        };
        return {
            visible,
            isInit,
            slideView,
            execPrev,
            execNext,
            selected,
            checkPage,
            close
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
