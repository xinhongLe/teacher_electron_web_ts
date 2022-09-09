<template>
    <div class="container">
        <div class="select-student-list" :class="isPackUp && 'pack-up'" @click="expand">
            <span class="title" @click.stop="">点名学生清单</span>
            <div class="list">
                <span v-for="student in selectStudent" :key="student.StudentID">
                    {{ student?.Name }}
                </span>
            </div>
        </div>

        <div class="student-list-content" v-show="!isPackUp">
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
                        style="transform: scale(4.5)"
                    />
                    <div class="student-name">{{ student.Name }}</div>
                </div>
            </div>
        </div>
        <el-button v-show="!isPackUp" type="danger" class="close-btn" @click="close" :disabled="isStart">关闭</el-button>
        <div class="cotrol-btn" v-show="!isPackUp">
            <el-button type="primary" @click="reset" :disabled="isStart">重置</el-button>
            <el-button class="custom-start-btn" type="primary" @click="start" :disabled="isStart">开始</el-button>
            <el-button type="primary" @click="packUp" :disabled="isStart">收起</el-button>
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

        const duration = 3 * 1000;
        const animationTime = ref(1500);
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
                animationTime.value = 1500;
                rotateX.value = -3;
                randomDeg.value = 0;
            }, 200);
        };

        reset();

        const close = () => {
            const win = window.electron.remote.getCurrentWindow();
            win.close();
        };

        const isPackUp = ref(false);
        const packUp = () => {
            const win = window.electron.remote.getCurrentWindow();
            const size = window.electron.remote.screen.getPrimaryDisplay().workAreaSize;
            win.setSize(200, 250);
            win.setPosition(size.width - 20 - 200, size.height - 200 - 250, true);
            isPackUp.value = true;
        };

        const expand = () => {
            if (isPackUp.value) {
                isPackUp.value = false;
                const win = window.electron.remote.getCurrentWindow();
                const size = window.electron.remote.screen.getPrimaryDisplay().workAreaSize;
                win.setSize(1200, 800);
                win.setPosition((size.width - 1200) / 2, (size.height - 800) / 2, true);
            }
        };

        return {
            start,
            isStart,
            unselectedStudent,
            reset,
            selectStudent,
            currentIndex,
            randomDeg,  
            animationTime,
            rotateX,
            close,
            packUp,
            isPackUp,
            expand
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
    background: url(~@/assets/images/other/bg@2x.png) no-repeat;
    background-size: cover;
    background-position: center;
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
        // z-index: 1;
        top: 20px;
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
            overflow-y: auto;
            text-align: center;
            span {
                height: 30px;
                line-height: 30px;
            }
        }
        &.pack-up {
            top: 0;
            left: 0;
            .title {
                -webkit-app-region: drag;
                cursor: move;
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
    text-align: center;
    background: rgba(218, 120, 33, 0);
    position: relative;
    transform-style: preserve-3d;
    &.random-animation-start {
        animation: random 1.5s linear infinite;
    }

    &.random-animation-end {
        transition: all 1600ms ease-out;
    }
}

.student-item {
    position: absolute;
    top: 25%;
    left: 30%;
    width: 400px;
    height: 480px;
    display: flex;
    align-items: center;
    // justify-content: center;
    padding-top: 156px;
    flex-direction: column;
    background: url(~@/assets/images/other/card_bg@2x.png) no-repeat;
    background-position: center;
    background-size: cover;
    border-radius: 5px;
    box-shadow: 0 0 5px #eee;
    transition: all 1s;
    :deep(.el-avatar) {
        transform: scale(3.5);
        margin-bottom: 80px;
    }
    .student-name {
        transform: scale(4.5);
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

.custom-start-btn {
    width: 252px;
    height: 135px;
    font-size: 20px;
    background-color: transparent !important;
    background-image: url(~@/assets/images/other/btn_bg@2x.png) !important;
    background-size: 100% 100%;
    border: none;
    &:hover {
        background-color: transparent !important;
        background-image: url(~@/assets/images/other/btn_bg@2x.png) !important;
        background-size: 100% 100%;
        opacity: 0.7;
    }

    &:disabled {
        opacity: 0.5;
    }
}

.close-btn {
    position: absolute;
    right: 20px;
    bottom: 98px;
}
</style>
