<template>
    <div class="member">
        <div class="member-head">
            <div class="title">小组成员<span>({{ memberList.length }})</span></div>
            <div class="btn-edit" @click="manage" v-if="isHasRule">
                <img src="../../../../assets/preparationGroup/editPanel/icon_guanli.png" alt="" />
                <span>管理</span>
            </div>
        </div>
        <div v-if="memberList && memberList.length > 0">
            <div class="member-list" :class="isFull ? `full-list` : ``">
                <div class="member-cell" v-for="(item, index) in memberList" :key="index">
                    <img class="file-download" src="../../../../assets/preparationGroup/editPanel/avator_small_back.png" alt="" />
                    <p class="ellipsis" :title="item.Name">{{ item.Name }}</p>
                </div>
            </div>
            <p class="more" v-if="isShowMore" @click="isFull = !isFull">{{ isFull ? `隐藏更多` : `查看更多` }}</p>
        </div>
        <div class="empty" v-else>
            暂无小组成员
        </div>
    </div>
    <ShareDetail ref="ShareDialogRef" @submit="submit" :dynamicTagsProps="memberList" :isEdit="true"></ShareDetail>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick, getCurrentInstance } from "vue";
import { useRoute } from "vue-router";
import { fetchGroupLessonTeachers } from "../../api";
import { FetchGroupLessonTeachersRes } from "@/types/preparationGroup";
import ShareDetail from "../../shareDialog/index.vue";
import { get, STORAGE_TYPES } from "@/utils/storage";
export default defineComponent({
    name: "member",
    props: {},
    setup(props, { emit }) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { proxy } = getCurrentInstance() as any;
        const route = useRoute();
        const memberList = ref<FetchGroupLessonTeachersRes[]>([]);
        const isShowMore = ref(false);
        const isFull = ref(false);
        const isHasRule = ref(false);

        const ShareDialogRef = ref();
        const manage = () => {
            ShareDialogRef.value.openDialog();
        };
        const submit = () => {
            getTeacherGroup();
        };

        const getTeacherGroup = async () => {
            const res = await fetchGroupLessonTeachers({
                id: route.params.preId as string
            });
            memberList.value = [];
            if (res.resultCode === 200) {
                if (res.result) {
                    res.result.map((v: any) => {
                        memberList.value.push({
                            ...v,
                            memberIcon: "../../../../assets/preparationGroup/editPanel/avator_small_back.png",
                            ID: v.Id,
                            Name: v.Name,
                            Active: true
                        });
                    });
                    emit("SetTeacherCount", memberList.value.length);
                    sessionStorage.setItem("memberList", JSON.stringify(memberList.value));
                    nextTick(() => {
                        const windowContent = (document.documentElement && document.documentElement.clientWidth) || 0;
                        isShowMore.value = memberList.value.length * 92 > windowContent;
                    });
                }
            }
        };

        onMounted(() => {
            proxy.mittBus.on("PreDetail", (preDetail: any) => {
                if (get(STORAGE_TYPES.USER_INFO)) {
                    isHasRule.value = preDetail.CreaterID === get(STORAGE_TYPES.USER_INFO).ID;
                } else {
                    isHasRule.value = false;
                }
            });
            getTeacherGroup();
        });
        return {
            manage,
            ShareDialogRef,
            isShowMore,
            isFull,
            isHasRule,
            memberList,
            getTeacherGroup,
            submit
        };
    },
    components: { ShareDetail }
});
</script>

<style lang="scss" scoped>
.member {
    width: 100%;
    min-height: 140px;
    height: auto;
    background: #FFFFFF;
    border-radius: 8px;
    padding: 20px 24px;
    &-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .title {
            font-size: 20px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #19203D;
            display: flex;
            align-items: center;
            span {
                font-size: 14px;
                margin-left: 10px;
            }
        }
        .btn-edit {
            display: flex;
            align-items: center;
            cursor: pointer;
            img {
                display: inline-block;
                width: 16px;
                height: auto;
            }
            span {
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #4B71EE;
                margin-left: 5px;
            }
        }
    }
    .member-list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        height: 130px;
        overflow: hidden;
        .member-cell {
            margin-right: 32px;
            margin-top: 20px;
            width: 60px;
            display: flex;
            align-items: center;
            flex-direction: column;
            p {
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #19203D;
                margin-top: 18px;
            }
            .ellipsis {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                display: inline-block;
                max-width: 60px;
            }
        }
    }
    .full-list {
        height: auto;
    }
    .more {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #4B71EE;
        text-align: center;
        line-height: 40px;
        margin-top: 20px;
        cursor: pointer;
    }
    .empty {
        width: 100%;
        text-align: center;
        padding: 40px 0 0 0;
        font-size: 20px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #5F626F;
    }
}
</style>
