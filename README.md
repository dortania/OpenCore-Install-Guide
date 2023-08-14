---
home: true
heroImage: /dortania-logo-clear.png
heroText: OpenCore的安装指南
actionText: 准备开始→
actionLink: prerequisites.md

meta:
- name: 描述
  content: 当前支持的版本 0.9.1
---

# OpenCore是什么?这个指南是为谁准备的?

OpenCore就是我们所说的 "引导加载程序"--它是一个复杂的软件，我们用它来准备我们的系统，特别是通过注入新的macOS数据，如SMBIOS、ACPI表和kexts。这个工具与Clover等其他工具的不同之处在于，它在设计时考虑到了安全性和质量，允许我们使用许多在真正的mac上可以找到的安全特性，如[系统完整性保护](https://support.apple.com/en-ca/HT204899)和[FileVault](https://support.apple.com/en-ca/HT204837)。更深入的了解可以在这里找到：[为什么OpenCore超过Clover和其他程序](why-oc.md)

本指南主要关注以下两点:

* 在x86 PC上安装macOS操作系统
* 教你如何让你的黑苹果正常运行

因此，您需要阅读、学习甚至使用谷歌。这不是一个简单的一键安装。

请记住，OpenCore仍然是新产品，目前处于测试阶段。虽然它相当稳定，而且可以说在各个方面都比Clover稳定得多，但它仍然经常更新，所以配置块经常改变(即新特性取代旧特性)。

最后，那些有问题的人可以访问 [r/Hackintosh subreddit](https://www.reddit.com/r/hackintosh/) 和 [r/Hackintosh Discord](https://discord.gg/u8V7N5C) 以获得更多帮助。

此翻译受限于作者及贡献者的个人喜好及个人理解，并非是dortania官方翻译。

黑果交流QQ群：796661960
