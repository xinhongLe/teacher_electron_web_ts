<template>
    <div class="helper-container">
        <div class="header">
            <span class="exit" v-if="isElectron" @click="exitApp"
                >退出程序</span
            >
            <img
                src="@/assets/images/suspension/pic_tittle_zhike@2x.png"
                alt=""
            />
            <div class="right-btns">
                <i class="el-icon-refresh-right refresh" @click="getGradeList"></i>
                <div class="right-btn" @click="close">
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
            <div class="tool-list">
                <div class="blackboard-box" @click="openBlackboard()">
                    <img
                        src="@/assets/images/suspension/pic_blackboard@2x.png"
                        alt=""
                    />
                    <div class="blackboard-text">黑板</div>
                    <!-- <div class="blackboard-btn" @click="openBlackboard()">打开</div> -->
                </div>
                <div class="blackboard-box" @click="uncultivated">
                    <img
                        src="@/assets/images/suspension/img_datiqi.png"
                        alt=""
                    />
                    <div class="blackboard-text">答题器</div>
                </div>
                <div class="blackboard-box" @click="clickProjection">
                    <img
                        src="@/assets/images/suspension/pic_touying@2x.png"
                        alt=""
                    />
                    <div class="blackboard-text">投影</div>
                </div>
                <div class="blackboard-box" @click="clickKnowledge">
                    <img
                        src="@/assets/images/suspension/pic_zhishitupu@2x.png"
                        alt=""
                    />
                    <div class="blackboard-text">知识图谱</div>
                </div>
                <div class="blackboard-box" @click="openTimer">
                    <img
                        src="@/assets/images/suspension/pic_timer@2x.png"
                        alt=""
                    />
                    <div class="blackboard-text">计时器</div>
                </div>
                <!-- openRollCall -->
                <div class="blackboard-box" @click="openRollCall">
                    <img
                        src="@/assets/images/suspension/pic_namer@2x.png"
                        alt=""
                    />
                    <div class="blackboard-text">点名</div>
                </div>
            </div>

            <div class="teach-list">
                <div class="teach-list-title">
                    <span class="title">教学助手</span>
                    <el-cascader
                        v-model="selectBookList"
                        :props="cascaderProps"
                        :options="subjectPublisherBookList"
                    />
                    <div class="search-input">
                        <el-input
                            placeholder="搜索教具名称"
                            v-model="searchName"
                        >
                            <template #append>
                                <el-button
                                    icon="el-icon-search"
                                    @click="getGradeList"
                                ></el-button>
                            </template>
                        </el-input>
                    </div>
                </div>
                <div class="teach-class" v-show="!isLoading">
                    <div class="list-empty" v-if="gameList.length === 0">
                        <img src="@/assets/images/suspension/empty_tool.png" />
                        <span
                            >本书册下暂无教具，可切换为“全部”查看更多教具内容</span
                        >
                    </div>
                    <div v-else class="teach-content-warp">
                        <div
                            class="teach-content"
                            v-for="(item, index) in gameList"
                            :key="index"
                            @click="openUrl(item.url, item.name)"
                        >
                            <div class="img-warp">
                                <img :src="item.imgUrl" />
                            </div>
                            <p>{{ item.name }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { Game } from "./interface";
import { getToolList } from "@/api/index";
import { getOssUrl } from "@/utils/oss";
import isElectron from "is-electron";
import { ElMessage } from "element-plus";
import { fetchSubjectPublisherBookList } from "@/views/preparation/api";
import { BookList } from "@/types/preparation";
import { get, STORAGE_TYPES } from "@/utils/storage";
import { fetchAllStudents } from "@/views/labelManage/api";
export default defineComponent({
    setup(props, { emit }) {
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
            if (allStudentList.value.length === 0) {
                return ElMessage.error("请等待学员加载后点名！");
            }
            if (isElectron()) {
                return window.electron.ipcRenderer.invoke("openRollCall", JSON.parse(JSON.stringify(allStudentList.value)));
            }
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
            const res = await fetchSubjectPublisherBookList();
            if (res.resultCode === 200) {
                subjectPublisherBookList.value = [
                    ...initBookList,
                    ...res.result
                ];
            }
            getGradeList();
        };

        const getStudentList = async () => {
            const userInfo = get(STORAGE_TYPES.USER_INFO);
            const res = await fetchAllStudents(userInfo?.ID);
            if (res.resultCode === 200) {
                allStudentList.value = res.result;
            }
        };

        onMounted(async () => {
            getBookList();
            getStudentList();
            // if (isElectron()) {
            //     window.electron.ipcRenderer.on("loginSuccess", (_, token) => {
            //         set(STORAGE_TYPES.SET_TOKEN, token);
            //         getBookList();
            //     });
            // }
        });

        watch(selectBookList, getGradeList);

        return {
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
            clickProjection,
            searchName,
            uncultivated,
            isLoading,
            openRollCall
        };
    }
});
</script>

<style lang="scss" scoped>
.helper-container {
    position: fixed;
    right: 0;
    bottom: 0;
    width: 545px;
    height: 680px;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    background: #1a1d3e;
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
                font-size: 25px;
                color: #ffffff;
                margin-right: 20px;
                cursor: pointer;
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
            background-color: #2b314b;
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
            .teach-list-title {
                margin: 20px 0;
                color: #ffffff;
                font-weight: 600;
                font-size: 18px;
                display: flex;
                align-items: center;
                .title {
                    margin-right: 5px;
                    flex-shrink: 0;
                }
                .search-input {
                    margin-left: 5px;
                    :deep(.el-input-group__append) {
                        background: #0c1222;
                        border: none;
                    }
                }
                :deep(.el-input__inner) {
                    background: #0c1222;
                    border: none;
                    color: #fdfdfd;
                    &::placeholder {
                        color: #8b8e95;
                    }
                }
            }
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
</style>
