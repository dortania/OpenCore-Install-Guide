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

# 什么是OpenCore，本指南的对象是谁？

OpenCore就是我们所说的 "启动加载器"--它是一个复杂的软件，我们用它来准备我们的系统，特别是通过注入新的macOS数据，如SMBIOS、ACPI表和kexts。这个工具与Clover等其他工具的不同之处在于，它的设计考虑到了安全和质量，允许我们使用真正的Mac上的许多安全功能，如[系统完整性保护](https://support.apple.com/en-ca/HT204899)和[文件库](https://support.apple.com/en-ca/HT204837)。更深入的了解可以在这里找到。[为什么是OpenCore而不是Clover和其他软件](why-oc.md)

本指南特别关注两个主要方面。

* 在基于X86的电脑上安装macOS
* 教你如何使你的Hack发挥作用

正因为如此，你将被要求阅读、学习甚至使用谷歌。这不是一个简单的一键安装设置。

请记住，OpenCore仍然是新的，目前处于测试阶段。虽然相当稳定，而且可以说在几乎所有方面都比Clover稳定得多，但它仍在频繁更新，因此配置的大块内容经常变化（即新的选项取代旧的选项）。

最后，有问题的人可以访问[r/Hackintosh subreddit](https://www.reddit.com/r/hackintosh/)和[r/Hackintosh Discord](https://discord.gg/u8V7N5C)以获得更多帮助。

此翻译受限于作者及贡献者的个人喜好及个人理解，并非是dortania官方翻译。

黑果交流QQ群：796661960
