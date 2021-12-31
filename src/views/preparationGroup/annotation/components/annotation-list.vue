<template>
    <div class="annotation-list" @click="editBoxSwtich = null">
        <div class="annotation-list-header">
            <div class="alh-left">批注</div>
            <!-- <div class="alh-right">显示：无</div> -->
        </div>
        <div class="annotation-list-all">
            <div class="annotation-list-alllist">
                <div class="annotation-list-item" v-for="(item,index) in annotationList" :key="index">
                    <div class="ali-header">
                        <div>{{index + 1}}</div>
                        <div class="ali-header-more" @click.stop="changeEditBoxSwtich(index)">
                            <img src="@/assets/preparationGroup/icon_more.png" alt="">
                            <div class="ahm-edit" v-if="editBoxSwtich === index">
                                <div @click.stop="edit(index, 0)"><i class="el-icon-edit"></i>编辑</div>
                                <div @click.stop="del(index)"><i class="el-icon-delete"></i>删除</div>
                            </div>
                        </div>
                    </div>
                    <div class="ali-content">
                        <textarea v-if="editFlag === index && contentFlag === 0" v-model="item.text"></textarea>
                        <span v-else>
                            {{ item.text }}
                        </span>
                        <div class="ali-content-button">
                            <div>确认</div>
                            <div>取消</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="annotation-list-add" @click="add">
                <img src="@/assets/preparationGroup/icon_add.png" alt=""> 新建
            </div>
        </div>
    </div>
</template>

<script>
import { contentTracing } from "electron";
import { defineComponent, ref } from "vue-demi";

export default defineComponent({
    setup() {
        const editBoxSwtich = ref(null);
        const editFlag = ref(null);
        const contentFlag = ref(null);
        const annotationList = ref([
            {
                text: "123123123123123123123"
            },
            {
                text: "12111"
            }
        ]);
        const changeEditBoxSwtich = (index) => {
            editBoxSwtich.value = index;
        };
        const del = (index) => {
            annotationList.value.splice(index, 1);
            editBoxSwtich.value = null;
        };
        const add = () => {
            annotationList.value.push({ text: "1111" });
        };
        const edit = (index, num) => {
            contentFlag.value = num;
            editFlag.value = index;
            editBoxSwtich.value = null;
        };
        return {
            annotationList,
            editBoxSwtich,
            editFlag,
            contentFlag,
            changeEditBoxSwtich,
            add,
            del,
            edit
        };
    }
});
</script>

<style lang="scss" scoped>
.annotation-list{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    min-height: 0;
    .annotation-list-header{
        display: flex;
        justify-content: space-between;
        .alh-left{
            font-size: 18px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #212121;
        }
    }
    .annotation-list-all{
        display: flex;
        flex: 1;
        flex-direction: column;
        min-width: 0;
        min-height: 0;
        .annotation-list-alllist{
            display: flex;
            flex: 1;
            min-width: 0;
            min-height: 0;
            flex-direction: column;
            padding: 0 16px;
            overflow-y: auto;
            .annotation-list-item{
                background: #FFFFFF;
                border-radius: 4px;
                border: 1px solid #EBEFF1;
                margin-top: 16px;
                .ali-header{
                    width: 100%;
                    background: #DEE4FF;
                    height: 30px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 10px;
                    >div:nth-of-type(1){
                        width: 18px;
                        height: 18px;
                        background: #fff;
                        border-radius: 18px;
                        text-align: center;
                        line-height: 18px;
                    }
                    .ali-header-more{
                        display: flex;
                        align-items: center;
                        position: relative;
                        .ahm-edit{
                            position: absolute;
                            top: 10px;
                            right: 0;
                            width: 100px;
                            height: 50px;
                            background: #fff;
                            div{
                                width: 100px;
                                height: 25px;
                                display: flex;
                                align-items: center;
                                font-size: 12px;
                                font-family: PingFangSC-Regular, PingFang SC;
                                font-weight: 400;
                                color: #212121;
                                i{
                                    margin: 0 10px 0 10px;
                                }
                            }
                            div:hover{
                                background: #4B71EE;
                                color:#fff;
                            }
                        }
                    }
                }
                .ali-content{
                    font-size: 12px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #5D5D5D;
                    padding: 8px;
                    .ali-content-button{
                        overflow: hidden;
                        margin-top: 6px;
                        div{
                            float: right;
                            width: 30px;
                            height: 20px;
                            background: #fff;
                            color: #000;
                            line-height: 20px;
                            text-align: center;
                        }
                        div:nth-of-type(1){
                            background: #4B71EE;
                            border-radius: 4px;
                            color: #fff;
                        }
                    }
                }
            }
        }
        .annotation-list-add{
            width: 100%;
            height: 40px;
            border-radius: 4px;
            border: 1px solid #4B71EE;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #4B71EE;
            cursor: pointer;
            img{
                width: 12px;
                height: 12px;
                margin-right: 6px;
            }
        }
    }
}
</style>
