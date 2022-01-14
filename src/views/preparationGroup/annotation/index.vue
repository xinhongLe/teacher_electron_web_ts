<template>
    <div class="annotation">
        <div class="annotation-header">
            <div class="annotation-header-left">
                <div class="annotation-header-classinfo">
                    {{ WindowName }}
                </div>
                <div class="annotation-header-otherinfo">
                    <div><img src="@/assets/preparationGroup/icon_ren1.png" alt="">创建人：{{ lessonItem.CreaterName }}</div>
                    <div><img src="@/assets/preparationGroup/icon_time1.png" alt="">创建时间：{{ lessonItem.CreateTime }}</div>
                    <div><img src="@/assets/preparationGroup/icon_renshu1.png" alt="">小组人数：{{ lessonItem.TeacherCount }}人</div>
                    <div><img src="@/assets/preparationGroup/icon_fanwei.png" alt="">备课范围：{{ lessonItem.LessonRange }}</div>
                </div>
            </div>
            <div class="annotation-header-right" @click="openAnotation">
                <img src="@/assets/preparationGroup/icon_pizhu.png" alt="">
                打点批注
            </div>
        </div>
        <div class="annotation-main">
            <div class="annotation-main-left" v-if="!expandFlag">
                <CardList
                    ref="cardListRef"
                    :cardList="allCardList"
                    @updatePageList="updatePageList"
                />
            </div>
            <div class="annotation-main-center">
                <PageList
                    class="preview-pagelist"
                    style="margin-right: 15px"
                    ref="pageListRef"
                    :pageListOption="previewOptions"
                    :createTeacherID="createTeacherID"
                    @lastPage="lastPage"
                    @firstPage="firstPage"
                    @showAnnotation="showAnnotation"
                    @updatePageID="updatePageID"
                    @updateAnotationList="updateAnotationList"
                    @updateTeacherList="updateTeacherList"
                />
            </div>
            <div class="annotation-main-right" v-show="annotationFlag">
                <AnnotationList
                    ref="AnnotationListRef"
                    @addElement="addElement"
                    :AnotationList="AnotationList"
                    :teacherList="teacherList"
                    :cardID="cardID"
                    :pageID="pageID"
                    :lessonItem="lessonItem"
                    @successAdd="successAdd"
                    @selectTeacher="selectTeacher"
                ></AnnotationList>
            </div>
        </div>
        <div class='expandFixed'>
            <i v-if="expandFlag"  @click="expand" class="el-icon-d-arrow-right"></i>
        </div>
        <div class="expand-collapse">
            <i v-if="!expandFlag" @click="expand" class="el-icon-d-arrow-left"></i>
        </div>
    </div>
</template>

