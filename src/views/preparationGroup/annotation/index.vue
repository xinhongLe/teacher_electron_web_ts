<template>
    <div class="annotation">
        <div class="annotation-header">
            <div class="annotation-header-left">
                <div class="annotation-header-classinfo">
                    {{ WindowName }}
                </div>
                <div class="annotation-header-otherinfo">
                    <div><img src="@/assets/preparationGroup/icon_ren1.png" alt="">创建人：林老师</div>
                    <div><img src="@/assets/preparationGroup/icon_time1.png" alt="">创建时间：2021-12-27 16：08</div>
                    <div><img src="@/assets/preparationGroup/icon_renshu1.png" alt="">小组人数：5人</div>
                    <div><img src="@/assets/preparationGroup/icon_fanwei.png" alt="">备课范围：数学 苏教版 三上</div>
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
                    @lastPage="lastPage"
                    @firstPage="firstPage"
                    @showAnnotation="showAnnotation"
                    @updatePageID="updatePageID"
                    @updateAnotationList="updateAnotationList"
                />
            </div>
            <div class="annotation-main-right" v-show="annotationFlag">
                <AnnotationList
                    ref="AnnotationListRef"
                    @addElement="addElement"
                    :AnotationList="AnotationList"
                    :cardID="cardID"
                    :pageID="pageID"
                    @successAdd="successAdd"
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
import { defineComponent, onMounted, ref } from "vue-demi";
import annotation from "./annotation";
import CardList from "./components/card-list.vue";
import PageList from "./components/page-list.vue";
import AnnotationList from "./components/annotation-list.vue";
import { useRoute } from "vue-router";
export default defineComponent({
    name: "preparationGroup",
    components: { CardList, PageList, AnnotationList },
    setup() {
        const AnotationList = ref([]);
        const pageID = ref("");
        const AnnotationListRef = ref();
        const route = useRoute();
        const { cardListRef, cardID, pageListRef, allCardList, previewOptions, expandFlag, annotationFlag, _getWindowCards, updatePageList, expand, closeAnotation, openAnotation, lastPage, firstPage } = annotation();
        onMounted(async() => {
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
            console.log(e);
        };
        const successAdd = () => {
            // 新增成功刷新批注列表
            pageListRef.value._getAnnotation();
        };
        return {
            AnotationList,
            cardID,
            pageID,
            cardListRef,
            pageListRef,
            AnnotationListRef,
            allCardList,
            previewOptions,
            expandFlag,
            annotationFlag,
            updatePageList,
            expand,
            closeAnotation,
            openAnotation,
            lastPage,
            firstPage,
            showAnnotation,
            updateAnotationList,
            updatePageID,
            successAdd
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
            width: 260px;
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
