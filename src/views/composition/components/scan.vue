
<template>
    <view class="scan-page" v-if="dialogVisible">
        <div class="head align-center">
            <div class="left align-center">
                <img src="../../../assets/composition/icon_sxt@2x.png" alt="" />
                <span>高拍仪：</span>
                <el-select v-model="device" placeholder="请选择" @change="deviceChange">
                    <el-option v-for="item in deviceList" :key="item.deviceId" :label="item.label" :value="item.deviceId">
                    </el-option>
                </el-select>
            </div>
            <div class="right align-center">
                <div class="count">
                    <span class="label">班级已录入：</span>
                    <span class="num">{{ state.hasRecordCount }}/{{ state.allStuList.length }}人</span>
                </div>
                <div class="close align-center" @click="close">
                    <img src="../../../assets/composition/icon_js@2x.png" alt="" />
                    结束
                </div>
            </div>
        </div>
        <div class="box">
            <!-- 选择学生 -->
            <div class="nav" v-if="isScanByHand">
                <chooseStu :current="state.currentStudent" :stu-list="state.waitRecordList" ref="chooseRef" @back="backScan"
                    @after-choose="afterChoose" />
            </div>
            <div class="nav" v-else>
                <div class="opts align-center">
                    <div class="btn" @click="importFile">文件批量导入</div>
                    <div class="btn" @click="scanByHand">手动录入</div>
                </div>
                <div class="card">
                    <div class="card-tit">当前学生</div>
                    <!-- 识别中... -->
                    <div class="empty-set" v-if="!currentStudent">
                        {{ boxMessage }}
                    </div>
                    <div class="stu-set" v-else>
                        <div class="stu">{{ state.currentStudentObj.StudentName }}</div>
                        <div class="grade">{{ state.currentStudentObj.ClassName }}</div>
                        <div class="recog" @click="clearStuInfo">重新识别</div>
                    </div>
                </div>
                <div class="photos" v-if="photoList.length > 0">
                    <div class="tit">
                        已拍照片：
                    </div>
                    <div class="photo-box">
                        <div class="photo-item" v-for="(item, idx) in photoList" :key="idx">
                            <img @click="removePreview(idx)" class="del"
                                src="../../../assets/composition/icon_delete_red@2x.png" alt="" />
                            <div class="tag">{{ idx + 1 }}</div>
                            <img @click="previewImg(idx)" class="main" :src="item.url" alt="" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="content">


                <div class="start-scan" v-if="!isOpenScan">
                    <img src="../../../assets/composition/pic@2x.png" alt="" />
                    <!-- v-if="currentStudent" -->
                    <el-button style="width: 146px;" color="#4B71EE" @click="startScan">
                        开始扫描
                    </el-button>
                <!-- <div class="opt align-center" v-else>
                        <el-button color="#4B71EE" @click="scanCode">
                            扫描二维码
                        </el-button>
                        <el-button color="#4B71EE" @click="scanName">
                            扫描姓名
                        </el-button>
                                            </div> -->
                </div>
                <div class="scan" id="scan" v-else>
                    <div v-if="!currentStudent">
                        <QrStream class="qrcode" v-show="state.qrcode" :camera="state.camera" :torch="state.torchActive"
                            @decode="onDecode" @init="onInit"></QrStream>
                        <img class="line" src="../../../assets/composition/pic_saomiao@2x.png" alt="" />
                        <span class="down-tip toast" v-if="!isCodeMode">请对着学生名字，点击识别</span>
                        <span class="down-tip toast" v-else>请先扫描学生二维码</span>
                        <div class="switch-box align-center">
                            <div class="switch-item align-center">
                                <span>识别二维码</span>
                                <el-switch @change="codeSwitchChange" v-model="isCodeMode"
                                    style="--el-switch-on-color: #4B71EE;" />
                            </div>
                            <div class="switch-item align-center">
                                <span>识别名字</span>
                                <el-switch @change="nameSwitchChange" v-model="isNameMode"
                                    style="--el-switch-on-color: #4B71EE;" />
                            </div>
                        </div>
                    </div>

                    <div id="takeAPic" v-else>
                        <video id="video" ref="videoRef" class="video"></video>
                        <img class="line" src="../../../assets/composition/pic_saomiao@2x.png" alt="" />
                        <span class="down-tip toast">请对准作文开始拍摄</span>
                    </div>
                </div>
                <div class="takes" v-if="isOpenScan">
                    <div class="take-item" v-if="!isCodeMode && !currentStudent" @click="capturePicToWords">
                        <img src="../../../assets/composition/icon_paizhao@2x.png" alt="" />
                        <span>识别</span>
                    </div>
                    <template v-if="currentStudent">
                        <div class="take-item" @click="capture">
                            <img src="../../../assets/composition/icon_paizhao@2x.png" alt="" />
                            <span>拍照</span>
                        </div>
                        <div class="take-item" @click="switchToNextStu">
                            <img src="../../../assets/composition/icon_next@2x.png" alt="" />
                            <span>{{ isSupply ? '完成' : '下一个学生' }}</span>
                        </div>
                    </template>

                </div>
            </div>
        </div>
    </view>
    <!-- 预览 -->
    <Preview ref="previewRef" :img-list="photoList" />
    <!-- 文件导入 -->
    <ImportVue ref="importRef" @open-list="close" :teacher-composition-id="state.TeacherCompositionId" />
    <!-- 重名选择 -->
    <Repeat ref="repeatRef" :repeat-list="state.repeatList" @select="selectRepeat" />
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { reactive, ref, toRefs, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import chooseStu from './chooseStu.vue';
import Preview from './preview.vue';
import Repeat from './repeat.vue';
import ImportVue from './import.vue';
import { cooOssv2, getOssUrl } from '@/utils/oss';
import { get, STORAGE_TYPES } from '@/utils/storage';
import moment from 'moment';
import { QrStream, QrCapture } from 'vue3-qr-reader';
import { getClassStuCountByTeacher, getStudentByClass, getStudentByHasEntry, getStudentByUserInfo, oneStudentEntry, picToWordByName } from '../api';
import { store } from '@/store';
import { linkSync } from 'fs';
//
onMounted(() => {
    window.addEventListener('resize', listenResizeFn);
    getDevices()
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', listenResizeFn);
})

const listenResizeFn = () => {
    let el = document.getElementById('scan')
    // console.log('resize--------', el?.clientWidth, el?.clientHeight)
    // if (state.isOpenScan && el) {

    // }
}
//
const videoRef = ref();
const canvasRef = ref();
const chooseRef = ref();
const repeatRef = ref();
const previewRef = ref();
const importRef = ref();
//
const props = defineProps({
    classId: {
        type: String,
        default: ''
    }
})
//
const dialogVisible = ref(false);
const state = reactive({
    qrcode: true,
    torchActive: false,
    camera: 'auto',
    TeacherCompositionId: null,
    Title: '',
    isSupply: false,// 是否补录
    isScanByHand: false,
    isOpenScan: false,// 是否开启扫描
    boxMessage: '待扫描', // 识别中...
    isCodeMode: true,// 扫描二维码
    isNameMode: false,// 文字
    showVideo: true, // 展示视频
    currentStudent: '', // 当前学生
    currentStudentObj: {} as any,
    device: null,
    hasRecordCount: 0,
    photoList: [] as any,
    allStuList: [] as any,
    waitRecordList: [] as any,
    repeatList: [] as any,
    // classCount: 0,
    deviceList: [] as any
});
const { device, isSupply, currentStudent, isCodeMode, isNameMode, photoList, deviceList, isOpenScan, boxMessage, isScanByHand } = toRefs(state);

const emit = defineEmits(['cancel', 'save', 'openList']);

// 互斥switch
const codeSwitchChange = (e: any) => {
    console.log(111, e);
    state.isNameMode = !e
    localStorage.setItem('isNameMode',e?'0':'1')
}

const nameSwitchChange = (e: any) => {
    console.log(222, e);
    state.isCodeMode = !e
    localStorage.setItem('isNameMode',e?'1':'0')
}

/**
 * 二维码识别
 */
const onDecode = (result: any) => {
    // alert(result)
    console.log('--------识别结果--------', result);
    if (result) {
        // 处理显示到左侧
        searchRepeat(result)
    } else {
        ElMessage.warning('未识别出二维码信息')
    }
}

const capturePicToWords = () => {
    // 调用图片识别接口
    let elements = document.getElementsByClassName('qr-stream-camera');
    console.log('elements:', elements);
    let file = videoCapture(elements[0])
    uploadImgToOss(file, 2, (file: any) => {
        picRecognize(file)
    });
}

/**
 * 图片识别
 */
const picRecognize = (file: any) => {
    picToWordByName(file).then(async (res: any) => {
        if (res.success) {
            let result = res.result.Content || ''
            if (result) {
                searchRepeat(result)
            } else {
                ElMessage.warning('图片未识别出学生信息')
            }
        }
    })
}

/**
 * 处理模糊/重名
 */
const searchRepeat = (info: any) => {
    let cid = localStorage.getItem('compositionClassId')
    getStudentByUserInfo({ UserInfo: info, ClassId: cid, TeacherCompositionId: state.TeacherCompositionId }).then(async (res: any) => {
        if (res.success) {
            let list = res.result || []
            if (list.length > 0) {
                if (list.length > 1) {
                    // 选择重名弹窗
                    state.repeatList = list
                    repeatRef.value.openDialog()
                } else {
                    //直接识别到左侧
                    let theone = list[0]
                    selectRepeat(theone)
                    ElMessage.success('识别成功，请拍摄作文')
                }

            } else {
                ElMessage.warning('当前班级未查询到该学生')
            }
        }
    })
}

const selectRepeat = (e: any) => {
    state.currentStudent = e.StudentId
    state.currentStudentObj = {
        StudentName: e.StudentName,
        StudentId: e.StudentName,
        ClassName: e.ClassName
    }
    getUserMedia()
}

const onInit = async (promise: any) => {
    const { capabilities } = await promise;

    const TORCH_IS_SUPPORTED = !!capabilities.torch;
    try {
        await promise;
    } catch (error) {
        if (error.name === 'NotAllowedError') {
            ElMessage.warning('您需要授予相机访问权限');
        } else if (error.name === 'NotFoundError') {
            ElMessage.warning('这个设备上没有摄像头')
        } else if (error.name === 'NotSupportedError') {
            ElMessage.warning('所需的安全上下文(HTT)PS、本地主机')
        } else if (error.name === 'NotReadableError') {
            ElMessage.warning('相机被占用')
        } else if (error.name === 'OverconstrainedError') {
            ElMessage.warning('安装摄像头不合适')
        } else if (error.name === 'StreamApiNotSupportedError') {
            ElMessage.warning('此浏览器不支持流API');
        }
    }
}

// 获取设备
const getDevices = (e?: string) => {
    navigator.mediaDevices.enumerateDevices().then(deviceList => {
        state.deviceList = deviceList.filter(v => v.kind === 'videoinput')
        console.log('------devicesList', state.deviceList)
        if (!e) {
            state.device = state.deviceList[0]?.deviceId || null
            if (state.device) {
                navigator.mediaDevices.getUserMedia({ video: { deviceId: state.device } }).then(function (stream) {
                    success(stream)
                })
                    .catch(function (err) {
                        console.log('默认getUserMedia-----error', err)
                    });
            }
        } else {
            navigator.mediaDevices.getUserMedia({ video: { deviceId: e } }).then(function (stream) {
                success(stream)
            })
                .catch(function (err) {
                    console.log('设备切换getUserMedia-----error', err)
                });
        }

    })
}

// 设备切换
const deviceChange = (e: string) => {
    console.log('设备切换:', e);
    getDevices(e)
}

// 清空当前信息
const clearStuInfo = () => {
    state.isSupply = false;
    state.currentStudent = '';
    state.currentStudentObj = null;
    state.boxMessage = '待扫描';
    state.photoList = [];
}
// 下一个学生
const switchToNextStu = () => {
    if (state.photoList.length === 0) {
        // 直接切换下一个学生
        // 补录需要提示
        if (state.isSupply) {
            ElMessage.warning('请拍摄作文照片')
            return
        }
        clearStuInfo()
        state.isScanByHand = true
        // nextTick(() => {
        //     chooseRef.value.switchNext()
        // })
    } else {
        // 请求接口
        oneStudentEntry({
            TeacherCompositionId: state.TeacherCompositionId,
            StudentId: state.currentStudent,
            ClassId: props.classId,
            OperatorId: store.state.userInfo?.userCenterUserID,
            Title: state.Title,
            StudentCompositionFile: state.photoList
        }).then((res: any) => {
            if (res.success) {
                if (state.isSupply) {
                    // 跳走到列表
                    close()
                    emit('openList', { TeacherCompositionId: state.TeacherCompositionId, Title: state.Title })
                    return
                }
                // 到学生列表页选择学生
                ElMessage.success('录入成功');
                getWaitRecordStudents(() => {
                    clearStuInfo()
                    // state.isScanByHand = true
                })

            }
        })
    }

}

/**
 * 获取待录入学生
 */
const getWaitRecordStudents = (cb?: any) => {
    getStudentByHasEntry({
        TeacherCompositionId: state.TeacherCompositionId,
        ClassId: props.classId
    }).then((res: any) => {
        if (res.success) {
            state.waitRecordList = res.result || []
            state.hasRecordCount = state.allStuList.length - state.waitRecordList.length
            if (cb) {
                cb()
            }
        }
    })
}


// 关闭
const close = () => {
    state.isOpenScan = false
    state.boxMessage = '待扫描'
    state.showVideo = true
    clearStuInfo()
    //
    dialogVisible.value = false
    emit('openList', { TeacherCompositionId: state.TeacherCompositionId, Title: state.Title })
}

// 图片预览
const previewImg = (idx: number) => {
    previewRef.value.openDialog(idx)
}

// 删除图片
const removePreview = (idx: number) => {
    state.photoList.splice(idx, 1)
}

// 选中学生
const afterChoose = (e: any) => {
    console.log('after:', e);
    state.currentStudent = e.StudentId
    state.currentStudentObj = e
    setTimeout(() => {
        state.isScanByHand = false
    }, 500);
    getDevices()
}

// 返回扫码
const backScan = () => {
    state.isScanByHand = false
}

// 手动录入
const scanByHand = () => {
    state.isScanByHand = true
}

// 导入文件
const importFile = () => {
    importRef.value.openDialog()
}

// 开始扫码
const startScan = () => {
    if (state.deviceList.length === 0) {
        ElMessage.warning('当前无可用视频设备')
        return
    }
    state.isOpenScan = true;
    if (!state.currentStudent) {
        state.boxMessage = '识别中...';
    }
    // state.isRecognizing = true;
    //
    let flag = localStorage.getItem('isNameMode')
    state.isCodeMode = flag=='1' ? false : true
    state.isNameMode = !state.isCodeMode
    getUserMedia()
}

// // 开始扫二维码
// const scanCode = () => {
//     startScan()
//     state.isCodeMode = true
// }

// // 开始扫描姓名
// const scanName = () => {
//     startScan()
//     state.isCodeMode = false
// }

const getUserMedia = () => {
    /* 可同时开启video(摄像头)和audio(麦克风) 这里只请求摄像头，所以只设置video为true */
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            /* 使用这个 stream 传递到成功回调中 */
            success(stream)
        })
        .catch(function (err) {
            /* 处理 error 信息 */
            console.log('getUserMedia-----error', err);
            // error(error)
        });
}

