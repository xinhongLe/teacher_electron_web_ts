<template>
    <div class="container">
        <div class="content" :style="{filter: (showResult ? 'blur(30px)' : 'none')}">
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
                        v-for="(student, i) in form.allStudentList.slice(0, 20)"
                        :key="i"
                        :style="{
                            transform: `translateX(-102px) rotateY(${
                                (360 / (form.allStudentList.length > 20 ? 20 : form.allStudentList.length)) * i
                            }deg) translateZ(${circleWidth}px)`
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
            <div class="check-count">
                <span>点名人数：</span>
                <div>
                    <el-input-number v-model="checkCount" :min="1" :max="5"/>
                </div>
            </div>
            <div @click="openSetting" class="setting-btn-box"><Setting class="setting-btn"/></div>
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
                <div class="custom-reset-btn" :class="isStart && 'disabled'" v-if="form.isRepeat == 1">
                    <el-button type="primary" @click="reset" :disabled="isStart">重置</el-button>
                </div>
                <div class="custom-start-btn" :class="isStart && 'disabled'">
                    <el-button type="primary" @click="start" :disabled="isStart">开始</el-button>
                </div>
            </div>
        </div>
        <div class="check-student-box" v-if="showResult">
            <div>
                <div
                    class="student-item"
                    v-for="(student, i) in thisSelectStudent"
                    :key="i"
                    :style="{transform: 'scale('+ (1.1 - thisSelectStudent.length * 0.07) +')',paddingTop: (105 + thisSelectStudent.length * 5) + 'px'}"
                >
                    <Avatar
                        :file="student?.HeadPortrait"
                        :size="20"
                        :alt="student.Name"
                    />
                    <div class="student-name">{{ student.Name }}</div>
                </div>
            </div>
            <div class="custom-reset-btn" style="height: 200px" @click="showResult = false">
                <el-button type="primary">重新开始</el-button>
            </div>
        </div>
        <!-- <audio controls  src="@/assets/audio.mp3" ref="startAudioRef"></audio> -->
        <SettingC ref="settingRef" @updateForm="updateForm"></SettingC>
    </div>
</template>

