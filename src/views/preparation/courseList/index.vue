<script lang="ts" setup>
import { ArrowDownBold, ArrowUpBold } from "@element-plus/icons-vue";
import { ref } from "vue";
import { pull } from "lodash";
import CollapseTransition from "@/components/collapseTransition/index.vue";

const activeNames = ref<string[]>([]);
const isShow = ref(true);

const collapseClick = (name: string) => {
    if (activeNames.value.includes(name)) {
        pull(activeNames.value, name);
    } else {
        activeNames.value.push(name);
    }
};
</script>

<template>
    <div class="container">
        <transition name="slide">
            <div class="course-list-warp" v-show="isShow">
                <div class="course-list">
                    <div class="chapter-warp">
                        <div class="chapter-item" @click="collapseClick('1')">
                            <span class="chapter">1单元 两位数的口算</span>
                            <el-icon color="#979BA9"
                                ><ArrowUpBold
                                    v-if="
                                        activeNames.includes('1')
                                    " /><ArrowDownBold v-else
                            /></el-icon>
                        </div>
                        <CollapseTransition>
                            <div
                                v-show="activeNames.includes('1')"
                                class="chapter-course-list-warp"
                            >
                                <div class="course active">
                                    2.1 两位数加两位数口算
                                </div>
                                <div class="course">2.1 两位数加两位数口算</div>
                                <div class="course">2.1 两位数加两位数口算</div>
                                <div class="course">2.1 两位数加两位数口算</div>
                            </div>
                        </CollapseTransition>
                    </div>
                    <div class="chapter-warp">
                        <div class="chapter-item" @click="collapseClick('2')">
                            <span class="chapter">1单元 两位数的口算</span>
                            <el-icon color="#979BA9"
                                ><ArrowUpBold
                                    v-if="
                                        activeNames.includes('2')
                                    " /><ArrowDownBold v-else
                            /></el-icon>
                        </div>
                        <CollapseTransition>
                            <div
                                v-show="activeNames.includes('2')"
                                class="chapter-course-list-warp"
                            >
                                <div class="course active">
                                    2.1 两位数加两位数口算
                                </div>
                                <div class="course">2.1 两位数加两位数口算</div>
                                <div class="course">2.1 两位数加两位数口算</div>
                                <div class="course">2.1 两位数加两位数口算</div>
                            </div>
                        </CollapseTransition>
                    </div>
                    <div class="chapter-warp">
                        <div class="chapter-item" @click="collapseClick('3')">
                            <span class="chapter">1单元 两位数的口算</span>
                            <el-icon color="#979BA9"
                                ><ArrowUpBold
                                    v-if="
                                        activeNames.includes('3')
                                    " /><ArrowDownBold v-else
                            /></el-icon>
                        </div>
                        <CollapseTransition>
                            <div
                                v-show="activeNames.includes('3')"
                                class="chapter-course-list-warp"
                            >
                                <div class="course active">
                                    2.1 两位数加两位数口算
                                </div>
                                <div class="course">2.1 两位数加两位数口算</div>
                                <div class="course">2.1 两位数加两位数口算</div>
                                <div class="course">2.1 两位数加两位数口算</div>
                            </div>
                        </CollapseTransition>
                    </div>
                </div>
            </div>
        </transition>

        <div class="fold-btn" @click="isShow = !isShow">
            <i
                :class="isShow ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"
            ></i>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    position: relative;
    .slide-enter-active,
    .slide-leave-active {
        transition: all 0.3s;
        .chapter {
            white-space: nowrap;
        }
    }

    .slide-enter-from,
    .slide-leave-to {
        width: 0;
        opacity: 0;
    }
    .fold-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 50%;
        transform: translateX(100%) translateY(-50%);
        right: 0;
        height: 104px;
        width: 18px;
        border-radius: 0px 8px 8px 0px;
        box-shadow: 2px 4px 8px 0px rgba(0, 0, 0, 0.1);
        background: #fff;
        cursor: pointer;
        z-index: 1;
        i {
            color: #7e7f83;
            font-size: 18px;
            font-weight: 700;
        }
    }
}
.course-list-warp {
    width: 244px;
    height: 100%;
    background-color: #fff;
    &.hidden {
        width: 0;
    }
    .course-list {
        padding: 20px;
        height: 100%;
        overflow-y: overlay;
    }
    .chapter-warp {
        padding: 16px 0;
        border-top: 1px dashed #e9ecf0;
        &:first-child {
            padding: 0;
            padding-bottom: 16px;
            border-top: none;
        }
        .chapter-item {
            display: flex;
            justify-content: space-between;
            cursor: pointer;
            .chapter {
                font-size: 16px;
                font-weight: 600;
                color: var(--app-color-dark);
                line-height: 22px;
            }
        }
        .chapter-course-list-warp {
            .course {
                height: 60px;
                display: flex;
                justify-content: center;
                align-items: center;
                color: var(--app-color-dark);
                background-color: #f0f4ff;
                font-size: 14px;
                font-weight: 400;
                margin-top: 8px;
                border-radius: 4px;
                cursor: pointer;
                &:first-child {
                    margin-top: 12px;
                }
                &.active {
                    background-color: var(--app-color-primary);
                    color: #fff;
                    position: relative;
                    &::before {
                        content: "";
                        height: 0;
                        width: 0;
                        position: absolute;
                        right: 0;
                        top: 50%;
                        transform: translateX(100%) translateY(-50%);
                        border: 8px solid transparent;
                        border-left: 8px solid var(--app-color-primary);
                    }
                }
            }
        }
    }
}
</style>
