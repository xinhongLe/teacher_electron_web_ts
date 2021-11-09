import { store } from "@/store";
import { FetchTeacherListData, Teacher } from "@/types/myStudent";
import { ref, reactive } from "vue";
import { fetchTeacherList } from "../api";

export default () => {
    const formData = reactive({
        name: ""
    });

    const page = reactive({
        pageNumber: 1, // 当前页
        pageSize: 10, // 每页显示数据
        pageChoose: [10, 20, 30], // 分页配置
        total: 0 // 总数据
    });

    const tableData = ref<Teacher[]>([]);

    const getTeacherList = async () => {
        const data: FetchTeacherListData = {
            accountOrName: formData.name,
            teacherId: store.state.userInfo.id,
            pager: { ...page }
        };
        const res = await fetchTeacherList(data);
        if (res.resultCode === 200) {
            const { result: { list, pager: { Total } } } = res;
            tableData.value = list.map(item => ({
                ID: item.UserId,
                Name: item.UserName,
                ...item
            }));
            page.total = Total;
        }
    };

    const handleSizeChange = (pageSize: number) => {
        page.pageSize = pageSize;
        getTeacherList();
    };

    const handleCurrentChange = (pageNumber: number) => {
        page.pageNumber = pageNumber;
        getTeacherList();
    };

    return {
        formData,
        page,
        tableData,
        handleSizeChange,
        handleCurrentChange,
        getTeacherList
    };
};
