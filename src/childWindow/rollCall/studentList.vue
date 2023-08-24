<template>
    <div class="container">
        <div class="content">
            <div
                class="select-student-list"
                :class="isPackUp && 'pack-up'"
                @click="expand"
            >
                <div class="title" @click.stop="">
                    <div class="drag-area">
                        <Drag/>
                    </div>
                    点名学生清单
                    <div class="icon" @click="hideWindow" v-if="isPackUp">
                        <DoubleRight/>
                    </div>
                </div>
                <div class="list">
                    <div
                        class="student-selected-item"
                        v-for="student in selectStudent"
                        :key="student.StudentID"
                    >
                        {{ student?.Name }}
                    </div>
                </div>
                <div class="open" v-if="isHide" @click.stop="showWindow">
                    <DoubleLeft/>
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
                        :key="i"
                        :style="{
                            transform: `translateX(-102px) rotateY(${
                                (360 / unselectedStudent.length) * i
                            }deg) translateZ(2000px) scale(${
                                !isStart && currentIndex === i ? 2 : 1
                            })`,
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
            <el-button
                v-show="!isPackUp"
                type="default"
                round
                plain
                class="download-btn"
                @click="download"
            >
                下载
            </el-button>
            <el-button
                v-show="!isPackUp"
                type="default"
                round
                plain
                class="min-btn"
                @click="packUp"
                :disabled="isStart"
            >
                最小化
            </el-button>
            <el-button
                v-show="!isPackUp"
                type="danger"
                round
                plain
                class="close-btn"
                @click="close"
                :disabled="isStart"
            >
                关闭
            </el-button>
            <div class="cotrol-btn" v-show="!isPackUp">
                <div class="custom-reset-btn" :class="isStart && 'disabled'">
                    <el-button type="primary" @click="reset" :disabled="isStart">重置</el-button>
                </div>
                <div class="custom-start-btn" :class="isStart && 'disabled'">
                    <el-button type="primary" @click="start" :disabled="isStart">开始</el-button>
                </div>
            </div>
        </div>
        <!-- <audio controls  src="@/assets/audio.mp3" ref="startAudioRef"></audio> -->
    </div>
</template>

<script lang="ts">
import {Student} from "@/types/labelManage";
import {ElMessage, ElMessageBox} from "element-plus";
import {
    computed,
    defineComponent,
    onMounted,
    PropType,
    ref,
    watch,
} from "vue";
import Avatar from "../../components/avatar/index.vue";
import {DoubleLeft, Drag, DoubleRight} from "@icon-park/vue-next";
import {startAudio} from "./startaudio";
import {UserInfoState} from "@/types/store";
import {get, STORAGE_TYPES} from "@/utils/storage";
import {exportExcel, IExcel} from "mexcel";
import {getCurrentSemesterRollCallLog, rollCallLog} from "@/api";

