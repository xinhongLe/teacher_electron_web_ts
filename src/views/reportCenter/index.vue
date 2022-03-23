<template>
    <div class="container">
        <iframe :src="src" class="iframe"/>
    </div>
</template>

<script lang="ts">
import { store } from "@/store";
import { get, STORAGE_TYPES } from "@/utils/storage";
import { computed, defineComponent } from "vue";
export default defineComponent({
    name: "ReportCenter",
    setup() {
        const url = process.env.VUE_APP_IFRAME;
        const userInfo = get(STORAGE_TYPES.USER_INFO);
        return	{
            src: computed(() => `${url}/#/allStudyStatisticsData?TeacherID=${store.state.userInfo.id}&hideHeader=1&FranchiseeID=${userInfo.FranchiseeID}&FranchiseeMaster=${userInfo.IsFranchiseeMaster}`)
        };
    }
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
