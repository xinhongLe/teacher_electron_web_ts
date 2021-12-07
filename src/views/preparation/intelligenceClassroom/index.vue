<template>
    <div class="intelligence">
        <div class="left" v-if="showList">
            <div>
                <div class="left-content">
                    <div
                        class="win-box"
                        v-for="(item, index) in winList"
                        :key="index"
                    >
                        <div>
                            <div
                                v-for="(j, i) in item.TeachPageList"
                                :key="i"
                                :class="[
                                    'win-bottom',
                                    leftActiveIndex === index && winIndex === i
                                        ? 'active'
                                        : '',
                                ]"
                                @click="handleClickWin(j, i, index)"
                            >
                                <p>{{ item.Lesson.Name }}</p>
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    :content="j.WindowName"
                                    placement="bottom-start"
                                >
                                    <div>{{ j.WindowName }}</div>
                                </el-tooltip>
                                <div class="win-bottom-edit">
                                    <i class="el-icon-edit-outline" @click="windowEdit(item)"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="right">
            <div class="right-bottom">
                 <div class="card-box-away" @click="showList = !showList">
                    <span v-if="showList">《</span>
                    <span v-if="!showList">》</span>
                </div>
                <div class="card-box-left">
                    <CardList
                        ref="cardListComponents"
                        :winActiveId="winActiveId"
                        :cardList="cardList"
                        @updatePageList="updatePageList"
                    />
                </div>
                <div class="card-detail">
                    <div class="card-detail-content">
                        <PreviewSection
                            :hideTools="hideTools"
                            :uuid="cardUuid"
                            :isPreview="isPreview"
                            :options="previewOptions"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { store } from "@/store";
import { defineComponent, onMounted, ref, toRefs, watch } from "vue";
import userSelectBookInfo from "./hooks/userSelectBookInfo";
import CardList from "./cardList/index.vue";
import PreviewSection from "./components/preview/previewSection.vue";
import { useRouter } from "vue-router";
import { CopyWindow } from "./api/index";
export default defineComponent({
    components: {
        CardList, PreviewSection
    },
    setup() {
        const router = useRouter();
        const chapterID = ref(store.state.preparation.selectChapterID);
        const showList = ref(true);
        const { activeIndex, allData, cardListComponents, _getSchoolLessonWindow, handleClickWin, _getWindowCards, updatePageList } = userSelectBookInfo();
        watch(
            () => store.state.preparation.selectChapterID,
            () => {
                chapterID.value = store.state.preparation.selectChapterID;
                const obj = { chapterID: chapterID.value };
                _getSchoolLessonWindow(obj);
            }
        );
        watch(
            () => activeIndex.winActiveId,
            (val) => {
                if (val) {
                    _getWindowCards(val);
                }
            }
        );
        onMounted(() => {
            const obj = { chapterID: chapterID.value };
            _getSchoolLessonWindow(obj);
        });
        const windowEdit = async (item) => {
            if (item.TeachPageList[0].OriginType === 0) {
                const obj = {
                    id: item.TeachPageList[0].WindowID,
                    originType: 1,
                    sourceLessonID: item.Lesson.ID
                };
                const res = await CopyWindow(obj);
                if (res.resultCode === 200) {
                    router.push({
                        path: "/windowcard-edit",
                        query: {
                            winValue: res.result.ID,
                            originType: 1
                        }
                    });
                }
            } else {
                router.push({
                    path: "/windowcard-edit",
                    query: {
                        winValue: item.TeachPageList[0].WindowID,
                        originType: 1
                    }
                });
            }
        };
        return {
            showList,
            ...toRefs(allData),
            ...toRefs(activeIndex),
            handleClickWin,
            updatePageList,
            windowEdit,
            cardListComponents
        };
    }
});
</script>

