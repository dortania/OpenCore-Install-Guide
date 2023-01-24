# 收集文件

本节是为引导macOS收集杂项文件，我们希望你在开始之前很好地了解你的硬件，并希望在此之前制作一个Hackintosh，因为我们不会在这里深入探讨。

> 知道我的硬件是否被支持的最好的方法是什么?

请参阅 [**硬件限制页面**](macos-limits.md) ，以更好地了解macOS启动需要什么，Clover和OpenCore之间的硬件支持非常相似。

> 有什么方法可以找出我有什么硬件?

参见前一页:[查找硬件](./find-hardware.md)

[[toc]]

## 固件驱动

固件驱动程序是OpenCore在UEFI环境中使用的驱动程序。它们主要是通过扩展OpenCore的补丁功能或在OpenCore选择器(例如HFS驱动器)中向您显示不同类型的驱动器来启动机器。

* **位置说明**: 这些文件 **必须** 放在 `EFI/OC/Drivers/`目录下

### 通用

::: tip 必需的驱动程序

对于大多数系统，你只需要 2个 `.efi` 的驱动程序启动和运行:

* [HfsPlus.efi](https://github.com/acidanthera/OcBinaryData/blob/master/Drivers/HfsPlus.efi)(<span style="color:red">必需</span>)
  * 需要查看HFS卷(例如:macOS安装程序和恢复分区/映像). **不要混合使用其他HFS驱动**
  * 对于Sandy Bridge和更老的(以及低端Ivy Bridge(i3和Celerons))，请参阅下面的传统部分
* [OpenRuntime.efi](https://github.com/acidanthera/OpenCorePkg/releases)(<span style="color:red">必需</span>)
  * 替代 [AptioMemoryFix.efi](https://github.com/acidanthera/AptioFixPkg), 用作OpenCore的扩展，以帮助修补boot.efi用于NVRAM修复和更好的内存管理。
  * 提醒，这是捆绑在我们之前下载的OpenCorePkg中

:::

### 传统用户

除上述外，如果您的硬件不支持UEFI(2011年和更早的时代)，那么您将需要以下内容。请密切关注每一个条目，因为你可能不需要全部使用这4个条目:

* [OpenUsbKbDxe.efi](https://github.com/acidanthera/OpenCorePkg/releases)
  * 用于在 **行DuetPkg的传统系统**,上的OpenCore picker， [不推荐，甚至在UEFI(Ivy Bridge和更新的)上有害)](https://applelife.ru/threads/opencore-obsuzhdenie-i-ustanovka.2944066/page-176#post-856653)
* [HfsPlusLegacy.efi](https://github.com/acidanthera/OcBinaryData/blob/master/Drivers/HfsPlusLegacy.efi)
  * HfsPlus的传统变体，用于缺乏RDRAND指令支持的系统。这通常见于Sandy Bridge和更老的(以及低端的Ivy Bridge(i3和Celerons))
  * 不要将其与HfsPlus.efi混合使用，根据您的硬件选择其中之一
* [OpenPartitionDxe](https://github.com/acidanthera/OpenCorePkg/releases)
  * 需要在OS X 10.7到10.9上引导恢复
    * 此文件与OpenCorePkg捆绑在EFI/OC/Drivers下
    * 注意:OpenDuet用户(例如:没有UEFI)将内置此驱动程序，不需要它

这些文件将放在EFI的Drivers文件夹中

::: details 32位的详细信息

对于那些使用32位cpu的处理器，您也需要获取这些驱动程序

* [HfsPlus32](https://github.com/acidanthera/OcBinaryData/blob/master/Drivers/HfsPlus32.efi)
  * 替代HfsPlusLegacy，但用于32位cpu，不要将其与其他HFS.efi驱动程序混合

:::

## Kexts

kext是**k**ernel**ext**ension,你可以把它想象成macOS的驱动程序，这些文件将进入你EFI中的Kexts文件夹。

* **Windows和Linux注意**: kext看起来就像操作系统中的普通文件夹，**仔细检查** 你正在安装的文件夹是否有可见的.kext扩展名(如果缺少，不要手动添加)。
  * 如果任何kext还包含一个 `.dSYM` 文件，你可以简单地删除它。它们只用于调试目的。
* **位置注意**: 这些文件 **必须** 放在 `EFI/OC/Kexts/` 目录下。

下面列出的大多数kext都可以在[build repo](http://dortania.github.io/builds/)中**预编译**。这里的kext在每次有新的提交时都被编译。

### 必须拥有

::: tip 必需的kext

如果没有下面的2个，系统就无法启动:

* [Lilu](https://github.com/acidanthera/Lilu/releases)(<span style="color:red">必需</span>)
  * 一个为许多进程打补丁的kext，这是AppleALC、WhateverGreen、VirtualSMC和许多其他kext所必需的。没有Lilu，他们就无法工作。
  * 请注意，虽然Lilu早在Mac OS X 10.4版本就支持，但许多插件只能在较新的版本上使用。
* [VirtualSMC](https://github.com/acidanthera/VirtualSMC/releases)(<span style="color:red">必需</span>)
  * 模拟真实mac上的SMC芯片，没有这个macOS将无法启动
  * 要求Mac OS x10.4或更新版本

:::

### VirtualSMC插件

以下插件不需要引导,仅仅添加额外的硬件监控等系统功能。除非另有说明，这些插件都是随VirtualSMC附带的

::: tip

虽然VirtualSMC支持10.4，但插件可能需要更新的版本。

:::

* SMCProcessor.kext
  * 用于监控Intel CPU温度
  * 不适用于AMD CPU系统
  * 要求Mac OS X 10.7或更新版本
* [SMCAMDProcessor](https://github.com/trulyspinach/SMCAMDProcessor)
  * 用于监控AMD zen系统的CPU温度
  * **正在积极开发中，可能不稳定**
  * 需要 AMDRyzenCPUPowerManagement (参见 [AMD CPU 专用的 Kexts](ktext.md#amd-cpu-specific-kexts))
  * 需要macOS 10.13或更新版本
* [SMCRadeonGPU](https://github.com/aluveitie/RadeonSensor)
  * 用于监控AMD GPU系统上的GPU温度
  * 需要来自相同存储库的RadeonSensor
  * 需要macOS 11或更新版本
* SMCSuperIO.kext
  * 用于监控风扇转速
  * 不适用于基于AMD CPU的系统
  * 需要Mac OS X 10.6或更新的版本
* SMCLightSensor.kext
  * 用于笔记本电脑的环境光传感器
  * **如果你没有环境光传感器，请不要使用。 (例如台式电脑), 否则会导致问题**
  * 需要Mac OS X 10.6或更新的版本
* SMCBatteryManager.kext
  * 用于测量笔记本电脑的电池读数
  * **不要在台式机上使用**
  * 需要Mac OS X 10.4或更新的版本
* SMCDellSensors.kext
  * 允许对支持系统管理模式(SMM)的戴尔机器的风扇进行更精细的监控和控制
  * **如果你没有支持的Dell机器，请不要使用**, 主要是Dell笔记本电脑可以从这个kext中受益
  * 需要Mac OS X 10.7或更新的版本

### 显示

* [WhateverGreen](https://github.com/acidanthera/WhateverGreen/releases)(<span style="color:red">必需</span>)
  * 用于图形补丁、DRM修复、板号检查、帧缓冲区修复等;所有gpu都受益于这个kext。
  * 注意SSDT-PNLF.dsl文件只适用于笔记本电脑和AIOs，请参阅[开始使用ACPI](https://dortania.github.io/Getting-Started-With-ACPI/) 以获取更多信息
  * 需要Mac OS X 10.6或更新的版本

### 声音

* [AppleALC](https://github.com/acidanthera/AppleALC/releases)
  * 用于AppleHDA补丁，允许支持大多数集成的声音控制器
  * AppleALCU.kext 是AppleALC的精简版，只支持数字音频，但你仍然可以使用 AppleALC.kext 在数字音频系统上
  * AMD 15h/16h 可能使用AppleALC有问题。而 Ryzen/Threadripper 系统很少支持mic
  * 需要OS X 10.4或更新版本
  
::: details 传统声音 Kext

对于那些计划引导10.7或更老版本的用户，可以选择这些kext:

* [VoodooHDA](https://sourceforge.net/projects/voodoohda/)
  * 需要OS X 10.6或更新版本
  
* [VoodooHDA-FAT](https://github.com/khronokernel/Legacy-Kexts/blob/master/FAT/Zip/VoodooHDA.kext.zip)
  * 与上述类似，但是支持32位和64位内核，因此非常适合OS X 10.4-5引导和32位的cpu

:::

### 网络适配器

在这里，我们假设您知道系统有什么网卡，提醒您产品规格页面很可能会列出网卡的类型。

* [IntelMausi](https://github.com/acidanthera/IntelMausi/releases)
  * 对于大多数Intel网卡，基于I211的芯片组将需要SmallTreeIntel82576 kext
  * Intel的82578、82579、I217、I218和I219网卡得到官方支持
  * 需要OS X 10.9或更新版本，10.6-10.8旧的操作系统用户可以使用IntelSnowMausi代替
* [AppleIGB](https://github.com/donatengit/AppleIGB/releases)
  * 需要在macOS Monterey及以上版本上运行I211网卡
  * 可能在一些网卡上有不稳定的问题，建议留在Big Sur上并使用SmallTree
  * 大多数运行Intel网卡的AMD主板都需要
  * 需要macOS 12及以上版本
* [SmallTreeIntel82576](https://github.com/khronokernel/SmallTree-I211-AT-patch/releases)
  * 在macOS版本上运行到Big Sur的I211网卡需要，基于SmallTree kext，但补丁支持I211(在macOS 12 [Monterey](./extras/monterey.md#ethernet) 或以上不起作用)
  * 大多数运行Intel网卡的AMD主板都需要
  * 需要OS X 10.9-12(v1.0.6)， macOS 10.13-14(v1.2.5)， macOS 10.15+(v1.3.0)
* [AtherosE2200Ethernet](https://github.com/Mieze/AtherosE2200Ethernet/releases)
  * 需要Atheros和Killer NICs
  * 需要OS X 10.8或更新的版本
  * 注意:Atheros Killer E2500模型实际上是基于Realtek的，对于这些系统，请使用[RealtekRTL8111](https://github.com/Mieze/RTL8111_driver_for_OS_X/releases) 代替
* [RealtekRTL8111](https://github.com/Mieze/RTL8111_driver_for_OS_X/releases)
  * 用于Realtek的千兆以太网
  * v2.2.0及以下版本需要OS X 10.8及以上，v2.2.2版本需要macOS 10.12及以上，v2.3.0及以上版本需要macOS 10.14及以上
  * **注意:** 有时最新版本的kext可能无法在让您的以太网正常工作。如果你看到这个问题，请尝试旧版本。
* [LucyRTL8125Ethernet](https://www.insanelymac.com/forum/files/file/1004-lucyrtl8125ethernet/)
  * 用于Realtek的2.5Gb以太网
  * 需要macOS 10.15或更新的版本
* 对于英特尔的I225-V网卡，补丁在桌面 [Comet Lake DeviceProperties](config.plist/comet-lake.md#deviceproperties) 部分中提到，不需要kext。
  * 需要macOS 10.15或更新的版本
* 对于英特尔的I350网卡，补丁在HEDT [Sandy and Ivy Bridge-E DeviceProperties](config-HEDT/ivy-bridge-e.md#deviceproperties) 部分中提到，不需要kext。
  * 需要OS X 10.10或更新的版本

::: details 传统网络适配器的Kexts

无论是传统的macOS安装还是旧的PC硬件。

* [AppleIntele1000e](https://github.com/chris1111/AppleIntelE1000e/releases)
  * 主要用于基于10/100MBe的Intel以太网控制器
  * 需要10.6或更新的版本
* [RealtekRTL8100](https://www.insanelymac.com/forum/files/file/259-realtekrtl8100-binary/)
  * 主要用于基于10/100MBe的Realtek以太网控制器
  * 需要macOS 10.12或更新的v2.0.0+
* [BCM5722D](https://github.com/chris1111/BCM5722D/releases)
  * 主要适用于基于BCM5722的Broadcom以太网控制器
  * 需要OS X 10.6或更新的版本

:::

还请记住，某些网卡实际上在macOS中是原生支持的:

::: details 原生网络适配器

#### Aquantia 系列

```md
# AppleEthernetAquantiaAqtion.kext
pci1d6a,1    = Aquantia AQC107
pci1d6a,d107 = Aquantia AQC107
pci1d6a,7b1  = Aquantia AQC107
pci1d6a,80b1 = Aquantia AQC107
pci1d6a,87b1 = Aquantia AQC107
pci1d6a,88b1 = Aquantia AQC107
pci1d6a,89b1 = Aquantia AQC107
pci1d6a,91b1 = Aquantia AQC107
pci1d6a,92b1 = Aquantia AQC107
pci1d6a,c0   = Aquantia AQC113
pci1d6a,4c0  = Aquantia AQC113
```

**注意**: 由于许多aquania NICs上有一些过时的固件，您可能需要在Linux/Windows中更新固件，以确保它与macos兼容。

#### Intel 系列

```md
# AppleIntel8254XEthernet.kext
pci8086,1096 = Intel 80003ES2LAN
pci8086,100f = Intel 82545EM
pci8086,105e = Intel 82571EB/82571GB

# AppleIntelI210Ethernet.kext
pci8086,1533 = Intel I210
pci8086,15f2 = Intel I225LM (Added in macOS 10.15)

# Intel82574L.kext
pci8086,104b = Intel 82566DC
pci8086,10f6 = Intel 82574L

```

#### Broadcom 系列

```md
# AppleBCM5701Ethernet.kext
pci14e4,1684 = Broadcom BCM5764M
pci14e4,16b0 = Broadcom BCM57761
pci14e4,16b4 = Broadcom BCM57765
pci14e4,1682 = Broadcom BCM57762
pci14e4,1686 = Broadcom BCM57766
```

:::

### USB

* USBToolBox ([tool](https://github.com/USBToolBox/tool) and [kext](https://github.com/USBToolBox/kext))
  * USB mapping tool for Windows and macOS.
  * It is highly advisable to map your USB ports before you install macOS to avoid any port limit issues
  * Features
    * Supports mapping from Windows and macOS (Linux support in progress)
    * Can build a map using either the USBToolBox kext or native Apple kexts (AppleUSBHostMergeProperties)
    * Supports multiple ways of matching
    * Supports companion ports (on Windows)

* [XHCI-unsupported](https://github.com/RehabMan/OS-X-USB-Inject-All)
  * Needed for non-native USB controllers
  * AMD CPU based systems don't need this
  * Common chipsets needing this:
    * H370
    * B360
    * H310
    * Z390 (not needed on Mojave and newer)
    * X79
    * X99
    * ASRock Intel boards (B460/Z490+ boards do not need it however)

### WiFi 和 蓝牙

#### Non-Native Bluetooth Cards

* [BlueToolFixup](https://github.com/acidanthera/BrcmPatchRAM/releases)
  * Patches the macOS 12+ Bluetooth stack to support third-party cards
  * Needed for all non-native (non-Apple Broadcom, Intel, etc) Bluetooth cards
  * Included in the [BrcmPatchRAM](#broadcom) zip
  * **Do not use on macOS 11 and earlier**

#### Intel

* [AirportItlwm](https://github.com/OpenIntelWireless/itlwm/releases)
  * Adds support for a large variety of Intel wireless cards and works natively in recovery thanks to IO80211Family integration
  * Requires macOS 10.13 or newer and requires Apple's Secure Boot to function correctly
* [Itlwm](https://github.com/OpenIntelWireless/itlwm/releases)
  * Alternative to AirportItlwm for systems where Apple's Secure Boot cannot be enabled
  * Requires [Heliport](https://github.com/OpenIntelWireless/HeliPort/releases)
  * It will be treated as an Ethernet card, and you will have to connect to Wi-Fi via Heliport
  * **Does not work in macOS recovery**
* [IntelBluetoothFirmware](https://github.com/OpenIntelWireless/IntelBluetoothFirmware/releases)
  * Adds Bluetooth support to macOS when paired with an Intel wireless card
  * Use IntelBTPatcher (included) in addition to patch bugs in macOS
  * Requires macOS 10.13 or newer
  * On macOS 10.13 through 11, you also need IntelBluetoothInjector (included)

::: details More info on enabling AirportItlwm

To enable AirportItlwm support with OpenCore, you'll need to either:

* Enable `Misc -> Security -> SecureBootModel` by either setting it as `Default` or some other valid value
  * This is discussed both later on in this guide and in the post-install guide: [Apple Secure Boot](https://dortania.github.io/OpenCore-Post-Install/universal/security/applesecureboot.html)
* If you cannot enable SecureBootModel, you can still force inject IO80211Family (**highly discouraged**)
  * Set the following under `Kernel -> Force` in your config.plist (discussed later in this guide):
  
![](./images/ktext-md/force-io80211.png)

:::

#### Broadcom

* [AirportBrcmFixup](https://github.com/acidanthera/AirportBrcmFixup/releases)
  * Used for patching non-Apple/non-Fenvi Broadcom cards, **will not work on Intel, Killer, Realtek, etc**
  * Requires OS X 10.10 or newer
  * For Big Sur see [Big Sur Known Issues](./extras/big-sur#known-issues) for extra steps regarding AirPortBrcm4360 drivers.
* [BrcmPatchRAM](https://github.com/acidanthera/BrcmPatchRAM/releases)
  * Used for uploading firmware on Broadcom Bluetooth chipset, required for all non-Apple/non-Fenvi Airport cards.
  * To be paired with BrcmFirmwareData.kext
    * BrcmPatchRAM3 for 10.15+ (must be paired with BrcmBluetoothInjector)
    * BrcmPatchRAM2 for 10.11-10.14
    * BrcmPatchRAM for 10.8-10.10
  * On macOS 10.11 through macOS 11, you also need BrcmBluetoothInjector (included)

::: details BrcmPatchRAM Load order

The order in `Kernel -> Add` should be:

1. BrcmBluetoothInjector (if needed)
2. BrcmFirmwareData
3. BrcmPatchRAM3 (or BrcmPatchRAM2/BrcmPatchRAM)

BlueToolFixup can be anywhere after Lilu.

However ProperTree will handle this for you, so you need not concern yourself

:::

### AMD CPU 专用 kexts

* [XLNCUSBFIX](https://cdn.discordapp.com/attachments/566705665616117760/566728101292408877/XLNCUSBFix.kext.zip)
  * USB fix for AMD FX systems, not recommended for Ryzen
  * Requires macOS 10.13 or newer
* [VoodooHDA](https://sourceforge.net/projects/voodoohda/)
  * Audio for FX systems and front panel Mic+Audio support for Ryzen system, do not mix with AppleALC. Audio quality is noticeably worse than AppleALC on Zen CPUs
  * Requires OS X 10.6 or newer
  * Using this kext on macOS 11.3 and above is not recommended as you need to modify the macOS filesystem and disable SIP
* [AMDRyzenCPUPowerManagement](https://github.com/trulyspinach/SMCAMDProcessor)
  * CPU power management for Ryzen systems
  * **Under active development, potentially unstable**
  * Requires macOS 10.13 or newer

### 额外

* [AppleMCEReporterDisabler](https://github.com/acidanthera/bugtracker/files/3703498/AppleMCEReporterDisabler.kext.zip)
  * Required on macOS 12.3 and later on AMD systems, and on macOS 10.15 and later on dual-socket Intel systems.
  * Affected SMBIOSes:
    * MacPro6,1
    * MacPro7,1
    * iMacPro1,1
* [CpuTscSync](https://github.com/lvs1974/CpuTscSync/releases)
  * Needed for syncing TSC on some of Intel's HEDT and server motherboards, without this macOS may be extremely slow or even unbootable.
  * **Does not work on AMD CPUs**
  * Requires OS X 10.8 or newer
* [NVMeFix](https://github.com/acidanthera/NVMeFix/releases)
  * Used for fixing power management and initialization on non-Apple NVMe
  * Requires macOS 10.14 or newer
* [SATA-Unsupported](https://github.com/khronokernel/Legacy-Kexts/blob/master/Injectors/Zip/SATA-unsupported.kext.zip)
  * Adds support for a large variety of SATA controllers, mainly relevant for laptops which have issues seeing the SATA drive in macOS. We recommend testing without this first.
  * Big Sur+ Note: [CtlnaAHCIPort](https://github.com/dortania/OpenCore-Install-Guide/blob/master/extra-files/CtlnaAHCIPort.kext.zip) will need to be used instead due to numerous controllers being dropped from the binary itself
    * Catalina and older need not concern
* [CPUTopologyRebuild](https://github.com/b00t0x/CpuTopologyRebuild)
  * An experimental Lilu plugin that optimizes Alder Lake's heterogeneous core configuration. **Only for Alder Lake CPUs**
* [RestrictEvents](https://github.com/acidanthera/RestrictEvents)
  * Patch various functions of macOS, see [the README](https://github.com/acidanthera/RestrictEvents#boot-arguments) for more info

::: details Legacy SATA Kexts

* [AHCIPortInjector](https://github.com/khronokernel/Legacy-Kexts/blob/master/Injectors/Zip/AHCIPortInjector.kext.zip)
  * Legacy SATA/AHCI injector, mainly relevant for older machines of the Penryn era
* [ATAPortInjector](https://github.com/khronokernel/Legacy-Kexts/blob/master/Injectors/Zip/ATAPortInjector.kext.zip)
  * Legacy ATA injector, mainly relevant for IDE and ATA devices(ie. when no AHCI option is present in the BIOS)
  
:::

### 笔记本电脑输入

To figure out what kind of keyboard and trackpad you have, check Device Manager in Windows or `dmesg | grep -i input` in Linux

::: warning

Most laptop keyboards are PS2! You will want to grab VoodooPS2 even if you have an I2C, USB, or SMBus trackpad.

:::

#### PS2键盘/触摸板

* [VoodooPS2](https://github.com/acidanthera/VoodooPS2/releases)
  * Works with various PS2 keyboards, mice, and trackpads
  * Requires macOS 10.11 or newer for MT2 (Magic Trackpad 2) functions
* [RehabMan's VoodooPS2](https://bitbucket.org/RehabMan/os-x-voodoo-ps2-controller/downloads/)
  * For older systems with PS2 keyboards, mice, and trackpads, or when you don't want to use VoodooInput
  * Supports macOS 10.6+

#### SMBus 触摸板

* [VoodooRMI](https://github.com/VoodooSMBus/VoodooRMI/releases)
  * For systems with Synaptics SMBus trackpads
  * Requires macOS 10.11 or newer for MT2 functions
  * Depends on Acidanthera's VoodooPS2
* [VoodooSMBus](https://github.com/VoodooSMBus/VoodooSMBus/releases)
  * For systems with ELAN SMBus Trackpads
  * Supports macOS 10.14 or newer currently

#### I2C/USB HID 设备

* [VoodooI2C](https://github.com/VoodooI2C/VoodooI2C/releases)
  * Supports macOS 10.11+
  * Attaches to I2C controllers to allow plugins to talk to I2C trackpads
  * USB devices using the below plugins still need VoodooI2C
  * Must be paired with one or more plugins shown below:

::: tip VoodooI2C Plugins

| Connection type | Plugin | Notes |
| :--- | :--- | :--- |
| Multitouch HID | VoodooI2CHID | Can be used with I2C/USB Touchscreens and Trackpads |
| ELAN Proprietary | VoodooI2CElan | ELAN1200+ require VoodooI2CHID instead |
| FTE1001 touchpad | VoodooI2CFTE | |
| Atmel Multitouch Protocol | VoodooI2CAtmelMXT | |
| Synaptics HID | [VoodooRMI](https://github.com/VoodooSMBus/VoodooRMI/releases) | I2C Synaptic Trackpads (Requires VoodooI2C ONLY for I2C mode) |
| Alps HID | [AlpsHID](https://github.com/blankmac/AlpsHID/releases) | Can be used with USB or I2C Alps trackpads. Mostly seen on Dell laptops and some HP EliteBook models |

:::

#### Misc

* [ECEnabler](https://github.com/1Revenger1/ECEnabler/releases)
  * Fixes reading battery status on many devices (Allows reading EC fields over 8 bits long)
  * Supports OS X 10.7 and above (not needed on 10.4 - 10.6)
* [BrightnessKeys](https://github.com/acidanthera/BrightnessKeys/releases)
  * Fixes brightness keys automatically

Please refer to [Kexts.md](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/Kexts.md) for a full list of supported kexts

## SSDTs

So you see all those SSDTs in the AcpiSamples folder and wonder whether you need any of them. For us, we will be going over what SSDTs you need in **your specific ACPI section of the config.plist**, as the SSDTs you need are platform specific. With some even system specific where they need to be configured and you can easily get lost if I give you a list of SSDTs to choose from now.

[Getting started with ACPI](https://dortania.github.io/Getting-Started-With-ACPI/) has an extended section on SSDTs including compiling them on different platforms.

A quick TL;DR of needed SSDTs(This is source code, you will have to compile them into a .aml file):

### 台式电脑

| Platforms | **CPU** | **EC** | **AWAC** | **NVRAM** | **USB** |
| :-------: | :-----: | :----: | :------: | :-------: | :-----: |
| Penryn | N/A | [SSDT-EC](https://dortania.github.io/Getting-Started-With-ACPI/Universal/ec-fix.html) | N/A | N/A | N/A |
| Lynnfield and Clarkdale | ^^ | ^^ | ^^ | ^^ | ^^ |
| SandyBridge | [CPU-PM](https://dortania.github.io/OpenCore-Post-Install/universal/pm.html#sandy-and-ivy-bridge-power-management) (Run in Post-Install) | ^^ | ^^ | ^^ | ^^ |
| Ivy Bridge | ^^ | ^^ | ^^ | ^^ | ^^ |
| Haswell | [SSDT-PLUG](https://dortania.github.io/Getting-Started-With-ACPI/Universal/plug.html) | ^^ | ^^ | ^^ | ^^ |
| Broadwell | ^^ | ^^ | ^^ | ^^ | ^^ |
| Skylake | ^^ | [SSDT-EC-USBX](https://dortania.github.io/Getting-Started-With-ACPI/Universal/ec-fix.html) | ^^ | ^^ | ^^ |
| Kaby Lake | ^^ | ^^ | ^^ | ^^ | ^^ |
| Coffee Lake | ^^ | ^^ | [SSDT-AWAC](https://dortania.github.io/Getting-Started-With-ACPI/Universal/awac.html) | [SSDT-PMC](https://dortania.github.io/Getting-Started-With-ACPI/Universal/nvram.html) | ^^ |
| Comet Lake | ^^ | ^^ | ^^ | N/A | [SSDT-RHUB](https://dortania.github.io/Getting-Started-With-ACPI/Universal/rhub.html) |
| AMD (15/16h) | N/A | ^^ | N/A | ^^ | N/A |
| AMD (17/19h) | [SSDT-CPUR for B550 and A520](https://github.com/dortania/Getting-Started-With-ACPI/blob/master/extra-files/compiled/SSDT-CPUR.aml) | ^^ | ^^ | ^^ | ^^ |

### 高端台式电脑

| Platforms | **CPU** | **EC** | **RTC** | **PCI** |
| :-------: | :-----: | :----: | :-----: | :-----: |
| Nehalem and Westmere | N/A | [SSDT-EC](https://dortania.github.io/Getting-Started-With-ACPI/Universal/ec-fix.html) | N/A | N/A |
| Sandy Bridge-E | ^^ | ^^ | ^^ | [SSDT-UNC](https://dortania.github.io/Getting-Started-With-ACPI/Universal/unc0) |
| Ivy Bridge-E | ^^ | ^^ | ^^ | ^^ |
| Haswell-E | [SSDT-PLUG](https://dortania.github.io/Getting-Started-With-ACPI/Universal/plug.html) | [SSDT-EC-USBX](https://dortania.github.io/Getting-Started-With-ACPI/Universal/ec-fix.html) | [SSDT-RTC0-RANGE](https://dortania.github.io/Getting-Started-With-ACPI/Universal/awac.html) | ^^ |
| Broadwell-E | ^^ | ^^ | ^^ | ^^ |
| Skylake-X | ^^ | ^^ | ^^ | N/A |

### 笔记本电脑

| Platforms | **CPU** | **EC** | **Backlight** | **I2C Trackpad** | **AWAC** | **USB** | **IRQ** |
| :-------: | :-----: | :----: | :-----------: | :--------------: | :------: | :-----: | :-----: |
| Clarksfield and Arrandale | N/A | [SSDT-EC](https://dortania.github.io/Getting-Started-With-ACPI/Universal/ec-fix.html) | [SSDT-PNLF](https://dortania.github.io/Getting-Started-With-ACPI/Laptops/backlight.html) | N/A | N/A | N/A | [IRQ SSDT](https://dortania.github.io/Getting-Started-With-ACPI/Universal/irq.html) |
| SandyBridge | [CPU-PM](https://dortania.github.io/OpenCore-Post-Install/universal/pm.html#sandy-and-ivy-bridge-power-management) (Run in Post-Install) | ^^ | ^^ | ^^ | ^^ | ^^ | ^^ |
| Ivy Bridge | ^^ | ^^ | ^^ | ^^ | ^^ | ^^ | ^^ |
| Haswell | [SSDT-PLUG](https://dortania.github.io/Getting-Started-With-ACPI/Universal/plug.html) | ^^ | ^^ | [SSDT-GPI0](https://dortania.github.io/Getting-Started-With-ACPI/Laptops/trackpad.html) | ^^ | ^^ | ^^ |
| Broadwell | ^^ | ^^ | ^^ | ^^ | ^^ | ^^ | ^^ |
| Skylake | ^^ | [SSDT-EC-USBX](https://dortania.github.io/Getting-Started-With-ACPI/Universal/ec-fix.html) | ^^ | ^^ | ^^ | ^^ | N/A |
| Kaby Lake | ^^ | ^^ | ^^ | ^^ | ^^ | ^^ | ^^ |
| Coffee Lake (8th Gen) and Whiskey Lake | ^^ | ^^ | [SSDT-PNLF](https://dortania.github.io/Getting-Started-With-ACPI/Laptops/backlight.html) | ^^ | [SSDT-AWAC](https://dortania.github.io/Getting-Started-With-ACPI/Universal/awac.html) | ^^ | ^^ |
| Coffee Lake (9th Gen) | ^^ | ^^ | ^^ | ^^ | ^^ | ^^ | ^^ |
| Comet Lake | ^^ | ^^ | ^^ | ^^ | ^^ | ^^ | ^^ |
| Ice Lake | ^^ | ^^ | ^^ | ^^ | ^^ | [SSDT-RHUB](https://dortania.github.io/Getting-Started-With-ACPI/Universal/rhub.html) | ^^ |

Continuing:

| Platforms | **NVRAM** | **IMEI** |
| :-------: | :-------: | :------: |
| Clarksfield and Arrandale | N/A | N/A |
| Sandy Bridge | ^^| [SSDT-IMEI](https://dortania.github.io/Getting-Started-With-ACPI/Universal/imei.html) |
| Ivy Bridge | ^^ | ^^ |
| Haswell | ^^ | N/A |
| Broadwell | ^^ | ^^ |
| Skylake | ^^ | ^^ |
| Kaby Lake | ^^ | ^^ |
| Coffee Lake (8th Gen) and Whiskey Lake | ^^ | ^^ |
| Coffee Lake (9th Gen) | [SSDT-PMC](https://dortania.github.io/Getting-Started-With-ACPI/Universal/nvram.html) | ^^ |
| Comet Lake | N/A | ^^ |
| Ice Lake | ^^ | ^^ |

# Now with all this done, head to [Getting Started With ACPI](https://dortania.github.io/Getting-Started-With-ACPI/)