<script>
import { defineComponent, onMounted, ref, reactive } from "vue-demi";
import annotation from "./annotation";
import CardList from "./components/card-list.vue";
import PageList from "./components/page-list.vue";
import AnnotationList from "./components/annotation-list.vue";
import { useRoute } from "vue-router";
import { fetchPreparateDetail } from "../api";
import { lessonItemData } from "@/types/preparationGroup";
import useSubmit from "../editPanel/useSubmit";
import moment from "moment";
export default defineComponent({
    name: "preparationGroup",
    components: { CardList, PageList, AnnotationList },
    setup() {
        const AnotationList = ref([]);
        const teacherList = ref([]);
        const createTeacherID = ref("");
        const pageID = ref("");
        const AnnotationListRef = ref();
        const route = useRoute();
        const lessonItem = reactive({
            Attachments: [],
            CanEdit: false,
            CreateTime: "",
            EndTime: "",
            CreaterID: "",
            CreaterName: "",
            PreTitle: "",
            Status: 0,
            TeacherCount: 0,
            LessonRange: "",
            LessonRangeIDs: [],
            LessonContent: ""
        });
        const { cardListRef, cardID, pageListRef, allCardList, previewOptions, expandFlag, annotationFlag, _getWindowCards, updatePageList, expand, closeAnotation, openAnotation, lastPage, firstPage } = annotation();
        onMounted(async() => {
            getTextBookGrade();
            getPreparateDetail();
            const obj = {
                WindowID: route.params.id
            };
            await _getWindowCards(obj);
        });
        const showAnnotation = (e) => {
            annotationFlag.value = e;
        };
        const updatePageID = (id) => {
            pageID.value = id;
            AnnotationListRef.value.contentFlag = null;
        };
        // 更新批注
        const updateAnotationList = (e) => {
            AnotationList.value = e;
        };
        const updateTeacherList = (e) => {
            teacherList.value = e;
        };
        // 选择老师
        const selectTeacher = (e) => {
            createTeacherID.value = e;
        };
        const successAdd = () => {
            // 新增成功刷新批注列表
            pageListRef.value._getAnnotation();
            pageListRef.value._getAnnotationCreateTeachers();
        };
        const getPreparateDetail = async () => {
            const res = await fetchPreparateDetail({
                id: route.params.preId
            });
            if (res.resultCode === 200) {
                const { CanEdit, CreateTime, CreaterID, CreaterName, PreTitle, Status, TeacherCount = 0, LessonRange = "", LessonContent = "" } = res.result;
                lessonItem.CanEdit = CanEdit;
                lessonItem.CreateTime = moment(CreateTime).format("YYYY-MM-DD HH:mm:ss");
                lessonItem.CreaterID = CreaterID;
                lessonItem.CreaterName = CreaterName;
                lessonItem.PreTitle = PreTitle;
                lessonItem.Status = Status;
                lessonItem.TeacherCount = route.params.teacherCount;
                lessonItem.LessonRange = LessonRange || "";
                lessonItem.LessonRangeIDs = lessonItem.LessonRange.split(",");
                if (lessonItem.LessonRangeIDs.length > 0) {
                    let rangeText = "";
                    const levelOne = textBookGradeList.value.filter((v) => {
                        return v.value === lessonItem.LessonRangeIDs[0];
                    });
                    if (levelOne && levelOne[0]) {
                        rangeText += `${levelOne[0].label} `;
                        if (levelOne[0].children && levelOne[0].children.length > 0) {
                            const levelTwo = levelOne[0].children.filter((vv) => {
                                return vv.value === lessonItem.LessonRangeIDs[1];
                            });
                            if (levelTwo && levelTwo[0]) {
                                rangeText += `${levelTwo[0].label} `;
                                if (levelTwo[0].children && levelTwo[0].children.length > 0) {
                                    const levelThree = levelTwo[0].children.filter((vvv) => {
                                        return vvv.value === lessonItem.LessonRangeIDs[2];
                                    });
                                    if (levelThree && levelThree[0]) {
                                        rangeText += `${levelThree[0].label}`;
                                    }
                                }
                            }
                        }
                    }
                    lessonItem.LessonRange = rangeText || "-";
                }
                lessonItem.LessonContent = LessonContent;
            }
        };
        const { textBookGradeList, getTextBookGrade } = useSubmit();
        return {
            AnotationList,
            teacherList,
            createTeacherID,
            cardID,
            pageID,
            cardListRef,
            pageListRef,
            AnnotationListRef,
            allCardList,
            previewOptions,
            expandFlag,
            annotationFlag,
            lessonItem,
            updatePageList,
            expand,
            closeAnotation,
            openAnotation,
            lastPage,
            firstPage,
            showAnnotation,
            updateAnotationList,
            updateTeacherList,
            updatePageID,
            successAdd,
            selectTeacher
        };
    }
});
</script>

<style lang="scss" scoped>
.expandFixed{
    position: fixed;
    top: calc(50% - 60px);
    left: 0;
    width: 30px;
    height: 200px;
    font-size: 20px;
    line-height: 200px;
    text-align: center;
}
.expand-collapse{
    position: fixed;
    top: calc(50% - 60px);
    left: 180px;
    width: 30px;
    height: 200px;
    line-height: 200px;
    text-align: center;
    font-size: 20px;
}
.annotation{
    display: flex;
    flex: 1;
    min-width: 0;
    min-height: 0;
    flex-direction: column;
    .annotation-header{
        width: clac(100% -40px);
        height: 120px;
        background: #fff;
        padding: 20px 20px;
        box-sizing: border-box;
        background: #4B71EE;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .annotation-header-left{
            .annotation-header-classinfo{
                font-size: 22px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #FFFFFF;
                padding: 0 10px;
                margin-bottom: 10px;
            }
            .annotation-header-otherinfo{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 10px;
                div{
                    margin-left: 30px;
                    display: flex;
                    align-items: center;
                    font-size: 16px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #FFFFFF;
                    img{
                        margin-right: 10px;
                    }
                }
                div:nth-of-type(1){
                    margin: 0;
                }
            }
        }
        .annotation-header-right{
            width: 140px;
            height: 46px;
            background: #FFFFFF;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: space-around;
            font-size: 16px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #4B71EE;
            padding:20px;
        }
    }
    .annotation-main{
        display: flex;
        flex: 1;
        min-width: 0;
        min-height: 0;
        background: #fff;
        padding: 5px 20px;
        position: relative;
        .annotation-main-left{
            width: 180px;
        }
        .annotation-main-center{
            display: flex;
            flex: 1;
            min-width: 0;
            min-height: 0;
        }
        .annotation-main-right{
            position: absolute;
            right: 0;
            top: 0;
            width: 300px;
            height: 100%;
            padding: 20px;
            background: #fff;
            box-shadow: -6px 0px 15px 0px rgba(0, 0, 0, 0.09);
            .amr-header{
                display: flex;
                justify-content: space-between;
                font-size: 18px;
                font-weight: 600;
            }
        }
    }
}
</style>
