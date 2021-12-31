<template>
      <div>
    <div class="access-system-detail">
      <div class="system-explain">
        <p>{{questionTypeName}} : </p>
        <div ref="questionContentRef"/>
        <div ref="answerContentRef"/>
      </div>
      <div class="system-detail" @click="lookQuestions({id: questionDetailId,type: 0})">
        <img src="@/assets/images/homeworkNew/icon_timuxiangqing.png" alt="" />
        <span>题目详情</span>
      </div>
    </div>
    <div class="access-system-stdentList">
      <el-collapse v-model="activeNames">
        <el-collapse-item
          :class="`correct-student_${index + 1}`"
          v-for="(item, index) in list"
          :key="index"
          :name="`${index}`"
        >
          <template v-slot:title>
            <p>
              <template v-if="index == 0">待批阅</template>
              <template v-if="index == 1">答错学生</template>
              <template v-if="index == 2">答对学生</template>
              <template v-if="index == 3">未做学生</template>
              <span style="font-size: 12px">({{ item.length }})人</span>
            </p>
          </template>
          <div class="access-system-student" v-if="index != 3">
            <ReviewList :item="item"/>
          </div>
          <div v-else class="general-reference-student">
            <NulliparousStudents
              v-for="(value, index1) in item"
              :key="index1"
              :index="index1"
              :HeadPortrait="value.StudentHeadPortrait"
              :name="value.StudentName"
              :className="value.StudentClassName"
            ></NulliparousStudents>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script lang="ts">
import { MissionDetail } from "@/types/checkHomework";
import { lookQuestions } from "@/utils";
import { computed, defineComponent, PropType, ref, watchEffect } from "vue";
import { QuestionResultTypeEnum } from "../enum";
import { getQuestionType } from "../logic";
import NulliparousStudents from "../NulliparousStudents.vue";
import ReviewList from "./ReviewList.vue";
export default defineComponent({
    props: {
        MissionDetails: {
            type: Array as PropType<MissionDetail[]>,
            default: () => []
        },
        className: {
            type: String,
            default: ""
        },
        questionContent: {
            type: String,
            default: ""
        },
        answerContent: {
            type: String,
            default: ""
        },
        type: {
            type: Number,
            default: -1
        },
        questionDetailId: {
            type: String,
            default: ""
        }
    },
    setup(props) {
        const activeNames = ref(["0", "1", "2", "3"]);
        const questionContentRef = ref<HTMLDivElement>();
        const answerContentRef = ref<HTMLDivElement>();
        const list = computed(() => {
            const list = [];
            list[0] = props.MissionDetails.filter((m) => m.Result === QuestionResultTypeEnum.NOT_SURE);
            list[1] = props.MissionDetails.filter((m) => m.Result === QuestionResultTypeEnum.ERROR);
            list[2] = props.MissionDetails.filter((m) => m.Result === QuestionResultTypeEnum.RIGHT);
            list[3] = props.MissionDetails.filter((m) => m.Result === QuestionResultTypeEnum.NOT_DONE);
            return list;
        });
        const questionTypeName = computed(() => getQuestionType(props.type));

        const getIndex = (index: number, index1: number) => {
            const timeoutIndex = index1 + list.value[index].length;
            return timeoutIndex;
        };

        watchEffect(() => {
            if (questionContentRef.value && answerContentRef.value) {
                questionContentRef.value.innerHTML = props.questionContent;
                answerContentRef.value.innerHTML = props.answerContent;
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                MathJax.texReset();
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                MathJax.typesetClear();
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                MathJax.typesetPromise([questionContentRef.value, answerContentRef.value]);
            }
        });

        return {
            lookQuestions,
            list,
            getIndex,
            questionContentRef,
            answerContentRef,
            questionTypeName,
            activeNames
        };
    },
    components: { NulliparousStudents, ReviewList }
});
</script>

<style lang="scss" scoped>
.access-system-detail {
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;
  align-items: center;
  .system-explain {
    font-size: 14px;
    p:nth-of-type(1) {
      font-size: 16px;
      font-weight: 700;
      color: #19203d;
      line-height: 20px;
    }
  }
  .system-detail {
    width: 140px;
    height: 40px;
    background: #4b71ee;
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    cursor: pointer;
    span {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 22px;
      padding-left: 8px;
    }
    img {
      width: 20px;
    }
  }
}
.access-system-stdentList {
  .correct-student_1 {
    :deep(.is-active) {
      background: #ececef;
    }
    :deep(.el-collapse-item__wrap) {
      background: #ececef;
      border-bottom: 10px solid #fff;
    }
    .access-system-student {
      padding: 0 24px 16px 24px;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;

      i {
        width: 294px;
      }
    }
  }
  .correct-student_2 {
    :deep( .is-active) {
      background: #fef2f6;
    }
    :deep(.el-collapse-item__wrap) {
      background: #fef2f6;
      border-bottom: 10px solid #fff;
    }
    .access-system-student {
      padding: 0 24px 16px 24px;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      i {
        width: 294px;
      }
    }
  }
  .correct-student_3 {
    :deep(.is-active) {
      background: #defaf3;
    }
    :deep(.el-collapse-item__wrap) {
      background: #defaf3;
      border-bottom: 10px solid #fff;
    }
    .access-system-student {
      padding: 0 24px 16px 24px;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      i {
        width: 294px;
      }
    }
  }
  .correct-student_4 {
    :deep(.is-active) {
      background: #ececef;
    }
    :deep(.el-collapse-item__wrap) {
      background: #ececef;
      border-bottom: 10px solid #fff;
    }
    .access-system-student {
      padding: 0 24px 16px 24px;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      i {
        width: 294px;
      }
    }
  }
  .to-be-reviewed {
    :deep(.is-active) {
      background: #ececef;
    }
    :deep(.el-collapse-item__wrap) {
      background: #ececef;
      border-bottom: 10px solid #fff;
    }
    .access-system-student {
      padding: 0 24px 16px 24px;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      i {
        width: 294px;
      }
    }
  }
  .wrong-answer-student {
    :deep(.is-active) {
      background: #fef2f6;
    }
    :deep(.el-collapse-item__wrap) {
      background: #fef2f6;
      border-bottom: 10px solid #fff;
    }
    .wrong-answer-title {
      display: flex;
      align-items: flex-end;
      span {
        font-size: 12px;
        padding: 0 8px;
      }
      p {
        span {
          padding: 0;
        }
      }
      p:nth-of-type(2) {
        font-size: 12px;
      }
    }
    .access-system-student {
      padding: 0 24px 16px 24px;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      i {
        width: 294px;
      }
    }
  }
  padding: 24px;
  :deep( .el-collapse) {
    background: #f3f7ff;
  }
  :deep( .el-collapse-item) {
    background: #f3f7ff;
  }
  :deep( .el-collapse-item__header) {
    padding: 18px 24px;
    font-size: 18px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #19203d;
  }
  :deep( .is-active) {
    background: #f5f6fa;
  }
  :deep( .el-collapse-item__wrap) {
    background: #f5f6fa;
    border-bottom: 10px solid #fff;
  }
  :deep( .el-collapse-item__content) {
    padding-bottom: 16px;
  }
  .general-reference-student {
    padding: 0 24px 16px 24px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    i {
      width: 250px;
      margin-right: 10px;
    }
  }
}
</style>
