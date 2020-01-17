# General Troubleshooting

Last edited: January 17, 2020

This section is for those having issues booting either OpenCore, macOS or having issues inside macOS. This page is devided up into a couple sections:

* [OpenCore booting issues](/troubleshooting/troubleshooting-cleanup.md#OpenCore-booting)
   * This is anytime before or during the loading of the macOS kernel
* [macOS booting issues](/troubleshooting/troubleshooting-cleanup.md#macOS-booting)
   * Anytime between the kernel loading and installing macOS
* [macOS post-install issues](/troubleshooting/troubleshooting-cleanup.md#macOS-post-install)
   * Anytime after macOS is installed
* [Other issues](/troubleshooting/troubleshooting-cleanup.md#other-issues)
   * This includes troubleshooting tools used for making your USB, fixing cosmetics in OpenCore, etc

While still a work in progress, laptop users wanting to convert an existing Clover install can see the  [Clover to OpenCore conversion](https://github.com/khronokernel/Opencore-Vanilla-Desktop-Guide/blob/master/clover-conversion) for more info


# OpenCore booting

* Stuck on `no vault provided!`
* Stuck on EndRandomSeed
* Can't see macOS partitions
* Stuck on `OCB: OcScanForBootEntries failure - Not Found`
* Stuck on `OCABC: Memory pool allocation failure - Not Found`
* Stuck on `OC: Driver XXX.efi at 0 cannot be found`
* Stuck on `Buffer Too Small`
* Stuck on `Plist only kext has CFBundleExecutable key`
* Receiving `Failed to parse real field of type 1`
* Stuck after selection macOS partition on OpenCore
* Can't select anything in the picker
* Stuck on `This version of Mac OS X is not supported: Reason Mac...`
* `Couldn't allocate runtime area` errors?
* Booting OpenCore reboots to BIOS



## Stuck on `no vault provided!`

Turn the following off under `Misc -> Security`:

* `RequireSignature`
* `RequireVault`

If you have already executed the commands listed in the [OpenCore Reference Manual](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/Configuration.pdf) under **8.5 Security Properties**, `5. RequireVault`, you'll need to restore your `OpenCore.efi` file.

## Stuck on EndRandomSeed

Couple problems:

* `ProvideConsoleGop` is likely missing as this is needed for transitioning to the next screen, this was originally part of AptioMemoryFix but is now within OpenCore as this quirk
* Missing [kernel patches](https://github.com/AMD-OSX/AMD_Vanilla/tree/opencore)\(only applies for AMD CPUs\)

Another possible problem is that some users either forget or cannot disable CFG-Lock in the BIOS\(specifically relating to a locked 0xE2 MSR bit for power management, obviously much safer to turn off CFG-Lock\). **Do note this is for Intel users only.** When this happens, there's a couple of possible fixes:

* [Fixing CFG Lock](https://khronokernel-2.gitbook.io/opencore-vanilla-desktop-guide/post-install/msr-lock) 
* Enable `AppleXcpmCfgLock` and `AppleCpuPmCfgLock`, this disables `PKG_CST_CNFIG_CONTROL` within the XNU and AppleIntelCPUPowerManagment respectively. Not recommended long term solution as this can cause instability.

Another other possible problem is IRQ conflicts, Clover has plenty of different fixes that it can apply without you directly setting them. This makes it much more difficult when converting from Clover to OpenCore though luckily CorpNewt's also got a fix: [SSDTTime](https://github.com/corpnewt/SSDTTime)'s FixHPET option

## Can't see macOS partitions

Main things to check:

* ScanPolicy set to `0` to show all drives
* Have the proper firmware drivers such as ApfsDriverLoader and HFSPlus\(or VBoxHfs\)
* Enable `AvoidHighAlloc` if you're running a network recovery install

## Stuck on `OCB: OcScanForBootEntries failure - Not Found`

This is due to OpenCore being unable to find any drives with the current ScanPolicy, setting to `0` will allow all boot options to be shown

## Stuck on `OCABC: Memory pool allocation failure - Not Found`

This is due to either incorrect BIOS settings and/or incorrect Booter values. Make sure config.plist -&gt; Booter -&gt; Quirks is correct and verify your BIOS settings:

* Above4GDecoding is Enabled
* CSM is Disabled\(Enabling Windows8.1/10 WHQL Mode can do the same on some boards\)

## Stuck on `OC: Driver XXX.efi at 0 cannot be found`

Verify that your EFI/OC/Drivers matches up with your config.plist -&gt; UEFi -&gt; Drivers

## Stuck on `Buffer Too Small`

* UEFI -&gt; Quirks -&gt; AvoidHighAlloc -&gt; Enable 
* Enable Above4GDecoding in the BIOS

## Stuck on `Plist only kext has CFBundleExecutable key`

Missing or incorrect `Executable path`

## Receiving "Failed to parse real field of type 1"

* A value is set as `real` when it's not supposed to be, generally being that Xcode converted `HaltLevel` by accident:

  ```text
  <key>HaltLevel</key>
  ```

  ```text
  <real>2147483648</real>
  ```

  To fix, swap `real` for `integer`:

  ```text
  <key>HaltLevel</key>
  ```

  ```text
  <integer>2147483648</integer>
  ```
## Stuck after selection macOS partition on OpenCore

* CFG-Lock not off\(Intel Users only\), couple solutions:
    * [Patch your MSR E2](https://khronokernel-2.gitbook.io/opencore-vanilla-desktop-guide/post-install/msr-lock)\(Recommeneded solution\)
    * Enable `AppleXcpmCfgLock` and `AppleCpuPmCfgLock`, this disables `PKG_CST_CNFIG_CONTROL` within the XNU and AppleIntelCPUPowerManagment repectively. Not recommeneded long term solution as this can cause instability.
* AMD kernel patches aren't working\(AMD Users only\):
    * Either outdated or missing kernel patches
* Incompatible keyboard driver:
    * Disable `PollAppleHotKeys` and enable `KeySupport`, then remove AppleUsbKbDxe from your config.plist -&gt; UEFI -&gt; Drivers
    * If the above doesn't work, reverse: disable `KeySupport`, then add AppleUsbKbDxe to your config.plist -&gt; UEFI -&gt; Drivers
    
## Can't select anything in the picker
    
* Incompatible keyboard driver:
     * Disable `PollAppleHotKeys` and enable `KeySupport`, then remove AppleUsbKbDxe from your config.plist -&gt; UEFI -&gt; Drivers
     * If the above doesn't work, reverse: disable `KeySupport`, then add AppleUsbKbDxe to your config.plist -&gt; UEFI -&gt; Drivers

## Stuck on `This version of Mac OS X is not supported: Reason Mac...`

This error happens when SMBIOS is one no longer supported by that version of macOS, make sure values are set in `PlatformInfo->Generic` with `Automatic` enabled. Reminder of supported SMBIOS:

* iMac13,x+
* iMacPro1,1
* MacPro6,1+
* MacBook8,1+
* MacBookAir5,x+
* MacBookPro9,x+

## `Couldn't allocate runtime area` errors?

See [Fixing KALSR slide values](https://khronokernel-2.gitbook.io/opencore-vanilla-desktop-guide/extras/kalsr-fix)

## Booting OpenCore reboots to BIOS

* Incorrect EFI folder structure, make sure all of your OC files are within an EFI folder located on your ESP\(EFI system partition\)

![Directory Structure from OpenCore&apos;s DOC](https://i.imgur.com/9RyBQ0L.png)



# macOS booting

* "Waiting for Root Device" or Prohibited Sign error
* macOS installer in Russian
* Stuck on or near `[PCI Configuration Begin]`
* Stuck on or near `IOConsoleUsers: gIOScreenLock...`
* Black screen after `IOConsoleUsers: gIOScreenLock...` on Navi
* 300 series Intel stalling on `apfs_module_start...`
* Stalling on `apfs_module_start...`, `Waiting for Root device`, `Waiting on...IOResources...`, `previous shutdown cause...` in Catalina
* Kernel Panic `Cannot perform kext summary`

## "Waiting for Root Device" or Prohibited Sign error

* Generally seen as a USB error, couple ways to fix:
  * if you're hitting the 15 port limit, you can temporarily get around this with `XhciPortLimit` but for long term use, we recommend making a [USBmap](https://github.com/corpnewt/USBMap). CorpNewt also has a guide for this: [USBmap Guide](https://usb-map.gitbook.io/project/)
  * Another issue can be that certain firmware won't pass USB ownership to macOS, to fix this we can enable `ReleaseUsbOwnership`. Clover equivalent is `FixOwnership`

## macOS installer in Russian

Default sample config is in russian, check your prev-lang:kbd value under NVRAM -&gt; Add -&gt; 7C436110-AB2A-4BBB-A880-FE41995C9F82. Set to `656e2d55533a30` for American: en-US:0 and a full list can be found in [AppleKeyboardLayouts.txt](https://github.com/acidanthera/OcSupportPkg/blob/master/Utilities/AppleKeyboardLayouts/AppleKeyboardLayouts.txt)

![](https://i.imgur.com/DtYtwCQ.png)

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

* GPU is UEFI capable\(GTX 7XX/2013+\)
* CSM is off in the BIOS
* Forcing PCIe 3.0 link speed



## Black screen after `IOConsoleUsers: gIOScreenLock...` on Navi

* Add `agdpmod=pikera` to boot args
* switch between different display outputs

## 300 series Intel stalling on `apfs_module_start...`

Commonly due to systems running AWAC clocks, pleas see the [Getting started with ACPI](https://github.com/khronokernel/Opencore-Vanilla-Desktop-Guide/tree/d6ae62c258e16382e0746e9ffd1e9755c93b08d7/extras/extras/acpi.md) section

## Stalling on `apfs_module_start...`, `Waiting for Root device`, `Waiting on...IOResources...`, `previous shutdown cause...` in Catalina

Verify your EC SSDT is enabled and correct for your system. See the [What's new in macOS Catalina](https://www.reddit.com/r/hackintosh/comments/den28t/whats_new_in_macos_catalina/) post for more info

## Kernel Panic `Cannot perform kext summary`

Generally seen as an issue surrounding the prelinked kernel, specifically that macOS is having a hard time interpreting the ones we injected. Verify that your kexts are in the correct order\(master then plugins, Lilu always being first\) and that kexts with executables have them and plist only kexts don't.


# macOS post-install

* Broken iMessage and Siri 
* No on-board audio
* BIOS reset or sent into Safemode after reboot/shutdown?



## iMessage and Siri Broken

* En0 device not setup as `Built-in`, couple ways to fix:
  * Find PCI path for your NIC with [gfxutil](https://github.com/acidanthera/gfxutil/releases)\(ie: `ethernet`, GBE1, \). Then via DeviceProperties in your config.plist, apply the property of `built-in` with the value of `01` and type `Data`. Hackintool can also grab the PCIRooth path if you're having issues with gfxutil. **Recommended method**
  * [NullEthernet.kext](https://bitbucket.org/RehabMan/os-x-null-ethernet/downloads/) + [SSDT-RMNE](https://github.com/RehabMan/OS-X-Null-Ethernet/blob/master/ssdt-rmne.aml). **Only recommended when first solution doesn't work**


## No on-board audio

* Verify that your PCIRoot is correct for your audio controller, this can be verified with [gfxutil](https://github.com/acidanthera/gfxutil/releases) though keep in mind that not all audio controllers are named HDEF. Verfy what yours is via IORegistryExplorer\(Common 2 are HDEF and HDAS\)

```text
path/to/gfxutil -f HDEF
```
  
  Then add this PCIRoot with the child `layout-id` to your config.plist under DeviceProperties -> Add:
  
  ![](https://i.imgur.com/oV3xqta.png)
  
Then find out your layout-id for your specific codec: [AppleALC's supported codec](https://github.com/acidanthera/applealc/wiki/supported-codecs)
  
For this example, we'll find the layout-id for ALC1150. Looking at the supported list we're given the following:
```text
0x100001, layout 1, 2, 3, 5, 7, 11
```
`0x100001` refers to the codc revision, you can ignore this. For us what we care about is `layout 1, 2, 3, 5, 7, 11`, we want to test each one individually until you find a layout that works best for you. Remember that the DeviceProperty is in HEX, converting 5 to HEX becomes `05000000`  and converting 11 to HEX becomes `0B000000` .
  
Alternative is using `alcid=xxx` in your boot-args and replace `xxx` with your layout-id

## BIOS reset or sent into Safemode after reboot/shutdown?

Issue with AppleRTC, quite a simple fix:

* Under `Kernel -> patch`:

| Enabled | String | YES |
| :--- | :--- | :--- |
| Count | Number | 1 |
| Identifier | String | com.apple.driver.AppleRTC |
| Limit | Nuber | 0 |
| Find | Data | 75330fb7 |
| Replace | Data | eb330fb7 |

## macOS GPU acceleration missing on AMD X570

Verify the following:

* GPU is UEFI capable\(GTX 7XX/2013+\)
* CSM is off in the BIOS
* Forcing PCIe 3.0 link speed



# Other issues

* Can't run `acpidump.efi`
* `Python is not installed or not found` error
* Fixing SSDTTime: `Could not locate or download iasl!`
* Windows Startup Disk can't see APFS drives
* Incorrect resolution with OpenCore

## Can't run `acpidump.efi`

Call upon OpenCore shell:

```text
shell> fs0: //replace with proper drive

fs0:\> dir //to verify this is the right directory

  Directory of fs0:\

   01/01/01 3:30p  EFI

fs0:\> cd EFI\OC\Tools //note that its with forward slashes

fs0:\EFI\OC\Tools> acpidump.efi -b -n DSDT -z
```

## `Python is not installed or not found` error

Install Python and make sure you select `Add Python X.X to PATH`
* [Windows link](https://www.python.org/downloads/windows/)


## Fixing SSDTTime: `Could not locate or download iasl!`

This is usually due to an outdated version of Python, try either updating Python or add iasl to the scripts folder for SSDTTime:

* [iasl macOS version](https://bitbucket.org/RehabMan/acpica/downloads/iasl.zip)
* [iasl Windows version](https://acpica.org/sites/acpica/files/iasl-win-20180105.zip)
* [iasl Linux version](http://amdosx.kellynet.nl/iasl.zip)

## Windows Startup Disk can't see APFS drives

* Outdated Bootcamp drivers\(generally ver 6.0 will come with brigadier, BootCamp Utility in macOS provides newer version like ver 6.1\). CorpNewt has also forked brigadier fixing these issues as well: [CorpNewt's brigadier](https://github.com/corpnewt/brigadier)

## Incorrect resolution with OpenCore

* Follow [Hiding Verbose](verbose.md) for correct setup, set `UIScale` to `02` for HiDPI
* Users also have noticed that setting `ConsoleMode` to Max will sometimes fail, leaving it empty can help


