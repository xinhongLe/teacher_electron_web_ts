<template>
    <div class="p-resource-item" :class="{
        'resource-courseware':
            data.ResourceType === RESOURCE_TYPE.COURSEWARD &&
            data.IsSysFile === 1,
        hover: hover,
    }" @click="handleCommand('detail')">
        <div class="p-resource-mark" v-if="data.IsMine === 1 && data.IsSchool !== 1">
            我的
        </div>
        <div class="p-resource-school-mark" v-if="data.IsSchool === 1">
            校本
        </div>
        <div class="p-resource-top">
            <div class="resource-icon">
                <img :src="
                    data.IsSysFile === 1
                        ? iconResources.selfStudy[data.ResourceType]
                        : iconResources.other[data.ResourceType]
                " alt=""/>
            </div>
            <div class="resource-content">
                <div class="resource-title">
                    {{ data.Name }}
                    <img class="resource-format" v-if="data.File" :src="formatImg"/>
                </div>
                <div class="resource-message">
                    <img src="@/assets/images/preparation/icon_gengxin.png" alt=""/>
                    &nbsp;&nbsp;更新时间：{{dealTime(data.DateTime || data.CreateTime)}}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <img src="@/assets/images/preparation/icon_download.png" alt=""/>
                    &nbsp;&nbsp;下载次数：{{ data.DownloadNum }}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <img src="@/assets/images/preparation/icon_liulan_grey.png" alt=""/>
                    &nbsp;&nbsp;浏览：{{ data.BrowseNum }}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <img src="@/assets/images/preparation/icon_zhinanzhen.png" alt=""/>
                    &nbsp;&nbsp;来源：{{ data.Source }}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </div>
                <div class="resource-classify">
                    <img src="@/assets/images/preparation/icon_mulu.png" alt=""/>
                    所属目录：{{ directoryName }}
                </div>
            </div>
            <div class="resource-control">
                <div class="resource-control-up">
                    <div class="resource-degree" v-if="RESOURCE_TYPE.TOOL !== data.ResourceType"
                         :class="['', 'difficult', 'middle', ''][data.Degree]">
                        {{ ["", "高", "中", "易"][data.Degree] }}
                    </div>
                    <div class="resource-type" :class="
                        typeResources[data.ResourceType] < 9 &&
                        'p-r-' + typeResources[data.ResourceType]
                    ">
                        {{ textResources[data.ResourceType] }}
                    </div>
                    <el-dropdown v-if="
                        btns &&
                        name !== 'attendClass' &&
                        name !== 'preview' &&
                        (data.ResourceShowType === 0 ||
                            (data.ResourceShowType === 1 && isMySelf))
                    " trigger="click" placement="bottom" @command="handleCommand">
                        <div class="resource-more" @click.stop="() => null">
                            <el-icon>
                                <more-filled/>
                            </el-icon>
                        </div>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="version" v-if="
                                    data.ResourceShowType === 0 ||
                                    data.ResourceShowType === 5
                                ">
                                    <div class="dropdown-item">
                                        <img src="@/assets/images/preparation/icon_bbjl_blue.png" alt=""/>
                                        &nbsp;&nbsp;版本记录
                                    </div>
                                </el-dropdown-item>
                                <el-dropdown-item command="property" v-if="isMySelf">
                                    <div class="dropdown-item">
                                        <img src="@/assets/images/preparation/icon_bjsx_hover.png" alt=""/>
                                        &nbsp;&nbsp;编辑属性
                                    </div>
                                </el-dropdown-item>
                                <el-dropdown-item command="delete" v-if="isMySelf">
                                    <div class="dropdown-item delete">
                                        <img src="@/assets/images/preparation/icon_delete.png" alt=""/>
                                        &nbsp;&nbsp;删除
                                    </div>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
                <div class="p-resource-bottom no-border" v-if="
                    !hover &&
                    btns &&
                    name !== 'attendClass' &&
                    name !== 'preview'
                ">

                    <el-button class="p-control-btn" @click.stop="handleCommand('download')" v-if="
                        canDownload &&
                        RESOURCE_TYPE.TOOL !== data.ResourceType
                    ">
                        <img src="@/assets/images/preparation/icon_download_white.png" alt=""/>
                        下载
                    </el-button>
                    <el-button class="p-control-btn" @click.stop="handleCommand('edit')" v-if="
                        canEdit && RESOURCE_TYPE.TOOL !== data.ResourceType
                    ">
                        <img src="@/assets/images/preparation/icon_bianji.png" alt=""/>
                        编辑
                    </el-button>
                    <el-button class="p-control-btn p-move" v-if="data.IsBag" @click.stop="handleCommand('move')">
                        <img src="@/assets/images/preparation/icon_yichu.png" alt=""/>
                        移出备课包
                    </el-button>
                    <el-button class="p-control-btn p-add" v-if="!data.IsBag" @click.stop="handleCommand('add')">
                        <img src="@/assets/images/preparation/icon_add.png" alt=""/>
                        加入备课包
                    </el-button>
                </div>
                <div class="tool-text" v-if="hover && btns && name === 'attendClass'">
                    <span>{{
                            data.ToolInfo
                                ? `共${data.ToolInfo.QuestionCount}题`
                                : ""
                        }}</span>
                    <span>{{
                            data.ToolInfo
                                ? ` ( ${data.ToolInfo.QuestionTypeName})`
                                : ""
                        }}</span>
                </div>
            </div>
        </div>
        <div class="p-resource-bottom" v-if="hover && btns && name !== 'attendClass' && name !== 'preview'">
            <div style="padding-left: 66px;">
                <el-button class="p-control-btn" v-if="source != 'me'" @click.stop.prevent="toArrangeClass(data, 1)"
                           @touchstart.stop.prevent="toArrangeClass(data, 1, $event)">
                    <img src="@/assets/images/preparation/icon_download_white.png" alt=""/>
                    排课
                </el-button>
                <div class="tool-text">
                    <span class="total">{{
                            data.ToolInfo ? `共${data.ToolInfo.QuestionCount}题` : ""
                        }}</span>
                    <span>{{
                            data.ToolInfo ? ` ( ${data.ToolInfo.QuestionTypeName})` : ""
                        }}</span>
                </div>
            </div>
            <div>
                <el-button class="p-control-btn" @click.stop="handleCommand('download')" v-if="
                    canDownload && RESOURCE_TYPE.TOOL !== data.ResourceType
                ">
                    <img src="@/assets/images/preparation/icon_download_white.png" alt=""/>
                    下载
                </el-button>
                <el-button class="p-control-btn" @click.stop="handleCommand('edit')"
                           v-if="canEdit && RESOURCE_TYPE.TOOL !== data.ResourceType">
                    <img src="@/assets/images/preparation/icon_bianji.png" alt=""/>
                    编辑
                </el-button>

                <el-popover v-if="source !== 'me' && lessonPackageList.length > 1" placement="bottom" :width="150"
                            trigger="hover" popper-class="lesson-package-popover">
                    <template #reference>
                        <el-button class="p-control-btn p-isbag" v-if="data.IsBag" @click.stop="null">
                            <!-- <img src="@/assets/images/preparation/icon_yichu.png" alt="" /> -->
                            已加入备课包
                        </el-button>
                        <el-button class="p-control-btn p-add" v-if="!data.IsBag" @click.stop="null">
                            <img src="@/assets/images/preparation/icon_add.png" alt=""/>
                            加入备课包
                        </el-button>
                    </template>
                    <div class="lesson-package-select">
                        <div class="package-content">
                            <div class="package-item" v-for="(item, index) in lessonPackageList"
                                 @click="handleSelectLessonBag(item, data)" :key="index">
                                <span>
                                    {{ item.Name }}
                                </span>
                                <img v-if="data.JoinBags.map((bag) => bag.BagId).includes(item.Id)"
                                     src="@/assets/images/preparation/icon_dui.png" alt="">
                            </div>
                        </div>
                        <div class="deadline">
                        </div>
                        <div class="package-add">
                            <img src="@/assets/images/preparation/icon_add_black.png" alt="">
                            <span class="add-text" @click="addLessonPackage">
                                新增
                            </span>
                        </div>
                    </div>
                </el-popover>
                <template v-if="lessonPackageList.length && lessonPackageList.length === 1 && source !== 'me'">
                    <el-button class="p-control-btn p-isbag" v-if="data.IsBag" @click.stop="null">
                        已加入备课包
                    </el-button>
                    <el-button class="p-control-btn p-add" v-if="!data.IsBag"
                               @click.stop="handleSelectLessonBag(lessonPackageList[0], data)">
                        <img src="@/assets/images/preparation/icon_add.png" alt=""/>
                        加入备课包
                    </el-button>
                </template>
                <el-button v-if="source === 'me'" class="p-control-btn p-move"
                           @click.stop="handleRemoveLessonBag(data)">
                    <img src="@/assets/images/preparation/icon_yichu.png" alt=""/>
                    移出备课包
                </el-button>
            </div>
        </div>

        <el-dialog draggable title="课件分享" width="365" v-model="shareShow" :align-center="true" :append-to-body="true"
                   :destroy-on-close="true" :close-on-click-modal="false">
            <div class="share-title">{{ shareData?.Name }}</div>

            <div class="share-link">
                <span @click="handleUrl(shareData?.url)">{{ shareData?.link }}</span>
            </div>

            <el-button type="primary" style="width: 100%" @click="handlePasteboard(shareData?.url)">复制链接</el-button>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import {computed, defineComponent, PropType, ref} from "vue";
