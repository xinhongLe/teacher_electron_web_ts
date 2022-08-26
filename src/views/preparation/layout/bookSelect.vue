<template>
    <div class="p-layout-select">
        书册
        <div
            class="book-select"
            :class="{
                active: bookSelectOpen,
                noBook: !selectedBookName.trim(),
            }"
            @click.stop="
                (bookSelectOpen = !bookSelectOpen),
                    isBookSelectOpen('书册下拉框')
            "
            v-click-outside="() => (bookSelectOpen = false)"
        >
            <div class="book-select-text">
                {{ selectedBookName.trim() ? selectedBookName : "请选择书册" }}
            </div>
            <div
                class="book-select-box"
                v-if="bookSelectOpen"
                :style="{
                    width: `${
                        bookList.length < 10
                            ? bookList.length === 0
                                ? 112
                                : bookList.length * 92 + 112
                            : 940
                    }px`,
                }"
            >
                <div
                    class="book-item"
                    v-for="(item, index) in bookList"
                    :key="index"
                    @click.stop="selectBook(item)"
                >
                    <Book :book="item" @update="getCustomBookList" />
                </div>
                <div
                    class="book-add-btn"
                    @click="
                        (setbookSelectOpen = true), clicKBuryPoint('添加书册')
                    "
                >
                    <img
                        src="@/assets/images/preparation/book/icon_add_shu.png"
                        alt=""
                    />
                    添加书册
                </div>
            </div>
        </div>

        <el-dialog
            custom-class="custom-dialog"
            v-model="setbookSelectOpen"
            center
            title="书册筛选"
            width="600px"
        >
            <el-form>
                <el-form-item label="学段：">
                    <el-radio-group
                        class="custom-radio"
                        v-model="schoolSection"
                        size="small"
                    >
                        <el-radio-button
                            v-for="item in allBookList"
                            :key="item.Id"
                            :label="item.Id"
                            >{{ item.Name }}</el-radio-button
                        >
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="学科：">
                    <el-radio-group
                        class="custom-radio"
                        v-model="subject"
                        size="small"
                    >
                        <el-radio-button
                            v-for="item in subjectList"
                            :key="item.Id"
                            :label="item.Id"
                            >{{ item.Name }}</el-radio-button
                        >
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="版本：">
                    <el-radio-group
                        class="custom-radio"
                        v-model="version"
                        size="small"
                    >
                        <el-radio-button
                            v-for="item in versionList"
                            :key="item.Id"
                            :label="item.Id"
                            >{{ item.Name }}</el-radio-button
                        >
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="年级：">
                    <el-radio-group
                        class="custom-radio"
                        v-model="grade"
                        size="small"
                    >
                        <el-radio-button
                            v-for="item in gradeList"
                            :key="item.BookId"
                            :label="item.BookId"
                            >{{ item.Name }}</el-radio-button
                        >
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="setbookSelectOpen = false"
                        >取消</el-button
                    >
                    <el-button type="primary" @click="setBook()">
                        确认
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import { BookList } from "@/types/preparation";
import { MutationTypes, useStore } from "@/store";
import Book from "./book.vue";
import {
    fetchAllBookList,
    IBookItem,
    ICustomBookItem,
    fetchCustomBookList,
    fetchAddCustomBookList,
} from "@/api/resource";
import { get, remove, set, STORAGE_TYPES } from "@/utils/storage";
import usePageEvent from "@/hooks/usePageEvent";
import { EVENT_TYPE } from "@/config/event";
export default defineComponent({
    components: { Book },
    emits: ["onChangeBook"],
    setup(props, { emit }) {
        const { createBuryingPointFn } = usePageEvent("备课");
        const store = useStore();

        const bookSelectOpen = ref(false);
        const setbookSelectOpen = ref(false);

        // 全部书册
        const allBookList = ref<IBookItem[]>([]);
        // 学段
        const schoolSection = ref("");
        // 科目
        const subject = ref("");
        // 版本
        const version = ref("");
        // 年级
        const grade = ref("");

        // 科目列表
        const subjectList = computed(() => {
            return (
                allBookList.value.find(
                    (item) => item.Id === schoolSection.value
                )?.Children || []
            );
        });

        // 版本列表
        const versionList = computed(() => {
            return (
                subjectList.value.find((item) => item.Id === subject.value)
                    ?.Children || []
            );
        });

        // 年级列表
        const gradeList = computed(() => {
            return (
                versionList.value.find((item) => item.Id === version.value)
                    ?.Children || []
            );
        });

        // 直接给变量赋值不触发change事件 所以采用watch进行监听
        // 学段变化
        watch(schoolSection, async () => {
            subject.value =
                subjectList.value.length > 0 ? subjectList.value[0].Id : "";
        });

        // 因为数据存在科目和版本id不变的情况 下面监听多增加上一层变化的监听！！！！！！！！！！！
        // 科目变化
        watch([subject, schoolSection], async () => {
            version.value =
                versionList.value.length > 0 ? versionList.value[0].Id : "";
        });

        // 版本变化
        watch([version, subject, schoolSection], async () => {
            grade.value =
                gradeList.value.length > 0
                    ? gradeList.value[0].BookId || ""
                    : "";
        });

        // 获取全部书册
        const getAllBookList = async () => {
            const res = await fetchAllBookList();
            allBookList.value = res.result;
            if (allBookList.value.length > 0) {
                schoolSection.value = allBookList.value[0].Id;
            }

            store.commit(
                MutationTypes.SET_SUBJECT_PUBLISHER_BOOK_LIST,
                res.result
            );
        };

        // 常用书册
        const bookList = ref<ICustomBookItem[]>([]);
        // 获取常用配置书册
        const getCustomBookList = async (needSwitch?: boolean) => {
            const res = await fetchCustomBookList();
            bookList.value = res.result;
            // 选中的被删除了 置空选中的id
            if (needSwitch) selectedBook.value.Id = "";
            if (bookList.value.length === 0) {
                // 一本书都没有
                selectBook({
                    AlbumId: "",
                    AlbumName: "",
                    BookId: "",
                    PublisherId: "",
                    PublisherName: "",
                    SubjectId: "",
                    SubjectName: "",
                    Id: "",
                    AcaSectionId: "",
                    AcaSectionName: "",
                });

                // 弹出书册选择
                setbookSelectOpen.value = true;
            }
            if (bookList.value.length > 0 && !selectedBook.value.Id) {
                const book: ICustomBookItem | null = get(
                    STORAGE_TYPES.SELECT_BOOK_ID
                );
                const hasBook = !!bookList.value.find(
                    (item) => item.Id === book?.Id
                );
                if (hasBook && book) {
                    return selectBook(book);
                }
                // 默认选中第一个
                selectBook(bookList.value[0]);
            }
        };

        const init = () => {
            getAllBookList();
            getCustomBookList();
        };

        init();

        const selectedBook = ref<ICustomBookItem>({
            AlbumId: "",
            AlbumName: "",
            BookId: "",
            PublisherId: "",
            PublisherName: "",
            SubjectId: "",
            SubjectName: "",
            Id: "",
            AcaSectionId: "",
            AcaSectionName: "",
        });

        const selectedBookName = computed(() => {
            return (
                selectedBook.value.SubjectName +
                " " +
                selectedBook.value.PublisherName +
                " " +
                selectedBook.value.AlbumName
            );
        });

        const selectBook = (data: ICustomBookItem) => {
            selectedBook.value = data;
            bookSelectOpen.value = false;
            set(STORAGE_TYPES.SELECT_BOOK_ID, data);
            store.commit(MutationTypes.SET_SUBJECT_PUBLISHER_BOOK_VALUE, data);
            emit("onChangeBook", data);
            //切换书册创建埋点
            createBuryingPointFn(
                EVENT_TYPE.PageClick,
                "切换书册",
                "切换书册",
                data
            );
        };

        // 确认设置某本常用书册
        const setBook = async () => {
            setbookSelectOpen.value = false;
            const res = await fetchAddCustomBookList({
                bookId: grade.value,
            });
            await getCustomBookList();
            const book = bookList.value.find(
                (item) => item.BookId === grade.value
            );
            if (book) selectBook(book);
            //确认添加书册后创建埋点
            createBuryingPointFn(
                EVENT_TYPE.PageClick,
                "确定添加书册",
                "确定",
                book
            );
        };
        //书册下拉框是打开的时候再触发埋点
        const isBookSelectOpen = (name: string) => {
            if (bookSelectOpen) {
                clicKBuryPoint(name);
            }
        };
        //书册下拉框点击埋点事件
        const clicKBuryPoint = (name: string) => {
            createBuryingPointFn(EVENT_TYPE.PageClick, name, name);
        };

        return {
            bookSelectOpen,
            setbookSelectOpen,
            bookList,
            setBook,
            selectBook,
            selectedBook,
            schoolSection,
            subject,
            version,
            grade,
            allBookList,
            subjectList,
            versionList,
            gradeList,
            getCustomBookList,
            selectedBookName,
            clicKBuryPoint,
            isBookSelectOpen,
        };
    },
});
</script>

