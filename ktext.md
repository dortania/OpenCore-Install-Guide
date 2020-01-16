# Gathering files
Last edited: January 15, 2020
## Gathering files

This section is for gathering miscellaneous files for booting macOS, we do expect you to know your hardware well before starting and hopefully made a Hackintosh before as we won't be deep diving in here.

> What's the best way to figure out if my hardware is supported?

See the [**supported hardware section**](https://github.com/khronokernel/Opencore-Vanilla-Desktop-Guide/blob/master/extras/hardware.md) for some better insight into what macOS requires to boot, hardware support between Clover and OpenCore are quite similar.

## Firmware Drivers

These are the drivers used for OpenCore, for the majority of systems you only need 3 .efi drivers to get up and running:

* [ApfsDriverLoader.efi](https://github.com/acidanthera/AppleSupportPkg/releases)
  * Needed for seeing APFS volumes.
* [VboxHfs.efi](https://github.com/acidanthera/AppleSupportPkg/releases) **or** [HfsPlus.efi](https://cdn.discordapp.com/attachments/606452360495104000/633621011887292416/HFSPlus.efi)
  * Needed for seeing HFS volumes. **Do not mix HFS drivers**
* [FwRuntimeServices.efi](https://github.com/acidanthera/AppleSupportPkg/releases)
  * Replacement for [AptioMemoryFix.efi](https://github.com/acidanthera/AptioFixPkg), used for patching boot.efi for NVRAM fixes and better memory management.

For extra functionality with OpenCore:

* [AppleUsbKbDxe.efi](https://github.com/acidanthera/AppleSupportPkg)
  * Used for Apple Hotkeys and FileVault support when OpenCore's built-in drivers do not work with your firmware. **Do not use unless KeySupport doesn't work**

For a full list of compatible drivers, see 11.2 Properties in the [OpenCorePkg Docs](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/Configuration.pdf). These files will go in your Drivers folder in your EFI

## Kexts

A kext is a **k**ernel **ext**ension, you can think of this as a driver for macOS, these files will go into the Kexts folder in your EFI

All kext listed below can be found pre-compiled in the [Kext Repo](http://kexts.goldfish64.com/). Kexts here are compiled each time there's a new commit.

**Must haves**:

* [VirtualSMC](https://github.com/acidanthera/VirtualSMC/releases)
  * Emulates the SMC chip found on real macs, without this macOS will not boot
  * Alternative is FakeSMC which can have better or worse support, most commonly used on legacy hardware. Does not support FileVault in OpenCore
* [Lilu](https://github.com/vit9696/Lilu/releases)
  * A kext to patch many processes, required for AppleALC and WhateverGreen and recommended for VirtualSMC

**VirtualSMC Plugins**:

* SMCProcessor.kext
  * Used for monitoring CPU temperature, doesn't work AMD CPU based systems
* SMCSuperIO.kext
  * Used for monitoring fan speed, doesn't work AMD CPU based systems
* SMCLightSensor.kext
  * Used for the ambient light sensor on laptops, desktops can ignore
* SMCBatteryManager.kext
  * Used for measuring battery readouts on laptops, desktops can ignore

**Graphics**:

* [WhateverGreen](https://github.com/acidanthera/WhateverGreen/releases)
  * Used for graphics patching, all GPUs benefit from this kext.

**Audio**:

* [AppleALC](https://github.com/vit9696/AppleALC/releases)
  * Used for AppleHDA patching, used for giving you onboard audio. AMD 15h/16h cannot use this and Ryzen/Threadripper systems rarely have mic support

**Ethernet**:

* [IntelMausiEthernet](https://github.com/Mieze/IntelMausiEthernet)
  * Required for Intel NICs, newer chipsets are based off of I211-AT will need the [SmallTreeIntel82576 kext](https://drive.google.com/file/d/0B5Txx3pb7pgcOG5lSEF2VzFySWM/view?usp=sharing). AMD motherboards with intel NICs generally run I211-AT
* [AtherosE2200Ethernet](https://github.com/Mieze/AtherosE2200Ethernet)
  * Required for Atheros and Killer NICs
* [RealtekRTL8111](https://github.com/Mieze/RTL8111_driver_for_OS_X)
  * Required for Realtek NICs

**USB**:

* [USBInjectAll](https://bitbucket.org/RehabMan/os-x-usb-inject-all/downloads/)
  * Used for injecting intel USB controllers, H370, B360, H310 and X79/X99/X299 systems will likely need [XHCI-unsupported](https://github.com/RehabMan/OS-X-USB-Inject-All) as well. **Does not work on AMD CPU based systems**

**WiFi and Bluetooth**:

* [AirportBrcmFixup](https://github.com/acidanthera/AirportBrcmFixup)
  * Used for patching non-Apple Broadcom cards, **will not work on intel, Killer, Realtek, etc**
* [BrcmPatchRAM](https://github.com/acidanthera/BrcmPatchRAM)
  * Used for uploading firmware on broadcom bluetooth chipset, required for all non-Apple Airport cards.
  * To be paired with BrcmFirmwareData.kext
    * BrcmPatchRAM3 for 10.14+
    * BrcmPatchRAM2 for 10.11-10.14
    * BrcmPatchRAM for 10.10 or older

**AMD CPU Specific kexts**:

* [NullCPUPowerManagment](https://github.com/corpnewt/NullCPUPowerManagement)
  * AMD CPUs cannot use Intel's power management so we need to nullify it.
* [XLNCUSBFIX](https://cdn.discordapp.com/attachments/566705665616117760/566728101292408877/XLNCUSBFix.kext.zip)
  * USB fix for AMD FX systems, no effect on Ryzen
* [VoodooHDA](https://sourceforge.net/projects/voodoohda/)
  * Audio for FX systems and front panel Mic+Audio support for Ryzen system, do not mix with AppleALC. Audio quality is noticably worse than AppleALC on Zen CPUs

**Extra's**:

* [AppleMCEReporterDisabler](https://github.com/acidanthera/bugtracker/files/3703498/AppleMCEReporterDisabler.kext.zip)
  * Useful starting with Catalina to disable the AppleMCEReporter kext which will cause kernel panics on AMD CPUs and dual-socket systems:
    * MacPro6,1
    * MacPro7,1
    * iMacPro1,1
* [VoodooTSCSync](https://bitbucket.org/RehabMan/VoodooTSCSync/downloads/)
   * Needed for correcting TSC on some of Intel's HEDT and server motherboards, without this macOS may be extremly slow or even unbootable


Please refer to [Kexts.md](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/Kexts.md) for a full list of supported kexts

## SSDTs

So you see all those SSDTs in the AcpiSamples folder and wonder whether you need any of them. Well, we'll be going over a couple to see whether you need them. Do note you'll need to compile these SSDTs with [MaciASL](https://github.com/acidanthera/MaciASL/releases) and please read them before compiling. Some require you to adjust them for your specific system\(ie: EC0 to H\_EC for SSDT-EC-USBX\). These files will go in your ACPI folder in your EFI

**If you're unsure which you need, the specific ones for each platform are mentioned in ACPI section for your CPU's config guide and info on making these files can be found in the [Getting started with ACPI](/extras/acpi.md)**

* [SSDT-AWAC](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-AWAC.dsl)
* This is the [300 series RTC patch](https://www.hackintosh-forum.de/forum/thread/39846-asrock-z390-taichi-ultimate/?pageNo=2), needed for most Z390 systems though newer BIOS revisions are starting to push this to all 300 series boards including Z370. This forces the legacy RTC clock on as macOS can't communicate with AWAC yet
* [SSDT-RTC0](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-RTC0.dsl)
  * Alternative to [SSDT-AWAC](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-AWAC.dsl) when there is no RTC clock to enable, this SSDT will fake it instead
* [SSDT-EC-USBX](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-EC-USBX.dsl)
  * Needed to setup USB power and such correctly and required for booting macOS Catalina. This SSDT is meant for Skylake+ systems, please use [SSDT-EC](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-EC.dsl) for older systems. See the [What's new in macOS Catalina](https://www.reddit.com/r/hackintosh/comments/den28t/whats_new_in_macos_catalina/) for more info regarding Embedded controller fix.
* [SSDT-EC](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-EC.dsl)
  * Needed to setup the embedded controller correctly on pre-skylake systems and required for booting macOS Catalina.
* [SSDT-EHCx\_OFF](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-EHCx_OFF.dsl)
  * Used for disabling phatom ports on pre-skylake systems like for Z77, Z87, Z97, X79 and X99, not need if XHCI-Handoff is enabled in the BIOS
* [SSDT-PLUG](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-PLUG.dsl)
  * Sets `PluginType`, Clover alternative would be under `Acpi -> GenerateOptions -> PluginType`. Do note that this SSDT is made for systems where `AppleACPICPU` attaches `CPU0`, though some ACPI tables have theirs starting at `PR00` so adjust accordingly. X99 and X299 users need to verify if the path is correct\(ie: `\_PR.PR00` vs `\_PR.PC00.PR00`\)
* [SSDT-SBUS-MCHC](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-SBUS-MCHC.dsl)
  * Adds an SMBus device and fixes DeviceProperties injection via `_DSM` for when adding properties via an SSDT.

**Remember to verify that the ACPI path in the SSDT matches up with your DSDT, extremely important for X79, X99 and X299 users**

