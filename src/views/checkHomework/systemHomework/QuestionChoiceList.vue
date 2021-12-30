<template>
    <div class="container">
        <div
            v-for="choice in choiceList"
            :key="choice"
            class="choice"
            :class="{ check: choice === choiceValue }"
        >
            {{ choice }}
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { QuestionTypeEnum } from "../enum";
export default defineComponent({
    props: {
        questionType: {
            type: Number,
            default: 1
        },
        choiceCount: {
            type: Number,
            default: 1
        },
        choiceValue: {
            type: String,
            default: ""
        }
    },
    setup(props) {
        const choiceList = computed(() => {
            let list: string[] = [];
            switch (props.questionType) {
            case QuestionTypeEnum.SELECT_ALPHABAT:
                for (let i = 0; i < props.choiceCount; i++) {
                    const choice = String.fromCharCode(i + 65);
                    list.push(choice);
                }
                break;
            case QuestionTypeEnum.SELECT_NUMBER:
                for (let i = 1; i <= props.choiceCount; i++) {
                    list.push(i.toString());
                }
                break;
            case QuestionTypeEnum.SELECT_TF:
                list = ["T", "F"];
                break;
            case QuestionTypeEnum.SELECT_OKCANCEL:
                list = ["√", "×"];
                break;
            default:
                break;
            }
            return list;
        });

        return {
            choiceList
        };
    }
});
</script>

<style lang="scss" scoped>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    .choice {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        width: 50px;
        height: 50px;
        margin-right: 20px;
        background: #d1eaff;
        border: 1px solid #add9ff;
        box-shadow: 0px 0px 4px #dfe2ea;
        border-radius: 3px;
        color: #2d3652;
        &.check {
            background: #44cf6b;
            color: #ffffff;
            border-color: #2db753;
        }
        &:last-child {
            margin-right: 0;
        }
    }
}
</style>
