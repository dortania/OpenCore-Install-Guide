# Gathering files

* Supported version: 0.6.1

This section is for gathering miscellaneous files for booting macOS, we do expect you to know your hardware well before starting and hopefully made a Hackintosh before as we won't be deep diving in here.

> What's the best way to figure out if my hardware is supported?

See the [**Hardware Limitations page**](macos-limits.md) for some better insight into what macOS requires to boot, hardware support between Clover and OpenCore are quite similar.

> What are some ways to figure out what hardware I have?

Generally the product's spec page has all the info you need, but if you're still having troubles there are a few options:

* **Windows**:
  * [Speccy](https://www.ccleaner.com/speccy)
  * [AIDA64](https://www.aida64.com/downloads)
  * DeviceManager
* **Linux**:
  * Run `hwinfo` in terminal

## Firmware Drivers

Firmware drivers are drivers used by OpenCore in the UEFI environment. They're mainly required to boot a machine, either by extending OpenCore's patching ability or showing you different types of drives in the OpenCore picker(ie. HFS drives).

* **Location Note**: These files **must** be placed under `EFI/OC/Drivers/`

### Universal

For the majority of systems, you'll only need 2 `.efi` drivers to get up and running:

* [HfsPlus.efi](https://github.com/acidanthera/OcBinaryData/blob/master/Drivers/HfsPlus.efi)
  * Needed for seeing HFS volumes(ie. macOS Installers and Recovery partitions/images). **Do not mix other HFS drivers**
* [OpenRuntime.efi](https://github.com/acidanthera/OpenCorePkg/releases)
  * Replacement for [AptioMemoryFix.efi](https://github.com/acidanthera/AptioFixPkg), used as an extension for OpenCore to help with patching boot.efi for NVRAM fixes and better memory management.

### Legacy users

In addition to the above, if your hardware doesn't support UEFI(2011 and older era) then you'll need the following. Pay close attention to each entry as you may not need all 4:

* [OpenUsbKbDxe.efi](https://github.com/acidanthera/OpenCorePkg/releases)
  * Used for OpenCore picker on **legacy systems running DuetPkg**, [not recommended and even harmful on UEFI(Ivy Bridge and newer)](https://applelife.ru/threads/opencore-obsuzhdenie-i-ustanovka.2944066/page-176#post-856653)
* [HfsPlusLegacy.efi](https://github.com/acidanthera/OcBinaryData/blob/master/Drivers/HfsPlusLegacy.efi)
  * Legacy variant of HfsPlus, used for systems that lack RDRAND instruction support. This is generally seen on Sandy Bridge and older
  * Don't mix this with HfsPlus.efi, choose one or the other depending on your hardware

These files will go in your Drivers folder in your EFI

::: details Legacy macOS installs

If you plan to boot older versions of macOS/OS X, you'll find these drivers useful:

* [PartitionDxe](https://github.com/acidanthera/OcBinaryData/blob/master/Drivers/PartitionDxe.efi)
  * Required to boot recovery on 10.7 through 10.9, otherwise you'll return a `LoadImage - error`
  * For Sandy Bridge and older, you'll want to use [PartitionDxeLegacy](https://github.com/acidanthera/OcBinaryData/blob/master/Drivers/PartitionDxeLegacy.efi) due to missing RDRAND instruction.
  * Note 10.10, Yosemite and newer do not require PartitionDxe at all.

:::

## Kexts

A kext is a **k**ernel **ext**ension, you can think of this as a driver for macOS, these files will go into the Kexts folder in your EFI.

* **Windows and Linux note**: Kexts will look like normal folders in your OS, **double check** that the folder you are installing has a .kext extension visible(and do not add one manually if it's missing).
  * If any kext also includes a `.dSYM` file, you can simply delete it. They're only for debugging purposes.
* **Location Note**: These files **must** be placed under `EFI/OC/Kexts/`.

All kext listed below can be found **pre-compiled** in the [Kext Repo](http://kexts.goldfish64.com/). Kexts here are compiled each time there's a new commit.

### Must haves

Without the below 2, no system is bootable:

* [VirtualSMC](https://github.com/acidanthera/VirtualSMC/releases)
  * Emulates the SMC chip found on real macs, without this macOS will not boot
  * Alternative is FakeSMC which can have better or worse support, most commonly used on legacy hardware.
* [Lilu](https://github.com/acidanthera/Lilu/releases)
  * A kext to patch many processes, required for AppleALC, WhateverGreen, VirtualSMC and many other kexts. Without Lilu, they will not work.
  * Note that Lilu and plugins requires OS X 10.8 or newer to function

### VirtualSMC Plugins

The below plugins are not required to boot, and merely add extra functionality to the system like hardware monitoring:

* SMCProcessor.kext
  * Used for monitoring CPU temperature, **doesn't work on AMD CPU based systems**
* SMCSuperIO.kext
  * Used for monitoring fan speed, **doesn't work on AMD CPU based systems**
* SMCLightSensor.kext
  * Used for the ambient light sensor on laptops, **desktops can ignore**
  * Do not use if you don't have an ambient light sensor, can cause issues otherwise
* SMCBatteryManager.kext
  * Used for measuring battery readouts on laptops, **desktops can ignore**
  * Do not use until battery has been properly patched, can cause issues otherwise. So for initial setup, please omit this kext. After install you can follow this page for setup: [Fixing Battery Read-outs](https://dortania.github.io/OpenCore-Post-Install/laptop-specific/battery.html)
* SMCDellSensors.kext
  * Allows for finer monitoring and control of the fans on Dell machines supporting System Management Mode(SMM)
  * **Do not use if you do not have a supported Dell machine**, mainly Dell laptops can benefit from this kext

### Graphics

* [WhateverGreen](https://github.com/acidanthera/WhateverGreen/releases)
  * Used for graphics patching DRM, boardID, framebuffer fixes, etc, all GPUs benefit from this kext.
  * Note the SSDT-PNLF.dsl file included is only required for laptops and AIOs, see [Getting started with ACPI](https://dortania.github.io/Getting-Started-With-ACPI/) for more info
  * Requires OS X 10.8 or newer

### Audio

* [AppleALC](https://github.com/acidanthera/AppleALC/releases)
  * Used for AppleHDA patching, allowing support for the majority of on-board sound controllers
  * AMD 15h/16h may have issues with this and Ryzen/Threadripper systems rarely have mic support
  * Requires OS X 10.8 or newer

### Ethernet

Here we're going to assume you know what ethernet card your system has, reminder that product spec pages will most likely list the type of network card.

* [IntelMausi](https://github.com/acidanthera/IntelMausi/releases)
  * Required for the majority of Intel NICs, chipsets that are based off of I211 will need the SmallTreeIntel82576 kext
  * Intel's 82578, 82579, i217, i218 and i219 NICs are officially supported
  * Requires OS X 10.9 or newer
* [SmallTreeIntel82576 kext](https://github.com/khronokernel/SmallTree-I211-AT-patch/releases)
  * Required for i211 NICs, based off of the SmallTree kext but patched to support I211
  * Required for most AMD boards running Intel NICs
  * Requires OS X 10.9-12(v1.0.6), macOS 10.13-14(v1.2.5), macOS 10.15+(v1.3.0)
* [AtherosE2200Ethernet](https://github.com/Mieze/AtherosE2200Ethernet/releases)
  * Required for Atheros and Killer NICs
  * Requires OS X 10.8 or newer
* [RealtekRTL8111](https://github.com/Mieze/RTL8111_driver_for_OS_X/releases)
  * For Realtek's Gigabit Ethernet
  * Requires OS X 10.11 or newer with v2.2.1+
* [LucyRTL8125Ethernet](https://github.com/Mieze/LucyRTL8125Ethernet)
  * For Realtek's 2.5Gb Ethernet
  * Requires macOS 10.15 or newer
* For Intel's i225-V NICs, patches are mentioned in the desktop Comet Lake DeviceProperty section. No kext is required.
  * Requires macOS 10.15 or newer

::: details Legacy Ethernet Kexts

Relevant for either legacy macOS installs or older PC hardware.

* [AppleIntele1000e](https://github.com/chris1111/AppleIntelE1000e)
  * Mainly relevant for 10/100MBe based Intel Ethernet controllers
* [RealtekRTL8100](https://www.insanelymac.com/forum/files/file/259-realtekrtl8100-binary/)
  * Mainly relevant for 10/100MBe based Realtek Ethernet controllers
  * Requires macOS 10.12 or newer with v2.0.0+
* [BCM5722D](https://github.com/chris1111/BCM5722D)
  * Mainly relevant for BCM5722 based Broadcom Ethernet controllers
  * Requires OS X 10.6 or newer

:::

### USB

* [USBInjectAll](https://github.com/Sniki/OS-X-USB-Inject-All/releases)
  * Used for injecting Intel USB controllers on systems without defined USB ports in ACPI
  * Not needed on Skylake and newer(AsRock is dumb and does need this)
  * Does not work on AMD CPUs **at all**
  * Requires OS X 10.11 or newer

* [XHCI-unsupported](https://github.com/RehabMan/OS-X-USB-Inject-All)
  * Needed for non-native USB controllers
  * AMD CPU based systems don't need this
  * Common chipsets needing this:
    * H370
    * B360
    * H310
    * Z390(Not needed on Mojave and newer)
    * X79
    * X99
    * AsRock boards(On Intel motherboards specifically, Z490 boards do not need it however)

### WiFi and Bluetooth

* [AirportBrcmFixup](https://github.com/acidanthera/AirportBrcmFixup/releases)
  * Used for patching non-Apple Broadcom cards, **will not work on Intel, Killer, Realtek, etc**
  * Requires OS X 10.8 or newer
* [BrcmPatchRAM](https://github.com/acidanthera/BrcmPatchRAM/releases)
  * Used for uploading firmware on Broadcom Bluetooth chipset, required for all non-Apple/Fenvi Airport cards.
  * To be paired with BrcmFirmwareData.kext
    * BrcmPatchRAM3 for 10.14+ (must be paired with BrcmBluetoothInjector)
    * BrcmPatchRAM2 for 10.11-10.14
    * BrcmPatchRAM for 10.10 or older

The order in `Kernel -> Add` should be:

1. BrcmBluetoothInjector
2. BrcmFirmwareData
3. BrcmPatchRAM3

### AMD CPU Specific kexts

* [XLNCUSBFIX](https://cdn.discordapp.com/attachments/566705665616117760/566728101292408877/XLNCUSBFix.kext.zip)
  * USB fix for AMD FX systems, not recommended for Ryzen
  * Requires macOS 10.13 or newer
* [VoodooHDA](https://sourceforge.net/projects/voodoohda/)
  * Audio for FX systems and front panel Mic+Audio support for Ryzen system, do not mix with AppleALC. Audio quality is noticeably worse than AppleALC on Zen CPUs

### Extras

* [AppleMCEReporterDisabler](https://github.com/acidanthera/bugtracker/files/3703498/AppleMCEReporterDisabler.kext.zip)
  * Useful starting with Catalina to disable the AppleMCEReporter kext which will cause kernel panics on AMD CPUs and dual-socket systems
  * Affected SMBIOS:
    * MacPro6,1
    * MacPro7,1
    * iMacPro1,1
  * Requires macOS 10.15 or newer
* [CpuTscSync](https://github.com/lvs1974/CpuTscSync)
  * Needed for syncing TSC on some of Intel's HEDT and server motherboards, without this macOS may be extremely slow or even unbootable. Skylake-X should use TSCAdjustReset instead
  * **Does not work on AMD CPUs**
  * Requires OS X 10.8 or newer
* [TSCAdjustReset](https://github.com/interferenc/TSCAdjustReset)
  * On Skylake-X, many firmwares including Asus and EVGA won't write the TSC to all cores. So we'll need to reset the TSC on cold boot and wake. Compiled version can be found here: [TSCAdjustReset.kext](https://github.com/dortania/OpenCore-Install-Guide/blob/master/extra-files/TSCAdjustReset.kext.zip). Note that you **must** open up the kext(ShowPackageContents in finder, `Contents -> Info.plist`) and change the Info.plist -> `IOKitPersonalities -> IOPropertyMatch -> IOCPUNumber` to the number of CPU threads you have starting from `0`(i9 7980xe 18 core would be `35` as it has 36 threads total)
  * **Does not work on AMD CPUs**
  * Requires macOS 10.12 or newer
* [NVMeFix](https://github.com/acidanthera/NVMeFix/releases)
  * Used for fixing power management and initialization on non-Apple NVMe
  * Requires macOS 10.14 or newer

### Laptop Specifics

To figure out what kind of keyboard and trackpad you have, check Device Manager in Windows or `dmesg |grep input` in Linux

#### Input drivers

* [VoodooPS2](https://github.com/acidanthera/VoodooPS2/releases)
  * For systems with PS2 Keyboards, Mice and Trackpads
  * Requires OS X 10.11 or newer for MT2 functions
* [Rehabman's VoodooPS2](https://github.com/RehabMan/OS-X-Voodoo-PS2-Controller)
  * For older systems with PS2 keyboards, Mice and Trackpads
  * For if you need to use VoodooPS2 for 10.6-10.11, or otherwise don't want to use VoodooInput for MT2 functions
* [VoodooRMI](https://github.com/VoodooSMBus/VoodooRMI/releases/)
  * For systems with Synaptic SMBus-based devices, mainly for trackpads and trackpoints.
  * Requires OS X 10.11 or newer for MT2 functions
* [VoodooSMBus](https://github.com/VoodooSMBus/VoodooSMBus)
  * For systems with ELANs SMBus-based devices, mainly for trackpads and trackpoints.
  * Requires OS X 10.11 or newer for MT2 functions
* [VoodooI2C](https://github.com/VoodooI2C/VoodooI2C/releases)
  * Used for fixing I2C devices, found with some fancier touchpads and touchscreen machines
  * Requires OS X 10.11 or newer for MT2 functions
  * To be paired with a plugin:
    * VoodooI2CHID - Implements the Microsoft HID device specification.
    * VoodooI2CElan - Implements support for Elan proprietary devices. (does not work on ELAN1200+, use the HID instead)
    * VoodooI2CSynaptics - Implements support for Synaptic's proprietary devices.
    * VoodooI2CFTE - Implements support for the FTE1001 touchpad.
    * VoodooI2CAtmelMXT - Implements Atmel Multitouch Protocol
* [AlpsT4USB](https://github.com/blankmac/AlpsT4USB)
  * Used for USB ALPS devices, **note** this does not work with I2C based devices.

#### Misc

* [NoTouchID](https://github.com/al3xtjames/NoTouchID/releases)
  * Recommended for MacBook SMBIOS that include a TouchID sensor to fix auth issues, generally 2016 and newer SMBIOS will require this
  * Requires macOS 10.13 or newer

Please refer to [Kexts.md](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/Kexts.md) for a full list of supported kexts

## SSDTs

So you see all those SSDTs in the AcpiSamples folder and wonder whether you need any of them. For us, we will be going over what SSDTs you need in **your specific ACPI section of the config.plist**, as the SSDTs you need are platform specific. With some even system specific where they need to be configured and you can easily get lost if I give you a list of SSDTs to choose from now.

[Getting started with ACPI](https://dortania.github.io/Getting-Started-With-ACPI/) has an extended section on SSDTs including compiling them on different platforms.

A quick TL;DR of needed SSDTs(This is source code, you will have to compile them into a .aml file):

### Desktop

| Platforms | **CPU** | **EC** | **AWAC** | **NVRAM** | **USB** |
| :-------: | :-----: | :----: | :------: | :-------: | :-----: |
| SandyBridge | [CPU-PM](https://dortania.github.io/OpenCore-Post-Install/universal/pm.html#sandy-and-ivy-bridge-power-management) (Run in Post-Install) | [SSDT-EC](https://dortania.github.io/Getting-Started-With-ACPI/Universal/ec-fix.html) | N/A | N/A | N/A |
| Ivy Bridge | ^^ | ^^ | N/A | N/A | N/A |
| Haswell | [SSDT-PLUG](https://dortania.github.io/Getting-Started-With-ACPI/Universal/plug.html) | ^^ | ^^ | ^^ | ^^ |
| Broadwell | ^^ | ^^ | ^^ | ^^ | ^^ |
| Skylake | ^^ | [SSDT-EC-USBX](https://dortania.github.io/Getting-Started-With-ACPI/Universal/ec-fix.html) | ^^ | ^^ | ^^ |
| Kaby Lake | ^^ | ^^ | ^^ | ^^ | ^^ |
| Coffee Lake | ^^ | ^^ | [SSDT-AWAC](https://dortania.github.io/Getting-Started-With-ACPI/Universal/awac.html) | [SSDT-PMC](https://dortania.github.io/Getting-Started-With-ACPI/Universal/nvram.html) | ^^ |
| Comet Lake | ^^ | ^^ | ^^ | N/A | [SSDT-RHUB](https://dortania.github.io/Getting-Started-With-ACPI/Universal/rhub.html) |
| AMD (15/16h) | N/A | ^^ | N/A | ^^ | N/A |
| AMD (17h) | [SSDT-CPUR for B550](https://github.com/dortania/Getting-Started-With-ACPI/blob/master/extra-files/compiled/SSDT-CPUR.aml) | ^^ | N/A | ^^ | N/A |

### High End Desktop

| Platforms | **CPU** | **EC** | **AWAC** |
| :-------: | :-----: | :----: | :------: |
| Nehalem and Westmere | N/A | [SSDT-EC](https://dortania.github.io/Getting-Started-With-ACPI/Universal/ec-fix.html) | N/A |
| Ivy Bridge-E | [SSDT-PLUG](https://dortania.github.io/Getting-Started-With-ACPI/Universal/plug.html) | ^^ | ^^ |
| Haswell-E | ^^ | [SSDT-EC-USBX](https://dortania.github.io/Getting-Started-With-ACPI/Universal/ec-fix.html) | ^^ |
| Broadwell-E | ^^ | ^^ | ^^ |
| Skylake-X | ^^ | ^^ | [SSDT-AWAC](https://dortania.github.io/Getting-Started-With-ACPI/Universal/awac.html) |

### Laptop

| Platforms | **CPU** | **EC** | **Backlight** | **I2C Trackpad** | **AWAC** | **USB** | **IRQ** |
| :-------: | :-----: | :----: | :-----------: | :--------------: | :------: | :-----: | :-----: |
| SandyBridge | [CPU-PM](https://dortania.github.io/OpenCore-Post-Install/universal/pm.html#sandy-and-ivy-bridge-power-management) (Run in Post-Install) | [SSDT-EC](https://dortania.github.io/Getting-Started-With-ACPI/Universal/ec-fix.html) | [SSDT-PNLF](https://dortania.github.io/Getting-Started-With-ACPI/Laptops/backlight.html) | N/A | N/A | N/A | [IRQ SSDT](https://dortania.github.io/Getting-Started-With-ACPI/Universal/irq.html) |
| Ivy Bridge | ^^ | ^^ | ^^ | ^^ | ^^ | ^^ | ^^ |
| Haswell | [SSDT-PLUG](https://dortania.github.io/Getting-Started-With-ACPI/Universal/plug.html) | ^^ | ^^ | [SSDT-GPI0](https://dortania.github.io/Getting-Started-With-ACPI/Laptops/trackpad.html) | ^^ | ^^ | ^^ |
| Broadwell | ^^ | ^^ | ^^ | ^^ | ^^ | ^^ | ^^ |
| Skylake | ^^ | [SSDT-EC-USBX](https://dortania.github.io/Getting-Started-With-ACPI/Universal/ec-fix.html) | ^^ | ^^ | ^^ | ^^ | N/A |
| Kaby Lake | ^^ | ^^ | ^^ | ^^ | ^^ | ^^ | ^^ |
| Coffee Lake (8th Gen) and Whiskey Lake | ^^ | ^^ | [SSDT-PNLF-CFL](https://dortania.github.io/Getting-Started-With-ACPI/Laptops/backlight.html) | ^^ | ^^ | ^^ | ^^ |
| Coffee Lake (9th Gen) | ^^ | ^^ | ^^ | ^^ | [SSDT-AWAC](https://dortania.github.io/Getting-Started-With-ACPI/Universal/awac.html) | ^^ | ^^ |
| Comet Lake | ^^ | ^^ | ^^ | ^^ | ^^ | ^^ | ^^ |
| Ice Lake | ^^ | ^^ | ^^ | ^^ | ^^ | [SSDT-RHUB](https://dortania.github.io/Getting-Started-With-ACPI/Universal/rhub.html) | ^^ |

Continuing:

| Platforms | **NVRAM** | **IMEI** |
| :-------: | :-------: | :------: |
| Sandy Bridge | N/A | [SSDT-IMEI](https://dortania.github.io/Getting-Started-With-ACPI/Universal/imei.html) |
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