<style lang="scss" scoped>
$border-color: #f5f6fa;
.intelligence {
    display: flex;
    flex: 1;
    padding: 20px;
    background-color: #f5f6fa;
    .left {
        position: relative;
        width: 280px;
        height: calc(100vh - 170px);
        padding-bottom: 40px;
        background-color: #fff;
        > div {
            height: 100%;
            .left-top {
                padding: 10px;
                .el-cascader {
                    width: 100%;
                }
                .select-bottom {
                    margin-top: 10px;
                    .el-select {
                        width: 100%;
                    }
                }
            }
            .left-content {
                height: 100%;
                overflow-y: auto;
                padding: 20px;
                border-top: 1px solid $border-color;
                .win-box {
                    margin-bottom: 20px;
                    .win-top {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 20px;
                        font-weight: 600;
                        .el-button {
                            padding: 0px;
                        }
                    }
                    .win-no,
                    .win-bottom {
                        padding: 26px;
                        cursor: not-allowed;
                        background-color: #ffefc5;
                        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                    }
                    .win-no {
                        p {
                            padding-bottom: 8px;
                        }
                    }
                    .win-bottom {
                        background-color: #a5b8f6;
                        cursor: pointer;
                        margin-bottom: 20px;
                        position: relative;
                        border-radius: 8px;
                        > span {
                            position: absolute;
                            right: 8px;
                            top: 4px;
                            font-size: 12px;
                            cursor: pointer;
                            color: #000;
                        }
                        p {
                            color: #000;
                            overflow: hidden;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            padding-bottom: 8px;
                        }
                        div {
                            padding-top: 5px;
                            font-size: 20px;
                            color: #000;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            margin-bottom: 20px;
                        }
                    }
                    .win-bottom-edit{
                        position: absolute;
                        bottom: 0;
                        right: 10px;
                        color:white;
                    }

                    .active {
                        background: #5560f1;
                        p {
                            color: #fff;
                        }
                        div {
                            color: #fff;
                        }
                        span {
                            color: #fff;
                        }
                    }
                    .active:after {
                        display: block;
                        content: "";
                        width: 20px;
                        height: 20px;
                        background-color: #5560f1;
                        transform: rotate(45deg);
                        position: absolute;
                        right: -5px;
                        top: 40px;
                    }
                }
            }
        }
        .add-ks {
            position: absolute;
            bottom: 10px;
            left: 0;
            width: 100%;
            height: 40px;
            line-height: 40px;
            text-align: center;
            color: #4b71ee;
            font-size: 12px;
            cursor: pointer;
            background-color: #fff;
        }
        .expandcoll {
            position: absolute;
            top: 50%;
            right: 0;
            width: 50px;
            height: 50px;
            img {
                width: 50px;
                height: 50px;
            }
        }
    }
    .right {
        display: flex;
        justify-content: space-between;
        flex: 1;
        min-width: 0;
        margin-left: 20px;
        background-color: #fff;
        .right-top {
            height: 80px;
            line-height: 80px;
            border-bottom: 1px solid $border-color;
            text-align: center;
            padding: 0 20px;
            > p {
                float: left;
            }
            > div {
                cursor: pointer;
            }
        }

        .right-bottom {
            position: relative;
            display: flex;
            flex: 1;
            justify-content: space-between;
            .card-box-away{
                position: absolute;
                top: calc(50% - 60px);
                left: -20px;
                width: 20px;
                height: 120px;
                background: #fff;
                display: flex;
                align-items: center;
                font-size: 20px;
            }
            .card-box-left {
                height: 100%;
                overflow-y: auto;
                width: 180px;
                text-align: center;
                padding: 20px 0;
                box-sizing: border-box;
                border-right: 1px solid $border-color;
            }

            .card-detail {
                flex: 1;
                min-width: 0;
                display: flex;
                justify-content: space-between;
                .card-detail-content {
                    height: 100%;
                    display: flex;
                    flex: 1;
                    justify-content: space-between;
                }

                .me-page {
                    background-color: #fff;
                    display: flex;
                    flex-wrap: nowrap;
                    padding: 15px;
                    background-color: #fff;
                    border-top: 1px solid #ccc;
                    .me-page-item {
                        background-color: #f0f3ff;
                        color: #444;
                        padding: 10px 20px;
                        box-sizing: border-box;
                        text-align: center;
                        min-width: 100px;
                        font-size: 14px;
                        white-space: nowrap;
                        margin-right: 10px;
                        border: 2px solid #f0f3ff;
                        cursor: pointer;
                        position: relative;

                        &.active {
                            border: 2px solid #6675f4;
                        }
                    }
                }
            }
        }
    }
}
</style>
