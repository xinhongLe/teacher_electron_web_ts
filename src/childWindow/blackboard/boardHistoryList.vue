<template>
    <div class="board-history-list-warp" @click.stop="">
        <Title title="历史黑板" :close="close" />
        <div class="list">
            <div v-if="historyList.length === 0" class="empty-warp">
                <img src="./ico/img_lishibiji@2x.png"/>
                <span>暂无历史笔迹</span>
            </div>
            <div
                class="item"
                v-for="item in historyList"
                :key="item.CreateTime"
                v-else
            >
                <div class="time-warp" @click="collapseClick(item.CreateTime)">
                    <span>{{ item.CreateTime }}</span>
                    <el-icon color="#bec3d6"><caret-bottom v-if="activeNames.includes(item.CreateTime)"/><caret-top v-else/></el-icon>
                </div>
                <transition name="fade" v-on="on">
                    <div
                        class="img-list-warp"
                        v-show="activeNames.includes(item.CreateTime)"
                    >
                        <div class="img-list">
                            <div
                                class="img-warp"
                                v-for="file in item.BlackBoardFiles"
                                :key="file.ID"
                            >
                                <div class="delete-icon" @click="deleteHistory(file.ID)">
                                    <el-icon :size="16" color="#fff"><delete /></el-icon>
                                </div>
                                <img src="" @error="error($event, file)" @click="enlargeImgClick"/>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
        </div>
        <div class="enlarge-img-warp" v-if="enlargeImgSrc">
            <div class="enlarge-img-content-warp">
                <img :src="enlargeImgSrc">
                <div class="close-btn" @click="enlargeImgSrc = ''">
                    <el-icon :size="30" color="#19203D" class="icon"><close/></el-icon>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { FileInfo } from "@/types/lookQuestion";
import { getOssUrl } from "@/utils/oss";
import { defineComponent, ref } from "vue";
import { deleteBlackboardHistory, fetchBlackboardHistoryList, HistoryList } from "./api";
import Title from "./title.vue";
import { pull } from "lodash";

export default defineComponent({
    setup(props, { emit }) {
        const historyList = ref<HistoryList[]>([]);
        const activeNames = ref<string[]>([]);
        const enlargeImgSrc = ref("");

        const getHistoryList = () => {
            fetchBlackboardHistoryList().then((res) => {
                if (res.resultCode === 200) {
                    historyList.value = res.result;
                    if (historyList.value.length > 0) {
                        activeNames.value.length === 0 && (activeNames.value = [historyList.value[0].CreateTime]);
                    }
                }
            });
        };

        const close = () => {
            emit("update:isShowHistoryBroadList", false);
        };

        const collapseClick = (name: string) => {
            if (activeNames.value.includes(name)) {
                pull(activeNames.value, name);
            } else {
                activeNames.value.push(name);
            }
        };

        const deleteHistory = async (id: string) => {
            await deleteBlackboardHistory({ id });
            getHistoryList();
        };

        const error = async (e: Event, file: FileInfo) => {
            const target = e.target as HTMLImageElement;
            const { FileName, FilePath, Bucket, Extention } = file;
            const key = `${FilePath}/${FileName}.${Extention}`;
            const url = await getOssUrl(key, Bucket);
            target.src = url;
        };

        const enlargeImgClick = (e: Event) => {
            const target = e.target as HTMLImageElement;
            enlargeImgSrc.value = target.src;
        };

        const on = {
            beforeEnter(el: any) {
                if (!el.dataset) el.dataset = {};

                el.dataset.oldPaddingTop = el.style.paddingTop;
                el.dataset.oldPaddingBottom = el.style.paddingBottom;

                el.style.height = "0";
                el.style.paddingTop = 0;
                el.style.paddingBottom = 0;
            },

            enter(el: any) {
                el.dataset.oldOverflow = el.style.overflow;
                if (el.scrollHeight !== 0) {
                    el.style.height = `${el.scrollHeight}px`;
                    el.style.paddingTop = el.dataset.oldPaddingTop;
                    el.style.paddingBottom = el.dataset.oldPaddingBottom;
                } else {
                    el.style.height = "";
                    el.style.paddingTop = el.dataset.oldPaddingTop;
                    el.style.paddingBottom = el.dataset.oldPaddingBottom;
                }

                el.style.overflow = "hidden";
            },

            afterEnter(el: any) {
                el.style.height = "";
                el.style.overflow = el.dataset.oldOverflow;
            },

            beforeLeave(el: any) {
                if (!el.dataset) el.dataset = {};
                el.dataset.oldPaddingTop = el.style.paddingTop;
                el.dataset.oldPaddingBottom = el.style.paddingBottom;
                el.dataset.oldOverflow = el.style.overflow;

                el.style.height = `${el.scrollHeight}px`;
                el.style.overflow = "hidden";
            },

            leave(el: any) {
                if (el.scrollHeight !== 0) {
                    el.style.transitionProperty = "height";
                    el.style.height = 0;
                    el.style.paddingTop = 0;
                    el.style.paddingBottom = 0;
                }
            },

            afterLeave(el: any) {
                el.style.height = "";
                el.style.overflow = el.dataset.oldOverflow;
                el.style.paddingTop = el.dataset.oldPaddingTop;
                el.style.paddingBottom = el.dataset.oldPaddingBottom;
            }
        };

        getHistoryList();
        return {
            close,
            error,
            collapseClick,
            activeNames,
            historyList,
            deleteHistory,
            enlargeImgClick,
            enlargeImgSrc,
            on
        };
    },
    components: { Title }
});
</script>

