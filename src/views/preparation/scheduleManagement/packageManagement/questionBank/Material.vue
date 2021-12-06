<template>
    <div class="container">
        <div v-if="materialList.length === 0" class="empty">
            <img
                src="@/assets/images/attend-class/pic_wuneirong@2x.png"
                class="empty-img"
            />
            <span class="empty-text">暂无素材，请自定义添加</span>
        </div>
        <div v-else class="material-list">
            <div
                class="material-item"
                v-for="item in materialList"
                :key="item.ID"
                draggable="true"
                @dragstart="onDragStart($event, item)"
                @drag="onDrag"
                @dragend="onDragEnd"
            >
                <img
                    src="@/assets/images/attend-class/icon_yidong@2x.png"
                    alt=""
                    class="icon"
                />
                <div class="item-conent" @click="openFile(item.ElementFile)">
                    <FileType :fileType="item.FileType" />
                    <div class="file-name" :title="getFileName(item)">
                        {{ getFileName(item) }}
                    </div>
                    <div class="lesson-name">
                        {{ item.LessonName }}
                    </div>
                </div>
                <el-dropdown trigger="click" >
                    <div class="edit-icon">
                        <i />
                        <i />
                        <i />
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu trigger="click">
                            <el-dropdown-item
                                icon="el-icon-edit-outline"
                                @click="editMaterial(item)"
                                >编辑</el-dropdown-item
                            >
                            <el-dropdown-item
                                icon="el-icon-delete"
                                @click="_deleteMaterial(item.ID)"
                                >删除</el-dropdown-item
                            >
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
        <el-button type="primary" plain @click="addMaterial" class="add-btn"
            >添加自定义素材</el-button
        >
        <AddOrEditMaterial
            :lessons="lessons"
            v-model:dialogVisible="dialogVisible"
            @addSuccess="addSuccess"
            :isEdit="isEdit"
            :chapterID="chapterID"
            v-if="dialogVisible"
            :editInfo="editInfo"
        />
    </div>
</template>

<script lang="ts">
import { ElementFile, Lesson, Material } from "@/types/preparation";
import { downloadFile } from "@/utils/oss";
import { deleteMaterial, queryMaterialList } from "@/views/preparation/api";
import { defineComponent, PropType, ref, watchEffect } from "vue";
import FileType from "./FileType.vue";
import AddOrEditMaterial from "./AddOrEditMaterial.vue";
import useMaterialDialog from "./hooks/useMaterialDialog";
import useDrag from "@/hooks/useDrag";
import { MutationTypes, store } from "@/store";
export default defineComponent({
    props: {
        lessonID: {
            type: String as PropType<string | null>,
            required: true
        },
        chapterID: {
            type: String,
            required: true
        },
        lessons: {
            type: Array as PropType<Lesson[]>,
            required: true
        }
    },
    setup(props) {
        const materialList = ref<Material[]>([]);
        const { dialogVisible, isEdit, editInfo, editMaterial, addMaterial } = useMaterialDialog();
        const { onDrag, onDragEnd, onDragStart } = useDrag();

        const _queryMaterialList = async () => {
            const res = await queryMaterialList({
                ChapterID: props.chapterID,
                LessonID: props.lessonID
            });
            if (res.resultCode === 200) {
                materialList.value = res.result;
            }
        };

        const getFileName = (info: Material) => {
            if (info.ElementFile) {
                return `${info.ElementFile.Name}.${info.ElementFile.Extention}`;
            }
            return info.ElementName;
        };

        const openFile = async (file: ElementFile) => {
            if (file) {
                const key = `${file.FilePath}/${file.FileName}.${file.Extention}`;
                const url = await downloadFile(key, file.Bucket);
                window.open(url);
            }
        };

        const _deleteMaterial = async (id: string) => {
            const res = await deleteMaterial({ id });
            if (res.resultCode === 200) {
                _queryMaterialList();
            }
        };

        const addSuccess = () => {
            _queryMaterialList();
        };

        const _onDragStart = (e: DragEvent, info: Material) => {
            const data = {
                info,
                isElement: true
            };
            store.commit(MutationTypes.SET_IS_DRAGGING_ELEMENT, true);
            onDragStart(e, data);
        };

        watchEffect(_queryMaterialList);

        return {
            materialList,
            openFile,
            _deleteMaterial,
            addMaterial,
            addSuccess,
            dialogVisible,
            editInfo,
            isEdit,
            onDragStart: _onDragStart,
            onDrag,
            onDragEnd,
            editMaterial,
            getFileName
        };
    },
    components: { FileType, AddOrEditMaterial }
});
</script>

<style lang="scss" scoped>
.container {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
    .add-btn {
        align-self: center;
    }
    .empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        .empty-img {
            width: 136px;
        }
        .empty-text {
            font-size: 14px;
            color: #5f626f;
            margin: 20px 0;
        }
    }
    .material-list {
        overflow-y: overlay;
        margin-bottom: 12px;
    }
    .material-item {
        padding: 0 16px;
        display: flex;
        align-items: center;
        width: 100%;
        height: 40px;
        background: #fff;
        margin-bottom: 12px;
        border-radius: 4px;
        .icon {
            width: 16px;
            margin-right: 16px;
        }
        .item-conent {
            display: flex;
            align-items: center;
            flex: 1;
            overflow: hidden;
            line-height: 16px;
            cursor: pointer;
        }

        .file-name {
            margin-left: 16px;
            font-size: 14px;
            color: #19203d;
            font-weight: 400;
            width: 40%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .lesson-name {
            color: #5f626f;
            font-size: 12px;
            margin-left: 16px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .edit-icon {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 16px;
            height: 16px;
            flex-shrink: 0;
            margin-left: 16px;
            cursor: pointer;
            i {
                width: 3px;
                height: 3px;
                border-radius: 50%;
                background: #5f626f;
            }
        }
    }
}
</style>
