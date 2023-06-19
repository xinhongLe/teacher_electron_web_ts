<template>
    <div class="me-remark">
        <div class="me-remark-content">
            <div class="lesson-set">
                <div class="me-remark-title">配套教案</div>
                <div class="lesson-view" v-if="!hideLookAll" @click="openLessonDesign">
                    <span>查看全部</span>
                    <el-icon>
                        <ArrowRight/>
                    </el-icon>
                </div>
            </div>
            <div class="me-remark-title" v-if="teachProcess">教学过程</div>
            <ul v-if="teachProcess">
                <li v-for="(item, index) in teachProcess.split('\n')" :key="index">
                    <span class="dot" v-if="item"></span>
                    {{ item }}
                </li>
            </ul>
            <div class="h-place"></div>
            <div class="me-remark-title" v-if="design">设计意图</div>
            <ul v-if="design">
                <li v-for="(item, index) in design.split('\n')" :key="index">
                    <span class="dot" v-if="item"></span>
                    {{ item }}
                </li>
            </ul>
        </div>
    </div>

    <lesson-preview v-model:previewDialog="previewDialog" :wordName="wordName" :form="form"></lesson-preview>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { ArrowRight } from "@element-plus/icons-vue";
import { IFrom, ItemForm } from "@/types/lessonDesign";
import { store } from "@/store";
import { getLessonPlan } from "@/api/home";
import LessonPreview from "@/views/preparation/intelligenceClassroom/components/edit/lessonPreview.vue";

export default defineComponent({
    name: "Remark",
    components: { ArrowRight, LessonPreview },
    props: ["teachProcess", "design", "resourceId", "isSystem", "hideLookAll"],
    setup(props) {
        const form = reactive<IFrom>({
            templateType: "",
            lessonBasicInfoList: []
        });

        const previewDialog = ref(false);
        const wordName = ref("");
        const openLessonDesign = () => {
            _getLessonPlan();
        };

        const _getLessonPlan = () => {
            const data = {
                TeachPageID: props.resourceId,
                TeacherID: store.state.userInfo.id,
                FranchiseeID: store.state.userInfo.schoolId,
                OriginType: props.isSystem ? 0 : 1
            };
            return getLessonPlan(data).then(res => {
                if (res.resultCode === 200) {
                    const infoList: ItemForm[] = res.result.LessonPlanDetails.map((item: any) => {
                        if (item.SelectType === 2 && item.LessonPlanDetailOptions.length === 0) {
                            item.LessonPlanDetailOptions = [{ ID: "", Value: "" }];
                        } else if (item.SelectType === 4 || item.SelectType === 6) {
                            const selectValue = item.LessonPlanDetailOptions.find((item: any) => item.IsSelect === 1);
                            item.isSelectId = selectValue ? selectValue.ID : "";
                        } else if (item.SelectType === 5) {
                            const selectValue = item.LessonPlanDetailOptions.filter((item: any) => item.IsSelect);
                            item.isSelectId = selectValue.map((i: any) => i.ID);
                        }
                        return item;
                    });

                    form.lessonBasicInfoList = infoList;
                    form.templateType = res.result.LessonPlanTemplateMainID;
                    wordName.value = res.result.TeachPageName || "";

                    previewDialog.value = true;
                }
            });
        };

        return {
            previewDialog,
            wordName,
            form,
            openLessonDesign
        };
    }
});
</script>

<style lang="scss" scoped>
.lesson-set {
    display: flex;
    justify-content: space-between;
    padding: 30px 20px 40px 0;

    .lesson-view {
        display: flex;
        align-items: center;
        color: #4B71EE;
        cursor: pointer;

        > span {
            margin-right: 4px;
        }
    }
}

.me-remark {
    width: 240px;
    background-color: #fff;
    box-sizing: border-box;
    padding: 20px 10px !important;
}

.me-remark-title {
    position: relative;
    font-weight: 600;
    font-size: 16px;
    color: var(--app-color-dark);
    text-align: left;
    margin-left: 16px;

    &::after {
        display: block;
        content: "";
        position: absolute;
        left: -14px;
        bottom: 5px;
        width: 8px;
        height: 8px;
        background: #4B71EE;
        transform: rotate(45deg);
    }
}

.me-remark-content {
    height: 100%;
    overflow-y: auto;
}

.me-remark-content ul {
    margin-top: 20px;
    font-size: 14px;
    color: #5F626F;
    text-align: left;
}

.me-remark-content ul li {
    margin-bottom: 16px;
    line-height: 20px;
    word-break: break-all;
    display: flex;

    .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        margin-top: 8px;
        margin-right: 8px;
        flex-shrink: 0;
        background-color: #CCCED3;
    }
}

.h-place {
    height: 20px;
}
</style>
