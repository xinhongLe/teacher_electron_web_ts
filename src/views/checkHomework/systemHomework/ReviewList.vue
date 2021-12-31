<template>
    <div
        v-for="(value, index) in item"
        :key="value.MisssionStudyID"
        class="access-system-student-item"
    >
        <Review
            :result="value.Result"
            :className="value.StudentClassName"
            :detail="list[index] || {}"
            :index="index"
            :openEnlarge="openEnlarge"
        ></Review>
    </div>
    <Enlarge ref="enlargeRef" :detailList="list" :MissionList="item">
        <template v-slot:default="slotProps">
            <template v-if="slotProps.detail.Detail">
                <TeacherAnswerImg
                    v-if="slotProps.detail.Detail.HomeworkPaperType === 2"
                    :data="slotProps.detail"
                />
                <template
                    v-else-if="slotProps.detail.Detail.HomeworkPaperType === 0"
                >
                    <QuestionChoiceList
                        v-if="slotProps.detail?.Question?.Type < 5"
                        :choiceValue="slotProps.detail.Study?.ChoiceValue"
                        :questionType="slotProps.detail?.Question?.Type"
                        :choiceCount="slotProps.detail?.Question?.ChoiceCount"
                    />
                    <Answer
                        :data="slotProps.detailData"
                        :questionType="slotProps.detail?.Question?.Type"
                        :question="slotProps.question"
                        :answer="slotProps.answer"
                        :isOrigin="true"
                        :isQuestion="true"
                        :writeList="slotProps.detail?.Question?.QuestionBlanks"
                        :choiceValue="slotProps.detail.Question?.ChoiceValue"
                        :result="slotProps.detail?.Detail?.Result"
                    ></Answer>
                </template>
            </template>
        </template>
    </Enlarge>
</template>

<script lang="ts">
import { MissionDetail, QuestionDetail } from "@/types/checkHomework";
import { defineComponent, PropType, ref, watchEffect } from "vue";
import { fetchDetailByMissionStudyID } from "../api";
import Review from "./Review.vue";
import Enlarge from "./Enlarge.vue";
import TeacherAnswerImg from "./TeacherAnswerImg.vue";
import QuestionChoiceList from "./QuestionChoiceList.vue";
import Answer from "./Answer.vue";
export default defineComponent({
    props: {
        item: {
            type: Array as PropType<MissionDetail[]>,
            default: () => []
        }
    },
    setup(props) {
        const list = ref<QuestionDetail[]>([]);
        const enlargeRef = ref<InstanceType<typeof Enlarge>>();

        watchEffect(async () => {
            if (props.item.length > 0) {
                const listPromise = props.item.map(({ MisssionStudyID }) =>
                    fetchDetailByMissionStudyID({
                        MissionStudyID: MisssionStudyID
                    })
                );
                list.value = (await Promise.all(listPromise)).map((res) =>
                    res.resultCode === 200 ? res.result : {}
                );
            }
        });

        const openEnlarge = (index: number) => {
            if (enlargeRef.value) {
                enlargeRef.value.visible = true;
                enlargeRef.value.currentIndex = index;
            }
        };

        return {
            list,
            openEnlarge,
            enlargeRef
        };
    },
    components: { Review, Enlarge, TeacherAnswerImg, QuestionChoiceList, Answer }
});
</script>

<style lang="scss" scoped>
.access-system-student-item {
    margin-right: 20px;
}
</style>