<script lang="ts">
import {Student} from "@/types/labelManage";
import {ElMessage, ElMessageBox} from "element-plus";
import {
    reactive,
    defineComponent,
    onMounted,
    PropType,
    ref,
    nextTick
} from "vue";
import Avatar from "../../components/avatar/index.vue";
import {DoubleLeft, Drag, DoubleRight, Setting} from "@icon-park/vue-next";
import {startAudio} from "./startaudio";
import {UserInfoState} from "@/types/store";
import {get, STORAGE_TYPES} from "@/utils/storage";
import {exportExcel, IExcel} from "mexcel";
import {getCurrentSemesterRollCallLog, rollCallLog} from "@/api";
import SettingC from "./setting.vue"
export default defineComponent({
    components: {
        Drag,
        Avatar,
        DoubleRight,
        DoubleLeft,
        Setting,
        SettingC
    },
    setup() {
        const unselectedStudent = ref<Student[]>([]);
        const isStart = ref<boolean>(false);
        const selectStudent = ref<Student[]>([]);
        const thisSelectStudent = ref<Student[]>([]);
        const duration = 2 * 1000;
        const animationTime = ref(1500);
        const rotateX = ref(-90);
        const randomDeg = ref(180);
        const currentAudio = startAudio; //音效标签
        const currentUserInfo: UserInfoState = get(STORAGE_TYPES.CURRENT_USER_INFO);
        const schoolTerm = get(STORAGE_TYPES.SCHOOL_TERM);
        const checkCount = ref(1)
        const settingRef = ref();
        const showResult = ref(false)
        const allStudents = get(STORAGE_TYPES.STUDENT_LIST) || [];
        let form = reactive({
            classId: get(STORAGE_TYPES.CURRENT_SELECT_CLASS)?.ClassUserCenterId,
            studentRange: 0,
            isRepeat: 0,
            storeStudentList: allStudents.filter((v: any) => get(STORAGE_TYPES.CURRENT_SELECT_CLASS)?.ClassUserCenterId === v.ClassID),
            allStudentList: allStudents.filter((v: any) => get(STORAGE_TYPES.CURRENT_SELECT_CLASS)?.ClassUserCenterId === v.ClassID)
        })
        const size = window.electron.remote.screen.getPrimaryDisplay().workAreaSize; // 获取显示器的宽高
        const circleWidth = size.width > 1200 ? 1120 : size.width - 80;
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
            if (checkCount.value > form.allStudentList.length) {
                return ElMessageBox.alert(
                    "点名人数不能大于已选择学生列表"
                ); 
            }
            isStart.value = true; 
            playAudio(currentAudio);
            const checkStudentTemp:Student[] = [];   
            if (unselectedStudent.value.length >= checkCount.value) {
                for (var i = 0 ; i < checkCount.value; i++) {
                    const len = unselectedStudent.value.length;
                    const randomIndex = Math.floor(Math.random() * len);
                    const student = unselectedStudent.value[randomIndex];
                    checkStudentTemp.unshift(student);
                    unselectedStudent.value.splice(randomIndex, 1);
                }
                if(form.isRepeat == 0) {
                    unselectedStudent.value = [...form.allStudentList]
                }
            }else{
                checkStudentTemp.unshift(...unselectedStudent.value);
                const diffCount = checkCount.value - unselectedStudent.value.length;
                unselectedStudent.value = []
                form.allStudentList.map((v: Student) => {
                    let has = false
                    checkStudentTemp.map(val => {
                        if(v.StudentID == val.StudentID) has = true
                    })
                    if(!has) {
                        unselectedStudent.value.push(v)
                    }
                })
                for(var i = 0;i< diffCount; i++) {
                    const len = unselectedStudent.value.length;
                    const randomIndex = Math.floor(Math.random() * len);
                    const student = unselectedStudent.value[randomIndex];
                    checkStudentTemp.unshift(student);
                    unselectedStudent.value.splice(randomIndex, 1);
                }
            } 
            animationTime.value = 0;
            randomDeg.value = 0;
            setTimeout(() => {
                animationTime.value = duration;
                randomDeg.value = 360 * 5;
                setTimeout(() => {  
                    thisSelectStudent.value = checkStudentTemp
                    selectStudent.value.unshift(...checkStudentTemp)
                    if (!schoolTerm || !schoolTerm.code) {
                        ElMessage.warning("学年学期不存在");
                    } else {
                        checkStudentTemp.map(v => {
                            rollCallLog({
                                SchoolId: currentUserInfo.schoolId,
                                TermCode: schoolTerm.code,
                                StudentId: v.StudentID,
                                ClassId: form.classId,
                                TeacherId: currentUserInfo.userCenterUserID
                            });
                        })
                    }
                    isStart.value = false;
                    showResult.value = true
                }, duration);
            }, 100);
        }; 

        const reset = () => {
            animationTime.value = 0;
            randomDeg.value = 360;
            rotateX.value = -363;
            if(form.isRepeat == 1) {
                selectStudent.value = [];
            }
            unselectedStudent.value = [...form.allStudentList]
            setTimeout(() => {
                animationTime.value = 1500;
                rotateX.value = -3;
                randomDeg.value = 0;
            }, 200);
        };

        nextTick(() => {
            reset();
        })

        const updateForm = (value:any) => {
            form.isRepeat = value.isRepeat;
            form.classId = value.classId;
            form.studentRange = value.studentRange;
            form.allStudentList = [...value.storeStudentList];
            selectStudent.value = [];
            reset();
        }
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
                        TeacherId: currentUserInfo.userCenterUserID,
                        ClassId: form.classId
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

        const openSetting = () => {
            settingRef.value.dialogVisible = true
        }
        return {
            start,
            isStart,
            unselectedStudent,
            reset,
            selectStudent,
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
            download,
            checkCount,
            settingRef,
            showResult,
            openSetting,
            thisSelectStudent,
            form,
            updateForm,
            circleWidth
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
        width: 100%;
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
    .check-student-box {
        width: 100%;
        height: 100%;
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        margin: auto; 
        .custom-reset-btn {
            margin: auto;
            width: 382px;
            background-image: url(~@/assets/images/suspension/btn_bg@2x.png) !important;
        }
        >div {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 20px;
            
            .student-item {
                width: 300px;
                height: 390px;
                position: relative;
                display: flex;
                align-items: center;
                margin-top: 120px;
                padding-top: 100px;
                // justify-content: center;
                flex-direction: column;
                background: url(~@/assets/images/suspension/card_bg1@2x.png) no-repeat;
                background-position: center;
                background-size: 100%;
                border-radius: 5px;
                transition: all 1s;
                margin-left: 30px;

                :deep(.el-avatar) {
                    transform: scale(4.5);
                    margin-bottom: 80px;
                }

                .student-name {
                    transform: scale(3.5);
                    color: #fff;
                    width: 5vw;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: pre-wrap;
                    line-height: 12px;
                    text-align: center;
                }
            }
            .student-item:nth-of-type(1) {
                margin-left: 0;
            }
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

.student-list-content .student-item {
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
.setting-btn-box {
    position: absolute;
    right: 210px;
    bottom: 104px;
    -webkit-app-region: no-drag;
    width: 20px;
    height: 20px;
    font-size: 20px;
    color: #333;
    cursor: pointer;
}
.setting-btn {
    width: 20px;
    height: 20px;
    font-size: 20px;
    color: #333;
    cursor: pointer;
}
.check-count {
    position: absolute;
    bottom: 222px;
    left: 50%;
    z-index: 1;
    transform: translateX(-50%);
    display: flex;
    -webkit-app-region: no-drag;
    align-items: center;
    >span:nth-of-type(1) {
        font-size: 18px;
        font-family: HarmonyOS_Sans_SC_Medium;
        color: #242B3A;
    }
    >div {
        width: 178px;
    }
}
</style>
