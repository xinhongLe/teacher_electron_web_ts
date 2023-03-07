<template >
    <div class="p-layout-package" >
        <div class="lesson-package">
            <div class="package-item">
                备课包1
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped >
.p-layout-package {
    width: 100%;
    overflow-y: auto;
    height: calc(100vh - 230px);
    // background-color: #fff;
    .package-item {
        width: 232px;
        background-color: #fff;
        height: 180px;
        text-align: center;
        line-height: 180px;
        font-size: 30px;
        cursor: pointer;
        margin-bottom: 20px;
    }
}
</style>