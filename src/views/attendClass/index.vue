<template>
    <div class="resource-content">
        <div class="resource-list">
            <!-- <ResourceItem
                v-for="(item, index) in resourceList"
                :key="index"
                :data="item"
                :btns="false"
                @eventEmit="eventEmit"
            /> -->
            <Resources :course="course" :source="source" :type="type" />
        </div>
        <div class="resource-filter">
            <el-radio-group
                class="custom-radio-two"
                v-model="type"
                size="small"
            >
                <el-radio-button
                    v-for="item in typeList"
                    :key="item.Id"
                    :label="item.Id"
                >
                    {{ item.Name }}
                </el-radio-button>
            </el-radio-group>
            
            <el-button class="switch-btn" size="small" type="default" @click="switchClass()">
                <img src="@/assets/images/preparation/icon_qiehuan.png" alt="">
                {{isSwitch ? "全部显示" : "仅显示备课篮"}}
            </el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { fetchResourceType, IResourceItem } from "@/api/resource";
import { IpcRendererEvent } from "electron";
import isElectron from "is-electron";
import { defineComponent, onActivated, onMounted, ref, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import ResourceItem from "../preparation/layout/resourceItem.vue";
import Resources from "../preparation/layout/resources.vue";

export default defineComponent({
    components: { ResourceItem, Resources },
    setup() {
        const resourceList = ref<IResourceItem[]>([]);
        const router = useRouter();
        const route = useRoute();

        const course = ref({
            chapterId: "",
            lessonId: ""
        });

        const source = ref("");

        const eventEmit = (event: string, data: any, e?: MouseEvent | TouchEvent) => {
            console.log(event, data);
            switch(event) {
                case "delete":
                    break;
                case "version":
                     break;
                case "detail":
                    router.push("/resource/" + data.type + "/" + data.id);
                    break;
            }
        };

        const type = ref("");
        const typeList = ref<{ Id: string; Name: string }[]>([]);

        const getResourceType = async () => {
			const res = await fetchResourceType();
			if (res.success) {
				res.result.push({
					Id: "",
					Name: "全部"
				});
				typeList.value = res.result.reverse();
			}
		};

        const isSwitch = ref(false);
        const sendResourceData = () => {
            if (isElectron()) {
                window.electron.ipcRenderer.send("attendClass", "unfoldSuspension", {
                    type: "sysData",
                    resources: JSON.stringify(resourceList.value)
                });
            }
        };

        onActivated(() => {
            sendResourceData();
        });

        const onWatchAttendClass = (e: IpcRendererEvent, event: any) => {
            switch(event.type) {
                case "sysData":
                    window.electron.ipcRenderer.send("attendClass", "unfoldSuspension", { type: "switchClass", switch: isSwitch.value });
                    sendResourceData();
                    break;
                case "openResource":
                    const resource = JSON.parse(event.resource);
                    router.push("/resource/" + resource.type + "/" + resource.id);
                    break;
                case "switchClass":
                    switchClass();
                    break;
            }
        }

        onMounted(() => {
            console.log(route.params);
            getResourceType();
            course.value.lessonId = route.params.lessonId as string;
            course.value.chapterId = route.params.chapterId as string;
            if (isElectron()) {
                window.electron.ipcRenderer.on("attendClass", onWatchAttendClass);
            }
        });

        onUnmounted(() => {
            if (isElectron()) {
                window.electron.ipcRenderer.off("attendClass", onWatchAttendClass);
            }
        });

        const switchClass = () => {
            console.log(course.value, type.value)
            isSwitch.value = !isSwitch.value;
            window.electron.ipcRenderer.send("attendClass", "unfoldSuspension", { type: "switchClass", switch: isSwitch.value });
            sendResourceData();

            if (isSwitch.value) {
                source.value = "";
            } else {
                // 获取我的备课包
                source.value = "me";
            }
        };

        return {
            resourceList,
            eventEmit,
            type,
            typeList,
            isSwitch,
            switchClass,
            course,
            source
        }
    }
});
</script>

<style lang="scss" scoped>
.resource-content {
    flex: 1;
    min-height: 0;
    padding: 15px;
    height: 100%;
    background-color: #F5F6FA;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.resource-list {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
}

.resource-filter {
    padding: 15px;
    background-color: #fff;
    margin: 0 -15px -15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.custom-radio-two {
    :deep(.el-radio-button__inner) {
        margin-right: 10px;
        border-radius: 4px;
        border: 0;
        background: #F0F4FF;
        min-width: 80px;
        color: #4B71EE;
    }
    :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
        color: #fff;
        box-shadow: none;
        background: #4B71EE;
    }
    :deep(.el-radio-button--small .el-radio-button__inner) {
        font-size: 14px;
    }
}

.switch-btn {
    :deep(span) {
        display: flex;
        align-items: center;
    }
    img {
        display: block;
        margin-right: 3px;
    }
}
</style>