import {MoreFilled} from "@element-plus/icons-vue";
import {
    iconResources,
    textResources,
    typeResources,
    RESOURCE_TYPE
} from "@/config/resource";
import {IResourceItem} from "@/api/resource";
import moment from "moment";
import {useStore} from "@/store";
import {IGetLessonBagOutDto} from "@/api/prepare";
import {emit} from "process";
import isElectron from "is-electron";
import {ElMessage} from "element-plus";

export default defineComponent({
    components: {MoreFilled},
    props: {
        data: {
            type: Object as PropType<IResourceItem>,
            required: true
        },
        hover: {
            type: Boolean,
            default: true
        },
        btns: {
            type: Boolean,
            default: true
        },
        lessonId: {
            type: String,
            required: true
        },
        name: {
            type: String,
            default: ""
        },
        source: {
            type: String,
            default: ""
        },
        lessonPackageList: {
            type: Object as PropType<IGetLessonBagOutDto[]>,
            default: () => []
        }
    },
    emits: ["eventEmit", "addLessonPackage", "toArrangeClass", "handleSelectLessonBag", "handleRemoveLessonBag"],
    setup(props, {emit}) {
        const store = useStore();

        const handleCommand = (
            command: string,
            event?: MouseEvent | TouchEvent
        ) => {
            if (!props.hover && command === "detail") return;
            emit("eventEmit", command, props.data, event);
        };

        const dealTime = (time: string) => {
            return moment(time).format("YYYY-MM-DD HH:mm");
        };

        // 是否是我的
        const isMySelf = computed(
            () => props.data.UserId === store.state.userInfo.userCenterUserID
        );

        const canEdit = computed(
            () => [0, 2, 3, 4, 5].indexOf(props.data.ResourceShowType) === -1
        );

        const canDownload = computed(
            () => [2, 3, 4, 5].indexOf(props.data.ResourceShowType) === -1
        );

        const formatImgs: { [key: string]: any } = {
            xlsx: require("@/assets/projection/format/icon_execl@2x.png"),
            xls: require("@/assets/projection/format/icon_execl@2x.png"),
            ppt: require("@/assets/projection/format/icon_ppt@2x.png"),
            pptx: require("@/assets/projection/format/icon_ppt@2x.png"),
            doc: require("@/assets/projection/format/icon_word@2x.png"),
            docx: require("@/assets/projection/format/icon_word@2x.png"),
            pdf: require("@/assets/projection/format/icon_pdf@2x.png"),
            gif: require("@/assets/projection/format/icon_pic@2x.png"),
            png: require("@/assets/projection/format/icon_pic@2x.png"),
            jpg: require("@/assets/projection/format/icon_pic@2x.png"),
            jpeg: require("@/assets/projection/format/icon_pic@2x.png"),
            mp3: require("@/assets/projection/format/icon_music@2x.png"),
            wav: require("@/assets/projection/format/icon_music@2x.png"),
            mp4: require("@/assets/projection/format/icon_shipin@2x.png"),
            other: require("@/assets/projection/format/icon_other@2x.png")
        };

        const formatImg = computed(
            () => formatImgs[props.data.File?.FileExtention || "other"]
        );

        const directoryName = computed(() => {
            if (!props.data.TextBooks) return "--";
            const book = props.lessonId ? props.data.TextBooks.find((item) => {
                return props.lessonId === item.LessonID || !item.LessonID;
            }) : props.data.TextBooks[0];
            return book
                ? book.SubjectName +
                " / " +
                book.PublisherName +
                " / " +
                book.AlbumName +
                (book.ChapterName ? " / " + book.ChapterName : "") +
                (book.LessonName ? " / " + book.LessonName : "")
                : "--";
        });
        const addLessonPackage = () => {
            emit("addLessonPackage");
        };
        const handleSelectLessonBag = (item: IGetLessonBagOutDto, data: IResourceItem) => {
            emit("handleSelectLessonBag", item, data);
        };
        const handleRemoveLessonBag = (data: IResourceItem) => {
            emit("handleRemoveLessonBag", data);
        };
        const toArrangeClass = (data: any, type: number, ev?: TouchEvent) => {
            emit("toArrangeClass", data, type, ev);
        };

        const shareShow = ref(false);
        const shareData = ref();
        const handleShare = (data: IResourceItem) => {
            shareData.value = {
                ...data,
                url: process.env.VUE_APP_SHARE_URL + data.OldResourceId,
                link: process.env.VUE_APP_SHARE_URL
            };
            shareShow.value = true;
        };

        const handleUrl = (url: string) => {
            if (isElectron()) {
                window.electron.shell.openExternal(url);
            } else {
                window.open(url);
            }
        };
        const handlePasteboard = (url: string) => {
            const el = document.createElement("input");
            // 给input元素赋值需要复制的文本
            el.setAttribute("value", url);
            // 将input元素插入页面
            document.body.appendChild(el);
            // 选中input元素的文本
            el.select();
            // 复制内容到剪贴板
            document.execCommand("copy");
            // 删除input元素
            document.body.removeChild(el);
            ElMessage.success("复制成功");
        };

        return {
            handleCommand,
            dealTime,
            addLessonPackage,
            toArrangeClass,
            handleSelectLessonBag,
            handleRemoveLessonBag,
            iconResources,
            textResources,
            directoryName,
            typeResources,
            isMySelf,
            canEdit,
            canDownload,
            formatImg,
            RESOURCE_TYPE,
            handleShare,
            shareShow,
            shareData,
            handleUrl,
            handlePasteboard
        };
    }
});
</script>