const success = (stream: any) => {
    // console.log('成功', stream);
    /* 将stream 分配给video标签 */
    let finds = document.getElementsByTagName('video')
    console.log('finds:', finds);
    finds[0].srcObject = stream;
    finds[0].play;
    if (videoRef.value) {
        videoRef.value.srcObject = stream;
        videoRef.value.play();
    }
}

/**
 * video截图生成file
 */
const videoCapture = (element: any) => {
    const canvas: HTMLCanvasElement = document.createElement('canvas')
    const dpr = window.devicePixelRatio;
    let el = document.getElementById('scan')
    if (el) {
        canvas.width = (el?.clientWidth) * dpr; // 884
        canvas.height = (el?.clientHeight) * dpr; // 648
        const context = canvas.getContext("2d", { willReadFrequently: true })!;
        context.scale(dpr, dpr);
        // let video = document.getElementById('video');
        const img = new Image()
        context.drawImage(element, 0, 0, el.clientWidth, el.clientHeight)
        img.src = canvas.toDataURL('image/png')
        let name = moment(new Date()).format('MMDDHHssmm-') + new Date().getTime() + '.png';
        let blob = dataURLtoBlob(img.src);
        let file = blobToFile(blob, name);
        return file
    }

}

/* 拍照按钮点击 */
const capture = () => {
    if (state.photoList.length === 10) {
        ElMessage.warning('最多可拍摄10张照片')
        return
    }
    state.showVideo = false;
    nextTick(() => {
        let video = document.getElementById('video');
        let file = videoCapture(video)
        uploadImgToOss(file, 1, () => {
            // // 隐藏视频
            state.isScanByHand = false
        });
    })
}

