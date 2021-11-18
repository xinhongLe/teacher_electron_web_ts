import { haveClass, HaveClassData, HaveClassWithDefaultBagData } from "@/api";
import { ElMessage } from "element-plus";

export const addClasses = async (type: number, data: HaveClassWithDefaultBagData | HaveClassData, callback: () => unknown) => {
    const res = await haveClass(type, data);
    if (res.resultCode === 200) {
        ElMessage.success("排课成功");
        callback();
    }
};
