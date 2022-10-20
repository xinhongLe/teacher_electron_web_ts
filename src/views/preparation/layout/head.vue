<template>
    <div class="p-layout-head">
        <div class="p-head-filter">
            <div class="p-filter-content">
                <div
                    class="my-course-cart"
                    :class="{
                        active: source === 'me',
                        hide: packageCount === 0,
                    }"
                    :style="
                        'font-size:' + (packageCount > 99 ? '12px' : '14px')
                    "
                    id="myCourseCart"
                    :num="packageCount > 99 ? '99+' : packageCount"
                    @click="
                        source = 'me';
                        onSourceChange();
                        clicKBuryPoint('我的备课包');
                    "
                >
                    <img src="@/assets/images/preparation/cart.png" alt="" />
                    我的备课包
                </div>
                <el-radio-group
                    class="custom-radio"
                    v-model="source"
                    @change="onSourceChange"
                >
                    <el-radio-button
                        v-for="item in sourceList"
                        :key="item.value"
                        :label="item.value"
                        >{{ item.label }}</el-radio-button
                    >
                </el-radio-group>
            </div>
            <div
                class="p-course-cart-options"
                @click="
                    openCourseCartOptions(), clicKBuryPoint('备课包操作记录')
                "
            >
                <img
                    src="@/assets/images/preparation/icon_chakan@2x.png"
                    alt=""
                />
                备课包操作记录
            </div>
            <div class="p-control-btns">
                <el-button
                    type="primary"
                    @click="openUpload(), clicKBuryPoint('上传')"
                >
                    &nbsp;&nbsp;&nbsp;
                    <el-icon :size="12"><plus /></el-icon>
                    &nbsp;上&nbsp;传&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </el-button>
                <img
                    class="refresh-btn"
                    @click="refreshResourceList(), clicKBuryPoint('刷新')"
                    src="@/assets/images/preparation/icon_shuaxin_rest.svg"
                    alt=""
                />
            </div>
        </div>
        <div class="p-head-filter">
            <div class="p-filter-content">
                <el-radio-group
                    class="custom-radio-two"
                    v-model="type"
                    @change="onTypeChange"
                >
                    <el-radio-button
                        v-for="item in typeList"
                        :key="item.Id"
                        :label="item.Id"
                        >{{ item.Name }}</el-radio-button
                    >
                </el-radio-group>
            </div>
        </div>

        <el-dialog
            class="custom-dialog"
            v-model="uploadResourceOpen"
            center
            :title="currentEditType === 'edit' ? '编辑资源' : '上传资源'"
            width="550px"
            :destroy-on-close="true"
        >
            <el-form class="custom-form" :model="form" label-width="100px">
                <el-form-item
                    label="资源："
                    required
                    v-if="!isWincard || currentEditType === 'add'"
                >
                    <el-upload
                        ref="upload"
                        action=""
                        :accept="acceptList"
                        :show-file-list="true"
                        :before-remove="beforeRemove"
                        :before-upload="beforeUpload"
                        :http-request="(e) => uploadSuccess(e, index)"
                        :file-list="fileList"
                        :limit="
                            currentEditType === 'edit' && form.files.length > 0
                                ? 1
                                : 5
                        "
                        :on-exceed="onExceed"
                    >
                        <el-button
                            type="primary"
                            style="font-size: 14px"
                        >
                            &nbsp;&nbsp;&nbsp;
                            <el-icon :size="14"><upload /></el-icon>
                            &nbsp;上&nbsp;传&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="资源文件：" v-else>
                    <el-button
                        type="primary"
                        style="font-size: 14px"
                        @click="editWincard()"
                    >
                        &nbsp;&nbsp;&nbsp;
                        <el-icon :size="14"><Edit /></el-icon>
                        &nbsp;编&nbsp;辑&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </el-button>
                </el-form-item>
                <el-form-item
                    label="资源名称："
                    required
                    v-if="form.files.length < 2"
                >
                    <el-input v-model="form.name" />
                </el-form-item>
                <el-form-item label="类型：" required>
                    <el-radio-group
                        class="custom-radio"
                        v-model="form.type"
                    >
                        <el-radio-button
                            v-for="item in typeList.slice(1)"
                            :disabled="
                                [
                                    RESOURCE_TYPE.TEACHING_AIDS,
                                    RESOURCE_TYPE.TOOL
                                ].indexOf(item.Id) > -1
                            "
                            :key="item.Id"
                            :label="item"
                        >
                            {{ item.Name }}
                        </el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="目录：" required>
                    <div
                        class="select-box"
                        v-for="(item, index) in form.directorys"
                        :key="index"
                    >
                        <CustomSelect
                            v-model:directory="form.directorys[index]"
                        />

                        <div class="delete-icon-box">
                            <img
                                class="delete-icon"
                                v-if="index > 0"
                                src="@/assets/images/preparation/btn_delete_red.png"
                                alt=""
                                @click="deleteDirectory(index)"
                            />
                        </div>
                    </div>
                    <el-button
                        class="add-btn"
                        type="default"
                        @click="addDirectory(), clicKBuryPoint('新增目录')"
                    >
                        新增目录
                    </el-button>
                </el-form-item>
                <el-form-item label="难易程度：">
                    <el-select
                        v-model="form.degree"
                        placeholder="请选择"
                        class="select-block"
                    >
                        <el-option label="高" value="1" />
                        <el-option label="中" value="2" />
                        <el-option label="易" value="3" />
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="关联知识点：">
					<el-select
						class="select-block"
						v-model="form.knowledge"
						placeholder="请选择"
					>
						<el-option
							v-for="item in chapterList"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						/>
					</el-select>
				</el-form-item> -->
                <el-form-item>
                    <el-checkbox
                        v-model="form.isSchool"
                        label="是否保存为校本资源"
                    />

                    <!-- <el-checkbox
						v-if="form.isSchool"
						v-model="form.isShelf"
						label="上架"
					/> -->
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="uploadResourceOpen = false"
                        >取消</el-button
                    >
                    <el-button
                        type="primary"
                        @click="sureUpload(), clicKBuryPoint('保存')"
                    >
                        确认
                    </el-button>
                </span>
            </template>
        </el-dialog>

        <el-dialog
            class="custom-dialog"
            v-model="courseCartOpen"
            center
            title="备课包操作记录"
            width="1200px"
            :destroy-on-close="true"
        >
            <el-date-picker
                v-model="dateRange"
                type="daterange"
                start-placeholder="请选择开始时间"
                end-placeholder="请选择结束时间"
                @change="dateRangeChange"
            />
            <el-table class="custom-table" :data="tableData" stripe>
                <el-table-column width="140px" prop="time" label="操作时间" />
                <el-table-column width="120px" prop="name" label="动作" />
                <el-table-column width="120px" prop="type" label="资源类型" />
                <el-table-column prop="resource" label="资源名称" />
                <el-table-column
                    prop="directory"
                    label="资源目录"
                ></el-table-column>
            </el-table>

            <div class="p-pagination" v-if="total > 10">
                <el-pagination
                    small
                    background
                    layout="prev, pager, next"
                    :total="total"
                    v-model="pageNumber"
                    @current-change="pageChange"
                />
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    onUnmounted,
    PropType,
    reactive,
    ref,
    toRefs,
    watch,
} from "vue";
import { Plus, Refresh, Upload, Edit } from "@element-plus/icons-vue";
import {
    editResource,
    fetchMyPackageNum,
    fetchResourceType,
    getCartOptionList,
    ILesson,
    IResourceItem,
    uploadResource,
} from "@/api/resource";
import CustomSelect from "./customSelect.vue";
import { ElMessage } from "element-plus";
import useUploadFile from "@/hooks/useUploadFile";
import emitter from "@/utils/mitt";
import { MutationTypes, useStore } from "@/store";
import { getOssUrl } from "@/utils/oss";
import { useRouter } from "vue-router";
import moment from "moment";
import usePageEvent from "@/hooks/usePageEvent"; //埋点事件hooks
import { EVENT_TYPE } from "@/config/event";
import { RESOURCE_TYPE } from "@/config/resource";
interface IDirectoryItem {
    id: string;
    name: string;
    bookId?: string;
}

