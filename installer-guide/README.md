# 制作引导U盘

要求:

* [OpenCorePkg](https://github.com/acidanthera/OpenCorePkg/releases), 强烈建议运行调试版本以显示更多信息
* [ProperTree](https://github.com/corpnewt/ProperTree) 编辑.plist文件(OpenCore Configurator是另一个工具，但已经严重过时，Mackie版本以腐败而闻名。**请尽量避免使用这些工具!**)
* 如果您希望使用OpenCore作为主引导加载程序，则必须从系统中完全删除Clover。保留一个基于三叶草的EFI备份。请看这里需要清洁的地方:[clover 转换](https://github.com/sumingyd/OpenCore-Install-Guide/tree/master/clover-conversion)

### 在线vs离线安装程序

离线安装程序有一个完整的macOS副本，而在线安装程序只有一个恢复映像(~500MB)，一旦启动就可以从苹果服务器下载macOS。

* 离线
  * 只能在macOS中制作
  * Windows/Linux没有安装完整安装程序所需的APFS/HFS驱动程序
* 在线
  * 可在macOS/Linux/Windows下制作
  * 需要通过目标机器上macOS支持的网络适配器进行internet连接

### 制作安装程序

根据您使用的操作系统，请参阅有关制作USB的具体部分:

* [macOS 用户](../installer-guide/mac-install.md)
  * 支持OS x10.4到当前
  * 支持legacy和UEFI安装
* [Windows 用户](../installer-guide/windows-install.md)
  * 支持OS X 10.7到当前
  * 只提供在线安装程序
  * 支持legacy和UEFI安装
* [Linux 用户(UEFI)](../installer-guide/linux-install.md)
  * 支持OS X 10.7到当前
  * 只提供在线安装程序
  * 适用于支持UEFI引导的机器
