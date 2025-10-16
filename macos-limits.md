# Hardware Limitations

With macOS, there are numerous hardware limitations you need to be aware of before stepping foot into an installation. This is due to the limited amount of hardware Apple supports, so we're either limited by Apple or what patches the community has created.

The main hardware sections to verify are:

[[toc]]

And for more detailed guides on the subject, see here:

* [GPU Buyers Guide](https://dortania.github.io/GPU-Buyers-Guide/)
  * Check if your GPU is supported and which macOS version you can run.
* [Wireless Buyers Guide](https://dortania.github.io/Wireless-Buyers-Guide/)
  * Check if your WiFi card is supported.
* [Anti-Hardware Buyers Guide](https://dortania.github.io/Anti-Hackintosh-Buyers-Guide/)
  * Overall guide on what to avoid and what pitfalls your hardware may hit.

## CPU Support

For CPU support, we have the following breakdown:

* Both 32 and 64-bit CPUs are supported
  * This however requires the OS to support your architecture, see CPU Requirements section below
* Intel's Desktop CPUs are supported.
  * Yonah through Comet Lake are supported by this guide.
* Intel's High-End Desktops and Server CPUs.
  * Nehalem through Cascade Lake X are supported by this guide.
* Intel's Core "i" and Xeon series laptop CPUs
  * Arrandale through Ice Lake are supported by this guide.
  * Note that Mobile Atoms, Celeron and Pentium CPUs are not supported
* AMD's Desktop Bulldozer (15h), Jaguar (16h) and Ryzen (17h) CPUs
  * Laptop CPUs are **not** supported
  * Note not all features of macOS are supported with AMD, see below

**For more in-depth information, see here: [Anti-Hardware Buyers Guide](https://dortania.github.io/Anti-Hackintosh-Buyers-Guide/)**

::: details CPU Requirements

Architecture Requirements

* 32-bit CPUs are supported from 10.4.1 to 10.6.8
  * Note that 10.7.x requires 64-bit userspace, limiting 32-bit CPUs to 10.6
* 64-bit CPUs are supported from 10.4.1 to current

SSE Requirements:

* SSE3 is required for all Intel versions of OS X/macOS
* SSSE3 is required for all 64-bit versions of OS X/macOS
  * For CPUs missing SSSE3 (i.e. certain 64-bit Pentiums), we recommend running 32-bit userspace (`i386-user32`)
* SSE4 is required for macOS 10.12 and newer
* SSE4.2 is required for macOS 10.14 and newer
  * SSE4.1 CPUs are supported with [telemetrap.kext](https://forums.macrumors.com/threads/mp3-1-others-sse-4-2-emulation-to-enable-amd-metal-driver.2206682/post-28447707)
  * Newer AMD drivers also require SSE4.2 for Metal support. To resolve this, see here: [MouSSE: SSE4.2 emulation](https://forums.macrumors.com/threads/mp3-1-others-sse-4-2-emulation-to-enable-amd-metal-driver.2206682/)
* AVX2 is required for macOS 13 and newer
  * Use [CryptexFixup](https://github.com/acidanthera/CryptexFixup) to install on older hardware which meets the requirements for 10.14 and up.

Firmware Requirements:

* OS X 10.4.1 through 10.4.7 require EFI32 (i.e. IA32 (32-bit) version of OpenCore)
  * OS X 10.4.8 through 10.7.5 support both EFI32 and EFI64
* OS X 10.8 and newer require EFI64 (i.e. x64 (64-bit) version of OpenCore)
* OS X 10.7 through 10.9 require OpenPartitionDxe.efi to boot the Recovery partition

Kernel Requirements:

* OS X 10.4 and 10.5 require 32-bit kexts due to only supporting 32-bit kernelspace
  * OS X 10.6 and 10.7 support both 32 and 64-bit kernelspace
* OS X 10.8 and newer require 64-bit kexts due to only supporting 64-bit kernelspace
  * Run `lipo -archs` to know what architectures your kext supports (remember to run this on the binary itself and not the .kext bundle)

Core/Thread Count Limits:

* OS X 10.10 and below may not boot with more than 24 threads (evident by a `mp_cpus_call_wait() timeout` panic)
* OS X 10.11 and newer have a 64 thread limit
* `cpus=` boot argument can be used as a workaround, or disabling hyperthreading

Special Notes:

* Lilu and plugins require 10.8 or newer to operate
  * We recommend running FakeSMC for older versions of OS X
* OS X 10.6 and older require RebuildAppleMemoryMap enabled
  * This is to resolve an early kernel

:::

::: details Intel CPU Support Chart

Support based off of Vanilla Kernels (i.e. no modifications):

| CPU Generation | Initial support | Last supported version | Notes | CPUID |
| :--- | :--- | :--- | :--- | :--- |
| [Pentium 4](https://en.wikipedia.org/wiki/Pentium_4) | 10.4.1 | 10.5.8 | Only used in dev kits | 0x0F41 |
| [Yonah](https://en.wikipedia.org/wiki/Yonah_(microprocessor)) | 10.4.4 | 10.6.8 | 32-Bit | 0x0006E6 |
| [Conroe](https://en.wikipedia.org/wiki/Conroe_(microprocessor)), [Merom](https://en.wikipedia.org/wiki/Merom_(microprocessor)) | 10.4.7 | 10.11.6 | No SSE4 | 0x0006F2 |
| [Penryn](https://en.wikipedia.org/wiki/Penryn_(microarchitecture)) | 10.4.10 | 10.13.6 | No SSE4.2 | 0x010676 |
| [Nehalem](https://en.wikipedia.org/wiki/Nehalem_(microarchitecture)) | 10.5.6 | 12.7.6 | N/A | 0x0106A2 |
| [Lynnfield](https://en.wikipedia.org/wiki/Lynnfield_(microprocessor)), [Clarksfield](https://en.wikipedia.org/wiki/Clarksfield_(microprocessor)) | 10.6.3 | ^^ | No iGPU support 10.14+ | 0x0106E0 |
| [Westmere, Clarkdale, Arrandale](https://en.wikipedia.org/wiki/Westmere_(microarchitecture)) | 10.6.4 | ^^ | ^^ | 0x0206C0 |
| [Sandy Bridge](https://en.wikipedia.org/wiki/Sandy_Bridge) | 10.6.7 | ^^ | ^^ | 0x0206A0(M/H) |
| [Ivy Bridge](https://en.wikipedia.org/wiki/Ivy_Bridge_(microarchitecture)) | 10.7.3 | ^^ | No iGPU support 12+ | 0x0306A0(M/H/G) |
| [Ivy Bridge-E5](https://en.wikipedia.org/wiki/Ivy_Bridge_(microarchitecture)) | 10.9.2 | ^^ | N/A | 0x0306E0 |
| [Haswell](https://en.wikipedia.org/wiki/Haswell_(microarchitecture)) | 10.8.5 | <span style="color:green"> Current </span> | No iGPU support 13+ | 0x0306C0(S) |
| [Broadwell](https://en.wikipedia.org/wiki/Broadwell_(microarchitecture)) | 10.10.0 | ^^ | ^^ | 0x0306D4(U/Y) |
| [Skylake](https://en.wikipedia.org/wiki/Skylake_(microarchitecture)) | 10.11.0 | ^^ | Current | 0x0506e3(H/S) 0x0406E3(U/Y) |
| [Kaby Lake](https://en.wikipedia.org/wiki/Kaby_Lake) | 10.12.4 | ^^ | ^^ | 0x0906E9(H/S/G) 0x0806E9(U/Y) |
| [Coffee Lake](https://en.wikipedia.org/wiki/Coffee_Lake) | 10.12.6 | ^^ | ^^ | 0x0906EA(S/H/E) 0x0806EA(U)|
| [Amber](https://en.wikipedia.org/wiki/Kaby_Lake#List_of_8th_generation_Amber_Lake_Y_processors), [Whiskey](https://en.wikipedia.org/wiki/Whiskey_Lake_(microarchitecture)), [Comet Lake](https://en.wikipedia.org/wiki/Comet_Lake_(microprocessor)) | 10.14.1 | ^^ | ^^ | 0x0806E0(U/Y) |
| [Comet Lake](https://en.wikipedia.org/wiki/Comet_Lake_(microprocessor)) | 10.15.4 | ^^ | ^^ | 0x0906E0(S/H)|
| [Ice Lake](https://en.wikipedia.org/wiki/Ice_Lake_(microprocessor)) | ^^ | ^^ | ^^ | 0x0706E5(U) |
| [Rocket Lake](https://en.wikipedia.org/wiki/Rocket_Lake) | ^^ | ^^ | Requires Comet Lake CPUID | 0x0A0671 |
| Newer CPUs | <span style="color:red"> N/A </span> | ^^ | ^^ | N/A |

:::

::: details AMD CPU Limitations in macOS

Unfortunately many features in macOS are outright unsupported with AMD and many others being partially broken. These include:

* Virtual Machines relying on AppleHV
  * This includes VirtualBox, VMWare, Parallels, Docker, Android Studio, etc
  * VirtualBox 6, VMware 10, and Parallels 13.1.0 do support their own hypervisor, however using such outdated VM software poses a large security threat
* Adobe Support
  * Most of Adobe's suite relies on Intel's Memfast instruction set, resulting in crashes with AMD CPUs
  * You can disable functionality like RAW support to avoid the crashing: [Adobe Fixes](https://gist.github.com/naveenkrdy/26760ac5135deed6d0bb8902f6ceb6bd)
* 32-Bit support
  * For those still relying on 32-Bit software in Mojave and below, note that the Vanilla patches do not support 32-bit instructions
  * A work-around is to install a [custom kernel](https://files.amd-osx.com/?dir=Kernels), however you lose iMessage support and no support is provided for these kernels
* Stability issues on many apps
  * Audio-based apps are the most prone to issues, ie. Logic Pro
  * DaVinci Resolve has been known to have sporadic issues as well

:::

## GPU Support

**For a full list of supported GPUs, see the [GPU Buyers Guide](https://dortania.github.io/GPU-Buyers-Guide/).**

## Motherboard Support

For the most part, all motherboards are supported as long as the CPU is.

::: details MSI 500-series AMD motherboards note

~~The exception is MSI 500-series AMD motherboards (A520, B550, and X570). These motherboards have issues with macOS Monterey and above:~~

* ~~PCIe devices are not always enumerated properly~~
* ~~The BIOS update for Zen 3 support breaks boot~~

~~macOS Big Sur or earlier is recommended for these motherboards.~~

Thanks to CaseySJ, this has been fixed in the latest version of the AMD vanilla patches!

:::

## Storage Support

For the most part, all SATA based drives are supported and the majority of NVMe drives as well. There are only a few exceptions:

* **Samsung PM981, PM991 and Micron 2200S NVMe SSDs**
  * These SSDs are not compatible out of the box (causing kernel panics) and therefore require [NVMeFix.kext](https://github.com/acidanthera/NVMeFix/releases) to fix these kernel panics. Note that these drives may still cause boot issues even with NVMeFix.kext.
  * On a related note, Samsung 970 EVO Plus NVMe SSDs also had the same problem but it was fixed in a firmware update; get the update (Windows via Samsung Magician or bootable ISO) [here](https://www.samsung.com/semiconductor/minisite/ssd/download/tools/).
  * Also to note, laptops that use [Intel Optane Memory](https://www.intel.com/content/www/us/en/architecture-and-technology/optane-memory.html) or [Micron 3D XPoint](https://www.micron.com/products/advanced-solutions/3d-xpoint-technology) for HDD acceleration are unsupported in macOS. Some users have reported success in Catalina with even read and write support but we highly recommend removing the drive to prevent any potential boot issues.
    * Note that Intel Optane Memory H10/H20 models are compatible if the Optane part is disabled in macOS. More information can be found [here](https://blog.csdn.net/weixin_46341175/article/details/126626808) ([original Chinese source](https://zhuanlan.zhihu.com/p/429073173)).
  
* **Intel 600p**
  * While not unbootable, please be aware this model can cause numerous problems. [Any fix for Intel 600p NVMe Drive? #1286](https://github.com/acidanthera/bugtracker/issues/1286)
  * The 660p model is fine

## Wired Networking

Virtually all wired network adapters have some form of support in macOS, either by the built-in drivers or community made kexts. The main exceptions:

* Intel I225-V 2.5Gb NIC
  * Found on high-end Desktop Comet Lake boards
  * Requires device properties: [Source](https://www.hackintosh-forum.de/forum/thread/48568-i9-10900k-gigabyte-z490-vision-d-er-läuft/?postID=606059#post606059) and [Example](config.plist/comet-lake.md#deviceproperties)
* Intel I350 1Gb server NIC
  * Normally found on Intel and Supermicro server boards of various generations
  * [Requires device properties](config-HEDT/ivy-bridge-e.md#deviceproperties)
* Intel 10Gb server NICs
  * Workarounds are possible for [X520 and X540 chipsets](https://www.tonymacx86.com/threads/how-to-build-your-own-imac-pro-successful-build-extended-guide.229353/)
* Mellanox and Qlogic server NICs

## Wireless Networking

Most WiFi cards that come with laptops are not supported as they are usually Intel/Qualcomm. If you are lucky, you may have a supported Atheros card, but support only runs up to High Sierra.

The best option is getting a supported Broadcom card; see the [WiFi Buyer's Guide](https://dortania.github.io/Wireless-Buyers-Guide/) for recommendations.

Note: Intel WiFi is unofficially (3rd party driver) supported on macOS, check [WiFi Buyer's Guide](https://dortania.github.io/Wireless-Buyers-Guide/) for more information about the drivers and supported cards.

## Miscellaneous

* **Fingerprint sensors**
  * There is currently no way to emulate the Touch ID sensor, so fingerprint sensors will not work.
* **Windows Hello Face Recognition**
  * Some laptops come with WHFR that is I2C connected (and used through your iGPU), those will not work.
  * Some laptops come with WHFR that is USB connected, if you're lucky, you may get camera functionality, but nothing else.
* **Intel Smart Sound Technology**
  * Laptops with Intel SST will not have anything connected through them (usually internal mic) work, as it is not supported. You can check with Device Manager on Windows.
* **Headphone Jack Combo**
  * Some laptops with a combo headphone jack may not get audio input through them and will have to either use the built-in microphone or an external audio input device through USB.
* **Thunderbolt USB-C ports**
  * (Hackintosh) Thunderbolt support is currently still iffy in macOS, even more so with Alpine Ridge controllers, which most current laptops have. There have been attempts to keep the controller powered on, which allows Thunderbolt and USB-C hotplug to work, but it comes at the cost of kernel panics and/or USB-C breaking after sleep. If you want to use the USB-C side of the port and be able to sleep, you must plug it in at boot and keep it plugged in.
  * Note: This does not apply to USB-C only ports - only Thunderbolt 3 and USB-C combined ports.
  * Disabling Thunderbolt in the BIOS will also resolve this.
