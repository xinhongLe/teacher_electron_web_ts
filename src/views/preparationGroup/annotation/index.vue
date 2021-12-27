<template>
    <div class="annotation">
        <div class="annotation-header">
            <div class="annotation-header-classinfo">
                {{ WindowName }}
            </div>
            <div class="annotation-header-otherinfo">
                <div>
                    <div><i class="el-icon-user"></i>创建人：林老师</div>
                    <div><i class="el-icon-time"></i>创建时间：2021-12-27 16：08</div>
                    <div>小组人数：5人</div>
                    <div>备课范围：数学 苏教版 三上</div>
                </div>
                <div>
                    <i @click="openAnotation" class="el-icon-location-outline"></i>
                </div>
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
                />
            </div>
            <div class="annotation-main-right" v-if="annotationFlag">
                <div class="amr-header">
                    <span>批注</span>
                    <span @click="closeAnotation"><i class="el-icon-close"></i></span>
                </div>
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
export default defineComponent({
    components: { CardList, PageList },
    setup() {
        const WindowID = "3A0015526B08B24B97C9BCD943D6F7EC";
        const WindowName = "1A1.1 数一数";
        const { cardListRef, allCardList, previewOptions, expandFlag, annotationFlag, _getWindowCards, updatePageList, expand, closeAnotation, openAnotation } = annotation();
        onMounted(async() => {
            const obj = {
                OriginType: 1,
                WindowID: WindowID
            };
            await _getWindowCards(obj);
        });
        return {
            WindowName,
            cardListRef,
            allCardList,
            previewOptions,
            expandFlag,
            annotationFlag,
            updatePageList,
            expand,
            closeAnotation,
            openAnotation
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
        border: 1px solid #eee;
        padding: 20px 10px;
        box-sizing: border-box;
        margin: 20px;
        .annotation-header-classinfo{
            font-size: 24px;
            font-weight: 600;
            padding: 0 10px;
            margin-bottom: 10px;
        }
        .annotation-header-otherinfo{
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #eee;
            padding: 10px 10px;
            >div:nth-of-type(1){
                display: flex;
                justify-content: flex-start;
                div{
                    margin-left: 30px;
                    font-size: 18px;
                    display: flex;
                    align-items: center;
                    i{
                        padding: 0 5px;
                    }
                }
                div:nth-of-type(1){
                    margin: 0;
                }
            }
            div:nth-of-type(2){
                font-size: 20px;
            }
        }
    }
    .annotation-main{
        display: flex;
        flex: 1;
        min-width: 0;
        min-height: 0;
        background: #fff;
        padding: 5px 20px;
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
            width: 220px;
            padding: 20px;
            border: 1px solid #000;
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
