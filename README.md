---
home: true
heroImage: /dortania-logo-clear.png
heroText: Dortania's OpenCore Install Guide
actionText: Getting Started→
actionLink: prerequisites.md

meta:
- name: description
  content: Current supported version 0.8.8
---

# OpenCore是什么?这个指南是为谁准备的?

OpenCore是我们所说的“引导加载程序”——它是一个复杂的软件，我们用它来为macOS准备系统——特别是通过为macOS注入新数据，如SMBIOS、ACPI表和kext。 这个工具与其他工具(如Clover)的不同之处在于，它在设计时考虑了安全性和质量，允许我们使用在真实mac上发现的许多安全功能，如 [系统完整性保护](https://support.apple.com/en-ca/HT204899) 和 [FileVault](https://support.apple.com/en-ca/HT204837).可以在这里找到更深入的了解:[为什么OpenCore优于Clover和其他](why-oc.md)

本指南主要关注以下两点:

* 在x86电脑上安装macOS
* 教你如何让你的Hack工作

因此，您需要阅读、学习甚至使用谷歌。这不是一个简单的一键安装

请记住，OpenCore仍然是新产品，目前处于测试阶段。虽然它相当稳定，而且可以说在各个方面都比Clover稳定得多，但它仍然经常更新，所以配置块经常改变(即新特性取代旧特性)。

最后，那些有问题的人可以访问 [r/Hackintosh subreddit](https://www.reddit.com/r/hackintosh/) 和 [r/Hackintosh Discord](https://discord.gg/u8V7N5C) 以获得更多帮助。
