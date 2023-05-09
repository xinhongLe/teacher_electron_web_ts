<template>
    <div class="content-detail">
        <div class="top">
            <p @click="addQuestion">添加题目 {{ form.questionData.length }}/3</p>
        </div>
        <div class="middle-quesion">
            <div class="question-item" v-for="(item,index) in form.questionData">
                <div class="item-left">
                    <div class="text">
                        填空{{ index + 1 }}
                    </div>
                    <div class="del-icon" @click="deleteQuestion(index)">
                        <el-icon v-if="index > 0">
                            <Delete/>
                        </el-icon>
                    </div>
                </div>
                <div class="item-right">
                    <el-input
                        v-model="item.Data"
                        maxlength="30"
                        placeholder="请输入"
                        show-word-limit
                        type="textarea"
                    />
                </div>
            </div>
        </div>
        <div class="top items">
            <p @click="addQuestion">添加选项 {{ form.itemData.length }}/5</p>
        </div>
        <div class="middle-items">
            <div class="items-item">
                <div class="num">
                    <div class="text">
                        序号1
                    </div>
                    <div class="del-icon" @click="deleteItem(index)">
                        <el-icon v-if="index > 0">
                            <Delete/>
                        </el-icon>
                    </div>
                </div>
                <div class="item">
                    龙飞凤舞
                </div>
            </div>
        </div>
        <div class="footer">
            <el-button>取消</el-button>
            <el-button type="primary">保存</el-button>
        </div>
    </div>
</template>

<script lang="ts">
import {computed, defineComponent, reactive, ref, watch} from "vue";
import {Delete} from '@element-plus/icons-vue';
import {ElMessage} from "element-plus";
import {cooOss, getOssUrl} from "@/utils/oss";
import {get, STORAGE_TYPES} from "@/utils/storage";

export default defineComponent({
    name: "setContent",
    components: {Delete},
    props: {
        newForm: {
            type: Object,
            require: true,
            default: () => ({
                questionData: [
                    {
                        Data: "",
                        // Position: {x: 200, y: 200},
                        // Size: {Width: 240, Height: 100},
                    },
                ],
                itemData: [
                    {
                        Data: "",
                        Position: {x: 600, y: 200},
                        Size: {Width: 240, Height: 100},
                    },
                ]
            }),
        },
    },
    setup(props, {emit}) {
        const form: any = computed(() => props.newForm);
        //添加题目
        const addQuestion = () => {
            if (form.value.questionData.length == 3) return;
            form.value.questionData.push({
                Data: ""
            })
        };
        //添加选项
        const addItem = () => {
            form.value.itemData.push({
                Data: "",
                Position: {x: form.value.itemData[form.value.itemData.length - 1].Position.x + 150, y: 200},
                Size: {Width: 240, Height: 100},
            },)
        };
        //删除题目
        const deleteQuestion = (index: number) => {
            form.value.questionData.splice(index, 1)
        };
        //删除选项
        const deleteItem = (index: number) => {
            form.value.itemData.splice(index, 1)
        };
        return {
            form,
            addQuestion,
            addItem,
            deleteQuestion,
            deleteItem
        }
    }
})
</script>

<style scoped lang="scss">
.content-detail {
    .top {
        p {
            color: #00d2a7;
            cursor: pointer;
        }
    }

    .items {
        margin: 10px 0;
    }

    .middle-quesion {
        border-top: 2px dashed #e1e1e1;
        border-bottom: 2px dashed #e1e1e1;
        margin-top: 10px;
        //border-bottom: 2px solid #90949e;
        .question-item {
            display: flex;
            padding: 20px;
            //border-top: 2px dashed #e1e1e1;
            //border-bottom: 2px dashed #e1e1e1;
            //margin: 20px 0;
            align-items: center;

            .item-left {
                display: flex;
                flex-direction: column;
                align-items: center;

                .text {
                    padding-bottom: 2px;
                    border-bottom: 1px solid #000000;
                }

                .del-icon {
                    width: 16px;
                    padding-top: 2px;

                    .el-icon {
                        font-size: 16px;
                        color: #ff5151;
                        cursor: pointer;
                    }
                }
            }

            .item-right {
                margin-left: 20px;
                width: 92%;
            }
        }
    }

    .middle-items {
        display: flex;

        .items-item {
            .num {
                display: flex;

                .text {
                    padding-bottom: 2px;
                    border-bottom: 1px solid #000000;
                }

                .del-icon {
                    width: 16px;
                    padding-top: 2px;

                    .el-icon {
                        font-size: 16px;
                        color: #ff5151;
                        cursor: pointer;
                    }
                }
            }


        }
    }

    .footer {
        margin-top: 20px;
        text-align: center;
    }
}

</style>
