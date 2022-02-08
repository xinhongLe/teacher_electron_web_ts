<template>
  <el-dialog
    v-model="dialogVisible"
    :fullscreen="true"
  >
  <div class="container">
  <div class="top">
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
			<el-row :gutter="12" style="padding-bottom:6px">
				<el-col :span="8">
				<el-card shadow="hover"> 识别中 </el-card>
				</el-col>
			</el-row>
			<el-row :gutter="12" style="padding-bottom:6px">
				<el-col :span="8">
				<el-card shadow="hover"> Hover </el-card>
				</el-col>
			</el-row>
			<el-row :gutter="12" style="padding-bottom:6px">
				<el-col :span="8">
				<el-card shadow="hover"> Hover </el-card>
				</el-col>
			</el-row>
		</div>
		<div class="video">
			<video ref="videoRef" autoplay />
		</div>
		<div class="buttonDiscern">
			<el-button type="primary" @click="discern">识别</el-button>
		</div>
		<canvas ref="canvasRef" style="display:none"></canvas>
    </div>
  </div>
  </el-dialog>
</template>
<script lang="ts">
import { ElMessageBox } from "element-plus";
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
export default defineComponent({
    setup() {
        const dialogVisible = ref(false);
        const handleClose = () => {
            dialogVisible.value = false;
        };
        const videoRef = ref<HTMLVideoElement>();
        const canvasRef = ref<HTMLCanvasElement>();
        const videoList = ref<{ label: string; id: string }[]>([]);
        const mediaStreamConstraints = reactive({
            video: {
                width: 1900,
                height: 1600
            },
            deviceId: "",
            audio: false
        });

        function gotLocalMediaStream(mediaStream: MediaStream) {
            const localVideo = document.querySelector("video");
            localVideo!.srcObject = mediaStream;
        }

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

        const close = () => {
            ElMessageBox.confirm("确定关闭高拍仪吗", "关闭高拍仪", {
                type: "warning",
                confirmButtonText: "确定",
                cancelButtonText: "取消"
            }).then(() => {
                dialogVisible.value = false;
            });
        };

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const discern = () => { };

        watch(mediaStreamConstraints, (v) => {
            navigator.mediaDevices
                .getUserMedia(v)
                .then(gotLocalMediaStream);
        });

        onMounted(async () => {
            navigator.mediaDevices.ondevicechange = () => {
                updateDeviceList();
            };
            await updateDeviceList();
        });
        return {
            dialogVisible,
            videoRef,
            canvasRef,
            mediaStreamConstraints,
            videoList,
            close,
            handleClose
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
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background: #cfe1ff;
  .video-warp {
    padding: 5px;
    flex: 1;
	.students{
		position: absolute;
		top: 90px;
		left: 20px;
		width: 400px;
		height: 100%;
		z-index: 10;
	}
	.buttonDiscern{
		position: absolute;
		bottom: 5px;
		right: 30px;
		widows: 400px;
		height: 100px;
	}
    .video {
      position: relative;
      overflow: hidden;
      height: 100%;
      background: #eef4ff;
      border: 1px solid #a4c4f9;
      video {
        height: 100%;
        position: absolute;
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
    .camera-select {
      position: absolute;
      left: 50%;
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
