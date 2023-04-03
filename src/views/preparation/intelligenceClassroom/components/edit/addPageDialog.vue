<template>
    <el-dialog v-model="visible" title="新增互动页" :width="604" @close="close">
        <div class="page-type-box">
            <div class="item" v-for="(item,index) in pageList" :key="item.value" @click="handleItem(item.value)">
                <img class="preview" :src="require(`@/assets/edit/page_type${index+1}.png`)" alt=""/>
                <div class="title">
                    <img :src="require(`@/assets/edit/icon_${item.value === pageType ? 'clicked' : 'unclick'}.png`)" alt=""/>
                    {{ item.name }}
                </div>
                <div class="note">{{ item.note }}</div>
            </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="handleConfirm">确定</el-button>
          </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { pageTypeList } from "@/config";

export default defineComponent({
    name: "addPageDialog",
    props: {
        dialogVisible: {
            type: Boolean,
            require: true
        }
    },
    emits: ["update:dialogVisible", "addPage"],
    setup(props, { emit }) {
        const visible = computed(() => props.dialogVisible);
        const pageType = ref(pageTypeList[1].value);

        const pageList = computed(() => pageTypeList.filter(item => item.value !== 11));

        const handleConfirm = () => {
            const page = pageTypeList.find(item => item.value === pageType.value);
            emit("addPage", page);
        };

        const close = () => {
            emit("update:dialogVisible", false);
        };

        const handleItem = (type: number) => {
            pageType.value = type;
        };

        return {
            visible,
            pageList,
            pageType,
            close,
            handleItem,
            handleConfirm
        };
    }
});
</script>

<style lang="scss" scoped>
.page-type-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 0 28px;

    .item {
        cursor: pointer;
        width: 234px;

        &:first-child, &:nth-child(2) {
            margin-bottom: 32px;
        }

        .preview {
            width: 234px;
            height: 130px;
        }

        .title {
            height: 40px;
            display: flex;
            align-items: center;

            img {
                width: 16px;
                height: 16px;
                margin-right: 8px;
            }
        }

        .note {
            line-height: 18px;
            color: #414E65;
            font-size: 12px;
        }
    }

    .el-radio {
        margin-bottom: 20px;
    }
}
</style>
