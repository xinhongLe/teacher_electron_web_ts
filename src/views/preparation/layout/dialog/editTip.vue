<template>
    <el-dialog
        custom-class="custom-dialog"
        center
        title="提示"
        width="450px"
        :model-value="visible"
        @close="close()"
    >
        <div class="tip-box">
            <img src="@/assets/images/preparation/icon_tips_popup.png" alt="">
            该资源不可编辑，<br />
            需要【保存为我的文件】才可编辑哦。
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="close()">取消</el-button>
                <el-button type="primary" @click="save()"> 保存为我的文件 </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { IResourceItem, saveToMyResource, sysWincardResource } from "@/api/resource";
import { useStore } from "@/store";
import { computed, defineComponent, PropType } from "vue";
import { CopyWindow } from "../../intelligenceClassroom/api";

export default defineComponent({
    props: {
        resource: {
            type: Object as PropType<IResourceItem>,
            required: true
        },
        visible: {
            type: Boolean,
            default: false
        }
    },
    setup(props, { emit }) {
        const close = () => {
            emit("update:visible", false);
        };

        const store = useStore();
        const userId = computed(() => store.state.userInfo.userCenterUserID);
        const lessonId = computed(() => store.state.preparation.selectLessonId);

        const save = async () => {
            // const res = await saveToMyResource({
            //     resourceId: props.resource.ResourceId,
            //     schoolId,
            //     schoolName
            // });
            const res = await CopyWindow({
                id: props.resource.OldResourceId,
                originType: props.resource.UserId ? 1 : null,
                sourceLessonID: store.state.preparation.selectLessonId
            });
            
            if (res.success) {
                const sysRes = await sysWincardResource({
                    id: res.result.ID,
                    userId: userId.value,
                    lessonID: lessonId.value
                });
                emit("update:visible", false);
                emit("update");
            }
        };

        return {
            close,
            save
        }
    }
});
</script>

<style lang="scss" scoped>
.tip-box {
    padding: 30px 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    img {
        display: block;
        width: 50px;
        margin-right: 20px;
    }
}
</style>
