<template>
    <el-pagination
        :total="total"
        v-model:page-size="size"
        layout="prev, pager, next"
        v-model:current-page="page"
        :page-sizes="[10, 20, 30, 40]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
</template>
<script lang="ts" setup>
import { ref } from "vue";

const emit = defineEmits(["handleSizeChange", "handleCurrentChange"]);
const total = ref(10);
const page = ref(1);
const size = ref(10);
const handleSizeChange = (val: number) => {
    emit("handleSizeChange", val);
};
const handleCurrentChange = (val: number) => {
    emit("handleCurrentChange", val);
};
defineExpose({ total, page, size });
</script>
<style lang="scss" scoped>
</style>