//将base64转换为blob
const dataURLtoBlob = (dataurl: any) => {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

//将blob转换为file
const blobToFile = (theBlob: any, fileName: any) => {
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
}

const uploadImgToOss = async (data: any, type = 1, cb: any) => {
    const bucketObj = {
        Bucket: "compositionevaluation",
        Path: "pic",
        Extention: "",
        Explain: "作文文件"
    };
    const res = await cooOssv2(data, bucketObj)
    if (res?.code === 200) {
        let url = await getOssUrl(res.objectKey, bucketObj.Bucket);
        let newFile = { Name: res.name, FileMD5: res.md5, FileExtention: res.fileExtension, FileBucket: 'compositionevaluation', FilePath: 'pic', url }
        if (type === 1) {
            state.photoList.push(newFile);
        }
        cb(newFile)
    }
}

/**
 * 全部学生
 */
const getAllStudents = (cb?: any) => {
    getStudentByClass({
        ClassId: props.classId
    }).then((res: any) => {
        if (res.success) {
            state.allStuList = res.result || []
            if (cb) {
                cb()
            }
        }
    })
}

const openDialog = async (info?: any) => {
    // console.log('scan-open-info:', info);
    const { TeacherCompositionId, Title, classCount } = info
    state.TeacherCompositionId = TeacherCompositionId
    state.Title = Title
    // state.classCount = classCount
    //
    getDevices()
    getAllStudents(() => {
        getWaitRecordStudents()
    })
    dialogVisible.value = true
    if (info.StudentId) {
        // 补录
        state.isSupply = true
        state.currentStudent = info.StudentId
        getClasslist()
        state.currentStudentObj = {
            StudentName: info.StudentName,
            StudentId: info.StudentName,
            ClassName: info.ClassName
        }
    }
};

/**
 * 获取班级
 */
const getClasslist = () => {
    getClassStuCountByTeacher({
        OrgId: store.state.userInfo?.schoolId,
        UserId: store.state.userInfo?.userCenterUserID
    }).then((res: any) => {
        if (res.success) {
            let cid = localStorage.getItem('compositionClassId')
            let list = res.result || []
            state.currentStudentObj.ClassName = list.filter((v: any) => v.Id === cid)[0].Name
        }
    })
}

defineExpose({
    openDialog,
});
</script>
<style lang="scss" scoped>
.qrcode {
    width: 100%;
    height: 100%;
}

.toast {
    padding: 11px 24px;
    height: 40px;
    background: #000000;
    border-radius: 27px;
    opacity: 0.4;
    font-size: 14px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #FFFFFF;
}

.align-center {
    display: flex;
    align-items: center;
}

.scan-page {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 888;

    .head {
        width: 100%;
        height: 56px;
        padding: 0 16px;
        box-sizing: border-box;
        background-color: #E7ECFB;
        justify-content: space-between;

        .left {
            &>img {
                width: 18px;
                height: 18px;
                margin-right: 4px;
            }

            &>span {
                font-size: 14px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #19203D;
                margin-right: 8px;
            }
        }

        .right {
            .count {
                font-size: 14px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;

                .label {
                    color: #5F626F;
                }

                .num {
                    color: #19203D;
                }
            }

            .close {
                width: 90px;
                height: 32px;
                background: #FF6B6B;
                border-radius: 27px;
                font-size: 14px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #FFFFFF;
                margin-left: 48px;
                justify-content: center;
                cursor: pointer;

                &>img {
                    width: 16px;
                    height: 16px;
                    margin-right: 6px;
                }
            }
        }
    }

    .box {
        height: calc(100% - 56px);
        overflow-y: auto;
        background-color: #F5F6FA;
        padding: 24px;
        box-sizing: border-box;
        display: flex;

        .nav {
            width: 230px;
            margin-right: 24px;

            .opts {
                justify-content: space-between;
                margin-bottom: 16px;

                .btn {
                    width: 111px;
                    height: 32px;
                    line-height: 32px;
                    text-align: center;
                    cursor: pointer;
                    background: #FFFFFF;
                    border-radius: 4px;
                    border: 1px solid #E0E2E7;
                    font-size: 12px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #19203D;
                }
            }

            .photos {
                margin-top: 24px;

                .tit {
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #5F626F;
                    margin-bottom: 18px;
                }

                .photo-box {
                    width: 100%;
                    display: grid;
                    justify-content: space-between;
                    grid-template-columns: repeat(auto-fill, 111px);
                    grid-gap: 8px;

                    .photo-item {
                        position: relative;
                        margin-bottom: 4px;

                        .del {
                            position: absolute;
                            right: -8px;
                            top: -8px;
                            width: 16px;
                            height: 16px;
                            cursor: pointer;
                        }

                        .tag {
                            position: absolute;
                            left: 4px;
                            bottom: 4px;
                            width: 16px;
                            height: 16px;
                            line-height: 16px;
                            background: fade-out($color: #000000, $amount: 0.7);
                            border-radius: 2px;
                            font-size: 12px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: #F5F6FA;
                            text-align: center;
                        }

                        .main {
                            width: 100%;
                            height: 111px;
                            border-radius: 5px;
                            cursor: pointer;
                        }
                    }
                }

            }

            .card {
                width: 100%;
                background: #FFFFFF;
                border-radius: 4px;

                &-tit {
                    width: 230px;
                    height: 32px;
                    line-height: 32px;
                    background: #9FB5FE;
                    border-radius: 4px 4px 0px 0px;
                    font-size: 14px;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    font-weight: 600;
                    color: #FFFFFF;
                    text-align: center;
                }

                .empty-set {
                    height: 88px;
                    line-height: 88px;
                    font-size: 12px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #5F626F;
                    text-align: center;
                }



                .stu-set {
                    height: 124px;
                    padding: 16px 0;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    .stu {
                        font-size: 18px;
                        font-family: PingFangSC-Semibold, PingFang SC;
                        font-weight: 600;
                        color: #19203D;
                    }

                    .grade {
                        font-size: 14px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #5F626F;
                        margin-top: 8px;
                    }

                    .recog {
                        width: 80px;
                        height: 28px;
                        line-height: 28px;
                        text-align: center;
                        border-radius: 16px;
                        border: 1px solid fade-out($color: #4B71EE, $amount: 0.7);
                        cursor: pointer;
                        font-size: 12px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #4B71EE;
                        margin-top: 16px;
                    }
                }
            }
        }

        .content {
            flex: 1;
            width: 100%;
            display: flex;

            // #4B71EE  2px 
            // #D6DDF4 12px 
            // radius 12px
            .scan {
                min-width: 775px; //908px
                flex: 1;
                height: 100%;
                min-height: 672px; //672px
                background-color: #D6DDF4;
                border-radius: 12px;
                padding: 8px;
                box-sizing: border-box;

                &>div {
                    width: 100%;
                    height: 100%;
                    position: relative;
                    border: 4px solid #4B71EE;
                    box-sizing: border-box;
                    border-radius: 12px;
                    background-color: #fff;

                    .video {
                        width: 100%;
                        height: 100%;
                        object-fit: fill;
                    }

                    .capture-pic {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                    }

                    .line {
                        width: 100%;
                        height: 58px;
                        position: absolute;
                        z-index: 800;
                        left: 0;
                        top: 0;
                        animation: scan infinite 3s linear;
                    }

                    .switch-box {
                        position: absolute;
                        left: 12px;
                        bottom: 12px;

                        .switch-item {
                            margin-right: 24px;

                            span {
                                font-size: 14px;
                                font-family: HarmonyOS_Sans_SC_Medium;
                                color: #FDF7F9;
                                margin-right: 8px;
                                text-shadow: 1px .5px #000;
                            }
                        }
                    }

                    .down-tip {
                        position: absolute;
                        z-index: 820;
                        bottom: 32px;
                        left: 50%;
                        transform: translateX(-50%);
                    }
                }
            }

            .takes {
                // flex: 1;
                // width: 120px;
                height: 672px;
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                margin-left: 50px;
                margin-right: 30px;

                .take-item {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    cursor: pointer;

                    &>img {
                        width: 80px;
                        height: 80px;
                        display: block;
                        margin-bottom: 20px;
                    }

                    &>span {
                        font-size: 20px;
                        font-family: PingFangSC-Semibold, PingFang SC;
                        font-weight: 600;
                        color: #19203D;
                        display: block;
                        // width: 100%;
                        // text-align: center;
                    }

                    &:nth-child(1) {
                        margin-bottom: 158px;
                    }
                }

            }

            .start-scan {
                width: 240px;
                height: fit-content;
                margin: 156px auto 0 auto;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                &>img {
                    width: 240px;
                    height: 157px;
                    display: block;
                    margin-bottom: 24px;
                }
            }
        }
    }
}

@keyframes scan {
    from {
        transform: translateY(0);
    }

    to {
        transform: translateY(600px);
    }
}
</style>