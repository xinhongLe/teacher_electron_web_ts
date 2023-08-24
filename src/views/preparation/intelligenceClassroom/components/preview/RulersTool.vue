<template>
    <div class="shape-pool-warp" ref="shapePoolWarp" v-click-outside="hide">
        <div class="shape-pool">
            <div class="pen-radius-box">
                <el-tooltip
                    :hide-after="0"
                    :show-after="0.5"
                    placement="top"
                    content="直尺"
                >
                    <img
                        src="../../images/slices/pic_chi.png"
                        alt=""
                        @click="setRulersTool(OPTION_TYPE.RULER)"
                    />
                </el-tooltip>
                <el-tooltip
                    :hide-after="0"
                    :show-after="0.5"
                    placement="top"
                    content="量角器"
                >
                    <!-- <IconProtractor
                        class="icon"
                        @click="setRulersTool('protractor')"
                    /> -->
                    <img
                        src="../../images/slices/pic_ljq.png"
                        alt=""
                        @click="setRulersTool(OPTION_TYPE.PROTRACTOR)"
                    />
                </el-tooltip>
                <el-tooltip
                    :hide-after="0"
                    :show-after="0.5"
                    placement="top"
                    content="圆规"
                >
                    <!-- <IconCompass
                        class="icon"
                        @click="setRulersTool('compass')"
                    /> -->
                    <img
                        src="../../images/slices/pic_yj.png"
                        alt=""
                        @click="setRulersTool(OPTION_TYPE.COMPASS)"
                    />
                </el-tooltip>
                <el-tooltip :hide-after="0" :show-after="0.5" placement="top" content="直角三角形">
                    <img src="../../images/slices/pic_triangle1.png" alt="" height="40"
                         @click="setRulersTool(OPTION_TYPE.RIGHTTRIANGLE)"/>
                </el-tooltip>
                <el-tooltip :hide-after="0" :show-after="0.5" placement="top" content="等腰直角三角形">
                    <img src="../../images/slices/pic_triangle2.png" alt="" width="40"
                         @click="setRulersTool(OPTION_TYPE.ISOSCELESTRIANGLE)"/>
                </el-tooltip>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref, nextTick} from "vue";
import {OPTION_TYPE} from "mwhiteboard";

export default defineComponent({
    name: "rulers-tool",
    props: {
        rulersLeft: {
            type: Number,
            default: 0
        },
        rulersTop: {
            type: Number,
            default: 0
        },
    },
    setup(props, {emit}) {
        const shapePoolWarp = ref<HTMLDivElement>();
        // const writingBoardColor = ref(props.currentDrawColor);

        const hide = () => {
            emit("update:isShowRulers", false);
        };

        // 修改尺规类型
        const setRulersTool = (type: string) => {
            emit("setRulersTool", type);
            emit("update:isShowRulers", false);
        };

        onMounted(() => {
            nextTick(() => {
                if (shapePoolWarp.value) {
                    // writingBoardColor.value = props.currentDrawColor;

                    const width = shapePoolWarp.value.offsetWidth;
                    const height = shapePoolWarp.value.offsetHeight;
                    const documentWidth = document.documentElement.clientWidth;
                    const maxLeft = documentWidth - width;
                    shapePoolWarp.value.style.left =
                        Math.min(props.rulersLeft - width / 2, maxLeft) + "px";
                    shapePoolWarp.value.style.top =
                        props.rulersTop - height - 10 + "px";
                }
            });
        });

        return {
            hide,
            shapePoolWarp,
            // writingBoardColor,
            setRulersTool,
            OPTION_TYPE
        };
    }
});
</script>

<style lang="scss" scoped>
.shape-pool-warp {
    z-index: 100000;
    position: fixed;
    top: 0;
    left: 0;
    background: #fff;
    border-radius: 2px;
    padding: 12px 16px;
    box-shadow: 0 2px 8px #00000026;
}

.shape-pool {
    min-width: 150px;
    // max-height: 540px;
    // overflow: auto;
    // margin-bottom: -12px;
    // margin-right: -12px;
    // padding-right: 12px;
    .pen-radius-box {
        img {
            cursor: pointer;
        }
    }
}

.category-name {
    width: 100%;
    font-size: 13px;
    margin-bottom: 10px;
    border-left: 4px solid #aaa;
    background-color: #eee;
    padding: 2px 0 2px 10px;
}
</style>
