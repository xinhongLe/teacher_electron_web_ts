
<template>
    <view class="scan-page" v-if="dialogVisible">
        <div class="head align-center">
            <div class="left align-center">
                <img src="../../../assets/composition/icon_sxt@2x.png" alt="" />
                <span>高拍仪：</span>
                <el-select v-model="device" placeholder="请选择班级">
                    <el-option v-for="item in deviceList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="right align-center">
                <div class="count">
                    <span class="label">班级已录入：</span>
                    <span class="num">0/50人</span>
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
                <chooseStu ref="chooseRef" @back="backScan" @after-choose="afterChoose" />
            </div>
            <div class="nav" v-else>
                <div class="opts align-center">
                    <div class="btn" @click="importFile">文件批量导入</div>
                    <div class="btn" @click="scanByHand">手动录入</div>
                </div>
                <div class="card">
                    <div class="card-tit">当前学生</div>
                <!-- <div class="empty-set">
                        待扫描
                        识别中...
                                                                                </div> -->
                    <div class="stu-set">
                        <div class="stu">周某某</div>
                        <div class="grade">三年级1班</div>
                        <div class="recog">重新识别</div>
                    </div>
                </div>
                <div class="photos">
                    <div class="tit">
                        已拍照片：
                    </div>
                    <div class="photo-box">
                        <div class="photo-item" v-for="(item,idx) in 4" :key="idx">
                            <img class="del" src="../../../assets/composition/icon_delete_red@2x.png" alt="" />
                            <div class="tag">{{idx+1}}</div>
                            <img @click="previewImg(item,idx)" class="main" src="../../../assets/composition/icon_paizhao@2x.png" alt="" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="content">
            <!-- <div class="start-scan">
                    <img src="../../../assets/composition/pic@2x.png" alt="" />
                    <el-button style="width: 146px;" color="#4B71EE" @click="startScan">
                        开始扫描
                    </el-button>
                                                                                     </div> -->
                <div class="scan">
                    <div>
                        <img class="line" src="../../../assets/composition/pic_saomiao@2x.png" alt="" />
                        <span class="down-tip toast">请对准作文开始拍摄</span>
                    </div>
                </div>
                <div class="takes">
                    <div class="take-item">
                        <img src="../../../assets/composition/icon_paizhao@2x.png" alt="" />
                        <span>拍照</span>
                    </div>
                    <div class="take-item">
                        <img src="../../../assets/composition/icon_next@2x.png" alt="" />
                        <span>下一个学生</span>
                    </div>
                </div>
            </div>
        </div>
    </view>
    <!-- 预览 -->
    <Preview ref="previewRef" />
    <!-- 文件导入 -->
    <ImportVue ref="importRef" />
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { reactive, ref, toRefs, watch, nextTick } from 'vue';
import chooseStu from './chooseStu.vue';
import Preview from './preview.vue';
import ImportVue from './import.vue';
//
const chooseRef = ref();
const previewRef = ref();
const importRef = ref();
//
const dialogVisible = ref(false);
const state = reactive({
    isScanByHand: false,
    device: null,
    deviceList: [{
        value: 1,
        label: '全部'
    }]
});
const { device, deviceList, isScanByHand } = toRefs(state);

const emit = defineEmits(['cancel', 'save','openList']);

// 关闭
const close = ()=>{
    dialogVisible.value = false
    emit('openList')
}

// 图片预览
const previewImg = (item:any,idx:number)=>{
    previewRef.value.openDialog()
}

// 选中学生
const afterChoose = (e: any) => {
    console.log('after:', e);
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
const importFile = ()=>{
    importRef.value.openDialog()
}

// 开始扫码
const startScan = () => {

}

const confirm = () => {

};

const openDialog = async (info?: any) => {
    dialogVisible.value = true
};

defineExpose({
    openDialog,
});
</script>
<style lang="scss" scoped>
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
                            height: 100%;
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
                width: 908px;
                height: 672px;
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

                    .line {
                        width: 100%;
                        height: 58px;
                        position: absolute;
                        z-index: 800;
                        left: 0;
                        top: 0;
                        animation: scan infinite 3s linear;
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