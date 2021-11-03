import moment from "moment";
import { ref, onMounted } from "vue";

export default () => {
    const nowTime = ref("");
    const lateTime = ref("");
    const days = ref<string[]>([]);
    onMounted(() => {
        const currentDate = new Date();
        const weekOfDay = moment(currentDate, "YYYY-MM-DD").format("E"); // 计算今天是这周第几天
        const lastMonday = moment(currentDate)
            .subtract(Number(weekOfDay) - 1, "days")
            .format("YYYY-MM-DD"); // 周一日期
        nowTime.value = moment(lastMonday).format("YYYY年MM月DD日");
        lateTime.value = moment(lastMonday)
            .weekday(7)
            .format("YYYY年MM月DD日"); // 周日日期
    });

    const initDays = (cur?:Date) => {
        const date = moment(cur);
        let weekday = date.weekday();
        days.value = [];
        if (weekday === 0) {
            weekday = 7;
        }
        // 今天是周日，放在第一行第7个位置，前面6个 这里默认显示一周，如果需要显示一个月，则第二个循环为 i<= 35- this.currentWeek
        for (let i = weekday - 1; i >= 0; i -= 1) {
            const day = moment(date).date(date.date() - i).format("YYYY-MM-DD");
            days.value.push(day);
        }
        for (let i = 1; i <= 7 - weekday; i += 1) {
            const day = moment(date).date(date.date() + i).format("YYYY-MM-DD");
            days.value.push(day);
        }
    };

    const weekPre = () => {
        const day = new Date(days.value[0]);
        day.setDate(day.getDate() - 7);
        initDays(day);
        nowTime.value = moment(days.value[0]).format("YYYY年MM月DD日");
        lateTime.value = moment(days.value[6]).format("YYYY年MM月DD日");
    };

    const weekNext = () => {
        const day = new Date(days.value[6]);
        day.setDate(day.getDate() + 7);
        initDays(day);
        nowTime.value = moment(days.value[0]).format("YYYY年MM月DD日");
        lateTime.value = moment(days.value[6]).format("YYYY年MM月DD日");
    };

    const formTime = (val: string) => {
        return `${moment(val).format("MM月DD日")}`;
    };

    const formWeek = (val: number) => {
        const weekMap = {
            1: "一",
            2: "二",
            3: "三",
            4: "四",
            5: "五",
            6: "六",
            7: "日"
        } as Record<number, string>;
        return weekMap[val];
    };

    return {
        nowTime,
        lateTime,
        weekPre,
        weekNext,
        days,
        formTime,
        formWeek,
        initDays
    };
};
