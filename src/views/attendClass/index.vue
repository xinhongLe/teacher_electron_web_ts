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
            <Resources
                ref="resourceRef"
                name="attendClass"
                @updateResourceList="updateResourceList"
                :course="course"
                :source="source"
                :type="type"
                :bookId="bookId"
            />
        </div>
        <div class="resource-filter">
            <el-radio-group
                class="custom-radio-two"
                v-model="type"
            >
                <el-radio-button
                    v-for="item in typeList"
                    :key="item.Id"
                    :label="item.Id"
                >
                    {{ item.Name }}
                </el-radio-button>
            </el-radio-group>

            <!-- <el-button
                class="switch-btn"
                type="default"
                @click="switchClass()"
            >
                <img
                    src="@/assets/images/preparation/icon_qiehuan.png"
                    alt=""
                />
                {{ isSwitch ? "全部显示" : "仅显示备课包" }}
            </el-button> -->
        </div>
    </div>
</template>

<script lang="ts">
import { fetchResourceType, IResourceItem, logView } from "@/api/resource";
import { MutationTypes, useStore } from "@/store";
import { IpcRendererEvent } from "electron";
import isElectron from "is-electron";
import {
    defineComponent,
    onActivated,
    onMounted,
    ref,
    onUnmounted,
    provide,
    nextTick
} from "vue";
import { useRoute } from "vue-router";
import Resources from "../preparation/layout/resources.vue";

export default defineComponent({
    components: { Resources },
    setup() {
        const resourceList = ref<IResourceItem[]>([]);
        const route = useRoute();
        const store = useStore();
        const resourcesRef = ref();
        const course = ref({
            chapterId: "",
            lessonId: ""
        });

        const source = ref("me");
        const type = ref("");
        const bookId = ref("");
        const typeList = ref<{ Id: string; Name: string }[]>([]);

        const resourceRef = ref();

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

        const isSwitch = ref(true);
        const sendResourceData = () => {
            if (isElectron()) {
                window.electron.ipcRenderer.send(
                    "attendClass",
                    "unfoldSuspension",
                    {
                        type: "sysData",
                        resources: JSON.stringify(resourceList.value),
                    }
                );
            }
        };

        onActivated(() => {
            // if (
            //     route.params.lessonId !== course.value.lessonId ||
            //     route.params.chapterId !== course.value.chapterId ||
            //     route.params.bookId !== bookId.value
            // ) {
            //     isSwitch.value = true;
            //     type.value = "";
            // }

            // course.value = {
            //     lessonId: route.params.lessonId as string,
            //     chapterId: route.params.chapterId as string
            // };
            // bookId.value = route.params.bookId as string;
            // sendResourceData();
            setTimeout(() => {
                source.value = "me";
                const bagIds = JSON.parse(route.params.bagIds as string);
                console.log('resourcesRef',resourcesRef.value);
                bagIds && resourcesRef.value && resourcesRef.value.getResources(bagIds, true)
            }, 200);
        });
        const onWatchAttendClass = (e: IpcRendererEvent, event: any) => {
            switch (event.type) {
                case "sysData":
                    window.electron.ipcRenderer.send(
                        "attendClass",
                        "unfoldSuspension",
                        { type: "switchClass", switch: isSwitch.value }
                    );
                    sendResourceData();
                    break;
                case "openResource":
                    const resource: IResourceItem = JSON.parse(event.resource);
                    if (resource.ResourceShowType === 2) {
                        // 断点视频
                        store.commit(MutationTypes.SET_FULLSCREEN_RESOURCE, {
                            component: "LookVideo",
                            resource: { id: resource.OldResourceId, openMore: true }
                        });
                    } else if (resource.ResourceShowType === 3) {
                        // 练习卷
                        store.commit(MutationTypes.SET_FULLSCREEN_RESOURCE, {
                            component: "LookQuestion",
                            resource: {
                                id: resource.OldResourceId,
                                courseBagId: "",
                                deleteQuestionIds: [],
                                type: 1,
                                openMore: true
                            }
                        });
                    } else if (resource.ResourceShowType === 1) {
                        store.commit(MutationTypes.SET_FULLSCREEN_RESOURCE, {
                            component: "Wincard",
                            resource: {
                                id: resource.OldResourceId,
                                isSystem: resource.IsSysFile === 1,
                                openMore: true
                            }
                        });
                    } else if (resource.ResourceShowType === 0 || resource.ResourceShowType === 4) {
                        store.commit(MutationTypes.SET_FULLSCREEN_RESOURCE, {
                            component: "ScreenViewFile",
                            resource: { ...resource, id: resource.OldResourceId, openMore: true }
                        });
                    } else if (resource.ResourceShowType === 5) {
                        store.commit(
                            MutationTypes.SET_FULLSCREEN_RESOURCE,
                            {
                                component: "AnswerMachine",
                                resource: {
                                    ...resource,
                                    lessonId: course.value.lessonId,
                                    id: new Date().getTime(),
                                    openMore: true
                                }
                            }
                        );
                    }
                    logView({ id: resource.ResourceId });
                    break;
                case "switchClass":
                    switchClass();
                    break;
            }
        };

        onMounted(() => {
            getResourceType();
            if (isElectron()) {
                window.electron.ipcRenderer.on(
                    "attendClass",
                    onWatchAttendClass
                );
            }
        });

        onUnmounted(() => {
            if (isElectron()) {
                window.electron.ipcRenderer.off(
                    "attendClass",
                    onWatchAttendClass
                );
            }
        });

        const switchClass = () => {
            isSwitch.value = !isSwitch.value;
            window.electron.ipcRenderer.send(
                "attendClass",
                "unfoldSuspension",
                { type: "switchClass", switch: isSwitch.value }
            );
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
            bookId,
            updateResourceList,
            resourceRef
        };
    }
});
</script>

<style lang="scss" scoped>
.resource-content {
    flex: 1;
    min-height: 0;
    padding: 15px 0;
    height: 100%;
    background-color: #f5f6fa;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.resource-list {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
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
        background: #f0f4ff;
        min-width: 80px;
        color: #4b71ee;
    }
    :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
        color: #fff;
        box-shadow: none;
        background: #4b71ee;
    }
    :deep(.el-radio-button--small .el-radio-button__inner) {
        font-size: 14px;
    }
    :deep(.el-radio-button:focus:not(.is-focus):not(:active):not(.is-disabled)) {
        box-shadow: none;
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