interface IDirectory {
    schoolSection: IDirectoryItem;
    subject: IDirectoryItem;
    version: IDirectoryItem;
    grade: IDirectoryItem;
    chapter: IDirectoryItem;
    lesson: IDirectoryItem;
}

interface IFile {
    uid: number;
    extension: string;
    md5: string;
    fileName: string;
    size: number;
}

interface IForm {
    resourceId: string;
    name: string;
    type: {
        Id: string;
        Name: string;
    };
    directorys: IDirectory[];
    degree: string;
    knowledge: string;
    files: IFile[];
    isSchool: boolean;
    isShelf: boolean;
}

interface ICourse {
    chapterId: string;
    lessonId: string;
    lessonName: string;
    chapterName: string;
}

interface ICourseCartOption {
    time: string;
    name: string;
    type: string;
    resource: string;
    directory: string;
}

export default defineComponent({
    props: {
        course: {
            type: Object as PropType<ICourse>,
            required: true,
        },
    },
    components: { Plus, Refresh, Upload, CustomSelect, Edit },
    emits: ["update:source", "update:type"],
    setup(props, { emit }) {
        const { createBuryingPointFn } = usePageEvent("备课"); //备课埋点
        const store = useStore();
        const userId = computed(() => store.state.userInfo.userCenterUserID);
        const selectedBook = computed(
            () => store.state.preparation.subjectPublisherBookValue
        );
        const { course } = toRefs(props);
        let isInit = true;
        watch(course, () => {
            getMyPackageNum();
        });
        const packageCount = ref(0);
        const getMyPackageNum = async () => {
            isInit = false;
            if (!course.value.chapterId || !course.value.lessonId) {
                packageCount.value = 0;
                return;
            }
            const res = await fetchMyPackageNum({
                chapterId: course.value.chapterId,
                lessonId: course.value.lessonId,
            });

            packageCount.value = res.result.BagCount;
            if (packageCount.value > 0 && isInit) {
                source.value = "me";
                emit("update:source", source.value);
            }
        };

        emitter.on("updatePackageCount", () => {
            getMyPackageNum();
        });

        const currentEditType = ref("add");
        const isWincard = ref(false);
        let cacheResource: IResourceItem;

        emitter.on("openEditResource", async (resource) => {
            cacheResource = resource;
            form.name = resource.Name;
            form.type = {
                Id: resource.ResourceType,
                Name: resource.ResourceTypeName,
            };

            form.directorys = resource.TextBooks.map((item) => {
                return {
                    schoolSection: {
                        id: item.AcaSectionId,
                        name: item.AcaSectionName,
                    },
                    subject: {
                        id: item.SubjectID,
                        name: item.SubjectName,
                    },
                    version: {
                        id: item.PublisherID,
                        name: item.PublisherName,
                    },
                    grade: {
                        bookId: item.BookId,
                        id: item.AlbumID,
                        name: item.AlbumName,
                    },
                    chapter: {
                        id: item.ChapterID,
                        name: item.ChapterName,
                    },
                    lesson: {
                        id: item.LessonID,
                        name: item.LessonName,
                    },
                };
            });

            if (resource.ResourceShowType === 0) {
                fileList.value = [];
                const url = await getOssUrl(
                    `${resource.File.FilePath}/${resource.File.FileMD5}.${resource.File.FileExtention}`,
                    resource.File.FileBucket
                );
                fileList.value.push({
                    name: resource.File.FileName,
                    url,
                });
                form.files = [
                    {
                        uid: 20121130,
                        extension: resource.File.FileExtention,
                        md5: resource.File.FileMD5,
                        fileName: resource.File.FileName,
                        size: resource.File.Size,
                    },
                ];
            }

            isWincard.value = resource.ResourceShowType === 1;

            form.resourceId = resource.ResourceId;

            form.isSchool = resource.IsSchool === 1;

            form.isShelf = form.isSchool ? resource.IsShelf === 1 : true;

            currentEditType.value = "edit";
            uploadResourceOpen.value = true;
        });

        onUnmounted(() => {
            emitter.off("updatePackageCount");
            emitter.off("openEditResource");
        });

        const source = ref("");
        const sourceList = ref([
            {
                value: "",
                label: "全部资源",
            },
            {
                value: "2",
                label: "系统资源",
            },
            {
                value: "1",
                label: "校本资源",
            },
            {
                value: "4",
                label: "我的资源",
            },
        ]);
        const onSourceChange = () => {
            emit("update:source", source.value);
            //匹配到当前选中的label
            const sourceLabel = sourceList.value.find(
                (item: any) => item.value == source.value
            )?.label;
            if (sourceLabel) {
                //如果有则去创建埋点
                createBuryingPointFn(
                    EVENT_TYPE.PageClick,
                    sourceLabel,
                    sourceLabel
                );
            }
        };

        const formEmpty = {
            resourceId: "",
            name: "",
            type: {
                Id: "",
                Name: "",
            },
            directorys: [
                {
                    schoolSection: { id: "", name: "" },
                    subject: { id: "", name: "" },
                    version: { id: "", name: "" },
                    grade: { id: "", name: "" },
                    chapter: { id: "", name: "" },
                    lesson: { id: "", name: "" },
                },
            ],
            degree: "3",
            knowledge: "",
            files: [],
            isSchool: false,
            isShelf: true,
        };
        const form = reactive<IForm>(JSON.parse(JSON.stringify(formEmpty)));

        const uploadResourceOpen = ref(false);

        const type = ref<string>(RESOURCE_TYPE.COURSEWARD);
        const typeList = ref<{ Id: string; Name: string }[]>([]);
        const onTypeChange = () => {
            emit("update:type", type.value);
            //匹配到对应的name值
            const typeName = typeList.value.find(
                (item: any) => item.Id == type.value
            )?.Name;
            if (typeName) {
                createBuryingPointFn(EVENT_TYPE.PageClick, typeName, typeName);
            }
        };
        const getResourceType = async () => {
            const res = await fetchResourceType();
            if (res.success) {
                res.result.push({
                    Id: "",
                    Name: "全部",
                });
                typeList.value = res.result.reverse();
            }
        };

        const init = () => {
            getResourceType();
        };

        init();

        // 新增目录
        const addDirectory = () => {
            form.directorys.push({
                schoolSection: { id: "", name: "" },
                subject: { id: "", name: "" },
                version: { id: "", name: "" },
                grade: { id: "", name: "" },
                chapter: { id: "", name: "" },
                lesson: { id: "", name: "" },
            });
        };

        // 删除目录
        const deleteDirectory = (index: number) => {
            form.directorys.splice(index, 1);
        };

        // 确认上传
        const sureUpload = async () => {
            if (form.files.length === 0 && !isWincard.value)
                return ElMessage.warning("请上传资源文件！");
            if (!form.name && form.files.length < 2)
                return ElMessage.warning("资源名称不能为空！");
            if (!form.type.Id) return ElMessage.warning("请选择资源类型！");
            if (form.directorys.length === 0)
                return ElMessage.warning("请选择资源目录！");
            if (form.directorys.length > 0) {
                let empty = false;
                for (let i = 0; i < form.directorys.length; i++) {
                    if (
                        !form.directorys[i].schoolSection.id ||
                        !form.directorys[i].subject.id ||
                        !form.directorys[i].version.id ||
                        !form.directorys[i].grade.id ||
                        !form.directorys[i].chapter.id
                    ) {
                        empty = true;
                    }
                }
                if (empty) return ElMessage.warning("请将资源目录补充完整！");
            }
            const schoolId = store.state.userInfo.schoolId;
            const schoolName = store.state.userInfo.schoolName;
            const lessonTrees = form.directorys.map((item) => {
                return {
                    acaSectionId: item.schoolSection.id,
                    acaSectionName: item.schoolSection.name,
                    subjectID: item.subject.id,
                    subjectName: item.subject.name,
                    publisherID: item.version.id,
                    publisherName: item.version.name,
                    bookId: item.grade.bookId as string,
                    albumID: item.grade.id,
                    albumName: item.grade.name,
                    chapterID: item.chapter.id,
                    chapterName: item.chapter.name,
                    lessonID: item.lesson
                        ? item.lesson.id
                        : props.course.lessonId,
                    lessonName: item.lesson
                        ? item.lesson.name
                        : props.course.lessonName,
                };
            });
            const resourceFiles = form.files.map((item) => {
                return {
                    fileName: item.fileName,
                    mD5: item.md5,
                    size: item.size,
                };
            });

            let res;
            if (currentEditType.value === "add") {
                res = await uploadResource({
                    lessonTrees,
                    rescourceTypeId: form.type.Id,
                    rescourceTypeName: form.type.Name,
                    name: form.name,
                    schoolId: schoolId,
                    schoolName: schoolName,
                    degree: form.degree,
                    resourceFiles,
                    isSchool: form.isSchool ? 1 : 2,
                    isShelf: form.isSchool ? (form.isShelf ? 1 : 2) : 2,
                    knowledgePonitId: [],
                });
            } else {
                res = await editResource({
                    resourceId: form.resourceId,
                    lessonTrees,
                    rescourceTypeId: form.type.Id,
                    rescourceTypeName: form.type.Name,
                    name: form.name,
                    schoolId: schoolId,
                    schoolName: schoolName,
                    degree: form.degree,
                    resourceFile: resourceFiles[0],
                    isSchool: form.isSchool ? 1 : 2,
                    isShelf: form.isSchool ? (form.isShelf ? 1 : 2) : 2,
                    knowledgePonitId: [],
                    toCourseware: false,
                    userId: userId.value,
                });
            }

            if (res.success) {
                uploadResourceOpen.value = false;
                if (currentEditType.value === "add") {
                    type.value = "";
                    source.value = "4";
                    emit("update:type", type.value);
                    emit("update:source", source.value);
                } else {
                    emitter.emit(
                        "updateResourceList",
                        currentEditType.value === "add" ? "" : form.resourceId
                    );
                }
            }
        };

        const refreshResourceList = () => {
            emitter.emit("updateResourceList", "");
        };

        const acceptList =
            ".ppt,.pptx,.doc,.docx,.xls,.xlsx,.pdf,.mp3,.mp4,.gif,.jpg,.png,.jpeg,.wav";

        const beforeUpload = ({ name }: { name: string }) => {
            const fileType = name.substring(name.lastIndexOf(".") + 1);
            const whiteList = [
                "ppt",
                "pptx",
                "doc",
                "docx",
                "xls",
                "xlsx",
                "pdf",
                "mp3",
                "mp4",
                "gif",
                "jpg",
                "png",
                "jpeg",
                "wav",
            ];
            if (whiteList.indexOf(fileType) === -1) {
                ElMessage.error(
                    "上传文件只能是 ppt,pptx,doc,docx,xls,xlsx,pdf,mp3,mp4,gif,jpg,png,jpeg格式"
                );
                return false;
            }
        };

        const fileList = ref<{ name: string; url: string }[]>([]);

        const { uploadFile } = useUploadFile("RescourceFile");

        const uploadSuccess = async ({
            file,
        }: {
            file: File & Blob & { uid: number };
        }) => {
            const res = await uploadFile({ file });
            form.files.push({
                extension: res.fileExtension,
                md5: res.md5,
                fileName: file.name,
                uid: file.uid,
                size: res.size || 0,
            });
            if (form.files.length === 1) {
                form.name = file.name;
            }
        };

        const onExceed = () => {
            ElMessage.warning(
                currentEditType.value === "edit"
                    ? "编辑时只允许上传一个文件！"
                    : "上传最多只能上传5个文件！"
            );
        };

        const beforeRemove = (file: File & Blob & { uid: number }) => {
            const index = form.files.findIndex((item) => item.uid === file.uid);
            form.files.splice(index, 1);
        };

        const openUpload = () => {
            const empty = JSON.parse(JSON.stringify(formEmpty));
            form.resourceId = "";
            form.name = empty.name;
            form.type = empty.type;
            form.directorys = empty.directorys;
            form.degree = empty.degree;
            form.files = empty.files;
            form.knowledge = empty.knowledge;
            form.isSchool = false;
            fileList.value = [];
            currentEditType.value = "add";
            if (selectedBook.value) {
                form.directorys[0].schoolSection.id =
                    selectedBook.value.AcaSectionId;
                form.directorys[0].schoolSection.name =
                    selectedBook.value.AcaSectionName;
                form.directorys[0].subject.id = selectedBook.value.SubjectId;
                form.directorys[0].subject.name =
                    selectedBook.value.SubjectName;
                form.directorys[0].version.id = selectedBook.value.PublisherId;
                form.directorys[0].version.name =
                    selectedBook.value.PublisherName;
                form.directorys[0].grade.id = selectedBook.value.AlbumId;
                form.directorys[0].grade.name = selectedBook.value.AlbumName;
                form.directorys[0].chapter.id = course.value.chapterId;
                form.directorys[0].chapter.name = course.value.chapterName;
                form.directorys[0].lesson.id = course.value.lessonId;
                form.directorys[0].lesson.name = course.value.lessonName;
            }
            uploadResourceOpen.value = true;
        };

        const router = useRouter();
        const editWincard = () => {
            store.commit(MutationTypes.SET_EDIT_WINDOW_INFO, {
                id: cacheResource.OldResourceId,
                name: cacheResource.Name,
                lessonId: store.state.preparation.selectLessonId,
                originType: 1,
            });
            router.push("/windowcard-edit");
        };

        const courseCartOpen = ref(false);
        const tableData = ref<ICourseCartOption[]>([]);
        const pageNumber = ref(0);
        const dateRange = ref("");
        const total = ref(0);
        const openCourseCartOptions = () => {
            if (!course.value.lessonId) return;
            courseCartOpen.value = true;
            pageNumber.value = 1;
            getCourseCartOption();
        };
        const dateRangeChange = () => {
            getCourseCartOption();
        };
        const pageChange = (value: number) => {
            pageNumber.value = value;
            getCourseCartOption();
        };
        const directoryName = (lessons: ILesson[]) => {
            const book = lessons.find((item) => {
                return (
                    course.value.lessonId === item.LessonID || !item.LessonID
                );
            });

            return book
                ? book.SubjectName +
                      " / " +
                      book.PublisherName +
                      " / " +
                      book.AlbumName +
                      " / " +
                      book.ChapterName +
                      (book.LessonName ? " / " + book.LessonName : "")
                : "--";
        };
        const getCourseCartOption = () => {
            getCartOptionList({
                lessonId: course.value.lessonId,
                startTime: dateRange.value[0]
                    ? moment(dateRange.value[0]).format("YYYY-MM-DD 00:00:00")
                    : "",
                endTime: dateRange.value[1]
                    ? moment(dateRange.value[1]).format("YYYY-MM-DD 23:59:59")
                    : "",
                paper: {
                    pageNumber: pageNumber.value,
                    pageSize: 10,
                },
            }).then((res) => {
                tableData.value = res.result.list.map((item) => {
                    return {
                        time: moment(item.CreateTime).format(
                            "YYYY-MM-DD HH:mm"
                        ),
                        name: item.OprateName,
                        type: item.ResourceTypeName,
                        resource: item.ResourceName,
                        directory: directoryName(item.Lessons),
                    };
                });
                total.value = res.result.pager.Total;
            });
        };
        //备课页面部分区域按钮点击埋点事件
        const clicKBuryPoint = (name: string) => {
            createBuryingPointFn(EVENT_TYPE.PageClick, name, name);
        };
        //是否上传为校本资源-点击埋点
        watch(
            () => form.isSchool,
            () => {
                createBuryingPointFn(
                    EVENT_TYPE.PageClick,
                    "上传为校本资源",
                    "上传为校本资源"
                );
            }
        );

        return {
            source,
            sourceList,
            onSourceChange,
            type,
            typeList,
            onTypeChange,
            form,
            uploadResourceOpen,
            addDirectory,
            deleteDirectory,
            sureUpload,
            acceptList,
            beforeUpload,
            uploadSuccess,
            beforeRemove,
            packageCount,
            openUpload,
            refreshResourceList,
            fileList,
            currentEditType,
            onExceed,
            isWincard,
            editWincard,
            courseCartOpen,
            tableData,
            dateRange,
            pageNumber,
            dateRangeChange,
            total,
            pageChange,
            openCourseCartOptions,
            clicKBuryPoint,
            RESOURCE_TYPE
        };
    },
});
</script>

