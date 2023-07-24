<template>
    <div class="c-header">
        <div class="tab-list">
            <div
                class="tab-item"
                v-for="(item, index) in breadList"
                :key="index"
                :class="item.name === $route.name && 'active'"
                @click="go(item)"
            >
                <div style="margin-right: 10px">{{ item.name }}</div>
                <el-icon
                    v-if="item.name !== '首页' && item.name !== '备课'"
                    @click.stop="closeTab(item)"
                >
                    <Close />
                </el-icon>
            </div>
        </div>
        <div class="header-right">
            <div
                class="download-status"
                v-if="downloadNum > 0"
                :num="downloadNum"
                @click="downloadVisible = true"
            >
                <img src="@/assets/images/other/icon_download_top.png" alt="" />
            </div>
            <div class="class-set">
                <div v-if="currentSelectClass">
                    <el-select
                        style="width: 140px"
                        v-model="currentSelectClass"
                        @change="handleClassChange"
                    >
                        <el-option
                            v-for="item in classList"
                            :label="item.ClassName"
                            :value="item.ClassAixueshiId"
                            :key="item.ClassAixueshiId"
                        >
                        </el-option>
                    </el-select>
                </div>
                <span v-else>暂无班级信息</span>
            </div>
            <div class="help-warp" @click="openHelp">
                <img src="./img/icon_help.svg" class="help-icon" />
                <span>帮助中心</span>
            </div>
            <UserInfo @download="download" />
            <span class="line"></span>
            <div class="header-window-control">
                <div class="hwc-minimize" @click="useMinimizeWindow()"></div>
                <div class="hwc-maximize" @click="useMaximizeWindow()"></div>
                <div class="hwc-close" v-if="isElectron()" @click="close">
                    <el-icon>
                        <CloseBold />
                    </el-icon>
                </div>
            </div>
        </div>
        <ExitDialog v-model:visible="visible" />

        <DownloadDialog v-model:visible="downloadVisible" />
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    ref,
    onMounted,
    computed,
    watch
} from "vue";
import { CloseBold, Close } from "@element-plus/icons-vue";
import useMaximizeWindow from "../../hooks/useMaximizeWindow";
import useMinimizeWindow from "../../hooks/useMinimizeWindow";
import isElectron from "is-electron";
import { useRoute, useRouter } from "vue-router";
import useBreadList from "./hooks/useBreadList";
import { Bread } from "./interface";
import ExitDialog from "./ExitDialog.vue";
import SelectAttendClass from "./selectAttendClass.vue";
import UserInfo from "./userInfo.vue";
import { set, STORAGE_TYPES } from "@/utils/storage";
import { store } from "@/store";
import { getMyClassByOrgId } from "@/api/home";
import DownloadDialog from "./DownloadDialog.vue";

export default defineComponent({
    name: "NavBar",
    components: {
        ExitDialog,
        UserInfo,
        CloseBold,
        Close,
        SelectAttendClass,
        DownloadDialog
    },
    setup() {
        const classList: any = ref([]);
        //当前选择的班级
        const currentSelectClass = ref("");
        const route = useRoute();
        const router = useRouter();
        const { breadList, closeTab } = useBreadList();
        const visible = ref(false);
        const classVisible = ref(false);
        const go = (item: Bread) => {
            if (route.name !== item.name) {
                router.push(item.path);
            }
        };

        const downloadNum = computed(
            () => store.state.common.downloading.length
        );
        const downloadVisible = ref(false);
        const download = () => {
            downloadVisible.value = true;
        };

        const openHelp = () => {
            const helpUrl = "https://doc.lyx-edu.com/project-4/";
            if (isElectron()) {
                window.electron.shell.openExternal(helpUrl);
            } else {
                window.open(helpUrl);
            }
        };

        const close = () => {
            visible.value = true;
        };

        onMounted(() => {
            if (isElectron()) {
                window.electron.ipcRenderer.on("exitApp", () => {
                    visible.value = true;
                });
                window.electron.ipcRenderer.on("updateSelectClass", (e, v) => {
                    const data = JSON.parse(v);
                    currentSelectClass.value = data.ClassAixueshiId;
                    store.state.userInfo.currentSelectClass = data;
                    set(STORAGE_TYPES.CURRENT_SELECT_CLASS, data);
                });
            }
        });
        // 当前用户信息
        const currentUserInfo = computed(() => store.state.userInfo.schoolId);
        watch(
            () => currentUserInfo.value,
            (val: any) => {
                if (val) {
                    _getTeacherClassList();
                }
            },
            { deep: true }
        );
        watch(
            () => store.state.userInfo.currentSelectClass,
            (val: any) => {
                currentSelectClass.value = val.ClassAixueshiId || "";
            },
            { deep: true }
        );
        //查询统一班级的接口
        const _getTeacherClassList = () => {
            getMyClassByOrgId().then(async (res) => {
                if (res.resultCode === 200) {
                    classList.value = res.result;
                    currentSelectClass.value = classList.value.length
                        ? classList.value[0].ClassAixueshiId
                        : "";
                    const currentClass = classList.value.length
                        ? classList.value[0]
                        : null;
                    store.state.userInfo.classList = classList.value;
                    set(STORAGE_TYPES.CLASS_LIST, classList.value);
                    store.state.userInfo.currentSelectClass = currentClass;
                    set(STORAGE_TYPES.CURRENT_SELECT_CLASS, currentClass);
                }
            });
        };
        //统一切换班级
        const handleClassChange = (val: string) => {
            const classData = classList.value.find(
                (item: any) => item.ClassAixueshiId === val
            );
            set(STORAGE_TYPES.CURRENT_SELECT_CLASS, classData);
            store.state.userInfo.currentSelectClass = classData;
        };
        return {
            downloadNum,
            download,
            downloadVisible,
            isElectron,
            breadList,
            go,
            closeTab,
            close,
            visible,
            classVisible,
            useMinimizeWindow,
            openHelp,
            useMaximizeWindow,
            classList,
            currentSelectClass,
            _getTeacherClassList,
            handleClassChange,
        };
    },
});
</script>

