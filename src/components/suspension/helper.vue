<template>
    <div class="helper-container">
        <div class="header">
            <span
                class="exit"
                v-if="isElectron"
                @click="clicKBuryPoint('退出程序'), exitApp()"
                >退出程序</span
            >
            <img
                src="@/assets/images/suspension/pic_tittle_zhike@2x.png"
                alt=""
            />
            <div class="right-btns">
                <el-icon
                    :size="18"
                    class="refresh"
                    @click="clicKBuryPoint('刷新'), getGradeList()"
                    ><RefreshRight
                /></el-icon>
                <div
                    class="right-btn"
                    @click="clicKBuryPoint('最小化'), close()"
                >
                    <svg
                        t="1623303211083"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="2457"
                        width="200"
                        height="200"
                    >
                        <path
                            d="M128 448h768v128H128z"
                            p-id="2458"
                            fill="#ffffff"
                        ></path>
                    </svg>
                </div>
            </div>
        </div>
        <div class="container">
            <el-collapse
                class="collapse-custom"
                v-model="activeModes"
                @change="handleChange"
            >
                <el-collapse-item
                    name="0"
                    v-if="resourceList.length > 0"
                    @click="currentClickCol('0', '上课')"
                >
                    <template #title>
                        <div class="collapse-header">
                            <div class="collapse-title">
                                <img src="@/assets/images/suspension/icon_sk.png" alt=""/>
                                上课
                            </div>
                            <div
                                class="attend-class-view"
                                @click.stop="switchClass(),clicKBuryPoint(isSwitch
                                                ? '全部显示' : '仅显示备课篮')">
                                <img src="@/assets/images/preparation/icon_qiehuan_1.png" alt=""/>
                                {{ isSwitch ? "全部显示" : "仅显示备课包" }}
                            </div>
                        </div>
                    </template>
                    <div class="resource-list">
                        <div
                            class="resource-item"
                            :class="{ courseware: resource.UserId === userId }"
                            v-for="(resource, index) in resourceList"
                            :key="index"
                            @click.stop="classClicKBuryPoint(resource),openResource(resource)"
                        >
                            <div class="resource-left-title">
                                <img :src="iconResources.selfStudy[resource.ResourceType]" alt=""/>
                                <span>{{ resource.Name }}</span>
                                <span class="tool-text">
                                    {{resource.ToolInfo ? `共${ resource.ToolInfo.QuestionCount }题 ( ${ resource.ToolInfo.QuestionTypeName })` : ""}}
                                </span>
                            </div>
                            <div
                                class="resource-type"
                                :class="typeResources[resource.ResourceType] < 9 &&'p-r-' + typeResources[resource.ResourceType]">
                                {{ textResources[resource.ResourceType] }}
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item
                    name="1"
                    @click="currentClickCol('1', '工具')"
                >
                    <template #title>
                        <div class="collapse-header">
                            <div class="collapse-title">
                                <img
                                    src="@/assets/images/suspension/icon_gj.png"
                                    alt=""
                                />
                                工具
                            </div>
                        </div>
                    </template>
                    <div class="tool-list">
                        <div
                            class="blackboard-box"
                            @click.stop="
                                clicKBuryPoint('黑板'), openBlackboard()
                            "
                        >
                            <img
                                src="@/assets/images/suspension/pic_blackboard@2x.png"
                                alt=""
                            />
                            <div class="blackboard-text">黑板</div>
                            <!-- <div class="blackboard-btn" @click="openBlackboard()">打开</div> -->
                        </div>
                         <div
                            class="blackboard-box"
                            @click.stop="
                                clicKBuryPoint('答题器'),
                                    openAnswerMachineWindow()
                            "
                        >
                            <img
                                src="@/assets/images/suspension/img_datiqi.png"
                                alt=""
                            />
                            <div class="blackboard-text">答题器</div>
                        </div>
                        <div
                            class="blackboard-box"
                            @click.stop="
                                clicKBuryPoint('投影'), clickProjection()
                            "
                        >
                            <img src="@/assets/images/suspension/pic_touying@2x.png" alt=""/>
                            <div class="blackboard-text">投影</div>
                        </div>
                        <div
                            class="blackboard-box"
                            @click.stop="
                                clicKBuryPoint('知识图谱'), clickKnowledge()
                            "
                        >
                            <img src="@/assets/images/suspension/pic_zhishitupu@2x.png" alt=""/>
                            <div class="blackboard-text">知识图谱</div>
                        </div>
                        <div
                            class="blackboard-box"
                            @click.stop="clicKBuryPoint('计时器'), openTimer()"
                        >
                            <img src="@/assets/images/suspension/pic_timer@2x.png" alt=""/>
                            <div class="blackboard-text">计时器</div>
                        </div>
                        <!-- openRollCall -->
                        <div
                            class="blackboard-box"
                            @click.stop="clicKBuryPoint('点名'), openRollCall()"
                        >
                            <img
                                src="@/assets/images/suspension/pic_namer@2x.png"
                                alt=""
                            />
                            <div class="blackboard-text">点名</div>
                        </div>
                         <div
                            class="blackboard-box"
                            @click.stop="
                                clicKBuryPoint('抢答'), openQuickAnswer(true)
                            "
                        >
                            <img
                                src="@/assets/images/suspension/pic_qd.png"
                                alt=""
                            />
                            <div class="blackboard-text">抢答</div>
                        </div>
                        <div
                            class="blackboard-box"
                            @click.stop="
                                clicKBuryPoint('锁屏管理'),
                                    openQuickAnswer(false)
                            "
                        >
                            <img
                                src="@/assets/images/suspension/pic_sp.png"
                                alt=""
                            />
                            <div class="blackboard-text">锁屏管理</div>
                        </div>
                        <div
                            class="blackboard-box"
                            @click.stop="
                                clicKBuryPoint('随手画'), openPainting()
                            "
                        >
                            <img
                                src="@/assets/images/suspension/pic_suishouhua.png"
                                alt=""
                            />
                            <div class="blackboard-text">随手画</div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item
                    name="2"
                    @click="currentClickCol('2', '教学助手')"
                >
                    <template #title>
                        <div class="collapse-header">
                            <div class="collapse-title">
                                <img
                                    src="@/assets/images/suspension/icon_jj.png"
                                    alt=""
                                />
                                教学助手
                            </div>
                            <div class="teach-list-title">
                                <div @click.stop="() => null">
                                    <el-cascader
                                        v-model="selectBookList"
                                        :props="cascaderProps"
                                        :options="subjectPublisherBookList"
                                    />
                                </div>
                                <div class="search-input">
                                    <el-input
                                        placeholder="搜索教具名称"
                                        v-model="searchName"
                                        @click.stop="() => null"
                                        @keyup.space.enter.stop="() => null"
                                        @keydown.enter="getGradeList"
                                    >
                                        <template #append>
                                            <el-button
                                                :icon="Search"
                                                @click.stop="getGradeList"
                                            ></el-button>
                                        </template>
                                    </el-input>
                                </div>
                            </div>
                        </div>
                    </template>
                    <div class="teach-list">
                        <div class="teach-class" v-show="!isLoading">
                            <div
                                class="list-empty"
                                v-if="gameList.length === 0"
                            >
                                <img
                                    src="@/assets/images/suspension/empty_tool.png"
                                />
                                <span
                                    >本书册下暂无教具，可切换为“全部”查看更多教具内容</span
                                >
                            </div>
                            <div v-else class="teach-content-warp">
                                <div
                                    class="teach-content"
                                    v-for="(item, index) in gameList"
                                    :key="index"
                                    @click.stop="
                                        clicKBuryPoint(item),
                                            openUrl(item.url, item.name)
                                    "
                                >
                                    <div class="img-warp">
                                        <img :src="item.imgUrl" />
                                    </div>
                                    <p>{{ item.name }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>
<script lang="ts">
import {
    defineComponent,
    onMounted,
    onUnmounted,
    PropType,
    ref,
    watch
} from "vue";
import { Game } from "./interface";
import { getToolList } from "@/api/index";
import { getOssUrl } from "@/utils/oss";
import isElectron from "is-electron";
import { ElMessage } from "element-plus";
import { BookList } from "@/types/preparation";
import { get, STORAGE_TYPES, storeChange } from "@/utils/storage";
import { fetchAllStudents } from "@/views/labelManage/api";
import { IpcRendererEvent } from "electron";
import { iconResources, textResources, typeResources } from "@/config/resource";
import usePageEvent from "@/hooks/usePageEvent";
import { EVENT_TYPE } from "@/config/event";
import { IYunInfo } from "@/types/login";
import { UserInfoState } from "@/types/store";
import { Search, RefreshRight } from "@element-plus/icons-vue";
export default defineComponent({
    components: { RefreshRight },
    setup(props, { emit }) {
        const { createBuryingPointFn } = usePageEvent("智课助手");
        const gameList = ref<Game[]>([]);
        const initBookList = [
            {
                Lable: "全部教具",
                Value: "全部教具"
            }
        ];
        const subjectPublisherBookList = ref<BookList[]>(initBookList);
        const cascaderProps = {
            value: "Value",
            children: "Children",
            label: "Lable",
            checkStrictly: true
        };
        const searchName = ref("");
        const selectBookList = ref(["全部教具"]);
        const isLoading = ref(false);
        const allStudentList = ref<unknown[]>([]);
        let userInfo = get(STORAGE_TYPES.USER_INFO);
        const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
        const currentUserInfo: UserInfoState = get(
            STORAGE_TYPES.CURRENT_USER_INFO
        );
        console.log(currentUserInfo, "currentUserInfo-----");
        const userId = ref(userInfo.userCenterUserID);
        const openBlackboard = () => {
            if (isElectron()) {
                return window.electron.ipcRenderer.invoke("openBlackboard");
            }
            window.open("/blackboard/");
        };
        const openTimer = () => {
            if (isElectron()) {
                return window.electron.ipcRenderer.invoke("openTimerWin");
            }
            emit("close-helper");
        };
        const getGradeList = async () => {
            isLoading.value = true;
            if (activeModes.value.indexOf("2") === -1) {
                activeModes.value = activeModes.value.concat("2");
            }
            const data = {
                name: searchName.value,
                bookID: "",
                bookIDs: [] as string[]
            };
            if (selectBookList.value.length === 1) {
                data.bookIDs =
                    subjectPublisherBookList.value
                        .find((item) => item.Value === selectBookList.value[0])
                        ?.Children?.flatMap((x) => x.Children || { Value: "" })
                        .map((x) => x?.Value || "") || [];
            } else if (selectBookList.value.length === 2) {
                data.bookIDs =
                    subjectPublisherBookList.value
                        .find((item) => item.Value === selectBookList.value[0])
                        ?.Children?.find(
                            (item) => item.Value === selectBookList.value[1]
                        )
                        ?.Children?.map((x) => x?.Value || "") || [];
            } else {
                data.bookID = selectBookList.value[2];
            }
            const res = await getToolList(data);
            if (res.resultCode === 200) {
                const list = res.result.filter(({ Url }) => Url);
                const imgListPromise = list.map((item) => {
                    const { File } = item;
                    const { FileName, Bucket, FilePath, Extention } = File;
                    const key = `${FilePath}/${FileName}.${Extention}`;
                    return getOssUrl(key, Bucket);
                });
                const imgList = await Promise.all(imgListPromise);
                gameList.value = list.map((item, index) => ({
                    url: item.Url,
                    imgUrl: imgList[index],
                    name: item.Name
                }));
            }
            isLoading.value = false;
        };
        const openUrl = (url: string, name: string) => {
            if (isElectron()) {
                url = url.startsWith("http") ? url : `https://${url}`;
                return window.electron.ipcRenderer.invoke(
                    "openSubjectTool",
                    url,
                    name
                );
            }
            window.open(url);
        };
        const clickKnowledge = () => {
            openUrl("https://knowledge.aixueshi.top/", "知识图谱");
        };
        const openRollCall = () => {
            if (!isGetStudentList.value) {
                return ElMessage.error("请等待学员加载后点名！");
            }
            if (allStudentList.value.length === 0) {
                return ElMessage.error("学生数量为0！");
            }
            if (isElectron()) {
                return window.electron.ipcRenderer.invoke(
                    "openRollCall",
                    JSON.parse(JSON.stringify(allStudentList.value))
                );
            }
        };
        const openAnswerMachineWindow = () => {
            if (!isGetStudentList.value) {
                return ElMessage.error("请等待学员加载后答题！");
            }
            if (allStudentList.value.length === 0) {
                return ElMessage.error("学生数量为0！");
            }
            if (isElectron()) {
                return window.electron.ipcRenderer.invoke(
                    "openAnswerMachineWindow",
                    JSON.parse(JSON.stringify(allStudentList.value))
                );
            }
        };

        const openQuickAnswer = (isAnswer: boolean) => {
            if (!isGetStudentList.value) {
                return ElMessage.error("请等待学员加载后答题！");
            }
            if (allStudentList.value.length === 0) {
                return ElMessage.error("学生数量为0！");
            }
            if (isElectron()) {
                return window.electron.ipcRenderer.invoke(
                    "openQuickAnswerWindow",
                    JSON.parse(JSON.stringify(allStudentList.value)),
                    isAnswer
                );
            }
        };
        // 工具-随手画
        const openPainting = () => {
            window.electron.getWhiteBoard();
        };

        const close = () => {
            if (isElectron()) {
                window.electron.ipcRenderer.invoke("hideUnfoldSuspensionWin");
            } else {
                emit("close-helper");
            }
        };
        const clickProjection = () => {
            if (isElectron()) {
                window.electron.ipcRenderer.invoke("openProjectionWindow");
            }
        };
        const uncultivated = () => {
            ElMessage({ type: "warning", message: "功能暂未开发" });
        };
        const exitApp = () => {
            window.electron.ipcRenderer.invoke("exitApp");
        };
        const getBookList = async () => {
            const data = await window.electron.ipcRenderer.invoke(
                "fetchSubjectPublisherBookList"
            );
            subjectPublisherBookList.value = [...initBookList, ...data];
            getGradeList();
        };
        const isGetStudentList = ref(false);
        const getStudentList = async () => {
            allStudentList.value = [];
            const data = {
                TeacherId: currentUserInfo.userCenterUserID,
                OrgId: currentUserInfo.schoolId
            };
            const res = await fetchAllStudents(data);
            if (res.resultCode === 200) {
                isGetStudentList.value = true;
                allStudentList.value = res.result;
            }
        };

        const resourceList = ref([]);
        const onResources = (event: IpcRendererEvent, data: any) => {
            if (data.type === "sysData") {
                resourceList.value = JSON.parse(data.resources || "[]");
                console.log(resourceList.value, "resourceList.value---");
            }
            if (data.type === "switchClass") isSwitch.value = data.switch;
        };
        // collapse 改变事件
        const handleChange = (data: []) => {
            // console.log(data);
        };
        // 智课助手界面里面-工具、按钮、最小化、退出、教具等的 点击埋点事件
        const clicKBuryPoint = (item: any) => {
            createBuryingPointFn(
                EVENT_TYPE.PageClick,
                item.name || item,
                item.name || item
            );
        };
        // 智课助手界面上课模块资源点击 埋点事件
        const classClicKBuryPoint = (resource: any) => {
            // console.log(resource);
            const data = Object.assign({}, resource);
            // 先赋值给第1项---
            data.TextBooks = data.TextBooks[0];
            // console.log(data);
            createBuryingPointFn(
                EVENT_TYPE.PageClick,
                `上课-${resource.Name}`,
                resource.Name,
                data
            );
        };
        // 当前点击是哪个展开/收起项
        const currentClickCol = (item: string, name: string) => {
            const awayOrExpend = activeModes.value.includes(item)
                ? "展开"
                : "收起"; // 点击的项是否在已展开的数组里
            createBuryingPointFn(
                EVENT_TYPE.PageClick,
                `${awayOrExpend}${name}`,
                name
            );
        };

        onMounted(async () => {
            getBookList();
            if (userInfo) {
                getStudentList();
            }
            if (isElectron()) {
                storeChange(STORAGE_TYPES.USER_INFO, (value) => {
                    if (value) {
                        userInfo = get(STORAGE_TYPES.USER_INFO);
                        userId.value = userInfo.userCenterUserID;
                        getBookList();
                        getStudentList();
                    }
                });

                window.electron.ipcRenderer.send("attendClass", "main", {
                    type: "sysData"
                });

                window.electron.ipcRenderer.on("attendClass", onResources);
            }
        });

        onUnmounted(() => {
            window.electron.ipcRenderer.off("attendClass", onResources);
        });

        const activeModes = ref(["0", "1", "2"]);
        const isSwitch = ref(false);

        const openResource = (resource: any) => {
            window.electron.ipcRenderer.send("attendClass", "main", {
                type: "openResource",
                resource: JSON.stringify(resource)
            });
        };

        const switchClass = () => {
            window.electron.ipcRenderer.send("attendClass", "main", {
                type: "switchClass"
            });
        };

        watch(selectBookList, getGradeList);
        return {
            Search,
            openBlackboard,
            openTimer,
            getGradeList,
            openUrl,
            cascaderProps,
            subjectPublisherBookList,
            close,
            selectBookList,
            isElectron: isElectron(),
            gameList,
            exitApp,
            clickKnowledge,
            openAnswerMachineWindow,
            openQuickAnswer,
            clickProjection,
            searchName,
            uncultivated,
            isLoading,
            openRollCall,
            resourceList,
            activeModes,
            iconResources,
            textResources,
            openResource,
            isSwitch,
            switchClass,
            typeResources,
            userId,
            clicKBuryPoint,
            classClicKBuryPoint,
            handleChange,
            currentClickCol,
            openPainting
        };
    }
});
</script>

<style lang="scss" scoped>
.helper-container {
    position: fixed;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    background: var(--app-color-dark);

    .header {
        height: 55px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        box-sizing: border-box;
        padding: 0 15px;
        -webkit-app-region: drag;

        .exit {
            color: #fff;
            font-size: 16px;
            -webkit-app-region: no-drag;
        }

        img {
            width: 150px;
            display: block;
        }

        .right-btns {
            display: flex;
            align-items: center;
            -webkit-app-region: no-drag;

            .refresh {
                color: #ffffff;
                margin-right: 20px;
                cursor: pointer;
                svg {
                    width: 24px;
                    height: 24px;
                }
            }

            .right-btn {
                width: 25px;
                height: 25px;

                svg {
                    width: 25px;
                    height: 25px;
                    cursor: pointer;
                }
            }
        }
    }

    .container {
        flex: 1;
        display: flex;
        padding: 0 15px 15px;
        overflow-y: overlay;
        flex-direction: column;

        .tool-list {
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            color: #fff;
            margin: 10px 0 10px 0;
        }

        .blackboard-box {
            padding: 10px;
            background-color: rgba(255, 255, 255, 0.12);
            border-radius: 8px;
            margin-right: 8px;
            margin-bottom: 10px;
            text-align: center;
            cursor: pointer;
        }

        .blackboard-box img {
            width: 100px;
            height: auto;
        }

        .blackboard-text {
            color: #ffffff;
            font-size: 16px;
            margin-top: 10px;
        }

        .blackboard-btn {
            padding: 6px 30px;
            border-radius: 3px;
            border: 1px solid #aaaaaa;
            color: #ffffff;
            cursor: pointer;
            font-size: 16px;
        }

        .blackboard-btn:hover {
            border-color: #aaaaaa;
            color: #aaaaaa;
        }

        .teach-list {
            flex: 1;
            display: flex;
            flex-direction: column;

            .teach-class {
                flex: 1;
                display: flex;
                justify-content: flex-start;
                flex-wrap: wrap;
                color: #fff;
                overflow-y: auto;
                margin: 10px 0;

                .teach-content-warp {
                    padding: 0 5px;
                    display: flex;
                    justify-content: flex-start;
                    flex-wrap: wrap;
                    width: 100%;
                }

                .list-empty {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    color: #bec3d6;
                    font-size: 16px;
                    background: #0c1222;
                    flex-direction: column;
                    padding: 30px 0;
                }

                &::-webkit-scrollbar {
                    display: none;
                }

                .teach-content {
                    margin-bottom: 10px;
                    text-align: center;
                    cursor: pointer;
                    width: 21%;
                    margin-right: 20px;

                    .img-warp {
                        height: 108px;
                        background: #d1eaff;
                        display: flex;
                        justify-content: center;
                        border-radius: 4px;

                        img {
                            object-fit: contain;
                            width: 100%;
                        }
                    }

                    p {
                        margin: 10px 0;
                    }
                }
            }
        }
    }
}

.collapse-custom {
    --el-collapse-header-background-color: transparent;
    --el-collapse-border-color: transparent;
    --el-collapse-content-background-color: transparent;
    --el-collapse-header-font-color: #ffffff;

    :deep(.el-collapse-item__header) {
        background: var(--app-color-dark);
    }
    :deep(.el-collapse-item__wrap) {
        background: var(--app-color-dark);
    }

    .collapse-header {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .collapse-title {
            display: flex;
            align-items: center;
            font-size: 18px;
            color: #fff;
            font-weight: 600;

            img {
                display: block;
                margin-right: 3px;
            }
        }
    }

    .attend-class-view {
        display: flex;
        align-items: center;
        color: #bec3d6;
        cursor: pointer;
        margin-right: 15px;

        img {
            display: block;
            margin-right: 3px;
        }
    }

    .resource-list {
        .resource-item {
            &.courseware {
                background: #243260;
                border-left: 2px solid #4b71ee;
            }

            display: flex;
            align-items: center;
            justify-content: space-between;
            border-radius: 4px;
            background-color: rgba(255, 255, 255, 0.14);
            padding: 8px 5px 8px 10px;
            margin-bottom: 8px;
            cursor: pointer;

            .resource-left-title {
                display: flex;
                align-items: center;
                font-size: 16px;
                color: #fff;

                img {
                    width: 30px;
                    display: block;
                    margin-right: 5px;
                }
                .tool-text{
                    margin-left: 6px;
                    font-size: 12px;
                }
            }

            .resource-type {
                display: flex;
                align-items: center;
                border-radius: 4px;
                padding: 1px 10px;
                color: var(--app-resource-type-qita);
                border: 1px solid var(--app-resource-type-qita);
                font-size: 12px;
                margin: 0 10px 0 10px;
                white-space: nowrap;
                &.p-r-0 {
                    color: var(--app-resource-type-jiaoan);
                    border: 1px solid var(--app-resource-type-jiaoan);
                }

                &.p-r-1 {
                    color: var(--app-resource-type-daoxuean);
                    border: 1px solid var(--app-resource-type-daoxuean);
                }

                &.p-r-2 {
                    color: var(--app-resource-type-kejian);
                    border: 1px solid var(--app-resource-type-kejian);
                }

                &.p-r-3 {
                    color: var(--app-resource-type-weikeshipin);
                    border: 1px solid var(--app-resource-type-weikeshipin);
                }

                &.p-r-4 {
                    color: var(--app-resource-type-zuoye);
                    border: 1px solid var(--app-resource-type-zuoye);
                }

                &.p-r-5 {
                    color: var(--app-resource-type-dianzikeben);
                    border: 1px solid var(--app-resource-type-dianzikeben);
                }

                &.p-r-6 {
                    color: var(--app-resource-type-jiaoju);
                    border: 1px solid var(--app-resource-type-jiaoju);
                }

                &.p-r-7 {
                    color: var(--app-resource-type-gongju);
                    border: 1px solid var(--app-resource-type-gongju);
                }

                &.p-r-8 {
                    color: var(--app-resource-type-sucai);
                    border: 1px solid var(--app-resource-type-sucai);
                }
            }
        }
    }
}

.teach-list-title {
    flex: 1;
    min-width: 0;
    color: #ffffff;
    font-weight: 600;
    font-size: 18px;
    display: flex;
    align-items: center;
    padding: 0 10px;

    .title {
        margin-right: 5px;
        flex-shrink: 0;
    }

    .search-input {
        margin-left: 5px;

        :deep(.el-input-group__append) {
            background: var(--app-color-dark);
            border: none;
        }
    }

    :deep(.el-input__wrapper) {
        background: var(--app-color-dark);
    }
    :deep(.el-input.is-focus .el-input__wrapper) {
        box-shadow: 0 0 0 1px
            var(--el-input-border-color, var(--el-border-color)) inset;
    }
    :deep(.el-input__wrapper.is-focus) {
        box-shadow: 0 0 0 1px
            var(--el-input-border-color, var(--el-border-color)) inset;
    }

    :deep(.el-input__inner) {
        background: var(--app-color-dark);
        color: #fdfdfd;

        &::placeholder {
            color: #8b8e95;
        }
    }
}
</style>
