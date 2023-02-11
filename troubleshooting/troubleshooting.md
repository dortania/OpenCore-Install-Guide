# 一般故障处理

本节是针对那些在启动OpenCore、macOS或macOS内部存在问题的人。如果你不知道在macOS引导过程中你被卡在了哪里，阅读[macOS引导过程](../troubleshooting/boot.md)页面可以帮助你弄清楚。

**如果没有涉及你的问题，请阅读OpenCore的官方文档:[Configuration.pdf](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/Configuration.pdf)**。本文档涉及更多关于OpenCore如何工作的技术细节，并有更多关于所有支持的选项的详细信息。

## 目录

如果您不确定您目前卡在哪里，请参阅这里:[了解macOS引导过程](../troubleshooting/Boot.md)

* [OpenCore引导问题](./extended/opencore-issues.md)
  * 这一节指的是启动实际的USB和获得OpenCore的选择器。在选择器之后的任何操作，比如启动macOS，都应该在下面看到
* [内核空间问题](./extended/kernel-issues.md)
  * 涵盖从你在OpenCore菜单中选择macOS开始，直到苹果logo和安装程序GUI加载之前的所有早期启动中发生的所有事情
* [用户空间问题](./extended/userspace-issues.md)
  * 涵盖从加载macOS的GUI到在硬盘上安装macOS的整个过程
* [安装后的问题](./extended/post-issues.md)
  * 涵盖macOS安装并完全引导后的问题
* [杂项问题](./extended/misc-issues.md)
  * 涵盖macOS安装后或其他操作系统的问题
