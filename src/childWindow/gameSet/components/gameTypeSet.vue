<template>
    <el-dialog v-model="visible" :title="currentGame.Name || ''" width="920px" center @close="handleClose">
        <div v-if="currentComponent" class="page-type-box">
            <component :is="currentComponent" :slide="slide" @save="save"></component>
        </div>
        <div v-else class="empty">
            该游戏暂不支持配置
        </div>
    </el-dialog>
</template>

<script lang="ts" setup>
import { computed, defineComponent, ref, nextTick, PropType, reactive, toRefs, watch } from "vue";
import { IGameItem } from "@/types/game";
import useHome from "@/views/preparation/intelligenceClassroom/components/edit/games/hook/useHome";

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    currentGame: {
        type: Object as PropType<IGameItem>,
        required: true
    }
});

const emits = defineEmits(["update:modelValue"]);

const { gameTypeList } = useHome();

const visible = computed(() => props.modelValue);
const currentComponent = ref<any>("");

const handleClose = () => {
    emits("update:modelValue", false);
};

const init = () => {
    currentComponent.value = gameTypeList.value.find(item => props.currentGame?.Type === item.type)?.com;
};

init();
</script>

<style scoped lang="scss">
.page-type-box {
    margin-left: 20px;
}

:deep(.el-form-item__label) {
    font-size: 14px;
    font-weight: bold;
}

.empty {
    text-align: center;
    width: 100%;
    height: 400px;
    line-height: 400px;
}
</style>
