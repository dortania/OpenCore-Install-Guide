# 创建USB

要求:

* [OpenCorePkg](https://github.com/acidanthera/OpenCorePkg/releases), 强烈建议运行调试版本以显示更多信息
* [ProperTree](https://github.com/corpnewt/ProperTree)编辑.plist文件(OpenCore Configurator是另一个工具，但严重过时，Mackie版本以腐败而闻名。 **请不惜一切代价避免使用这些工具!**).
* 如果你想使用OpenCore作为你的主引导加载程序，你必须从你的系统中完全删除Clover。 保持备份你的三叶草为基础的EFI。 看看这里需要清洁的地方: [Clover 转换](https://github.com/dortania/OpenCore-Install-Guide/tree/master/clover-conversion)

### 在线vs离线安装程序

离线安装程序有一个完整的macOS副本，而在线安装程序只有一个恢复映像(约500MB)，一旦启动就可以从苹果服务器下载macOS。

* 离线
  * 只能在macOS中制作
  * Windows/Linux没有安装完整安装程序所需的APFS/HFS驱动程序
* 在线
  * 可在macOS/Linux/Windows下制作
  * 需要通过目标机器上macOS支持的网络适配器进行internet连接

### 制作安装程序

根据您使用的操作系统，请参阅有关制作USB的具体部分:

* [macOS 用户](../installer-guide/mac-install.md)
  * 支持OS X 10.4到当前
  * 支持legacy和UEFI安装
* [Windows 用户](../installer-guide/windows-install.md)
  * 支持OS X 10.7到当前
  * 只提供在线安装程序
  * 支持legacy和UEFI安装
* [Linux 用户(UEFI)](../installer-guide/linux-install.md)
  * 支持OS X 10.7到当前
  * 只提供在线安装程序
  * 适用于支持UEFI引导的机器
