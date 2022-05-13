<template>
    <div class="p-layout-select">
        书册
        <div
            class="book-select"
            :class="bookSelectOpen && 'active'"
            @click.stop="bookSelectOpen = !bookSelectOpen"
            v-click-outside="() => (bookSelectOpen = false)"
        >
            {{ selectedBook.name || "请选择书册" }}
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
                    }px`
                }"
            >
                <div
                    class="book-item"
                    v-for="(item, index) in bookList"
                    :key="index"
                    @click.stop="selectBook(item)"
                >
                    <Book :book="item" />
                </div>
                <div class="book-add-btn" @click="setbookSelectOpen = true">
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
                <el-form-item label="学科：">
                    <el-radio-group
                        class="custom-radio"
                        v-model="subject"
                        size="small"
                        @change="onSubjectChange"
                    >
                        <el-radio-button v-for="item in subjectList" :key="item.Value" :label="item.Value">{{item.Lable}}</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="版本：">
                    <el-radio-group
                        class="custom-radio"
                        v-model="version"
                        size="small"
                        @change="onVersionChange"
                    >
                        <el-radio-button v-for="item in versionList" :key="item.Value" :label="item.Value">{{item.Lable}}</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="年级：">
                    <el-radio-group
                        class="custom-radio"
                        v-model="grade"
                        size="small"
                        @change="onGradeChange"
                    >
                        <el-radio-button v-for="item in gradeList" :key="item.Value" :label="item.Value">{{item.Lable}}</el-radio-button>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="setbookSelectOpen = false">取消</el-button>
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
import useSubjectPublisherBookList from "@/hooks/useSubjectPublisherBookList";
import { BookList, IBook } from "@/types/preparation";
import { useStore } from "@/store";
import Book from "./book.vue";
export default defineComponent({
    components: { Book },
    setup(props, { emit }) {
        const store = useStore();
        const subjectPublisherBookList = computed(() => store.state.preparation.subjectPublisherBookList);
        const selectedBook = ref({
            name: "",
            id: "",
            subject: ""
        });
        const bookSelectOpen = ref(false);
        const setbookSelectOpen = ref(false);
        const bookList = ref<IBook[]>([]);

        const setBook = () => {
            setbookSelectOpen.value = false;
            const book: IBook = {
                name: subjectName.value + " " + versionName.value + " " + gradeName.value,
                id: grade.value,
                subject: subjectName.value
            };
            bookList.value.push(book);
        };

        const selectBook = (data: IBook) => {
            selectedBook.value = data;
            bookSelectOpen.value = false;
            emit("onChangeBook", data);
        };

        const subject = ref("");
        const subjectName = ref("");
        const subjectList = ref<BookList[]>([]);
        const version = ref("");
        const versionName = ref("");
        const versionList = ref<BookList[]>([]);
        const grade = ref("");
        const gradeName = ref("");
        const gradeList = ref<BookList[]>([]);

        useSubjectPublisherBookList();
        watch(subjectPublisherBookList, () => {
            updateBookList();
        });

        const updateBookList = () => {
            if (subjectPublisherBookList.value.length > 0) {
                subject.value = subjectPublisherBookList.value[0].Value;
                subjectList.value = subjectPublisherBookList.value;
                onSubjectChange();
            } else {
                // subject.value = "";
                // subjectList.value = [];
                // version.value = "";
                // versionList.value = [];
                // grade.value = "";
                // gradeList.value = [];
            }
        };

        const onSubjectChange = () => {
            const result = subjectList.value.find(item => item.Value === subject.value);
            subjectName.value = result?.Lable || "";
            versionList.value = result?.Children || [];
            version.value = versionList.value.length > 0 ? versionList.value[0].Value : "";
            onVersionChange();
        };

        const onVersionChange = () => {
            const result = versionList.value.find(item => item.Value === version.value);
            versionName.value = result?.Lable || "";
            gradeList.value = result?.Children || [];
            grade.value = gradeList.value.length > 0 ? gradeList.value[0].Value : "";
            onGradeChange();
        };

        const onGradeChange = () => {
            gradeName.value = gradeList.value.find(item => item.Value === grade.value)?.Lable || "";
            // selectedBook.value.name = subjectName.value + " " + versionName.value + " " + gradeName.value;
        };

        updateBookList();

        return {
            bookSelectOpen,
            setbookSelectOpen,
            bookList,
            setBook,
            selectBook,
            subject,
            subjectName,
            subjectList,
            version,
            versionName,
            versionList,
            grade,
            gradeName,
            gradeList,
            onSubjectChange,
            onVersionChange,
            onGradeChange,
            selectedBook
        };
    }
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
