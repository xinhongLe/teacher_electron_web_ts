<template>
    <div
        class="p-resource-item"
        :class="{ 'resource-courseware': data.ResourceType === '8C47DA089BAA57ECEF2B0B6AAE5CAC84', hover: hover }"
        @click="handleCommand('detail')"
    >
        <div class="p-resource-mark" v-if="data.IsMine === 1 && data.IsSchool !== 1">我的</div>
        <div class="p-resource-school-mark" v-if="data.IsSchool === 1">校本</div>
        <div class="p-resource-top">
            <div class="resource-icon">
                <img :src="data.IsSysFile === 1 ? iconResources.selfStudy[data.ResourceType] : iconResources.other[data.ResourceType]" alt="" />
            </div>
            <div class="resource-content">
                <div class="resource-title">{{data.Name}}</div>
                <div class="resource-message">
                    <img
                        src="@/assets/images/preparation/icon_gengxin.png"
                        alt=""
                    />
                    &nbsp;&nbsp;更新时间：{{dealTime(data.DateTime || data.CreateTime)}}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <img
                        src="@/assets/images/preparation/icon_download.png"
                        alt=""
                    />
                    &nbsp;&nbsp;下载次数：{{data.DownloadNum}} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <img
                        src="@/assets/images/preparation/icon_liulan_grey.png"
                        alt=""
                    />
                    &nbsp;&nbsp;浏览：{{data.BrowseNum}} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <img
                        src="@/assets/images/preparation/icon_zhinanzhen.png"
                        alt=""
                    />
                    &nbsp;&nbsp;来源：{{data.Source}} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </div>
                <div class="resource-classify">
                    <img src="@/assets/images/preparation/icon_mulu.png" alt="" />
                    所属目录：{{directoryName}}
                </div>
            </div>
            <div class="resource-control">
                <div class="resource-control-up">
                    <div class="resource-degree" :class="['', 'difficult', 'middle', ''][data.Degree]">{{["", "高", "中", "易"][data.Degree]}}</div>
                    <div class="resource-type" :class="typeResources[data.ResourceType] < 9 && 'p-r-' + typeResources[data.ResourceType]">{{textResources[data.ResourceType]}}</div>
                    <el-dropdown
                        v-if="btns && name !== 'attendClass' && name !== 'preview' && (data.ResourceShowType === 0 || (data.ResourceShowType === 1 && isMySelf))"
                        trigger="click"
                        placement="bottom"
                        @command="handleCommand"
                    >
                        <div class="resource-more" @click.stop="() => null">
                            <el-icon><more-filled /></el-icon>
                        </div>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="version" v-if="data.ResourceShowType === 0">
                                    <div class="dropdown-item">
                                        <img
                                            src="@/assets/images/preparation/icon_bbjl_blue.png"
                                            alt=""
                                        />
                                        &nbsp;&nbsp;版本记录
                                    </div>
                                </el-dropdown-item>
                                <el-dropdown-item command="delete" v-if="isMySelf">
                                    <div class="dropdown-item delete">
                                        <img
                                            src="@/assets/images/preparation/icon_delete.png"
                                            alt=""
                                        />
                                        &nbsp;&nbsp;删除
                                    </div>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
                <div class="p-resource-bottom no-border" v-if="!hover && btns && name !== 'attendClass' && name !== 'preview'">
                    <el-button class="p-control-btn" size="small" @click.stop="handleCommand('download')" v-if="canDownload">
                        <img src="@/assets/images/preparation/icon_download_white.png" alt="">
                        下载
                    </el-button>
                    <el-button class="p-control-btn" size="small" @click.stop="handleCommand('edit')" v-if="canEdit">
                        <img src="@/assets/images/preparation/icon_bianji.png" alt="">
                        编辑
                    </el-button>
                    <el-button class="p-control-btn p-move" size="small" v-if="data.IsBag" @click.stop="handleCommand('move')">
                        <img src="@/assets/images/preparation/icon_yichu.png" alt="">
                        移出备课包
                    </el-button>
                    <el-button class="p-control-btn p-add" size="small" v-if="!data.IsBag" @click.stop="handleCommand('add')">
                        <img src="@/assets/images/preparation/icon_add.png" alt="">
                        加入备课包
                    </el-button>
                </div>
            </div>
        </div>
        <div class="p-resource-bottom" v-if="hover && btns && name !== 'attendClass' && name !== 'preview'">
            <el-button class="p-control-btn" size="small" @click.stop="handleCommand('download')" v-if="canDownload">
                <img src="@/assets/images/preparation/icon_download_white.png" alt="">
                下载
            </el-button>
            <el-button class="p-control-btn" size="small" @click.stop="handleCommand('edit')" v-if="canEdit">
                <img src="@/assets/images/preparation/icon_bianji.png" alt="">
                编辑
            </el-button>
            <el-button class="p-control-btn p-move" size="small" v-if="data.IsBag" @click.stop="handleCommand('move')">
                <img src="@/assets/images/preparation/icon_yichu.png" alt="">
                移出备课包
            </el-button>
            <el-button class="p-control-btn p-add" size="small" v-if="!data.IsBag" @click.stop="$event => handleCommand('add', $event)">
                <img src="@/assets/images/preparation/icon_add.png" alt="">
                加入备课包
            </el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { Refresh, MoreFilled } from "@element-plus/icons-vue";
