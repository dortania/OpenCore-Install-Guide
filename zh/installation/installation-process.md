# 安装过程

现在你已经完成了OpenCore的设置，你终于能够启动，需要记住的主要事情:

* 为macOS启用最佳BIOS设置
* 阅读 [OpenCore 多引导指南](https://sumingyd.github.io/OpenCore-Multiboot/) 以及 [设置启动选项](https://sumingyd.github.io/OpenCore-Post-Install/multiboot/bootstrap)
  * 主要适用于那些在单个驱动器上运行的多个操作系统人
* 和[通用故障诊断](../troubleshooting/troubleshooting.md) 页面
* 阅读[macOS引导过程](../troubleshooting/boot.md)
  * 可以帮助第一次安装的用户更好地了解他们可能在哪里卡住
* 以及大量的耐心

## 再次检查你的准备工作

在启动之前，我们应该检查的最后一件事是你的EFI是如何设置的:

好的 EFI          |  坏的 EFI
:-------------------------:|:-------------------------:
![](../images/installation/install-md/good-efi.png)  |  ![](../images/installation/install-md/bad-efi.png)
EFI文件夹在EFI分区上 | EFI文件夹不见了
已编译ACPI文件(.aml) | 未编译ACPI文件(.dsl)
不包括DSDT | * DSDT包括在内
删除不需要的驱动程序(.efi) | 保留默认驱动程序
删除不需要的工具(.efi) | 保留默认工具
kext文件夹中的所有文件都以 .kext 结尾 | 包括源代码和文件夹
config.plist 在 EFI/OC 内 | 既没有重命名也没有将.plist放在正确的位置
只使用需要的kext | 下载了每一个列出的kext

## 在 USB 上启动 OpenCore

现在你终于准备好把u盘插入电脑并启动了。请记住，大多数笔记本电脑和一些台式机仍然会默认使用Windows内部驱动器，你需要在BIOS启动选项中手动选择OpenCore。您需要查看用户手册或使用谷歌来找出如何访问BIOS和启动菜单(例如：Esc、F2 F10或F12)

启动USB后，你可能会看到以下启动选项:

1. Windows
2. macOS Base System (External) / Install macOS Big Sur (External) / *u盘名称* (External)
3. OpenShell.efi
4. Reset NVRAM

::: warning

你可能需要按空格键才能看到安装程序，因为在OpenCore的后续版本中默认启用了`HideAuxiliary`。

:::

对我们来说, **选项 2.** 就是我们想要的。根据安装程序的制作方式，它可能显示为 **"macOS Base System (External)"**, **"Install macOS Big Sur (External)"** 或 **"*你的USB驱动器名称* (External)"**

## macOS 安装程序

因此，您终于启动了安装程序，完成了冗长的操作并点击安装程序!现在你已经走到了这一步，需要记住的主要事情是:

* 你希望安装macOS的驱动 **必须** 同时是 GUID分区模式 **和** APFS
  * 硬盘上的High Sierra，所有Sierra用户都需要使用macOS Journaled(HFS+)
* 驱动器 **必须** 有一个200MB的分区
  * 默认情况下，macOS将设置新格式化的驱动器为200MB
  * 参见 [多引导指南](https://sumingyd.github.io/OpenCore-Multiboot/) 了解更多关于分区Windows驱动器的信息

开始安装后，需要等待系统重新启动。您将再次选择引导到OpenCore，但不是选择USB installer/recovery-您将选择硬盘上的macOS安装程序以继续安装。你会看到一个苹果的logo，几分钟后你会看到底部有一个计时器，上面写着“还剩x分钟”。这可能是喝饮料或吃零食的好时机，因为这需要一段时间。它可能会重新启动几次，但如果一切顺利，它最终会把你带到“设置你的Mac”界面。

你成功了! 🎉
您需要浏览安装后的页面来完成系统的设置
