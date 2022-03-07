<template>
    <div class="question-box">
        <div class="header-title">
            <p
                :class="[titleIndex === index ? 'active' : '']"
                v-for="(item, index) in titleList"
                :key="index"
                @click="titleIndex = index"
            >
                {{ item.title }}
            </p>
        </div>
        <div class="content">
            <div class="select-row">
                <el-cascader
                    v-model="subjectPublisherBookValue"
                    :props="cascaderProps"
                    :options="options"
                ></el-cascader>
                <el-select
                    v-model="teacherBookChapter"
                    placeholder="请选择"
                    style="margin: 0 6px"
                >
                    <el-option
                        v-for="(item, index) in teacherBookChapterList"
                        :key="index"
                        :label="`${item.Name}  ${item.Detial}`"
                        :value="item.ID"
                    >
                    </el-option>
                </el-select>
                <el-select v-model="lessonID" v-if="titleIndex === 1">
                    <el-option label="全部课时" :value="null" />
                    <el-option
                        v-for="item in lessons"
                        :key="item.ID"
                        :label="item.Name"
                        :value="item.ID"
                    />
                </el-select>
            </div>
            <div class="BagLessons-row">
                <keep-alive>
                    <BagChapter
                        v-if="titleIndex === 0"
                        :subjectPublisherBookValue="subjectPublisherBookValue"
                        :teacherBookChapter="teacherBookChapter"
                    />
                    <Material v-else :chapterID="teacherBookChapter" :lessonID="lessonID" :lessons="lessons"/>
                </keep-alive>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import useSubjectPublisherBookList, { subjectPublisherBookList } from "@/hooks/useSubjectPublisherBookList";
import { findFirstId } from "@/utils";
import useBook from "@/views/preparation/hooks/useBook";
import { isEmpty } from "lodash";
import { computed, defineComponent, inject, Ref, ref, watch, watchEffect } from "vue";
import BagChapter from "./BagChapter.vue";
import Material from "./Material.vue";
export default defineComponent({
    name: "questionBank",
    setup() {
        const titleIndex = ref(0);
        const titleList = [{ title: "系统题库" }, { title: "精品素材" }];
        const subjectPublisherBookValue = ref<string[]>([]);

        const subjectId = inject("subjectId") as Ref<string>;
        const initSubjectPublisherBookValue = inject("initSubjectPublisherBookValue", ref([])) as Ref<string[]>;
        const {
            teacherBookChapterList,
            cascaderProps,
            lessonID,
            lessons,
            getLessons,
            getTeacherBookChapters,
            teacherBookChapter
        } = useBook();

        useSubjectPublisherBookList();

        watch([teacherBookChapter, titleIndex], ([value, index]) => {
            if (index === 1) {
                getLessons(value);
            }
        });

        watchEffect(() => {
            if (isEmpty(initSubjectPublisherBookValue.value)) {
                findFirstId(subjectPublisherBookList.value, subjectPublisherBookValue.value);
            } else {
                subjectPublisherBookValue.value = initSubjectPublisherBookValue.value.slice(1);
            }
        });

        watchEffect(() => {
            if (isEmpty(subjectPublisherBookValue.value)) return;
            getTeacherBookChapters(subjectPublisherBookValue.value[1]).then(() => {
                teacherBookChapter.value = teacherBookChapterList.value[0]?.ID;
            });
        });

        const options = computed(() => {
            return subjectPublisherBookList.value.find(({ Value }) => Value === subjectId.value)?.Children || [];
        });

        return {
            titleIndex,
            titleList,
            subjectPublisherBookList,
            subjectPublisherBookValue,
            teacherBookChapter,
            cascaderProps,
            lessonID,
            lessons,
            options,
            teacherBookChapterList
        };
    },
    components: { BagChapter, Material }
});
</script>

<style lang="scss" scoped>
.question-box {
    flex: 1;
    height: 100%;
    background: #edf3ff;
    border-radius: 4px;
    border: 1px solid #dce8ff;
    .header-title {
        display: flex;
        height: 36px;
        justify-content: center;
        font-size: 18px;
        font-weight: 600;
        color: #a7aab4;
        background: #dce8ff;
        p {
            cursor: pointer;
            line-height: 36px;
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
    .content {
        height: calc(100% - 46px);
        padding: 12px;
        .select-row {
            display: flex;
        }
        .BagLessons-row {
            width: 100%;
            height: calc(100% - 40px);
            margin-top: 12px;
            overflow-y: auto;
        }
    }
}
</style>
