import { delHaveClass } from "@/api";
import { ElMessage, ElMessageBox } from "element-plus";

export default (updateSchedules: () => Promise<void>) => {
    const deleteCourse = (id?: string) => {
        ElMessageBox.confirm("确定要删除这堂课吗？", "删除", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        }).then(async () => {
            console.log("fsfsf");
            const res = await delHaveClass({
                courseBagTeacherLogID: id!
            });
            if (res.resultCode === 200) {
                ElMessage.success("删除成功");
                updateSchedules();
            }
        });
    };

    return { deleteCourse };
};
