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
            <Resources name="attendClass" @updateResourceList="updateResourceList" :course="course" :source="source" :type="type" />
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
import { fetchResourceType, IResourceItem, logView } from "@/api/resource";
import { MutationTypes, useStore } from "@/store";
import { IpcRendererEvent } from "electron";
import isElectron from "is-electron";
import { defineComponent, onActivated, onMounted, ref, onUnmounted, provide } from "vue";
import { useRoute } from "vue-router";
import ResourceItem from "../preparation/layout/resourceItem.vue";
import Resources from "../preparation/layout/resources.vue";

export default defineComponent({
    components: { ResourceItem, Resources },
    setup() {
        const resourceList = ref<IResourceItem[]>([]);
        const route = useRoute();
        const store = useStore();

        const course = ref({
            chapterId: "",
            lessonId: ""
        });

        const source = ref("");
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
            course.value = {
                lessonId: route.params.lessonId as string,
                chapterId: route.params.chapterId as string
            };
            // sendResourceData();
        });

        const onWatchAttendClass = (e: IpcRendererEvent, event: any) => {
            switch(event.type) {
                case "sysData":
                    window.electron.ipcRenderer.send("attendClass", "unfoldSuspension", { type: "switchClass", switch: isSwitch.value });
                    sendResourceData();
                    break;
                case "openResource":
                    const resource = JSON.parse(event.resource);
                    if (resource.ResourceShowType === 2) {
                        // 断点视频
                        store.commit(MutationTypes.SET_IS_SHOW_VIDEO, { flag: true, info: { id: resource.OldResourceId } });
                    } else if (resource.ResourceShowType === 3) {
                        // 练习卷
                        store.commit(MutationTypes.SET_IS_SHOW_QUESTION, { flag: true, info: {
                            id: resource.OldResourceId,
                            courseBagId: "",
                            deleteQuestionIds: [],
                            type: 1
                        } });
                    } else if (resource.ResourceShowType === 1) {
						store.commit(MutationTypes.SET_IS_WINCARD, { flag: true, id: resource.OldResourceId });
					}
					
					logView({ id: resource.ResourceId });
                    break;
                case "switchClass":
                    switchClass();
                    break;
            }
        }

        onMounted(() => {
            getResourceType();
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
            isSwitch.value = !isSwitch.value;
            window.electron.ipcRenderer.send("attendClass", "unfoldSuspension", { type: "switchClass", switch: isSwitch.value });
            sendResourceData();

            if (!isSwitch.value) {
                source.value = "";
            } else {
                // 获取我的备课包
                source.value = "me";
            }
        };

        const updateResourceList = (data: IResourceItem[]) => {
            resourceList.value = data;
            sendResourceData();
        };

        return {
            resourceList,
            type,
            typeList,
            isSwitch,
            switchClass,
            course,
            source,
            updateResourceList
        }
    }
});
</script>

<style lang="scss" scoped>
.resource-content {
    flex: 1;
    min-height: 0;
    padding: 15px 0;
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
    margin: 0 0 -15px;
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
