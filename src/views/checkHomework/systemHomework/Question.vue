<template>
    <div class="question-box">
        <img
            class="question-img"
            :style="{
                width: imgWidth === 0 ? 'auto' : imgWidth + 'px',
                height: imgHeight + 'px',
                top: imgOffsetY + 'px',
                left: imgOffsetX + 'px',
            }"
            v-show="isOrigin && questionType != 7 && questionOnLoad"
            :src="question"
            @load="loadQuestionEnd"
            alt=""
        />
        <img
            class="question-img"
            :style="{
                width: imgWidth + 'px',
                height: imgHeight + 'px',
                top: imgOffsetY + 'px',
                left: imgOffsetX + 'px',
            }"
            v-show="!isOrigin && questionType != 7 && answerOnLoad"
            :src="answer"
            @load="loadAnswerEnd"
            alt=""
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
    props: {
        question: {
            type: String,
            default: ""
        },
        answer: {
            type: String,
            default: ""
        },
        isQuestion: {
            type: Boolean,
            default: true
        },
        isOrigin: {
            type: Boolean,
            default: true
        },
        isWrite: {
            type: Boolean,
            default: true
        },
        questionType: {
            type: Number,
            default: 1
        },
        choiceValue: {
            type: String,
            default: ""
        },
        imgWidth: {
            type: Number,
            default: 0
        },
        imgHeight: {
            type: Number,
            default: 0
        },
        imgOffsetX: {
            type: Number,
            default: 0
        },
        imgOffsetY: {
            type: Number,
            default: 0
        }
    },
    setup() {
        const questionOnLoad = ref(false);
        const answerOnLoad = ref(false);

        const loadQuestionEnd = () => {
            questionOnLoad.value = true;
        };

        const loadAnswerEnd = () => {
            answerOnLoad.value = true;
        };

        return {
            questionOnLoad,
            answerOnLoad,
            loadAnswerEnd,
            loadQuestionEnd
        };
    }
});
</script>

<style lang="scss" scoped>
.question-box {
    height: 100%;
    width: 100%;
    position: relative;
}

.question-img {
    position: absolute;
}

.speech {
    font-weight: 600;
    padding-top: 98px;
    padding-left: 44px;
    font-size: 32px;
}

:deep(.speech.basic) span {
    color: #555555 !important;
}

.selected-answer {
    padding-left: 40px;
    padding-top: 30px;
    font-size: 24px;
    font-weight: 600;
    color: #555;
}

</style>
