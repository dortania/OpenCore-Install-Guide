# Clover Kexts and Firmware driver conversion(.kext, .efi)

* Supported version: 0.6.5

Main thing to note is that you must specify your kexts and firmware drivers in your config.plist, or else they will not load. All kexts that are currently supported on Clover will work on OpenCore, however many have been deprecated with better variants being integrated into OpenCore. Firmware drivers are a bit different as they can in-fact break booting.

* [Kexts](#kexts)
* [Firmware Drivers](#firmware-drivers)

## Kexts

For the most part, all kexts are supported in OpenCore. However there are a few integrated

**Integrated Kexts:**

* NullCPUPowerManagement.kext
  * Integrated into `DummyPowerManagement` under `Kernel -> Emulate`
* BT4LEContinuityFixup.kext
  * Integrated into `ExtendBTFeatureFlags` under `Kernel -> Quirks`

## Firmware Drivers

**Supported ones:**

* AudioDxe.efi(Make sure this is from [OpenCorePkg](https://github.com/acidanthera/OpenCorePkg) and **not** Goldfish64's or Clover's repo)
* CsmVideoDxe.efi(Note that [BiosVideo.efi](https://github.com/acidanthera/DuetPkg) may be preferred)
* EnhancedFatDxe.efi
* ExFatDxeLegacy.efi
* ExFatDxe.efi
* GrubEXFAT.efi
* GrubISO9660.efi
* GrubNTFS.efi
* GrubUDF.efi
* HiiDatabase.efi
* HfsPlus.efi
* HfsPlusLegacy.efi
* NTFS.efi
* NvmExpressDxe.efi
* OpenRuntime.efi
* OpenUsbKbDxe.efi
* OsxFatBinaryDrv.efi
* Ps2MouseDxe.efi
* TbtForcePower.efi
* UsbMouseDxe.efi
* VBoxExt2.efi
* VBoxExt4.efi
* VBoxHfs.efi
* VBoxIso9600.efi
* XhciDxe.efi

**Drivers provided/merged into OpenCore and so are no longer needed:**

* APFS.efi
* ApfsDriverLoader.efi
* AppleEvent.efi
* AppleGenericInput.efi
* AppleImageCodec.efi
* AppleKeyMapAggregator.efi
* AppleUiSupport.efi
* AppleUITheme.efi
* AptioInputFix.efi
* AptioMemoryFix.efi
* AudioDxe.efi(well kinda, see AudioDxe shipped with [OpenCorePkg](https://github.com/acidanthera/OpenCorePkg))
* BootChimeDxe.efi
* DataHubDxe.efi
* EmuVariableUEFI.efi
* EnglishDxe.efi
* FirmwareVolume.efi
* HashServiceFix.efi
* SMCHelper.efi
* OcQuirks.efi
* VirtualSMC.efi

**Explicitly unsupported drivers:**

* AppleUsbKbDxe.efi(replaced with OpenUsbKbDxe.efi)
* FSInject.efi
* FwRuntimeServices.efi(replaced with OpenRuntime.efi)
* osxaptiofix2drv-free2000.efi
* osxaptiofix2drv.efi
* osxaptiofix3drv.efi
* osxaptiofixdrv.efi
* OsxFatBinaryDrv.efi
* OsxLowMemFixDrv.efi
* UsbKbDxe.efi(replaced with OpenUsbKbDxe.efi)

### AptioMemoryFix Note

Well before we actually get started on converting the Clover config, we must first talk about converting from AptioMemoryFix. The main thing to note is that it's inside of OpenCore with OpenRuntime being an extension, this means that AptioMemoryFix and that there's also a lot more settings to choose from. Please see the hardware specific sections of the OpenCore guide to know what Booter settings your system may require(HEDT like X99 and X299 should look to the closest CPU like Skylake-X should refer to Skylake guide and **read the comments** as they mention specifics for your system).
