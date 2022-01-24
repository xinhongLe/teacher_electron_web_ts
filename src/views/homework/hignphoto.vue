<template>
<!-- <div class="hign-photo-dialog"> -->
  <el-dialog
    v-model="dialogVisible"
    width="100%"
  >
    <div class="container">
      <div class="top">
        <div class="workbook-info">
            <img
                    :src="require('@/assets/images/homeworkNew/homework2.png')"
                    alt=""
                />
            <span>{{homeworkValue.WorkbookName}}</span>
        </div>
        <div class="workbook-number">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane v-for="(item, i) in homeworkValue.WorkbookPaperPageNum.split(',')" :key="i" :label="'第'+item+'页'" :name="item"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="camera-select">
          <img src="@/assets/images/suspension/icon_shexiangtou@2x.png" />
          <span class="text">高拍仪:</span>
          <el-select
            placeholder="请选择摄像头"
            v-model="mediaStreamConstraints.deviceId"
          >
            <el-option
              v-for="item in videoList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            >
            </el-option>
           </el-select>
        </div>
        <el-button type="danger" @click="close"> 关闭高拍仪 </el-button>
      </div>
      <div class="video-warp">
        <div class="students">
          <!-- <el-button type="primary" @click="recognition">{{studentName}}</el-button> -->
          <div class="discern-now" style="width:33rem;padding:20px 10px">
              <span>当前学生：</span><span style="font-size:24px;font-weight:bold;">{{studentName}}</span>
              <el-button type="primary" @click="recognition" style="position:absolute;top:74px;left:256px;">重新识别</el-button>
          </div>
          <div class="student-list-item" v-for="(item,index) in studentFinishMissions" :key="index" @click="getMissionDetail(homeworkValue,item)">
              <img style="width: 20px;height: 20px;position: relative;left: 115px;" src="@/assets/homeworkImg/icon_success.png">
              <span style="position: relative;top: -5px;left: -20px;">{{item.StudentName}}</span>
          </div>
        </div>
        <div class="video" style="padding-left:18%">
            <div class="line"></div>
          <video ref="videoRef" autoplay />
          <canvas ref="resultRef" @mousedown="mousedown" hidden></canvas>
          <div class="overlay-wrapper"><span>{{IdentifyTip}}</span></div>
        </div>
        <div class="buttonDiscern" style="width:440px">
            <div v-if="resultVisible" style="width:400px;height:280px;padding:20px;border-radius:12px;background: #000000;opacity: 0.6;color:white;">
                <el-button style="position: absolute;left: 370px;top:5px" type="text" @click="closeResult"> ✖ </el-button>
                <div style="padding: 10px 15px;"><span style="font-size:24px">题目{{selectResult.Number}}</span></div>
                <div style="padding: 10px 15px;"><span>作答结果</span></div>
                <div style="padding: 20px 20px;text-align: center;">
                    <el-button style="width:140px" :type="selectResult.Category === 'Correct' ? 'success' : ''"  @click="checkCorrect">✔</el-button>
                    <el-button @click="checkError" :type="selectResult.Category === 'Error' ? 'danger' : ''" style="width:140px">✖</el-button>
                </div>
                <div style="padding: 20px;text-align: center;"><el-button type="primary" @click="recognitionaForstu">重新识别此页</el-button></div>
            </div>
            <div v-if="discernVisible" style="width:406px;height:234px;padding:20px;border-radius:12px;background: #000000;opacity: 0.6;color:white;">
                <el-button style="position: absolute;left: 370px;top:5px" type="text" @click="closeDiscern">✖</el-button>
                <div style="padding: 10px 0px;"><img src="@/assets/homeworkImg/icon_success.png"><span style="font-size: 25px;position: relative;padding-left: 15px;top: -5px;">识别成功</span></div>
                <div style="padding: 40px 10px;"><span>3秒后自动刷新，继续扫描下一位学生</span></div>
                <div style="text-align: center;">
                    <el-button type="primary" @click="recognitionAgin">重新识别此页</el-button>
                    <el-button type="success" v-if="pageNumbersTemp.length<2" @click="recognition">下一位</el-button>
                    <el-button type="success" v-if="pageNumbersTemp.length>1" @click="nextPage">下一页</el-button>
                </div>
            </div>
          <el-button type="primary" style="width:180px;height:80px;position:relative;top:380px;left:250px;" v-if="studentMission!=null" @click="discern">识别(键盘[Enter]键)</el-button>
        </div>
        <canvas ref="canvasRef" id="canvas" style="display:none"></canvas>
        <canvas ref="canvasCheckRef" id="canvasCheck" style="display:none"></canvas>
        <img ref="img" :src="imageSrc" alt="">
      </div>
    </div>
    <el-dialog
        title="提示"
        v-model="centerDialogVisible"
        width="380px"
        >
        <div style="height:100px;padding: 40px;"><span style="color:blue">{{studentName}}</span> 已经上传过作答结果，要重新识别上传吗？</div>
        <div style="text-align: center;padding:20px">
            <el-button @click="centerDialogVisible = false">再次上传</el-button>
            <el-button @click="recognition" type="primary">换其他学生</el-button>
        </div>
    </el-dialog>
  </el-dialog>
