<template>
    <el-dialog v-model="visible" title="选择视频" width="60%" center @close="close">
        <div class="dia-row">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-cascader v-model="subjectPublisherBookValue" :options="subjectPublisherBookList"
                                 :props="{ value: 'Value', children: 'Children', label: 'Lable' }">
                    </el-cascader>
                </el-col>
                <el-col :span="12">
                    <el-select v-model="chaptersValue" placeholder="Select">
                        <el-option v-for="item in chaptersList" :key="item.ID" :label="item.Name" :value="item.ID">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <div class="dia-card-list">
                <el-table :data="videoList" height="400" border style="width: 100%">
                    <el-table-column width="55" align="center">
                        <template #default="scope">
                            <el-checkbox
                                v-model="scope.row.isChecked"
                                @change="(v) => check(v, scope.row)"
                            ></el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ElementName" label="文件名称" width="400" align="center"></el-table-column>
                    <el-table-column prop="LessonName" label="所属课时" align="center"></el-table-column>
                </el-table>
            </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="handleComfirm">确定</el-button>
          </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, watch, reactive, onMounted } from "vue";
import { getSubjectPublisherBookListVideo, getChaptersVideo, getElementsVideo } from "@/api/home";

interface ITreeList {
    Value: string,
    Lable: string,
    Children?: ITreeList[]
}

interface IChaptersList {
    ID: string,
    Name: string,
}

interface IVideoList {
    ID:string,
    isChecked?: boolean,
    ElementName: string,
    LessonName: string
}

interface IElementsVideo {
    chapterID: string,
    fileType: number
}

interface State {
    subjectPublisherBookList: ITreeList[],
    subjectPublisherBookValue: string[],
    chaptersList: IChaptersList[],
    chaptersValue: string,
    videoList: any[]
}

export default defineComponent({
    name: "selectVideoDialog",
    props: {
        dialogVisible: {
            type: Boolean,
            default: false,
            require: true
        }
    },
    emits: ["update:dialogVisible", "selectVideoVal"],
    setup(props, { emit }) {
        const state = reactive<State>({
            subjectPublisherBookList: [],
            subjectPublisherBookValue: [],
            chaptersList: [],
            chaptersValue: "",
            videoList: []
        });

        const visible = computed(() => props.dialogVisible);

        const check = (v:any, row: IVideoList) => {
            if (v) {
                state.videoList.map((item) => {
                    if (item.ID !== row.ID) {
                        item.isChecked = false;
                        // set(item, "isChecked", false);
                    }
                });
            }
        };

        onMounted(() => {
            _getSubjectPublisherBookListVideo();
        });

        watch(() => state.subjectPublisherBookValue, (curVal) => {
            _getChaptersVideo({ bookID: curVal[2] });
        });
        watch(() => state.chaptersValue, (curVal) => {
            _getElementsVideo(curVal);
        });

        const findFirstId = (tree: ITreeList[], ids: string[]) => {
            tree.forEach((item) => {
                ids.push(item.Value);
                if (item.Children && item.Children.length > 0) {
                    findFirstId([item.Children[0]], ids);
                }
            });
            return ids;
        };

        const _getSubjectPublisherBookListVideo = () => {
            getSubjectPublisherBookListVideo().then(res => {
                if (res.resultCode === 200) {
                    state.subjectPublisherBookList = res.result;
                    state.subjectPublisherBookValue = findFirstId([state.subjectPublisherBookList[0]], []);
                }
            });
        };

        const _getChaptersVideo = (data: { bookID:string }) => {
            getChaptersVideo(data).then(res => {
                if (res.resultCode === 200) {
                    state.chaptersList = res.result;
                    if (Array.isArray(state.chaptersList) && state.chaptersList.length > 0) {
                        state.chaptersValue = state.chaptersList[0].ID;
                    } else {
                        state.chaptersValue = "";
                    }
                }
            });
        };

        const _getElementsVideo = (ID: string) => {
            const data: IElementsVideo = {
                chapterID: ID,
                fileType: 5
            };
            getElementsVideo(data).then(res => {
                if (res.resultCode === 200) {
                    state.videoList = res.result;
                }
            });
        };

        const handleComfirm = () => {
            const row = state.videoList.find((item) => {
                return item.isChecked;
            });

            const pauses = row.FilePauses ? row.FilePauses.filter((item: any) => item.Type === 1).map((item: any) => ({ time: item.Time.split(".")[0] })) : [];

            const follow = {
                id: row.ElementFile.ID,
                src: row.ElementFile.FilePath + "/" + row.ElementFile.FileName + "." + row.ElementFile.Extention,
                pauseList: pauses,
                fileID: row.ElementID
            };
            emit("selectVideoVal", follow);
        };

        const close = () => {
            emit("update:dialogVisible", false);
        };

        return {
            ...toRefs(state),
            visible,
            check,
            close,
            handleComfirm
        };
    }
});

</script>

<style scoped lang="scss">
.dia-row {
    :deep(.el-cascader), :deep(.el-select) {
        width: 100%;
        margin-bottom: 10px;
    }
}

.dia-card-list{
    margin-top: 20px;
    height: 400px;
    overflow-y: auto;
}
</style>
