
<template>
    <el-dialog v-model="visible" :title="currentGame.Name || ''" width="920px" center @close="close">
        <div v-if="currentComponent" class="page-type-box">
           <component :is="currentComponent"  :slide="slide" @save="save"></component>
        </div>
        <div v-else class="empty">
            该游戏暂不支持配置
        </div>
    </el-dialog>
</template>

<script lang="ts">
import { Slide } from "wincard";
import { computed, defineComponent, ref, nextTick, PropType, reactive, toRefs, watch } from "vue";
import { getGameToolList } from "@/api/game.ts";
import { IGameItem } from "@/types/game";
import useHome from "./hook/useHome";
interface State {
    listList: IGameItem[],
    currentGame: IGameItem
}

export default defineComponent({
    name: "gameType",
    props: {
        modelValue: {
            type: Boolean,
            require: true
        },
        slide: {
            type: Object as PropType<Slide>,
            require: true
        }
    },
    emits: ["update:modelValue", "addGame"],
    setup(props, { emit }) {
        const state = reactive<State>({
            listList: [],
            currentGame: {} as IGameItem
        });

        const visible = computed(() => props.modelValue);
        const currentComponent = ref<any>("");

        const { gameTypeList } = useHome();

        watch(() => props.modelValue, (val) => {
            if (val) {
                nextTick(async() => {
                    await _getGameToolList();
                });
            }
        }, { immediate: true });

        const save = (valueGame:IGameItem) => {
            emit("addGame", valueGame);
            close();
        };
        const close = () => {
            emit("update:modelValue", false);
        };

        const _getGameToolList = () => {
            const data = { state: 2, name: "" };
            getGameToolList(data).then(async (res:any) => {
                if (res.resultCode === 200) {
                    state.listList = res.result || [];
                    state.currentGame = state.listList.find(item => item.ID === props.slide?.game?.id) || {} as IGameItem;
                    currentComponent.value = gameTypeList.value.find(item => state.currentGame?.Type === item.type)?.com;
                }
            });
        };

        return {
            ...toRefs(state),
            visible,
            currentComponent,
            save,
            close
        };
    }
});
</script>

<style scoped lang="scss">
.page-type-box{
    margin-left: 20px;
}
:deep(.el-form-item__label){
    font-size: 14px;
    font-weight: bold;
}
.empty{
    text-align: center;
    width: 100%;
    height: 400px;
    line-height: 400px;
}
</style>
