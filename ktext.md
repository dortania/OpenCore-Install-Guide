# Gathering files

* Supported version: 0.5.7

This section is for gathering miscellaneous files for booting macOS, we do expect you to know your hardware well before starting and hopefully made a Hackintosh before as we won't be deep diving in here.

> What's the best way to figure out if my hardware is supported?

See the [**supported hardware section**](https://github.com/khronokernel/Opencore-Vanilla-Desktop-Guide/blob/master/extras/hardware.md) for some better insight into what macOS requires to boot, hardware support between Clover and OpenCore are quite similar.

## Firmware Drivers

These are the drivers used by OpenCore, for the majority of systems you only need 3 .efi drivers to get up and running:

* [ApfsDriverLoader.efi](https://github.com/acidanthera/AppleSupportPkg/releases)
   * Needed for seeing APFS volumes(ie. macOS)
* [VboxHfs.efi](https://github.com/acidanthera/AppleSupportPkg/releases) **or** [HfsPlus.efi](https://github.com/acidanthera/OcBinaryData/blob/master/Drivers/HfsPlus.efi)
   * Needed for seeing HFS volumes(ie. macOS Installers and Recovery partitions/images). **Do not mix HFS drivers**
* [OpenRuntime.efi](https://github.com/acidanthera/OpenCorePkg/releases)
  * Replacement for [AptioMemoryFix.efi](https://github.com/acidanthera/AptioFixPkg), used for patching boot.efi for NVRAM fixes and better memory management.

For legacy users:

* [OpenUsbKbDxe.efi](https://github.com/acidanthera/OpenCorePkg/releases)
   * Used for OpenCore picker on **legacy systems running DuetPkg**, [not recommended and even harmful on UEFI(Ivy Bridge and newer)](https://applelife.ru/threads/opencore-obsuzhdenie-i-ustanovka.2944066/page-176#post-856653)
* [NvmExpressDxe.efi](https://github.com/acidanthera/OpenCorePkg/releases)
   * Used for Haswell and older when no NVMe driver is built into the firmware, not needed if you're not using an NVMe drive
* [XhciDxe.efi](https://github.com/acidanthera/OpenCorePkg/releases)
   * Used for Sandy Bridge and older when no XHCI driver is built into the firmware, not needed if you're not using a USB 3.0 expansion card
* [HfsPlusLegacy.efi](https://github.com/acidanthera/OcBinaryData/blob/master/Drivers/HfsPlusLegacy.efi)
   * Legacy variant of HfsPlus, used for systems that lack RDRAND instruction support. This is generally seen on SandyBridge and older

For a full list of compatible drivers, see 11.2 Properties in the [OpenCorePkg Docs](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/Configuration.pdf). These files will go in your Drivers folder in your EFI

## Kexts

A kext is a **k**ernel **ext**ension, you can think of this as a driver for macOS, these files will go into the Kexts folder in your EFI

All kext listed below can be found **pre-compiled** in the [Kext Repo](http://kexts.goldfish64.com/). Kexts here are compiled each time there's a new commit.

**Must haves**:

* [VirtualSMC](https://github.com/acidanthera/VirtualSMC/releases)
  * Emulates the SMC chip found on real macs, without this macOS will not boot
  * Alternative is FakeSMC which can have better or worse support, most commonly used on legacy hardware.
* [Lilu](https://github.com/vit9696/Lilu/releases)
  * A kext to patch many processes, required for AppleALC and WhateverGreen and recommended for VirtualSMC

**VirtualSMC Plugins**:

* SMCProcessor.kext
  * Used for monitoring CPU temperature, **doesn't work AMD CPU based systems**
* SMCSuperIO.kext
  * Used for monitoring fan speed, **doesn't work AMD CPU based systems**
* SMCLightSensor.kext
  * Used for the ambient light sensor on laptops, **desktops can ignore**
  * Do not use if you don't have an ambient light sensor, can cause issues otherwise
* SMCBatteryManager.kext
  * Used for measuring battery readouts on laptops, **desktops can ignore**
  * Do not use until battery has been poperly patched, can cause issues otherwise

**Graphics**:

* [WhateverGreen](https://github.com/acidanthera/WhateverGreen/releases)
  * Used for graphics patching DRM, boardID, framebuffer fixes, etc, all GPUs benefit from this kext.

**Audio**:

* [AppleALC](https://github.com/vit9696/AppleALC/releases)
  * Used for AppleHDA patching, used for giving you onboard audio. AMD 15h/16h may have issues with this and Ryzen/Threadripper systems rarely have mic support

**Ethernet**:

* [IntelMausiEthernet](https://github.com/Mieze/IntelMausiEthernet)
  * Required for Intel NICs, chipsets that are based off of I211-AT will need the SmallTreeIntel82576 kext
* [SmallTreeIntel82576 kext](https://github.com/khronokernel/SmallTree-I211-AT-patch/releases)
  * Required for I211-AT NICs, based off of the SmallTree kext but patched to support I211-AT
  * Required for most AMD boards running Intel NICs
* [AtherosE2200Ethernet](https://github.com/Mieze/AtherosE2200Ethernet/releases)
  * Required for Atheros and Killer NICs
* [RealtekRTL8111](https://github.com/Mieze/RTL8111_driver_for_OS_X/releases)
  * Required for Realtek NICs

**USB**:

* [USBInjectAll](https://bitbucket.org/RehabMan/os-x-usb-inject-all/downloads/)
  * Used for injecting Intel USB controllers, H370, B360, H310 and X79/X99/X299 systems will likely need [XHCI-unsupported](https://github.com/RehabMan/OS-X-USB-Inject-All) as well. **USBInjectAll does not work on AMD CPU based systems**

**WiFi and Bluetooth**:

* [AirportBrcmFixup](https://github.com/acidanthera/AirportBrcmFixup/releases)
  * Used for patching non-Apple Broadcom cards, **will not work on intel, Killer, Realtek, etc**
* [BrcmPatchRAM](https://github.com/acidanthera/BrcmPatchRAM/releases)
  * Used for uploading firmware on broadcom bluetooth chipset, required for all non-Apple Airport cards.
  * To be paired with BrcmFirmwareData.kext
    * BrcmPatchRAM3 for 10.14+ (must be paired with BrcmBluetoothInjector)
    * BrcmPatchRAM2 for 10.11-10.14
    * BrcmPatchRAM for 10.10 or older
    
The order in `Kernel -> Add` should be: 

1. BrcmBluetoothInjector 
2. BrcmFirmwareData 
3. BrcmPatchRAM3

**AMD CPU Specific kexts**:

* [~~NullCPUPowerManagment~~](https://github.com/corpnewt/NullCPUPowerManagement)
   * Thanks to OpenCore 0.5.5, we have a much better solution known as `DummyPowerManagement` found under `Kernel -> Quirks`
* [XLNCUSBFIX](https://cdn.discordapp.com/attachments/566705665616117760/566728101292408877/XLNCUSBFix.kext.zip)
  * USB fix for AMD FX systems, no effect on Ryzen
* [VoodooHDA](https://sourceforge.net/projects/voodoohda/)
  * Audio for FX systems and front panel Mic+Audio support for Ryzen system, do not mix with AppleALC. Audio quality is noticably worse than AppleALC on Zen CPUs

**Extra's**:

* [AppleMCEReporterDisabler](https://github.com/acidanthera/bugtracker/files/3703498/AppleMCEReporterDisabler.kext.zip)
  * Useful starting with Catalina to disable the AppleMCEReporter kext which will cause kernel panics on AMD CPUs and dual-socket systems
  * Affected SMBIOS:
    * MacPro6,1
    * MacPro7,1
    * iMacPro1,1
* [VoodooTSCSync](https://bitbucket.org/RehabMan/VoodooTSCSync/downloads/)
   * Needed for syncing TSC on some of Intel's HEDT and server motherboards, without this macOS may be extremly slow or even unbootable. Skylake-X should use TSCAdjustReset instead
* [TSCAdjustReset](https://github.com/interferenc/TSCAdjustReset) 
   * On Skylake-X, many firmwares including Asus and EVGA won't write the TSC to all cores. So we'll need to reset the TSC on cold boot and wake. Compiled version can be found here: [TSCAdjustReset.kext](https://github.com/khronokernel/Opencore-Vanilla-Desktop-Guide/blob/master/extra-files/TSCAdjustReset.kext.zip). Note that you **must** open up the kext(ShowPackageContents in finder, `Contents -> Info.plist`) and change the Info.plist -> `IOKitPersonalities -> IOPropertyMatch -> IOCPUNumber` to the number of CPU threads you have starting from `0`(i9 7980xe 18 core would be `35` as it has 36 threads total)
* [NVMeFix](https://github.com/acidanthera/NVMeFix/releases)
   * Used for fixing power management and initialization on non-Apple NVMe, requires macOS 10.14 or newer


Please refer to [Kexts.md](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/Kexts.md) for a full list of supported kexts

## SSDTs

So you see all those SSDTs in the AcpiSamples folder and wonder whether you need any of them. For us, we will be going over what SSDTs you need in **your specific ACPI section of the config.plist**, as the SSDTs you need are platform specific. With some even system specific where they need to be configured and you can easily get lost if I give you a list of SSDTs to choose from now. 

[Getting started with ACPI](/extras/acpi.md) has an extended section on SSDTs including compiling them on different platforms.

A quick TL;DR of needed SSDTs(This is source code, you will have to compile them into a .aml file):

**Ivy Bridge:**
* [SSDT-EC](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-EC.dsl)
* [CPU-PM](https://github.com/Piker-Alpha/ssdtPRGen.sh)

**Haswell:**
* [SSDT-PLUG](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-PLUG.dsl)
* [SSDT-EC](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-EC.dsl)

**Skylake:**
* [SSDT-PLUG](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-PLUG.dsl)
* [SSDT-EC-USBX](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-EC-USBX.dsl)

**Kabylake:**
* [SSDT-PLUG](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-PLUG.dsl)
* [SSDT-EC-USBX](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-EC-USBX.dsl)

**Coffeelake:**
* [SSDT-PLUG](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-PLUG.dsl)
* [SSDT-EC-USBX](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-EC-USBX.dsl)
* [SSDT AWAC](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-AWAC.dsl)
* [SSDT-PMC](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-PMC.dsl)

**Haswell-E:**
* [SSDT-PLUG](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-PLUG.dsl)
* [SSDT-EC](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-EC.dsl)

**Broadwell-E:**
* [SSDT-PLUG](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-PLUG.dsl)
* [SSDT-EC](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-EC.dsl)

**Skylake-X:**
* [SSDT-PLUG](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-PLUG.dsl)
* [SSDT-EC-USBX](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-EC-USBX.dsl)

**AMD:**
* [SSDT-EC-USBX](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-EC-USBX.dsl)

# Now head to your specific CPU section to setup your config.plist

**Intel Config.plist**

* [Ivy Bridge](/config.plist/ivy-bridge.md)
* [Haswell](/config.plist/haswell.md)
* [Skylake](/config.plist/skylake.md)
* [Kaby Lake](/config.plist/kaby-lake.md)
* [Coffee Lake](/config.plist/coffee-lake.md)

**Intel HEDT Config.plist**

* [Skylake-X](/config-HEDT/skylake-x.md)

**AMD Config.plist**

* [AMD](/AMD/AMD-config.md)
