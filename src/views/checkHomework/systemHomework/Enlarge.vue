<template>
    <el-dialog
        title="查看"
        v-if="visible"
        v-model="visible"
        width="1000px"
    >
        <div class="look-images">
            <div class="subject-list">
                <slot></slot>
                <div class="subject-detail">
                    <div class="head-photo flex-between-center">
                        <Avatar
                            :file="headPortrait"
                            :size="78"
                        ></Avatar>
                        <div class="info">
                            <p class="name">{{ childrenName }}</p>
                            <el-tooltip placement="bottom">
                                <template #content>
                                    <div>{{ className }}</div>
                                </template>
                                <p class="class-flag">{{ className }}</p>
                            </el-tooltip>
                            <p>2020-08-11 13:56</p>
                        </div>
                    </div>
                    <div class="btns">
                        <div
                            class="btn-class el-icon-check"
                            :class="{success: Detail.Result == QuestionResultTypeEnum.RIGHT}"
                            @click="_successHandle"
                        ></div>
                        <div
                            class="btn-class el-icon-close"
                            @click="_errorHandle"
                            :class="{error: Detail.Result == QuestionResultTypeEnum.ERROR}"
                        >
                            <i></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { QuestionResultTypeEnum } from "../enum";
import Avatar from "../../../components/avatar/index.vue";
export default defineComponent({
    props: {
        childrenName: {
            type: String,
            default: "***"
        },
        className: {
            type: String,
            default: "***"
        },
        Detail: {
            type: Object,
            default: () => ({})
        },
        errorHandle: {
            type: Function,
            required: true
        },
        headPortrait: {
            type: Object,
            default: () => ({})
        },
        successHandle: {
            type: Function,
            required: true
        }
    },
    setup(props) {
        const visible = ref(false);
        const _errorHandle = () => {
            if (props.Detail.Result === QuestionResultTypeEnum.ERROR) { return; }
            visible.value = false;
            props.errorHandle(props.Detail.ID);
        };
        const _successHandle = () => {
            if (props.Detail.Result === QuestionResultTypeEnum.RIGHT) { return; }
            visible.value = false;
            props.successHandle(props.Detail.ID);
        };
        return {
            _errorHandle,
            _successHandle,
            visible,
            QuestionResultTypeEnum
        };
    },
    components: { Avatar }
});
</script>

<style lang="scss" scoped>
.class-flag {
    width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.look-images {
    width: 100%;
    .show-type {
        display: flex;
        justify-content: center;
        > p {
            width: 120px;
            height: 40px;
            line-height: 40px;
            padding: 0 20px;
            margin-right: 10px;
            background: #eff0f4;
            border-radius: 4px;
            cursor: pointer;
            text-align: center;
            color: #5f626f;
            &.active {
                color: #fff;
                background: #4b71ee;
            }
        }
    }
    .subject-list {
        margin: 0px auto;
        margin-bottom: 15px;
        padding-right: 15px;
        .img-class {
            width: 100%;
            height: calc(100% - 85px);
        }
        .img-class-no {
            background-color: #fff;
            text-align: center;
            img {
                width: 240px;
                height: 160px;
            }
        }
        .subject-detail {
            padding: 10px 20px 78px 10px;
            background-color: #fff;
            position: relative;
            .head-photo {
                margin-top: 10px;
                float: left;
                height: 100px;
                .info {
                    margin-left: 10px;
                }
                .name {
                    font-size: 16px;
                    font-weight: 600;
                    color: #19203d;
                }
            }
            .btn-class {
                width: 100px;
                height: 40px;
                line-height: 40px;
                text-align: center;
                background: #F3F7FF;
                border-radius: 20px;
                font-size: 24px;
                font-weight: 900;
                color: #4B71EE;
                cursor: pointer;
                &:first-child {
                    margin-right: 20px;
                }
                &.success {
                    background: #34E1B6;
                    color: #fff;
                }
                &.error {
                    background: #FF6B6B;
                    color: #fff;
                }
            }
            .btns {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%);
            }
            .collection-btn {
                padding: 8px;
                background: #ffeaa2;
                border-radius: 4px;
                cursor: pointer;
                img {
                    width: 16px;
                    height: 12px;
                    vertical-align: text-bottom;
                }
            }
            .page {
                margin-left: 10px;
                color: #a7aab4;
                font-size: 14px;
                i {
                    cursor: pointer;
                }
            }
        }
    }
}
</style>
