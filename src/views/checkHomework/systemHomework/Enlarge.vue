<template>
    <el-dialog title="查看" v-if="visible" v-model="visible" width="1000px">
        <div class="look-images">
            <div class="subject-list">
                <slot :detail="detail" :detailData="detailData" :answer="answer" :question="question"></slot>
                <div class="subject-detail">
                    <div class="head-photo flex-between-center">
                        <Avatar :file="detail.Student?.HeadPortrait" :size="78"></Avatar>
                        <div class="info">
                            <p class="name">{{ detail.Student ? detail.Student.Name : '' }}</p>
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
                        <div class="btn-class"
                            :class="{ success: detail?.Detail?.Result == QuestionResultTypeEnum.RIGHT }"
                            @click="successHandle">
                            <el-icon>
                                <Check />
                            </el-icon>
                        </div>
                        <div class="btn-class" @click="errorHandle"
                            :class="{ error: detail?.Detail?.Result == QuestionResultTypeEnum.ERROR }">
                            <el-icon>
                                <Close />
                            </el-icon>
                        </div>
                    </div>
                    <div class="page">
                        <span class="btn" :class="{ display: isDisplayPrev }" @click="prevPage">
                            <el-icon>
                                <ArrowLeft />
                            </el-icon>
                        </span>
                        {{ currentIndex + 1 }}/{{ detailList.length }}
                        <span class="btn" :class="{ display: isDisplayNext }" @click="nextPage">
                            <el-icon>
                                <ArrowRight />
                            </el-icon>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from "vue";
import { QuestionResultTypeEnum } from "../enum";
import Avatar from "../../../components/avatar/index.vue";
import { successHandle, errorHandle } from "../logic";
import { MissionDetail, QuestionDetail } from "@/types/checkHomework";
export default defineComponent({
    props: {
        MissionList: {
            type: Array as PropType<MissionDetail[]>,
            default: () => ([])
        },
        detailList: {
            type: Array as PropType<QuestionDetail[]>,
            default: () => ([])
        }
    },
    setup(props) {
        const visible = ref(false);
        const currentIndex = ref(0);
        const detail = computed(() => props.detailList[currentIndex.value]);
        const className = computed(() => props.MissionList[currentIndex.value].StudentClassName);
        const detailData = computed(() =>
            detail.value.Study?.StudyFiles
        );
        const question = computed(
            () =>
                detail.value?.Question?.Answers[0].AnswerFiles.find(
                    (v) => v.Type === 3
                )?.File
        );
        const answer = computed(
            () =>
                detail.value?.Question?.Answers[0].AnswerFiles.find(
                    (v) => v.Type === 3
                )?.File
        );

        const isDisplayPrev = computed(() => currentIndex.value === 0);
        const isDisplayNext = computed(() => currentIndex.value === props.detailList.length - 1);

        const _errorHandle = () => {
            if (detail.value?.Detail?.Result === QuestionResultTypeEnum.ERROR) { return; }
            visible.value = false;
            errorHandle(detail.value?.Detail?.ID, detail.value?.Detail?.Result);
        };

        const _successHandle = () => {
            if (detail.value?.Detail?.Result === QuestionResultTypeEnum.RIGHT) { return; }
            visible.value = false;
            successHandle(detail.value?.Detail?.ID, detail.value?.Detail?.Result);
        };

        const nextPage = () => {
            if (isDisplayNext.value) return;
            currentIndex.value = currentIndex.value + 1;
        };

        const prevPage = () => {
            if (isDisplayPrev.value) return;
            currentIndex.value = currentIndex.value - 1;
        };

        return {
            errorHandle: _errorHandle,
            successHandle: _successHandle,
            detailData,
            question,
            answer,
            visible,
            detail,
            currentIndex,
            className,
            nextPage,
            prevPage,
            isDisplayPrev,
            isDisplayNext,
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

        >p {
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
        max-height: 800px;
        display: flex;
        flex-direction: column;

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
            padding: 10px 20px 0 10px;
            background-color: #fff;
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;

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
                display: flex;
                align-items: center;

                .btn {
                    width: 28px;
                    height: 28px;
                    background: #fff;
                    border: 1px solid #E0E2E7;
                    color: #19203D;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;

                    &:first-child {
                        margin-right: 16px;
                    }

                    &:last-child {
                        margin-left: 16px;
                    }

                    &.display {
                        background: #D4D6D9;
                        border: none;
                        color: #fff;
                    }
                }

                i {
                    cursor: pointer;
                }
            }
        }
    }
}
</style>
