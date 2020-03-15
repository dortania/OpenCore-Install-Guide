# Clover Firmware driver conversion

* Last edited: March 15, 2020
* Supported version: 0.5.6

Main thing to note is that you must specify your kexts and firmware drivers in your config.plist, or else they will not load. All kexts that are currently supported on Clover will work on Opencore, firmware drivers are a bit different. 

**Supported ones:**

* ApfsDriverLoader.efi
* FwRuntimeServices.efi
* HFSPlus.efi
* VBoxHfs.efi
* EnhancedFatDxe.efi
* AppleUsbKbDxe.efi
* UsbMouseDxe.efi
* XhciDxe.efi
* AudioDxe.efi
* BootChimeDxe.efi
* NvmExpressDxe.efi
* TbtForcePower.efi
* Ps2MouseDxe.efi
* VBoxExt2.efi
* VBoxExt4.efi
* NTFS.efi
* VBoxIso9600.efi
* GrubUDF.efi
* GrubNTFS.efi
* GrubISO9660.efi
* GrubEXFAT.efi

**Drivers provided/merged into Opencore and so are no longer needed:**

* DataHubDxe.efi
* EnglishDxe.efi
* AppleGenericInput.efi
* AppleUiSupport.efi
* AppleImageCodec.efi
* AppleUITheme.efi
* AppleKeyMapAggregator.efi
* AppleEvent.efi
* AptioInputFix.efi
* EmuVariableUEFI.efi
* AptioMemoryFix.efi
* FirmwareVolume.efi
* HashServiceFix.efi
* VirtualSMC.efi
* BootChimeDxe.efi
* AudioDxe.efi(well kinda, see AudioDxe shipped with [AppleSupportPkg](https://github.com/acidanthera/AppleSupportPkg))


**Explictely unsupported drivers:**

* osxaptiofixdrv.efi
* osxaptiofix2drv.efi
* osxaptiofix2drv-free2000.efi
* osxaptiofix3drv.efi
* OsxFatBinaryDrv.efi
* OsxLowMemFixDrv.efi
* SMCHelper.efi
* UsbKbDxe.efi(replaced with AppleUsbKbDxe.efi)


# AptioMemoryFix

Well before we actually get started on converting the Clover config, we must first talk about converting from AptioMemoryFix. The main thing to note is that it's inside of OpenCore with FwRuntimeServices being an extension, this means that AptioMemoryFix and that there's also a lot more settings to choose from. Please see the hardware specific sections of the OpenCore guide to know what booter settings your system may require(HEDT like X99 and X299 should look to the closest CPU like Skylake-X should refer to Skylake guide and **read the comments** as they mention specifics for your system).
