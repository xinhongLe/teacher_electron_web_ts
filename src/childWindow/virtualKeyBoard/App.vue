<template>
    <div class="keyboardClass"></div>
</template>

<script lang="ts" setup>
import {reactive, ref, defineProps, watch, unref, onMounted, defineEmits} from 'vue'
import Keyboard from 'simple-keyboard'
import 'simple-keyboard/build/css/index.css'
// import layout from 'simple-keyboard-layouts/build/layouts/chinese' // 中文输入法

const props = defineProps({
    keyboardClass: {
        default: 'simple-keyboard',
        type: String
    },
    input: {
        default: ''
    },
    maxLength: {default: ''}
})
const keyboard = ref<any>(null)
const emit = defineEmits(['onChange', 'onKeyPress'])
const displayDefault = reactive({
    '{bksp}': 'backspace',
    '{lock}': 'caps',
    '{enter}': '无',
    '{tab}': 'tab',
    '{shift}': 'shift',
    // '{change}': '中文',
    '{space}': '空格',
    '{clear}': '清空',
    '{close}': '关闭'
})

watch(
    () => unref(props).input,
    (input) => {
        keyboard.value.setInput(input)
    }
)

function onChange(input: any) {
    keyboard.value.setInput(input)
    window.electron.ipcRenderer.send("data-to-password", input);
}

function handleShift() {
    let currentLayout = keyboard.value.options.layoutName
    let shiftToggle = currentLayout === 'default' ? 'shift' : 'default'

    keyboard.value.setOptions({
        layoutName: shiftToggle
    })
}

function onKeyPress(button: any, $event: any) {
    // 点击关闭
    if (button === '{close}') {
        let keyboard = $event.path[3]
        keyboard.style.visibility = 'hidden'
        window.electron.destroyWindow();
        return false
    }
        // else if (button === '{change}') {
        //     // 切换中英文输入法
        //     if (keyboard.value.options.layoutCandidates !== null) {
        //         displayDefault['{change}'] = '中文'
        //         // 切换至英文
        //         keyboard.value.setOptions({
        //             layoutCandidates: null,
        //             display: displayDefault
        //         })
        //     } else {
        //         // 切换至中文
        //         displayDefault['{change}'] = '英文'
        //         keyboard.value.setOptions({
        //             layoutCandidates: layout.layoutCandidates,
        //             display: displayDefault
        //         })
        //     }
    // }
    else if (button === '{clear}') {
        keyboard.value.clearInput();
        window.electron.ipcRenderer.send("data-to-password", '');
    } else if (button === '{enter}') {
        keyboard.value.setInput('')
        // emit('onKeyPress', button)
    } else {
        let value = $event.target.offsetParent.parentElement.children[0].children[0].value
        // window.electron.ipcRenderer.send("data-to-password", button);
        // 输入框有默认值时，覆写
        if (value) {
            keyboard.value.setInput(value);
        }

    }
    if (button === '{shift}' || button === '{lock}') handleShift()
}

onMounted(() => {
    keyboard.value = new Keyboard('.keyboardClass', {
        onChange: onChange,
        onKeyPress: onKeyPress,
        layout: {
            // 默认布局
            default: [
                '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
                '{tab} q w e r t y u i o p [ ] \\',
                "{lock} a s d f g h j k l ; ' {enter}",
                '{shift} z x c v b n m , . / {clear}',
                '{space} {close}'
            ],
            // shift布局
            shift: [
                '~ ! @ # $ % ^ & * ( ) _ + {bksp}',
                '{tab} Q W E R T Y U I O P { } |',
                '{lock} A S D F G H J K L : " {enter}',
                '{shift} Z X C V B N M < > ? {clear}',
                '{space} {close}'
            ]
        },
        // 按钮展示文字
        display: displayDefault,
        // 按钮样式
        buttonTheme: [
            {
                class: 'hg-red close',
                buttons: '{close}'
            },
            {
                class: 'change',
                buttons: '{change}'
            }
        ],
        // 输入限制长度
        maxLength: props.maxLength
    })
})
</script>

<style lang="scss" scoped>
:deep(.hg-theme-default) {
    width: 70%;

    .hg-button {
        &.hg-red {
            background: #db3e5d;
            color: white;

            &.close {
                max-width: 200px;
            }
        }

        &.change {
            max-width: 200px;
        }
    }
}
</style>
