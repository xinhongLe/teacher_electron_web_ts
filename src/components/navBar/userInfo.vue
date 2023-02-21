<script lang="ts" setup>
import { MutationTypes, store } from "@/store";
import Feedback from "../feedback/index.vue";
import { computed, defineAsyncComponent, ref, watch } from "vue";
import isElectron from "is-electron";
import useOutLogin from "@/hooks/useOutLogin";

const ClearCacheDialog = defineAsyncComponent(
    () => import("./clearCacheDialog.vue")
);
const AutoClearCache = defineAsyncComponent(
    () => import("./autoClearCache.vue")
);

const feedbackRef = ref<InstanceType<typeof Feedback>>();
const account = computed(() => store.state.userInfo.account);
const name = computed(() => store.state.userInfo.name);
const schoolList = computed(() => store.state.userInfo.Schools || []);
const schoolName = computed(() => store.state.userInfo.schoolName);
const setSelectedSchool = () => {
    if (!store.state.userInfo.schoolId && schoolList.value.length > 0) {
        const school = schoolList.value[0];
        store.commit(MutationTypes.UPDATE_SELECTED_SCHOOL, { schoolId: school.UserCenterSchoolID, schoolName: school.Name });
    }
};
setSelectedSchool();
watch(schoolList, () => {
    setSelectedSchool();
});
const selectSchool = (school: { UserCenterSchoolID: string; Name: string; }) => {
    store.commit(MutationTypes.UPDATE_SELECTED_SCHOOL, { schoolId: school.UserCenterSchoolID, schoolName: school.Name });
};
const showCacheDialog = ref(false);

const showFeedBack = () => {
    feedbackRef!.value!.show();
};

const useLogout = () => {
    useOutLogin();
    if (isElectron()) {
        window.electron.ipcRenderer.send("stopSingalR");
        // 退出登录清空智课助手里的资源
        window.electron.ipcRenderer.send("attendClass", "unfoldSuspension", {
            type: "sysData",
            resources: "[]"
        });
    }
};
</script>

<template>
    <div class="userInfo">
        <el-menu
            class="avatar-container"
            :ellipsis="false"
            mode="horizontal"
        >
            <el-sub-menu index="user">
                <template #title>
                    <div class="avatar-wrapper">
                        <img src="./img/avator_small.svg" />
                        <span class="name">{{ name || "匿名" }}</span>
                        <el-icon class="icon"><CaretBottom /></el-icon>
                    </div>
                </template>
                <el-menu-item index="user-info" class="nav-user-info-box">
                    <div
                        style="
                            display: flex;
                            height: 43px;
                            flex: 1;
                            justify-content: center;
                        "
                    >
                        <div style="display: flex">
                            <img
                                style="width: 43px"
                                src="@/assets/indexImages/touxiang.png"
                                class="user-avatar"
                            />
                        </div>
                        <div style="margin-left: 10px">
                            <p
                                style="
                                    height: 20px;
                                    line-height: 20px;
                                    text-align: left;
                                "
                            >
                                {{ name || "匿名" }}
                            </p>
                            <p style="height: 20px; line-height: 20px">
                                {{ account }}
                            </p>
                        </div>
                    </div>
                </el-menu-item>
                <el-sub-menu index="school-list" class="user-list-item">
                    <template #title>
                        <div class="user-list-item">
                            {{schoolName}}
                        </div>
                    </template>
                    <el-menu-item :index="item.ID" v-for="item in schoolList" :key="item.ID">
                        <template #title>
                            <div class="user-list-item" @click="selectSchool(item)">
                                {{item.Name}}
                            </div>
                        </template>
                    </el-menu-item>
                </el-sub-menu>
                <el-menu-item index="question" class="user-list-item">
                    <template #title>
                        <div class="user-list-item" @click="showFeedBack">
                            问题反馈
                        </div>
                    </template>
                </el-menu-item>
                <el-menu-item index="clear" class="user-list-item">
                    <template #title>
                        <div class="user-list-item" @click="showCacheDialog = true">
                            清理缓存
                        </div>
                    </template>
                </el-menu-item>
                <el-menu-item index="logout" class="user-list-item">
                    <template #title>
                        <div class="user-list-item" @click="useLogout">
                            退出
                        </div>
                    </template>
                </el-menu-item>
            </el-sub-menu>
        </el-menu>
        <!-- <el-dropdown
            class="avatar-container right-menu-item hover-effect"
            trigger="click"
        >
            <div class="avatar-wrapper">
                <img src="./img/avator_small.svg" />
                <span class="name">{{ name }}</span>
                <i class="el-icon-caret-bottom icon" />
            </div>
            <template #dropdown>
                <el-dropdown-menu style="text-align: center">
                    <el-dropdown-item>
                        <div
                            style="
                                display: flex;
                                height: 43px;
                                width: 120px;
                                justify-content: space-around;
                            "
                        >
                            <div style="display: flex">
                                <img
                                    style="width: 43px"
                                    src="@/assets/indexImages/touxiang.png"
                                    class="user-avatar"
                                />
                            </div>
                            <div style="margin-left: 10px">
                                <p
                                    style="
                                        height: 20px;
                                        line-height: 20px;
                                        text-align: left;
                                    "
                                >
                                    {{ name }}
                                </p>
                                <p style="height: 20px; line-height: 20px">
                                    {{ account }}
                                </p>
                            </div>
                        </div>
                    </el-dropdown-item>
                    <el-dropdown-item divided>
                        <span @click="showFeedBack" style="display: block"
                            >问题反馈</span
                        >
                    </el-dropdown-item>
                    <el-dropdown-item v-if="isElectron()">
                        <span
                            @click="showCacheDialog = true"
                            style="display: block"
                            >清理缓存</span
                        >
                    </el-dropdown-item>
                    <el-dropdown-item>
                        <span @click="useLogout" style="display: block"
                            >退出登录</span
                        >
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown> -->
    </div>
    <Feedback ref="feedbackRef" />
    <Suspense v-if="isElectron()">
        <ClearCacheDialog
            v-if="showCacheDialog"
            v-model:showCacheDialog="showCacheDialog"
        />
    </Suspense>
    <Suspense v-if="isElectron()">
        <AutoClearCache />
    </Suspense>
</template>

<style lang="scss" scoped>
.userInfo {
    display: flex;
    justify-content: center;
    align-items: center;
    -webkit-app-region: no-drag;
}
.avatar-wrapper {
    display: flex;
    align-items: center;
    .name {
        margin: 0 8px;
        font-size: 14px;
        color: #fff;
        text-align: center;
    }
    .icon {
        color: #fff;
    }
}

.avatar-container {
    height: 48px;
    line-height: 48px;
    border-bottom: 0;
    background-color: transparent !important;
    :deep(.el-sub-menu__title) {
        height: 48px;
        line-height: 48px;
        background-color: transparent !important;
        border-bottom: 0 !important;
    }
}
</style>

<style>
.nav-user-info-box {
    height: 56px !important;
    border-bottom: 1px solid #eee;
}

.el-popper.is-light {
    border: 0;
}

.user-list-item {
    height: 44px !important;
    line-height: 44px;
    width: 100%;
    text-align: center;
    color: #333;
}

.user-list-item .el-sub-menu__title {
    height: 44px !important;
    line-height: 44px;
}
</style>
