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
    value: IDirectoryItem;
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
	setup(props, { emit }) {
		// 处理书册数据 注意最后一级不是去Id 而是取bookId
		const dealCascader = (data: IBookItem[]): IOption[] => {
			return data.map((item) => {
				const children = dealCascader(item.Children || []);
				return {
					value: { id: item.BookId || item.Id, name: item.Name },
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
		const form = reactive<{ chapterAndLesson: IDirectoryItem[]; book: IDirectoryItem[] }>({
			chapterAndLesson: [],
			book: []
		});

		onMounted(() => {
			form.book = [props.directory.schoolSection, props.directory.subject, props.directory.version, props.directory.grade];
            form.chapterAndLesson = [props.directory.chapter, props.directory.lesson];
			if (props.directory.grade.id) {
				getChapterAndLessonTree();
			}
		});

		const getChapterAndLessonTree = async () => {
			if (form.book.length === 4) {
				const res = await fetchCourseDataByBookId({
					bookId: form.book[3].id
				});

                if (res.success) {
                    chapterList.value = dealCascader(res.result);
                }
			}
		};

		const bookChange = async () => {
            emit("update:directory", {
                schoolSection: form.book[0],
                subject: form.book[1],
                version: form.book[2],
                grade: form.book[3],
                chapter: { name: "", id: "" },
                lesson: { name: "", id: "" }
            });

			getChapterAndLessonTree();
		};

        const chapterChange = async () => {
            emit("update:directory", {
                schoolSection: form.book[0],
                subject: form.book[1],
                version: form.book[2],
                grade: form.book[3],
                chapter: form.chapterAndLesson[0],
                lesson: form.chapterAndLesson[1]
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