import { iconResources, textResources, typeResources } from "@/config/resource";
import { IResourceItem } from "@/api/resource";
import moment from "moment";
import { useStore } from "@/store";
export default defineComponent({
    components: { Refresh, MoreFilled },
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
		}
    },
    emits: ["eventEmit"],
    setup(props, { emit }) {
        const store = useStore();

        const handleCommand = (command: string, event?: MouseEvent | TouchEvent) => {
            if (!props.hover && command === "detail") return;
            emit("eventEmit", command, props.data, event);
        };

        const dealTime = (time: string) => {
            return moment(time).format("YYYY-MM-DD HH:mm");
        };

        // 是否是我的
        const isMySelf = computed(() => props.data.UserId === store.state.userInfo.userCenterUserID);

        const canEdit = computed(() => [2, 3, 4, 5].indexOf(props.data.ResourceShowType) === -1);

        const canDownload = computed(() => [1, 2, 3, 4, 5].indexOf(props.data.ResourceShowType) === -1);

        const directoryName = computed(() =>  {
            if (!props.data.TextBooks) return "--";
            const book = props.data.TextBooks.find(item =>  {
                return props.lessonId === item.LessonID || !item.LessonID;
            });
            return book ? book.SubjectName + " / " + book.PublisherName + " / " + book.AlbumName + (book.ChapterName ? " / " + book.ChapterName : "") + (book.LessonName ? " / " + book.LessonName : "") : "--";
        });

        return {
            handleCommand,
            dealTime,
            iconResources,
            textResources,
            directoryName,
            typeResources,
            isMySelf,
            canEdit,
            canDownload
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
        justify-content: flex-end;
        align-items: center;
        margin-top: 15px;
        padding-top: 15px;
        &.no-border {
            border: 0;
            padding-top: 0;
        }
    }
    &.hover {
        margin-bottom: 10px;
    }
    &.hover:hover {
        box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.16);
    }
    .p-resource-mark {
        background: url(~@/assets/images/preparation/bg_tab1.png) no-repeat;
        background-size: cover;
        padding: 8px 15px 5px 8px;
        overflow: hidden;
        position: absolute;
        bottom: 20px;
        left: -8px;
        color: #4B71EE;
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
        color: #F98A33;
        font-size: 12px;
    }
    &.resource-courseware {
        background: #e6f1ff;
        border-left: 4px solid #4b71ee;
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
    color: #486DE5;
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
    background: rgba(75, 113, 238, .1);
    color: #486DE5;
    border: none;
    &:hover {
        opacity: 0.6;
    }
    &.p-move {
        background: rgba(241, 45, 25, .1);
        color: #F12D19;
    }
    &.p-add {
        background: #4B71EE;
        color: #fff;
    }
    :deep(span) {
        display: flex;
        align-items: center;
        img {
            display: block;
            margin-right: 3px;
        }
    }
}
</style>
