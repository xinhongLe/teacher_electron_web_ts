<template>
    <el-dialog v-if="visible" v-model="visible" title="自定义字段管理" width="110px" center @close="close">
        <div class="page-type-box">
            <div>
                <span>*最多可以配置10个自定义字段</span>
                <div class="add-btn">
                    <span type="primary">+ 创建评价表</span>
                </div>
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

<script>

</script>
<script lang="ts">
import { computed, defineComponent, reactive, toRefs, ref } from "vue";

export default defineComponent({
    name: "lessonFieldMange",
    props: {
        dialogVisible: {
            type: Boolean,
            require: true
        },
    },
    emits: ["update:dialogVisible", "handleAddCard"],
    setup(props, { emit }) {
        const state = reactive({

        });

        const visible = computed(() => props.dialogVisible);

        const handleComfirm = () => {
            ruleForm.value.validate((valid: Boolean) => {
                if(valid){
                    emit("handleAddCard", form.value.name);
                }
            })
        };
        const close = () => {
            emit("update:dialogVisible", false);
        };
        return {
            ...toRefs(state),
            visible,
            handleComfirm,
            close
        };
    }
});
</script>

<style scoped lang="scss">
.left-add {
    border-radius: 4px;
    border: 1px solid #2E95FF;
    color: #2E95FF;
    height: 40px;
    line-height: 40px;
    width: 220px;
    text-align: center;
}
</style>
