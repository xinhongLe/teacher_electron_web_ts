<template>
  <el-dialog
    title="添加老师"
    width="820px"
    :model-value="visible"
    append-to-body
    :before-close="handleClose"
  >
    <div class="form-box">
      <el-form ref="form" :model="formData" label-width="80px" label-position="top">
        <el-form-item label="教师信息">
          <el-input
            v-model="formData.name"
            placeholder="请输入要搜索的老师姓名或账号"
          >
            <template #append>
                <el-button type="primary" @click="getTeacherList">搜索</el-button>
            </template>
          </el-input>
          <el-table
            :data="tableData"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
            style="width: 100%; margin-top: 16px"
            @selection-change="handleSelectionChange"
            max-height="480px"
          >
            <el-table-column
              type="selection"
              height="200"
              label="选择"
            ></el-table-column>
            <el-table-column prop="UserName" label="教师姓名">
            </el-table-column>
            <!-- <el-table-column prop="address" label="教师手机号">
                        </el-table-column> -->
            <el-table-column label="执教学科">
              <template #default="scope">
                {{ scope.row.SubjectList.map((v) => v.ResultValue).join(",") }}
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            style="
              float: right;
              background: #fff;
              width: 100%;
              text-align: center;
              padding-top: 5px;
              height: 35px;
            "
            :current-page="page.pageNumber"
            :page-sizes="page.pageChoose"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </el-form-item>
      </el-form>
      <div class="btns">
        <span @click="handleClose">取消</span>
        <span :class="{ active: btnActive }" @click="save">保存</span>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { ClassTeacher, Teacher } from "@/types/myStudent";
import { ElMessage } from "element-plus";
import { defineComponent, PropType, ref } from "vue";
import useAddTeacher from "./useAddTeacher";
export default defineComponent({
    name: "AddTeacher",
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        selectedTeacher: {
            type: Array as PropType<ClassTeacher[]>,
            default: () => []
        }
    },
    setup(props, { emit }) {
        const selectTeacher = ref<Teacher[]>([]);
        const btnActive = ref(false);
        const { getTeacherList, page, tableData, formData, handleCurrentChange, handleSizeChange } = useAddTeacher();

        const handleClose = () => {
            emit("update:visible", false);
        };

        const handleSelectionChange = (v:Teacher[]) => {
            selectTeacher.value = v;
            btnActive.value = v.length !== 0;
        };

        const save = () => {
            if (selectTeacher.value.length === 0) {
                return ElMessage.warning("尚未选择老师！！");
            }
            emit("update:selectedTeacher", [...props.selectedTeacher, ...selectTeacher.value]);
            handleClose();
        };
        getTeacherList();

        return {
            formData,
            tableData,
            page,
            handleClose,
            getTeacherList,
            handleSelectionChange,
            save,
            btnActive,
            handleSizeChange,
            handleCurrentChange
        };
    }
});
</script>

<style lang="scss" scoped>
/deep/.el-dialog__body {
    padding: 0;
}
/deep/.el-table th {
    padding: 0;
}
/deep/.el-table td {
    padding: 10px 0;
}
.form-box {
    background: #f5f6fa;
    padding: 24px 32px;
    .no-data {
        padding: 8vh 0 10vh 0;
        img {
            width: 136px;
            height: 85px;
            margin: auto;
            display: block;
        }
        p:nth-of-type(1) {
            margin-top: 24px;
            font-size: 18px;
            font-weight: 600;
            color: #19203d;
            line-height: 25px;
            text-align: center;
        }
        p:nth-of-type(2) {
            margin-top: 6px;
            font-size: 16px;
            text-align: center;
            color: #5f626f;
            line-height: 22px;
        }
    }
    .btn {
        width: 112px;
        height: 32px;
        background: #4b71ee;
        border-radius: 4px;
        text-align: center;
        color: #fff;
        line-height: 32px;
        position: absolute;
        right: 0;
        top: -51px;
    }
    .btns {
        display: flex;
        justify-content: center;
        position: relative;
        width: 100%;
        > span {
            width: 200px;
            cursor: pointer;
            margin-top: 16px;
            height: 40px;
            background: #ffffff;
            border-radius: 4px;
            border: 1px solid #e0e2e7;
            text-align: center;
            font-size: 16px;
            color: #19203d;
            line-height: 40px;
        }
        > span:nth-of-type(1) {
            margin-right: 24px;
        }
        > span:nth-of-type(2) {
            color: #fff;
            background: #d4d6d9;
        }
        > span:nth-of-type(3) {
            position: absolute;
            width: 120px;
            color: #ff6b6b;
            left: 24px;
            top: 0;
            border-color: #fef2f6;
            background: #fef2f6;
        }
        .active {
            background: #4B71EE!important;
        }
    }
    .subject-list {
        > div {
            padding: 12px 20px;
            background: #fff;
            display: flex;
            margin-bottom: 4px;
            > div {
                flex: 1;
                margin-bottom: -16px;
                span {
                    padding: 8px 16px;
                    background: #f3f7ff;
                    border-radius: 4px;
                    line-height: 20px;
                    font-size: 14px;
                    color: #19203d;
                    position: relative;
                    display: block;
                    float: left;
                    margin-right: 16px;
                    margin-bottom: 15px;
                    i {
                        color: #4b71ee;
                        margin-right: 4px;
                    }
                    i:nth-of-type(2) {
                        font-size: 14px;
                        position: absolute;
                        right: -7px;
                        top: -2px;
                        color: #ff6b6b;
                    }
                }
            }
            > span {
                font-size: 18px;
                color: #19203d;
                height: 36px;
                margin-right: 34px;
                display: flex;
                align-items: center;
            }
        }
    }
}
</style>
