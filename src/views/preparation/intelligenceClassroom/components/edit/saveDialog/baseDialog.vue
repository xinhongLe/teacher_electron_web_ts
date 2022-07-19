<script lang="ts" setup>
import { Close } from "@element-plus/icons-vue";
import { ElIcon } from "element-plus";
import { defineProps, defineEmits, ref, PropType } from "vue";
const props = defineProps({
    title: {
        type: String
    },
    name: {
        type: String
    },
    allNames: {
        type: Array as PropType<string[]>,
        default: () => []
    },
    content: {
        type: String
    }
});

const emit = defineEmits(["close", "onSave"]);

const getName = (index = 1): string => {
    const name = `${props.name}（副本${index}）`;
    if (props.allNames.includes(name)) {
        return getName(index + 1);
    }
    return name;
};

const newName = ref(getName());

const inputRef = ref<HTMLInputElement>();

const close = () => {
    emit("close");
};

const onSave = () => {
    const name = inputRef.value?.value;
    emit("onSave", name);
    emit("close");
};

</script>

<template>
    <div class="dialog-warp">
        <div class="dialog-content-warp">
            <div class="title-warp">
                <div class="title">{{title}}</div>
                <div class="close-icon" @click="close">
                    <el-icon color="#bcbcbc" :size="16"><Close /></el-icon>
                </div>
            </div>
            <div class="content-warp">
                <div v-if="content" class="content">{{content}}</div>
                <div class="tips">课件名称：</div>
                <input class="input" :value="newName" ref="inputRef" maxlength="20"/>
            </div>
            <div class="footer-warp">
                <div class="btn" @click="close">取消</div>
                <div class="btn" @click="onSave">保存</div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.dialog-warp {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1999;
}
.dialog-content-warp {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
    background: #fff;
    padding-bottom: 16px;
    background: #FFFFFF;
    box-shadow: 0px 6px 16px -8px rgba(0, 0, 0, 0.12), 0px 9px 28px 0px rgba(0, 0, 0, 0.08), 0px 12px 48px 16px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    width: 374px;
    display: flex;
    flex-direction: column;
    .title-warp {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50px;
        position: relative;
        border-bottom: 1px solid #EBEFF1;
        .title {
            font-size: 18px;
            font-weight: 500;
            color: #212121;
        }
        .close-icon {
            position: absolute;
            right: 20px;
            cursor: pointer;
        }
    }
    .content-warp {
        padding: 0 20px;
        font-size: 14px;
        color: #212121;
        font-weight: 400;
        margin-bottom: 48px;
        .content {
            margin-top: 24px;
            line-height: 20px;
        }
        .tips {
            margin-top: 32px;
            margin-bottom: 12px;
        }
        .input {
            width: 100%;
            height: 32px;
            font-weight: 600;
            border: 1px solid #EBEFF1;
            padding: 6px 12px;
            caret-color: #2E95FF;
        }
    }
    .footer-warp {
        display: flex;
        justify-content: flex-end;
        padding-right: 20px;
        .btn {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 72px;
            height: 32px;
            margin-right: 12px;
            border-radius: 4px;
            font-size: 14px;
            color: #212121;
            cursor: pointer;
            &:first-child {
                border: 1px solid #EBEFF1;
            }
            &:last-child {
                margin-right: 0;
                background: #2E95FF;
                color: #fff;
            }
        }
    }
}
</style>
