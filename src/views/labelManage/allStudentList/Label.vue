<template>
    <div class="label">
        <div class="type type4" v-if="info.TagName == '未标记'">未标记</div>
        <div class="type" v-else>
            <div :class="classMap[levalMap[info.TagName]]">{{ info.TagName }}</div>
        </div>
    </div>
</template>

<script lang="ts">
import useTagList from "@/hooks/useTagList";
import { Student } from "@/types/labelManage";
import { computed, defineComponent, PropType } from "vue";
export default defineComponent({
    props: {
        info: {
            type: Object as PropType<Student>,
            default: () => ({})
        },
        subjectId: {
            type: String,
            default: ""
        }
    },
    setup() {
        const { tagList, getTagList } = useTagList();
        getTagList();
        const classMap: Record<number, string> = {
            100: "type3",
            200: "type2",
            300: "type1"
        };

        const levalMap = computed(() => {
            const obj: Record<string, number> = {};
            tagList.value.forEach(({ Level, TagName }) => {
                obj[TagName] = Level;
            });
            return obj;
        });

        return {
            levalMap,
            classMap
        };
    }
});
</script>

<style lang="scss" scoped>
.type {
    background-size: 120px 40px;
    font-size: 14px;
    font-weight: 500;
    color: #727b91;
    line-height: 40px;
    text-align: center;
    width: 120px;
    height: 40px;
    margin: auto;
    > div {
        background-size: 120px 40px;
        width: 120px;
        height: 40px;
    }
}
.type1 {
    background: url("./../../../assets/my-student/pic_xueba.png");
    color: #fff;
}
.type2 {
    background: url("./../../../assets/my-student/pic_xuezhong.png");
    color: #fff;
}
.type3 {
    background: url("./../../../assets/my-student/pic_xuemiao.png");
    color: #fff;
}
.type4 {
    background: url("./../../../assets/my-student/pic_weibiaoji.png");
    color: #fff;
}
.type5 {
    background: url("./../../../assets/my-student/pic_weikaitong.png");
}
</style>
