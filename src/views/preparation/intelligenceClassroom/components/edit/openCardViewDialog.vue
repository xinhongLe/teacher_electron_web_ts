<template>
    <el-dialog v-model="visible" width="80%" title="" center @close="close">
        <ScreenView ref="screenRef" :inline="true"  :slide="slideView"/>
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
import { useRoute } from "vue-router";
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
        const cardList = ref<any[]>([]);
        const selected = ref(0);
        const { getPageDetail } = useHome();
        const originType: any = route.params.originType as string ? route.params.originType as string : 1;
        onMounted(async() => {
            cardList.value = props.cardList;
            console.log(cardList.value, "cardList.value");
            slideView.value = await getPageDetail(cardList.value[0], originType);
            console.log(slideView, "slideview");
        });
        const close = () => {
            emit("update:dialogVisible", false);
        };
        const checkPage = async (index: number) => {
            selected.value = index;
            slideView.value = await getPageDetail(cardList.value[index], originType);
        };
        return {
            visible,
            slideView,
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
