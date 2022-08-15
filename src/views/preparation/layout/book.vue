<template>
	<div
		class="book-item"
		:title="book.SubjectName"
		:style="{ background: `url(${cover})`, backgroundSize: 'cover' }"
		:class="book.Id === bookId && 'active'"
	>
		<div class="book-title">
			{{ book.SubjectName }}
		</div>
		<div class="book-grade">
			{{ book.AlbumName }}
		</div>
		<div class="book-version">
			{{ book.PublisherName }}
		</div>
		<img
			class="book-delete"
			src="@/assets/images/preparation/btn_delete_red.png"
			@click.stop="deleteCustomBook(book.Id)"
		/>
	</div>
</template>

<script lang="ts">
import { fetchDeleteCustomBookList, ICustomBookItem } from "@/api/resource";
import { useStore } from "@/store";
import { ElMessageBox } from "element-plus";
import { computed, defineComponent, PropType } from "vue";

export default defineComponent({
	props: {
		book: {
			type: Object as PropType<ICustomBookItem>,
			required: true
		}
	},
	emits: ["update"],
	setup(props, { emit }) {
		const store = useStore();
		const totalBookCover: { [key: string]: string } = {
			历史: require("@/assets/images/preparation/book/cover_lishi.png"),
			语文: require("@/assets/images/preparation/book/cover_yuwen.png"),
			数学: require("@/assets/images/preparation/book/cover_shuxue.png"),
			英语: require("@/assets/images/preparation/book/cover_yingyu.png"),
			物理: require("@/assets/images/preparation/book/cover_wuli.png"),
			化学: require("@/assets/images/preparation/book/cover_huaxue.png"),
			政治: require("@/assets/images/preparation/book/cover_zhengzhi.png"),
			地理: require("@/assets/images/preparation/book/cover_dili.png"),
			生物: require("@/assets/images/preparation/book/cover_shengwu.png"),
			其他: require("@/assets/images/preparation/book/cover_qita.png")
		};

		const cover = computed(() => {
			return (
				totalBookCover[props.book.SubjectName] || totalBookCover["其他"]
			);
		});

		const bookId = computed(() => store.state.preparation.subjectPublisherBookValue?.Id);

		const deleteCustomBook = async (id: string) => {
			ElMessageBox.confirm("确认删除该书册吗？", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			}).then(async () => {
                const res = await fetchDeleteCustomBookList({ id });
                if (res.success) {
                    emit("update", bookId.value === id);
                }
			}).catch(() => {});
		};

		return {
			bookId,
			cover,
			deleteCustomBook
		};
	}
});
</script>

<style lang="scss" scoped>
.book-item {
	width: 80px;
	height: 112.7px;
	position: relative;
	border-radius: 5px;
	.active {
		border: 2px solid var(--app-color-primary);
	}
}

.book-title {
	font-size: 16px;
	font-weight: 600;
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	top: 30px;
	white-space: nowrap;
    text-align: center;
    width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
}

.book-grade {
	font-size: 12px;
	position: absolute;
	top: 55px;
	left: 50%;
	transform: translateX(-50%) scale(0.8);
	white-space: nowrap;
}

.book-version {
	font-size: 12px;
	position: absolute;
	bottom: 10px;
	left: 50%;
	transform: translateX(-50%) scale(0.8);
	color: #fff;
    white-space: nowrap;
}

.book-delete {
	display: block;
	position: absolute;
	top: -5px;
	right: -5px;
	width: 15px;
	height: 15px;
	cursor: pointer;
}
</style>
