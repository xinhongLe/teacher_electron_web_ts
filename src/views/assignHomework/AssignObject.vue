<template>
    <div class="container">
        <p class="title-class">布置对象</p>
        <div class="class-wrapper">
            <el-button size="large" plain @click="openDialog">{{
                    classList.length > 0 ? "重选" : "选择"
                }}
            </el-button>
            <div class="class-content">
                <p v-for="(item, index) in classList" :key="index">
                    {{ item.ClassName }}
                    <span>班级人数：{{ item.Students.length }}</span>
                </p>
            </div>
        </div>
        <ClassDialog
            v-if="dialogVisible"
            v-model:dialogVisible="dialogVisible"
            v-model:classList="classList"
        />

    </div>
    <!--    <SelectAttendClass v-model:classVisible="dialogVisible" v-model:currentClassList="classList" v-if="dialogVisible">-->
    <!--    </SelectAttendClass>-->
</template>

<script lang="ts">
import {ClassData} from "@/types/assignHomework";
import {ElMessage, ElMessageBox} from "element-plus";
import {defineComponent, ref, watch} from "vue";
import ClassDialog from "./ClassDialog.vue";
import SelectAttendClass from "@/components/navBar/selectAttendClass.vue";

export default defineComponent({
    setup(props, {emit}) {
        const classList = ref<ClassData[]>([]);
        const dialogVisible = ref(false);

        const openDialog = () => {
            if (classList.value.length > 0) {
                ElMessageBox.confirm(
                    "重选会清空已选的学生, 是否继续?",
                    "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    }
                )
                    .then(() => {
                        dialogVisible.value = true;
                    })
                    .catch(() => {
                        ElMessage.info("已取消");
                    });
            } else {
                dialogVisible.value = true;
            }
        };

        const clearClassList = () => {
            classList.value = [];
        };

        watch(
            classList,
            (v) => {
                console.log('v--', v)
                emit("updateClassList", v);
            },
            {deep: true}
        );

        return {
            classList,
            openDialog,
            clearClassList,
            dialogVisible,
        };
    },
    components: {SelectAttendClass, ClassDialog},
});
</script>

<style lang="scss" scoped>
.container {
    display: flex;
    margin-bottom: 30px;

    .title-class {
        width: 100px;
        font-size: 20px;
        font-weight: 600;
        color: #19203d;
        text-align: center;
        margin-right: 20px;
        padding-top: 8px;
    }

    .class-wrapper {
        flex: 1;

        .class-content {
            margin-top: 10px;

            > p {
                width: 100%;
                height: 56px;
                line-height: 56px;
                background: #f9fafc;
                border-radius: 4px;
                padding: 0 20px;
                margin-bottom: 10px;

                span {
                    display: inline-block;
                    margin-left: 40px;
                }
            }
        }
    }
}
</style>
