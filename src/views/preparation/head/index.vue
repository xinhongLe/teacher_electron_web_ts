<template>
    <div class="preparation-header flex-between-center">
        <div>
            <el-cascader
                v-model="subjectPublisherBookValue"
                :props="cascaderProps"
                style="margin-right: 20px"
                :options="subjectPublisherBookList"
            ></el-cascader>
            <el-select
                v-model="teacherBookChapter"
                popper-class="chapter-class"
            >
                <el-option
                    v-for="item in teacherBookChapterList"
                    :key="item.ID"
                    :label="`${item.Name}  ${item.Detial}`"
                    :value="item.ID"
                    :disabled="!item.ID"
                >
                    <!-- <template -->
                        <!-- v-if="index !== teacherBookChapterList.length - 1" -->
                    <!-- > -->
                        <span>{{ item.Name }}</span>
                        <span style="padding-left: 20px">{{
                            item.Detial
                        }}</span>
                    <!-- </template> -->
                    <!-- <template v-else>
                        <div
                            style="z-index: 999; color: #4b71ee"
                            @click="dialogVisible = true"
                        >
                            <span class="el-icon-circle-plus-outline"></span>
                            <span>添加自定义单元</span>
                        </div>
                    </template> -->
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
import { getCourseByCourseBag } from "@/api";
import { MutationTypes, store } from "@/store";
import { GetLastSelectBookRes } from "@/types/preparation";
import { findFirstId } from "@/utils";
import { computed, defineComponent, ref, watch } from "vue";
import { getLastSelectBook, setLastSelectBook } from "../api";
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
        const courseBagDetail = ref<getCourseByCourseBag>();
        let selectBook: GetLastSelectBookRes;
        let isFirst = true;
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
            store.commit(MutationTypes.SET_SELECT_COURSE_BAG, {});
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
            getTeacherBookChapters(value[2]).then(() => {
                if (selectBook && Object.keys(selectBook).length !== 0 && isFirst) {
                    isFirst = false;
                    return (teacherBookChapter.value = selectBook.ChapterID);
                }
                if (courseBagDetail.value) {
                    const { ChapterName } = courseBagDetail.value!;
                    const info = teacherBookChapterList.value.find(({ Name }) => ChapterName === Name);
                    const id = info ? info.ID : teacherBookChapterList.value[0].ID;
                    teacherBookChapter.value = id;
                    return (courseBagDetail.value = undefined);
                }
                teacherBookChapter.value = teacherBookChapterList.value[0]?.ID;
            });
            store.commit(MutationTypes.SET_SUBJECT_PUBLISHER_BOOK_VALUE, value);
        }, {
            deep: true
        });

        watch([() => store.state.preparation.isClickDetail, subjectPublisherBookList], (v) => {
            const [isClickDetail] = v;
            const { selectCourseBag } = store.state.preparation;
            if (isClickDetail) {
                const { Type, ID } = selectCourseBag;
                const courseBagData =
                    Type === 1
                        ? {
                            courseBagID: ID!
                        }
                        : {
                            courseBagTeacherID: ID!
                        };
                getCourseByCourseBag(
                    Type!,
                    courseBagData
                ).then(res => {
                    store.commit(MutationTypes.SET_IS_CLICK_DETAIL, false);
                    if (res.resultCode === 200) {
                        courseBagDetail.value = res.result;
                        const { SubjectName, AlbumName, PublishName } = courseBagDetail.value!;
                        subjectPublisherBookList.value.forEach((item) => {
                            if (item.Lable === SubjectName) {
                                item.Children && item.Children.forEach(item1 => {
                                    if (item1.Lable === PublishName) {
                                        item1.Children && item1.Children.forEach(item2 => {
                                            if (item2.Lable === AlbumName) {
                                                subjectPublisherBookValue.value = [item.Value, item1.Value, item2.Value];
                                                return false;
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        findFirstId([subjectPublisherBookList.value[0]], subjectPublisherBookValue.value);
                    }
                });
            }
        });

        getSubjectPublisherBookList().then(async () => {
            if (store.state.preparation.isClickDetail) return;
            const selectBookRes = await getLastSelectBook({
                subjectID: ""
            });
            if (selectBookRes.resultCode === 200) {
                selectBook = selectBookRes.result;
            }
            if (Object.keys(selectBookRes.result).length !== 0) {
                const { BookID, PublisherID, SubjectID } = selectBook;
                subjectPublisherBookValue.value = [SubjectID, PublisherID, BookID];
            } else {
                findFirstId([subjectPublisherBookList.value[0]], subjectPublisherBookValue.value);
            }
        });

        return {
            titleList,
            subjectPublisherBookValue,
            subjectPublisherBookList,
            cascaderProps,
            // teacherBookChapterList: computed(() => [...teacherBookChapterList.value, {
            //     ID: "",
            //     Detial: "",
            //     Name: "",
            //     Remark: "",
            //     Sort: 0
            // }]),
            teacherBookChapterList: computed(() => [...teacherBookChapterList.value]),
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
