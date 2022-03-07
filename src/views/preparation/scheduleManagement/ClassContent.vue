<template>
    <div class="class-content">
        <div class="btn-list" ref="btnListRef" v-if="isOperator">
            <p @click="move">
                <i class="el-icon-rank"></i>
                <span>移动</span>
            </p>
            <p @click="copy">
                <i class="el-icon-document-copy"></i>
                <span>复制</span>
            </p>
            <p @click="exit">
                <i class="el-icon-circle-close"></i>
                <span>取消</span>
            </p>
        </div>
        <div class="title-bar">
            <div
                class="bag"
                v-for="bag in bagList"
                :key="bag?.ID"
                :class="{ active: bag.ID === selectBag?.ID }"
            >
                {{ bag?.Name }}
            </div>
            <div class="icon-list-warp" v-if="selectBag?.ID && isOperator">
                <div class="icon-warp" @click="dialogVisible = true">
                    <i
                        class="el-icon-edit-outline"
                    ></i>
                </div>
                <div class="icon-warp" @click="delCourse">
                    <i
                        class="el-icon-delete"
                    ></i>
                </div>
            </div>
        </div>
        <div class="contentBox" v-if="selectBag?.ID">
            <div
                class="container"
                v-for="(item, index) in classContentList"
                :key="index"
            >
                <p class="classTitle">{{ item.title }}</p>
                <div v-if="item.content.length >= 1">
                    <div
                        class="problem question-before question-after"
                        v-for="(data, i) in item.content"
                        :key="i"
                        :draggable="isOperator"
                        @drop="onDrop($event, index, data)"
                        @dragover="onDragOver($event, i, index)"
                        @dragstart="onDragStart($event, data)"
                        @drag="onDrag"
                        @dragend="onDragEnd"
                        @dragleave="onDragleave"
                    >
                        <div
                            class="problem_item"
                            :class="isDragging ? 'drag' : ''"
                            @click="lookVideo(data.FileID)"
                            v-if="data.HasVideo"
                        >
                            <div>
                                <img
                                    src="@/assets/images/attend-class/icon_shipin.png"
                                    alt=""
                                />
                                <p class="className">
                                    {{ data.Name
                                    }}<span
                                        >{{ data.AlbumName }}&nbsp;{{
                                            data.ChapterName
                                        }}&nbsp;{{ data.LessonName }}</span
                                    >
                                </p>
                            </div>
                            <span>{{
                                data.File?.Duration &&
                                data.File.Duration.substring(3, 8)
                            }}</span>
                            <div class="problem_border"></div>
                        </div>
                        <div
                            class="problem_item"
                            @click="
                                data.Type === 1
                                    ? lookQuestions(data.ID)
                                    : openFile(data.File)
                            "
                            :class="isDragging ? 'drag' : ''"
                        >
                            <div class="content">
                                <FileType
                                    :fileExtension="
                                        data.Type === 1
                                            ? ''
                                            : data?.File?.Extention
                                    "
                                />
                                <p class="className">
                                    {{ data.Name }}
                                    <span
                                        >{{ data.AlbumName }}&nbsp;{{
                                            data.ChapterName
                                        }}&nbsp;{{ data.LessonName }}
                                    </span>
                                </p>
                            </div>
                            <span v-if="data.Type === 1">{{
                                data.QuestionCount
                            }}</span>
                        </div>
                        <img
                            class="icon_delete"
                            src="@/assets/images/attend-class/icon_delete_red.png"
                            @click="delCourseware(data.ID)"
                            alt=""
                            v-if="isOperator"
                        />
                    </div>
                </div>

                <div
                    class="problem_null"
                    v-else
                    @drop="onDrop($event, index)"
                    @dragover="dragoverEmpty($event, index)"
                >
                    <img
                        :src="
                            require('@/assets/images/attend-class/pic_' +
                                index +
                                '.png')
                        "
                        alt=""
                    />
                    <p>请添加{{ item.title }}</p>
                </div>
            </div>
        </div>
        <div class="no-data" v-else>
            <img src="@/assets/images/preparation/pic_noclass@2x.png" />
            <p>未选择课包</p>
        </div>
        <ClassBagDialog
            v-model:dialogVisible="dialogVisible"
            v-if="dialogVisible"
            :isEdit="true"
            :lessonOrBagValue="selectBag"
        />
    </div>