<style lang="scss" scoped>
.p-layout-select {
    height: 60px;
    display: flex;
    align-items: center;
    color: var(--app-color-text-default);
    padding: 10px 15px;
    width: 100%;
    position: relative;
    z-index: 10;
}

.book-select {
    padding: 10px 12px;
    border-radius: 4px;
    border: 1px solid var(--app-color-border-grey);
    color: var(--app-color-dark);
    flex: 1;
    min-width: 0;
    margin-left: 15px;
    cursor: pointer;
    position: relative;
    .book-select-text {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    &:hover {
        border-color: var(--app-color-primary);
        &:before {
            border-color: var(--app-color-primary) transparent transparent
                transparent;
        }
    }
    &:before {
        content: "";
        display: block;
        border: 5px solid;
        border-color: var(--app-color-border-grey) transparent transparent
            transparent;
        position: absolute;
        top: 50%;
        transform: translateY(calc(-50% + 2px));
        right: 8px;
    }
    &.active {
        &:before {
            transform: translateY(calc(-50% - 4px)) rotate(180deg);
        }
    }
    &.noBook {
        color: #f60000;
    }
}

.book-select-box {
    position: absolute;
    top: calc(100% + 10px);
    left: 0;
    padding: 16px 4px 4px 16px;
    background: #fff;
    box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.16);
    border-radius: 4px;
    display: flex;
    flex-wrap: wrap;
    min-width: 0;
}

.book-item {
    width: 80px;
    margin-right: 12px;
    margin-bottom: 12px;
    cursor: pointer;
    &:last-child {
        margin-right: 0;
    }
}

.book-add-btn {
    width: 80px;
    height: 112.7px;
    margin-right: 12px;
    margin-bottom: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(75, 113, 242, 0.2);
    color: var(--app-color-primary);
    font-size: 12px;
    cursor: pointer;
    img {
        display: block;
        margin-bottom: 6px;
        width: 20px;
    }
}

.custom-radio {
    :deep(.el-radio-button__inner) {
        margin-right: 10px;
        border-radius: var(--el-border-radius-base);
        border: 1px solid #dcdfe6;
    }
    :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
        background-color: #fff;
        color: var(--el-color-primary);
        border: 1px solid var(--el-color-primary);
        box-shadow: none;
    }
}
</style>
