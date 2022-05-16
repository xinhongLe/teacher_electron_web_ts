<template>
    <div class="p-resource-item" :class="data.type === 2 && 'courseware'">
        <div class="resource-icon"></div>
        <div class="resource-content">
            <div class="resource-title">数一数</div>
            <div class="resource-classify">
                <img
                    src="@/assets/images/preparation/resources/icon_mulu.png"
                    alt=""
                />
                数学 / 人教版 / 一上 / 1单元 数一数 / 1.1 数一数
            </div>
            <div class="resource-message">
                <el-icon :size="14"><refresh /></el-icon> &nbsp;&nbsp;更新时间：2021-10-20 11:5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <el-icon :size="14"><coin /></el-icon> &nbsp;&nbsp;大小：1.82 MB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <el-icon :size="14"><view /></el-icon> &nbsp;&nbsp;浏览：23 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <el-icon :size="14"><compass /></el-icon> &nbsp;&nbsp;来源：系统来源 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
        </div>
        <div class="resource-control">
            <div class="resource-control-up">
                <div class="resource-degree">易</div>
                <div class="resource-type">其他</div>
                <el-dropdown
                    trigger="click"
                    placement="bottom"
                    @command="handleCommand"
                >
                    <div class="resource-more" @click.stop="() => null">
                        <el-icon><more-filled /></el-icon>
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="detail">
                                <div class="dropdown-item">
                                    <el-icon><Finished /></el-icon>详情
                                </div>
                            </el-dropdown-item>
                            <el-dropdown-item command="edit">
                                <div class="dropdown-item">
                                    <el-icon><Edit /></el-icon>编辑
                                </div>
                            </el-dropdown-item>
                            <el-dropdown-item command="download">
                                <div class="dropdown-item">
                                    <el-icon><Download /></el-icon>下载
                                </div>
                            </el-dropdown-item>
                            <el-dropdown-item command="version">
                                <div class="dropdown-item">
                                    <el-icon><Document /></el-icon>版本记录
                                </div>
                            </el-dropdown-item>
                            <el-dropdown-item command="delete">
                                <div class="dropdown-item delete">
                                    <el-icon><Delete /></el-icon>删除
                                </div>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
/**
 * type 类型
 * 0: 教案
 * 1: 导学案
 * 2: 课件
 * 3: 微课视频
 * 4: 作业
 * 5: 电子课本
 * 6: 教具
 * 7: 工具
 * 8: 素材
 * 9: 其他
 */

/**
 * source 来源
 * 0: 系统资源
 * 1: 校本资源
 * 2: 我的资源
 */
import { defineComponent, PropType } from "vue";
import {
    Refresh,
    View,
    Compass,
    Coin,
    MoreFilled,
    Finished,
    Edit,
    Download,
    Document,
    Delete
} from "@element-plus/icons-vue";
export default defineComponent({
    components: { Refresh, View, Compass, Coin, MoreFilled, Finished, Edit, Download, Document, Delete },
    props: {
        data: {
            type: Object as PropType<any>,
            required: true
        }
    },
    setup(props, { emit }) {
        const handleCommand = (command: string) => {
            emit("eventEmit", command, props.data);
        };

        return {
            handleCommand
        };
    }
});
</script>

<style lang="scss" scoped>
.p-resource-item {
    border-radius: 4px;
    margin-bottom: 10px;
    padding: 15px;
    display: flex;
    background: #fff;
    min-height: 100px;
    transition: 1s all;
    &:hover {
        box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.16);
    }
    &.courseware {
        background: #E6F1FF;
        border-left: 4px solid #4B71EE;
    }
    .resource-icon {
        width: 60px;
        margin-right: 10px;
    }
    .resource-content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        min-width: 0;
    }
    .resource-title {
        font-size: 18px;
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
    }
    .resource-control {
        margin-left: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .resource-control-up {
            display: flex;
            align-items: center;
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
            color: #fff;
            background: var(--app-resource-type-qita);
            font-size: 12px;
            margin: 0 10px 0 10px;
            &.jiaoan {
                background: var(--app-resource-type-jiaoan);
            }
            &.daoxuean {
                background: var(--app-resource-type-daoxuean);
            }
            &.kejian {
                background: var(--app-resource-type-kejian);
            }
            &.weikeshipin {
                background: var(--app-resource-type-weikeshipin);
            }
            &.zuoye {
                background: var(--app-resource-type-zuoye);
            }
            &.dianzikeben {
                background: var(--app-resource-type-dianzikeben);
            }
            &.jiaoju {
                background: var(--app-resource-type-jiaoju);
            }
            &.gongju {
                background: var(--app-resource-type-gongju);
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
</style>
