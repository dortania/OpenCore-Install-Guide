# 了解macOS引导过程

在对hackintosh进行故障诊断时，要真正理解您在**哪里**遇到困难可能有点困难，因为您试图搜索的确切关键字可能与谷歌上的任何内容都不匹配。虽然这篇文章不会解决你所有的问题，但它至少可以帮助你更好地理解macOS启动过程中哪里卡住了，并希望能给你一些为什么卡住的想法。

## OpenCore启动

本节将会很简短，因为OpenCore引导问题相当罕见，通常是简单的用户错误:

* 系统启动并搜索启动设备
* 系统在您的 OpenCore USB 上的 efi/BOOT/ 下定位 BOOTx64.efi
* 加载BOOT x64.efi，然后从 efi/OC/ 链式加载 OpenCore.efi
* 应用NVRAM属性
* EFI 驱动程序是从 EFI/OC/drivers 加载的
* 安装了图形输出协议(GOP)
* ACPI 表是从 EFI/OC/ACPI 加载的
* SMBIOS数据应用
* OpenCore 加载和显示所有可能的引导选项
* 你现在启动你的macOS安装程序

如果你在这一点上启动有问题，主要检查:

* [卡在 `no vault provided!`](./extended/opencore-issues.md#stuck-on-no-vault-provided)
* [看不到 macOS 分区](./extended/opencore-issues.md#can-t-see-macos-partitions)
* [引导 OpenCore 重启到 BIOS](./extended/opencore-issues.md#booting-opencore-reboots-to-bios)

关于其他可能的问题，请参见:

* [OpenCore 启动问题](./extended/opencore-issues.md)

## boot.efi 切换

![](../images/troubleshooting/boot-md/1-boot-efi.png)

这是macOS的引导加载程序(boot.efi)出现的地方，具体来说，它所做的是为内核加载准备环境，以及OpenCore注入kext的地方。如果你在这一点上卡住了，很可能是加载内核有问题，主要的罪魁祸首是:

* [卡在 EndRandomSeed](./extended/kernel-issues.md#stuck-on-endrandomseed)
* [卡在 `[EB|#LOG:EXITBS:START]`](./extended/kernel-issues.md#stuck-on-eb-log-exitbs-start)
* [收到 `Couldn't allocate runtime area` errors](./extended/kernel-issues.md#couldn-t-allocate-runtime-area-errors)

关于其他可能的问题，请参见:

* [内核问题](./extended/kernel-issues.md)

**注意**:在macOS 10.15.4中，苹果更改了boot.efi调试协议，所以看起来与之前有很大的不同，但所有的规则仍然适用

## XNU/内核切换

现在启动efi已经为我们设置好了一切，我们现在可以观察内核的工作了。这部分通常被称为[Rooting phase](https://developer.apple.com/library/archive/documentation/Darwin/Conceptual/KernelProgramming/booting/booting.html):

![](../images/troubleshooting/boot-md/2-kernel-start.png)

本节是验证 SMBIOS 数据、加载 ACPI 表 /kext 以及 macOS 试图使一切正常的地方。这里的失败通常是以下原因造成的:

* 损坏的ssdt
* 损坏的kext(或配置文件plist -> Kernel -> Add下的设置不正确)
* 混乱的内存映射

查看此处获取更多故障诊断信息:

* [卡在 Kernel Panic `Cannot perform kext summary`](./extended/kernel-issues.md#kernel-panic-cannot-perform-kext-summary)
* [卡在 Kernel Panic on `Invalid frame pointer`](./extended/kernel-issues.md#kernel-panic-on-invalid-frame-pointer)

![](../images/troubleshooting/boot-md/5-apfs-module.png)

现在我们有了`[PCI configuration begin]`，这一节可以看作是对我们的系统、注入的kext和ssdt的硬件测试，IOKit在这里启动硬件探测以查找要连接的设备。

这里测试的主要内容是:

* 嵌入式控制器
* 存储(NVMe、SATA等)
* PCI/e
* NVRAM
* RTC
* PS2 和 I2C

关于如何绕过这个区域的更多具体信息，请参阅这里:

* [卡在 `RTC...`, `PCI Configuration Begins`, `Previous Shutdown...`, `HPET`, `HID: Legacy...`](./extended/kernel-issues.md#stuck-on-rtc-pci-configuration-begins-previous-shutdown-hpet-hid-legacy)

![](../images/troubleshooting/boot-md/6-USB-setup.png)

这就是15端口限制和USB映射发挥作用的地方，也是臭名昭著的 "Waiting for Root Device" 错误弹出的地方，主要检查:

* ["Waiting for Root Device" 或禁止符号错误](./extended/kernel-issues.md#waiting-for-root-device-or-prohibited-sign-error)

![](../images/troubleshooting/boot-md/8-dsmos-arrived.png)

这就是我们的FakeSMC/VirtualSMC发挥作用的地方，DSMOS本身是一个kext，它验证您的系统是否有一个SMC，并将请求一个密钥。如果这个密钥缺失，那么DSMOS将无法解密其余的二进制文件，您将被卡在这里。你也可能在AppleACPICPU遇到同样的错误。

* [kextd stall[0]: AppleACPICPU](./extended/kernel-issues.md#kextd-stall-0-appleacpicpu)

```
你今天的业力检查:
曾经有一个用户抱怨
他现有的操作系统太盲目了,
他会做得更好,盗版操作系统跑好了
但他发现硬件拒绝。
请不要偷Mac OS!
真的，这太不酷了。
(C) Apple Computer, Inc.
```

来源:不要窃取Mac OS X.kext

![](../images/troubleshooting/boot-md/9-audio.png)

这就是苹果的音频驱动程序和AppleALC的亮点所在。通常很少在这里看到问题，但如果有，请尝试禁用AppleALC和任何其他与音频相关的kext。

![](../images/troubleshooting/boot-md/10-GPU.png)

这里我们进入了GPU驱动程序初始化，WhateverGreen也在这里发挥了它的魔力。这里的错误通常是由于GPU，而不是WhateverGreen本身，主要的罪魁祸首:

* [卡在或靠近 `IOConsoleUsers: gIOScreenLock...`](./extended/kernel-issues.md#stuck-on-or-near-ioconsoleusers-gioscreenlock-giolockstate-3)
* [`IOConsoleUsers: gIOScreenLock...`后出现黑屏…](./extended/kernel-issues.md#black-screen-after-ioconsoleusers-gioscreenlock-on-navi)

## macOS Handoff

![](../images/troubleshooting/boot-md/11-boot.png)

你终于摆脱了所有的啰嗦!如果在啰嗦模式过去了这么多之后，你还在纠结于苹果的logo，那么有几件事需要检查:

* [macOS 在登录前冻结](./extended/kernel-issues.md#macos-frozen-right-before-login)
* [`IOConsoleUsers: gIOScreenLock...` 后出现黑屏…](./extended/kernel-issues.md#black-screen-after-ioconsoleusers-gioscreenlock-on-navi)
* [在macOS安装程序30秒后冻结](./extended/userspace-issues.md#frozen-in-the-macos-installer-after-30-seconds)
