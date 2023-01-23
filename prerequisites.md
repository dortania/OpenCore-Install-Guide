# 开始使用OpenCore

在我们开始制作一个基于OpenCore的系统之前，我们需要回顾一些事情。

## 前提条件

1. <span style="color:red">_**[关键的]**_</span> 时间和耐心。
   * 如果你有截止日期或重要的工作，不要开始做这件事。Hackintoshes不是你应该依靠作为工作的机器。
2. <span style="color:red">_**[关键的]**_</span> **了解你的硬件**
   * 你的CPU名称及其生成
   * 你的gpu
   * 你的存储设备(HDD/SSD, NVMe/AHCI/RAID/IDE配置)
   * 您的笔记本/台式机型号(如果来自OEM)
   * 你的 **以太网芯片组**
   * 你的WLAN/蓝牙芯片组
3. <span style="color:red">_**[关键的]**_</span> **命令行的基本知识以及如何使用终端/命令提示符**
   * 这不仅仅是[至关重要的]，也是整个指南的基础。如果你不知道如何' cd '到一个目录或删除一个文件，我们不能帮助你。
4. <span style="color:red">_**[关键的]**_</span> 在_**兼容性**部分中可以看到一台兼容的机器。
   * [硬件限制页面](macos-limits.md)
5. <span style="color:red">_**[关键的]**_</span> 至少:
   * 16GB的USB，如果你要使用macOS创建USB
   * 4GB USB，如果你要使用Windows或Linux创建USB
6. <span style="color:red">_**[关键的]**_</span> 一个**以太网连接** (没有WiFi适配器，以太网USB适配器可能取决于macOS的支持) ，并且你必须知道你的LAN卡的型号。
   * 你必须有一个物理以太网端口，或者一个兼容的macOS以太网适配器。如果你有 兼容的WiFi卡](https://dortania.github.io/Wireless-Buyers-Guide/), 你也可以使用它。.
     * 注意大多数WiFi卡都不被macOS支持
   * 对于不能使用以太网但有Android手机的人来说，你可以将你的Android手机连接到WiFi，然后使用 [HoRNDIS](https://joshuawise.com/horndis#available_versions).
7. <span style="color:red">_**[关键的]**_</span> **适当的操作系统安装:**
   * 就这样:
     * macOS(最近的一个会更好)
     * Windows (Windows 10、1703或更新版本)
     * Linux(干净且正常运行，支持Python 2.7或更高版本)
   * 对于Windows或Linux用户，你正在使用的驱动器上有**15GB**的空闲空间。在Windows上，你的操作系统磁盘(C:)必须至少有**15GB**的空闲空间。
   * 对于macOS用户来说，系统驱动器上有**30GB**的空闲空间。
   * 本指南中使用的大多数工具还需要 [安装Python](https://www.python.org/downloads/)
8. <span style="color:red">_**[关键的]**_</span> **最新安装的BIOS**
   * 在大多数情况下，更新你的BIOS将为macOS提供最好的支持
   * MSI 500系列AMD主板是个例外，更多信息请访问 [主板支持](macos-limits.md#motherboard-support)。
