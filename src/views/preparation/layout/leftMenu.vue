<template>
	<div class="p-layout-menu">
		<BookSelect @onChangeBook="(data) => onChangeBook(data)" />
		<div class="p-tree-wrapper">
			<div class="p-tree-title">
				<img src="@/assets/images/preparation/icon_ziyuan.png" alt="" />
				全部资源
			</div>
			<div class="tree-content">
				<Tree
					@onTreeItemChange="selectedCourse"
					v-model:value="selectedID"
					:treeData="treeData"
					:tipTarget="tipTarget"
					:showClassArrangement="showClassArrangement"
				/>
			</div>
		</div>
		<el-button
			class="p-work-schedule"
			:class="showClassArrangement && 'out'"
			@click="updateShowClassArrangement(!showClassArrangement)"
		>
			<div class="work-schedule-text" v-if="showClassArrangement">
				<img src="@/assets/images/preparation/icon_tuichu.svg" />
				退出排课
			</div>
			<div class="work-schedule-text" v-else>
				<img src="@/assets/images/preparation/icon_paike.svg" /> 去排课
			</div>
		</el-button>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import BookSelect from "./bookSelect.vue";
import Tree from "./tree/index.vue";
import { ITreeItem } from "./tree/types";
import { MutationTypes, useStore } from "@/store";
import { fetchCourseDataByBookId, ICustomBookItem } from "@/api/resource";
import { get, set, STORAGE_TYPES } from "@/utils/storage";
interface ICourse {
    chapterId: string;
    lessonId: string;
	lessonName: string;
	chapterName: string;
}
export default defineComponent({
	components: { BookSelect, Tree },
	props: {
		showClassArrangement: {
			type: Boolean
		},
		course: {
			type: Object as PropType<ICourse>
		},
		bookId: {
			type: String
		}
	},
	emits: ["update:showClassArrangement", "update:course", "update:bookId"],
	setup(props, { emit }) {
		const store = useStore();
		const updateShowClassArrangement = (flag: boolean) => {
			emit("update:showClassArrangement", flag);
		};

		const treeData = ref<ITreeItem[]>([]);
		const selectedCourse = (tree: ITreeItem, keys: string[]) => {
			const chapter = treeData.value.find(item => item.Id === keys[0]);
			const book = store.state.preparation.subjectPublisherBookValue;
			set(STORAGE_TYPES.SELECT_CHAPTER_LESSON, {
				id: book?.Id,
				chapterId: chapter?.Id,
                lessonId: tree.Id,
				lessonName: tree.Name,
				chapterName: chapter?.Name
			});
			emit("update:course", {
                chapterId: chapter?.Id,
                lessonId: tree.Id,
				lessonName: tree.Name,
				chapterName: chapter?.Name
            });
			store.commit(MutationTypes.SET_SELECT_LESSON_ID, tree.Id);

			tipTarget.value = tree.Id;
		};
		const selectedChapterID = ref("");
		const selectedChapterName = ref("");
		const selectedID = ref("");
		const selectedName = ref("");

		// 操作提示使用
		const tipTarget = ref("");
		// 根据书册获取课时
		const getCourseData = async (bookId: string) => {
			treeData.value = [];
			tipTarget.value = "";
			if (!bookId) {
				emit("update:course", {
					chapterId: "",
					lessonId: "",
					lessonName: "",
					chapterName: ""
				});
				store.commit(MutationTypes.SET_SELECT_LESSON_ID, "");
				return;
			}
			const res = await fetchCourseDataByBookId({ bookId });
			treeData.value = res.result;

			// selectedID.value = treeData.value[0].Children[0].Id;
			const chapterAndLesson = get(STORAGE_TYPES.SELECT_CHAPTER_LESSON);
			const book = store.state.preparation.subjectPublisherBookValue;

			if (chapterAndLesson && chapterAndLesson.id === book?.Id) {
				selectedChapterID.value = chapterAndLesson.chapterId;
				selectedID.value = chapterAndLesson.lessonId;
				selectedName.value = chapterAndLesson.lessonName;
				selectedChapterName.value = chapterAndLesson.chapterName;
			} else {
				getFirstLessonId();
			}
			emit("update:course", {
				chapterId: selectedChapterID.value,
				lessonId: selectedID.value,
				lessonName: selectedName.value,
				chapterName: selectedChapterName.value
			});
			store.commit(MutationTypes.SET_SELECT_LESSON_ID, selectedID.value);

			tipTarget.value = selectedID.value;
		};

		const getFirstLessonId = () => {
			let hasLesson = false;
			for (let i = 0; i < treeData.value.length; i++) {
				if (treeData.value[i].Children && treeData.value[i].Children!.length > 0) {
					hasLesson = true;
					selectedChapterID.value = treeData.value[i].Id;
					selectedChapterName.value = treeData.value[i].Name;
					selectedID.value = treeData.value[i].Children![0].Id;
					selectedName.value = treeData.value[i].Children![0].Name;
					break;
				}
			}

			if (!hasLesson) {
				selectedChapterID.value = "";
				selectedChapterName.value = "";
				selectedID.value = "";
				selectedName.value = "";
			}
		};

		const onChangeBook = async (data: ICustomBookItem) => {
			// store.commit(
			//     MutationTypes.SET_SUBJECT_PUBLISHER_BOOK_VALUE,
			//     [data.id]
			// );
			emit("update:bookId", data.BookId);
			getCourseData(data.BookId);
		};

		return {
			treeData,
			selectedID,
			selectedCourse,
			updateShowClassArrangement,
			onChangeBook,
			tipTarget
		};
	}
});
</script>

<style lang="scss" scoped>
.p-layout-menu {
	background-color: #fff;
	width: 300px;
	display: flex;
	flex-direction: column;
}

.p-tree-wrapper {
	flex: 1;
	min-height: 0;
	padding: 0 15px;
	display: flex;
	flex-direction: column;
}

.tree-content {
	flex: 1;
	min-height: 0;
	overflow-y: auto;
}

.p-work-schedule {
	background-color: var(--app-color-orange);
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 15px;
	height: 42px;
	.work-schedule-text {
		display: flex;
		align-items: center;
		img {
			margin-right: 5px;
		}
	}
	&.out {
		background-color: var(--app-color-red);
	}
}

.p-tree-title {
	padding: 10px 0;
	border-bottom: 1px solid var(--app-color-border-default);
	display: flex;
	align-items: center;
	font-size: 18px;
	font-weight: 600;
	margin-bottom: 10px;
	img {
		display: block;
		width: 20px;
		margin-right: 5px;
	}
}
</style>