<!-- </div> -->
</template>
<script lang="ts">
import { CheckQuestionResult, Homework, StudentMission, WorkBookPageDetailAndImgSize, CheckUpdateIn, BatchCheckUpdateIn, PageInfo } from "@/types/homework";
import { ElMessage, ElMessageBox } from "element-plus";
import jsQR from "jsqr";
import { defineComponent, onMounted, PropType, reactive, ref, watch } from "vue";
import { BatchChangeResult, BatchCheckUpdate, ChangeResultForPhoto, GetCheckResult, GetMissionDetail, GetStudentMissionList, GetWorkbookPageInfo, SaveYuanshiImg } from "./api";
import { downloadFile } from "@/utils/oss";
import { nextTick } from "process";
import { int } from "@zxing/library/esm/customTypings";
export default defineComponent({
    props: {
        homeworkValue: {
            type: Object as PropType<Homework>,
            default: () => ({})
        }
    },
    setup(props) {
        // 识别提示
        const IdentifyTip = ref("识别中,请先扫描学生二维码");
        // 识别出来的学生ID
        const IdeStudentID = ref("");
        // 摄像头弹窗的显示/隐藏属性
        const dialogVisible = ref(false);
        // 题目结果弹窗的显示/隐藏属性
        const resultVisible = ref(false);
        // 识别重复学生的弹窗提示开关
        const centerDialogVisible = ref(false);
        // 识别成功弹窗开关
        const discernVisible = ref(false);
        // 是否查看学生识别结果
        const ischeckResult = ref(false);
        const activeName = ref("");
        activeName.value = props.homeworkValue.WorkbookPaperPageNum?.split(",")[0] as string;
        const pageNumbers = props.homeworkValue.WorkbookPaperPageNum?.split(",");
        // 页码数组
        const pageNumbersTemp = ref<any>();
        pageNumbersTemp.value = pageNumbers;

        // 页码
        const pageNumTemp = ref(0);
        pageNumTemp.value = Number(activeName.value);
        // 扫描获取的同学ID
        const studentName = ref("识别中...");
        const handleClose = () => {
            dialogVisible.value = false;
        };
        const cv = (window as any).cv;
        const imageSrc = ref<string>();
        // 获取所有已完成任务的人员
        const studentFinishMissions = ref<StudentMission[]>();
        // 获取所有人员任务
        const studentMissions = ref<StudentMission[]>();
        // 扫描后的人员
        const studentMission = ref<StudentMission | null>();
        const studentMissionTemp = ref<StudentMission | null>();

        // 选中题目对象
        const selectResult = reactive({
            QuestionID: "",
            MarginLeft: 0,
            MarginTop: 0,
            SizeWidth: 0,
            SizeHeight: 0,
            Category: "",
            Number: 1
        }); // ref< {QuestionID:any; MarginLeft: any; MarginTop: any; SizeWidth: any; SizeHeight: any; Category: string; Number:int;}>();

        // 全局变量 试卷结果集合
        const CheckQuestionResultList = ref<any | null>();
        // 获取班级下所有学生的学习任务，已完成的学生任务
        GetStudentMissionList({ ID: props.homeworkValue.ClassHomeworkPaperID }).then(res => {
            if (res.resultCode === 200) {
                studentFinishMissions.value = res.result.filter((item:any) => {
                    return item.State === 5;
                });
                studentMissions.value = res.result;
                console.log(studentMissions.value, "studentMissions");
            }
        });

        // video对象
        const videoRef = ref<HTMLVideoElement>();
        // canvas对象
        const canvasRef = ref<HTMLCanvasElement>();
        const canvasCheckRef = ref<HTMLCanvasElement>();
        const resultRef = ref<HTMLCanvasElement>();
        // 已完成同学练习册比对结果图
        const missionInfoRef = ref<HTMLImageElement>();
        const img = ref<HTMLImageElement>();
        const videoList = ref<{ label: string; id: string }[]>([]);
        // const codeReader = new BrowserMultiFormatReader();
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const handleClick = (tab: any, event: any) => {
            pageNumTemp.value = tab.paneName;
            if (ischeckResult.value) {
                checkPageDetail();
            }
            if (!IdeStudentID.value) return false;
            IdentifyTip.value = "识别中,请翻到第" + pageNumTemp.value + "页";
        };

        // 下一页
        const nextPage = () => {
            var pagenums = pageNumbersTemp.value as string[];
            discernVisible.value = false;
            var index = pagenums.indexOf(String(pageNumTemp.value));
            pagenums.splice(index, 1);
            pageNumbersTemp.value = pagenums;
            pageNumTemp.value = Number(pagenums[0]);
            activeName.value = String(pageNumTemp.value);
            studentMission.value = studentMissionTemp.value;
            IdentifyTip.value = "识别中,请翻到第" + pageNumTemp.value + "页";
            if (videoRef.value && resultRef.value) {
                videoRef.value.hidden = false;
                resultRef.value.hidden = true;
            }
        };

        const scanInterval = setInterval(() => {
            // 获取当前模式下，要截取的图片的参数
            if (dialogVisible.value === true && canvasRef.value && videoRef.value && videoRef.value.clientWidth > 0 && !studentMission.value) {
                const targetWidth = videoRef.value.clientWidth;
                const targetHeight = videoRef.value.clientHeight;
                canvasRef.value.width = targetWidth;
                canvasRef.value.height = targetHeight;
                // 将视频流当前帧的图片中指定区域的图像裁剪到canvas，再转为base64后塞到img对象中
                const context = canvasRef.value.getContext("2d");
                context && context.drawImage(videoRef.value, 0, 0, targetWidth, targetHeight);
                // const base64Img = canvasRef.value.toDataURL("image/png");
                const imageData = context?.getImageData(0, 0, targetWidth, targetHeight);

                if (imageData) {
                    const code = jsQR(imageData.data, targetWidth, targetHeight);
                    if (code) {
                        if (code.data) {
                            const studentId = code.data.substr(code.data.indexOf(":") + 1);
                            IdeStudentID.value = studentId;
                            var smin = studentMissions.value?.find((item: StudentMission) => {
                                return item.StudentID === studentId;
                            });
                            if (smin) {
                                if (smin.State === 5) {
                                    centerDialogVisible.value = true;
                                }
                                studentMission.value = smin;
                                studentMissionTemp.value = smin;
                                studentName.value = smin.StudentName;
                                IdentifyTip.value = "识别中,请翻到第" + pageNumTemp.value + "页";
                            } else {
                                ElMessage({ type: "error", message: "此学生不属于这个班，请识别正确的二维码" });
                            }
                        }
                    }
                }
            }
        }, 1000);
        const mediaStreamConstraints = reactive({
            video: {
                width: 1900,
                height: 1600
            },
            deviceId: "",
            audio: false
        });

        function gotLocalMediaStream(mediaStream: MediaStream) {
            // console.log(new Date(), "给video赋流");
            nextTick(() => {
                const localVideo = videoRef.value;
                // const localVideo = document.querySelector("video");
                localVideo!.srcObject = mediaStream;
            });
        }

        const mousedown = (e: MouseEvent) => {
            const videoOfsetLeft = e.offsetX;
            const videoOfsetTop = e.offsetY;
            // 获取页面上题目的信息
            if (CheckQuestionResultList.value) {
                CheckQuestionResultList.value.forEach((citem: {QuestionID: any; MarginLeft: any; MarginTop: any; SizeWidth: any; SizeHeight: any; Category: string; Number:int; }) => {
                    const MarginRight = citem.MarginLeft + citem.SizeWidth;
                    const MarginBottom = citem.MarginTop + citem.SizeHeight;
                    if ((videoOfsetLeft > citem.MarginLeft && videoOfsetLeft < MarginRight && videoOfsetTop > citem.MarginTop && videoOfsetTop < MarginBottom)) {
                        selectResult.QuestionID = citem.QuestionID;
                        selectResult.MarginLeft = citem.MarginLeft;
                        selectResult.MarginTop = citem.MarginTop;
                        selectResult.SizeWidth = citem.SizeWidth;
                        selectResult.SizeHeight = citem.SizeHeight;
                        selectResult.Category = citem.Category;
                        selectResult.Number = citem.Number;
                        resultVisible.value = true;
                    }
                });
            }
        };

        async function updateDeviceList() {
            const list: { label: string; id: string }[] = [];
            const devices = await navigator.mediaDevices.enumerateDevices();
            devices.forEach((device) => {
                if (device.kind === "videoinput") {
                    list.push({
                        label: device.label,
                        id: device.deviceId
                    });
                }
            });
            videoList.value = list;
            mediaStreamConstraints.deviceId = videoList.value[0]?.id || "";
        }

        // 键盘事件
        function handleKeyup (event: any) {
            // eslint-disable-next-line no-caller
            const e = event || window.event || arguments.callee.caller.arguments[0];
            if (!e) return;
            const { key, keyCode } = e;
            console.log(keyCode);
            console.log(key);
            // 如果是Enter
            if (keyCode === 13 && IdeStudentID.value && videoRef.value?.hidden === false) {
                // 如果是回车键并且学生已经识别出来了则调用识别
                discern();
            }
        }

        // 修改题目结果为正确
        const checkCorrect = () => {
            if (studentMissionTemp.value && selectResult) {
                const obj = {
                    missionID: studentMissionTemp.value.MissionID,
                    questionID: selectResult.QuestionID,
                    result: 1
                };
                ChangeResultForPhoto(obj).then((ret) => {
                    if (ret.resultCode === 200) {
                        if (selectResult) {
                            selectResult.Category = "Correct";
                            ElMessage({ type: "success", message: "修改成功，重新查看学生查看修改结果" });
                        }
                    }
                });
            }
        };

        // 修改题目结果为错误
        const checkError = () => {
            if (studentMissionTemp.value && selectResult) {
                const obj = {
                    MissionID: studentMissionTemp.value.MissionID,
                    QuestionID: selectResult.QuestionID,
                    Result: 2
                };
                ChangeResultForPhoto(obj).then((ret) => {
                    if (ret.resultCode === 200) {
                        if (selectResult) {
                            selectResult.Category = "Error";
                            ElMessage({ type: "success", message: "修改成功，重新查看学生查看修改结果" });
                        }
                    }
                });
            }
        };

        // 关闭高拍仪弹窗
        const close = () => {
            ElMessageBox.confirm("确定关闭高拍仪吗", "关闭高拍仪", {
                type: "warning",
                confirmButtonText: "确定",
                cancelButtonText: "取消"
            }).then(() => {
                dialogVisible.value = false;
            });
        };
        // 关闭查看试卷结果
        const closeResult = () => {
            resultVisible.value = false;
        };

        // 识别学生的时候隐藏已完成学生的结果图片，显示video摄像头
        const recognition = () => {
            discernVisible.value = false;
            ischeckResult.value = false;
            if (videoRef.value && resultRef.value) {
                centerDialogVisible.value = false;
                if (IdeStudentID.value === "") {
                    IdentifyTip.value = "识别中,请先扫描学生二维码";
                } else {
                    IdeStudentID.value = "";
                    studentMission.value = null;
                    studentName.value = "识别中...";
                    IdentifyTip.value = "识别中,请先扫描学生二维码";
                }
                videoRef.value.hidden = false;
                resultRef.value.hidden = true;
            }
        };

        // 识别结束后重新识别
        const recognitionAgin = () => {
            discernVisible.value = false;
            if (videoRef.value && resultRef.value) {
                studentMission.value = studentMissionTemp.value;
                videoRef.value.hidden = false;
                resultRef.value.hidden = true;
            }
        };

        // 重新识别某一页，这应该是知道哪个人哪一页的
        const recognitionaForstu = () => {
            if (videoRef.value && resultRef.value && studentMissionTemp.value && selectResult) {
                IdeStudentID.value = studentMissionTemp.value.StudentID;
                studentMission.value = studentMissionTemp.value;
                studentName.value = studentMissionTemp.value.StudentName;
                IdentifyTip.value = "识别中,请翻到" + pageNumTemp.value + "页";
                resultVisible.value = false;
                videoRef.value.hidden = false;
                resultRef.value.hidden = true;
            }
        };

        const getMissionDetail = (hvalue: Homework, item: StudentMission) => {
            ischeckResult.value = true;
            studentMissionTemp.value = item;
            const obj = {
                PaperID: hvalue.PaperID,
                PageNum: pageNumTemp.value,
                MissionID: item.MissionID,
                ClassHomeworkPaperID: hvalue.ClassHomeworkPaperID
            };
            GetMissionDetail(obj).then((res) => {
                if (res.resultCode === 200) {
                    resultVisible.value = false;
                    var resultData = res.result;
                    var img = new Image();
                    img.onload = () => {
                        IdentifyTip.value = "";
                        IdeStudentID.value = "";
                        studentMission.value = null;
                        studentName.value = "识别中...";
                        if (canvasRef.value) {
                            const context = canvasRef.value.getContext("2d");
                            context && context.drawImage(img, 0, 0, resultData.ImageWidth, resultData.ImageHeight);
                            // const base64Img = canvasRef.value.toDataURL("image/png");
                            const imageData = context?.getImageData(0, 0, resultData.ImageWidth, resultData.ImageHeight);
                            const fileMat = cv.matFromImageData(imageData);
                            CheckQuestionResultList.value = resultData.CheckQuestionResultList;
                            const correctColor = new cv.Scalar(0, 0, 255);
                            const errorColor = new cv.Scalar(255, 0, 0);
                            const wzColor = new cv.Scalar(255, 156, 47);
                            console.log(CheckQuestionResultList);
                            CheckQuestionResultList.value.forEach((citem: {QuestionID: any; MarginLeft: any; MarginTop: any; SizeWidth: any; SizeHeight: any; Category: string; Number: int;}) => {
                                const point1 = new cv.Point(citem.MarginLeft, citem.MarginTop);
                                const point2 = new cv.Point(citem.MarginLeft + citem.SizeWidth, citem.MarginTop + citem.SizeHeight);
                                if (citem.Category === "Error") {
                                    cv.rectangle(fileMat, point1, point2, errorColor, 2, cv.LINE_AA, 0);
                                } else if (citem.Category === "Correct") {
                                    cv.rectangle(fileMat, point1, point2, correctColor, 2, cv.LINE_AA, 0);
                                } else {
                                    cv.rectangle(fileMat, point1, point2, wzColor, 1, cv.LINE_AA, 0);
                                }
                            });
                            if (videoRef.value && resultRef.value) {
                                resultRef.value.height = videoRef.value.clientHeight;
                                videoRef.value.hidden = true;
                                resultRef.value.hidden = false;
                                cv.imshow(resultRef.value, fileMat);
                            }
                            fileMat.delete();
                        }
                    };
                    img.src = "data:image/png;base64," + resultData.CheckSourceImgBase64;
                }
            });
        };

        const checkPageDetail = () => {
            var hvalue = props.homeworkValue;
            var item = studentMissionTemp.value;
            const obj = {
                PaperID: hvalue.PaperID,
                PageNum: pageNumTemp.value,
                MissionID: item?.MissionID,
                ClassHomeworkPaperID: hvalue.ClassHomeworkPaperID
            };
            GetMissionDetail(obj).then((res) => {
                if (res.resultCode === 200) {
                    resultVisible.value = false;
                    var resultData = res.result;
                    var img = new Image();
                    img.onload = () => {
                        IdentifyTip.value = "";
                        IdeStudentID.value = "";
                        studentMission.value = null;
                        studentMissionTemp.value = item;
                        studentName.value = "识别中...";
                        if (canvasRef.value) {
                            const context = canvasRef.value.getContext("2d");
                            context && context.drawImage(img, 0, 0, resultData.ImageWidth, resultData.ImageHeight);
                            // const base64Img = canvasRef.value.toDataURL("image/png");
                            const imageData = context?.getImageData(0, 0, resultData.ImageWidth, resultData.ImageHeight);
                            const fileMat = cv.matFromImageData(imageData);
                            CheckQuestionResultList.value = resultData.CheckQuestionResultList;
                            const correctColor = new cv.Scalar(0, 0, 255);
                            const errorColor = new cv.Scalar(255, 0, 0);
                            const wzColor = new cv.Scalar(255, 156, 47);
                            console.log(CheckQuestionResultList);
                            CheckQuestionResultList.value.forEach((citem: {QuestionID: any; MarginLeft: any; MarginTop: any; SizeWidth: any; SizeHeight: any; Category: string; Number: int;}) => {
                                const point1 = new cv.Point(citem.MarginLeft, citem.MarginTop);
                                const point2 = new cv.Point(citem.MarginLeft + citem.SizeWidth, citem.MarginTop + citem.SizeHeight);
                                if (citem.Category === "Error") {
                                    cv.rectangle(fileMat, point1, point2, errorColor, 2, cv.LINE_AA, 0);
                                } else if (citem.Category === "Correct") {
                                    cv.rectangle(fileMat, point1, point2, correctColor, 2, cv.LINE_AA, 0);
                                } else {
                                    cv.rectangle(fileMat, point1, point2, wzColor, 1, cv.LINE_AA, 0);
                                }
                            });
                            if (videoRef.value && resultRef.value) {
                                resultRef.value.height = videoRef.value.clientHeight;
                                videoRef.value.hidden = true;
                                resultRef.value.hidden = false;
                                cv.imshow(resultRef.value, fileMat);
                            }
                            fileMat.delete();
                        }
                    };
                    img.src = "data:image/png;base64," + resultData.CheckSourceImgBase64;
                }
            });
        };

        // 上传学生试卷
        const discern = () => {
            if (canvasRef.value && videoRef.value) {
                canvasRef.value.width = videoRef.value.clientWidth;
                canvasRef.value.height = videoRef.value.clientHeight;
                const context = canvasRef.value.getContext("2d");
                var missionID = studentMission.value?.MissionID;
                context && context.drawImage(videoRef.value, 0, 0, canvasRef.value.width, canvasRef.value.height);
                // imageSrc.value = base64img;
                // eslint-disable-next-line new-cap
                const imMat = new cv.imread(canvasRef.value);
                const obj: PageInfo = {
                    PaperID: props.homeworkValue.PaperID,
                    PageNum: String(pageNumTemp.value)
                };
                // 获取试卷原图及试卷题目框
                GetWorkbookPageInfo(obj).then(async (res) => {
                    if (res.resultCode === 200) {
                        var result = res.result as WorkBookPageDetailAndImgSize;
                        if (result) {
                            const questionList = result.Questions;
                            var checkQuestionResultList: CheckQuestionResult[] = [];
                            questionList.forEach(item => {
                                var queBlank = item.Blanks.find(x => {
                                    return x.Type === 1;
                                });
                                if (queBlank) {
                                    const marginLeft = queBlank.MarginLeft * result.ImageWidth;
                                    const marginTop = queBlank.MarginTop * result.ImageHeight;
                                    const sizeWidth = queBlank.SizeWidth * result.ImageWidth;
                                    const sizeHeight = queBlank.SizeHeight * result.ImageHeight;
                                    const checkQuestionResult: CheckQuestionResult = {
                                        QuestionID: item.QuestionID,
                                        MarginTop: marginTop,
                                        MarginLeft: marginLeft,
                                        SizeHeight: sizeHeight,
                                        Category: "",
                                        SizeWidth: sizeWidth,
                                        Number: item.Number
                                    };
                                    checkQuestionResultList.push(checkQuestionResult);
                                }
                            });
                            const key = result.File.FilePath + "/" + result.File.FileMD5 + "." + result.File.Extention;
                            const filepath = await downloadFile(key, result.File.Bucket);
                            var img = new Image();
                            img.onload = async () => {
                                if (canvasRef.value) {
                                    const context = canvasRef.value.getContext("2d");
                                    context && context.drawImage(img, 0, 0, result.ImageWidth, result.ImageHeight);
                                    // const base64Img = canvasRef.value.toDataURL("image/png");
                                    const imageData = context?.getImageData(0, 0, result.ImageWidth, result.ImageHeight);
                                    const fileMat = cv.matFromImageData(imageData);
                                    const resMat = check(imMat, fileMat);
                                    if (resMat) {
                                        cv.imshow(canvasCheckRef.value, resMat);
                                        if (canvasCheckRef.value) {
                                            var base64String = canvasCheckRef.value.toDataURL("image/png");
                                            SaveYuanshiImg({
                                                MissionID: missionID as string + pageNumTemp.value as string,
                                                Base64Img: base64String
                                            }).then((res) => {
                                                if (res.resultCode === 200) {
                                                    console.log("保存拍照图片成功");
                                                }
                                            });
                                            var CheckUpdateIns: CheckUpdateIn[] = [];
                                            var batchCheckUpDto: BatchCheckUpdateIn;
                                            var outBase64 = base64String.substr(base64String.indexOf(",") + 1);
                                            GetCheckResult(outBase64).then((res: any) => {
                                                if (res) {
                                                    console.log(res, "算法结果");
                                                    const checkResult = res;
                                                    if (checkQuestionResultList.length > 0) {
                                                        checkQuestionResultList.forEach(ckitem => {
                                                            checkResult.forEach((x: any) => {
                                                                var RectA = {
                                                                    top: x.bbox[0],
                                                                    left: x.bbox[1],
                                                                    right: x.bbox[1] + x.bbox[2],
                                                                    bottom: x.bbox[0] + x.bbox[3]
                                                                };
                                                                var RectB = {
                                                                    top: ckitem.MarginTop,
                                                                    left: ckitem.MarginLeft,
                                                                    right: ckitem.MarginLeft + ckitem.SizeWidth,
                                                                    bottom: ckitem.MarginTop + ckitem.SizeHeight
                                                                };
                                                                if (checkIntersect(RectA, RectB)) {
                                                                    ckitem.Category = x.category;
                                                                }
                                                            });
                                                            if (studentMission.value) {
                                                                var studenMission = studentMission.value;
                                                                var missionDetail = studenMission.MissionDetails.find(m => {
                                                                    return m.QuestionID === ckitem.QuestionID;
                                                                });
                                                                var cui: CheckUpdateIn = {
                                                                    Result: ckitem.Category === "" ? 3 : ckitem.Category === "Error" ? 2 : 1,
                                                                    Duration: "0",
                                                                    ExplainFinish: 0,
                                                                    NotUnderstand: 0,
                                                                    ID: missionDetail?.MissionDetailID
                                                                };
                                                                CheckUpdateIns.push(cui);
                                                            }
                                                        });
                                                    }
                                                    batchCheckUpDto = {
                                                        StudentID: studentMission.value?.StudentID,
                                                        CheckUpdateIn: CheckUpdateIns
                                                    };
                                                    imMat.delete();
                                                    fileMat.delete();
                                                    CheckQuestionResultList.value = checkQuestionResultList;
                                                    if (studentMission.value && studentMission.value.State === 5) {
                                                        ElMessageBox.confirm("同学：" + studentMission.value?.StudentName + "确定要重新识别此页吗？", "是否重复提交", {
                                                            type: "warning",
                                                            confirmButtonText: "确定",
                                                            cancelButtonText: "取消"
                                                        }).then(() => {
                                                            BatchChangeResult(batchCheckUpDto).then(res => {
                                                                if (res.resultCode === 200) {
                                                                    // 修改成功
                                                                    ElMessage({ type: "success", message: "重复提交成功" });
                                                                    IdentifyTip.value = "";
                                                                    studentMissionTemp.value = studentMission.value;
                                                                    studentMission.value = null;
                                                                    discernVisible.value = true;
                                                                    setTimeout(() => {
                                                                        if (discernVisible.value) {
                                                                            recognition();
                                                                            discernVisible.value = false;
                                                                        }
                                                                    }, 3000);
                                                                    const correctColor = new cv.Scalar(0, 0, 255);
                                                                    const errorColor = new cv.Scalar(255, 0, 0);
                                                                    const wzColor = new cv.Scalar(255, 156, 47);
                                                                    if (checkQuestionResultList.length > 0) {
                                                                        checkQuestionResultList.forEach(citem => {
                                                                            const point1 = new cv.Point(citem.MarginLeft, citem.MarginTop);
                                                                            const point2 = new cv.Point(citem.MarginLeft + citem.SizeWidth, citem.MarginTop + citem.SizeHeight);
                                                                            if (citem.Category === "Error") {
                                                                                cv.rectangle(resMat, point1, point2, errorColor, 2, cv.LINE_AA, 0);
                                                                            } else if (citem.Category === "Correct") {
                                                                                cv.rectangle(resMat, point1, point2, correctColor, 2, cv.LINE_AA, 0);
                                                                            } else {
                                                                                cv.rectangle(resMat, point1, point2, wzColor, 1, cv.LINE_AA, 0);
                                                                            }
                                                                        });
                                                                    }
                                                                    if (videoRef.value && resultRef.value) {
                                                                        resultRef.value.height = videoRef.value.clientHeight;
                                                                        videoRef.value.hidden = true;
                                                                        resultRef.value.hidden = false;
                                                                        cv.imshow(resultRef.value, resMat);
                                                                    }
                                                                    resMat.delete();
                                                                }
                                                            });
                                                        });
                                                    } else if (studentMission.value && studentMission.value.State !== 5) {
                                                        BatchCheckUpdate(batchCheckUpDto).then(res => {
                                                            if (res.resultCode === 200) {
                                                                initPage();
                                                                // 上传成功
                                                                ElMessage({ type: "success", message: "上传成功" });
                                                                IdentifyTip.value = "";
                                                                studentMissionTemp.value = studentMissions.value?.find((item: any) => {
                                                                    item.StudentID = studentMission.value?.StudentID;
                                                                });
                                                                studentMission.value = null;
                                                                discernVisible.value = true;
                                                                setTimeout(() => {
                                                                    if (discernVisible.value) {
                                                                        recognition();
                                                                        discernVisible.value = false;
                                                                    }
                                                                }, 13000);
                                                                const correctColor = new cv.Scalar(0, 0, 255);
                                                                const errorColor = new cv.Scalar(255, 0, 0);
                                                                const wzColor = new cv.Scalar(47, 156, 255);
                                                                if (checkQuestionResultList.length > 0) {
                                                                    checkQuestionResultList.forEach(citem => {
                                                                        const point1 = new cv.Point(citem.MarginLeft, citem.MarginTop);
                                                                        const point2 = new cv.Point(citem.MarginLeft + citem.SizeWidth, citem.MarginTop + citem.SizeHeight);
                                                                        if (citem.Category === "Error") {
                                                                            cv.rectangle(resMat, point1, point2, errorColor, 2, cv.LINE_AA, 0);
                                                                        } else if (citem.Category === "Correct") {
                                                                            cv.rectangle(resMat, point1, point2, correctColor, 2, cv.LINE_AA, 0);
                                                                        } else {
                                                                            cv.rectangle(resMat, point1, point2, wzColor, 1, cv.LINE_AA, 0);
                                                                        }
                                                                    });
                                                                }
                                                                if (videoRef.value && resultRef.value) {
                                                                    resultRef.value.height = videoRef.value.clientHeight;
                                                                    videoRef.value.hidden = true;
                                                                    resultRef.value.hidden = false;
                                                                    cv.imshow(resultRef.value, resMat);
                                                                }
                                                                resMat.delete();
                                                            } else {
                                                                if (res.resultDesc === "重复提交") {
                                                                    ElMessageBox.confirm("同学：" + studentMission.value?.StudentName + "确定要重新识别此页吗？", "是否重复提交", {
                                                                        type: "warning",
                                                                        confirmButtonText: "确定",
                                                                        cancelButtonText: "取消"
                                                                    }).then(() => {
                                                                        BatchChangeResult(batchCheckUpDto).then(res => {
                                                                            if (res.resultCode === 200) {
                                                                                // 修改成功
                                                                                ElMessage({ type: "success", message: "重复提交成功" });
                                                                                IdentifyTip.value = "";
                                                                                studentMissionTemp.value = studentMission.value;
                                                                                studentMission.value = null;
                                                                                discernVisible.value = true;
                                                                                setTimeout(() => {
                                                                                    if (discernVisible.value) {
                                                                                        recognition();
                                                                                        discernVisible.value = false;
                                                                                    }
                                                                                }, 13000);
                                                                                const correctColor = new cv.Scalar(0, 0, 255);
                                                                                const errorColor = new cv.Scalar(255, 0, 0);
                                                                                const wzColor = new cv.Scalar(255, 156, 47);
                                                                                if (checkQuestionResultList.length > 0) {
                                                                                    checkQuestionResultList.forEach(citem => {
                                                                                        const point1 = new cv.Point(citem.MarginLeft, citem.MarginTop);
                                                                                        const point2 = new cv.Point(citem.MarginLeft + citem.SizeWidth, citem.MarginTop + citem.SizeHeight);
                                                                                        if (citem.Category === "Error") {
                                                                                            cv.rectangle(resMat, point1, point2, errorColor, 2, cv.LINE_AA, 0);
                                                                                        } else if (citem.Category === "Correct") {
                                                                                            cv.rectangle(resMat, point1, point2, correctColor, 2, cv.LINE_AA, 0);
                                                                                        } else {
                                                                                            cv.rectangle(resMat, point1, point2, wzColor, 1, cv.LINE_AA, 0);
                                                                                        }
                                                                                    });
                                                                                }
                                                                                if (videoRef.value && resultRef.value) {
                                                                                    resultRef.value.height = videoRef.value.clientHeight;
                                                                                    videoRef.value.hidden = true;
                                                                                    resultRef.value.hidden = false;
                                                                                    cv.imshow(resultRef.value, resMat);
                                                                                }
                                                                                resMat.delete();
                                                                            }
                                                                        });
                                                                    });
                                                                }
                                                            }
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                    } else {
                                        ElMessage({ type: "error", message: "试卷识别失败请识别正确的试卷" });
                                    }
                                }
                            };
                            img.src = filepath;
                        }
                    }
                });
            }
        };

        watch(mediaStreamConstraints, async (v) => {
            if (dialogVisible.value === true) {
                await navigator.mediaDevices
                    .getUserMedia(v)
                    .then(gotLocalMediaStream);
            }
        });
        watch(dialogVisible, async () => {
            if (dialogVisible.value === true) {
                await navigator.mediaDevices
                    .getUserMedia(mediaStreamConstraints)
                    .then(gotLocalMediaStream);
            }
        });

        const initPage = () => {
            GetStudentMissionList({ ID: props.homeworkValue.ClassHomeworkPaperID }).then(res => {
                if (res.resultCode === 200) {
                    studentFinishMissions.value = res.result.filter((item:any) => {
                        return item.State === 5;
                    });
                }
            });
        };

        function checkIntersect(RectA: { left: number; right: number; top: number; bottom: number; }, RectB: { right: number; left: number; bottom: number; top: number; }) {
            const nonIntersect =
          (RectB.right < RectA.left) ||
          (RectB.left > RectA.right) ||
          (RectB.bottom < RectA.top) ||
          (RectB.top > RectA.bottom);
            // 相交
            const intersect = !nonIntersect;
            return intersect;
        }

        function check(shrink1 : any, checkReferenceImage: any) {
            // 参照图
            // const checkReferenceImage = checkReferenceImg;
            // 拍照图
            // const shrink1 = shrink;

            const im1Gray = new cv.Mat();
            const im2Gray = new cv.Mat();
            const imGray = new cv.Mat();
            cv.cvtColor(shrink1, im1Gray, cv.COLOR_BGR2GRAY);
            cv.cvtColor(checkReferenceImage, im2Gray, cv.COLOR_BGR2GRAY);

            const resultScale = 1;

            const sift = new cv.SIFT();
            const keypoints1 = new cv.KeyPointVector();
            const keypoints2 = new cv.KeyPointVector();
            const descriptors1 = new cv.Mat();
            const descriptors2 = new cv.Mat();

            sift.detectAndCompute(im1Gray, imGray, keypoints1, descriptors1);
            sift.detectAndCompute(im2Gray, imGray, keypoints2, descriptors2);
            const bfMatch = new cv.BFMatcher();
            const matchePoints = new cv.DMatchVectorVector();
            bfMatch.knnMatch(descriptors1, descriptors2, matchePoints, 2);

            // let multi1 = shrink(checkImage, shrink1, 1);
            const multi1 = 1;

            const points1 = new cv.PointVector();
            const points2 = new cv.PointVector();
            // eslint-disable-next-line camelcase
            const good_matches = new cv.DMatchVector();

            // eslint-disable-next-line no-var
            for (var i = 0; i < matchePoints.size(); i++) {
                const match = matchePoints.get(i).get(0);
                const lastMatch = matchePoints.get(i).get(1);
                if (match.distance >= 0.75 * lastMatch.distance) {
                    continue;
                }
                if (match.queryIdx < 0 || match.queryIdx >= keypoints1.size()) {
                    continue;
                }
                if (match.trainIdx < 0 || match.trainIdx >= keypoints2.size()) {
                    continue;
                }
                const point1 = keypoints1.get(match.queryIdx).pt;
                point1.x *= multi1;
                point1.y *= multi1;
                points1.push_back(point1);
                good_matches.push_back(matchePoints.get(i).get(0));

                const point2 = keypoints2.get(match.trainIdx).pt;
                point2.x *= resultScale;
                point2.y *= resultScale;
                points2.push_back(point2);
            }

            if (keypoints1.size() <= 0 || points1.size() <= 0) {
                return;
            }
            const accuracy = points1.size() / keypoints1.size();

            if (accuracy < 0.10) {
                return;
            }

            const points1Temp = [];
            // eslint-disable-next-line no-redeclare
            for (var i = 0; i < points1.size(); i++) {
                points1Temp.push(points1.get(i).x, points1.get(i).y);
            }
            const points2Temp = [];
            // eslint-disable-next-line no-redeclare
            for (var i = 0; i < points2.size(); i++) {
                points2Temp.push(points2.get(i).x, points2.get(i).y);
            }

            const imMatches = new cv.Mat();
            const color = new cv.Scalar(0, 255, 0, 255);
            cv.drawMatches(shrink1, keypoints1, checkReferenceImage, keypoints2, good_matches, imMatches, color);
            const mat1 = cv.matFromArray(points1.size(), 2, cv.CV_32F, points1Temp);
            const mat2 = cv.matFromArray(points2.size(), 2, cv.CV_32F, points2Temp);
            const h = cv.findHomography(mat1, mat2, cv.FM_RANSAC);

            // eslint-disable-next-line camelcase
            const image_B_final_result = new cv.Mat();
            cv.warpPerspective(shrink1, image_B_final_result, h, checkReferenceImage.size());
            sift.delete();
            points1.delete();
            points2.delete();
            good_matches.delete();
            matchePoints.delete();
            bfMatch.delete();
            keypoints1.delete();
            keypoints2.delete();
            descriptors1.delete();
            descriptors2.delete();
            im1Gray.delete();
            im2Gray.delete();
            imGray.delete();
            imMatches.delete();
            // color.delete();
            mat1.delete();
            mat2.delete();
            h.delete();
            // cv.imshow("canvasCheck", image_B_final_result);
            // cv.imshow("canvasOutput", image_B_final_result);
            // eslint-disable-next-line camelcase
            return image_B_final_result;
        }

        onMounted(async () => {
            navigator.mediaDevices.ondevicechange = () => {
                updateDeviceList();
            };
            await updateDeviceList();
            window.addEventListener("keyup", handleKeyup);
        });
        return {
            dialogVisible,
            videoRef,
            canvasRef,
            canvasCheckRef,
            mediaStreamConstraints,
            videoList,
            studentMissions,
            studentFinishMissions,
            img,
            missionInfoRef,
            scanInterval,
            studentName,
            studentMission,
            imageSrc,
            resultRef,
            centerDialogVisible,
            cv,
            IdentifyTip,
            IdeStudentID,
            CheckQuestionResultList,
            selectResult,
            resultVisible,
            studentMissionTemp,
            discernVisible,
            pageNumTemp,
            activeName,
            pageNumbers,
            ischeckResult,
            pageNumbersTemp,
            close,
            handleClose,
            discern,
            getMissionDetail,
            recognition,
            initPage,
            mousedown,
            closeResult,
            checkCorrect,
            checkError,
            recognitionaForstu,
            recognitionAgin,
            handleClick,
            checkPageDetail,
            nextPage
        };
    }
});
</script>
<style lang="scss" scoped>
html {
  font-size: 10px;
}
body {
  margin: 0;
  user-select: none;
  overflow: hidden;
}
.hign-photo-dialog{
    :deep(.el-dialog){
        margin: 0;
        padding: 30px;
        box-sizing: border-box;
        background: rgba(0, 0, 0, 0.2);
    }
    :deep(.el-overlay-dialog){
        height: calc(100vh + 36px);
    }
}
.container {
  display: flex;
  flex-direction: column;
  height: 95vh;
  width: 100%;
  background: #cfe1ff;
  :deep(.el-dialog){
        margin: 0;
        padding: 30px;
        box-sizing: border-box;
        background: rgba(0, 0, 0, 0.2);
    }
    :deep(.el-overlay-dialog){
        height: calc(100vh + 36px);
    }
  .video-warp {
    position: relative;
    padding: 5px;
    flex: 1;
	.students{
		position: absolute;
        top: 0;
        left: 0;
		padding: 40px 30px;
        display: flex;
        flex-direction: column;
        flex:1;
        min-width: 0;
        min-height: 0;
        z-index: 10;
        height: calc(100vh - 7rem);
        overflow-y:auto ;
        .student-list-item{
            padding: 1.2rem 1rem;
            background-color: #000000;
            border-radius: 0.4rem;
            opacity: 0.5;
            color: white;
            margin-top: 0.5rem;
            width: 15.2rem;
            height: 4.2rem;
            cursor : pointer;
        }
        .discern-now{
            widows: 33rem;
            height: 8rem;
            border:solid 1px cornflowerblue;
            border-radius: 5px;
        }
	}
	.buttonDiscern{
		position: absolute;
		bottom: 5px;
		right: 30px;
		widows: 440px;
		height: 600px;
	}
    .video {
      position: relative;
      overflow: hidden;
      height: 100%;
      background: #eef4ff;
      border: 1px solid #a4c4f9;
      .line{
          position: absolute;
          left:18%;
          z-index: 2;
          widows: 100%;
          width: 1482px;
          height: 58px;
          background: url("../../assets/homeworkImg/pic_saomiao.png");
          animation: myScan 2s infinite alternate;
          -webkit-animation: myScan 2s infinite alternate;
      }
      @keyframes  myScan{
          0% {
              transform: translate(0, 0);
          }
          100% {
              transform: translate(0, 1550px);
          }
	}
	@-webkit-keyframes  myScan{
		0% {
              transform: translate(0, 0);
        }
        100% {
            transform: translate(0, 1550px);
        }
	}
      video {
        height: 100%;
        position: absolute;
      }
      .overlay-wrapper {
        position: absolute;
        height: auto;
        text-align: center;
        top: 20px;
        padding-top: 2rem;
        padding: 20px;
        background-color: black;
        border-radius: 32px;
        opacity: 0.3;
        left: 42%;
        span{
            color: white;
            font-size:25px;
        }
      }
    }
  }
  .top {
    height: 70px;
    flex-shrink: 0;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 20px;
    .workbook-info {
        position: absolute;
        left:5%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        span {
            color: #0d0e11;
            font-size: 20px;
            margin-left: 15px;
            margin-right: 5px;
            font-weight: bold;
        }
        img {
        width: 36px;
      }
    }
    .workbook-number{
        position: absolute;
        left: 45%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
    }
    .camera-select {
      position: absolute;
      left: 85%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      .text {
        color: #0d0e11;
        font-size: 14px;
        margin-left: 5px;
        margin-right: 5px;
      }
      img {
        width: 36px;
      }
    }
  }
}
</style>
