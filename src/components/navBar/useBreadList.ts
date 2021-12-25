import { watch, ref } from "vue";
import router from "@/router";
import { Bread } from "./interface";

export default () => {
    const breadList = ref([
        {
            name: "首页",
            path: "/home"
        },
        {
            name: "备课",
            path: "/preparation"
        },
        {
            name: "集体备课",
            path: "/preparation-group"
        }
    ]);

    const value = sessionStorage.getItem("breadList");
    if (value) {
        breadList.value = JSON.parse(value);
    }

    watch(() => ({ name: router.currentRoute.value.name, path: router.currentRoute.value.path }), ({ name, path }) => {
        if (
            breadList.value.findIndex((r) => {
                return r.name === name;
            }) > -1 || path === "/login"
        ) {
            return;
        }
        breadList.value.push({
            name: name as string,
            path: path
        });
    });

    const closeTab = (item: Bread) => {
        const index = breadList.value.findIndex((r) => {
            return r.name === item.name;
        });
        breadList.value.splice(index, 1);
        if (router.currentRoute.value.name === item.name) {
            router.push(breadList.value[breadList.value.length - 1].path);
        }
    };

    watch(breadList, () => {
        sessionStorage.setItem("breadList", JSON.stringify(breadList.value));
    }, { deep: true });

    return {
        breadList,
        closeTab
    };
};
