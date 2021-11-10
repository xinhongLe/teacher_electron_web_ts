<template>
    <div class="search-box">
        <div class="form-warp">
            <el-form ref="form" :model="formData" :inline="true">
                <i v-if="$route.name == 'wpf管理标签'" style="font-size: 20px; margin: 10px 10px 10px 0; cursor: pointer" class="el-icon-arrow-left" @click="$router.go(-1)"></i>
                <el-form-item label="学科：" v-if="!canEdit">
                    <el-select
                        v-model="formData.subject"
                        placeholder="请选择活动区域"
                    >
                        <el-option
                            v-for="item in subjectList"
                            :key="item.ID"
                            :label="item.Name"
                            :value="item.ID"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="float: right">
                    <el-input
                        v-model="formData.studentName"
                        placeholder="姓名/账号/手机号"
                        prefix-icon="el-icon-search"
                    >
                        <template #append>
                            <el-button
                            >搜索</el-button>
                        </template>
                        >
                    </el-input>
                </el-form-item>
            </el-form>
        </div>
        <el-button
            class="btn"
            type="primary"
            @click="$emit('update:canEdit', true)"
            v-if="!canEdit && formData.subject != ''"
            >编辑标签</el-button
        >
        <el-button
            class="btn"
            type="danger"
            @click="closeCheckBox"
            v-if="canEdit && formData.subject != ''"
            >退出编辑</el-button
        >
        <el-button
            class="btn"
            type="primary"
            disabled
            v-if="formData.subject === ''"
            >编辑标签</el-button
        >
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
export default defineComponent({
    name: "Head",
    props: {
        canEdit: {
            type: Boolean,
            default: false
        },
        closeCheckBox: {
            type: Function,
            required: true
        }
    },
    setup() {
        const formData = reactive({
            subject: "",
            studentName: ""
        });

        const subjectList = ref([
            { Name: "全部学科", ID: "" }
        ]);

        return {
            formData,
            subjectList
        };
    }
});
</script>

<style lang="scss" scoped>
.search-box {
        height: 72px;
        display: flex;
        justify-content: space-between;
        .form-warp {
            float: left;
            flex: 1;
            margin-left: 24px;
            margin-top: 16px;
        }
        /deep/ .el-input-group__append {
            background: none;
            font-size: 14px;
            font-weight: 500;
            color: #4b71ee;
            line-height: 38px;
        }
        .btn {
            float: right;
            margin: 16px 24px;
        }
    }
</style>
