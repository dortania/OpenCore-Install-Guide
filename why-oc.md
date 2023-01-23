# 为什么OpenCore超过Clover和其他公司

本节简要介绍了为什么社区已经过渡到OpenCore，并旨在消除社区中常见的一些误解。那些只是想要一台macOS机器的人可以跳过这一页。

[[toc]]

## OpenCore特性

* 更多的操作系统支持!
  * OpenCore现在支持更多版本的OS X和macOS，而无需Clover和Chameleon必须实现的痛苦hack
  * 这包括早在10.4、Tiger的操作系统，甚至是13的最新版本Ventura!
* 平均而言，OpenCore系统的启动速度比使用Clover的系统要快，因为不必要的补丁要少
* 更好的整体稳定性，补丁可以更精确:
  * [macOS 10.15.4 更新](https://www.reddit.com/r/hackintosh/comments/fo9bfv/macos_10154_update/)
  * AMD OSX补丁不需要在每个小的安全更新中更新
* 以多种形式提高整体安全性:
  * 不需要禁用系统完整性保护(SIP)
  * 内置FileVault 2支持
  * [Vaulting](https://dortania.github.io/OpenCore-Post-Install/universal/security.html#Vault) 允许创建EFI快照防止不必要的修改
  * 真正的安全引导支持
    * 包括UEFI和苹果的变种
* BootCamp切换和启动设备选择通过读取启动盘设置的NVRAM变量来支持，就像真正的Mac一样。
* 通过引导支持引导热键。efi - hold启动时选择启动设备的选项或ESC, Cmd+R进入恢复或Cmd+Opt+P+R复位NVRAM。

### 软件支持

一些人想要从其他引导加载程序转换的最大原因实际上是软件支持:

* Kexts不再测试Clover:
  * kext出问题了? 许多开发人员，包括 [Acidanthera](https://github.com/acidanthera) (您最喜欢的大多数kext的制造商) 除非在OpenCore上，否则不会提供支持
* 许多固件驱动程序被合并到OpenCore:
  * [APFS 支持](https://github.com/acidanthera/AppleSupportPkg)
  * [FileVault 支持](https://github.com/acidanthera/AppleSupportPkg)
  * [Firmware 补丁](https://github.com/acidanthera/AptioFixPkg)

## OpenCore的缺点

The majority of Clover's functionality is actually supported in OpenCore in the form of some quirk, however when transitioning you should pay close attention to OpenCore's missing features as this may or may not affect yourself:

* Does not support booting MBR-based operating systems
  * Work around is to chain-load rEFInd once in OpenCore
* Does not support UEFI-based VBIOS patching
  * This can be done in macOS however
* Does not support automatic DeviceProperty injection for legacy GPUs
  * ie. InjectIntel, InjectNVIDIA and InjectAti
  * This can be done manually however: [GPU patching](https://dortania.github.io/OpenCore-Post-Install/gpu-patching/)
* Does not support IRQ conflict patching
  * Can be resolved with [SSDTTime](https://github.com/corpnewt/SSDTTime)
* Does not support P and C state generation for older CPUs
* Does not support Hardware UUID Injection
* Does not support many of Clover's XCPM patches
  * ie. Ivy Bridge XCPM patches
* Does not support hiding specific drives
* Does not support changing settings within OpenCore's menu
* Does not patch PCIRoot UID value
* Does not support macOS-only ACPI patching

## Common Myths

### Is OpenCore unstable as it's a beta?

Short Answer: No

Long Answer: No

OpenCore's version number does not represent the quality of the project. Instead, it's more of a way to see the stepping stones of the project. Acidanthera still has much they'd like to do with the project including overall refinement and more feature support.

For example, OpenCore goes through proper security audits to ensure it complies with UEFI Secure Boot, and is the only Hackintosh bootloader to undergo these rigorous reviews and have such support.

Version 0.6.1 was originally designed to be the official release of OpenCore as it would have proper UEFI/Apple Secure Boot, and would be the 1 year anniversary of OpenCore's release as a public tool. However, due to circumstances around macOS Big Sur and the rewriting of OpenCore's prelinker to support it, it was decided to push off 1.0.0 for another year.

Current road map:

* 2019: Year of Beta
* 2020: Year of Secure Boot
* 2021: Year of Refinement

So please do not see the version number as a hindrance, instead as something to look forward to.

### Does OpenCore always inject SMBIOS and ACPI data into other OSes?

By default, OpenCore will assume that all OSes should be treated equally in regards to ACPI and SMBIOS information. The reason for this thinking consists of three parts:

* This allows for proper multiboot support, like with [BootCamp](https://dortania.github.io/OpenCore-Post-Install/multiboot/bootcamp.html)
* Avoids poorly made DSDTs and encourages proper ACPI practices
* Avoids edge cases where info is injected several times, commonly seen with Clover
  * i.e. How would you handle SMBIOS and ACPI data injection once you booted boot.efi, but then get kicked out? The changes are already in memory and so trying to undo them can be quite dangerous. This is why Clover's method is frowned upon.

However, there are quirks in OpenCore that allow for SMBIOS injection to be macOS-limited by patching where macOS reads SMBIOS info from. The `CustomSMIOSGuid` quirk with `CustomSMBIOSMode` set to `Custom` can break in the future and so we only recommend this option in the event of certain software breaking in other OSes. For best stability, please disable these quirks.

### Does OpenCore require a fresh install?

Not at all in the event you have a "Vanilla" installation – what this refers to is whether the OS has tampered in any way, such as installing 3rd party kexts into the system volume or other unsupported modifications by Apple. When your system has been heavily tampered with, either by you or 3rd party utilities like Hackintool, we recommend a fresh install to avoid any potential issues.

Special note for Clover users: please reset your NVRAM when installing with OpenCore. Many of Clover variables can conflict with OpenCore and macOS.

* Note: Thinkpad laptops are known to be semi-bricked after an NVRAM reset in OpenCore, we recommend resetting NVRAM by updating the BIOS on these machines.

### Does OpenCore only support limited versions of macOS?

As of OpenCore 0.6.2, you can now boot every Intel version of macOS going all the way back to OS X 10.4! Proper support however will depend on your hardware, so please verify yourself: [Hardware Limitations](macos-limits.md)

::: details macOS Install Gallery

Acidanthera has tested many versions, and I myself have run many versions of OS X on my old HP DC 7900 (Core2 Quad Q8300). Here's just a small gallery of what I've tested:

![](./images/installer-guide/legacy-mac-install-md/dumpster/10.4-Tiger.png)

![](./images/installer-guide/legacy-mac-install-md/dumpster/10.5-Leopard.png)

![](./images/installer-guide/legacy-mac-install-md/dumpster/10.6-Snow-Loepard.png)

![](./images/installer-guide/legacy-mac-install-md/dumpster/10.7-Lion.png)

![](./images/installer-guide/legacy-mac-install-md/dumpster/10.8-MountainLion.png)

![](./images/installer-guide/legacy-mac-install-md/dumpster/10.9-Mavericks.png)

![](./images/installer-guide/legacy-mac-install-md/dumpster/10.10-Yosemite.png)

![](./images/installer-guide/legacy-mac-install-md/dumpster/10.12-Sierra.png)

![](./images/installer-guide/legacy-mac-install-md/dumpster/10.13-HighSierra.png)

![](./images/installer-guide/legacy-mac-install-md/dumpster/10.15-Catalina.png)

![](./images/installer-guide/legacy-mac-install-md/dumpster/11-Big-Sur.png)

:::

### Does OpenCore support older hardware?

As of right now, the majority of Intel hardware is supported so long as the OS itself does! However please refer to the [Hardware Limitations page](macos-limits.md) for more info on what hardware is supported in what versions of OS X/macOS.

Currently, Intel's Yonah and newer series CPUs have been tested properly with OpenCore.

### Does OpenCore support Windows/Linux booting?

OpenCore will automatically detect Windows without any additional configuration. With OpenCore 0.7.3, OpenLinuxBoot was added to OpenCore as an EFI driver, which will automatically detect Linux partitions. This requires either [ext4_x64.efi](https://github.com/acidanthera/OcBinaryData/blob/master/Drivers/ext4_x64.efi) or [btrfs_x64.efi](https://github.com/acidanthera/OcBinaryData/blob/master/Drivers/btrfs_x64.efi) depending on which format it used in your distro. For any OSes where their bootloader has an irregular path or name, you can simply add it to the BlessOverride section.

### Legality of Hackintoshing

Where hackintoshing sits is in a legal grey area, mainly that while this is not illegal we are in fact breaking the EULA. The reason this is not illegal:

* We are downloading macOS from [Apple's servers directly](https://github.com/acidanthera/OpenCorePkg/blob/0.6.9/Utilities/macrecovery/macrecovery.py#L125)
* We are doing this as a non-profit organization for teaching and personal use
  * People who plan to use their Hackintosh for work or want to resell them should refer to the [Psystar case](https://en.wikipedia.org/wiki/Psystar_Corporation) and their regional laws

While the EULA states that macOS should only be installed on real Macs or virtual machines running on genuine Macs ([sections 2B-i and 2B-iii](https://www.apple.com/legal/sla/docs/macOSBigSur.pdf)), there is no enforceable law that outright bans this. However, sites that repackage and modify macOS installers do potentially risk the issue of [DMCA takedowns](https://en.wikipedia.org/wiki/Digital_Millennium_Copyright_Act) and such.

* **Note**: This is not legal advice, so please make the proper assessments yourself and discuss with your lawyers if you have any concerns.

### Does macOS support NVIDIA GPUs?

Due to issues revolving around NVIDIA support in newer versions of macOS, many users come to the conclusion that macOS never supported NVIDIA GPUs. Apple supported Macs with NVIDIA GPUs (such as the 2013 MacBook Pro with a Kepler dGPU) until the release of Monterey Beta 7. While there are community-made patches to bring back support, they require SIP (System Integrity Protection) to be disabled, disabling important security features in macOS.

The other issue has to do with any newer NVIDIA GPUs, as Apple stopped shipping machines with them and thus they never had official OS support from Apple. Instead, users had to rely on NVIDIA for 3rd party drivers. Due to issues with Apple's newly introduced Secure Boot, they could no longer support the Web Drivers and thus NVIDIA couldn't publish them for newer platforms limiting them to mac OS 10.13, High Sierra.

For more info on OS support, see here: [GPU Buyers Guide](https://dortania.github.io/GPU-Buyers-Guide/)
