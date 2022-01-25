<template>
    <el-col :span="5" :offset="0">
        <el-dropdown :style="{ display: 'block' }">
            <template #dropdown>
                <el-dropdown-menu class="popover-content">
                    <el-dropdown-item>
                        <div class="popover-item" @click="goRecord">
                            <img src="@/assets/my-student/icon_jilu@2x.png" />
                            <span>学习记录</span>
                        </div>
                    </el-dropdown-item>
                    <el-dropdown-item>
                        <div class="popover-item" @click="showDetail = true">
                            <img src="@/assets/my-student/icon_xinxi@2x.png" />
                            <span>个人信息</span>
                        </div>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
            <div class="student">
                <Avatar />
                <div class="student-userinfo">
                    <p class="student-name">{{ item.Name }}</p>
                    <p
                        class="student-phone"
                        :class="!item.Phone ? 'student-phone-no' : ''"
                    >
                        {{ item.Phone ? item.Phone : "未绑定家长" }}
                    </p>
                    <p class="student-account">{{ item.Account }}</p>
                    <p class="student-account" v-if="machineID">
                        答题器编号：{{ machineID }}
                    </p>
                </div>
                <div class="btn" v-if="machineID" @click="deleteStudentMachine">解绑</div>
            </div>
        </el-dropdown>
        <StudentDetail
            v-model:visible="showDetail"
            v-if="showDetail"
            :studentId="item.ID"
        />
    </el-col>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from "vue";
import Avatar from "@/components/avatar/index.vue";
import { ClassStudent } from "@/types/myStudent";
import StudentDetail from "../studentDetail/index.vue";
import { useRoute, useRouter } from "vue-router";
import { store } from "@/store";
import useStudentMachine from "@/hooks/useStudentMachine";
export default defineComponent({
    components: { Avatar, StudentDetail },
    props: {
        item: {
            type: Object as PropType<ClassStudent>,
            required: true
        }
    },
    setup(props) {
        const showDetail = ref(false);
        const route = useRoute();
        const router = useRouter();
        const {
            getStudentMachineListMap,
            studentMachineListMap,
            studentMachineListByClassIdMap,
            deleteStudentMachine
        } = useStudentMachine();
        const machineID = computed(() => {
            getStudentMachineListMap(store.state.myStudent.selectClassInfo.ID);
            return (
                studentMachineListMap.value &&
                studentMachineListMap.value[props.item.Account] &&
                studentMachineListMap.value[props.item.Account][0]?.machineID
            );
        });

        const _deleteStudentMachine = () => {
            deleteStudentMachine({ classID: store.state.myStudent.selectClassInfo.ID, studentId: props.item.Account });
        };

        const goRecord = () => {
            const { GradeAlbum, Name } = store.state.myStudent.selectClassInfo;
            const className = GradeAlbum + Name;
            if (route.name === "wpf班级管理") {
                router.push(`/record-no-header/${props.item.ID}/${className}`);
            } else {
                router.push(`/record/${props.item.ID}/${className}`);
            }
        };
        return {
            showDetail,
            studentMachineListByClassIdMap,
            machineID,
            goRecord,
            deleteStudentMachine: _deleteStudentMachine
        };
    }
});
</script>

<style lang="scss" scoped>
.student {
    height: 100px;
    background: #fff;
    border-radius: 4px;
    display: flex;
    cursor: pointer;
    border: 1px solid #fff;
    margin-bottom: 16px;
    padding: 19px 21px 21px;
    align-items: center;
    &:hover {
        background: #e6ecff;
        border-color: #98aef6;
    }

    .student-userinfo {
        margin: 0;
        padding: 0 0 0 16px;
        flex: 1;
        overflow: hidden;
        .student-phone {
            font-size: 12px;
            margin-top: 4px;
            font-weight: 500;
            color: #5f626f;
            line-height: 17px;
        }
        .student-name {
            font-size: 16px;
            font-weight: 500;
            color: #19203d;
            line-height: 22px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .student-account {
            margin-top: 2px;
            font-size: 12px;
            font-weight: 500;
            color: #5f626f;
            @include text-ellipsis;
        }
        .student-phone-no {
            color: #ff6b6b;
        }
    }
    .btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 60px;
        height: 30px;
        background: #4b71ee;
        border-radius: 4px;
        font-size: 14px;
        color: #fff;
    }
}
.popover-content {
    width: 240px;
    padding: 16px 0;
    .popover-item {
        display: flex;
        align-items: center;
        height: 48px;
        cursor: pointer;
        font-size: 16px;
        color: #19203d;
        img {
            width: 16px;
            margin-right: 12px;
        }
    }
}
</style>
