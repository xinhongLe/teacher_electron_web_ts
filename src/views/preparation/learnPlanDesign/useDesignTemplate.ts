import {reactive, ref, getCurrentInstance, nextTick, computed} from "vue";
import {v4 as uuidv4} from "uuid";
import {convertToLetters} from "@/utils/common";
import {store} from "@/store";

export default (type: number) => {
    // 最后一页是第几页
    const lastPageNum = ref(1);
    const proxy = getCurrentInstance() as any;
    const currentDate = new Date();
    // 模板1信息
    const templateInfo = reactive({
        Title: "",//标题
        Class: "",
        Name: "",
        Time: "",
        Lesson: "",
        Learn: "",
        Zpoint: "",
        Npoint: ""
    });
    const templatePageData: any = ref([
        {
            Level: 1,
            Data: [
                {
                    Id: uuidv4(),
                    Level: 1,
                    Name: "基础训练",
                    Content: "",
                    ConHeight: type === 1 ? 202 : 162,
                    questionIds: []
                },
                {
                    Id: uuidv4(),
                    Level: 1,
                    Name: "尝试题",
                    Content: "",
                    ConHeight: type === 1 ? 202 : 162,
                    questionIds: []
                },
                {
                    Id: uuidv4(),
                    Level: 1,
                    Name: "当堂检测",
                    Content: "",
                    ConHeight: type === 1 ? 202 : 162,
                    questionIds: []
                },
                {
                    Id: uuidv4(),
                    Level: 1,
                    Name: "课后反思",
                    Content: "",
                    ConHeight: type === 1 ? 202 : 162,
                    questionIds: []
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
        data.forEach((item: any) => {
            item.Data.forEach((data: any) => {
                nextTick(() => {
                    if (proxy.refs['editerRef' + data.Id]) {
                        proxy.refs['editerRef' + data.Id][0].innerHTML = data.Content;
                    }
                })
            })
        })
    };
    const setFirseEditerCon = (page: any, level: number) => {
        page.Data.forEach((data: any) => {
            data.Level = level;
            nextTick(() => {
                if (proxy.refs['editerRef' + data.Id]) {
                    proxy.refs['editerRef' + data.Id][0].innerHTML = data.Content;
                }
            })
        })
    };
    // 获取edit内容
    const getEditer = (data: any, item: any, page: any) => {
        const contHeight = data.target.parentElement.offsetHeight + 50 + 24;
        item.ConHeight = contHeight + 2;
        // if (type == 1) {
        //     if (page.Level == 1) {
        //         item.ConHeight = item.ConHeight > 816 ? 816 : item.ConHeight
        //     } else {
        //         item.ConHeight = item.ConHeight > 1014 ? 1014 : item.ConHeight
        //     }
        // } else if (type == 2) {
        //     if (page.Level == 1) {
        //         item.ConHeight = item.ConHeight > 650 ? 650 : item.ConHeight
        //     } else {
        //         item.ConHeight = item.ConHeight > 1014 ? 1014 : item.ConHeight
        //     }
        // }
        item.Content = data.target.innerHTML;
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
                if (pageData.Level === 1) {
                    templatePageData.value = [{
                        Level: 1,
                        Data: []
                    }]
                } else {
                    templatePageData.value.splice(index, 1);
                }
            }
            watchLayoutChange();
        })
    };

    // 监听页面布局改变
    const watchLayoutChange = () => {

        console.log('监听布局改变', templatePageData.value);
        templatePageData.value.forEach((pageData: any, index: number) => {
            let allContentHeight = 0;
            const topHeight = pageData.Level === 1 ? currentPageLayout.basicTopHeight : 0;
            const basicPageHeight = pageData.Level === 1 ? currentPageLayout.basicPageHeight : 1024;
            pageData.Data.forEach((item: any) => {
                // if (item.ConHeight + topHeight > basicPageHeight){
                //     allContentHeight
                // }
                if (type == 1) {
                    if (pageData.Level == 1) {
                        item.ConHeight = item.ConHeight > 816 ? 816 : item.ConHeight
                    } else {
                        item.ConHeight = item.ConHeight > 1014 ? 1014 : item.ConHeight
                    }
                } else if (type == 2) {
                    if (pageData.Level == 1) {
                        item.ConHeight = item.ConHeight > 650 ? 650 : item.ConHeight
                    } else {
                        item.ConHeight = item.ConHeight > 1014 ? 1014 : item.ConHeight
                    }
                }
                allContentHeight += item.ConHeight;
            })
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
                        setFirseEditerCon(item, pageData.Level)
                    }
                })
                watchLayoutChange()
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
                    templatePageData.value.forEach((item: any) => {
                        if (item.Level !== pageData.Level) {
                            setFirseEditerCon(item, pageData.Level)
                        }
                    })
                }
            }
        });
        lastPageNum.value = templatePageData.value.length;
    };

    let questionString: string = "";
    let questionIds: string[] = [];
    const setQuestionItem = (questions: any) => {
        const getQuestionString = (que: any) => {
            que.forEach((item: any, index: number) => {
                let title = item.Title;
                // title = title.replace(/\\\(/g, "").replace(/\\\)/g, "")
                let options = "";
                if (item.QuestionOptions.length) {
                    item.QuestionOptions.forEach((item: any, index: number) => {
                        if (!item.OptionContent) return;
                        options += `<div>${convertToLetters(index + 1)}.${item.OptionContent}</div> `
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
                if (item.ChildrenQuestions?.length) {
                    getQuestionString(item.ChildrenQuestions)
                }
                if (!questionIds.includes(item?.Id)) {
                    questionIds.push(item?.Id)
                }
            })
        }
        getQuestionString(questions)

        nextTick(() => {
            proxy.refs['editerRef' + currentAddItems.value.Id][0].innerHTML = currentAddItems.value.Content + questionString;
            nextTick(() => {
                (window as any).MathJax?.Hub.Queue(['Typeset', (window as any).MathJax.Hub, proxy.refs['editerRef' + currentAddItems.value.Id][0], () => {
                    // 渲染完成的回调函数
                    // 可以在这里执行其他代码
                }]);
            });
            const imgData = proxy.refs['editerRef' + currentAddItems.value.Id][0].querySelectorAll('img');
            imgData?.forEach((item: any) => {
                item.style.maxWidth = "100%";
                item.style.height = "auto";
            })
            templatePageData.value.forEach((item: any) => {
                const index = item.Data.indexOf(currentAddItems.value);
                if (index > -1) {
                    item.Data[index].Content = currentAddItems.value.Content + questionString;
                    item.Data[index].questionIds = questionIds;
                    setTimeout(() => {
                        item.Data[index].ConHeight = proxy.refs['editerRef' + currentAddItems.value.Id][0].offsetHeight + 74;
                    }, 50)
                }
            });
            setTimeout(() => {
                watchLayoutChange();
                questionString = "";
                questionIds = []
            }, 100)
        })
    };
    // 处理返回来的详情格式
    const formateLearningGuidDetail = (data: any, type: number) => {
        const learningGuidDetail = data;
        let baseInfo: any = [];
        learningGuidDetail.forEach((item: any) => {
            if (item.RowNumber === 1 && item.ColumnNumber === 1) {
                templateInfo.Title = item.Value
            }
            if (type == 1) {
                if (item.RowNumber === 3) {
                    templateInfo.Lesson = item.Value
                }
                if (item.RowNumber > 3) {
                    baseInfo.push(item);
                }
            } else if (type == 2) {
                switch (item.RowNumber) {
                    case 2:
                        templateInfo.Lesson = item.Value
                        break;
                    case 4:
                        templateInfo.Learn = item.Value
                        break;
                    case 5:
                        templateInfo.Zpoint = item.Value
                        break;
                    case 6:
                        templateInfo.Npoint = item.Value
                        break;
                }
                if (item.RowNumber > 6) {
                    baseInfo.push(item);
                }
            }

        })
        baseInfo = baseInfo.sort((a: any, b: any) => {
            return a.RowNumber - b.RowNumber
        }).map((item: any) => {
            return {
                Id: item.Id,
                Level: 1,
                Name: item.Key,
                Content: item.Value,
                ConHeight: item.Height,
                questionIds: item.QuestionIds
            }
        })
        templatePageData.value[0].Data = baseInfo;
        watchLayoutChange();
        nextTick(() => {
            setEditerCon(templatePageData.value);
        })
    }

    return {
        templatePageData,
        lastPageNum,
        currentAddItems,
        templateInfo,
        watchLayoutChange,
        setEditerCon,
        setFirseEditerCon,
        getEditer,
        addItem,
        delItem,
        setQuestionItem,
        formateLearningGuidDetail

    };
};
