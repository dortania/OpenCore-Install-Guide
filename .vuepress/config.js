const {
    description
} = require('../package')

module.exports = {
    /**
     * Ref：https://v1.vuepress.vuejs.org/config/#title
     */
    title: 'OpenCore Install Guide',
    /**
     * Ref：https://v1.vuepress.vuejs.org/config/#description
     */
    description: description,

    /**
     * Extra tags to be injected to the page HTML `<head>`
     *
     * ref：https://v1.vuepress.vuejs.org/config/#head
     */
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
    base: '/OpenCore-Install-Guide/',
	
	markdown: {
		extendMarkdown: md => {
			md.use(require('markdown-it-multimd-table'), {
				rowspan: true,
			});
		}
	},


    /**
     * Theme configuration, here is the default theme configuration for VuePress.
     *
     * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
     */
    theme: 'vuepress-theme-succinct',
    globalUIComponents: [
        'ThemeManager'
    ],

    themeConfig: {
        lastUpdated: true,
        repo: 'https://github.com/dortania/OpenCore-Install-Guide',
        editLinks: false,
        docsDir: '',
        editLinkText: '',
        logo: '/homepage.png',
        nav: [{
            text: 'Dortania Guides',
            ariaLabel: 'Language Menu',
            items: [{
                text: 'Home Site',
                link: 'https://dortania.github.io/'
            },
            {
                text: 'Getting Started With ACPI',
                link: 'https://dortania.github.io/Getting-Started-With-ACPI/'
            },
            {
                text: 'OpenCore Post-Install',
                link: 'https://dortania.github.io/OpenCore-Post-Install/'
            },
            {
                text: 'GPU Buyers Guide',
                link: 'https://dortania.github.io/GPU-Buyers-Guide/'
            },
            {
                text: 'Wireless Buyers Guide',
                link: 'https://dortania.github.io/Wireless-Buyers-Guide/'
            },
            {
                text: 'Anti Buyers Guide',
                link: 'https://dortania.github.io/Anti-Hackintosh-Buyers-Guide/'
            },
            ]
        },
            /*
              {
                text: 'Github',
                link: 'https://github.com/dortania/OpenCore-Install-Guide'
              }
            */
        ],
        sidebar: [{
            title: 'Introduction',
            collapsable: false,
            sidebarDepth: 1,
            children: [
                '',
				['prerequisites', 'Getting started with OpenCore'],
				'macos-limits',
                'terminology',
                'why-oc',
            ]

        },
        {
            title: 'USB Creation',
            collapsable: false,
            sidebarDepth: 2,
            children: [{
                title: 'Creating the USB',
                collapsable: true,
                path: '/installer-guide/',
                sidebarDepth: 2,
                children: [
                    '/installer-guide/mac-install',
                    '/installer-guide/winblows-install',
                    '/installer-guide/linux-install',
                ],
            },
                '/installer-guide/opencore-efi',
                'ktext',
            ['https://dortania.github.io/Getting-Started-With-ACPI/', 'Getting started with ACPI'],
                '/config.plist/',
            ]
        },
        {
            title: 'Configs',
            collapsable: false,
            children: [{
                title: 'Intel Desktop config.plist',
                collapsable: true,
				sidebarDepth: 1,
                children: [
                    ['/config.plist/ivy-bridge', 'Ivy Bridge'],
                    ['/config.plist/haswell', 'Haswell'],
                    ['/config.plist/skylake', 'Skylake'],
                    ['/config.plist/kaby-lake', 'Kaby Lake'],
                    ['/config.plist/coffee-lake', 'Coffee Lake'],
                    ['/config.plist/comet-lake', 'Comet Lake'],
                ]
            },
            {
                title: 'Intel Laptop config.plist',
                collapsable: true,
				sidebarDepth: 1,
                children: [
                    ['/config-laptop.plist/ivy-bridge', 'Ivy Bridge'],
                    ['/config-laptop.plist/haswell', 'Haswell'],
					['/config-laptop.plist/broadwell', 'Broadwell'],
                    ['/config-laptop.plist/skylake', 'Skylake'],
                    ['/config-laptop.plist/kaby-lake', 'Kaby Lake'],
                    ['/config-laptop.plist/coffee-lake', 'Coffee Lake'],
					['/config-laptop.plist/coffee-lake-plus', 'Coffee Lake Plus'],
                    ['/config-laptop.plist/icelake', 'Ice Lake'],
                ]
            },
            {
                title: 'Intel HEDT config.plist',
                collapsable: true,
				sidebarDepth: 1,
                children: [
                    '/config-HEDT/haswell-e',
                    '/config-HEDT/broadwell-e',
                    '/config-HEDT/skylake-x',
                ]
            },
            {
                title: 'AMD Desktop config.plist',
                collapsable: true,
				sidebarDepth: 1,
                children: [
                    '/AMD/fx',
                    '/AMD/zen',
                ]
            },
            {
                title: 'Intel Legacy config.plist',
                collapsable: true,
                children: [
                    '/config.plist/legacy',
		            {
		                title: 'Legacy Generation',
		                collapsable: false,
		                children: [
		                    ['/config.plist/legacy/penryn', 'Penryn'],
							['/config.plist/legacy/nehalem', 'Nehalem'],
							['/config.plist/legacy/sandy-bridge', 'Sandy Bridge'],
							['/config.plist/legacy/sandy-bridge-e', 'Sandy/Ivy Bridge-E'],
		                ]
		            },
                ]
            },
            ]
        },
        {
            title: 'Installation',
            collapsable: false,
            children: [
                '/installation/installation-process',

            ]
        },
        {
            title: 'Troubleshooting',
            collapsable: true,
            children: [
                '/troubleshooting/troubleshooting',
                '/troubleshooting/debug',
                '/troubleshooting/boot',
            ]
        },
        {
            title: 'Post Install',
            collapsable: false,
            children: [
                ['https://dortania.github.io/OpenCore-Post-Install/', 'Post-Install'],
                {
                    title: 'Universal',
                    collapsable: true,
                    sidebarDepth: 1,
                    children: [
                        ['https://dortania.github.io/OpenCore-Post-Install/universal/security', 'Security and FileVault'],
                        ['https://dortania.github.io/OpenCore-Post-Install/universal/audio', 'Fixing Audio'],
                        ['https://dortania.github.io/OpenCore-Post-Install/universal/oc2hdd', 'Booting without USB'],
                        ['https://dortania.github.io/OpenCore-Post-Install/universal/update', 'Updating OpenCore, kexts and macOS'],
                        ['https://dortania.github.io/OpenCore-Post-Install/universal/drm', 'Fixing DRM'],
                        ['https://dortania.github.io/OpenCore-Post-Install/universal/iservices', 'Fixing iServices'],
                        ['https://dortania.github.io/OpenCore-Post-Install/universal/pm', 'Fixing Power Management'],
                        ['https://dortania.github.io/OpenCore-Post-Install/universal/sleep', 'Fixing Sleep'],
                        ['https://dortania.github.io/OpenCore-Post-Install/usb/', 'Fixing USB'],
                    ]
                },
                {
                    title: 'Laptop Specifics',
                    collapsable: true,
                    children: [
                        ['https://dortania.github.io/OpenCore-Post-Install/laptop-specific/battery', 'Fixing Battery Read-outs'],

                    ]
                },
                {
                    title: 'Cosmetics',
                    collapsable: true,
                    children: [
                        ['https://dortania.github.io/OpenCore-Post-Install/cosmetic/verbose', 'Fixing Resolution and Verbose'],
                        ['https://dortania.github.io/OpenCore-Post-Install/cosmetic/gui', 'Add GUI and Boot-chime'],
                    ]
                },
                {
                    title: 'Multiboot',
                    collapsable: true,
                    children: [
                        ['https://dortania.github.io/OpenCore-Post-Install/multiboot/bootstrap', 'Setting up Bootstrap.efi'],
                        ['https://dortania.github.io/OpenCore-Post-Install/multiboot/bootcamp', 'Installing BootCamp'],
                    ]
                },
                {
                    title: 'Miscellaneous',
                    collapsable: true,
                    children: [
                        ['https://dortania.github.io/OpenCore-Post-Install/misc/rtc', 'Fixing RTC'],
                        ['https://dortania.github.io/OpenCore-Post-Install/misc/msr-lock', 'Fixing CFG Lock'],
                        ['https://dortania.github.io/OpenCore-Post-Install/misc/nvram', 'Emulated NVRAM'],
                    ]
                },
            ]
        },
        {
            title: 'Extras',
            collapsable: true,
            children: [
                '/extras/legacy',
                '/extras/gpu-patches',
                '/extras/kaslr-fix',
                '/extras/spoof',
                '/extras/big-sur/',
                ['https://github.com/dortania/OpenCore-Install-Guide/tree/master/clover-conversion', 'Clover Conversion'],
            ]
        },
        {
            title: 'Misc',
            collapsable: false,
            children: [
                'CONTRIBUTING',
                '/misc/credit',
            ]
        },
        ],
    },

    /**
     * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
     */
    plugins: [
        '@vuepress/plugin-back-to-top',
        'vuepress-plugin-smooth-scroll',
        ['vuepress-plugin-medium-zoom',
            {
                selector: "img",
                options: {
                    background: 'var(--bodyBgColor)'
                }
            }],
    ]
}