---
home: true
heroImage: /dortania-logo-clear.png
heroText: OpenCore的安装指南
actionText: 准备开始→
actionLink: prerequisites.md

meta:
- name: 描述
  content: 当前支持的版本 0.8.8
---

# 什么是OpenCore以及谁适用本指南

OpenCore就是我们常说的“引导加载程序”——它是我们用来使用macOS系统进行准备的复杂软件——特别是通过为macOS注入新数据，如SMBIOS、ACPI表和kext。 本工具和别的像Clover之类的其他工具的不同之处在于它在设计时就考虑到了安全和高效率，使我们能够使用在MAC实体机上的许多安全功能，如 [系统完整性保护](https://support.apple.com/en-ca/HT204899) 和 [文件库](https://support.apple.com/en-ca/HT204837).更深入的了解可以在这里找到：[为什么OpenCore在Clover和其他软件之上](why-oc.md)

本指南主要关注以下两点:

* 在基于X86架构的PC上安装macOS
* 教会你如何进行你的破解

因此，您需要阅读、学习甚至使用Google。OpenCore并不是简单的傻瓜式一键安装设置。

请牢记OpenCore目前还在测试阶段，它还是个新项目，虽然已经相当稳定，而且可以说在几乎所有方面都比clover更加稳定，但OpenCore仍然经常更新，所以配置模块会经常变更（也就是新布局取代旧的）。

最后，那些有问题的人可以访问 [r/Hackintosh subreddit](https://www.reddit.com/r/hackintosh/) 和 [r/Hackintosh Discord](https://discord.gg/u8V7N5C) 寻求更多帮助。

中文翻译由[宿命](https://github.com/sumingyd)提供，由[星座三太子](https://github.com/joe915632)校对，此翻译受限于作者及贡献者的个人喜好及个人理解，并非是dortania官方翻译。

黑果交流QQ群：796661960
