<template>
    <div class="student-list-warp">
        <Title title="绑定学生列表" :close="close"/>
        <div class="content">
            <span class="number">共计{{studentList.length}}人</span>
            <div class="student-list">
                <div v-for="item in studentList" :key="item.Name" class="student">
                    <Avatar :file="item.HeadPortrait" :size="40"/>
                    <div class="info">
                        <span class="name">{{item.Name}}</span>
                        <span class="account">{{item.Account}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Student } from "@/types/labelManage";
import { defineComponent, PropType } from "vue";
import Title from "./title.vue";
import Avatar from "../../components/avatar/index.vue";
export default defineComponent({
    components: {
        Title,
        Avatar
    },
    props: {
        studentList: {
            type: Array as PropType<Student[]>,
            default: () => []
        }
    },
    setup(props, { emit }) {
        const close = () => {
            emit("update:isShowStudentList", false);
        };
        return	{
            close
        };
    }
});
</script>

<style lang="scss" scoped>
    .student-list-warp {
         width: 846px;
        height: 750px;
        border-radius: 8px;
        background: #fff;
        box-shadow: 0px 6px 16px -8px rgba(0, 0, 0, 0.12),
            0px 9px 28px 0px rgba(0, 0, 0, 0.08),
            0px 12px 48px 16px rgba(0, 0, 0, 0.05);
        border: 1px solid #ccc;
        display: flex;
        flex-direction: column;
        -webkit-app-region: no-drag;
        .content {
            display: flex;
            flex-direction: column;
            padding: 24px;
            flex:1;
            overflow: overlay;
            .number {
                font-size: 20px;
                font-weight: 400;
                color: #74788B;
                margin-bottom: 24px;
            }
            .student-list {
                overflow: overlay;
                padding: 16px;
                flex: 1;
                background: #F5F6FA;
                display: flex;
                flex-wrap: wrap;
                .student {
                    width: 244px;
                    height: 82px;
                    background: #fff;
                    border-radius: 4px;
                    display: flex;
                    padding: 21px;
                    margin-right: 16px;
                    &:nth-child(3n+0) {
                        margin-right: 0;
                    }
                    &:nth-child(n+4) {
                        margin-top: 16px;
                    }
                    .info {
                        margin-left: 16px;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        .name {
                            font-size: 16px;
                            font-weight: 500;
                            color: #19203D;
                        }
                        .account {
                            font-size: 12px;
                            font-weight: 500;
                            color: #5F626F;
                        }
                    }
                }
            }
        }
    }
</style>
