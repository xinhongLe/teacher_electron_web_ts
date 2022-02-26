<template>
    <div class="board-list-warp" @click.stop="">
        <Title title="黑板列表" :close="close" />
        <div class="board-list">
            <div
                class="board"
                v-for="(item, index) in boardList"
                :class="{ active: pageIndex === index }"
                :style="{ backgroundImage: `url(${item.img})`, width: '100%' }"
                :key="item.img"
                @click.stop="select(index)"
            >
                <!-- <img :src="item.img" class="content"/> -->
                <div class="tag">{{ index + 1 }}</div>
                <div class="delete-icon" @click.stop="$emit('deleteBoard', index)" v-if="boardList.length > 1">
                    <el-icon :size="16" color="#fff"><delete /></el-icon>
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="btn" @click.stop="$emit('createBroad')">+ 新建黑板</div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import Title from "./title.vue";
export default defineComponent({
    props: {
        pageIndex: {
            type: Number,
            default: 0
        },
        boardList: {
            type: Array as PropType<
                {
                    data: string;
                    img: string;
                }[]
            >,
            default: () => []
        }
    },
    setup(props, { emit }) {
        const close = () => {
            emit("update:isShowBroadList", false);
        };

        const select = (index: number) => {
            emit("update:pageIndex", index);
        };
        return {
            close,
            select
        };
    },
    components: { Title }
});
</script>

<style lang="scss" scoped>
.board-list-warp {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 414px;
    background: #fff;
    box-shadow: -3px 0px 6px -4px rgba(0, 0, 0, 0.12),
        -6px 0px 16px 0px rgba(0, 0, 0, 0.08),
        -9px 0px 28px 8px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    .board-list {
        flex: 1;
        padding: 0 24px;
        overflow: overlay;
        .board {
            height: 206px;
            margin-top: 16px;
            position: relative;
            border-radius: 4px;
            background-size: 100%;
            cursor: pointer;
            &:first-child {
                margin-top: 0;
            }
            &.active {
                border: 6px solid #4b71ee;
                .tag {
                    background: #4b71ee;
                    border-top-left-radius: 0;
                    border-bottom-right-radius: 12px;
                }
            }
            .tag {
                position: absolute;
                left: 0;
                top: 0;
                width: 60px;
                height: 32px;
                border-radius: 4px 0px 12px 0px;
                background: rgba(156, 159, 170, 0.5);
                font-size: 16px;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #fff;
            }
            .content {
                width: 100%;
                height: 100%;
                border-radius: 4px;
            }
            .delete-icon {
                border-radius: 4px;
                position: absolute;
                bottom: 12px;
                right: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 36px;
                height: 36px;
                background-color: rgba(0, 0, 0, 0.4);
            }
        }
    }
    .footer {
        height: 72px;
        display: flex;
        justify-content: center;
        align-items: center;
        .btn {
            width: 214px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #F3F7FF;
            border-radius: 4px;
            font-size: 16px;
            font-weight: 400;
            color: #4B71EE;
            cursor: pointer;
        }
    }
}
</style>
