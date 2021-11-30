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
                        <img
                            src="@/assets/images/preparation/touxiang_student@2x.png"
                            alt=""
                        />
                        <div>
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
                            @click="_successHandle"
                            :style="{
                                background:
                                    Detail.Result == 1 ? '#f3f7ff' : '#74ecb4',
                            }"
                        ></div>
                        <div
                            class="btn-class btn-class-err el-icon-close"
                            :style="{
                                background:
                                    Detail.Result == 2 ? '#f3f7ff' : '#f5a9a9',
                            }"
                            @click="_errorHandle"
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
        successHandle: {
            type: Function,
            required: true
        }
    },
    setup(props) {
        const visible = ref(false);

        const _errorHandle = () => {
            if (props.Detail.Result === 2) return;
            visible.value = false;
            props.errorHandle(props.Detail.ID);
        };

        const _successHandle = () => {
            if (props.Detail.Result === 1) return;
            visible.value = false;
            props.successHandle(props.Detail.ID);
        };

        return {
            _errorHandle,
            _successHandle,
            visible
        };
    }
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
                img {
                    width: 78px;
                    height: 78px;
                    margin-right: 10px;
                }
                .name {
                    font-size: 16px;
                    font-weight: 600;
                    color: #19203d;
                }
            }
            .btn-class {
                width: 56px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                background: #34e1b6;
                border-radius: 32px;
                font-size: 24px;
                font-weight: 900;
                color: #fff;
                cursor: pointer;
            }
            .btns {
                position: absolute;
                left: 0;
                right: 0;
                width: 100%;
                text-align: center;
                margin-top: 40px;
            }
            .btn-class-err {
                background: #f5a9a9;
                color: #4b71ee;
                margin-left: 10px;
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
