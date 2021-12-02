<template>
    <el-dialog v-model="visible" title="选择页面类型" width="60%" center @close="close">
        <div class="page-type-box">
            <el-radio v-for="(item, index) in pageTypeList" border :key="index"
            v-model="pageType" :label="item.value">
                {{item.name}}
            </el-radio>
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
import { computed, defineComponent, ref } from "vue";
import { pageTypeList } from "@/config/index";

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
        const pageType = ref(pageTypeList[0].value);

        const handleComfirm = () => {
            const page = pageTypeList.find(item => item.value === pageType.value);
            emit("addPage", page);
        };
        const close = () => {
            emit("update:dialogVisible", false);
        };
        return {
            visible,
            pageType,
            pageTypeList,
            handleComfirm,
            close
        };
    }
});
</script>
<style lang="scss" scoped>
.page-type-box{
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    .el-radio{
        margin-bottom: 20px;
    }
}
</style>