</template>

<script lang="ts">
import { store } from "@/store";
import { ElMessage, ElMessageBox } from "element-plus";
import { computed, defineComponent, inject, ref, watch } from "vue";
import { delCourseBagTeacher, updateCourseWareListOfTeacher } from "../api";
import ClassBagDialog from "./ClassBagDialog.vue";
import useDrag from "@/hooks/useDrag";
import useDrop from "./hooks/useDrop";
import { lookVideo, lookQuestions, openFile } from "@/utils";
import FileType from "@/components/fileType/index.vue";
import { ElementFile } from "@/types/preparation";
import { getOssUrl } from "@/utils/oss";
import emitter from "@/utils/mitt";
import { find, pullAllBy } from "lodash";
import { bagKey } from "@/hooks/useBag";
import { onClickOutside } from "@vueuse/core";
export default defineComponent({
    setup() {
        const dialogVisible = ref(false);

        const { bagList, selectBag, classContentList, queryClassContentList } =
            inject(bagKey)!;

        const isOperator = inject("isOperator", true);

        const {
            onDragOver,
            onDrop,
            clearStyle,
            btnListRef,
            exit,
            copy,
            move,
            onDragleave
        } = useDrop(queryClassContentList, classContentList, selectBag);

        const { onDragEnd, onDragStart, onDrag } = useDrag();

        onClickOutside(btnListRef, () => {
            btnListRef.value!.style.zIndex = "-1";
        });

        const _onDragEnd = (e: DragEvent) => {
            clearStyle();
            onDragEnd(e);
        };

        const delCourse = () => {
            ElMessageBox.confirm(
                `确认要删除此课包[${selectBag.value?.Name}]?`,
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }
            )
                .then(async () => {
                    const res = await delCourseBagTeacher({
                        id: selectBag.value?.ID || ""
                    });
                    if (res.resultCode === 200) {
                        ElMessage.success("删除成功!");
                        pullAllBy(
                            bagList.value,
                            [{ ID: selectBag.value?.ID }],
                            "ID"
                        );
                    }
                })
                .catch(() => {
                    ElMessage.info("已取消删除");
                });
        };

        const delCourseware = (id: string) => {
            ElMessageBox.confirm("确定要删除此内容吗?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(async () => {
                    const data = {
                        deletedCourseWareTeacherIDs: [id]
                    };
                    const res = await updateCourseWareListOfTeacher(data);
                    if (res.resultCode === 200) {
                        queryClassContentList();
                        ElMessage.success("删除成功!");
                    }
                })
                .catch(() => ElMessage.info("已取消删除"));
        };

        const dragoverEmpty = (e: DragEvent, index: number) => {
            if (store.state.preparation.isDraggingElement && index !== 1) {
                return;
            }
            e.preventDefault();
        };

        const _openFile = async (file?: ElementFile) => {
            if (file) {
                const name = `${file.FileName}.${file.Extention}`;
                const key = `${file.FilePath}/${name}`;
                const url = await getOssUrl(key, file.Bucket);
                openFile(url, name);
            }
        };

        const _lookQuestions = (id: string) => {
            lookQuestions({ id, type: 3 });
            emitter.off("deleteQuestion");
            emitter.on("deleteQuestion", ({ paperId, questionID }) => {
                const data = {
                    deletedQuestionIDs: [questionID]
                };
                updateCourseWareListOfTeacher(data);
                for (const data of classContentList.value) {
                    const content = data?.content || [];
                    const info = find(content, { ID: paperId });
                    if (info) {
                        info.QuestionCount = info.QuestionCount - 1;
                        return;
                    }
                }
            });
        };

        watch(
            () => store.state.common.isShowQuestion,
            (v) => {
                if (!v) {
                    emitter.off("deleteQuestion");
                }
            }
        );

        return {
            classContentList,
            selectBag,
            exit,
            move,
            onDrop,
            copy,
            clearStyle,
            delCourse,
            delCourseware,
            dialogVisible,
            onDragStart,
            onDrag,
            onDragleave,
            onDragOver,
            dragoverEmpty,
            isDragging: computed(() => store.state.common.isDragging),
            onDragEnd: _onDragEnd,
            lookVideo,
            btnListRef,
            bagList,
            openFile: _openFile,
            isOperator,
            lookQuestions: _lookQuestions
        };
    },
    components: { ClassBagDialog, FileType }
});
</script>