export default defineComponent({
    components: {
        Drag,
        Avatar,
        DoubleRight,
        DoubleLeft,
    },
    props: {
        studentList: {
            type: Array as PropType<Student[]>,
            default: () => [],
        },
    },
    setup(props) {
        const storeStudent = ref<Student[]>([...props.studentList]);
        const unselectedStudent = ref<Student[]>([]);
        const currentIndex = ref(-1);
        const currentStudent = ref<Student>();
        const isStart = ref<boolean>(false);
        const selectStudent = ref<Student[]>([]);
        const duration = 2 * 1000;
        const animationTime = ref(1500);
        const rotateX = ref(-90);
        const randomDeg = ref(180);
        const currentAudio = startAudio; //音效标签
        const currentUserInfo: UserInfoState = get(STORAGE_TYPES.CURRENT_USER_INFO);
        const schoolTerm = get(STORAGE_TYPES.SCHOOL_TERM);

        // 播放点名动画时的音效
        const playAudio = (src: any) => {
            const audio = new Audio();
            audio.crossOrigin = "anonymous";
            audio.src = src;
            audio.oncanplaythrough = () => {
                audio.play();
            };
            audio.onended = () => {
                audio.remove();
            };
        };
        const start = () => {
            if (unselectedStudent.value.length === 0) return;
            if (unselectedStudent.value.length === 1) {
                return ElMessageBox.alert(
                    unselectedStudent.value[0]?.Name,
                    "最后一位学生"
                );
            }
            isStart.value = true;
            playAudio(currentAudio);

            if (selectStudent.value.length > 0) {
                unselectedStudent.value.splice(currentIndex.value, 1);
                if (storeStudent.value.length > 0) {
                    const student = randomStudent();
                    unselectedStudent.value.push(student);
                }
            }

            const len = unselectedStudent.value.length;
            currentIndex.value = Math.floor(Math.random() * len);
            animationTime.value = 0;
            randomDeg.value = 0;
            setTimeout(() => {
                animationTime.value = duration;
                randomDeg.value = -(360 / unselectedStudent.value.length) * currentIndex.value + 360 * 5;
                setTimeout(() => {
                    const student = unselectedStudent.value[currentIndex.value];
                    selectStudent.value.unshift(student);
                    if (!schoolTerm || !schoolTerm.code) {
                        ElMessage.warning("学年学期不存在");
                    } else {
                        rollCallLog({
                            SchoolId: currentUserInfo.schoolId,
                            TermCode: schoolTerm.code,
                            StudentId: student.StudentID,
                            ClassId: student.ClassID,
                            TeacherId: currentUserInfo.userCenterUserID
                        });
                    }
                    isStart.value = false;
                }, duration);
            }, 100);
        };

        const randomStudent = () => {
            const len = storeStudent.value.length;
            const index = Math.floor(Math.random() * len);
            return storeStudent.value.splice(index, 1)[0];
        };

        const randomStudents = (len: number) => {
            const randomArray: Student[] = [];
            if (storeStudent.value.length < len) {
                return storeStudent.value;
            }
            for (let i = 0; i < len; i++) {
                const student = randomStudent();
                randomArray.push(student);
            }
            return randomArray;
        };

        const reset = () => {
            animationTime.value = 0;
            randomDeg.value = 360;
            rotateX.value = -363;
            selectStudent.value = [];
            storeStudent.value = [...props.studentList];
            unselectedStudent.value = randomStudents(25);
            currentIndex.value = -1;
            setTimeout(() => {
                animationTime.value = 1500;
                rotateX.value = -3;
                randomDeg.value = 0;
            }, 200);
        };

        reset();

        const close = () => {
            window.electron.destroyWindow();
        };

        const isHide = ref(false);
        const isPackUp = ref(false);
        const packUp = () => {
            const size = window.electron.remote.screen.getPrimaryDisplay().workAreaSize;
            window.electron.setContentSize(200, 250);
            const top = size.height - 100 - 250;
            window.electron.setPositionWin(
                size.width - 20 - 200,
                top > 0 ? top : 20
            );
            hideWindow();
            isPackUp.value = true;
        };

        const hideWindow = () => {
            isHide.value = true;
            const size = window.electron.remote.screen.getPrimaryDisplay().workAreaSize;
            const position = window.electron.getPositionWin();
            window.electron.setPositionWin(size.width - 30, position[1]);
        };

        const showWindow = () => {
            isHide.value = false;
            const size = window.electron.remote.screen.getPrimaryDisplay().workAreaSize;
            const position = window.electron.getPositionWin();
            window.electron.setPositionWin(size.width - 20 - 200, position[1]);
        };

        const expand = () => {
            if (isPackUp.value) {
                const size = window.electron.remote.screen.getPrimaryDisplay().workAreaSize;
                const width = size.width > 1200 ? 1200 : size.width;
                const height = size.height > 800 ? 800 : size.height;

                isPackUp.value = false;
                window.electron.setContentSize(width, height);
                window.electron.setPositionWin(
                    (size.width - width) / 2,
                    (size.height - height) / 2,
                    true
                );
            }
        };

        const download = () => {
            if (!schoolTerm || !schoolTerm.code) return ElMessage.warning("学年学期不存在");
            const fileName = "点名记录表";
            window.electron
                .showSaveDialog({
                    defaultPath: schoolTerm.name + fileName + ".xlsx",
                    filters: [
                        {
                            name: "xlsx文件",
                            extensions: ["xlsx"],
                        },
                    ],
                })
                .then(({filePath, canceled}) => {
                    if (canceled) return;
                    getCurrentSemesterRollCallLog({
                        TermCode: schoolTerm.code,
                        TeacherId: currentUserInfo.userCenterUserID
                    }).then((res) => {
                        const data = res.result;

                        const excelData: IExcel = {
                            sheets: [
                                {
                                    title: "点名记录表",
                                    tHeaders: [
                                        [
                                            "班级",
                                            "科目",
                                            "学生名",
                                            "点名次数"
                                        ]
                                    ],
                                    table: data,
                                    cols: [
                                        {
                                            width: 30,
                                        },
                                        {
                                            width: 30,
                                        },
                                        {
                                            width: 30,
                                        },
                                        {
                                            width: 30
                                        }
                                    ],
                                    titleRow: {
                                        hpx: 60
                                    },
                                    headerRows: [
                                        {
                                            hpx: 40
                                        },
                                    ],
                                    row: {
                                        hpx: 30,
                                    },
                                    keys: [
                                        "ClassName",
                                        "SubjectName",
                                        "StudentName",
                                        "Count"
                                    ],
                                    sheetName: "点名记录表",
                                    globalStyle: {
                                        font: {
                                            sz: 12,
                                        },
                                        alignment: {
                                            horizontal: "center",
                                            vertical: "center",
                                            wrapText: true,
                                        },
                                        border: {
                                            top: {style: "thin", color: {}},
                                            right: {style: "thin", color: {}},
                                            bottom: {
                                                style: "thin",
                                                color: {},
                                            },
                                            left: {style: "thin", color: {}},
                                        },
                                    },
                                    titleStyle: {
                                        font: {
                                            sz: 18,
                                            color: {
                                                rgb: "f60000",
                                            },
                                        },
                                        alignment: {
                                            horizontal: "center",
                                            vertical: "center",
                                            wrapText: true,
                                        },
                                        border: {
                                            top: {style: "thin", color: {}},
                                            right: {style: "thin", color: {}},
                                            bottom: {
                                                style: "thin",
                                                color: {},
                                            },
                                            left: {style: "thin", color: {}},
                                        },
                                    },
                                },
                            ],
                            fileName: "点名记录表",
                        };

                        exportExcel(
                            excelData,
                            filePath,
                            () => {
                                ElMessage.success(fileName + "下载成功");
                            },
                            (err: any) => {
                                console.log("fail", err);
                            }
                        );
                    });
                })
                .catch((err: Error) => {
                    console.log(err);
                });
        }

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
            isHide,
            expand,
            hideWindow,
            showWindow,
            download
        };
    },
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
    overflow: hidden;
    -webkit-app-region: drag;

    .content {
        -webkit-app-region: no-drag;

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
            z-index: 1;
            top: 20px;
            overflow: hidden;

            .title {
                font-size: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 10px 0;
                font-weight: 600;
                color: #848891;
                background: linear-gradient(
                        270deg,
                        rgba(237, 244, 246, 0) 0%,
                        #edf4f6 100%
                );
                position: relative;

                .drag-area {
                    position: absolute;
                    left: 10px;
                    font-size: 20px;
                    top: 10px;
                }

                .icon {
                    position: absolute;
                    right: 10px;
                    top: 10px;
                    cursor: pointer;
                    -webkit-app-region: no-drag;
                }
            }

            .list {
                overflow-y: auto;
                text-align: center;
                min-height: 0;
                flex: 1;
                padding: 0 5px;
                -webkit-app-region: no-drag;

                .student-selected-item {
                    height: 46px;
                    line-height: 46px;
                    color: #242b3a;
                    font-size: 14px;
                    border-bottom: 1px solid #edf4f6;

                    &:last-child {
                        border-bottom: 0;
                    }
                }
            }

            .open {
                position: absolute;
                top: 0;
                bottom: 0;
                width: 30px;
                left: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                font-size: 16px;
                color: #888;
                z-index: 10;
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
            display: flex;
            -webkit-app-region: no-drag;
        }
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
        width: 5vw;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: pre-wrap;
        line-height: 12px;
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
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: url(~@/assets/images/other/btn_bg@2x.png) !important;
    background-size: 100% 100%;

    &.disabled {
        opacity: 0.7;
    }

    button {
        width: 150px;
        border: none;
        font-size: 18px;
        background-color: transparent !important;
        box-shadow: none;
    }
}

.custom-reset-btn {
    width: 172px;
    height: 135px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: url(~@/assets/images/other/btn_bg_reset@2x.png) !important;
    background-size: 100% 100%;

    &.disabled {
        opacity: 0.7;
    }

    button {
        border: none;
        font-size: 18px;
        background-color: transparent !important;
        box-shadow: none;
    }
}

.download-btn {
    position: absolute;
    left: 20px;
    bottom: 98px;
    -webkit-app-region: no-drag;
}

.min-btn {
    position: absolute;
    right: 120px;
    bottom: 98px;
    -webkit-app-region: no-drag;
}

.close-btn {
    position: absolute;
    right: 20px;
    bottom: 98px;
    -webkit-app-region: no-drag;
}
</style>
