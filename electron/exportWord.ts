const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");

const fs = require("fs");
const path = require("path");
const __dirname = path.resolve();

const PATH = process.env.NODE_ENV === "development" ? path.resolve(__dirname, "./extraResources/exportWord/template.docx") : path.resolve(__dirname, "../template.docx");

const content = fs.readFileSync(PATH, "binary");

const zip = new PizZip(content);

const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true
});

doc.render({
    title: "第1课时 Comic strip&Welcome to the unit",
    list: [
        {
            title: "教材",
            contents: [
                {
                    content: "英语/译林版/八上"
                }
            ]
        },
        {
            title: "单元",
            contents: [
                {
                    content: "Unit 1 Friends"
                }
            ]
        },
        {
            title: "课时",
            contents: [
                {
                    content: "第一课时 Comic strip&Welcome to the unit"
                }
            ]
        },
        {
            title: "课型",
            contents: [
                {
                    content: "单元导入课"
                }
            ]
        },
        {
            title: "教材分析",
            contents: [
                {
                    content: "这是本单元的第一课时，通过Eddie和Hobo两只小狗之间的对话以及Daniel和Amy之间的谈话，呈现了描述人物品质的词汇并引导学生讨论朋友之间的重要品质。"
                }
            ]
        },
        {
            title: "教学目标",
            contents: [
                {
                    content: "To learn the key words and phrases: thirsty, honest, some more food"
                },
                {
                    content: "To learn the key sentences"
                },
                {
                    content: "To learn to talk about the important qualities in good friends"
                }
            ]
        },
        {
            title: "教学重点",
            contents: [
                {
                    content: "学生能够掌握讨论人物品质的单词以及相关句型。"
                }
            ]
        },
        {
            title: "教学难点",
            contents: [
                {
                    content: "学生能够使用上述语言讨论朋友之间的优秀品质。"
                }
            ]
        }
    ],
    cards: [
        {
            title: "环节一：Lead in",
            pages: [
                {
                    title: "1.Free talk",
                    processes: [
                        {
                            process: "教师以自由谈话的方式直接导入主题，学生自由讨论。"
                        }
                    ],
                    designs: [
                        {
                            design: "问题的设置贴近学生生活，能够在唤醒学生对已学知识的记忆的同时，有效激发学生的思维和兴趣，为接下来的课程作铺垫。"
                        }
                    ]
                },
                {
                    title: "2.Let’s Learn",
                    processes: [
                        {
                            process: "教师创设情境，通过图片和文字解释引入新词。"
                        },
                        {
                            process: "教师可引导学生先行通过图片以及文字提示猜测标蓝文字的含义并教学新词。"
                        }
                    ],
                    designs: [
                        {
                            design: "通过图文的方式引出本堂课的重点单词，让学生能在场景中感知词汇含义，为后续阅读扫清障碍。"
                        }
                    ]
                }
            ]
        },
        {
            title: "环节二：Comic strip",
            pages: [
                {
                    title: "1.Watch and answer",
                    processes: [
                        {
                            process: "教师导入背景。"
                        },
                        {
                            process: "学生看视频回答问题，教师核对答案。"
                        }
                    ],
                    designs: [
                        {
                            design: "学生带着任务观看视频，锻炼学生获取文章大意的能力，同时通过回答问题能让学生增加对课文的理解。"
                        }
                    ]
                },
                {
                    title: "2.Learn the dialogues",
                    processes: [
                        {
                            process: "教师讲解标蓝单词的含义，点击绿框讲解知识点。"
                        },
                        {
                            process: "可点击音频学生跟读。"
                        }
                    ],
                    designs: [
                        {
                            design: "讲解对话内容及知识点，确保学生理解对话内容，帮助学生提高阅读能力。"
                        }
                    ]
                },
                {
                    title: "3.Watch and repeat",
                    processes: [
                        {
                            process: "教师播放视频，学生跟读视频。"
                        }
                    ],
                    designs: [
                        {
                            design: "通过朗读学生再次巩固对话内容，为学生提供了准确、地道的语言模拟标准，有助于培养学生的语感。"
                        }
                    ]
                }
            ]
        }
    ],
    list2: [
        {
            title: "教学反思",
            contents: [
                {
                    content: "教学反思"
                }
            ]
        }
    ]
});

const buf = doc.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE"
});

export const exportWord = (filePath:string) => {
    fs.writeFileSync(path.resolve(filePath), buf);
};
