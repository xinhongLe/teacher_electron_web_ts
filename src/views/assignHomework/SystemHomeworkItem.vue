<template>
    <div class="homework-row flex-between-center">
        <div class="first-col">
            <span class="indexNumber">{{ index }}</span>
            <img
                v-if="item.type == 0"
                :src="require(`@/assets/images/homeworkNew/homework1.png`)"
                alt=""
            />
            <img
                v-if="item.type == 1"
                :src="require(`@/assets/images/homeworkNew/icon_shipin.png`)"
                alt=""
            />
            <p>{{ item.Name }}</p>
            <div class="attributebox">
                <span class="type">{{
                    getCourseBagType(item.ClassifyType)
                }}</span>
                <span class="attributetype" v-if="item.type == 0"
                    >{{ item.Questions?.length || 0 }}&nbsp;题</span
                >
                <span class="attributetype" v-if="item.type == 1"
                    >时长:{{ formatDuration(item.VideoDuration) }}</span
                >
                <span
                    >{{ item.version }} {{ item.bagPapersName }}
                    {{ item.bagLessonsName }}</span
                >
            </div>
        </div>
        <div class="placeholder"/>
        <SelectLabel :studentList="item.students"></SelectLabel>
        <div class="btns">
            <!-- <el-button
                v-if="item.HasVideo && item.type == 1"
                size="small"
                type="primary"
                plain
                icon="el-icon-video-play"
                @click="LookVideoHandle(item.FileID)"
                >查看视频</el-button
              >
              <el-button
                v-if="item.type == 0"
                size="small"
                type="primary"
                plain
                icon="el-icon-search"
                @click="LookQuestions(cont.PaperID)"
                >查看题目</el-button
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
import { SystemHomework } from "@/types/assignHomework";
import { getCourseBagType, formatDuration } from "@/utils";
import { defineComponent, PropType } from "vue";
import SelectLabel from "./SelectLabel.vue";
import { Delete } from "@element-plus/icons-vue";
export default defineComponent({
    props: {
        item: {
            type: Object as PropType<SystemHomework>,
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
            Delete,
            getCourseBagType,
            del,
            formatDuration
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
    .placeholder {
        width: 30%;
        margin-right: 30px;
    }
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
            white-space: nowrap;
            .attributetype {
                display: inline-block;
                width: 80px;
                text-align: center;
            }
        }
        p {
            font-weight: 600;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
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
