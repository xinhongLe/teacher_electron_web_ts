const { NormalModuleReplacementPlugin } = require("webpack");

const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const moment = require("moment");

const extraResources = process.platform === "darwin" ? [{
    from: "./extraResources/mac/ColorPicker",
    to: "ColorPicker"
}] : [{
    from: "./extraResources/win/mockingbot-color-picker-ia32.exe",
    to: "mockingbot-color-picker-ia32.exe"
}];

module.exports = {
    productionSourceMap: false,
    lintOnSave: false,
    pages: {
        index: {
            entry: "src/main.ts",
            template: "public/index.html"
        },
        suspension: {
            entry: "src/childWindow/suspension/main.ts",
            template: "public/index.html",
            filename: "suspension.html",
            chunks: ["suspension"]
        },
        unfoldSuspension: {
            entry: "src/childWindow/unfoldSuspension/main.ts",
            template: "public/index.html",
            filename: "unfoldSuspension.html",
            chunks: ["unfoldSuspension"]
        },
        timer: {
            entry: "src/childWindow/timer/main.ts",
            template: "public/index.html",
            filename: "timer.html",
            title: "计时器",
            chunks: ["timer"]
        },
        projection: {
            entry: "src/childWindow/projection/main.ts",
            template: "public/index.html",
            filename: "projection.html",
            title: "投影",
            chunks: ["projection"]
        },
        rollCall: {
            entry: "src/childWindow/rollCall/main.ts",
            template: "public/index.html",
            filename: "rollCall.html",
            title: "",
            chunks: ["rollCall"]
        },
        answerMachine: {
            entry: "src/childWindow/answerMachine/main.ts",
            template: "public/index.html",
            filename: "answerMachine.html",
            title: "",
            chunks: ["answerMachine"]
        },
        blackboard: {
            entry: "src/childWindow/blackboard/main.ts",
            template: "public/index.html",
            filename: "blackboard.html",
            title: "教学黑板",
            chunks: ["blackboard"]
        }
    },
    css: {
        loaderOptions: {
            scss: {
                prependData: `
                    @import "~@/styles/mixin.scss";
                `
            }
        }
    },
    configureWebpack: {
        devtool: "source-map",
        module: {
            rules: [
                {
                    test: /\.node$/,
                    loader: "native-ext-loader",
                    options: {
                        rewritePath: process.env.NODE_ENV === "production" ? process.platform === "win32" ? "./resources" : "../Resources" : "./node_modules/trtc-electron-sdk/build/Release" // 打包腾讯实时音视频sdk
                    }
                }
            ]
        },
        plugins: [
            /**
             * 查看包大小
             */
            // new BundleAnalyzerPlugin()
            new NormalModuleReplacementPlugin(
                /element-plus[\\/\\]lib[\\/\\]locale[\\/\\]lang[\\/\\]en/,
                "element-plus/lib/locale/lang/zh-cn"
            )
        ]
    },
    chainWebpack(config) {
        config.optimization.splitChunks({
            cacheGroups: {
                suspension: {
                    name: "suspension",
                    priority: 10,
                    test: "src/childWindow/suspension/main.ts"
                },
                unfoldSuspension: {
                    name: "unfoldSuspension",
                    priority: 10,
                    test: "src/childWindow/unfoldSuspension/main.ts"
                },
                projection: {
                    name: "projection",
                    priority: 10,
                    test: "src/childWindow/projection/main.ts"
                },
                rollCall: {
                    name: "rollCall",
                    priority: 10,
                    test: "src/childWindow/rollCall/main.ts"
                },
                answerMachine: {
                    name: "answerMachine",
                    priority: 10,
                    test: "src/childWindow/answerMachine/main.ts"
                },
                blackboard: {
                    name: "blackboard",
                    priority: 10,
                    test: "src/childWindow/blackboard/main.ts"
                },
                timer: {
                    name: "timer",
                    priority: 10,
                    test: "src/childWindow/timer/main.ts"
                }
            }
        });
        config.module
            .rule("url-loader")
            .test(/\.(cur)(\?.*)?$/)
            .use("url-loader")
            .loader("url-loader")
            .end();
    },
    pwa: {
        iconPaths: {
            favicon32: "favicon.ico",
            favicon16: "favicon.ico",
            appleTouchIcon: "favicon.ico",
            maskIcon: "favicon.ico",
            msTileImage: "favicon.ico"
        }
    },
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            mainProcessFile: "electron/background.ts",
            preload: { preload: "electron/preload.ts" },
            mainProcessWatch: ["electron/**/*"],
            files: ["dist_electron/**/*"],
            builderOptions: {
                appId: "com.leyixue.teacher",
                productName: "爱学仕校园教师端", // 项目名
                copyright: "Copyright © 2021", // 版权信息
                artifactName: "${productName}-${version}-" + moment().format("YYYYMMDDHHmm") + ".${ext}",
                directories: {
                    output: "./dist_electron" // 输出文件路径
                },
                asar: true,
                files: ["**/*", "public/*"],
                publish: [
                    {
                        provider: "generic",
                        url: "" // 更新服务器地址,可为空
                    }
                ],
                afterPack: "./build/afterPack.js",
                extraResources: extraResources, // 拷贝静态文件到指定位置
                dmg: {
                    contents: [
                        {
                            x: 410,
                            y: 150,
                            type: "link",
                            path: "/Applications"
                        },
                        {
                            x: 130,
                            y: 150,
                            type: "file"
                        }
                    ]
                },
                nsis: {
                    oneClick: false, // 是否一键安装
                    allowElevation: true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
                    allowToChangeInstallationDirectory: true, // 允许修改安装目录
                    installerIcon: "./public/icon.ico", // 安装图标
                    uninstallerIcon: "./public/icon.ico", // 卸载图标
                    deleteAppDataOnUninstall: true,
                    installerHeaderIcon: "./public/icon.ico", // 安装时头部图标
                    createDesktopShortcut: true, // 创建桌面图标
                    createStartMenuShortcut: true, // 创建开始菜单图标
                    shortcutName: "爱学仕校园教师端" // 图标名称
                },
                win: {
                    // win相关配置
                    icon: "./public/icon.ico", // 图标，当前图标在根目录下，注意这里有两个坑
                    target: [
                        {
                            target: "nsis", // 利用nsis制作安装程序
                            arch: [
                                // "x64", // 64位
                                "ia32" // 32位
                            ]
                        }
                    ],
                    extraFiles: [
                        {
                            from: "node_modules/trtc-electron-sdk/build/Release/",
                            to: "./resources",
                            filter: ["**/*"]
                        }
                    ]
                },
                mac: {
                    icon: "./public/icon.icns",
                    target: ["dmg", "zip"],
                    extraFiles: [
                        {
                            from: "node_modules/trtc-electron-sdk/build/Release/",
                            to: "./Resources",
                            filter: ["**/*"]
                        }
                    ]
                },
                extraFiles: [
                    "node_modules/trtc-electron-sdk/build/Release/trtc_electron_sdk.node"
                ]
            },
            externals: ["clipboard", "@microsoft/signalr"]
        }
    }
};
