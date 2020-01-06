# Troubleshooting OpenCore

## Converting Clover config to OpenCore

* While still a work in progress, see [Clover2OC](https://github.com/khronokernel/Opencore-Vanilla-Desktop-Guide/blob/master/clover-conversion) for more info. This section is useful for laptop users as well since commonly used properties have been translated over.

## Stuck on "no vault provided!"

Turn the following off under `Misc -> Security`:
* `RequireSignature`
* `RequireVault`

If you have already executed the commands listed in the [OpenCore Reference Manual](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/Configuration.pdf) under **8.5 Security Properties**, `5. RequireVault`, you'll need to restore your `OpenCore.efi` file.

## Stuck on EndRandomSeed
Couple problems:
* `ProvideConsoleGop` is likely missing as this is needed for transitioning to the next screen, this was originally part of AptioMemoryFix but is now within OpenCore as this quirk
* Missing [kernel patches](https://github.com/AMD-OSX/AMD_Vanilla/tree/opencore)(only applies for AMD CPUs)

Another possible problem is that some users either forget or cannot disable CFG-Lock in the BIOS(specifically relating to a locked 0xE2 MSR bit for power management, obviously much safer to turn off CFG-Lock). **Do note this is for Intel users only.** When this happens, there's a couple of possible fixes:

* [Fixing CFG Lock](https://khronokernel-2.gitbook.io/opencore-vanilla-desktop-guide/post-install/msr-lock) 
* Enable `AppleXcpmCfgLock` and `AppleCpuPmCfgLock`, this disables `PKG_CST_CNFIG_CONTROL` within the XNU and AppleIntelCPUPowerManagment respectively. Not recommended long term solution as this can cause instability.

Another other possible problem is IRQ conflicts, Clover has plenty of different fixes that it can apply without you directly setting them. This makes it much more difficult when converting from Clover to OpenCore though luckily CorpNewt's also got a fix: [SSDTTime](https://github.com/corpnewt/SSDTTime)'s FixHPET option


## Can't see macOS partitions

Main things to check:
* ScanPolicy set to `0` to show all drives
* Have the proper firmware drivers such as ApfsDriverLoader and HFSPlus(or VBoxHfs)
* Enable `AvoidHighAlloc` if you're running a network recovery install

## Stuck on `OCB: OcScanForBootEntries failure - Not Found`

This is due to OpenCore being unable to find any drives with the current ScanPolicy, setting to `0` will allow all boot options to be shown

## Stuck on `OCABC: Memory pool allocation failure - Not Found`

This is due to either incorrect BIOS settings and/or incorrect Booter values. Make sure config.plist -> Booter -> Quirks is correct and verify your BIOS settings:
* Above4GDecoding is Enabled
* CSM is Disabled(Enabling Windows8.1/10 WHQL Mode can do the same on some boards)

## Stuck on `OC: Driver HfsPlus.efi at 0 cannot be found`

Verify that your EFI/OC/Drivers matches up with your config.plist -> UEFi -> Drivers 

## "Waiting for Root Device" or Prohibited Sign error

* Generally seen as a USB error, couple ways to fix:
   * if you're hitting the 15 port limit, you can temporarily get around this with `XhciPortLimit` but for long term use, we recommend making a [USBmap](https://github.com/corpnewt/USBMap). CorpNewt also has a guide for this: [USBmap Guide](https://usb-map.gitbook.io/project/)
   * Another issue can be that certain firmware won't pass USB ownership to macOS, to fix this we can enable `ReleaseUsbOwnership`. Clover equivalent is `FixOwnership`

## macOS installer in Russian

Default sample config is in russian, check your prev-lang:kbd value under NVRAM -> Add -> 7C436110-AB2A-4BBB-A880-FE41995C9F82. Set to `656e2d55533a30` for American: en-US:0 and a full list can be found in [AppleKeyboardLayouts.txt](https://github.com/acidanthera/OcSupportPkg/blob/master/Utilities/AppleKeyboardLayouts/AppleKeyboardLayouts.txt)

## iMessage and Siri Broken

* En0 device not setup as `Built-in`, couple ways to fix:
   * Find PCI path for your NIC with [gfxutil](https://github.com/acidanthera/gfxutil/releases)(ie: `ethernet`, GBE1, ). Then via DeviceProperties in your config.plist, apply the property of `built-in` with the value of `01` and type `Data`. Hackintool can also grab the PCIRooth path if you're having issues with gfxutil. **Recommended method**
   * [NullEthernet.kext](https://bitbucket.org/RehabMan/os-x-null-ethernet/downloads/) + [SSDT-RMNE](https://github.com/RehabMan/OS-X-Null-Ethernet/blob/master/ssdt-rmne.aml). **Only recommended when first solution doesn't work**
  
![](https://i.imgur.com/DtYtwCQ.png)

## Windows Startup Disk can't see APFS drives

* Outdated Bootcamp drivers(generally ver 6.0 will come with brigadier, BootCamp Utility in macOS provides newer version like ver 6.1). CorpNewt has also forked brigadier fixing these issues as well: [CorpNewt's brigadier](https://github.com/corpnewt/brigadier)

## Incorrect resolution with OpenCore

* Follow [Hiding Verbose](verbose.md) for correct setup, set `UIScale` to `02` for HiDPI
* Users also have noticed that setting `ConsoleMode` to Max will sometimes fail, leaving it empty can help

## Receiving "Failed to parse real field of type 1"
* A value is set as `real` when it's not supposed to be, generally being that Xcode converted `HaltLevel` by accident:
```
<key>HaltLevel</key>
```
```
<real>2147483648</real>
```
To fix, swap `real` for `integer`:
```
<key>HaltLevel</key>
```
```
<integer>2147483648</integer>
```
## No on-board audio
* Verify that your PCIRoot is correct for your audio controller, this can be verified with [gfxutil](https://github.com/acidanthera/gfxutil/releases) though keep in mind that not all audio controllers are named HDEF. Verfy what yours is via IORegistryExplorer(Common 2 are HDEF and HDAS)
```
path/to/gfxutil -f HDEF
```
Then find out your 

## Stuck after selection macOS partition on OpenCore

* CFG-Lock not off(Intel Users only), couple solutions:
   * [Patch your MSR E2](https://khronokernel-2.gitbook.io/opencore-vanilla-desktop-guide/post-install/msr-lock)(Recommeneded solution)
   * Enable `AppleXcpmCfgLock` and `AppleCpuPmCfgLock`, this disables `PKG_CST_CNFIG_CONTROL` within the XNU and AppleIntelCPUPowerManagment repectively. Not recommeneded long term solution as this can cause instability.
* AMD kernel patches aren't working(AMD Users only):
   * Either outdated or missing kernel patches
* PollAppleHotKeys driver is incompatible:
* Disable `PollAppleHotKeys` and `KeySupport`, then remove UsbKbDxe from your config.plist -> UEFI -> Drivers



## Stuck on or near `[PCI Configuration Begin]`

This is commonly caused by IRQ conflicts with PCI devices/lanes. Depending on how your system was configured, it's recommended to have the following BIOS settings:
* CSM disabled
* Windows8.1/10 Mode
* Forcing PCIe 3.0 link speed
Now try one of these boot args:
* `npci=0x2000`
* `npci=0x3000`

## Stuck on or near `IOConsoleUsers: gIOScreenLock...`

This is right before the GPU is properly initialized, verify the following:
* GPU is UEFI capable(GTX 7XX/2013+)
* CSM is off in the BIOS
* Forcing PCIe 3.0 link speed



## Black screen after gIO on Navi
* Add `agdpmod=pikera` to boot args
* switch between different display outputs

## Stuck on `This version of Mac OS X is not supported: Reason Mac...`

This error happens when SMBIOS is one no longer supported by that version of macOS, make sure values are set in `PlatformInfo->Generic` with `Automatic` enabled. Reminder of supported SMBIOS:

* iMac13,x+
* iMacPro1,1
* MacPro6,1+
* MacBook8,1+
* MacBookAir5,x+
* MacBookPro9,x+

## 300 series Intel stalling on `apfs_module_start...`

Commonly due to systems running AWAC clocks, you'll need to use either:
* [SSDT-AWAC](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-AWAC.dsl)
   * Forces legacy RTC clock on
* [SSDT-RTC0](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-RTC0.dsl)
   * Creates a fake RTC clock when legacy can't be forced

## Stalling on `apfs_module_start...`, `Waiting for Root device`, `Waiting on...IOResources...`, `previous shutdown cause...` in Catalina


Verify your EC SSDT is enabled and correct for your system. See the [What's new in macOS Catalina](https://www.reddit.com/r/hackintosh/comments/den28t/whats_new_in_macos_catalina/) post for more info

## Kernel Panic `Cannot perform kext summary`

Generally seen as an issue surrounding the prelinked kernel, specifically that macOS is having a hard time interpreting the ones we injected. Verify that your kexts are in the correct order(master then plugins, Lilu always being first) and that kexts with executables have them and plist only kexts don't.

## BIOS reset or sent into Safemode after reboot/shutdown?

Issue with AppleRTC, quite a simple fix:

* Under `Kernel -> patch`:

|Enabled|String|YES|
|:-|:-|:-|
|Count|Number|1|
|Identifier|String|com.apple.driver.AppleRTC|
|Limit|Nuber|0|
|Find|Data|75330fb7|
|Replace|Data|eb330fb7|

## "Couldn't allocate runtime area" errors?

See [Fixing KALSR slide values](https://khronokernel-2.gitbook.io/opencore-vanilla-desktop-guide/extras/kalsr-fix)

## Can't run `acpidump.efi`

Call upon OpenCore shell:

```
shell> fs0: //replace with proper drive
```

```
fs0:\> dir //to verify this is the right directory
```

```
  Directory of fs0:\
```
```
   01/01/01 3:30p  EFI
```
```   
fs0:\> cd EFI\OC\Tools //note that its with forward slashes
```
```
fs0:\EFI\OC\Tools> acpidump.efi -b -n DSDT -z
```

## Booting OpenCore reboots to BIOS

* Incorrect EFI folder structure, make sure all of your OC files are within an EFI folder located on your ESP(EFI system partition)

![Directory Structure from OpenCore's DOC](https://i.imgur.com/9RyBQ0L.png)