<style lang="scss" scoped>
.board-history-list-warp {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 414px;
    background: #fff;
    box-shadow: -3px 0px 6px -4px rgba(0, 0, 0, 0.12),
        -6px 0px 16px 0px rgba(0, 0, 0, 0.08),
        -9px 0px 28px 8px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    .enlarge-img-warp {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1;
        background-color: rgba(0, 0, 0, 0.4);
        .enlarge-img-content-warp {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border: 20px solid #f3f7ff;
            border-radius: 8px;
            .close-btn {
                position: absolute;
                top: 0;
                right: 0;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background-color: #ffffff;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                transform: translate(50%, -50%);
            }
            img {
                width: 1332px;
                height: 712px;
            }
        }
    }
    .fade-enter-active,
    .fade-leave-active {
        transition: 0.3s height ease-in-out, 0.3s padding-top ease-in-out,
            0.3s padding-bottom ease-in-out;
    }
    .list {
        flex: 1;
        overflow: overlay;
        .empty-warp {
            border-top: 1px solid #ECEDF0;
            padding-top: 160px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            font-size: 20px;
            font-weight: 400;
            color: #5F626F;
            flex-shrink: 0;
            overflow: hidden;
            img {
                width: 240px;
            }
            span {
                height: 28px;
                line-height: 28px;
            }
        }
        .item {
            border-top: 1px solid #ecedf0;
            .time-warp {
                cursor: pointer;
                display: flex;
                color: #9296a8;
                font-size: 16px;
                height: 54px;
                align-items: center;
                justify-content: space-between;
                padding: 0 24px;
            }
            .img-list-warp {
                background-color: #f5f6fa;
                .img-list {
                    padding: 24px;
                }
                .img-warp {
                    width: 366px;
                    height: 206px;
                    border-radius: 4px;
                    margin-top: 16px;
                    position: relative;
                    .delete-icon {
                        cursor: pointer;
                        border-radius: 4px;
                        position: absolute;
                        bottom: 12px;
                        right: 12px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 36px;
                        height: 36px;
                        background-color: rgba(0, 0, 0, 0.4);
                    }
                    &:first-child {
                        margin-top: 0;
                    }
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }
    }
}
</style>
