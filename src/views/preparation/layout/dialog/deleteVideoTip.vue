<template>
    <el-dialog
        custom-class="custom-dialog"
        center
        title="删除资源"
        width="450px"
        :model-value="visible"
        @close="close()"
    >
        <div class="tip-box">
            <img src="@/assets/images/preparation/icon_tips_popup.png" alt="" />
            <div>
                确定要删除吗？
                <div class="tip-bottom">资源将从所选目录中删除</div>
            </div>
        </div>
        <div class="checkbox-content">
            <el-checkbox-group v-model="checkList">
                <div v-for="(item, index) in directorys" :key="index">
                    <el-checkbox :label="item.ResourceId">{{item.SubjectName + ' / ' + item.PublisherName + ' / ' + item.AlbumName + ' / ' + item.ChapterName + ' / ' + item.LessonName}}</el-checkbox>
                </div>
            </el-checkbox-group>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="close()">取消</el-button>
                <el-button type="danger" @click="sure()"> 确认删除 </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { IResourceItem } from "@/api/resource";
import { computed, defineComponent, PropType, ref } from "vue";

export default defineComponent({
    props: {
        target: {
            type: String,
            default: ""
        },
        resource: {
            type: Object as PropType<IResourceItem>
        },
        visible: {
            type: Boolean,
            default: false
        }
    },
    emits: ["update:visible"],
    setup(props, { emit }) {
        const checkList = ref<string[]>([]);

        const close = () => {
            emit("update:visible", false);
        };

        const directorys = computed(() => props.resource?.TextBooks || []);

        const sure = async () => {
            console.log(checkList.value);
            // await deleteResource({
            //     id: "",
            //     type: 1
            // })
        };
        return {
            sure,
            close,
            directorys,
            checkList
        };
    }
});
</script>

<style lang="scss" scoped>
.tip-box {
    padding: 30px 10px 10px 60px;
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 600;
    .tip-bottom {
        margin-top: 10px;
        font-size: 14px;
        color: #888;
    }
    img {
        display: block;
        width: 40px;
        margin-right: 20px;
    }
}

.checkbox-content {
    padding-left: 120px;
    .el-checkbox {
        height: 30px;
    }
}
</style>