<style lang="scss" scoped>
.p-resource-item {
    border-radius: 4px;
    margin-bottom: 0;
    padding: 15px;
    background: #fff;
    // min-height: 100px;
    transition: 1s all;
    cursor: pointer;
    position: relative;

    .p-resource-top {
        display: flex;
    }

    .p-resource-bottom {
        border-top: 1px solid var(--app-color-border-grey);
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 15px;
        padding-top: 15px;

        &.no-border {
            border: 0;
            padding-top: 0;
        }

        .tool-text {
            font-size: 14px;
            color: #5f626f;
            margin-left: 80px;

            .total {
                font-size: 16px;
            }
        }
    }

    &.hover {
        margin-bottom: 10px;
    }

    &.hover:hover {
        box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.16);
    }

    .p-resource-mark {
        background: url(~@/assets/images/preparation/bg_tab1.png) no-repeat;
        background-size: cover;
        padding: 8px 15px 5px 8px;
        overflow: hidden;
        position: absolute;
        bottom: 20px;
        left: -8px;
        color: #4b71ee;
        font-size: 12px;
    }

    .p-resource-school-mark {
        background: url(~@/assets/images/preparation/bg_tab2@2x.png) no-repeat;
        background-size: cover;
        padding: 8px 15px 5px 8px;
        overflow: hidden;
        position: absolute;
        bottom: 20px;
        left: -8px;
        color: #f98a33;
        font-size: 12px;
    }

    &.resource-courseware {
        background: #e6f1ff;
        // border-left: 4px solid #4b71ee;
    }

    .resource-icon {
        width: 60px;
        margin-right: 15px;
        position: relative;
        top: -4px;

        img {
            width: 100%;
            display: block;
        }
    }

    .resource-content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        min-width: 0;
    }

    .resource-title {
        font-size: 16px;
        font-weight: 600;
        display: flex;
        align-items: center;

        .resource-format {
            display: block;
            margin-left: 10px;
            width: 16px;
        }
    }

    .resource-classify {
        font-size: 12px;
        color: var(--app-color-text-default);
        display: flex;
        align-items: center;

        img {
            width: 12px;
            position: relative;
            top: -1px;
            margin-right: 4px;
            display: block;
        }
    }

    .resource-message {
        display: flex;
        align-items: center;
        font-size: 12px;
        color: var(--app-color-text-default);
        padding: 12px 0;
    }

    .resource-control {
        margin-left: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .tool-text {
            color: #5f626f;
            margin-top: 10px;
        }

        .resource-control-up {
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }

        .resource-degree {
            border-radius: 4px;
            padding: 4px;
            border: 1px solid;
            border-color: var(--app-resource-degree-easy);
            color: var(--app-resource-degree-easy);
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;

            &.difficult {
                border-color: var(--app-resource-degree-difficult);
                color: var(--app-resource-degree-difficult);
            }

            &.middle {
                border-color: var(--app-resource-degree-middle);
                color: var(--app-resource-degree-middle);
            }
        }

        .resource-type {
            display: flex;
            align-items: center;
            border-radius: 4px;
            padding: 5px 10px;
            color: var(--app-resource-type-qita);
            border: 1px solid var(--app-resource-type-qita);
            font-size: 12px;
            margin: 0 10px 0 10px;

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

        .resource-more {
            transform: rotate(90deg);
            padding: 5px;
            cursor: pointer;
        }
    }
}

