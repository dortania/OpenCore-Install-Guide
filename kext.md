# .efi drivers

For the majority of systems, you only need 3 .efi drivers to get up and running:

* [ApfsDriverLoader.efi](https://github.com/acidanthera/AppleSupportPkg/releases)
   * Needed for seeing APFS volumes.
* [VboxHfs.efi](https://github.com/acidanthera/AppleSupportPkg/releases) or HfsPlus.efi
   * Needed for seeing HFS volumes.
* [FwRuntimeServices.efi](https://github.com/acidanthera/AppleSupportPkg/releases)
   * Replacement for [AptioMemoryFix.efi](https://github.com/acidanthera/AptioFixPkg), used for patching boot.efi for NVRAM fixes and better memory management.
   
For extra functionality with OpenCore:

* [UsbKbDxe.efi](https://github.com/acidanthera/AppleSupportPkg)
* Used for Apple Hot keys and FileVault support when OpenCore's built-in drivers do not work with your firmware. Recommended to test without it first.

* [VirtualSmc.efi](https://github.com/acidanthera/VirtualSMC/releases)
   * Used for proper FileVault support, cannot be used with FakeSMC
   
For a full list of compatible drivers, see 11.2 Properties in the [OpenCorePkg Docs](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/Configuration.pdf)
   
# Kexts

All kext listed below can be found pre-compiled in the [Kext Repo](http://kexts.goldfish64.com/). Kexts here are compiled each time there's a new commit.

Must haves:
* [VirtualSMC](https://github.com/acidanthera/VirtualSMC/releases)
   * Emulates the SMC chip found on real macs, needed for all hacks
* [Lilu](https://github.com/vit9696/Lilu/releases)
   * A kext to patch many processes, required for AppleALC and WhateverGreen and recommended for VirtualSMC

Graphics:
* [WhateverGreen](https://github.com/acidanthera/WhateverGreen/releases)
* Used for graphics patching, all GPUs benifit from this kext.

Audio:
* [AppleALC](https://github.com/vit9696/AppleALC/releases)
   * Used for AppleHDA patching

Ethernet:
* [IntelMausiEthernet](https://github.com/Mieze/IntelMausiEthernet)
   * Required for Intel NICs, newer chipsets are based off of I211-AT will need the [I211-AT SmallTree kext](https://cdn.discordapp.com/attachments/390417931659378688/556912824228773888/SmallTree-Intel-211-AT-PCIe-GBE.kext.zip) SmallTree](https://cdn.discordapp.com/attachments/390417931659378688/556912824228773888/SmallTree-Intel-211-AT-PCIe-GBE.kext.zip)
* [AtherosE2200Ethernet](https://github.com/Mieze/AtherosE2200Ethernet)
   * Required for Atheros and Killer NICs
* [RealtekRTL8111](https://github.com/Mieze/RTL8111_driver_for_OS_X)
   * Required for Realtek NICs

USB:
* [USBInjectAll](https://bitbucket.org/RehabMan/os-x-usb-inject-all/downloads/)
   * Used for injecting intel USB controllers, H370, B360, H310 and X79/X99/X299 systems will likely need [XHCI-unsupported](https://github.com/RehabMan/OS-X-USB-Inject-All) as well

AMD CPU Specific kexts:
* [NullCPUPowerManagment](https://github.com/corpnewt/NullCPUPowerManagement)
   * AMD CPUs cannot use Intel's power managment so we need to nullify it
* [XLNCUSBFIX](https://cdn.discordapp.com/attachments/566705665616117760/566728101292408877/XLNCUSBFix.kext.zip)
   * USB fix for AMD systems
* [VoodooHDA](https://sourceforge.net/projects/voodoohda/)
   * Audio for FX systems and Mic+Audio support for Ryzen system, do not mix with AppleALC


Please refer to [Kexts.md](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/Kexts.md) for a full list of supported kexts

# SSDTs

So you see all those SSDTs in the AcpiSamples folder and wonder whether you need any of them. Well we'll be going over a couple to see whether you need them. Do note you'll need to compile these SSDTs with [MaciASL](https://github.com/acidanthera/MaciASL/releases) and please read them before compiling. Some require you to adjust them for your specific system(ie: EC0 to H_EC for SSDT-EC-USBX)


* [SSDT-AWAC](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-AWAC.dsl)
   *  This is the [300 series RTC patch](https://www.hackintosh-forum.de/forum/thread/39846-asrock-z390-taichi-ultimate/?pageNo=2), needed for most Z390 systems.
* [SSDT-RTC0](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-RTC0.dsl)
   * Alternative to [SSDT-AWAC](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-AWAC.dsl) when not compatible with your system.
* [SSDT-EC-USBX](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-EC-USBX.dsl)
   * Needed to setup USB power and such correctly, prefered option over renaming XHCI and required for booting macOS Catalina. This SSDT is meant for Skylake+ systems, please use [SSDT-EC](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-EC.dsl) and [SSDT-EHCx_OFF](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-EHCx_OFF.dsl) for older systems.

* [SSDT-EC](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-EC.dsl)
   * Needed to setup USB power correctly on pre-skylake systems and required for booting macOS Catalina.

* [SSDT-EHCx_OFF](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-EHCx_OFF.dsl)
   * Prefered alternative over renaming EHCI for setting up USB correctly on pre-skylake systems.

* [SSDT-PLUG](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-PLUG.dsl)
   * Sets `PluginType`, Clover altrenative would be under `Acpi -> GenerateOptions -> PluginType`. Do note that this SSDT is made for systems where `AppleACPICPU` attaches `CPU0`, though some systems have theirs starting at `PR00` so adjust accordingly.

* [SSDT-SBUS-MCHC](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-SBUS-MCHC.dsl)
   * Adds a SMbus device and fixes DeviceProperties injection via `_DSM` which is found in your DSDT table. Most can ignore.
