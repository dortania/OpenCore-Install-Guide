# Hardware Limitations

With macOS, there's numerous hardware limitation you need to be aware of before stepping foot into an installation. This is due to the limited amount of hardware Apple supports, and so we're either limited by what Apple or what patches the community has created.

The main hardware section to be verified are:

* [CPU](#cpu-support)
* [GPU](#gpu-support)
* [Motherboard](#motherboard-support)
* [Storage](#storage-support)
* [Wired Networking](#wired-networking)
* [Wireless Networking](#wireless-networking)
* [Miscellaneous](#miscellaneous)

And for more detailed guides on the subject, see here:

* [GPU Buyers Guide](https://dortania.github.io/GPU-Buyers-Guide/)
  * Check if your GPU is supported and which macOS version you can run.
* [Wireless Buyers Guide](https://dortania.github.io/Wireless-Buyers-Guide/)
  * Check if your WiFi card is supported.
* [Anti-Hardware Buyers Guide](https://dortania.github.io/Anti-Hackintosh-Buyers-Guide/)
  * Overall guide on what to avoid and what pitfalls your hardware may hit.

## CPU Support

For CPU support, we have the following breakdown:

* Intel's Desktop CPUs are supported.
  * Ivy Bridge through Comet Lake are supported by this guide.
* Intel's High-End Desktops and Server CPUs.
  * Haswell-E through Cascade Lake X are supported by this guide.
* Intel's Core "i" and Xeon series laptop CPUs
  * Ivy Bridge through Ice Lake are supported by this guide.
  * Note that Mobile Atoms, Celeron and Pentium CPUs are not supported
* AMD's Desktop Bulldozer(15h), Jaguar(16h) and Ryzen(17h) CPUs
  * Laptop CPUs are **not** supported

**For more in-depth information, see here: [Anti-Hardware Buyers Guide](https://dortania.github.io/Anti-Hackintosh-Buyers-Guide/)**

::: details Intel CPU Support Chart

| CPU Generation | Initial support | Last supported version | Notes | CPUID |
| :--- | :--- | :--- | :--- | :--- |
| [Pentium 4](https://en.wikipedia.org/wiki/Pentium_4) | 10.4.0 | 10.5.8 | Only used in dev kits | 0x0F41 |
| [Yonah](https://en.wikipedia.org/wiki/Yonah_(microprocessor)) | 10.4.5 | 10.6.8 | 32Bit | 0x0006E6 |
| [Conroe](https://en.wikipedia.org/wiki/Conroe_(microprocessor)), [Merom](https://en.wikipedia.org/wiki/Merom_(microprocessor)) | 10.4.10 | 10.11.6 | No SSE4 | 0x0006F2 |
| [Penryn](https://en.wikipedia.org/wiki/Penryn_(microarchitecture)) | 10.4.11 | 10.13.6 | No SSE4.2 | 0x010676 |
| [Nehalem](https://en.wikipedia.org/wiki/Nehalem_(microarchitecture)) | 10.5.6 | Current | N/A | 0x0106A2 |
| [Lynnfield](https://en.wikipedia.org/wiki/Lynnfield_(microprocessor)), [Clarksfield](https://en.wikipedia.org/wiki/Clarksfield_(microprocessor)) | 10.6.3 | Current | No iGPU support 10.14+ | 0x0106E0 |
| [Westmere, Clarkdale, Arrandale](https://en.wikipedia.org/wiki/Westmere_(microarchitecture)) | 10.6.4 | Current | No iGPU support 10.14+ | 0x0206C0 |
| [Sandy Bridge](https://en.wikipedia.org/wiki/Sandy_Bridge) | 10.6.7 | Current | No iGPU support 10.14+ | 0x0206A0(M/H) |
| [Ivy Bridge](https://en.wikipedia.org/wiki/Ivy_Bridge_(microarchitecture)) | 10.7.3 | Current | No iGPU support 11+ | 0x0306A0(M/H/G) |
| [Ivy Bridge-E5](https://en.wikipedia.org/wiki/Ivy_Bridge_(microarchitecture)) | 10.9.2 | Current | N/A | 0x0306E0 |
| [Haswell](https://en.wikipedia.org/wiki/Haswell_(microarchitecture)) | 10.8.5 | Current | N/A | 0x0306C0(S) |
| [Broadwell](https://en.wikipedia.org/wiki/Broadwell_(microarchitecture)) | 10.10.0 | Current | N/A | 0x0306D4(U/Y) |
| [Skylake](https://en.wikipedia.org/wiki/Skylake_(microarchitecture)) | 10.11.1 | Current | N/A | 0x0506e3(H/S) 0x0406E3(U/Y) |
| [Kaby Lake](https://en.wikipedia.org/wiki/Kaby_Lake) | 10.12.6 | Current | N/A | 0x0906E9(H/S/G) 0x0806E9(U/Y) |
| [Coffee Lake](https://en.wikipedia.org/wiki/Coffee_Lake) | 10.13.2 | Current | iGPU supported added in 10.13.6 | 0x0906EA(S/H/E) 0x0806EA(U)|
| [Amber](https://en.wikipedia.org/wiki/Kaby_Lake#List_of_8th_generation_Amber_Lake_Y_processors), [Whiskey](https://en.wikipedia.org/wiki/Whiskey_Lake_(microarchitecture)), [Comet Lake](https://en.wikipedia.org/wiki/Comet_Lake_(microprocessor)) | 10.14.1 | Current | N/A | 0x0806E0(U/Y) |
| [Comet Lake](https://en.wikipedia.org/wiki/Comet_Lake_(microprocessor)) | 10.15.4 | Current | N/A | 0x0906E0(S/H)|
| [Ice Lake](https://en.wikipedia.org/wiki/Ice_Lake_(microprocessor)) | 10.15.4 | Current | N/A | 0x0706E5(U) |

:::

## GPU Support

GPU support becomes much more complicated due to the near-infinite amount of GPUs on the market, but the general breakdown is as follows:

* AMD's GCN based GPUs are supported in the latest versions of macOS
  * AMD APUs are not supported however
  * AMD's [Lexa based cores](https://www.techpowerup.com/gpu-specs/amd-lexa.g806) from the Polaris series are also not supported
  * Special note for MSI Navi users: [Installer not working with 5700XT #901](https://github.com/acidanthera/bugtracker/issues/901)
    * This issue is no longer present in macOS 11, Big Sur.
* Nvidia's GPU support is complicated:
  * [Maxwell(9XX)](https://en.wikipedia.org/wiki/GeForce_900_series) and [Pascal(10XX)](https://en.wikipedia.org/wiki/GeForce_10_series) GPUs are limited to macOS 10.13: High Sierra
  * [Nvidia's Turing(20XX,](https://en.wikipedia.org/wiki/GeForce_20_series)[16XX)](https://en.wikipedia.org/wiki/GeForce_16_series) GPUs are **not supported in any version of macOS**
  * Nvidia's [Kepler(6XX, 7XX)](https://en.wikipedia.org/wiki/GeForce_700_series) GPUs are supported in the latest versions of macOS(Including macOS 11: Big Sur)
    * This is due to Apple still supporting a few [MacBook Pros with Nvidia GPUs](https://dortania.github.io/GPU-Buyers-Guide/modern-gpus/nvidia-gpu.html)
* Intel's [GT2+ tier](https://en.wikipedia.org/wiki/Intel_Graphics_Technology) series iGPUs
  * Ivy Bridge through Ice Lake iGPU support is covered in this guide
  * Note GT2 refers to the tier of iGPU, low-end GT1 iGPUs found on Pentiums, Celerons and Atoms are not supported in macOS

And an important note for **Laptops with discrete GPUs**:

* 90% of discrete GPUs will not work because they are wired in a configuration that macOS doesn't support (switchable graphics). With NVIDIA discrete GPUs, this is usually called Optimus. It is not possible to utilize these discrete GPUs for the internal display, so it is generally advised to disable them and power them off (will be covered later in this guide.)
* However, in some cases, the discrete GPU powers any external outputs (HDMI, mini DisplayPort, etc.), which may or may not work; in the case that it will work, you will have to keep the card on and running.
* However, there are some laptops that rarely do not have switchable graphics, so the discrete card can be used (if supported by macOS), but the wiring and setup usually cause issues.

**For a full list of supported GPUs, see the [GPU Buyers Guide](https://dortania.github.io/GPU-Buyers-Guide/)**

::: details AMD GPU Support Chart

| GPU Generation | Initial support | Last supported version | Notes |
| :--- | :--- | :--- | :--- |
| [X800](https://en.wikipedia.org/wiki/Radeon_X800_series) | 10.3.x | 10.7.5 | Requires 32 bit kernel |
| [X1000](https://en.wikipedia.org/wiki/Radeon_X1000_series) | 10.4.x | 10.7.5 | Requires 32 bit kernel |
| [Terascale](https://en.wikipedia.org/wiki/TeraScale_(microarchitecture)) | 10.5.x | 10.13.6 | N/A |
| [Terascale 2/3](https://en.wikipedia.org/wiki/TeraScale_(microarchitecture)) | 10.6.x | 10.13.6 | N/A |
| [GCN 1](https://en.wikipedia.org/wiki/Graphics_Core_Next) | 10.8.3 | Current | N/A |
| [GCN 2/3](https://en.wikipedia.org/wiki/Graphics_Core_Next) | 10.10.x | Current | N/A |
| [Polaris 10](https://en.wikipedia.org/wiki/Radeon_RX_400_series), [20](https://en.wikipedia.org/wiki/Radeon_RX_500_series) | 10.12.1 | Current | N/A |
| [Vega 10](https://en.wikipedia.org/wiki/Radeon_RX_Vega_series) | 10.12.6 | Current | N/A |
| [Vega 20](https://en.wikipedia.org/wiki/Radeon_RX_Vega_series) | 10.14.5 | Current | N/A |
| [Navi 10](https://en.wikipedia.org/wiki/Radeon_RX_5000_series) | 10.15.1 | Current | Requires `agdpmod=pikera` in boot-args |

:::

::: details Nvidia GPU Support Chart

| GPU Generation | Initial support | Last supported version | Notes |
| :--- | :--- | :--- | :--- |
| [GeForce 6](https://en.wikipedia.org/wiki/GeForce_6_series) | 10.2.x | 10.7.5 | Requires 32 bit kernel |
| [GeForce 7](https://en.wikipedia.org/wiki/GeForce_7_series) | 10.4.x | 10.7.5 | Requires 32 bit kernel |
| [Tesla](https://en.wikipedia.org/wiki/Tesla_(microarchitecture)) | 10.4.x | 10.13.6 | N/A |
| [Tesla V2](https://en.wikipedia.org/wiki/Tesla_(microarchitecture)#Tesla_2.0) | 10.5.x | 10.13.6 | N/A |
| [Fermi](https://en.wikipedia.org/wiki/Fermi_(microarchitecture)) | 10.7.x | 10.13.6 | N/A |
| [Kepler Gen 1/2](https://en.wikipedia.org/wiki/Kepler_(microarchitecture)) | 10.8.x | Current | N/A |
| [Maxwell](https://en.wikipedia.org/wiki/Maxwell_(microarchitecture)) | 10.10.x | 10.13.6 | Requires webdrivers |
| [Pascal](https://en.wikipedia.org/wiki/Pascal_(microarchitecture)) | 10.12.4 | 10.13.6 | Requires webdrivers |
| [Turing](https://en.wikipedia.org/wiki/Turing_(microarchitecture)) | N/A | N/A | N/A |

:::

## Motherboard Support

For the most part, all motherboards are supported as long as the CPU is. Previously, B550 boards had issues:

* [~~AMD's B550 boards~~](https://en.wikipedia.org/wiki/List_of_AMD_chipsets)

However thanks to recent developments, B550 boards are now bootable with the addition of [SSDT-CPUR](https://github.com/naveenkrdy/Misc/blob/master/SSDTs/SSDT-CPUR.dsl). More info will be provided in both [Gathering Files](./ktext.md) and [Zen's config.plist section](./AMD/zen.md)

## Storage Support

For the most part, all SATA based drives are supported and the majority of NVMe drives as well. The few exceptions:

* **Samsung PM981, PM991 and Micron 2200S NVMe SSDs**
  * These SSDs are not compatible out of the box (causing kernel panics) and therefore require [NVMeFix.kext](https://github.com/acidanthera/NVMeFix/releases) to fix these kernel panics. Note that these drives may still cause boot issues even with NVMeFix.kext.
  * On a related note, Samsung 970 EVO Plus NVMe SSDs also had the same problem but it was fixed in a firmware update; get the update (Windows via Samsung Magician or bootable ISO) [here](https://www.samsung.com/semiconductor/minisite/ssd/download/tools/).
  * Also to note, laptops that use [Intel Optane Memory](https://www.intel.com/content/www/us/en/architecture-and-technology/optane-memory.html) or [Micron 3D XPoint](https://www.micron.com/products/advanced-solutions/3d-xpoint-technology) for HDD acceleration are unsupported in macOS. Some users have reported success in Catalina with even read and write support but we highly recommend removing the drive to prevent any potential boot issues.

## Wired Networking

Virtually all wired network adapters have some form of support in macOS, either by the built-in drivers or community made kexts. The main exceptions:

* Intel's 2.5GBe i225 networking
  * Found on high-end Desktop Comet Lake boards
  * Workarounds are possible: [Source](https://www.hackintosh-forum.de/forum/thread/48568-i9-10900k-gigabyte-z490-vision-d-er-läuft/?postID=606059#post606059) and [Example](../config.plist/comet-lake.md#deviceproperties)
* Intel's server NICs
  * Workarounds are possible for [X520 and X540 chipsets](https://www.tonymacx86.com/threads/how-to-build-your-own-imac-pro-successful-build-extended-guide.229353/)
* Mellanox and Qlogic server NICs

## Wireless Networking

Most WiFi cards that come with laptops are not supported as they are usually Intel/Qualcomm. If you are lucky, you may have a supported Atheros card, but support only runs up to High Sierra.

The best option is getting a supported Broadcom card; see the [WiFi Buyer's Guide](https://dortania.github.io/Wireless-Buyers-Guide/) for recommendations.

## Miscellaneous

* **Fingerprint sensors**
  * There is no way to emulate the Touch ID sensor as of currently, so fingerprint sensors will not work.
* **Windows Hello Face Recognition**
  * Some laptops come with WHFR that is I2C connected (and used through your iGPU), those will not work.
  * Some laptops come with WHFR that is USB-Connected, if you're lucky, you may get the camera functionality, but nothing else.
* **Intel Smart Sound Technology**
  * Laptops with Intel SST will not have anything connected through them (usually internal mic) work, as it is not supported. You can check with Device Manager on Windows.
* **Headphone Jack Combo**
  * Some laptops with a combo headphone jack may not get Audio Input through them and will have to either use the built-in microphone or an external Audio Input device through USB.
* **Thunderbolt USB-C ports**
  * (Hackintosh) Thunderbolt support is currently still iffy in macOS, even more so with Alpine Ridge controllers, which most current laptops have. There have been attempts to keep the controller powered on, which allows Thunderbolt and USB-C hotplug to work, but it comes at the cost of kernel panics and/or USB-C breaking after sleep. If you want to use the USB-C side of the port and be able to sleep, you must plug it in at boot and keep it plugged in.
  * Note: This does not apply to USB-C only ports - only Thunderbolt 3 and USB-C combined ports.
  * Disabling Thunderbolt in the BIOS will also resolve this.
