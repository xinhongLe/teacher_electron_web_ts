<template>
	<div class="p-layout-head">
		<div class="p-head-filter">
			<div class="p-filter-content">
				<div
					class="my-course-cart"
					:class="{ active: source === 'me', hide: packageCount === 0 }"
					id="myCourseCart"
					:num="packageCount > 99 ? '99+' : packageCount"
					@click="source = 'me';onSourceChange()"
				>
					<img src="@/assets/images/preparation/cart.png" alt="" />
					我的备课包
				</div>
				<el-radio-group
					class="custom-radio"
					v-model="source"
					size="small"
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
			<div class="p-control-btns">
				<el-button
					size="small"
					type="primary"
					@click="uploadResourceOpen = true"
				>
					&nbsp;&nbsp;&nbsp;
					<el-icon :size="12"><plus /></el-icon>
					&nbsp;上&nbsp;传&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				</el-button>
				<img
					class="refresh-btn"
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
					size="small"
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
			custom-class="custom-dialog"
			v-model="uploadResourceOpen"
			center
			title="上传资源"
			width="550px"
		>
			<el-form class="custom-form" :model="form" label-width="100px">
				<el-form-item label="资源：">
					<el-upload
						ref="upload"
						action=""
						:accept="acceptList"
						:show-file-list="true"
                        :before-remove="beforeRemove"
						:before-upload="beforeUpload"
						:http-request="(e) => uploadSuccess(e, index)"
					>
						<el-button
							type="primary"
							size="small"
							style="font-size: 14px"
						>
							&nbsp;&nbsp;&nbsp;
							<el-icon :size="14"><upload /></el-icon>
							&nbsp;上&nbsp;传&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="资源名称：">
					<el-input v-model="form.name" />
				</el-form-item>
				<el-form-item label="类型：">
					<el-radio-group
						class="custom-radio"
						v-model="form.type"
						size="small"
					>
						<el-radio-button
							v-for="item in typeList.slice(1)"
							:disabled="
								[
									'8C47DA0818CB7747E6A5ACBD6AC2EC42',
									'8C47DA0823D0950663B3A370010320CA'
								].indexOf(item.Id) > -1
							"
							:key="item.Id"
							:label="item"
						>
							{{ item.Name }}
						</el-radio-button>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="目录：">
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
						@click="addDirectory()"
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
				<el-form-item label="关联知识点：">
					<el-select
						class="select-block"
						v-model="form.knowledge"
						placeholder="请选择"
					>
						<!-- <el-option
							v-for="item in chapterList"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						/> -->
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="setbookSelectOpen = false"
						>取消</el-button
					>
					<el-button type="primary" @click="sureUpload()">
						确认
					</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, PropType, reactive, ref, toRefs, watch } from "vue";
import { Plus, Refresh, Upload } from "@element-plus/icons-vue";
import { fetchMyPackageNum, fetchResourceType, uploadResource } from "@/api/resource";
import CustomSelect from "./customSelect.vue";
import { ElMessage } from "element-plus";
import useUploadFile from "@/hooks/useUploadFile";
import emitter from "@/utils/mitt";
import { useStore } from "@/store";

interface IDirectoryItem {
    id: string;
    name: string;
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
    name: string;
    type: {
        Id: string;
        Name: string;
    };
    directorys: IDirectory[];
    degree: string;
    knowledge: string;
    files: IFile[];
}

interface ICourse {
    chapterId: string;
    lessonId: string;
}