.dropdown-item {
    display: flex;
    align-items: center;
    color: #486de5;

    &.delete {
        color: var(--app-color-red);

        &.is-disabled {
            color: var(--app-color-disabled-red);
        }
    }

    .el-icon {
        margin-right: 4px;
    }
}

.p-control-btn {
    background: rgba(75, 113, 238, 0.1);
    color: #486de5;
    border: none;

    &:hover {
        opacity: 0.6;
    }

    &.p-move {
        background: rgba(241, 45, 25, 0.1);
        color: #f12d19;
    }

    &.p-add {
        background: #4b71ee;
        color: #fff;
    }

    &.p-isbag {
        background: #F5F6FA;
        color: #6E6D7A;
    }

    :deep(span) {
        display: flex;
        align-items: center;
        font-size: 12px;

        img {
            display: block;
            margin-right: 3px;
        }
    }
}

.share-link {
    width: 100%;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #eeeeee;
    color: #2E95FF;
    padding: 0 10px;
    box-sizing: border-box;
    margin: 15px 0;
    cursor: pointer;
}
</style>

<style lang="scss">
.lesson-package-popover {
    width: 122px !important;
    min-width: 122px !important;
    max-height: 151px;
    background: #FFFFFF !important;
    box-shadow: 0px 8px 24px 0px #00000029 !important;
    border-radius: 6px !important;
    padding: 12px 0 !important;

    .lesson-package-select {
        position: relative;
        max-height: 130px;

        .package-content {
            max-height: 103px;
            overflow-y: auto;
            padding: 0 16px;

            .package-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                font-size: 14px;
                font-weight: 400;
                color: #0D0B22;
                margin-bottom: 12px;
                cursor: pointer;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;

                span {
                    display: inline-block;
                    width: 80%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }

            .package-item:hover {
                background-color: #d8e0fb;

            }
        }
    }

    .deadline {
        width: 100%;
        height: 1px;
        background: #F3F4F4;
        margin-bottom: 12px;

    }

    .package-add {
        position: absolute;
        bottom: -20px;
        left: 0;
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 0 16px;

        .add-text {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #486CE4;
        }
    }
}
</style>
