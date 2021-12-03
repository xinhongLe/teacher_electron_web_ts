module.exports = {
    productionSourceMap: false,
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
            mainProcessFile: "electron/background.js",
            preload: { preload: "electron/preload.js" },
            files: ["dist_electron/**/*"],
            builderOptions: {
                appId: "com.leyixue.teacher",
                productName: "爱学仕校园教师端", // 项目名
                copyright: "Copyright © 2021", // 版权信息
                directories: {
                    output: "./dist_electron" // 输出文件路径
                },
                asar: false,
                files: ["**/*", "public/*"],
                publish: [
                    {
                        provider: "generic",
                        url: "" // 更新服务器地址,可为空
                    }
                ],
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
                                "x64", // 64位
                                "ia32" // 32位
                            ]
                        }
                    ]
                },
                mac: {
                    icon: "./public/icon.icns",
                    target: ["dmg", "zip"]
                }
            }
        }
    }
};
