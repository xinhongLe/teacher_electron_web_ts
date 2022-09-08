<template>
    <div class="container">
        <div class="select-student-list">
            <span class="title">点名学生清单</span>
            <div class="list">
                <span v-for="student in selectStudent" :key="student.StudentID">
                    {{ student?.Name }}
                </span>
            </div>
        </div>

        <div class="student-list-content">
            <div
                class="student-box"
                :style="{
                    transform: `rotateX(${rotateX}deg) rotateY(${randomDeg}deg)`,
                    transition: `all ${animationTime}ms ease-in-out`,
                }"
            >
                <div
                    class="student-item"
                    v-for="(student, i) in unselectedStudent"
                    :key="student.StudentID"
                    :style="{
                        transform: `translateX(-102px) rotateY(${
                            (360 / unselectedStudent.length) * i
                        }deg) translateZ(2000px) scale(${!isStart && currentIndex === i ? 2 : 1})`,
                    }"
                >
                    <Avatar
                        :file="student?.HeadPortrait"
                        :size="20"
                        :alt="student.Name"
                    />
                    <div class="student-name">{{ student.Name }}</div>
                </div>
            </div>
        </div>

        <div class="cotrol-btn">
            <el-button type="primary" @click="reset" :disabled="isStart">重置</el-button>
            <el-button type="primary" @click="start" :disabled="isStart">开始</el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { Student } from "@/types/labelManage";
import { ElMessageBox } from "element-plus";
import { clearInterval, setInterval } from "timers";
import { computed, defineComponent, onMounted, PropType, ref } from "vue";
import Avatar from "../../components/avatar/index.vue";
export default defineComponent({
    props: {
        studentList: {
            type: Array as PropType<Student[]>,
            default: () => [],
        },
    },
    setup(props) {
        const unselectedStudent = ref([...props.studentList]);
        const currentIndex = ref(-1);
        const currentStudent = ref<Student>();
        const isStart = ref(false);
        const selectStudent = ref<Student[]>([]);

        const duration = 6 * 1000;
        const animationTime = ref(3000);
        const rotateX = ref(-90);
        const randomDeg = ref(180);

        const start = () => {
            if (unselectedStudent.value.length === 0) return;
            if (unselectedStudent.value.length === 1) {
                return ElMessageBox.alert(
                    unselectedStudent.value[0]?.Name,
                    "最后一位学生"
                );
            }
            isStart.value = true;
            if (selectStudent.value.length > 0) {
                unselectedStudent.value.splice(currentIndex.value, 1);
            }
            const len = unselectedStudent.value.length;
            currentIndex.value = Math.floor(Math.random() * len);
            animationTime.value = 0;
            randomDeg.value = 0;
            setTimeout(() => {
                animationTime.value = duration;
                randomDeg.value = - (360 / unselectedStudent.value.length) * currentIndex.value + 360 * 5;
                setTimeout(() => {
                    selectStudent.value.push(
                        unselectedStudent.value[currentIndex.value]
                    );
                    isStart.value = false;
                }, duration);
            }, 100);
        };

        const reset = () => {
            animationTime.value = 0;
            randomDeg.value = 360;
            rotateX.value = -363;
            selectStudent.value = [];
            unselectedStudent.value = [...props.studentList];
            currentIndex.value = -1;
            setTimeout(() => {
                animationTime.value = 3000;
                rotateX.value = -3;
                randomDeg.value = 0;
            }, 200);
        };

        reset();

        return {
            start,
            isStart,
            unselectedStudent,
            reset,
            selectStudent,
            currentIndex,
            randomDeg,  
            animationTime,
            rotateX
        };
    },
    components: { Avatar },
});
</script>

<style lang="scss" scoped>
.container {
    position: relative;
    perspective: 1500px;
    perspective-origin: 50% 20%;
    height: 100%;
    .select-student-list {
        position: absolute;
        left: 40px;
        width: 200px;
        height: 250px;
        border-radius: 10px;
        font-size: 14px;
        background: #fff;
        display: flex;
        flex-direction: column;
        .title {
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 15px 0;
        }
        .list {
            display: flex;
            flex-direction: column;
            padding-left: 10px;
            overflow-y: auto;
            text-align: center;
            span {
                height: 30px;
                line-height: 30px;
            }
        }
    }

    .cotrol-btn {
        position: absolute;
        bottom: 50px;
        left: 50%;
        z-index: 1;
        transform: translateX(-50%);
    }
}

.student-list-content {
    position: relative;
    top: 0px;
    width: 500px;
    height: 500px;
    margin: 100px auto;
    box-sizing: border-box;
    transform-style: preserve-3d;
    transition: all 1s ease-out;
    transform: translateZ(-2000px) scale(0.5);
    backface-visibility: hidden;
}

.student-box {
    width: 100%;
    height: 200px;
    margin: auto;
    margin-top: 5%;
    text-align: center;
    background: rgba(218, 120, 33, 0);
    position: relative;
    transform-style: preserve-3d;
    &.random-animation-start {
        animation: random 3s linear infinite;
    }

    &.random-animation-end {
        transition: all 3100ms ease-out;
    }
}

.student-item {
    position: absolute;
    top: 25%;
    left: 50%;
    width: 205px;
    height: 420px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    // background: url(~@/assets/images/other/bg.png) no-repeat;
    background: #000;
    border-radius: 5px;
    box-shadow: 0 0 5px #eee;
    transition: all 1s;
    :deep(.el-avatar) {
        transform: scale(5.5);
        margin-bottom: 80px;
    }
    .student-name {
        transform: scale(3.5);
        color: #fff;
    }
}

@keyframes random {
    0% {
        transform: rotateX(-3deg) rotateY(0);
    }
    100% {
        transform: rotateX(-3deg) rotateY(360deg);
    }
}
</style>
