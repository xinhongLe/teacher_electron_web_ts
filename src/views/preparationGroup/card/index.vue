<template>
    <div class="preparation-group-card" v-for="(item, index) in cardList" :key="index">
        <div class="left">
            <img class="cover" src="../../../assets/preparationGroup/pic_source_default.png" alt="备课图片">
            <div class="card-box">
                <p class="card-title">
                    <span class="title">{{ item.PreTitle }}</span>
                    <span :class="`status status-${item.Status}`">{{ switchStatus(item.Status) }}</span>
                </p>
                <div class="card-detail">
                    <div>
                        <img src="../../../assets/preparationGroup/icon_ren.png" alt="创建人">
                        <span>创建人：{{ item.CreaterName }}</span>
                    </div>
                    <div>
                        <img src="../../../assets/preparationGroup/icon_renshu.png" alt="小组人数">
                        <span>小组人数：{{ item.TeacherCount }}人</span>
                    </div>
                </div>
                <div class="card-detail">
                    <div v-if="item.Status === 2">
                        <img src="../../../assets/preparationGroup/icon_shijian.png" alt="创建时间">
                        <span>创建时间：{{ moment(item.CreateTime).format("YYYY-MM-DD HH:mm:ss") }}</span>
                    </div>
                    <div v-else>
                        <img src="../../../assets/preparationGroup/icon_shijian.png" alt="研讨时间">
                        <span>研讨时间：{{ `${moment(item.CreateTime).format("YYYY-MM-DD HH:mm:ss")} 至 ${moment(item.CreateEndTime).format("YYYY-MM-DD HH:mm:ss")}` }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="right">
            <div>
                <div class="delete-btn" v-if="switchDeleteRule(item)" @click="showDeleteDialog(item)">
                    <img src="../../../assets/preparationGroup/icon_delete.png" alt="删除">
                </div>
                <el-button type="primary" plain @click="turnToEditPanel(item)">进入研讨</el-button>
            </div>
            <p style="min-width: 300px; height:16px; text-align: right;" v-if="item.Status === 2">您可以<span class="blue" @click="generateInvitelink(item)">生成邀请链接</span>， 发送至小组成员</p>
        </div>

        <generate-link
            ref="generateLinkRef"
            :currentItem="currentItem"
        ></generate-link>

    </div>
    <DeleteConfirm ref="deleteDialog" msg="您确定删除这条集体备课记录么？" :deleteResource="deleteResource"></DeleteConfirm>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, onMounted } from "vue";
import { PreparateListBag } from "@/types/preparationGroup";
import { deletePreLesson } from "../api";
import { useRouter } from "vue-router";
import moment from "moment";
import { ElMessage } from "element-plus";
import useSubmit from "../search/useSubmit";
import useEdit from "../editPanel/useSubmit";
import generateLink from "../generate-link/index.vue";
import DeleteConfirm from "../dialog/index.vue";
import { get, STORAGE_TYPES } from "@/utils/storage";
export default defineComponent({
    name: "card",
    props: {
        cardList: {
            type: Array
        }
    },
    components: { generateLink, DeleteConfirm },
    setup(props, { emit }) {
        const router = useRouter();
        console.log(props);
        console.log(emit);
        const deleteDialog = ref();
        const state = reactive({
            loading: false
        });
        const currentItem = ref<PreparateListBag>({
            Id: "",
            PreTitle: "",
            Status: 0,
            CreaterName: "",
            CreaterID: "",
            CreateTime: "",
            CreateEndTime: "",
            TeacherCount: 0
        });
        const generateLinkRef = ref();
        // 生成邀请链接
        const generateInvitelink = (item: PreparateListBag) => {
            currentItem.value = item;
            generateLinkRef.value.isCopy = false;
            generateLinkRef.value.dialogVisible = true;
        };
        // 进入研讨
        const turnToEditPanel = (item: PreparateListBag) => {
            router.push(`/preparation-edit/${item.Id}`);
        };
        // 显示删除确认框
        const showDeleteDialog = (item: PreparateListBag) => {
            currentItem.value = item;
            deleteDialog.value.openDialog();
        };
        // 删除研讨
        const deleteResource = async () => {
            const res = await deletePreLesson({
                ID: currentItem.value.Id
            });
            if (res.resultCode === 200) {
                ElMessage.success("删除成功");
                const cardParams = JSON.parse(sessionStorage.getItem("cardParams") || "");
                emit("requestParams", cardParams);
            }
        };
        const switchDeleteRule = (item: PreparateListBag) => {
            return item.CreaterID === get(STORAGE_TYPES.USER_INFO).ID;
        };
        const { statusList, switchStatus } = useSubmit();
        const { getTextBookGrade } = useEdit();
        onMounted(() => {
            getTextBookGrade();
        });
        return {
            ...toRefs(state),
            statusList,
            generateLinkRef,
            switchStatus,
            generateInvitelink,
            turnToEditPanel,
            moment,
            currentItem,
            showDeleteDialog,
            deleteDialog,
            deleteResource,
            getTextBookGrade,
            switchDeleteRule
        };
    }
});
</script>

<style lang="scss" scoped>
.preparation-group-card {
    width: 100%;
    height: 182px;
    background: #fff;
    border-radius: 8px;
    padding: 16px 24px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
        display: flex;
        align-items: center;
        .cover {
            display: inline-block;
            width: 200px;
            height: auto;
            background: #DBEDFF;
            border-radius: 4px;
            margin-right: 24px;
        }
        .card-box {
            .card-title {
                margin-bottom: 10px;
                .title {
                    font-size: 20px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #19203D;
                }
                .status {
                    display: inline-block;
                    width: auto;
                    min-width: 64px;
                    height: 24px;
                    line-height: 24px;
                    border-radius: 4px;
                    text-align: center;
                    font-size: 12px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    text-align: center;
                    margin-left: 12px;
                    &-1 {
                        background: #E9EDF0;
                        color: #B2B8BE;
                    }
                    &-2 {
                        background: #F5A10E;
                        color: #fff;
                    }
                }
            }
            .card-detail {
                display: flex;
                align-items: center;
                line-height: 30px;
                > div {
                    display: flex;
                    align-items: center;
                    min-width: 300px;
                }
                img {
                    display: inline-block;
                    width: 12px;
                    height: auto;
                    margin-right: 5px;
                }
                span {
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #5F626F;
                }
            }
        }
    }
    .right {
        > div {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin-bottom: 16px;
        }
        .delete-btn {
            width: 36px;
            height: 36px;
            background: #FFFFFF;
            border-radius: 4px;
            border: 1px solid #E0E2E7;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 16px;
            cursor: pointer;
        }
        ::v-deep(.el-button) {
            width: 120px;
            height: 36px;
            border-radius: 4px;
            border: 1px solid #4B71EE;
            color: #4B71EE;
            background: #fff;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #4B71EE;
            padding: 0;
        }
        ::v-deep(.el-button--primary.is-plain:hover) {
            color: #fff;
            background: #4B71EE;
        }
        p {
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #5F626F;
            .blue {
                color: #4B71EE;
                cursor: pointer;
            }
        }
    }
}
</style>
