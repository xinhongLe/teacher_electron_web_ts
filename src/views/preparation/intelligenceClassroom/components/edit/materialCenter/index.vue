<template>
    <div :class="['fixed-content-right', isOpen ? '' : 'open-box']">
        <div class="btn-box">
            <div class="btn" @click="switchMenu">
                <p>素</p>
                <p>材</p>
                <p>库</p>
                <p class="icon" :class="{open:isOpen}">
                    <el-icon>
                        <DArrowLeft/>
                    </el-icon>
                </p>
            </div>
        </div>
        <div class="content-box" v-if="isOpen">
            <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleClick">
                <el-tab-pane v-for="(item, i) in tabList" :key="i" :label="item.label" :name="item.name"/>
            </el-tabs>
            <div class="content">
                <component
                    :is="currentComponent"
                    @insertData="insertData"
                    @insertTools="insertTools"
                    @editTemplate="editTemplate"
                    @checkoutTab="checkoutTab"
                    :subjectID="subjectID"
                    :lessonId="lessonId"
                    ref="componentRef"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, markRaw, reactive, ref, toRefs, computed, watch, nextTick } from "vue";
import materialTemplate from "./components/materialTemplate.vue";
import myMaterial from "./components/myMaterial.vue";
import materialResource from "./components/materialResource.vue";
import { ITemplateSave } from "@/types/home";
import { useRouter } from "vue-router";
import { Rank } from "@element-plus/icons-vue";

export default defineComponent({
    components: { materialTemplate, myMaterial, materialResource, Rank },
    props: {
        subjectID: {
            type: String,
            required: true
        },
        lessonId: {
            type: String,
            required: true
        }
    },
    emits: ["insertData", "editTemplate", "insertTools"],
    setup(props, { emit }) {
        const router = useRouter();
        const componentRef = ref();
        const state = reactive({
            isOpen: false,
            activeName: 1,
            // currentComponent: materialTemplate,
            tabList: [
                { label: "模版", name: 1 },
                { label: "素材", name: 2 },
                { label: "我的", name: 3 }
            ],
            subjectID: computed(() => props.subjectID),
            lessonId: computed(() => props.lessonId)
        });

        const currentComponent = ref<any>(markRaw(materialTemplate));

        const switchMenu = () => {
            state.isOpen = !state.isOpen;
            console.log(state.isOpen, "state.isOpen");
        };

        const handleClick = (value: number) => {
            if (value === 1) {
                currentComponent.value = markRaw(materialTemplate);
                nextTick(() => {
                    componentRef.value.queryTemplateList();
                });
            } else if (value === 2) {
                currentComponent.value = markRaw(materialResource);
            } else if (value === 3) {
                currentComponent.value = markRaw(myMaterial);
            }
        };
        const gotoMyTemplate = () => {
            state.isOpen = true;
            state.activeName = 3;
            handleClick(3);
            nextTick(() => {
                componentRef.value.checkMyTemplateTab();
            });
        };

        // 编辑模板
        const editTemplate = (data: any) => {
            emit("editTemplate", data);
        };
        // 插入模板/素材
        const insertData = (obj: ITemplateSave) => {
            emit("insertData", obj);
        };
        // 插入教具页
        const insertTools = (obj: any) => {
            emit("insertTools", obj);
        };
        // 查询我的模板里诶包
        const queryTemplateList = () => {
            // if (state.activeName === 1) {
            //     nextTick(() => {
            //         componentRef.value.querySaveTemplateList();
            //     });
            // } else
            if (state.activeName === 3) {
                nextTick(() => {
                    componentRef.value.quertSaveMyTemplate();
                });
            }
        };

        // 模板引用次数本地数据加1
        const addLinkCount = (id: string) => {
            if (state.activeName === 1 || state.activeName === 3) {
                if (!id) return;
                componentRef.value.addLinkCount(id);
            }
        };

        // 更新素材列表
        const updateMaterialList = () => {
            // if (state.activeName === 2) {
            //     nextTick(() => {
            //         componentRef.value.queryMaterialList();
            //     });
            // } else
            if (state.activeName === 3) {
                nextTick(() => {
                    componentRef.value.queryAssemblyList();
                });
            }
        };

        // 切换tab页
        const checkoutTab = () => {
            state.activeName = 2;
            handleClick(2);
        };

        return {
            router,
            currentComponent,
            ...toRefs(state),
            switchMenu,
            handleClick,
            insertData,
            editTemplate,
            componentRef,
            updateMaterialList,
            queryTemplateList,
            addLinkCount,
            insertTools,
            gotoMyTemplate,
            checkoutTab
        };
    }
});
</script>

<style lang="scss" scoped>
.fixed-content-right {
    position: fixed;
    width: 560px;
    top: 55px;
    right: 0;
    height: 100%;
    z-index: 1000;
    overflow: hidden;
    pointer-events: none;
    transition: 0.5s all;
}

.open-box {
    right: -520px;
}

.btn-box {
    height: 100px;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 40px;
    overflow: hidden;
    pointer-events: all;
    background-image: url("../../../../../../assets/edit/btn_bg.png");
    background-repeat: no-repeat;
    background-size: cover;

    .btn {
        height: 100%;
        width: 100%;
        box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: center;
        font-size: 16px;
        flex-direction: column;
        align-items: center;
        color: #fff;
        cursor: pointer;
        line-height: 20px;

        .icon {
            transition: 0.5s all;
            margin-top: 5px;

            &.open {
                transform: rotate(180deg);
            }
        }
    }
}

.content-box {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: #fff;
    box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.1);
    pointer-events: all;
    margin-left: 40px;

    :deep(.el-tabs__nav) {
        display: flex;
        width: 90%;
        height: 50px;

        .el-tabs__item {
            display: flex;
            flex: 1;
            justify-content: center;
            font-size: 14px;
            font-weight: 600;
        }
    }

    .content {
        flex: 1;
        min-height: 0;
        margin: 0 44px 64px 20px;
        padding-right: 6px;

        > div {
            width: 100%;
            height: 100%;
        }
    }

    .toresourse {
        width: 360px;
        height: 36px;
        background: rgba(46, 149, 255, 0.1);
        border-radius: 4px;
        border: 1px solid rgba(46, 149, 255, 0.1);
        position: absolute;
        bottom: 64px;
        transform: translateX(-50%);
        left: 50%;

        .text {
            position: absolute;
            font-size: 14px;
            color: #2e95ff;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);

            span {
                cursor: pointer;
            }

            span:hover {
                opacity: 0.5;
            }
        }
    }
}
</style>
