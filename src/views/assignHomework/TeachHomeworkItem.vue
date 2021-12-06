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
                {{ "《" + item.WorkbookName + "》" }} {{ item.UnitName }}
                {{ item.WorkbookPaperName }}
            </p>
            <span>{{ item.gradeName }} {{ item.publisherName }}</span>
            <span></span>
        </div>
        <SelectLabel :studentList="item.students"></SelectLabel>
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
                icon="el-icon-delete"
                @click="del"
            ></el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { TeachHomework } from "@/types/assignHomework";
import { defineComponent, PropType } from "vue";
import SelectLabel from "./SelectLabel.vue";
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
        return {
            del
        };
    },
    components: { SelectLabel }
});
</script>

<style lang="scss" scoped>
.homework-row {
    display: flex;
    width: 100%;
    height: 56px;
    line-height: 56px;
    background: #f9fafc;
    border-radius: 4px;
    padding: 0 20px;
    margin-top: 10px;
    .first-col {
        width: 40%;
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
        }
        span {
            margin-left: 12px;
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
</style>
