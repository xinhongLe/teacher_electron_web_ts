<template>
    <div class="container">
        <el-dialog
            :model-value="isShow"
            :before-close="handleClose"
            :show-close="false"
            top="30vh"
            :close-on-click-modal="false"
        >
            <template #title>
                <span>批量导入说明</span>
                <div class="close-warp" @click="handleClose">
                    <el-icon :size="16"><close /></el-icon>
                </div>
            </template>
            <div class="step-warp">
                <div class="step">
                    <div class="number">1</div>
                    <div class="text">下载模板</div>
                </div>
                <img src="@/assets/my-student/img_xianduan.svg" />
                <div class="step">
                    <div class="number">2</div>
                    <div class="text">填写信息</div>
                </div>
                <img src="@/assets/my-student/img_xianduan.svg" />
                <div class="step">
                    <div class="number">3</div>
                    <div class="text">上传模版</div>
                </div>
            </div>
            <div class="select-file">
                <span class="left">选择文件</span>
                <span class="right" @click="download">(模板下载)</span>
            </div>
            <div class="footer-warp">
                <span class="btn" @click="handleClose">取消</span>
                <span class="btn upload" @click="upload">上传模版</span>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Close } from "@element-plus/icons-vue";
import XLSX from "xlsx";
import moment from "moment";
import { ElMessage } from "element-plus";
import { store } from "@/store";
import { unionBy, find } from "lodash";
import { StudentMachineBindInfo } from "@/types/myStudent";
import useStudentMachine from "@/hooks/useStudentMachine";
export default defineComponent({
    components: {
        Close
    },
    props: {
        isShow: {
            type: Boolean,
            default: false
        }
    },
    setup(props, { emit }) {
        const filters = [
            {
                name: "Excel文件",
                extensions: ["xls"]
            },
            {
                name: "Excel文件",
                extensions: ["xlsx"]
            }
        ];
        const sheetName = "学生模板";
        const { updateStudentMachine } = useStudentMachine();

        const handleClose = () => {
            emit("update:isShow", false);
        };

        const download = () => {
            const data = [
                ["学生姓名", "学生账号", "班级Id", "班级名称", "答题器编号"]
            ];
            const studentList = store.state.myStudent.allStudentList;
            const classInfo = store.state.myStudent.selectClassInfo;
            studentList.forEach((item) => {
                const { Name, Account } = item;
                data.push([Name, Account, classInfo.ID, classInfo.Name]);
            });
            const newWorkbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.aoa_to_sheet(data);
            worksheet["!cols"] = [
                {
                    wch: 20
                },
                {
                    wch: 30
                },
                {
                    wch: 50
                },
                {
                    wch: 30
                },
                {
                    wch: 50
                }
            ];
            XLSX.utils.book_append_sheet(newWorkbook, worksheet, sheetName);
            const defaultPath = `${moment().format(
                "yyyyMMDDHHmmss"
            )}_答题器模板.xls`;
            window.electron
                .showSaveDialog({
                    defaultPath,
                    filters
                })
                .then(({ filePath }) => {
                    filePath && XLSX.writeFile(newWorkbook, filePath);
                    ElMessage.success("模板文件下载成功");
                });
        };

        const upload = () => {
            window.electron
                .showOpenDialog({
                    filters,
                    properties: ["openFile"]
                })
                .then(({ filePaths }) => {
                    if (filePaths.length > 0) {
                        const wb = XLSX.readFile(filePaths[0]);
                        const sheetsData: StudentMachineBindInfo[] = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], {
                            header: [
                                "studentName",
                                "studentAccount",
                                "classID",
                                "className",
                                "machineID"
                            ],
                            range: 1
                        });
                        if (sheetsData.length === 0) {
                            return ElMessage.error("没有数据，导入失败！");
                        }

                        const list:StudentMachineBindInfo[] = [];
                        for (const item of sheetsData) {
                            const { studentAccount, machineID, classID, className, studentName } = item;
                            if (studentAccount && find(list, { studentAccount })) {
                                return ElMessage.error("学生账号重复，导入失败！");
                            }
                            if (machineID && find(list, { machineID })) {
                                return ElMessage.error("答题器编号重复，导入失败！");
                            }
                            if (classID && find(list, (info) => info.classID !== classID)) {
                                return ElMessage.error("班级Id有多个，导入失败！");
                            }
                            if (className && find(list, (info) => info.className !== className)) {
                                return ElMessage.error("班级名称有多个，导入失败！");
                            }
                            list.push(item);

                            if (!studentName) {
                                return ElMessage.error("学生姓名不存在，导入失败！");
                            }
                            if (!className) {
                                return ElMessage.error("班级不存在，导入失败！");
                            }
                            if (!classID) {
                                return ElMessage.error("班级Id不存在，导入失败！");
                            }
                            if (!studentAccount) {
                                return ElMessage.error("学生账号不存在，导入失败！");
                            }
                            if (item.machineID && !/^\d+$/.test(item.machineID)) {
                                return ElMessage.error("答题器编号存在非数字，导入失败！");
                            }
                        }
                        updateStudentMachine(sheetsData);
                        handleClose();
                    }
                });
        };
        return {
            download,
            upload,
            handleClose
        };
    }
});
</script>

<style lang="scss" scoped>
$blur: #4b71ee;
.container {
    :deep(.el-dialog) {
        width: 420px;
        display: flex;
        flex-direction: column;
        --el-border-radius-small: 8px;
        .el-dialog__header {
            height: 60px;
            background: $blur;
            border-radius: 8px 8px 0px 0px;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            font-weight: 600;
            color: #fff;
            position: relative;
            .close-warp {
                width: 30px;
                height: 30px;
                background: #6d8bf0;
                position: absolute;
                right: 16px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            }
        }
        .el-dialog__body {
            padding: 0;
            flex: 1;
            .step-warp {
                padding: 24px 28px;
                display: flex;
                border-bottom: 1px solid #f5f6fa;
                align-items: center;
                justify-content: space-between;
                .step {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    .number {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                        width: 32px;
                        height: 32px;
                        background: $blur;
                        border-radius: 50%;
                        margin-bottom: 12px;
                        color: #fff;
                        font-size: 18px;
                    }
                    .text {
                        font-size: 14px;
                        color: #5f626f;
                    }
                }
                img {
                    transform: translateY(-12px);
                }
            }
            .select-file {
                display: flex;
                padding: 24px;
                border-bottom: 1px solid #f5f6fa;
                .left {
                    font-size: 16px;
                    font-weight: 500;
                    color: #19203d;
                }
                .right {
                    cursor: pointer;
                    color: $blur;
                    font-size: 14px;
                    font-weight: 400;
                    margin-left: 10px;
                }
            }
            .footer-warp {
                display: flex;
                justify-content: space-between;
                padding: 16px 38px;
                .btn {
                    cursor: pointer;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 160px;
                    height: 40px;
                    font-size: 16px;
                    border-radius: 4px;
                    border: 1px solid #e0e2e7;
                    &.upload {
                        background: $blur;
                        color: #ffffff;
                        border: none;
                    }
                }
            }
        }
    }
}
</style>
