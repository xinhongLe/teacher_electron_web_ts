<template>
    <div>
        <div class="me-work">
        <!-- <ViewArea
            :page="page"
            :width="page.pageSetting ? page.pageSetting.width : 1280"
            :height="page.pageSetting ? page.pageSetting.height : 720"
            ref="work"
            @updateCurrentStep="updateCurrentStep"
            @nextPage="nextPage"
            @prevPage="prevPage"
        /> -->
        <div
            class="me-page"
            :style="{ paddingBottom: hasCheck ? '40px' : '15px' }"
        >
            <div
                class="me-page-item"
                :class="selected === index && 'active'"
                v-for="(item, index) in pageList"
                :key="index"
                @click="selectPage(index)"
            >
                {{ item.name}}
                <div
                    class="page-checkbox"
                    v-if="hasCheck"
                    @click.stop="() => null"
                >
                    <el-checkbox v-model="item.isChecked"></el-checkbox>
                </div>
            </div>
        </div>
    </div>
    </div>
</template>

<script>
import { defineComponent } from "vue-demi";
export default defineComponent({});
</script>

<style lang="scss" scoped>
</style>
