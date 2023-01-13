<template>
    <el-dialog
        class="custom-dialog"
        center
        title="提示"
        width="450px"
        :model-value="visible"
        @close="close()"
    >
        <div class="tip-box">
            <img src="@/assets/images/preparation/icon_tips_popup.png" alt="" />
            该资源不可编辑，<br />
            需要【保存为我的文件】才可编辑哦。
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="close()">取消</el-button>
                <el-button
                    type="primary"
                    :disabled="disabledBtn"
                    @click="save()"
                    >保存为我的文件</el-button
                >
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import {
    IResourceItem,
    saveToMyResource,
    sysWincardResource,
} from "@/api/resource";
import { useStore } from "@/store";
import { computed, defineComponent, PropType, ref } from "vue";
import { CopyWindow } from "../../intelligenceClassroom/api";
import loading from "@/components/loading";
import emitter from "@/utils/mitt";

export default defineComponent({
    props: {
        resource: {
            type: Object as PropType<IResourceItem>,
        },
        visible: {
            type: Boolean,
            default: false,
        },
    },
    emits: ["update", "update:visible"],
    setup(props, { emit }) {
        const store = useStore();
        const userId = computed(() => store.state.userInfo.userCenterUserID);
        const lessonId = computed(() => store.state.preparation.selectLessonId);
        const schoolId = computed(() => store.state.userInfo.schoolId);
        const schoolName = computed(() => store.state.userInfo.schoolName);

        const disabledBtn = ref(false);
        const save = async () => {
            if (props.resource) {
                disabledBtn.value = true;
                if (props.resource.ResourceShowType === 1) {
                    loading.show();
                    const res = await CopyWindow({
                        id: props.resource.OldResourceId,
                        originType: props.resource.UserId ? 1 : null,
                        sourceLessonID: store.state.preparation.selectLessonId,
                        targetLessonID: store.state.preparation.selectLessonId,
                    });

                    if (res.success) {
                        const sysRes = await sysWincardResource({
                            id: res.result.ID,
                            userId: userId.value,
                            lessonID: lessonId.value,
                            schoolId: schoolId.value,
                            schoolName: schoolName.value,
                        });
                        loading.destroy();
                        emit("update:visible", false);
                        // emit("update", sysRes.result.Id);
                        emitter.emit("toMyResource");
                    } else {
                        loading.destroy();
                    }
                } else {
                    const res = await saveToMyResource({
                        resourceId: props.resource.ResourceId,
                        schoolId: schoolId.value,
                        schoolName: schoolName.value,
                    });
                    if (res.success) {
                        emit("update:visible", false);
                        // emit("update", res.result.ResourceId);
                        emitter.emit("toMyResource");
                    }
                }

                disabledBtn.value = false;
            }
        };
        const close = () => {
            disabledBtn.value = false;
            emit("update:visible", false);
        };

        return {
            disabledBtn,
            close,
            save,
        };
    },
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