<style lang="scss" scoped>
.p-layout-head {
    padding: 20px;
}

.p-head-filter {
    display: flex;
    align-items: center;
    padding: 15px;
    border-radius: 5px;
    background-color: #fff;
    & + .p-head-filter {
        margin-top: 15px;
    }
}

.p-filter-content {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
}

.p-course-cart-options {
    color: #4b71ee;
    font-size: 14px;
    margin-right: 20px;
    display: flex;
    align-items: center;
    cursor: pointer;
    img {
        width: 16px;
        display: block;
        margin-right: 3px;
        position: relative;
        top: -1px;
    }
}

.p-control-btns {
    display: flex;
    align-items: center;
    :deep(.el-icon) {
        position: relative;
        top: 1px;
    }

    .refresh-btn {
        display: block;
        width: 16px;
        margin-left: 30px;
        cursor: pointer;
    }
}

.my-course-cart {
    margin-right: 10px;
    border-radius: var(--el-border-radius-base);
    border: 0;
    background: #f5f6fa;
    font-size: 14px;
    padding: 9px 15px 9px 60px;
    position: relative;
    cursor: pointer;
    &.active {
        background-color: #272c42;
        color: #fff;
    }
    &.hide {
        &:before {
            display: none;
        }
    }
    &:before {
        content: attr(num);
        display: block;
        padding: 3px;
        border-radius: 15px;
        font-size: 12px;
        color: #fff;
        background: var(--app-color-red);
        position: absolute;
        left: 40px;
        top: -16px;
        z-index: 1;
        min-width: 18px;
        text-align: center;
    }
    img {
        position: absolute;
        top: -16px;
        width: 50px;
        left: 10px;
        display: block;
    }
}

