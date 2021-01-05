# OpenCore Boot Issues

* Supported version: 0.6.5

Issues surrounding from initial booting the USB itself to right before you choose to boot the macOS installer

* [Stuck on a black screen before picker or always restart](#stuck-on-a-black-screen-before-picker)
* [Stuck on `no vault provided!`](#stuck-on-no-vault-provided)
* [Stuck on `OC: Invalid Vault mode`](#stuck-on-oc-invalid-vault-mode)
* [Stuck on `OCB: OcScanForBootEntries failure - Not Found`](#stuck-on-ocb-ocscanforbootentries-failure-not-found)
* [Stuck on `OCB: failed to match a default boot option`](#stuck-on-ocb-failed-to-match-a-default-boot-option)
* [Stuck on `OCB: System has no boot entries`](#stuck-on-ocb-system-has-no-boot-entries)
* [Stuck on `OCS: No schema for DSDT, KernelAndKextPatch, RtVariable, SMBIOS, SystemParameters...`](#stuck-on-ocs-no-schema-for-dsdt-kernelandkextpatch-rtvariable-smbios-systemparameters)
* [Stuck on `OC: Driver XXX.efi at 0 cannot be found`](#stuck-on-oc-driver-xxx-efi-at-0-cannot-be-found)
* [Receiving `Failed to parse real field of type 1`](#receiving-failed-to-parse-real-field-of-type-1)
* [Can't select anything in the picker](#can-t-select-anything-in-the-picker)
* [SSDTs not being added](#ssdts-not-being-added)
* [Booting OpenCore reboots to BIOS](#booting-opencore-reboots-to-bios)
* [OCABC: Incompatible OpenRuntime r4, require r10](#ocabc-incompatible-openruntime-r4-require-r10)

## Stuck on a black screen before picker

This is likely some error either on your firmware or OpenCore, specifically it's having troubles loading all the drivers and presenting the menu. The best way to diagnose it is via [OpenCore's DEBUG Build](./../debug.md) and checking the logs whether OpenCore actually loaded, and if so what is it getting stuck on.

**Situations where OpenCore did not load**:

* If there are no logs present even after setting up the DEBUG version of OpenCore with Target set to 67, there's likely an issue either with:
  * Incorrect USB Folder Structure
    * See [Booting OpenCore reboots to BIOS](#booting-opencore-reboots-to-bios) for more info
  * Firmware does not support UEFI
    * You'll need to setup DuetPkg, this is covered in both the [macOS](../../installer-guide/mac-install.md) and [Windows](../../installer-guide/winblows-install.md) install pages

**Situations where OpenCore did load**:

* Check the last line printed in your logs, there will likely be either a .efi driver that's been loaded or some form of ASSERT
  * For ASSERT's, you'll want to actually inform the developers about this issue here: [Acidanthera's Bugtracker](https://github.com/acidanthera/bugtracker)
  * For .efi drivers getting stuck, check over the following:
    * **HfsPlus.efi load issues:**
      * Try using [HfsPlusLegacy.efi](https://github.com/acidanthera/OcBinaryData/blob/master/Drivers/HfsPlusLegacy.efi) instead
      * This is recommended for CPUs that do not support RDRAND, mainly relevant for 3rd gen Ivy bridge i3 and older
      * [VBoxHfs.efi](https://github.com/acidanthera/AppleSupportPkg/releases/tag/2.1.7) is another option however is much slower than HfsPlus's version
    * **HiiDatabase.efi load issues:**
      * Likely your firmware already supports HiiDatabase, so the driver is conflicting. Simply remove the driver as you don't need it.

## Stuck on `no vault provided!`

Turn off Vaulting in your config.plist under `Misc -> Security -> Vault` by setting it to:

* `Optional`

If you have already executed the `sign.command` you will need to restore the OpenCore.efi file as the 256 byte RSA-2048 signature has been shoved in. Can grab a new copy of OpenCore.efi here: [OpenCorePkg](https://github.com/acidanthera/OpenCorePkg/releases)

**Note**: Vault and FileVault are 2 separate things, see [Security and FileVault](https://dortania.github.io/OpenCore-Post-Install/universal/security.html) for more details

## Stuck on `OC: Invalid Vault mode`

This is likely a spelling mistake, options in OpenCore are case-sensitive so make sure you check closely, **O**ptional is the correct way to enter it under `Misc -> Security -> Vault`

## Can't see macOS partitions

Main things to check:

* ScanPolicy set to `0` to show all drives
* Have the proper firmware drivers such as HfsPlus(Note ApfsDriverLoader shouldn't be used in 0.5.8)
* Set UnblockFsConnect to True in config.plist -> UEFI -> Quirks. Needed for some HP systems
* Set **SATA Mode**: `AHCI` in BIOS
* Set `UEFI -> APFS` to see APFS based drives:
  * **EnableJumpstart**: YES
  * **HideVerbose**: NO
  * If running older versions of High Sierra(ie. 10.13.5 or older), set the following:
    * **MinDate**: `-1`
    * **MinVersion**: `-1`

## Stuck on `OCB: OcScanForBootEntries failure - Not Found`

This is due to OpenCore being unable to find any drives with the current ScanPolicy, setting to `0` will allow all boot options to be shown

* `Misc -> Security -> ScanPolicy -> 0`

## Stuck on `OCB: failed to match a default boot option`

Same fix as `OCB: OcScanForBootEntries failure - Not Found`, OpenCore is unable to find any drives with the current ScanPolicy, setting to `0` will allow all boot options to be shown

* `Misc -> Security -> ScanPolicy -> 0`

## Stuck on `OCB: System has no boot entries`

Same fix as the above 2:

* `Misc -> Security -> ScanPolicy -> 0`

## Stuck on `OCS: No schema for DSDT, KernelAndKextPatch, RtVariable, SMBIOS, SystemParameters...`

This is due to either using a Clover config with OpenCore or using a configurator such as Mackie's Clover and OpenCore configurator. You'll need to start over and make a new config or figure out all the garbage you need to remove from your config. **This is why we don't support configurators, they are known for these issues**

* Note: These same issues will also occur if you mix outdated configs with newer versions of OpenCore. Please update them accordingly

## Stuck on `OC: Driver XXX.efi at 0 cannot be found`

This is due to an entry being in your config.plist, however not present in your EFI. To resolve:

* Ensure your EFI/OC/Drivers matches up with your config.plist -> UEFI -> Drivers
  * If not, please run Cmd/Ctrl+R with OpenCore to re-snapshot your config.plist

Note that the entries are case-sensitive.

## Receiving "Failed to parse real field of type 1"

This is due to a value set as `real` when it's not supposed to be, generally being that Xcode converted `HaltLevel` by accident:

```xml
<key>HaltLevel</key>
 <real>2147483648</real>
```

To fix, swap `real` for `integer`:

```xml
<key>HaltLevel</key>
 <integer>2147483648</integer>
```

## Can't select anything in the picker

This is due to either a few things

* Incompatible keyboard driver:
  * Disable `PollAppleHotKeys` and enable `KeySupport`, then remove [OpenUsbKbDxe](https://github.com/acidanthera/OpenCorePkg/releases) from your config.plist -> UEFI -> Drivers
  * If the above doesn't work, reverse: disable `KeySupport`, then add [OpenUsbKbDxe](https://github.com/acidanthera/OpenCorePkg/releases) to your config.plist -> UEFI -> Drivers

* Missing PS2 keyboard driver(Ignore if using a USB keyboard):
  * While most firmwares will include it by default, some laptops and older PCs may still need [Ps2KeyboardDxe.efi](https://github.com/acidanthera/OpenCorePkg/releases) to function correctly. Remember to add this to your config.plist as well

## SSDTs not being added

So with OpenCore, there's some extra security checks added around ACPI files, specifically that table length header must equal to the file size. This is actually the fault of iASL when you compiled the file. Example of how to find it:

```c
* Original Table Header:
*     Signature        "SSDT"
*     Length           0x0000015D (349)
*     Revision         0x02
*     Checksum         0xCF
*     OEM ID           "ACDT"
*     OEM Table ID     "SsdtEC"
*     OEM Revision     0x00001000 (4096)
*     Compiler ID      "INTL"
*     Compiler Version 0x20190509 (538510601)
```

The `Length` and `checksum` value is what we care about, so if our SSDT is actually 347 bytes then we want to change `Length` to `0x0000015B (347)`(the `015B` is in HEX)

Best way to actually fix this is to grab a newer copy of iASL or Acidanthera's copy of [MaciASL](https://github.com/acidanthera/MaciASL/releases) and remaking the SSDT

* Note: MaciASL distributed by Rehabman are prone to ACPI corruption, please avoid it as they no longer maintain their repos

## Booting OpenCore reboots to BIOS

* Incorrect EFI folder structure, make sure all of your OC files are within an EFI folder located on your ESP(EFI system partition)

::: details Example of folder structure

![Directory Structure from OpenCore's DOC](../../images/troubleshooting/troubleshooting-md/oc-structure.png)

:::

## OCABC: Incompatible OpenRuntime r4, require r10

Outdated OpenRuntime.efi, make sure BOOTx64.efi, OpenCore.efi and OpenRuntime are **all from the same exact build**. Anything mismatched will break booting

* **Note**: FwRuntimeServices has been renamed to OpenRuntime with 0.5.7 and newer
