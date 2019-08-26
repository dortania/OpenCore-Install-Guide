# .efi drivers

For the majority of systems, you only need 3 .efi drivers:

* [ApfsDriverLoader.efi](https://github.com/acidanthera/AppleSupportPkg/releases)
   * Needed for seeing APFS volumes.
* HfsPlus.efi or [VboxHfs.efi](https://github.com/acidanthera/AppleSupportPkg/releases)
   * Needed for seeing HFS volumes.
* [FwRuntimeServices.efi](https://github.com/acidanthera/AppleSupportPkg/releases)
   * Replacemnet for [AptioMemoryFix.efi](https://github.com/acidanthera/AptioFixPkg), used for patching boot.efi for NVRAM fixes and better memory management.
   
   For a full list of compatible drivers, see 11.2 Properties in the [OpenCorePkg Docs](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/Configuration.pdf)
   
# Kexts

Work in progress, please refer to [Kexts.md](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/Kexts.md) for a full list of supported kexts

# SSDTs

So you see all those SSDTs in the AcpiSamples folder and wonder whether you need any of them. Well we'll be going over a couple to see whether you need them. Do note you'll need to compile these SSDTs with [MaciASL](https://github.com/acidanthera/MaciASL/releases) and please read them before compiling. Some require you to adjust them for your specific system(ie: EC0 to H_EC for SSDT-EC-USBX)


* [SSDT-AWAC](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-AWAC.dsl)
   *  This is the [300 series RTC patch](https://www.hackintosh-forum.de/forum/thread/39846-asrock-z390-taichi-ultimate/?pageNo=2), needed for certain Z390 systems

* [SSDT-EC-USBX](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-EC-USBX.dsl)
   * Needed to setup USB power and such correctly, prefered option over renaming XHCI. This SSDT is meant for Skylake+ systems, please use [SSDT-EC](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-EC.dsl) and [SSDT-EHCx_OFF](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-EHCx_OFF.dsl) for older systems

* [SSDT-EC](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-EC.dsl)
   * Needed to setup USB power correctly on pre-skylake systems

* [SSDT-EHCx_OFF](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-EHCx_OFF.dsl)
   * Prefered alternative over renaming EHCI for setting up USB correctly on pre-skylake systems

* [SSDT-PLUG](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-PLUG.dsl)
   * Sets `PluginType`, Clover altrenative would be under `Acpi -> GenerateOptions -> PluginType`

* [SSDT-SBUS-MCHC](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-SBUS-MCHC.dsl)
   * Adds a SMbus device and fixes DeviceProperties injection via _DSM whcih is found in your DSDT table. Most can ignore
