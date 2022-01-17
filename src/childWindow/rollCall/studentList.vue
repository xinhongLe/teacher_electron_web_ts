<template>
    <div class="container">
        <div class="select-student-list">
            <span class="title">点名学生清单</span>
            <div class="list">
                <span v-for="student in selectStudent" :key="student.StudentID">
                    {{student?.Name}}
                </span>
            </div>
        </div>
        <div class="current-student-box">
            <template v-if="currentIndex >= 0">
                <span class="name">{{currentStudent?.Name}}</span>
                <Avatar :size="240" :file="currentStudent?.HeadPortrait"/>
            </template>
        </div>
        <div class="student-list" ref="studentListRef">
            <div
                class="student"
                v-for="(student, index) in unselectedStudent"
                :key="student.StudentID"
                :style="{
                    transform: `rotateY(${
                        index * deg
                    }deg) translateZ(400px)`,
                }"
                @mousedown="mousedown(index)"
            >
                <Avatar :file="student?.HeadPortrait" :size="20"/>
                <span class="name">{{ student.Name }}</span>
            </div>
        </div>

        <div>
            <el-button type="primary" @click="reset">重置</el-button>
            <el-button type="primary" @click="start" v-if="!isStart">开始</el-button>
            <el-button type="primary" @click="stop" v-else>停止</el-button>
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
            default: () => []
        }
    },
    setup(props) {
        const unselectedStudent = ref([...props.studentList]);
        const deg = computed(() => 360 / unselectedStudent.value.length);
        const currentIndex = ref(-1);
        const currentStudent = ref<Student>();
        const isStart = ref(false);
        let timer: any;
        const selectStudent = ref<Student[]>([]);
        const studentListRef = ref<HTMLDivElement>();
        let animation: Animation;
        const duration = 10 * 1000;

        const start = () => {
            if (unselectedStudent.value.length === 1) {
                return ElMessageBox.alert(unselectedStudent.value[0]?.Name, "最后一位学生");
            }
            isStart.value = true;
            currentIndex.value = 0;
            animation.effect!.updateTiming({
                duration: 500
            });
            timer = setInterval(() => {
                currentIndex.value = currentIndex.value < unselectedStudent.value.length - 1 ? currentIndex.value + 1 : 0;
                currentStudent.value = unselectedStudent.value[currentIndex.value];
            }, 10);
        };

        const stop = () => {
            animation.effect!.updateTiming({
                duration
            });
            isStart.value = false;
            clearInterval(timer);
            currentStudent.value = unselectedStudent.value[currentIndex.value];
            selectStudent.value.push(currentStudent.value);
            unselectedStudent.value.splice(currentIndex.value, 1);
        };

        const reset = () => {
            selectStudent.value = [];
            unselectedStudent.value = [...props.studentList];
        };

        const mousedown = (index: number) => {
            animation.pause();
            currentIndex.value = index;
            currentStudent.value = unselectedStudent.value[currentIndex.value];
            document.onmouseup = () => {
                currentStudent.value = undefined;
                currentIndex.value = -1;
                animation.play();
                document.onmouseup = null;
            };
        };

        onMounted(() => {
            const effect = new KeyframeEffect(studentListRef.value!,
                [
                    {
                        transform: "perspective(800px) rotateX(-15deg) rotateY(0deg)"
                    },
                    {
                        transform: "perspective(800px) rotateX(-15deg) rotateY(360deg)"
                    }
                ], {
                    duration,
                    fill: "forwards",
                    iterations: Infinity,
                    iterationComposite: "accumulate"
                });
            animation = new Animation(effect, document.timeline);
            animation.play();
        });
        return {
            deg,
            start,
            stop,
            isStart,
            currentStudent,
            unselectedStudent,
            reset,
            mousedown,
            selectStudent,
            studentListRef,
            currentIndex
        };
    },
    components: { Avatar }
});
</script>

<style lang="scss" scoped>
.container {
    display: flex;
    align-items: center;
    flex: 1;
    flex-direction: column;
    position: relative;
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
            span {
                height: 30px;
                line-height: 30px;
            }
        }
    }
    .current-student-box {
        background: #fff;
        width: 480px;
        height: 330px;
        font-size: 40px;
        font-weight: 800;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px 40px;
        .name {
            height: 50px;
        }
    }
    .student-list {
        width: 100px;
        font-size: 14px;
        position: relative;
        transform-style: preserve-3d;
        transform: perspective(800px) rotateX(-15deg) rotateY(0deg);
        margin: 100px 0 370px;
        .student {
            position: absolute;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100px;
            .name {
                height: 20px;
            }
        }
    }
}
</style>
