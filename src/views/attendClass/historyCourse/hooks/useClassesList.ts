import { CourseBag } from "@/api";
import { get, STORAGE_TYPES } from "@/utils/storage";
import moment from "moment";
import { reactive, ref } from "vue";
import { fetchTeacherHistoryClasses } from "../../api";

export default () => {
    const search = reactive({
        dateRange: [
            moment().weekday(1).format("YYYY-MM-DD"),
            moment().weekday(7).format("YYYY-MM-DD")
        ],
        subject: "",
        class: ""
    });
    const page = reactive({
        pageNumber: 1, // 当前页
        pageSize: 10, // 每页显示数据
        pageChoose: [10, 20, 30], // 分页配置
        total: 0 // 总数据
    });
    const subjectList = ref([{ Name: "全部科目", ID: "" }]);
    const classList = ref([{ Name: "全部班级", ID: "" }]);
    const tableAllData = ref<CourseBag[]>([]);
    const tableData = ref<CourseBag[]>([]);

    subjectList.value = subjectList.value.concat(get(STORAGE_TYPES.USER_INFO).Subjects);
    classList.value = classList.value.concat(get(STORAGE_TYPES.USER_INFO).Classes);

    const getTeacherHistoryClasses = async () => {
        const data = {
            startTime: search.dateRange
                ? search.dateRange[0]
                : "",
            endTime: search.dateRange ? search.dateRange[1] : "",
            subjectID: search.subject,
            classID: search.class,
            pager: { ...page }
        };
        const res = await fetchTeacherHistoryClasses(data);
        if (res.resultCode === 200) {
            const { list, pager: { Total } } = res.result;
            tableAllData.value = list;
            tableData.value = tableAllData.value.slice(0, 10);
            page.total = Total;
        }
    };

    getTeacherHistoryClasses();

    const onQuery = () => {
        page.pageNumber = 1;
        page.pageSize = 10;
        getTeacherHistoryClasses();
    };

    const handleSizeChange = (v: number) => {
        page.pageSize = v;
        tableData.value = tableAllData.value.slice(
            (page.pageNumber - 1) * page.pageSize,
            (page.pageNumber - 1) * page.pageSize + 10
        );
    };

    const handleCurrentChange = (v: number) => {
        page.pageNumber = v;
        tableData.value = tableAllData.value.slice(
            (page.pageNumber - 1) * page.pageSize,
            (page.pageNumber - 1) * page.pageSize + 10
        );
    };

    return {
        search,
        page,
        subjectList,
        classList,
        tableData,
        handleSizeChange,
        handleCurrentChange,
        getTeacherHistoryClasses,
        onQuery
    };
};
