<template>
    <div class="container">
        <webview v-if="isElectron" class="iframe" :src="url"></webview>
        <iframe
            :src="url"
            sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"
            class="iframe"
            v-else
        />
    </div>
</template>

<script lang="ts">
import {get, STORAGE_TYPES} from "@/utils/storage";
import {defineComponent, onActivated, onDeactivated} from "vue";
import {RESOURCE_WEB, systemId} from "@/config";
import {IYunInfo} from "@/types/login";
import usePageEvent from "@/hooks/usePageEvent";
import isElectron from "is-electron";
import {useRoute} from "vue-router";

// ts
export default defineComponent({
    name: "assessmentCenter",
    setup() {
        const {createBuryingPointFn} = usePageEvent("资源中心", true);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.onmessage = (e: any, d: any) => {
            // console.log(e);
            if (e.data.url && e.data.download) {
                location.href = e.data.url;
            }
        };
        //token 令牌
        const token = get(STORAGE_TYPES.SET_TOKEN);
        //userInfo 当前登录用户信息
        const userInfo = get(STORAGE_TYPES.USER_INFO);
        //云平台信息
        const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);

        // console.log('user-info', userInfo);
        // console.log('yunInfo', yunInfo);

        //userId 用户id
        const userId = userInfo.UserCenterUserID;
        //orgId 部门id
        const orgID = yunInfo.OrgId;
        //secretKey 密钥
        const secretKey = yunInfo.SecretKey;
        //userType  用户类型：3.管理员 2.教师 1.学生 0.访客
        const userType = 2;
        //schoolId 学校id
        const schoolId = userInfo.schoolId;
        //schoolName 学校名称
        const schoolName = userInfo.schoolName;
        //platType 平台码
        const platType = systemId;

        const route = useRoute();
        const platformId = route.params.platformId;

        //webview地址
        const url = `${RESOURCE_WEB}/#/resource?TOKEN=${token}&USERID=${userId}&ORGID=${orgID}&SECRETKEY=${secretKey}&USERTYPE=${userType}&SCHOOLID=${schoolId}&SCHOOLNAME=${schoolName}&PLATTYPE=${platType}&platformId=${platformId}`;
        // console.log('url----', url);
        return {
            url,
            isElectron: isElectron(),
        };
    },
});
</script>

<style lang="scss" scoped>
.container {
    flex: 1;
    height: 100%;

    .iframe {
        width: 100%;
        height: 100%;
    }
}
</style>
