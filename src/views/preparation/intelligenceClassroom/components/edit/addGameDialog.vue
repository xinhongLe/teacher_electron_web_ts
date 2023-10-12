
<template>
    <el-dialog v-model="visible" title="游戏" width="785px" center @close="close">
        <div class="page-type-box">
            <div :class="['content', currentIndex === index ? 'active'  : '']" v-for="(item, index) in list" :key="item.ID" @click="handleSelect(item, index)">
                <img style="height: 100px;width: 140px" :src="item.imgUrl" alt="">
                <div class="text">{{item.Name}}</div>
            </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="handleComfirm">确定</el-button>
          </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from "vue";
import { getGameToolList } from "@/api/game";
import { getOssUrl } from "@/utils/oss";
import { IGameItem } from "@/types/game";
interface State {
    list: IGameItem[],
    currentValue: IGameItem,
    currentIndex: number
}

export default defineComponent({
    name: "addGameDialog",
    props: {
        modelValue: {
            type: Boolean,
            require: false
        }
    },
    emits: ["update:modelValue", "addGame"],
    setup(props, { emit }) {
        const state = reactive<State>({
            list: [],
            currentValue: {} as IGameItem,
            currentIndex: -1
        });

        const visible = computed(() => props.modelValue);

        const handleComfirm = () => {
            emit("addGame", state.currentValue);
            close();
        };
        const close = () => {
            emit("update:modelValue", false);
        };

        const handleSelect = (item:IGameItem, index:number) => {
            state.currentValue = item;
            state.currentIndex = index;
        };

        const _getGameToolList = () => {
            const data = { state: 2, name: "" };
            getGameToolList(data).then(async res => {
                if (res.resultCode === 200) {
                    const data = res.result || [];
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].File) {
                            const fileInfo = await getOssUrl(`${data[i].File.FilePath}/${data[i].File.FileName}.${data[i].File.Extention}`, `${data[i].File.Bucket}`);
                            data[i].imgUrl = fileInfo;
                        }
                    }
                    state.list = data;
                }
            });
        };
        _getGameToolList();

        return {
            ...toRefs(state),
            visible,
            handleComfirm,
            handleSelect,
            close
        };
    }
});
</script>

<style scoped lang="scss">
.page-type-box{
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    max-height: 660px;
    overflow-y: auto;
    .content{
        text-align: center;
        margin-left: 20px;
        margin-bottom: 20px;
        padding: 10px;
        border: 1px solid #fff;
        img{
            width: 140px;
            height: 100px;
            cursor: pointer;
        }
        .text{
            font-size: 16px;
            font-weight: 600;
            margin-top: 10px;
        }
    }
    .active{
        border: 1px solid var(--el-color-primary);
    }
}
</style>
