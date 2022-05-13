<template>
    <div class="book-item" :style="{ background: `url(${cover})`, backgroundSize: 'cover' }">
        <div class="book-title">
            {{ detail[0] }}
        </div>
        <div class="book-grade">
            {{ detail[2] }}
        </div>
        <div class="book-version">
            {{ detail[1] }}
        </div>
    </div>
</template>

<script lang="ts">
import { IBook } from "@/types/preparation";
import { computed, defineComponent, PropType } from "vue";

export default defineComponent({
    props: {
        book: {
            type: Object as PropType<IBook>,
            required: true
        }
    },
    setup(props) {
        const totalBookCover: {[key: string]: string} = {
            "历史": require("@/assets/images/preparation/book/cover_lishi.png"),
            "语文": require("@/assets/images/preparation/book/cover_yuwen.png"),
            "数学": require("@/assets/images/preparation/book/cover_shuxue.png"),
            "英语": require("@/assets/images/preparation/book/cover_yingyu.png"),
            "物理": require("@/assets/images/preparation/book/cover_wuli.png"),
            "化学": require("@/assets/images/preparation/book/cover_huaxue.png"),
            "政治": require("@/assets/images/preparation/book/cover_zhengzhi.png"),
            "地理": require("@/assets/images/preparation/book/cover_dili.png"),
            "生物": require("@/assets/images/preparation/book/cover_shengwu.png"),
            "其他": require("@/assets/images/preparation/book/cover_qita.png")
        };

        const cover = computed(() => {
            return totalBookCover[props.book.subject] || totalBookCover["其他"];
        });

        const detail = computed(() => {
            return props.book.name.split(" ");
        });

        return {
            cover,
            detail
        }
    }
});
</script>

<style lang="scss" scoped>
.book-item {
    width: 80px;
    height: 112.7px;
    position: relative;
}

.book-title {
    font-size: 16px;
    font-weight: 600;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 30px;
}

.book-grade {
    font-size: 12px;
    position: absolute;
    top: 55px;
    left: 50%;
    transform: translateX(-50%) scale(.8);
}

.book-version {
    font-size: 12px;
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%) scale(.8);
    color: #fff;
}
</style>
