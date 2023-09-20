<template>
    <div ref="mathContainer" style="word-break: break-all;"></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, defineProps } from 'vue'

const props = defineProps({
    text: {
        type: String,
        default: ''
    }
})

const mathContainer = ref<HTMLElement | any>(null)

onMounted(() => {
    renderMathJax(props.text)
})

watch(
    () => props.text,
    (newVal) => {
        renderMathJax(newVal)
    }
)

const renderMathJax = (text: string) => {
    if (typeof window.MathJax !== 'undefined') {
        mathContainer.value.innerHTML = text;
        const tableData = mathContainer.value.querySelectorAll('table');
        tableData?.forEach((table: any) => {
            table.style.width = "100%";
        });
        window.MathJax.typesetPromise([mathContainer.value]).catch((error: any) => {
            console.error("MathJax 渲染出错:", error)
        })
    }
}
</script>