<style lang="scss" scoped>
.c-header {
    height: 48px;
    background-color: var(--app-color-dark);
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
    -webkit-app-region: drag;
    overflow: hidden;

    .tab-list {
        display: flex;
        align-items: flex-end;
        overflow-x: overlay;
        -webkit-app-region: no-drag;
    }

    .header-right {
        display: flex;
        flex-shrink: 0;
        align-items: center;

        .download-status {
            margin-right: 20px;
            cursor: pointer;
            position: relative;
            &:after {
                content: attr(num);
                display: block;
                width: 16px;
                height: 16px;
                border-radius: 8px;
                background-color: #ff6b6b;
                color: #fff;
                font-size: 12px;
                position: absolute;
                right: -8px;
                top: -8px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }

        :deep(.class-set) {
            //cursor: pointer;
            //height: 30px;
            //border-radius: 4px;
            //border: 1px solid rgba(224, 226, 231, 0.2);
            //display: flex;
            //align-items: center;
            //justify-content: space-between;
            //padding: 0 10px;
            margin-right: 40px;
            -webkit-app-region: no-drag;

            //.text {
            //    font-size: 14px;
            //    font-family: PingFangSC-Regular, PingFang SC;
            //    font-weight: 400;
            //    color: #FFFFFF;
            //    padding-right: 14px;
            //}
            //
            //&:hover {
            //    border-color: #409eff;
            //}
            .el-select {
                .el-input {
                    .el-input__wrapper {
                        background: transparent;
                        box-shadow: 0 0 0 1px rgba(224, 226, 231, 0.2) inset;

                        .el-input__inner {
                            color: #fff;
                        }

                        .el-input__suffix {
                            .el-icon {
                                color: #fff;
                            }
                        }
                    }
                }
            }
        }

        .help-warp {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #ffffff;
            margin-right: 40px;
            cursor: pointer;
            -webkit-app-region: no-drag;

            .help-icon {
                margin-right: 6px;
            }
        }

        .line {
            align-self: center;
            width: 1px;
            background-color: rgba(216, 216, 216, 0.2);
            height: 24px;
            margin: 0 32px;
        }
    }
}

.tab-item {
    display: flex;
    margin-right: 10px;
    padding: 0 20px;
    background-color: #313451;
    color: #aeb1bb;
    font-size: 14px;
    align-items: center;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    min-width: 140px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    position: relative;
    -webkit-app-region: no-drag;
}

.tab-item i {
    font-size: 18px;
}

.tab-item.active {
    background-color: #ffffff;
    color: #202124;
}

.header-window-control {
    display: flex;
    align-items: center;
    -webkit-app-region: no-drag;
}

.hwc-minimize,
.hwc-maximize,
.hwc-close {
    height: 24px;
    margin-right: 20px;
    display: flex;
    align-items: center;
    cursor: pointer;
}

.hwc-close {
    margin-right: 0;
}

.hwc-minimize:before {
    content: "";
    display: block;
    width: 14px;
    border-radius: 3px;
    border: 1px solid #8c8f9f;
}

.hwc-maximize:before {
    content: "";
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 3px;
    border: 2px solid #8c8f9f;
}

.hwc-close i {
    font-size: 20px;
    color: #8c8f9f;
    font-weight: 600;
}

.avatar-wrapper span {
    font-size: 18px;
    text-align: center;
}
</style>
