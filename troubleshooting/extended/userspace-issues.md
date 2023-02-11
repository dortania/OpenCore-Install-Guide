# 用户空间问题

关于启动安装程序和加载GUI的问题。

[[toc]]

## 俄文的macOS安装程序

默认的样例配置是俄语的，因为俄罗斯人统治着黑苹果世界，检查`NVRAM -> Add -> 7C436110-AB2A-4BBB-A880-FE41995C9F82`下的`prev-lang:kbd`值。中文简体: zh-Hans:252，冒号前面的zh-Hans表示：简体中文，而冒号后面的252表示所使用的苹果键盘布局。关于键盘布局的完整列表可以在[AppleKeyboardLayouts.txt](https://github.com/acidanthera/OpenCorePkg/blob/master/Utilities/AppleKeyboardLayouts/AppleKeyboardLayouts.txt)中找到。

您可能还需要在引导选择程序中重置NVRAM

* 注意:众所周知，Thinkpad笔记本电脑在OpenCore重置NVRAM后会出现半砖现象，我们建议通过更新这些机器的BIOS来重置NVRAM。

还是不管用?好吧，是时候让大人物上场了。我们将强制删除该属性，并让OpenCore重建它:

`NVRAM -> Delete -> 7C436110-AB2A-4BBB-A880-FE41995C9F82 -> Item 0` 然后设置它的类型为 `String` 和值 `prev-lang:kbd`

![](../../images/troubleshooting/troubleshooting-md/lang.png)

## macOS安装程序损坏

如果你在2019年10月之前下载了macOS，你可能已经有一个过期的macOS安装程序证书，有两种方法可以解决这个问题:

* 下载最新版本的macOS
* 将终端日期更改为证书有效日期

对于后者:

* 断开所有网络设备(以太网，关闭WiFi)
* 在恢复终端设置为2019年9月1日:

```
date 0901000019
```

## 卡在或靠近 `IOConsoleUsers: gIOScreenLock...`/`gIOLockState (3...`

这是在GPU正确初始化之前，请验证以下内容:

* GPU支持UEFI (GTX 7XX/2013+)
* BIOS中CSM是关闭的
* 强制使用PCIe 3.0链路速度
* 如果运行iGPU，请仔细检查ig-platform-id和device-id是否有效。
  * 桌面UHD 630可能需要使用 `00009B3E` 代替
* 尝试各种 [WhateverGreen 修复](https://github.com/acidanthera/WhateverGreen/blob/master/Manual/FAQ.IntelHD.en.md)
  * `-igfxmlr` 导参数。这也可以表现为 "Divide by Zero" 错误。
* 在10.15.4及更新版本中，Coffee Lake iGPU用户可能还需要`igfxonln=1`

## 笔记本电脑上的花屏屏幕

在UEFI设置中启用CSM。这可能显示为 "Boot legacy ROMs" 或其他 legacy 设置.

## 笔记本电脑和 AIOs上在 `IOConsoleUsers: gIOScreenLock...` 之后黑屏…

验证以下内容:

* SSDT-PNLF已安装(即 EFI/OC/ACPI 以及配置 config.plist -> ACPI -> Add)
* iGPU属性在 `DeviceProperties -> Add -> PciRoot(0x0)/Pci(0x2,0x0)`下正确设置
* Coffee Lake和较新的笔记本电脑，在启动参数中添加 `-igfxblr`
  * 或者，添加 `enable-backlight-registers-fix | Data | 01000000` 到 `PciRoot(0x0)/Pci(0x2,0x0)`

此外，请验证[卡在或接近 `IOConsoleUsers: gIOScreenLock...`](#stuck-on-or-near-ioconsoleusers-gioscreenlock-giolockstate-3)中提到的问题

## 在 Navi 上 `IOConsoleUsers: gIOScreenLock...` 后黑屏

* 在引导参数中添加 `agdpmod=pikera`
* 在不同的显示输出之间切换
* 尝试运行MacPro7,1 SMBIOS 引导参数 `agdpmod=ignore`

对于MSI Navi用户，您需要应用这里提到的补丁:[安装程序不能与5700xt# 901工作](https://github.com/acidanthera/bugtracker/issues/901)

具体来说，在`Kernel -> Patch`下添加以下条目:

```
Base:
Comment: Navi VBIOS Bug Patch
Count: 1
Enabled: YES
Find: 4154592C526F6D2300
Identifier: com.apple.kext.AMDRadeonX6000Framebuffer
Limit: 0
Mask:
MinKernel:
MaxKernel:
Replace: 414D442C526F6D2300
ReplaceMask:
Skip: 0
```

## 在macOS安装程序中停留在剩余30秒

这可能是由于错误或完全缺少 NullCPUPowerManagement，一个托管在 AMD OSX 的香草指南是损坏的。去喊香妮把它修好。要解决这个问题，请从`Kernel -> Add`和`EFI/OC/ kext`中移除 NullCPUPowerManagement，然后在`Kernel -> Emulate`中启用`DummyPowerManagement`。

## 数据和隐私屏幕显示后 15h/16h重启CPU

请遵循更新2后的指示:[修复数据和隐私重启](https://www.insanelymac.com/forum/topic/335877-amd-mojave-kernel-development-and-testing/?do=findComment&comment=2658085)

## macOS在登录前就冻结了

这是一个常见的TSC错误的例子，对于大多数系统添加[CpuTscSync](https://github.com/lvs1974/CpuTscSync)

对于Skylake-X，包括华硕和EVGA在内的许多固件都不会写入所有内核。所以我们需要在冷启动和唤醒时使用[TSCAdjustReset](https://github.com/interferenc/TSCAdjustReset)重置TSC。编译版本可以在这里找到:[TSCAdjustReset.kext](https://github.com/dortania/OpenCore-Install-Guide/blob/master/extra-files/TSCAdjustReset.kext.zip)。请注意，您**必须**打开kext("显示包内容"在finder中，`Contents -> Info.plist`)并更改Info plist -> `IOKitPersonalities -> IOPropertyMatch -> IOCPUNumber`为CPU线程数从`0`开始(i9 7980xe 18核心将是`35`，因为它总共有36个线程)

查看TSC问题的最常见方法:

方案 1    |  方案 2
:-------------------------:|:-------------------------:
![](../../images/troubleshooting/troubleshooting-md/asus-tsc.png)  |  ![](../../images/troubleshooting/troubleshooting-md/asus-tsc-2.png)

## MediaKit报告空间不足

这个错误是由于EFI空间太小,默认Windows将创建一个100 mb EFI而macOS希望200 mb。要解决这个问题，你有两种方法:

* 将硬盘的EFI分区扩展到200MB(参见谷歌如何操作)
* 格式化整个驱动器，而不仅仅是分区
  * 注意默认磁盘工具只显示分区，按Cmd/Win+2显示所有设备(或者你可以按查看按钮)

默认           |  显示所有设备(Cmd+2)
:-------------------------:|:-------------------------:
![](../../images/troubleshooting/troubleshooting-md/Default.png)  |  ![](../../images/troubleshooting/troubleshooting-md/Showalldevices.png)

## 磁盘工具无法擦除数据

这是5个问题中的1个(或多个):

* 格式化分区而不是驱动器，参见[MediaKit报告空间不足](#mediakit-reports-not-enough-space)
* DiskUtility有一个奇怪的bug，它会在第一次擦除时失败，然后尝试再次擦除
* BIOS中的SATA热插拔支持导致问题(尝试禁用此选项)
* 旧固件，确保驱动器使用最新的固件
* 最后，你可能只是硬盘坏了

## 磁盘实用程序中没有显示SATA驱动器

* 确保bios中的SATA模式是AHCI
* 某些SATA控制器可能没有被macOS官方支持，在这种情况下，你需要获取 [CtlnaAHCIPort.kext](https://github.com/dortania/OpenCore-Install-Guide/blob/master/extra-files/CtlnaAHCIPort.kext.zip)
  * 对于非常传统的SATA控制器， [AHCIPortInjector.kext](https://www.insanelymac.com/forum/files/file/436-ahciportinjectorkext/) 可能更合适。

## 卡在剩余2分钟

![](../../images/troubleshooting/troubleshooting-md/2-min-remaining.jpeg)

此错误与 macOS 为系统下次启动编写特定 NVRAM 变量的阶段直接相关，因此当出现围绕NVRAM的问题时，它将在此处停止。

为了解决这个问题，我们有几个选择:

* 300系列英特尔修复(即Z390):
  * [SSDT-PMC](https://sumingyd.github.io/Getting-Started-With-ACPI/)
* 其他人可以在config.plist中设置如下:
  * LegacyEnable -> YES
  * LegacyOverwrite -> YES
  * WriteFlash -> YES

## 无法联系恢复服务器

如果你是在Windows或Linux上安装的，那么这意味着你的USB安装程序是基于恢复的。这意味着只有一小部分macOS安装程序在磁盘上，而其余部分必须通过安装程序从苹果服务器下载。我们没有包含完整安装指南的原因是，不稳定的HFS驱动程序和其他实用程序通常会导致数据损坏。

要解决这个错误，你有几个选项:

* 确保你有可用的以太网或WiFi连接
  * 在安装程序的“工具”标题下打开“网络工具”，看看你的网卡是否显示出来
    * 如果你的网卡**没有**显示，很可能是你使用了不正确的网络kext
      * 请参考这里: [网卡 Kexts](../../ktext.md#ethernet) 和[查找你的硬件](../../find-hardware.md)
    * 如果网卡**显示**，接下来在安装程序的终端运行`ping -c3 www.baidu.com`以确保网络连接正常
      * 如果没有显示，说明你的网络或kext出问题了
        * 如果新版本的硬件有奇怪的bug，我们建议尝试旧版本的kext
      * 如果它确实返回了一些东西，那么问题就在苹果这边。不幸的是，您只能换个时间，再次尝试安装。

| 检查网卡 | Ping |
| :--- | :--- |
| ![](../../images/troubleshooting/troubleshooting-md/check-network.png) | ![Ping](../../images/troubleshooting/troubleshooting-md/ping.png) |

## Big Sur上键盘和鼠标坏了

对于某些旧系统(如Core2 Duo/2010及更老版本)，你可能会注意到，当USB端口工作时，基于hid的设备(如键盘和鼠标)可能会坏掉。为了解决这个问题，添加以下补丁:

::: details IOHIDFamily 补丁

config.plist -> Kernel -> Patch:

| Key | Type | Value |
| :--- | :--- | :--- |
| Base | String | _isSingleUser |
| Count | Integer | 1 |
| Enabled | Boolean | True |
| Find | Data | |
| Identifier | String | com.apple.iokit.IOHIDFamily |
| Limit | Integer | 0 |
| Mask | Data | |
| MaxKernel | String | |
| MinKernel | String | 20.0.0 |
| Replace | Data | `B801000000C3` |
| ReplaceMask | Data | |
| Skip | Integer | 0 |

[Source](https://applelife.ru/threads/ustanovka-macos-big-sur-11-0-beta-na-intel-pc-old.2944999/page-81#post-884400)

:::

## 卡在`您的Mac需要更新固件才能安装到此卷`上

如果系统提示您更新固件以安装APFS卷，这可能表明是一个过时的SMBIOS表。首先，验证以下几点:

* 你已经启用了`PlatformInfo -> Automatic`
* `UpdateSMBIOSMode` 设置为 `Create`
  * 确保禁用了`CustomSMBIOSGuid`
  * 对于Dell和VAIO机器，请确保启用了`CustomSMBIOSGuid`，并将`UpdateSMBIOSMode`设置为`Custom`
    * `CustomSMBIOSGuid`和`UpdateSMBIOSMode`应该始终相互串联
* 使用这个版本的macOS支持的SMBIOS
  * 即：你不使用“不兼容检查”
* 你正在使用最新版本的OpenCore

如果您仍然收到此错误，那么可能在OpenCore本身中有一些过时的SMBIOS信息。我们建议更改为类似的SMBIOS，看看这个问题是否得到解决。要获得SMBIOS的完整列表，请参阅:[选择正确的SMBIOS](../../extras/smbios-support.md)
