<template>
	<div class="custom-select">
		<el-cascader
			style="width: 47%;"
			v-model="form.book"
			placeholder="选择书册"
			:options="bookList"
			@change="bookChange"
		/>

		<el-cascader
			style="width: 47%;"
			v-model="form.chapterAndLesson"
			placeholder="选择书册"
			:options="chapterList"
			@change="chapterChange"
		/>
	</div>
</template>

<script lang="ts">
import { fetchCourseDataByBookId, IBookItem } from "@/api/resource";
import { useStore } from "@/store";
import { computed, defineComponent, onMounted, PropType, reactive, ref, watch } from "vue";

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

interface IOption {
    value: string;
    label: string;
    children?: IOption[];
}

export default defineComponent({
	props: {
		directory: {
			type: Object as PropType<IDirectory>,
            required: true
		}
	},
	emits: ["update:directory"],
	setup(props, { emit }) {
		// 处理书册数据 注意最后一级不是去Id 而是取bookId
		const dealCascader = (data: IBookItem[]): IOption[] => {
			return data.map((item) => {
				const children = dealCascader(item.Children || []);
				return {
					value: item.Id,
					label: item.Name,
					...(!item.Children ? {} : { children })
				};
			});
		};

		const store = useStore();
		const bookList = computed(() => {
			return dealCascader(
				store.state.preparation.subjectPublisherBookList
			);
		});
		const chapterList = ref<IOption[]>([]);
		let storeChapterList: IBookItem[] = [];
		const form = reactive<{ chapterAndLesson: string[]; book: string[] }>({
			chapterAndLesson: [],
			book: []
		});

		const init = () => {
			form.book = [props.directory.schoolSection.id, props.directory.subject.id, props.directory.version.id, props.directory.grade.id];
            form.chapterAndLesson = [props.directory.chapter.id, props.directory.lesson.id];
			if (props.directory.grade.id) {
				getChapterAndLessonTree();
			}
		};

		watch(() => props.directory, () => init, { deep: true });

		onMounted(() => {
			init();
		});

		const getBook = () => {
			const subjectPublisherBookList = store.state.preparation.subjectPublisherBookList;
			const A = subjectPublisherBookList.find(item => item.Id === form.book[0]);
			const B = A?.Children?.find(item => item.Id === form.book[1]);
			const C = B?.Children?.find(item => item.Id === form.book[2]);
			const D = C?.Children?.find(item => item.Id === form.book[3]);
			return [{ id: A?.Id, name: A?.Name }, { id: B?.Id, name: B?.Name }, { id: C?.Id, name: C?.Name }, { id: D?.Id, name: D?.Name, bookId: D?.BookId }];
		};

		const getChapter = () => {
			const chapter = storeChapterList.find(item => item.Id === form.chapterAndLesson[0]);
			const lesson = (chapter && chapter.Children) ? chapter.Children.find(item => item.Id === form.chapterAndLesson[1]) : { Id: "", Name: "" };
			return [{ id: chapter?.Id, name: chapter?.Name }, { id: lesson?.Id, name: lesson?.Name }];
		};

		const getChapterAndLessonTree = async () => {
			if (form.book.length === 4) {
				const book = getBook();
				const res = await fetchCourseDataByBookId({
					bookId: book[3].bookId as string
				});

                if (res.success) {
					storeChapterList = res.result;
                    chapterList.value = dealCascader(res.result);
                }
			}
		};

		const bookChange = async () => {
			const book = getBook();
            emit("update:directory", {
                schoolSection: book[0],
                subject: book[1],
                version: book[2],
                grade: book[3],
                chapter: { name: "", id: "" },
                lesson: { name: "", id: "" }
            });
			form.chapterAndLesson = ["", ""];
			getChapterAndLessonTree();
		};

        const chapterChange = async () => {
			const book = getBook();
			const chapter = getChapter();
            emit("update:directory", {
                schoolSection: book[0],
                subject: book[1],
                version: book[2],
                grade: book[3],
                chapter: chapter[0],
                lesson: chapter[1]
            });
        }

		return {
			bookList,
			chapterList,
			form,
			bookChange,
            chapterChange
		};
	}
});
</script>

<style lang="scss" scoped>
.custom-select {
	display: flex;
	align-items: center;
	flex: 1;
	min-width: 0;
	justify-content: space-between;
}
</style>
