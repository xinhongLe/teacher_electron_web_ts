<template>
    <div class="annotation-list" @click="editBoxSwtich = null">
        <div class="annotation-list-header">
            <div class="alh-left">批注</div>
            <!-- <div class="alh-right">显示：无</div> -->
        </div>
        <div class="annotation-list-all">
            <div class="annotation-list-alllist">
                <div class="annotation-list-item" v-for="(item,index) in annotationList" :key="index">
                    <div class="ali-header" :class="activeID === index ? 'active':''">
                        <div>{{index + 1}}</div>
                        <div class="ali-header-more" @click.stop="changeEditBoxSwtich(index)">
                            <img src="@/assets/preparationGroup/icon_more.png" alt="">
                            <div class="ahm-edit" v-if="editBoxSwtich === index">
                                <div @click.stop="edit(index, 0, item)"><i class="el-icon-edit"></i>编辑</div>
                                <div @click.stop="del(index)"><i class="el-icon-delete"></i>删除</div>
                            </div>
                        </div>
                    </div>
                    <div class="ali-content">
                        <el-input
                            v-if="editFlag === index && contentFlag === 0"
                            v-model="item.text"
                            type="textarea"
                            :rows="2">
                            </el-input>
                        <span v-else>
                            {{ item.text }}
                        </span>
                        <div v-if="editFlag === index && contentFlag === 0"  class="ali-content-button">
                            <div @click.stop="submit(item)">确认</div>
                            <div @click.stop="cancel(index)">取消</div>
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
import { ElMessage } from "element-plus";
import { cloneDeep } from "lodash";
import { defineComponent, ref, getCurrentInstance, watch, computed, onMounted, onBeforeUnmount } from "vue-demi";
import { AddAnnotation } from "../api";
export default defineComponent({
    props: ["AnotationList", "cardID", "pageID"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        const editBoxSwtich = ref(null); // 编辑删除弹框
        const editFlag = ref(null);
        const contentFlag = ref(null);
        const editValue = ref(""); // 编辑的内容
        const annotationList = ref([]);
        const cardId = ref("");
        const pageId = ref("");
        const activeID = ref(0);
        onMounted(() => {
            proxy.mittBus.on("annotationActionID", (annotationActionID) => {
                activeID.value = annotationActionID;
            });
        });
        onBeforeUnmount(() => {
            proxy.mittBus.off("annotationActionID");
        });
        watch(
            () => props.cardID,
            () => {
                cardId.value = props.cardID;
            }
        );
        watch(
            () => props.pageID,
            () => {
                pageId.value = props.pageID;
            }
        );
        watch(
            () => props.AnotationList,
            () => {
                annotationList.value = props.AnotationList;
                proxy.mittBus.emit("annotationList", annotationList.value);
                console.log(annotationList.value, "value");
            }
        );
        const changeEditBoxSwtich = (index) => {
            editBoxSwtich.value = index;
        };
        const del = (index) => {
            annotationList.value.splice(index, 1);
            editBoxSwtich.value = null;
        };
        // 新增
        const add = () => {
            annotationList.value.push({ text: "", left: 640, top: 340 });
            editValue.value = "";
            contentFlag.value = 0;
            editFlag.value = annotationList.value.length - 1;
            editBoxSwtich.value = null;
            proxy.mittBus.emit("annotationList", annotationList.value);
        };
        // 编辑
        const edit = (index, num, item) => {
            console.log(index, num, item);
            if (item.text) {
                editValue.value = cloneDeep(item.text);
            } else {
                editValue.value = "";
            }
            contentFlag.value = num;
            editFlag.value = index;
            editBoxSwtich.value = null;
        };
        // 取消
        const cancel = (index) => {
            editFlag.value = null;
            contentFlag.value = null;
            annotationList.value[index].text = editValue.value;
        };
        // 确认
        const submit = (item) => {
            contentFlag.value = null;
            editValue.value = "";
            editFlag.value = null;
            const obj = {
                cardID: cardId.value,
                pageID: pageId.value,
                pointX: item.left,
                pointY: item.right,
                content: item.text
            };
            emit("successAdd");
            // const res = await AddAnnotation(obj);
            // if (res.resultCode === 200) {
            //     ElMessage.success("批注成功");
            // }
        };
        return {
            activeID,
            annotationList,
            editBoxSwtich,
            editFlag,
            contentFlag,
            changeEditBoxSwtich,
            add,
            del,
            edit,
            cancel,
            submit
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
                    background: #F5F6FA;
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
                        height: 30px;
                        display: flex;
                        align-items: center;
                        position: relative;
                        .ahm-edit{
                            position: absolute;
                            top: 10px;
                            right: 20px;
                            width: 100px;
                            height: 50px;
                            background: #fff;
                            z-index: 10;
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
                .active{
                    background: #DEE4FF !important;
                }
                .ali-content{
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #5D5D5D;
                    padding: 8px;
                    span{
                        font-size: 14px;
                        padding: 2px;
                        display: block;
                        word-wrap: break-word;
                        word-break: normal;
                    }
                    .ali-content-button{
                        overflow: hidden;
                        margin-top: 6px;
                        div{
                            float: right;
                            width: 40px;
                            height: 24px;
                            background: #fff;
                            color: #000;
                            // line-height: 20px;
                            text-align: center;
                            padding: 5px;
                            white-space: nowrap;
                            box-sizing: border-box;
                            cursor: pointer;
                        }
                        div:nth-of-type(1){
                            background: #4B71EE;
                            border-radius: 4px;
                            color: #fff;
                            margin-left: 8px;
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
