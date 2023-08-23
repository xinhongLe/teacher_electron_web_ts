<template>
    <div v-html="text" style="word-break: break-all;"></div>
</template>

<script setup lang="ts">
import {watch, nextTick, toRefs} from 'vue'

const props = defineProps({
    text: {
        type: String,
        default: ''
    }
})

const {text} = toRefs(props)

const renderMathJax = () => {
    nextTick(() => {
        ;(window as any).MathJax.Hub.Queue(['Typeset', (window as any).MathJax.Hub])
    })
}

renderMathJax()

watch(
    () => props.text,
    () => {
        renderMathJax()
    }
)
</script>
