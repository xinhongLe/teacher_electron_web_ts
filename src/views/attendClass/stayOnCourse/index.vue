<template>
    <div class="container">
        <div class="date calendar">
            <span class="prev"
                ><i
                    @click="weekPre"
                    v-if="hasPrev"
                    class="el-icon-arrow-left"
                ></i
            ></span>
            <span> {{ nowTime }} ~ {{ lateTime }}</span>
            <span class="next"
                ><i
                    @click="weekNext"
                    v-if="hasNext"
                    class="el-icon-arrow-right"
                ></i
            ></span>
        </div>
        <div class="list">
            <div class="stay-on-course-container">
                <Item v-for="item in courseList" :item="item" :key="item.ID"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { CourseBag } from "@/api";
import useTime from "@/hooks/useTime";
import { defineComponent, provide, ref, watch } from "vue";
import { fetchTeacherClasses } from "../api";
import Item from "./Item.vue";
export default defineComponent({
    name: "stayOnCourse",
    setup() {
        const courseList = ref<CourseBag[]>([]);
        const hasPrev = ref(true);
        const hasNext = ref(true);

        const { nowTime, lateTime, weekPre, weekNext, initDays } = useTime();
        initDays();

        const getTeacherClasses = async () => {
            const data = {
                firstDayOfWeek: nowTime.value
            };
            const res = await fetchTeacherClasses(data);
            if (res.resultCode === 200) {
                const { Classes, BeforeEnable, AfterEnable } = res.result;
                courseList.value = Classes;
                hasPrev.value = BeforeEnable;
                hasNext.value = AfterEnable;
            }
        };

        watch(nowTime, getTeacherClasses);

        provide("getTeacherClasses", getTeacherClasses);

        return {
            courseList,
            nowTime,
            hasPrev,
            hasNext,
            weekPre,
            weekNext,
            getTeacherClasses,
            lateTime
        };
    },
    components: { Item }
});
</script>

<style lang="scss" scoped>
.container {
    display: flex;
    flex-direction: column;
    height: 100%;
}
.calendar {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    margin-bottom: 30px;
    span {
        padding: 0px 30px 0 30px;
    }
    span {
        display: block;
        cursor: pointer;
        user-select: none;
    }
    i {
        color: #6b8bf1;
    }
    .prve {
        color: #6b8bf1;
        display: block;
        width: 20px;
    }
    .next {
        color: #6b8bf1;
        display: block;
        width: 20px;
    }
}
.list {
    flex: 1;
    flex-grow: 1;
    display: flex;
    .stay-on-course-container {
        display: flex;
        width: 100%;
        height: 100%;
        padding: 0 15px;
        box-sizing: border-box;
        flex: 1;
        overflow-x: auto;
        overflow-y: hidden;
    }
}
</style>
