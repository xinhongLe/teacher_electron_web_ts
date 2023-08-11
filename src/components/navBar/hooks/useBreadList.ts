import { watch, ref, onMounted, onUnmounted } from "vue";
import router from "@/router";
import { Bread } from "../interface";
import emitter from "@/utils/mitt";
import { isNavigationFailure } from "vue-router";
import isElectron from "is-electron";

export default () => {
    const breadList = ref([
        {
            name: "首页",
            path: "/home"
        },
        {
            name: "备课",
            path: "/preparation"
        }
    ]);

    const value = sessionStorage.getItem("breadList");
    let cancelAfterEach: () => void;
    if (value) {
        breadList.value = JSON.parse(value);
    }

    watch(() => ({ name: router.currentRoute.value.name, path: router.currentRoute.value.path }), ({ name, path }) => {
        const index = breadList.value.findIndex((r) => {
            return r.name === name;
        });
        if (
            index > -1
        ) {
            return breadList.value.splice(index, 1, {
                name: name as string,
                path: path
            });
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

        if (router.currentRoute.value.name === item.name) {
            router.push(breadList.value[breadList.value.length - 2].path);
            cancelAfterEach = router.afterEach((to, from, failure) => {
                if (isNavigationFailure(failure)) return;
                breadList.value.splice(index, 1);
                cancelAfterEach();
            });
        } else {
            breadList.value.splice(index, 1);
        }

        if (item.name === "上课" && isElectron()) {
            window.electron.ipcRenderer.send("attendClass", "unfoldSuspension", {
                type: "sysData",
                resources: "[]"
            });
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
