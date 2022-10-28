/* eslint-disable vue/no-mutating-props */
<template>
    <div
        class="homework-row flex-between-center"
    >
        <div class="first-col">
            <span class="indexNumber">{{
                index
            }}</span>
            <img
                :src="require(`@/assets/images/homeworkNew/homework2.png`)"
                alt=""
            />
            <p>
                {{ "《" + HomeWorkListItem.WorkbookName + "》" }} {{ HomeWorkListItem.UnitName }}
                {{ HomeWorkListItem.WorkbookPaperName }}
            </p>
            <div><span>{{ HomeWorkListItem.gradeName }} {{ HomeWorkListItem.publisherName }}</span><span></span></div>
        </div>
        <div class="forms">
            <el-form
                ref="ruleForm"
                label-width="80px"
                class="demo-ruleForm"
                :inline="true"
            >
                <el-form-item label="公布答案">
                    <el-select @change="selectChange" style="width: 120px;" v-model="HomeWorkListItem.publishType">
                        <el-option label="自动公布" value="zi"></el-option>
                        <el-option label="手动公布" value="shou"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="time-picker" v-if="HomeWorkListItem.publishType === 'zi'" style="margin-left:10px;">
                    <el-date-picker
                        type="datetime"
                        v-model="HomeWorkListItem.publishTime"
                        @change="pickerChange"
                        :clearable="false"
                    >
                    </el-date-picker>
                </el-form-item>
            </el-form>
        </div>
        <SelectLabel :studentList="HomeWorkListItem.students"></SelectLabel>
        <div class="btns">
            <!-- <el-button
                size="small"
                type="primary"
                plain
                icon="el-icon-edit"
                style="width: 97px"
                @click="openHomeworkDialog('systemHomeworkDialog')"
                >修改</el-button
              > -->
            <el-button
                size="small"
                type="danger"
                :icon="Delete"
                @click="del"
            ></el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { TeachHomework } from "@/types/assignHomework";
import { computed, defineComponent, PropType } from "vue";
import SelectLabel from "./SelectLabel.vue";
import { Delete } from "@element-plus/icons-vue";
export default defineComponent({
    props: {
        item: {
            type: Object as PropType<TeachHomework>,
            required: true
        },
        index: {
            type: Number,
            required: true
        },
        realIndex: {
            type: Number,
            required: true
        }
    },
    setup(props, { emit }) {
        const del = () => {
            emit("delete", props.realIndex);
        };
        const HomeWorkListItem:any = computed(() => props.item);
        const selectChange = () => {
            if (HomeWorkListItem.value.publishType === "zi") {
                const dateTime = new Date();
                dateTime.setDate(dateTime.getDate() + 1);
                HomeWorkListItem.value.publishTime = new Date(dateTime);
                emit("update", props.realIndex, HomeWorkListItem.value);
            } else {
                HomeWorkListItem.value.publishTime = "";
                emit("update", props.realIndex, HomeWorkListItem.value);
            }
        };
        const pickerChange = () => {
            emit("update", props.realIndex, HomeWorkListItem.value);
        };
        return {
            Delete,
            HomeWorkListItem,
            selectChange,
            pickerChange,
            del
        };
    },
    components: { SelectLabel }
});
</script>

<style lang="scss" scoped>
.homework-row {
    display: flex;
    flex: 1;
    min-width: 0;
    height: 56px;
    line-height: 56px;
    background: #f9fafc;
    border-radius: 4px;
    padding: 0 20px;
    margin-top: 10px;
    .first-col {
        flex: 1;
        min-width: 0;
        align-items: center;
        display: flex;
        .indexNumber {
            font-size: 22px;
            color: #4b71ee;
        }
        .attributebox {
            width: 60%;
            margin-left: auto;
            .attributetype {
                display: inline-block;
                width: 80px;
                text-align: center;
            }
        }
        p {
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        span {
            margin-left: 12px;
            // white-space: nowrap;
        }
        .type {
            color: #4b71ee;
        }
        img {
            width: 20px;
            height: 20px;
            margin: 0 12px;
        }
    }
    .el-icon-edit {
        color: #4b71ee;
        margin-left: 12px;
    }
}
.btns {
    margin-left: auto;
    display: flex;
    align-items: center;
}
.forms{
    white-space: nowrap;
    display: flex;
    margin-right: 30px;
    :deep(.el-form-item){
        margin: 0;
    }
    .time-picker {
        :deep(.el-date-editor) {
            --el-date-editor-width: 180px;
        }
        :deep(.el-input__inner) {
            padding-left: 30px;
            padding-right: 10px;
        }
    }
}
</style>
