import { BookList, Course, CourseBag } from "@/types/preparation";

// 过滤课包
export function teacherLessonAndBagFilter(arr: Course[]) {
    const newArr = arr.map((item) => {
        if (Array.isArray(item.CourseBags) && item.CourseBags.length === 0) {
            item.CourseBags.push({ Name: "无课包" });
        }
        return item;
    });

    // 查找所有克隆课包的ID
    // 克隆课包的标记是：CourseBagID不为空
    const courseBagIds: string[] = [];
    newArr.map((item) => {
        item.CourseBags.map((l) => {
            if (l.CourseBagID) {
                courseBagIds.push(l.CourseBagID as string);
            }
        });
    });
    // 筛选所有的克隆过的系统课包，并求掉
    const delbags: CourseBag[] = [];
    newArr.map((newArr) => {
        newArr.CourseBags.map((k) => {
            if (courseBagIds.includes(k.ID as string)) {
                delbags.push(k);
            }
        });
    });
    delbags.map((R) => {
        newArr.forEach((ele) => {
            const index = ele.CourseBags.indexOf(R);
            if (index > -1) {
                ele.CourseBags.splice(index, 1);
            }
        });
    });
    // 给克隆的系统课包赋值type为2
    newArr.forEach((m) => {
        m.CourseBags.forEach((n) => {
            n.Type = 2;
        });
    });
    return newArr;
}

export const findFirstId = (tree: BookList[], ids: string[]) => {
    tree.forEach((item) => {
        ids.push(item.Value);
        if (item.Children && item.Children.length > 0) {
            findFirstId([item.Children[0]], ids);
        }
    });
};