.custom-radio {
    :deep(.el-radio-button__inner) {
        margin-right: 10px;
        border-radius: var(--el-border-radius-base);
        border: 0;
        background: #f5f6fa;
    }
    :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
        color: #fff;
        box-shadow: none;
        background: #272c42;
    }
    :deep(.el-radio-button--small .el-radio-button__inner) {
        font-size: 14px;
    }
}

.custom-radio-two {
    :deep(.el-radio-button__inner) {
        margin-right: 10px;
        border-radius: 16px;
        border: 0;
        background: #fff;
    }
    :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
        color: #fff;
        box-shadow: none;
        background: #eef2ff;
        color: #4b71ee;
    }
    :deep(.el-radio-button--small .el-radio-button__inner) {
        font-size: 14px;
    }
}

.custom-form {
    :deep(.el-form-item) {
        margin-bottom: 15px;
    }
    :deep(.el-icon) {
        position: relative;
        top: 1px;
    }
}

.select-box {
    display: flex;
    align-items: center;
    margin-bottom: 15px;

    .delete-icon-box {
        width: 15px;
        height: 15px;
        margin-left: 10px;
    }

    .delete-icon {
        width: 15px;
        height: 15px;
        display: block;
        -webkit-user-drag: none;
        cursor: pointer;
    }
}

.select-block {
    width: 100%;
}

.add-btn {
    width: 100%;
}

.custom-table {
    margin-top: 15px;
    width: 100%;
    &:before {
        display: none;
    }
    :deep(.el-table__header-wrapper .el-table__cell) {
        padding: 12px 0;
        font-weight: 600;
        background-color: #fafafa;
    }
    :deep(.el-table__cell) {
        padding: 12px 0;
        border-bottom: 0 !important;
    }
}

.p-pagination {
    margin-top: 15px;
    display: flex;
    justify-content: flex-end;
}
</style>
