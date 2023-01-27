# 硬件限制

在开始安装macOS之前，你需要了解许多硬件限制。这是因为苹果支持的硬件数量有限，所以我们要么受到苹果的限制，要么受到社区创建的补丁的限制。

需要验证的主要硬件部分有:

[[toc]]

有关该主题的更详细指南，请参见此处：

* [显卡购买指南](https://sumingyd.github.io/GPU-Buyers-Guide/)
  * 检查您的GPU是否得到支持，以及您可以运行哪个版本的macOS。
* [无线网卡购买指南](https://sumingyd.github.io/Wireless-Buyers-Guide/)
  * 检查是否支持你的WiFi卡。
* [避免购买指南](https://sumingyd.github.io/Anti-Hackintosh-Buyers-Guide/)
  * 关于应该避免什么以及你的硬件可能会遇到什么陷阱的总体指南。（BTW. 这里是告诉你哪些硬件不被macOS支持且没有补丁可以被驱动）

## CPU 支持

对于CPU支持，我们有以下细分:

* 32和64位cpu都支持
  * 但这需要操作系统支持你的架构，请参阅下面的CPU要求部分
* 支持 Intel 的桌面cpu。
  * Yonah 到 Comet Lake 得到了本指南的支持。
* Intel 高端台式机和服务器的cpu
  * Nehalem到Cascade Lake X得到了本指南的支持。
* Intel Core “i” 和至强系列的笔记本电脑cpu
  * Arrandale 到 Ice Lake 得到了本指南的支持。
  * 请注意，不支持Mobile Atoms  Celelron和 Pentum CPU
* AMD的桌面Bulldozer(15H)，Jaguar（16H）和Ryzen(17h) CPU
  * 笔记本电脑cpu **不**支持
  * 注意，AMD并不支持macOS的所有功能，请参见下文

**欲了解更多深入信息，请参阅这里: [避免购买指南](https://sumingyd.github.io/Anti-Hackintosh-Buyers-Guide/)**

:::details  详细的CPU要求

架构需求

* 32位cpu支持10.4.1至10.6.8
  * 注意10.7.x需要64位用户空间，将32位cpu限制为10.6
* 从10.4.1到当前支持64位cpu

SSE要求:

* 所有Intel版本的OS X/macOS都需要SSE3
* 所有64位版本的OS X/macOS都需要SSSE3
  * F对于缺少SSSE3的cpu(例如某些64位奔腾)，我们建议运行32位用户空间 (`i386-user32`)
* macOS 10.12及更新版本需要SSE4
* macOS 10.14和更新版本需要SSE4.2
  * SSE4.1 cpu支持 [telemetrap.kext](https://forums.macrumors.com/threads/mp3-1-others-sse-4-2-emulation-to-enable-amd-metal-driver.2206682/post-28447707)
  * 较新的AMD驱动程序也需要SSE4.2的金属支持。要解决这个问题，请参阅这里:[MouSSE: SSE4.2 emulation](https://forums.macrumors.com/threads/mp3-1-others-sse-4-2-emulation-to-enable-amd-metal-driver.2206682/)

固件要求:

* OS X 10.4.1到10.4.7需要EFI32(即IA32(32位)版本的OpenCore)
  * OS X 10.4.8到10.7.5支持EFI32和EFI64
* OS X 10.8及更新版本需要EFI64(即x64(64位)版本的OpenCore)
* OS X 10.7到10.9需要OpenPartitionDxe.efi启动恢复分区

内核要求:

* 由于只支持32位内核空间，OS X 10.4和10.5需要32位kext
  * OS X 10.6和10.7同时支持32位和64位内核空间
* OS X 10.8及更新版本由于只支持64位内核空间，因此需要64位kext
  * 运行`lipo -archs` 以了解您的kext支持的体系结构(请记住在二进制文件本身而不是.kext包上运行)

核心/线程数限制:

* OS X 10.10及以下版本可能无法以超过24个线程启动 (明显表现为`mp_cpus_call_wait() timeout` panic)
* OS X 10.11及更新版本有64线程限制
* `cpus=` 引导参数可以作为一个解决方案，或者禁用超线程

特别注意事项:

* Lilu和插件需要10.8或更新才能运行
  * 我们建议在OS X的老版本中运行FakeSMC
* OS X 10.6及更早版本要求启用RebuildAppleMemoryMap
  * 这是为了解决早期内核问题

:::

:::details 详细的Intel CPU支持图表

基于普通内核的支持(即没有修改):

| CPU Generation | 初始支持 | 最后支持版本 | Notes | CPUID |
| :--- | :--- | :--- | :--- | :--- |
| [Pentium 4](https://en.wikipedia.org/wiki/Pentium_4) | 10.4.1 | 10.5.8 | Only used in dev kits | 0x0F41 |
| [Yonah](https://en.wikipedia.org/wiki/Yonah_(microprocessor)) | 10.4.4 | 10.6.8 | 32-Bit | 0x0006E6 |
| [Conroe](https://en.wikipedia.org/wiki/Conroe_(microprocessor)), [Merom](https://en.wikipedia.org/wiki/Merom_(microprocessor)) | 10.4.7 | 10.11.6 | No SSE4 | 0x0006F2 |
| [Penryn](https://en.wikipedia.org/wiki/Penryn_(microarchitecture)) | 10.4.10 | 10.13.6 | No SSE4.2 | 0x010676 |
| [Nehalem](https://en.wikipedia.org/wiki/Nehalem_(microarchitecture)) | 10.5.6 | <span style="color:green"> Current </span> | N/A | 0x0106A2 |
| [Lynnfield](https://en.wikipedia.org/wiki/Lynnfield_(microprocessor)), [Clarksfield](https://en.wikipedia.org/wiki/Clarksfield_(microprocessor)) | 10.6.3 | ^^ | No iGPU support 10.14+ | 0x0106E0 |
| [Westmere, Clarkdale, Arrandale](https://en.wikipedia.org/wiki/Westmere_(microarchitecture)) | 10.6.4 | ^^ | ^^ | 0x0206C0 |
| [Sandy Bridge](https://en.wikipedia.org/wiki/Sandy_Bridge) | 10.6.7 | ^^ | ^^ | 0x0206A0(M/H) |
| [Ivy Bridge](https://en.wikipedia.org/wiki/Ivy_Bridge_(microarchitecture)) | 10.7.3 | ^^ | No iGPU support 12+ | 0x0306A0(M/H/G) |
| [Ivy Bridge-E5](https://en.wikipedia.org/wiki/Ivy_Bridge_(microarchitecture)) | 10.9.2 | ^^ | N/A | 0x0306E0 |
| [Haswell](https://en.wikipedia.org/wiki/Haswell_(microarchitecture)) | 10.8.5 | ^^ | ^^ | 0x0306C0(S) |
| [Broadwell](https://en.wikipedia.org/wiki/Broadwell_(microarchitecture)) | 10.10.0 | ^^ | ^^ | 0x0306D4(U/Y) |
| [Skylake](https://en.wikipedia.org/wiki/Skylake_(microarchitecture)) | 10.11.0 | ^^ | ^^ | 0x0506e3(H/S) 0x0406E3(U/Y) |
| [Kaby Lake](https://en.wikipedia.org/wiki/Kaby_Lake) | 10.12.4 | ^^ | ^^ | 0x0906E9(H/S/G) 0x0806E9(U/Y) |
| [Coffee Lake](https://en.wikipedia.org/wiki/Coffee_Lake) | 10.12.6 | ^^ | ^^ | 0x0906EA(S/H/E) 0x0806EA(U)|
| [Amber](https://en.wikipedia.org/wiki/Kaby_Lake#List_of_8th_generation_Amber_Lake_Y_processors), [Whiskey](https://en.wikipedia.org/wiki/Whiskey_Lake_(microarchitecture)), [Comet Lake](https://en.wikipedia.org/wiki/Comet_Lake_(microprocessor)) | 10.14.1 | ^^ | ^^ | 0x0806E0(U/Y) |
| [Comet Lake](https://en.wikipedia.org/wiki/Comet_Lake_(microprocessor)) | 10.15.4 | ^^ | ^^ | 0x0906E0(S/H)|
| [Ice Lake](https://en.wikipedia.org/wiki/Ice_Lake_(microprocessor)) | ^^ | ^^ | ^^ | 0x0706E5(U) |
| [Rocket Lake](https://en.wikipedia.org/wiki/Rocket_Lake) | ^^ | ^^ | Requires Comet Lake CPUID | 0x0A0671 |
| [Tiger Lake](https://en.wikipedia.org/wiki/Tiger_Lake_(microprocessor)) | <span style="color:red"> N/A </span> | <span style="color:red"> N/A </span> | <span style="color:red"> Untested </span> | 0x0806C0(U) |

:::

:::details 详细说明macOS中AMD CPU的限制

不幸的是，AMD完全不支持macOS中的许多功能，还有许多功能是部分损坏的。这些包括:

* 依赖AppleHV的虚拟机
  * 这包括VMWare、Parallels、Docker、Android Studio等
  * VirtualBox是唯一的例外，因为它们有自己的虚拟机管理程序
  * VMware 10和Parallels 13.1.0确实支持自己的虚拟机管理程序，但是使用这种过时的虚拟机软件会带来很大的安全威胁
* Adobe支持
  * 大多数Adobe套件依赖于英特尔的Memfast指令集，在使用AMD cpu时会导致崩溃
  * 你可以禁用功能，如RAW支持，以避免崩溃:[Adobe 修复](https://gist.github.com/naveenkrdy/26760ac5135deed6d0bb8902f6ceb6bd)
* 32位支持
  * 对于那些仍然依赖于32位软件在Mojave和以下，注意香草补丁不支持32位指令
  *解决方法是安装一个 [自定义内核](https://files.amd-osx.com/?dir=Kernels), 但是你失去了iMessage支持，这些内核没有提供支持
* 许多应用程序的稳定性问题
  * 基于音频的应用程序最容易出现问题，例如Logic Pro
  * DaVinci Resolve也有零星的问题

:::

## GPU 支持

由于市场上GPU的数量几乎是无限的，GPU支持变得更加复杂，但总体划分如下:

* AMD基于GCN的gpu支持最新版本的macOS
  * 但是不支持AMD apu
  * AMD的[基于Lexa的核心](https://www.techpowerup.com/gpu-specs/amd-lexa.g806) 从北极星系列也不支持
  * 特别提醒MSI Navi用户:[安装程序不能与5700XT 一起工作 #901](https://github.com/acidanthera/bugtracker/issues/901)
    * 此问题在macOS 11 (Big Sur)中不再存在。
* NVIDIA的GPU支持很复杂:
  * [Maxwell(9XX)](https://en.wikipedia.org/wiki/GeForce_900_series) 和 [Pascal(10XX)](https://en.wikipedia.org/wiki/GeForce_10_series) gpu仅限于macOS 10.13: High Sierra
  * [英伟达的Turing(20XX,](https://en.wikipedia.org/wiki/GeForce_20_series)[16XX)](https://en.wikipedia.org/wiki/GeForce_16_series) gpu**在任何版本的macOS中都不支持**
  * [英伟达的Ampere(30XX)](https://en.wikipedia.org/wiki/GeForce_30_series) gpu **在任何版本的macOS中都不支持**
  * [英伟达的Kepler(6XX,](https://en.wikipedia.org/wiki/GeForce_600_series)[7XX)](https://en.wikipedia.org/wiki/GeForce_700_series) gpu支持到macOS 11: Big Sur
* 英特尔的 [GT2+ tier](https://en.wikipedia.org/wiki/Intel_Graphics_Technology) 系列igpu
  * 本指南涵盖了Ivy Bridge through Ice Lake iGPU support
    *关于GMA系列iGPUs的信息可以在这里找到:[GMA Patching](https://sumingyd.github.io/OpenCore-Post-Install/gpu-patching/)
  * 注意:GT2指iGPU层，Pentiums、Celerons和Atoms上的低端GT1 iGPU在macOS中不支持

对于**使用离散gpu的笔记本电脑**，有一个重要的注意事项:

* 90%的离散gpu无法工作，因为它们连接在macOS不支持的配置中(可切换图形)。使用NVIDIA离散gpu，这通常被称为Optimus。由于无法使用这些离散的gpu进行内部显示，因此通常建议禁用它们并关闭它们(将在本指南的后面介绍)。
* 然而，在某些情况下，离散GPU为任何外部输出(HDMI、mini DisplayPort等)供电，这些输出可能工作，也可能不工作;如果它会工作,你将不得不让卡运行。
* 然而，有些笔记本电脑很少没有可切换的图形，因此可以使用离散卡(如果macOS支持)，但连接和设置通常会导致问题。

**For a full list of supported GPUs, see the [GPU Buyers Guide](https://sumingyd.github.io/GPU-Buyers-Guide/)**

:::details 详细的Intel GPU支持图表

| GPU Generation | 初始版本 | 最后支持版本 | 备注 |
| :--- | :--- | :--- | :--- |
| [3rd Gen GMA](https://en.wikipedia.org/wiki/List_of_Intel_graphics_processing_units#Third_generation) | 10.4.1 | 10.7.5 | [Requires 32-bit kernel and patches](https://sumingyd.github.io/OpenCore-Post-Install/gpu-patching/legacy-intel/) |
| [4th Gen GMA](https://en.wikipedia.org/wiki/List_of_Intel_graphics_processing_units#Gen4) | 10.5.0 | ^^ | ^^ |
| [Arrandale(HD Graphics)](https://en.wikipedia.org/wiki/List_of_Intel_graphics_processing_units#Gen5) | 10.6.4 | 10.13.6 | Only LVDS is supported, eDP and external outputs are not |
| [Sandy Bridge(HD 3000)](https://en.wikipedia.org/wiki/List_of_Intel_graphics_processing_units#Gen6) | 10.6.7 | ^^ | N/A |
| [Ivy Bridge(HD 4000)](https://en.wikipedia.org/wiki/List_of_Intel_graphics_processing_units#Gen7) | 10.7.3 | 11.7.x | ^^ |
| [Haswell(HD 4XXX, 5XXX)](https://en.wikipedia.org/wiki/List_of_Intel_graphics_processing_units#Gen7) | 10.8.5 | 12.6.x | ^^ |
| [Broadwell(5XXX, 6XXX)](https://en.wikipedia.org/wiki/List_of_Intel_graphics_processing_units#Gen8) | 10.10.0 | ^^ | ^^ |
| [Skylake(HD 5XX)](https://en.wikipedia.org/wiki/List_of_Intel_graphics_processing_units#Gen9) | 10.11.0 | ^^ | ^^ |
| [Kaby Lake(HD 6XX)](https://en.wikipedia.org/wiki/List_of_Intel_graphics_processing_units#Gen9) | 10.12.4 | <span style="color:green"> Current </span> | ^^ |
| [Coffee Lake(UHD 6XX)](https://en.wikipedia.org/wiki/List_of_Intel_graphics_processing_units#Gen9) | 10.13.6 | ^^ | ^^ |
| [Comet Lake(UHD 6XX)](https://en.wikipedia.org/wiki/List_of_Intel_graphics_processing_units#Gen9) | 10.15.4 | ^^ | ^^ |
| [Ice Lake(Gx)](https://en.wikipedia.org/wiki/List_of_Intel_graphics_processing_units#Gen11) | 10.15.4 | ^^ | Requires `-igfxcdc` and `-igfxdvmt` in boot-args |
| [Tiger Lake(Xe)](https://en.wikipedia.org/wiki/Intel_Xe) | <span style="color:red"> N/A </span> | <span style="color:red"> N/A </span> | <span style="color:red"> No drivers available </span> |
| [Rocket Lake](https://en.wikipedia.org/wiki/Rocket_Lake) | <span style="color:red"> N/A </span> | <span style="color:red"> N/A </span> | <span style="color:red"> No drivers available </span> |

:::

:::details 详细的AMD GPU支持图表

| GPU Generation | 初始支持 | 最后支持版本 | 备注 |
| :--- | :--- | :--- | :--- |
| [X800](https://en.wikipedia.org/wiki/Radeon_X800_series) | 10.3.x | 10.7.5 | Requires 32 bit kernel |
| [X1000](https://en.wikipedia.org/wiki/Radeon_X1000_series) | 10.4.x | ^^ | N/A |
| [TeraScale](https://en.wikipedia.org/wiki/TeraScale_(microarchitecture)) | 10.4.x | 10.13.6 | ^^ |
| [TeraScale 2/3](https://en.wikipedia.org/wiki/TeraScale_(microarchitecture)) | 10.6.x | ^^ | ^^ |
| [GCN 1](https://en.wikipedia.org/wiki/Graphics_Core_Next) | 10.8.3 | 12.6.x | ^^ |
| [GCN 2/3](https://en.wikipedia.org/wiki/Graphics_Core_Next) | 10.10.x | ^^ | ^^ |
| [Polaris 10](https://en.wikipedia.org/wiki/Radeon_RX_400_series), [20](https://en.wikipedia.org/wiki/Radeon_RX_500_series) | 10.12.1 | <span style="color:green"> Current </span> | ^^ |
| [Vega 10](https://en.wikipedia.org/wiki/Radeon_RX_Vega_series) | 10.12.6 | ^^ | ^^ |
| [Vega 20](https://en.wikipedia.org/wiki/Radeon_RX_Vega_series) | 10.14.5 | ^^ | ^^ |
| [Navi 10](https://en.wikipedia.org/wiki/Radeon_RX_5000_series) | 10.15.1 | ^^ | Requires `agdpmod=pikera` in boot-args |
| [Navi 20](https://en.wikipedia.org/wiki/Radeon_RX_6000_series) | 11.4 | ^^ | <span style="color:yellow"> Currently only some Navi 21 models are working </span> |

:::

:::details 详细的NVIDIA GPU支持图表

| GPU Generation | 初始支持 | 最后支持版本 | 备注 |
| :--- | :--- | :--- | :--- |
| [GeForce 6](https://en.wikipedia.org/wiki/GeForce_6_series) | 10.2.x | 10.7.5 | Requires 32 bit kernel and [NVCAP patching](https://sumingyd.github.io/OpenCore-Post-Install/gpu-patching/nvidia-patching/) |
| [GeForce 7](https://en.wikipedia.org/wiki/GeForce_7_series) | 10.4.x | ^^ | [Requires NVCAP patching](https://sumingyd.github.io/OpenCore-Post-Install/gpu-patching/nvidia-patching/) |
| [Tesla](https://en.wikipedia.org/wiki/Tesla_(microarchitecture)) | 10.4.x | 10.13.6 | ^^ |
| [Tesla v2](https://en.wikipedia.org/wiki/Tesla_(microarchitecture)#Tesla_2.0) | 10.5.x | ^^ | ^^ |
| [Fermi](https://en.wikipedia.org/wiki/Fermi_(microarchitecture)) | 10.7.x | ^^ | ^^ |
| [Kepler](https://en.wikipedia.org/wiki/Kepler_(microarchitecture)) | 10.7.x | 11.7.x | N/A |
| [Kepler v2](https://en.wikipedia.org/wiki/Kepler_(microarchitecture)) | 10.8.x | ^^ | ^^ |
| [Maxwell](https://en.wikipedia.org/wiki/Maxwell_(microarchitecture)) | 10.10.x | 10.13.6 | [Requires NVIDIA Web Drivers](https://www.nvidia.com/download/driverResults.aspx/149652/) |
| [Pascal](https://en.wikipedia.org/wiki/Pascal_(microarchitecture)) | 10.12.4 | ^^ | ^^ |
| [Turing](https://en.wikipedia.org/wiki/Turing_(microarchitecture)) | <span style="color:red"> N/A </span> | <span style="color:red"> N/A </span> | <span style="color:red"> No drivers available </span> |
| [Ampere](https://en.wikipedia.org/wiki/Ampere_(microarchitecture)) | ^^ | ^^ | ^^ |

:::

## 主板支持

在大多数情况下，只要CPU支持，所有主板都支持。

:::details MSI AMD 500 -系列主板注意细节

~~MSI 500系列AMD主板(A520, B550和X570)是个例外。这些主板与macOS Monterey和以上有问题:~~

* ~~PCIe设备不总是正确枚举~~
* ~~Zen 3支持的BIOS更新中断引导~~

~~这些主板推荐使用macOS Big Sur或更早的.~~

感谢CaseySJ，这已经在最新版本的AMD香草补丁中修复了!

:::

## 存储支持

在大多数情况下，它支持所有SATA驱动器和大多数NVMe驱动器。只有少数例外:

* **三星 PM981, PM991 和 美光 2200S NVMe SSDs**
  * 这些ssd不兼容(导致内核恐慌)，因此需要[NVMeFix.kext](https://github.com/acidanthera/NVMeFix/releases) 来修复这些内核恐慌。注意，即使使用NVMeFix.kext，这些驱动器仍然可能导致引导问题。
  * 一个相关的说明，三星970 EVO Plus NVMe ssd也有同样的问题，但它在固件更新中得到了修复;获得更新(Windows通过三星魔术师或启动ISO) [这里](https://www.samsung.com/semiconductor/minisite/ssd/download/tools/).
  * 还要注意，在macOS中不支持使用[Intel Optane Memory](https://www.intel.com/content/www/us/en/architecture-and-technology/optane-memory.html) 或 [Micron 3D XPoint](https://www.micron.com/products/advanced-solutions/3d-xpoint-technology) 进行硬盘加速的笔记本电脑。一些用户报告说，Catalina在读写支持方面取得了成功，但我们强烈建议删除驱动器，以防止任何潜在的引导问题。
    * 请注意，如果在macOS中禁用了Optane部分，则英特尔Optane内存H10/H20型号是兼容的。更多信息可以在[这里](https://blog.csdn.net/weixin_46341175/article/details/126626808) ([中文原文](https://zhuanlan.zhihu.com/p/429073173))找到.
  
* **Intel 600p**
  * 虽然不是不可启动的，但请注意此模型可能会导致许多问题。 [Intel 600p NVMe硬盘有修复吗? #1286](https://github.com/acidanthera/bugtracker/issues/1286)
  * 660p的型号很好

## 有线网络

在macOS中，几乎所有有线网络适配器都有某种形式的支持，要么是内置驱动程序，要么是社区制作的kext。主要的例外:

* Intel I225 2.5Gb NIC
  * 在高端桌面彗星湖板上发现
  * 有可能的解决方法: [来源](https://www.hackintosh-forum.de/forum/thread/48568-i9-10900k-gigabyte-z490-vision-d-er-läuft/?postID=606059#post606059) 和 [示例](config.plist/comet-lake.md#deviceproperties)
* Intel I350 1Gb server NIC
  * 通常在Intel和Supermicro不同年代的服务器板上找到
  * [方法](config-HEDT/ivy-bridge-e.md#deviceproperties)
* Intel 10Gb server NICs
  * 解决方案是 [X520 and X540 chipsets](https://www.tonymacx86.com/threads/how-to-build-your-own-imac-pro-successful-build-extended-guide.229353/)
* Mellanox和Qlogic server网卡

## 无线网络

大多数笔记本电脑自带的WiFi卡不支持，因为它们通常是英特尔/高通的。如果你幸运，你可能有一个支持Atheros卡，但支持只运行到 High Sierra.

最好的选择是获得支持的博通卡;请参阅[WiFi购买指南](https://sumingyd.github.io/Wireless-Buyers-Guide/) 获得建议。

注意:在macOS上英特尔WiFi是非官方的(第三方驱动)支持，请查看[WiFi购买指南](https://sumingyd.github.io/Wireless-Buyers-Guide/) 了解更多关于驱动程序和支持卡的信息。

## 其他

* **指纹传感器**
  * 目前还没有办法模拟Touch ID传感器，因此指纹传感器将无法工作。
* **Windows Hello人脸识别**
  * 一些笔记本电脑自带的WHFR是I2C连接的(并通过iGPU使用)，这些将不起作用。
  * 一些笔记本电脑配备了USB连接的WHFR，如果你幸运的话，你可能会有相机功能，但没有其他功能。
* **英特尔智能声音技术**
  * 使用英特尔SST的笔记本电脑将不会有任何通过它们(通常是内部麦克风)连接的工作，因为它不支持。你可以在Windows的设备管理器中查看。
* **耳机接口组合**
  * 一些带有combo耳机插孔的笔记本电脑可能无法通过它们进行音频输入，必须使用内置麦克风或通过USB接口的外部音频输入设备。
* **Thunderbolt USB-C 接口**
  * (Hackintosh)目前在macOS中对Thunderbolt的支持仍然不确定，尤其是在Alpine Ridge控制器上，这是目前大多数笔记本电脑都拥有的。有人试图保持控制器上电，这允许Thunderbolt和USB-C热插拔工作，但代价是内核崩溃 和/或 USB-C在睡眠后中断。如果你想使用端口的USB-C端并能够休眠，你必须在启动时插入它并保持插入状态。
  * 注意:这不适用于仅USB-C端口-仅Thunderbolt 3和USB-C组合端口。
  * 在BIOS中禁用Thunderbolt也会解决这个问题。
