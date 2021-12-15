<template>
    <div class="preparation-header flex-between-center">
        <div>
            <el-cascader
                v-model="subjectPublisherBookValue"
                :props="cascaderProps"
                style="margin-right:20px;"
                :options="subjectPublisherBookList"
            ></el-cascader>
            <el-select
                v-model="teacherBookChapter"
                popper-class="chapter-class"
            >
                <el-option
                    v-for="(item, index) in teacherBookChapterList"
                    :key="item.ID"
                    :label="`${item.Name}  ${item.Detial}`"
                    :value="item.ID"
                    :disabled="!item.ID"
                >
                    <template
                        v-if="index !== teacherBookChapterList.length - 1"
                    >
                        <span>{{ item.Name }}</span>
                        <span style="padding-left: 20px">{{
                            item.Detial
                        }}</span>
                    </template>
                    <template v-else>
                        <div
                            style="z-index: 999; color: #4b71ee"
                            @click="dialogVisible = true"
                        >
                            <span class="el-icon-circle-plus-outline"></span>
                            <span>添加自定义单元</span>
                        </div>
                    </template>
                </el-option>
            </el-select>
        </div>
        <div class="header-title flex-between-center">
            <p
                :class="[tabIndex === index ? 'active' : '']"
                v-for="(item, index) in titleList"
                :key="index"
                @click="clickTab(index)"
            >
                {{ item.title }}
            </p>
        </div>
        <div class="header-refresh">
            <!-- <img
                src="@/assets/images/preparation/icon_shuaxin_rest@2x.png"
                alt=""
            />
            <span @click="$router.go(0)">刷新</span> -->
            <el-button type="primary" @click="reload">刷新</el-button>
        </div>
        <ChapterDialog
            v-model:dialogVisible="dialogVisible"
            v-if="dialogVisible"
            :bookID="subjectPublisherBookValue[2]"
            @getTeacherBookChapters="
                getTeacherBookChapters(subjectPublisherBookValue[2])
            "
        />
    </div>
</template>

<script lang="ts">
import { MutationTypes, store } from "@/store";
import { computed, defineComponent, ref, watch } from "vue";
import { setLastSelectBook } from "../api";
import useBook from "../hooks/useBook";
import ChapterDialog from "./chapterDialog.vue";
export default defineComponent({
    name: "head",
    props: {
        reload: {
            type: Function
        }
    },
    setup(props, { emit }) {
        const titleList = [{ title: "翻转课堂" }, { title: "数智课堂" }];
        const tabIndex = ref(0);
        const {
            subjectPublisherBookList, subjectPublisherBookValue,
            teacherBookChapterList, cascaderProps, teacherBookChapter,
            getTeacherBookChapters, getSubjectPublisherBookList
        } = useBook();
        const dialogVisible = ref(false);

        const clickTab = (index: number) => {
            tabIndex.value = index;
        };

        const clickBtn = () => {
            tabIndex.value = 0;
            store.commit(MutationTypes.SET_VIEW_COURSE_DETAIL_ING, false);
            store.commit(MutationTypes.SET_SELECT_COURSE_BAG, {});
        };

        watch(teacherBookChapter, (value) => {
            store.commit(MutationTypes.SET_SELECT_CHAPTER_ID, value);
            setLastSelectBook({
                bookID: subjectPublisherBookValue.value[2],
                chapterID: value,
                subjectID: subjectPublisherBookValue.value[0]
            });
        });

        watch(tabIndex, (value) => {
            emit("update:tabIndex", value);
        });

        watch(subjectPublisherBookValue, (value) => {
            getTeacherBookChapters(value[2]);
            store.commit(MutationTypes.SET_SUBJECT_PUBLISHER_BOOK_VALUE, value);
        }, {
            deep: true
        });

        getSubjectPublisherBookList().then(() => {
            window.dispatchEvent(new Event("subjectPublisherBookListLoaded"));
        });

        return {
            titleList,
            subjectPublisherBookValue,
            subjectPublisherBookList,
            cascaderProps,
            teacherBookChapterList: computed(() => [...teacherBookChapterList.value, {
                ID: "",
                Detial: "",
                Name: "",
                Remark: "",
                Sort: 0
            }]),
            clickTab,
            tabIndex,
            dialogVisible,
            clickBtn,
            teacherBookChapter,
            getTeacherBookChapters
        };
    },
    components: { ChapterDialog }
});
</script>

<style lang="scss" scoped>
.preparation-header {
    width: 100%;
    height: 58px;
    padding: 10px 20px;
    // margin-bottom: 10px;
    user-select: none;
    background-color: #fff;
    .header-title {
        font-size: 18px;
        font-weight: 600;
        color: #a7aab4;
        p {
            cursor: pointer;
            padding-bottom: 10px;
            &:first-child {
                margin-right: 40px;
            }
            &.active {
                color: #19203d;
                border-bottom: 3px solid #4b71ee;
            }
        }
    }
    .header-refresh {
        cursor: pointer;
        display: flex;
        align-content: center;
        line-height: 14px;
        width: 460px;
        justify-content: flex-end;
        img {
            width: 13px;
            height: 13px;
            vertical-align: middle;
            margin-right: 2px;
        }
    }
}
</style>
