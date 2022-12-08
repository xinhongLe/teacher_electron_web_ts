import { ref } from "vue";
import { IPageValue } from "@/types/home";

export default () => {
    const selectPageData = ref<any[]>([]);

    const handleSelectPages = (data:IPageValue) => {
        console.log(data, "------");
    };
    const handleSaveTemplate = () => {
        console.log("ok");
    };

    // 窗卡页 右键-menu菜单
    const contextmenus = (el: any, data: any) => {
        return [
            {
                text: "保存模板",
                subText: "",
                handler: () => handleSaveTemplate()
            }
            // {
            //     text: "保存题目",
            //     subText: "",
            //     handler: () => handleSaveTemplate(2)
            // }
        ];
    };

    return {
        selectPageData,
        contextmenus,
        handleSelectPages
    };
};
