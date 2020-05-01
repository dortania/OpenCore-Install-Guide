# Clover Firmware driver conversion

* Supported version: 0.5.8

Main thing to note is that you must specify your kexts and firmware drivers in your config.plist, or else they will not load. All kexts that are currently supported on Clover will work on Opencore, firmware drivers are a bit different.

**Supported ones:**

* AudioDxe.efi(Make sure this is from [AppleSupportPkg](https://github.com/acidanthera/AppleSupportPkg) and **not** Goldfish64's repo)
* EnhancedFatDxe.efi
* GrubEXFAT.efi
* GrubISO9660.efi
* GrubNTFS.efi
* GrubUDF.efi
* HfsPlus.efi
* NTFS.efi
* NvmExpressDxe.efi
* OpenRuntime.efi
* OpenUsbKbDxe.efi
* Ps2MouseDxe.efi
* TbtForcePower.efi
* UsbMouseDxe.efi
* VBoxExt2.efi
* VBoxExt4.efi
* VBoxHfs.efi
* VBoxIso9600.efi
* XhciDxe.efi

**Drivers provided/merged into Opencore and so are no longer needed:**

* ApfsDriverLoader.efi
* AppleEvent.efi
* AppleGenericInput.efi
* AppleImageCodec.efi
* AppleKeyMapAggregator.efi
* AppleUiSupport.efi
* AppleUITheme.efi
* AptioInputFix.efi
* AptioMemoryFix.efi
* AudioDxe.efi(well kinda, see AudioDxe shipped with [AppleSupportPkg](https://github.com/acidanthera/AppleSupportPkg))
* BootChimeDxe.efi
* DataHubDxe.efi
* EmuVariableUEFI.efi
* EnglishDxe.efi
* FirmwareVolume.efi
* HashServiceFix.efi
* VirtualSMC.efi

**Explicitly unsupported drivers:**

* AppleUsbKbDxe.efi(replaced with OpenUsbKbDxe.efi)
* FwRuntimeServices.efi(replaced with OpenRuntime.efi)
* osxaptiofix2drv-free2000.efi
* osxaptiofix2drv.efi
* osxaptiofix3drv.efi
* osxaptiofixdrv.efi
* OsxFatBinaryDrv.efi
* OsxLowMemFixDrv.efi
* SMCHelper.efi
* UsbKbDxe.efi(replaced with OpenUsbKbDxe.efi)

# AptioMemoryFix

Well before we actually get started on converting the Clover config, we must first talk about converting from AptioMemoryFix. The main thing to note is that it's inside of OpenCore with OpenRuntime being an extension, this means that AptioMemoryFix and that there's also a lot more settings to choose from. Please see the hardware specific sections of the OpenCore guide to know what booter settings your system may require(HEDT like X99 and X299 should look to the closest CPU like Skylake-X should refer to Skylake guide and **read the comments** as they mention specifics for your system).
