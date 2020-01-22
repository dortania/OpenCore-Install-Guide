# Gathering files
Last edited: January 21, 2020

This section is for gathering miscellaneous files for booting macOS, we do expect you to know your hardware well before starting and hopefully made a Hackintosh before as we won't be deep diving in here.

> What's the best way to figure out if my hardware is supported?

See the [**supported hardware section**](https://github.com/khronokernel/Opencore-Vanilla-Desktop-Guide/blob/master/extras/hardware.md) for some better insight into what macOS requires to boot, hardware support between Clover and OpenCore are quite similar.

## Firmware Drivers

These are the drivers used for OpenCore, for the majority of systems you only need 3 .efi drivers to get up and running:

* [ApfsDriverLoader.efi](https://github.com/acidanthera/AppleSupportPkg/releases)
  * Needed for seeing APFS volumes.
* [VboxHfs.efi](https://github.com/acidanthera/AppleSupportPkg/releases) **or** [HfsPlus.efi](https://cdn.discordapp.com/attachments/606452360495104000/633621011887292416/HFSPlus.efi)
  * Needed for seeing HFS volumes. **Do not mix HFS drivers**
* [FwRuntimeServices.efi](https://github.com/acidanthera/OpenCorePkg/releases)
  * Replacement for [AptioMemoryFix.efi](https://github.com/acidanthera/AptioFixPkg), used for patching boot.efi for NVRAM fixes and better memory management.

For legacy users:

* [AppleUsbKbDxe.efi](https://github.com/acidanthera/OpenCorePkg/releases)
   * Used for OpenCore picker on **legacy systems running DuetPkg**, [not recommended and even harmful on IvyBridge and newer](https://applelife.ru/threads/opencore-obsuzhdenie-i-ustanovka.2944066/page-176#post-856653)
* [NvmExpressDxe.efi](https://github.com/acidanthera/OpenCorePkg/releases)
   * Used for Haswell and older when no NVMe driver is built into the firmware
* [XhciDxe.efi](https://github.com/acidanthera/OpenCorePkg/releases)
   * Used for Sandy Bridge and older when no XHCI driver is built into the firmware


For a full list of compatible drivers, see 11.2 Properties in the [OpenCorePkg Docs](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/Configuration.pdf). These files will go in your Drivers folder in your EFI

## Kexts

A kext is a **k**ernel **ext**ension, you can think of this as a driver for macOS, these files will go into the Kexts folder in your EFI

All kext listed below can be found pre-compiled in the [Kext Repo](http://kexts.goldfish64.com/). Kexts here are compiled each time there's a new commit.

**Must haves**:

* [VirtualSMC](https://github.com/acidanthera/VirtualSMC/releases)
  * Emulates the SMC chip found on real macs, without this macOS will not boot
  * Alternative is FakeSMC which can have better or worse support, most commonly used on legacy hardware.
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
    * BrcmPatchRAM3 for 10.14+ (must be paired with BrcmBluetoothInjector)
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

So you see all those SSDTs in the AcpiSamples folder and wonder whether you need any of them. For us, we will be going over what SSDTs you need in **your specific ACPI section of the config.plist**, as the SSDTs you need are platform specific. With some even system specific where they need to be configured and you can easily get lost if I give you a list of SSDTs to choose from now. 

[Getting started with ACPI](/extras/acpi.md) has an extended section on SSDTs for those who prefer doing things the old fasioned way.

