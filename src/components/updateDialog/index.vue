<template>
    <el-dialog
        v-model="updateVisibleDio"
        title="更新下载"
        :show-close="false"
        :close-on-click-modal="false"
    >
        <div style="padding: 0 20px 20px">
            <el-progress
                :text-inside="true"
                :show-text="false"
                :stroke-width="20"
                :percentage="downloadPercentDio"
            ></el-progress>
        </div>
    </el-dialog>
    <el-dialog v-model="newVersionViewDio" width="400px" center class="versionView" :show-close="false"
               :close-on-click-modal="false">
        <div class="content">
            <img class="update-img" src="/img/pic_update@2x.png" alt="">
            <div class="title">检测到有新的版本</div>
            <div class="info-list">
                <div v-for="(item, index) in showUpdateInfo" :key="index">
                    <div class="info">
                        <span> {{ item }}</span>
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
              <span class="dialog-footer">
                <el-button style="width: 40%" v-if="ifShowCancelButton"
                           @click="cancleUpdate">取消</el-button>
                <el-button style="width: 40%" type="primary" @click="handleUpdate">更新</el-button>
              </span>
        </template>
    </el-dialog>

    <el-dialog v-model="isNewVersion" width="400px" center class="versionView" :show-close="false"
               :close-on-click-modal="false">
        <div class="content">
            <img class="update-img" src="/img/pic_update@2x.png" alt="">
            <div class="title">已经是最新版了！</div>
            <div style="text-align: center;margin-top: 50px;">
                <el-button style="width: 40%" type="primary" @click="cancleNewVersion">好的</el-button>
            </div>
        </div>
    </el-dialog>

</template>

<script lang="ts">
import {computed, defineComponent} from "vue";

const fs = require('fs');
const path = require('path');
const app = require('electron').remote.app;
export default defineComponent({
    name: "UpdateDialog",
    props: {
        updateVisible: {
            type: Boolean,
            default: false
        },
        newVersionView: {
            type: Boolean,
            default: false
        },
        downloadPercent: {
            type: Number
        },
        showUpdateInfo: {
            type: Array,
            default: () => []
        },
        ifShowCancelButton: {
            type: Boolean,
            default: false
        },
        isNewVersion: {
            type: Boolean,
            default: false
        }
    },
    emits: ["downloadUpdate", "update:updateVisible", "update:newVersionView", "update:isNewVersion"],
    setup(props, {emit}) {

        const updateVisibleDio = computed(() => props.updateVisible);
        const newVersionViewDio = computed(() => props.newVersionView);
        const downloadPercentDio = computed(() => props.downloadPercent);
        const isNewVersion = computed(() => props.isNewVersion);
        //更新
        const handleUpdate = () => {
            saveUserChoice('update');
            emit("update:newVersionView", false)
            emit("update:updateVisible", true)
            emit("downloadUpdate")
            // window.electron.ipcRenderer.invoke("isUpdateNow");
        };
        //取消更新
        const cancleUpdate = () => {
            saveUserChoice('cancel');
            emit("update:newVersionView", false)
        };
        //关闭最新版提示
        const cancleNewVersion = () => {
            saveUserChoice('cancel');
            emit("update:isNewVersion", false)
        }
        // 存储用户的更新选择
        const saveUserChoice = (choice: string) => {
            const filePath = path.join(app.getPath('userData'), 'userUpdateChoice.json');
            fs.writeFileSync(filePath, choice); // 写入文件
        }
        return {
            updateVisibleDio,
            newVersionViewDio,
            downloadPercentDio,
            isNewVersion,
            handleUpdate,
            cancleUpdate,
            saveUserChoice,
            cancleNewVersion
        }
    }

})


</script>

<style scoped lang="scss">
.versionView {
    .content {
        max-height: 600px;
        overflow-y: auto;

        .update-img {
            position: absolute;
            left: 50%;
            transform: translate(-50%);
            top: -60px;
            width: 180px;
            height: 130px;
        }

        .info-list {
            height: 195px;
            overflow: overlay;
        }

        .title {
            font-size: 22px;
            font-weight: 600;
            color: #1C2340;
            text-align: center;
            letter-spacing: 2px;
            margin: 30px 0;
        }

        .info {
            font-size: 20px;
            color: #99A2AD;
            margin-bottom: 14px;
            line-height: 24px;
        }
    }

    .dialog-footer {
        .el-button {
            height: 40px;
        }

        .el-button--primary {
            background: #4b71ee;
            border: #4b71ee;
        }
    }
}
</style>
