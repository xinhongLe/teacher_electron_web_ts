import {reactive, ref, getCurrentInstance, nextTick} from "vue";
import {v4 as uuidv4} from "uuid";
import {convertToLetters} from "@/utils/common";

export default (type: number) => {
    // 最后一页是第几页
    const lastPageNum = ref(1);
    const proxy = getCurrentInstance() as any;
    const templatePageData: any = ref([
        {
            Level: 1,
            Data: [
                {
                    Id: uuidv4(),
                    Level: 1,
                    Name: "基础训练",
                    Content: "",
                    ConHeight: type === 1 ? 202 : 162
                },
                {
                    Id: uuidv4(),
                    Level: 1,
                    Name: "尝试题",
                    Content: "",
                    ConHeight: type === 1 ? 202 : 162

                },
                {
                    Id: uuidv4(),
                    Level: 1,
                    Name: "当堂检测",
                    Content: "",
                    ConHeight: type === 1 ? 202 : 162

                },
                {
                    Id: uuidv4(),
                    Level: 1,
                    Name: "课后反思",
                    Content: "",
                    ConHeight: type === 1 ? 202 : 162

                }
            ]
        }
    ]);
    // 计算页面高度所用盗的变量
    const currentPageLayout = reactive({
        basicPageHeight: type === 1 ? 956 : 964,//基础页面高度
        basicTopHeight: type === 1 ? 136 : 306,//第一页基本信息高度
    });
    // 当前要添加题目的一栏
    const currentAddItems: any = ref();
    // 统一设置 edit 回显内容
    const setEditerCon = (data: any) => {
        nextTick(() => {
            data.forEach((item: any) => {
                item.Data.forEach((data: any) => {
                    nextTick(() => {
                        proxy.refs['editerRef' + data.Id][0].innerHTML = data.Content;
                    })
                })
            })
        })
    };
    const setFirseEditerCon = (page: any) => {
        nextTick(() => {
            page.Data.forEach((data: any) => {
                data.Level = 1;
                nextTick(() => {
                    proxy.refs['editerRef' + data.Id][0].innerHTML = data.Content;
                })
            })
        })
    };
    // 获取edit内容
    const getEditer = (data: any, item: any, page: any) => {
        data.srcElement.style = "width:100%";
        const contHeight = data.target.parentElement.offsetHeight + 50 + 24;
        item.ConHeight = contHeight + 2;
        item.Content = data.target.innerHTML;
        console.log('data', data, item, page)
        watchLayoutChange();

    };
    // 新增一项
    const addItem = (item: any) => {
        item.Data?.push({
            Id: uuidv4(),
            Level: item.pageNum,
            Name: '默认课时',
            Content: "",
            ConHeight: type === 1 ? 202 : 162,
        });
        watchLayoutChange();

    };
    // 删除一项
    const delItem = (pageData: any, item: any, index: number) => {
        proxy.refs['editerRef' + item.Id][0].innerHTML = "";
        nextTick(() => {
            pageData?.Data.splice(pageData.Data.indexOf(item), 1);
            if (!pageData.Data.length) {
                templatePageData.value.splice(index, 1);
            }
            watchLayoutChange();
        })
    };

    // 监听页面布局改变
    const watchLayoutChange = () => {
        templatePageData.value.forEach((pageData: any, index: number) => {
            let allContentHeight = 0;
            pageData.Data.forEach((item: any) => {
                allContentHeight += item.ConHeight;
            })
            const topHeight = pageData.Level === 1 ? currentPageLayout.basicTopHeight : 0;
            const basicPageHeight = pageData.Level === 1 ? currentPageLayout.basicPageHeight : 1024
            if (allContentHeight + topHeight > basicPageHeight) {
                const data = pageData.Data.pop();
                if (!templatePageData.value[index + 1]) {
                    templatePageData.value.push(
                        {
                            Level: pageData.Level + 1,
                            Data: []
                        }
                    )
                    templatePageData.value[index + 1].Data?.push(data);

                } else {
                    templatePageData.value[index + 1].Data?.unshift(data);
                }
                templatePageData.value.forEach((item: any) => {
                    if (item.Level !== pageData.Level) {
                        setFirseEditerCon(item)
                    }
                })
            } else {
                const firstData = templatePageData.value[index + 1] ? templatePageData.value[index + 1].Data[0] : null;
                if (!firstData) return;
                if ((firstData.ConHeight + allContentHeight + topHeight) <= currentPageLayout.basicPageHeight) {
                    templatePageData.value[index + 1].Data.shift();
                    if (!templatePageData.value[index + 1].Data.length) {
                        templatePageData.value.splice(index + 1, 1);
                    }
                    templatePageData.value[index].Data.push(firstData);
                    nextTick(() => {
                        proxy.refs['editerRef' + firstData.Id][0].innerHTML = firstData.Content;
                    })
                }
            }
        });
        lastPageNum.value = templatePageData.value.length
    };
    // 设置题目
    const setQuestionItem = (questions: any) => {
        let questionString: string = "";
        questions.forEach((item: any, index: number) => {
            // let title = `${index + 1}、${item.Title}`;
            let title = `${item.Title}`;
            let options = "";
            if (item.QuestionOptions.length) {
                item.QuestionOptions.forEach((item: any, index: number) => {
                    if (!item.OptionContent) return;
                    options += `<div>${convertToLetters(index + 1)}、${item.OptionContent}</div> `
                })
            }
            const questionItemString =
                `${title}
                     <div><br/></div>
                     <div>
                     ${options}
                     </div>
                    `;
            questionString += questionItemString + '<div><br/></div>' + '\n';
        })
        nextTick(() => {
            proxy.refs['editerRef' + currentAddItems.value.Id][0].innerHTML = currentAddItems.value.Content + questionString;
            templatePageData.value.forEach((item: any) => {
                const index = item.Data.indexOf(currentAddItems.value);
                if (index > -1) {
                    item.Data[index].Content = currentAddItems.value.Content + questionString;
                    item.Data[index].ConHeight = proxy.refs['editerRef' + currentAddItems.value.Id][0].offsetHeight + 74;
                }
            });
            // 执行execCommand命令设置背景颜色为红色
            watchLayoutChange();
        })
    }

    return {
        templatePageData,
        lastPageNum,
        currentAddItems,
        watchLayoutChange,
        setEditerCon,
        setFirseEditerCon,
        getEditer,
        addItem,
        delItem,
        setQuestionItem

    };
};