export default defineComponent({
    props: {
        course: {
            type: Object as PropType<ICourse>,
            required: true
        }
    },
	components: { Plus, Refresh, Upload, CustomSelect },
	setup(props, { emit }) {
        const store = useStore();
        const { course } = toRefs(props);
        watch(course, () => {
            getMyPackageNum();
        });
        const packageCount = ref(0);
        const getMyPackageNum = async () => {
            const res = await fetchMyPackageNum({
                chapterId: course.value.chapterId,
                lessonId: course.value.lessonId
            });

            packageCount.value = res.result.BagCount;
        }

        emitter.on("updatePackageCount", () => {
            getMyPackageNum();
        });

        onUnmounted(() => {
            emitter.off("updatePackageCount");
        });

		const source = ref("");
		const sourceList = ref([
			{
				value: "",
				label: "全部资源"
			},
			{
				value: "2",
				label: "系统资源"
			},
			{
				value: "1",
				label: "校本资源"
			},
			{
				value: "4",
				label: "我的资源"
			}
		]);
		const onSourceChange = () => {
			emit("update:source", source.value);
		};

		const form = reactive<IForm>({
			name: "",
			type: {
				Id: "",
				Name: ""
			},
			directorys: [
				{
					schoolSection: { id: "", name: "" },
					subject: { id: "", name: "" },
					version: { id: "", name: "" },
					grade: { id: "", name: "" },
					chapter: { id: "", name: "" },
					lesson: { id: "", name: "" }
				}
			],
			degree: "",
			knowledge: "",
			files: []
		});

		const uploadResourceOpen = ref(false);

		const type = ref("");
		const typeList = ref<{ Id: string; Name: string }[]>([]);
		const onTypeChange = () => {
			emit("update:type", type.value);
		};
		const getResourceType = async () => {
			const res = await fetchResourceType();
			if (res.success) {
				res.result.push({
					Id: "",
					Name: "全部"
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
				lesson: { id: "", name: "" }
			});
		};

		// 删除目录
		const deleteDirectory = (index: number) => {
			form.directorys.splice(index, 1);
		};

		// 确认上传
		const sureUpload = async () => {
			console.log(form);
            const school = store.state.userInfo.Schools![0];
            const lessonTrees = form.directorys.map(item => {
                return {
                    acaSectionId: item.schoolSection.id,
                    acaSectionName: item.schoolSection.name,
                    subjectID: item.subject.id,
                    subjectName: item.subject.name,
                    publisherID: item.version.id,
                    publisherName: item.version.name,
                    albumID: item.grade.id,
                    albumName: item.grade.name,
                    chapterID: item.chapter.id,
                    chapterName: item.chapter.name,
                    lessonID: item.lesson.id,
                    lessonName: item.lesson.name
                }
            });
            const resourceFiles = form.files.map(item => {
                return {
                    fileName: item.fileName,
                    mD5: item.md5,
                    size: item.size
                }
            });
            const res = await uploadResource({
                lessonTrees,
                rescourceTypeId: form.type.Id,
                rescourceTypeName: form.type.Name,
                name: form.name,
                schoolId: school.UserCenterSchoolID,
                schoolName: school.Name,
                degree: form.degree,
                resourceFiles,
                isSchool: 2,
                isShelf: 2,
                knowledgePonitId: []
            });

            if (res.success) {
                uploadResourceOpen.value = false;
            }
		};

		const acceptList = ".ppt,.pptx,.doc,.docx,.pdf,.mp3,.mp4,.mkv,.flv,.jpg,.png,.jpeg";

		const beforeUpload = ({ name }: { name: string }) => {
			const fileType = name.substring(name.lastIndexOf(".") + 1);
			const whiteList = [
				"ppt",
				"pptx",
				"doc",
				"docx",
				"pdf",
				"mp3",
				"mp4",
				"mkv",
				"flv",
				"jpg",
				"png",
				"jpeg"
			];
			if (whiteList.indexOf(fileType) === -1) {
				ElMessage.error(
					"上传文件只能是 ppt,pptx,doc,docx,pdf,mp3,mp4,mkv,flv,jpg,png,jpeg格式"
				);
				return false;
			}
		};

        const { uploadFile } = useUploadFile("RescourceFile");

		const uploadSuccess = async ({ file }: { file: File & Blob & { uid: number } }) => {
			console.log(file.uid);
			const res = await uploadFile({ file });
			form.files.push({
			    extension: res.fileExtension,
			    md5: res.md5,
			    fileName: file.name,
                uid: file.uid,
                size: res.size || 0
			});
		};

        const beforeRemove = (file: File & Blob & { uid: number }) => {
            console.log("=dddd", file)
            const index = form.files.findIndex(item => item.uid === file.uid);
            form.files.splice(index, 1);
        };

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
            packageCount
		};
	}
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
</style>
