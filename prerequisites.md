# OpenCore入门

在我们可以一头扎进制作一个基于OpenCore的系统之前，我们需要确认一些事。

## 前提条件

1. <span style="color:red">_**[关键]**_</span> 时间和耐心。
   * 如果你有需要限期结束的重要的工作，请不要开始黑苹果，黑苹果不是你的首要工作。。
2. <span style="color:red">_**[关键]**_</span> **了解你的硬件**
   * 你的CPU型号和代数
   * 你的GPU
   * 你的存储设备（硬盘/固态硬盘、NVME/AHCI/RAID/IDE配置，PS：这里是指的南桥上的硬盘的工作模式）
   * 你的笔记本/台式机的OEM型号(如果来自OEM)
   * 你的 **有线网卡芯片组**
   * 你的无线/蓝牙芯片组
3. <span style="color:red">_**[关键]**_</span> **命令行的基本知识以及如何使用终端/命令提示符**
   * 这不仅仅是[关键]，也是整个指南的基础。如果你不知道如何' cd '到一个目录或删除一个文件，我们无法给予你任何帮助。
4. <span style="color:red">_**[关键]**_</span> 在_**兼容性**部分中可以看到一台兼容的机器。
   * [硬件限制页面](macos-limits.md)
5. <span style="color:red">_**[关键]**_</span> 最低要求:
   * 16GB的U盘，如果你打算使用macOS制作引导优盘
   * 4GB的U盘，如果你打算使用windows或linux来制作引导优盘
6. <span style="color:red">_**[关键]**_</span> **有线网络连接** (没有WiFi发射器，USB的有线网卡是否能工作取决于macOS的支持) ，并且你必须知道你的网卡的型号。
   * 你必须有物理网卡端口或者兼容macOS的有线网卡/无线网卡。如果你有 [兼容的无线网卡](https://dortania.github.io/Wireless-Buyers-Guide/), 你也可以使用它。
     * 请注意，macOS不支持大多数无线网卡
   * 对于不能使用网络但有Android手机的人来说，你可以将你的Android手机连接到WiFi，然后使用 [HoRNDIS](https://joshuawise.com/horndis#available_versions)功能共享它。
7. <span style="color:red">_**[关键]**_</span> **正确的操作系统安装方式:**
   * 是:
     * macOS(较新的版本会更好)
     * Windows (Windows 10、1703或更新版本)
     * Linux(纯净且功能正常，使用Python 2.7或更高版本)
   * 对于Windows或Linux用户，你正在使用的驱动器上应至少有**15GB**的可用空间。在Windows上，你的系统盘(C:)必须至少有**15GB**的可用空间。
   * 对于macOS用户来说，系统驱动器上至少有**30GB**的可用空间。
   * 本指南手册中使用的大多数工具还需要 [安装Python](https://www.python.org/downloads/)
8. <span style="color:red">_**[关键]**_</span> **安装了最新版本的BIOS**
   * 在大多数情况下，更新你的BIOS将为macOS提供最好的支持
   * MSI 500系列AMD主板是个例外，更多信息请访问 [主板支持](macos-limits.md#motherboard-support)。
