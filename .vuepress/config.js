const {
    description
} = require('../package')

module.exports = {
    head: [
        ['meta', {
            name: 'theme-color',
            content: '#3eaf7c'
        }],
        ['meta', {
            name: 'apple-mobile-web-app-capable',
            content: 'yes'
        }],
        ['meta', {
            name: 'apple-mobile-web-app-status-bar-style',
            content: 'black'
        }],
        ["link", {
            rel: "'stylesheet",
            href: "/styles/website.css"
        },]
    ],
    locales: {
        '/': {
            lang: 'zh-CN',
            title: 'OpenCore安装指南',
            description: '中文版OpenCore安装指南 - Ver.0.8.8'
        },
        '/zh/': {
            lang: 'en-US',
            title: 'OpenCore Install Guide',
            description: 'OpenCore Install Guide'
        },
    },

    base: '/OpenCore-Install-Guide/',

    watch: {
        $page(newPage, oldPage) {
            if (newPage.key !== oldPage.key) {
                requestAnimationFrame(() => {
                    if (this.$route.hash) {
                        const element = document.getElementById(this.$route.hash.slice(1));

                        if (element && element.scrollIntoView) {
                            element.scrollIntoView();
                        }
                    }
                });
            }
        }
    },

    markdown: {
        extendMarkdown: md => {
            md.use(require('markdown-it-multimd-table'), {
                rowspan: true,
            });
        }
    },

    theme: 'vuepress-theme-succinct',
    globalUIComponents: [
        'ThemeManager'
    ],

    themeConfig: {
        lastUpdated: true,//上次更新
        smoothScroll: true,//页面滚动
        repo: 'https://github.com/sumingyd/OpenCore-Install-Guide',
        editLinks: true,
        logo: '/homepage.png',
        locales: {
            '/': {
                label: '简体中文',
                selectText: '选择语言',
                ariaLabel: '选择语言',
                editLinkText: '在 GitHub 上编辑此页',
                lastUpdated: '上次更新',
                nav: [
                    {
                        text: '指南菜单',
                        items: [
                            {
                                text: 'OpenCore安装',
                                link: 'https://sumingyd.github.io/OpenCore-Install-Guide/'
                            },
                            {
                                text: 'OpenCore安装后',
                                link: 'https://sumingyd.github.io/OpenCore-Post-Install/'
                            },
                            {
                                text: 'OpenCore多重引导',
                                link: 'https://sumingyd.github.io/OpenCore-Multiboot/'
                            },
                            {
                                text: '开始使用ACPI',
                                link: 'https://sumingyd.github.io/Getting-Started-With-ACPI/'
                            },
                            {
                                text: '无线购买指南',
                                link: 'https://sumingyd.github.io/Wireless-Buyers-Guide/'
                            },
                            {
                                text: '显卡购买指南',
                                link: 'https://sumingyd.github.io/GPU-Buyers-Guide/'
                            },
                            {
                                text: '避免购买指南',
                                link: 'https://sumingyd.github.io/Anti-Hackintosh-Buyers-Guide/'
                            },
                        ]
                    },
                    { text: 'QQ群', link: 'https://jq.qq.com/?_wv=1027&k=liYHt5VH' },
                ],
                sidebar: [
                    {
                        title: '介绍',
                        collapsable: false,
                        sidebarDepth: 1,
                        children: [
                            'prerequisites',
                            'macos-limits',
                            'find-hardware',
                            'terminology',
                            'why-oc',
                        ]
                    },
                    {
                        title: '制作引导U盘',
                        collapsable: false,
                        sidebarDepth: 2,
                        children: [{
                            title: '制作引导U盘',
                            collapsable: true,
                            path: '/installer-guide/',
                            sidebarDepth: 1,
                            children: [
                                '/installer-guide/mac-install',
                                '/installer-guide/windows-install',
                                '/installer-guide/linux-install',
                            ],
                        },
                            '/installer-guide/opencore-efi',
                            'ktext',
                        ['https://sumingyd.github.io/Getting-Started-With-ACPI/', 'ACPI入门'],
                            '/config.plist/',
                        ]
                    },
                    {
                        title: '配置',
                        collapsable: false,
                        children: [{
                            title: 'Intel 台式电脑配置文件',
                            collapsable: true,
                            sidebarDepth: 1,
                            children: [
                                ['/config.plist/penryn', 'Penryn'],
                                ['/config.plist/clarkdale', 'Clarkdale'],
                                ['/config.plist/sandy-bridge', 'Sandy Bridge'],
                                ['/config.plist/ivy-bridge', 'Ivy Bridge'],
                                ['/config.plist/haswell', 'Haswell'],
                                ['/config.plist/skylake', 'Skylake'],
                                ['/config.plist/kaby-lake', 'Kaby Lake'],
                                ['/config.plist/coffee-lake', 'Coffee Lake'],
                                ['/config.plist/comet-lake', 'Comet Lake'],
                            ]
                        },
                        {
                            title: 'Intel 笔记本电脑配置文件',
                            collapsable: true,
                            sidebarDepth: 1,
                            children: [
                                ['/config-laptop.plist/arrandale', 'Arrandale'],
                                ['/config-laptop.plist/sandy-bridge', 'Sandy Bridge'],
                                ['/config-laptop.plist/ivy-bridge', 'Ivy Bridge'],
                                ['/config-laptop.plist/haswell', 'Haswell'],
                                ['/config-laptop.plist/broadwell', 'Broadwell'],
                                ['/config-laptop.plist/skylake', 'Skylake'],
                                ['/config-laptop.plist/kaby-lake', 'Kaby Lake'],
                                ['/config-laptop.plist/coffee-lake', 'Coffee Lake and Whiskey Lake'],
                                ['/config-laptop.plist/coffee-lake-plus', 'Coffee Lake Plus and Comet Lake'],
                                ['/config-laptop.plist/icelake', 'Ice Lake'],
                            ]
                        },
                        {
                            title: 'Intel HEDT配置文件',
                            collapsable: true,
                            sidebarDepth: 1,
                            children: [
                                '/config-HEDT/nehalem',
                                '/config-HEDT/ivy-bridge-e',
                                '/config-HEDT/haswell-e',
                                '/config-HEDT/broadwell-e',
                                '/config-HEDT/skylake-x',
                            ]
                        },
                        {
                            title: 'AMD 台式电脑配置文件',
                            collapsable: true,
                            sidebarDepth: 1,
                            children: [
                                '/AMD/fx',
                                '/AMD/zen',
                            ]
                        },
                        ['/config.plist/security', '苹果安全启动']
                        ]
                    },
                    {
                        title: '安装',
                        collapsable: false,
                        children: [
                            '/installation/installation-process',

                        ]
                    },
                    {
                        title: '故障诊断',
                        collapsable: false,
                        children: [
                            '/troubleshooting/troubleshooting',
                            {
                                title: '',
                                collapsable: false,
                                children: [
                                    '/troubleshooting/extended/opencore-issues',
                                    '/troubleshooting/extended/kernel-issues',
                                    '/troubleshooting/extended/userspace-issues',
                                    '/troubleshooting/extended/post-issues',
                                    '/troubleshooting/extended/misc-issues',

                                ]
                            },
                            '/troubleshooting/debug',
                            '/troubleshooting/boot',
                            '/troubleshooting/kernel-debugging',
                        ]
                    },
                    {
                        title: '安装后',
                        collapsable: false,
                        children: [
                            ['https://sumingyd.github.io/OpenCore-Post-Install/', '安装后'],
                            {
                                title: '通用',
                                collapsable: true,
                                sidebarDepth: 1,
                                children: [
                                    ['https://sumingyd.github.io/OpenCore-Post-Install/universal/security', '安全与文件库'],
                                    ['https://sumingyd.github.io/OpenCore-Post-Install/universal/audio', '修复音频'],
                                    ['https://sumingyd.github.io/OpenCore-Post-Install/universal/oc2hdd', '无 USB 引导'],
                                    ['https://sumingyd.github.io/OpenCore-Post-Install/universal/update', '更新 OpenCore、kext 和 macOS'],
                                    ['https://sumingyd.github.io/OpenCore-Post-Install/universal/drm', '修复 DRM'],
                                    ['https://sumingyd.github.io/OpenCore-Post-Install/universal/iservices', '修复 iServices'],
                                    ['https://sumingyd.github.io/OpenCore-Post-Install/universal/pm', '修复电源管理'],
                                    ['https://sumingyd.github.io/OpenCore-Post-Install/universal/sleep', '修复睡眠'],
                                    ['https://sumingyd.github.io/OpenCore-Post-Install/usb/', '修复 USB'],
                                ]
                            },
                            {
                                title: '笔记本电脑',
                                collapsable: true,
                                children: [
                                    ['https://sumingyd.github.io/OpenCore-Post-Install/laptop-specific/battery', '修复电池读数'],

                                ]
                            },
                            {
                                title: '美化',
                                collapsable: true,
                                children: [
                                    ['https://sumingyd.github.io/OpenCore-Post-Install/cosmetic/verbose', '修复分辨率和啰嗦模式'],
                                    ['https://sumingyd.github.io/OpenCore-Post-Install/cosmetic/gui', '添加GUI和开机铃声'],
                                ]
                            },
                            {
                                title: '多引导',
                                collapsable: true,
                                children: [
                                    ['https://sumingyd.github.io/OpenCore-Multiboot/', 'OpenCore多引导'],
                                    ['https://sumingyd.github.io/OpenCore-Post-Install/multiboot/bootstrap', '设置启动选项'],
                                    ['https://sumingyd.github.io/OpenCore-Post-Install/multiboot/bootcamp', '安装Boot Camp'],
                                ]
                            },
                            {
                                title: '其他',
                                collapsable: true,
                                children: [
                                    ['https://sumingyd.github.io/OpenCore-Post-Install/misc/rtc', '修复 RTC'],
                                    ['https://sumingyd.github.io/OpenCore-Post-Install/misc/msr-lock', '修复 CFG Lock'],
                                    ['https://sumingyd.github.io/OpenCore-Post-Install/misc/nvram', '模拟NVRAM'],
                                ]
                            },
                        ]
                    },
                    {
                        title: '额外',
                        collapsable: false,
                        sidebarDepth: 2,
                        children: [
                            '/extras/kaslr-fix',
                            '/extras/spoof',
                            '/extras/ventura',
                            ['https://github.com/sumingyd/OpenCore-Install-Guide/tree/master/clover-conversion', 'Clover 的转换（建设中）'],
                            '/extras/smbios-support.md',
                        ]
                    },
                    {
                        title: '其他',
                        collapsable: false,
                        children: [
                            'CONTRIBUTING',
                            '/misc/credit',
                        ]
                    },
                ],
            },
            '/zh/': {
                label: 'English',
                selectText: 'Languages',
                ariaLabel: 'Select language',
                editLinkText: 'Edit this page on GitHub',
                lastUpdated: 'Last Updated',
            },
        }

    },
    plugins: [
        ['@vuepress/back-to-top', true],//开启右下角返回顶层图标
        ['@vuepress/nprogress', true],//这个插件将会在你切换页面的时候，在顶部显示进度条。
        ['vuepress-plugin-smooth-scroll', true],//在你的 VuePress 站点中使用平滑滚动。
        ['vuepress-plugin-fulltext-search', true],//基于 Headers 的搜索插件
        ['@vuepress/medium-zoom', {
            selector: ".theme-succinct-content :not(a) > img",
            options: {
                background: 'var(--bodyBgColor)'
            }
        }
        ],//这个插件将会使你的图片支持点击缩放。
        ['@vuepress/active-header-links', {
            sidebarLinkSelector: '.sidebar-link',
            headerAnchorSelector: '.header-anchor'
        }
        ],//页面滚动时自动激活侧边栏链接的插件
    ]
}
