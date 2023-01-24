# 支持指南

**注意**: 这是一个社区运行指南，没有被Acidanthera官方认可。请不要用关于本指南的问题来烦扰Acidanthera。

想帮助支持指南吗?有一些方法你可以提供帮助!

[[toc]]

注意:对于那些想要在经济上做出贡献的人，我们非常感谢，但我们是一个非营利组织。我们这样做是为了教学，不是为了赚钱。如果你有剩余的钱，我们强烈建议你捐给慈善机构。

## 通过issue进行贡献

 通过Issues进行贡献非常简单，但也有一些规则:

* 将issues选项卡保留为指南问题，**禁止个人hackintosh问题**。这里不是讨论安装问题的地方。
* 如果为了更好地说明错误，请注明它在哪个页。我不喜欢在这些问题的地方进行寻宝游戏。

你可以在这里找到bug追踪器:[bug追踪器](https://github.com/dortania/bugtracker)

## 通过pr进行贡献

通过PRs贡献时的一些指导原则:

* 请动动脑筋。
* 校对你提交的内容。
* 如果我们觉得它不合适或包含不准确的信息，Pull请求可能会被拒绝。我们通常会告诉你为什么它被拒绝了，或者要求修改。
  * 我们也将感谢任何较大的提交来源，使我们更容易验证您提供的信息是有效的
* 图像必须存放在本地的仓库中 `../images/` 文件夹下
* 你的PR必须通过markdown lint程序检查并修复所有问题。
* 在一般情况下,尽量避免使用“non-Acidanthera”工具。一般来说，我们希望避免使用第三方工具——如果不可能的话，那么你可以链接它。
  * 明确禁止使用的工具:
    * UniBeast, MultiBeast和KextBeast
      * 更多信息可以在这里找到: [Tonymacx86-stance](https://github.com/khronokernel/Tonymcx86-stance)
    * TransMac
      * 知道创建无用的USB驱动器
    * Niresh安装程序
      * 我们想避免盗版的指南

### 如何贡献

测试提交并确保其格式正确的最好方法是下载Node.js。然后运行`npm install`来安装依赖。当你运行`npm run dev`时，它将设置一个本地web服务器，你可以连接它来查看你所做的更改。`npm test`也会将所有关于格式和拼写检查的错误抛给你。如果你想让`markdownlint`自动尝试修复代码，请运行`npm run fix-lint`。

简单的步骤:

* [Fork 此仓库（英文原始指南）](https://github.com/dortania/OpenCore-Install-Guide/fork/)
* 安装所需工具:
  * [Node.js](https://nodejs.org/)
* 做出你的更改。
* 构建网站:
  * `npm install` (安装所有需要的插件)
  * `npm run dev` (预览站点)
    * 可以在`http://localhost:8080`找到
* 检查lint和拼写检查:
  * `npm test`
  * `npm run lint` 和 `npm run spellcheck` (单独运行测试)
  * `npm run fix-lint` (修复任何潜在的问题)
  * *对于默认拼写检查不支持的单词，请将它们添加到[dictionary.txt](./dictionary/dictionary.txt) 并运行 `npm run sort-dict`

### 提示

以下是一些让贡献变得更容易的工具:

* [Visual Studio Code](https://code.visualstudio.com)
* [Typora](https://typora.io) 用于实时markdown渲染。
* [TextMate](https://macromates.com) 方便和强大的大规模查找/替换。
* [GitHub Desktop](https://desktop.github.com) 提供更友好的用户界面。

## 通过翻译进行贡献

虽然Dortania的指南主要以英语为基础，但我们知道世界上还有很多其他语言，并不是每个人都能流利地说英语。如果你想帮助把我们的指南翻译成不同的语言，我们非常乐意支持你。

需要注意的主要事项:

* 翻译必须是一个专用的分支，不会被合并到Dortania的指南中
* Forks 必须表明它们是Dortania的翻译，不是官方的
* Forks 必须遵守我们的[License](License .md)

如果满足上述条件，您就可以毫无疑问地托管您的翻译!Dortania的网站是用[VuePress](https://vuepress.vuejs.org)使用[GitHub Actions](https://github.com/features/actions)建立的，最后托管在[GitHub Pages](https://pages.github.com)上，所以托管你自己的翻译是没有成本的。

如果您对翻译或托管有任何问题或担忧，请随时联系我们的[bug追踪者](https://github.com/dortania/bugtracker)。

目前已知的翻译:

* [InyextcionES](https://github.com/InyextcionES/OpenCore-Install-Guide)(西班牙语)
* [macOS86](https://macos86.gitbook.io/guida-opencore/)(Italian, 不再维护)
* [Technopat](https://www.technopat.net/sosyal/konu/opencore-ile-macos-kurulum-rehberi.963661/)(土耳其)
* [ThrRip](https://github.com/ThrRip/OpenCore-Install-Guide)(中文)
* [Shijuro](https://github.com/shijuro/OpenCore-Install-Guide)(俄罗斯)
* [viOpenCore](https://github.com/viOpenCore/OpenCore-Install-Guide)(越南)

请注意，这些翻译受到作者偏好、翻译更改和人为错误的影响。阅读时请记住这一点，因为它们不再是Dortania的官方指南。