<style lang="scss" scoped>
.btn-list {
    position: fixed;
    left: 0;
    top: 0;
    height: 90px;
    width: 80px;
    background: #fff;
    border-radius: 6px;
    z-index: -1;
    overflow: hidden;
    p {
        text-align: left;
        line-height: 30px;
        padding-left: 12px;
        font-size: 12px;
    }
    p:hover {
        background: #4b71ee;
        color: #fff;
    }
}
.question-before-show:before,
.question-after-show:after {
    background: #ccc !important;
}
.question-before:before {
    content: "";
    display: block;
    margin-bottom: 6px;
    height: 2px;
    background: #e0f8ec;
}
.question-after:after {
    content: "";
    display: block;
    height: 2px;
    margin-top: 6px;
    background: #e0f8ec;
}
.class-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    margin-right: 16px;
    height: 100%;
    background: #e0f8ec;
    border-radius: 4px;
    border: 1px solid #c7eedb;
    .title-bar {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 40px;
        background: #c7eedb;
        font-size: 18px;
        font-weight: 600;
        color: #759c92;
        position: relative;
        .bag {
            &.active {
                color: var(--app-color-dark);
                position: relative;
                &::before {
                    position: absolute;
                    content: "";
                    height: 3px;
                    width: 100%;
                    bottom: -10px;
                    background-color: var(--app-color-primary);
                }
            }
        }
        .icon-list-warp {
            position: absolute;
            display: flex;
            align-items: center;
            right: 10px;
            .icon-warp {
                width: 24px;
                height: 24px;
                background-color: rgba(0, 0, 0, 0.3);
                border-radius: 4px;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #fff;
                &:first-child {
                    margin-right: 12px;
                }
                font-size: 12px;
                cursor: pointer;
            }

        }
    }
    .contentBox {
        width: 100%;
        height: calc(100% - 36px);
        overflow-y: auto;
        padding: 0px 12px;
        .classTitle {
            font-size: 16px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #19203d;
            margin: 12px 0px 8px;
        }
        .classTitle::before {
            content: "";
            display: inline-block;
            width: 4px;
            height: 14px;
            margin-right: 10px;
            background: #58cc97;
            border-radius: 1px;
        }
        .problem {
            border-radius: 4px;
            pointer-events: auto;
            position: relative;
            .problem_item {
                width: 100%;
                padding: 12px;
                background: #ffffff;
                display: flex;
                border: none;
                justify-content: space-between;
                position: relative;
                .content {
                    display: flex;
                    align-items: center;
                }
                &.drag {
                    pointer-events: none;
                }
            }
            .icon_delete {
                position: absolute;
                right: 0px;
                top: 0px;
                cursor: pointer;
            }
            .problem_border {
                width: 92%;
                height: 1px;
                position: absolute;
                right: 0px;
                bottom: 0px;
                background: #e9ecf0;
            }
            img {
                width: 16px;
                height: 16px;
            }
            .className {
                display: inline-block;
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #19203d;
                margin-left: 16px;
                span {
                    font-size: 12px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #5f626f;
                    margin-left: 16px;
                }
            }
        }
        .problem_null {
            width: 100%;
            height: 156px;
            background: #ffffff;
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            img {
                width: 85px;
            }
        }
    }
}
.no-data {
    img {
        width: 200px;
        height: auto;
        margin: auto;
        display: block;
        margin-top: 20vh;
    }
    p {
        font-size: 20px;
        text-align: center;
        margin-top: 50px;
        color: #606266;
    }
}
</style>
