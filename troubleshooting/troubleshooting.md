# General Troubleshooting

Last edited: March 12, 2020

This section is for those having issues booting either OpenCore, macOS or having issues inside macOS. This page is devided up into a couple sections:

* [OpenCore booting issues](/troubleshooting/troubleshooting.md#opencore-booting)
   * This is anytime before or during the loading of the macOS kernel
* [macOS booting issues](/troubleshooting/troubleshooting.md#macos-booting)
   * Anytime between the kernel loading and installing macOS
* [macOS post-install issues](/troubleshooting/troubleshooting.md#macos-post-install)
   * Anytime after macOS is installed
* [Other issues](/troubleshooting/troubleshooting.md#other-issues)
   * This includes troubleshooting tools used for making your USB, fixing cosmetics in OpenCore, etc

While still a work in progress, laptop users wanting to convert an existing Clover install can see the  [Clover to OpenCore conversion](https://github.com/khronokernel/Opencore-Vanilla-Desktop-Guide/blob/master/clover-conversion) for more info

**And if your issue is not covered, please read the offical OpenCore documentation: [Configuration.pdf](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/Configuration.pdf)**

# OpenCore booting

* Stuck on `no vault provided!`
* Stuck on EndRandomSeed
* Can't see macOS partitions
* Black screen after picker
* Stuck on `OC: OcAppleGenericInput... - Success`
* Stuck on `OCB: OcScanForBootEntries failure - Not Found`
* Stuck on `OCB: failed to match a default boot option`
* Stuck on `OCABC: Memory pool allocation failure - Not Found`
* Stuck on `OCS: No schema for DSDT, KernelAndKextPatch, RtVariable, SMBIOS, SystemParameters...`
* Stuck on `OC: Driver XXX.efi at 0 cannot be found`
* Stuck on `Buffer Too Small`
* Stuck on `Plist only kext has CFBundleExecutable key`
* Receiving `Failed to parse real field of type 1`
* Stuck after selection macOS partition on OpenCore
* Can't select anything in the picker
* Stuck on `This version of Mac OS X is not supported: Reason Mac...`
* `Couldn't allocate runtime area` errors?
* SSDTs not being added
* Booting OpenCore reboots to BIOS



## Stuck on `no vault provided!`

Turn off file vault in your config.plist under `Misc -> Security -> Vault` by setting it to:

* `Optional`

If you have already executed the `sign.command` you will need to restore the Opencore.efi file as the 256 byte RSA-2048 signature has been shoved in. Can grab a new copy of Opencore.efi here: [OpenCorePkg](https://github.com/acidanthera/OpenCorePkg/releases)

## Stuck on EndRandomSeed

Couple problems:

* `ProvideConsoleGop` is likely missing as this is needed for transitioning to the next screen, this was originally part of AptioMemoryFix but is now within OpenCore as this quirk. Can be found under UEFI -> Output
* Missing [kernel patches](https://github.com/AMD-OSX/AMD_Vanilla/tree/opencore)(only applies for AMD CPUs, make sure they're Opencore patches and not Clover. Clover uses `MatchOS` while OpenCore has `MinKernel` and `Maxkernel`)
* `IgnoreInvalidFlexRatio` missing, this is needed for Broadwell and older. **Not for AMD and Skylake or newer**
* `AppleXcpmExtraMsrs` may be required, this is generally meant for Pentiums, HEDT and other odd systems. **Don't use on AMD**

Another possible problem is that some users either forget or cannot disable CFG-Lock in the BIOS(specifically relating to a locked 0xE2 MSR bit for power management, obviously much safer to turn off CFG-Lock). **Do note this is for Intel users only, not AMD.** When this happens, there's a couple of possible fixes:

* [Fixing CFG Lock](https://khronokernel-2.gitbook.io/opencore-vanilla-desktop-guide/post-install/msr-lock) 
* Enable `AppleXcpmCfgLock` and `AppleCpuPmCfgLock`, this disables `PKG_CST_CNFIG_CONTROL` within the XNU and AppleIntelCPUPowerManagment respectively. Not recommended long term solution as this can cause instability.

Another other possible problem is IRQ conflicts, Clover has plenty of different fixes that it can apply without you directly setting them. This makes it much more difficult when converting from Clover to OpenCore though luckily CorpNewt's also got a fix: [SSDTTime](https://github.com/corpnewt/SSDTTime)'s FixHPET option



## Can't see macOS partitions

Main things to check:

* ScanPolicy set to `0` to show all drives
* Have the proper firmware drivers such as ApfsDriverLoader and HFSPlus(or VBoxHfs)
* Enable `AvoidHighAlloc` if you're running a network recovery install

## Black screen after picker

This is due to missing ConsoleGOP, enable it under your config:
* `UEFI -> Output -> ProvideConsoleGOP`

If this doesn't help, grab the [debug versions](https://github.com/acidanthera/OpenCorePkg/releases) of `OpenCore.efi` and `BOOTx64.efi` and replace them in your EFI. This will show much more info on where your hack is actually getting stuck.

## Stuck on `OC: OcAppleGenericInput... - Success` 

So this isn't actually an error, instead OpenCore isn't showing you all the debug info. This is right before/while the kernel is being loaded so things we need to check for:

* Intel:
   * CFG-Lock disabled in the BIOS **or** `AppleCpuPmCfgLock` and `AppleCpuPmCfgLock` enabled under Kernel -> Quirks
* AMD:
   * Verify you have added the correct kernel patches to your config(remember, OpenCore patches use `MinKernel` and `MaxKernel` while Clover has `MatchOS`)
      * [Ryzen/Threadripper(17h)](https://github.com/khronokernel/Opencore-Vanilla-Desktop-Guide/blob/master/extra-files/17h-patches.plist.zip)
      * [Bulldozer/Jaguar(15h/16h)](https://github.com/khronokernel/Opencore-Vanilla-Desktop-Guide/blob/master/extra-files/15h-16h-patches.plist.zip)

If this doesn't help, grab the [debug versions](https://github.com/acidanthera/OpenCorePkg/releases) of `OpenCore.efi` and `BOOTx64.efi` and replace them in your EFI. This will show much more info on where your hack is actually getting stuck.

## Stuck on `OCB: OcScanForBootEntries failure - Not Found`

This is due to OpenCore being unable to find any drives with the current ScanPolicy, setting to `0` will allow all boot options to be shown
* `Misc -> Security -> ScanPolicy -> 0`

## Stuck on `OCB: failed to match a default boot option`

Same fix as `OCB: OcScanForBootEntries failure - Not Found`, OpenCore is unable to find any drives with the current ScanPolicy, setting to `0` will allow all boot options to be shown
* `Misc -> Security -> ScanPolicy -> 0`

## Stuck on `OCABC: Memory pool allocation failure - Not Found`

This is due to either incorrect BIOS settings and/or incorrect Booter values. Make sure config.plist -&gt; Booter -&gt; Quirks is correct and verify your BIOS settings:

* Above4GDecoding is Enabled
* CSM is Disabled(Enabling Windows8.1/10 WHQL Mode can do the same on some boards)

## Stuck on `OCS: No schema for DSDT, KernelAndKextPatch, RtVariable, SMBIOS, SystemParameters...`

This is due to either using a Clover config with OpenCore or using a configurator such as Mackie's Clover and OpenCore configurator. You'll need to start over and make a new config or figure out all the garbage you need to remove from your config. **This is why we don't support configurators, they are known for these issues**

## Stuck on `OC: Driver XXX.efi at 0 cannot be found`

Verify that your EFI/OC/Drivers matches up with your config.plist -&gt; UEFi -&gt; Drivers

## Stuck on `Buffer Too Small`

* `UEFI -> Quirks -> AvoidHighAlloc -> Enable `
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

* CFG-Lock not off(Intel Users only), couple solutions:
    * [Patch your MSR E2](/extras/msr-lock.md)(Recommended solution)
    * Enable `AppleXcpmCfgLock` and `AppleCpuPmCfgLock`, this disables `PKG_CST_CNFIG_CONTROL` within the XNU and AppleIntelCPUPowerManagment repectively. Not recommeneded long term solution as this can cause instability.
* AMD kernel patches aren't working(AMD Users only):
    * Either outdated or missing kernel patches
* Incompatible keyboard driver:
    * Disable `PollAppleHotKeys` and enable `KeySupport`, then remove [OpenUsbKbDxe](https://github.com/acidanthera/OpenCorePkg/releases) from your config.plist -&gt; UEFI -&gt; Drivers
    * If the above doesn't work, reverse: disable `KeySupport`, then add [OpenUsbKbDxe](https://github.com/acidanthera/OpenCorePkg/releases) to your config.plist -&gt; UEFI -&gt; Drivers
    
## Can't select anything in the picker
    
* Incompatible keyboard driver:
     * Disable `PollAppleHotKeys` and enable `KeySupport`, then remove [OpenUsbKbDxe](https://github.com/acidanthera/OpenCorePkg/releases) from your config.plist -&gt; UEFI -&gt; Drivers
     * If the above doesn't work, reverse: disable `KeySupport`, then add [OpenUsbKbDxe](https://github.com/acidanthera/OpenCorePkg/releases) to your config.plist -&gt; UEFI -&gt; Drivers

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

## SSDTs not being added

So with Opencore, there's some extra security checks added around ACPI files, specifically that table length header must equal to the file size. This is actually the fault of iASL when you compiled the file. Example of how to find it:

```
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

Best way to actually fix this is to grab a newer copy of iASL or Acidanthera's copy of [maciASL](https://github.com/acidanthera/MaciASL/releases) and remaking the SSDT

## Booting OpenCore reboots to BIOS

* Incorrect EFI folder structure, make sure all of your OC files are within an EFI folder located on your ESP(EFI system partition)

![Directory Structure from OpenCore&apos;s DOC](https://i.imgur.com/9RyBQ0L.png)



# macOS booting

* Stuck on `RTC...`, `PCI ConfigurationBegins`, `Previous Shutdown...`, `HPET`, `HID: Legacy...`
* "Waiting for Root Device" or Prohibited Sign error
* macOS installer in Russian
* Stuck on or near `IOConsoleUsers: gIOScreenLock...`
* Black screen after `IOConsoleUsers: gIOScreenLock...` on Navi
* 300 series Intel stalling on `apfs_module_start...`
* Stalling on `apfs_module_start...`, `Waiting for Root device`, `Waiting on...IOResources...`, `previous shutdown cause...` in Catalina
* Kernel Panic `Cannot perform kext summary`
* Kernel Panic `AppleIntelMCEReporter`
* Kernel Panic `AppleIntelCPUPowerManagement`
* Stop Sign with corrupted text(Still waiting for Root Device)
* Frozen in the macOS installer after 30 seconds
* 15h/16h CPU reboot after Data & Privacy screen

## Stuck on `RTC...`, `PCI Configuration Begins`, `Previous Shutdown...`, `HPET`, `HID: Legacy...`

Well this general area is where a lot of PCI devices are configured, and is where most booting issues with AMD hacks happen. The main places to check:

* **Missing EC patch**: 
   * For dekstops, make sure you have your EC SSDT both in EFI/OC/ACPI and ACPI -> Add, **double check it's enabled.**
   * If you don't have one, grab it here: [Getting started with ACPI](https://khronokernel.github.io/Getting-Started-With-ACPI/)
   * Laptop users will need to rename their main EC: [Getting started with ACPI](https://khronokernel.github.io/Getting-Started-With-ACPI/)

* **IRQ conflict**: 
   * Most common on older laptops and prebuilts, run SSDTTime's FixHPET option and add the resulting SSDT-HPET.aml and ACPI patches to your config( the SSDT will not work without the ACPI patches)

* **PCI allocation issue**:
   * **UPDATE YOUR BIOS**, make sure it's on the latest. Most OEMs have very broken PCI allocation on older firmwares
   * Make sure either Above4GDecoding is enabled in the BIOS, if no option availible then add `npci=0x2000` to boot args. **Do not have both the Above4G setting enabled and npci in boot args, they will conflict**
   * Other BIOS settings that are important: CSM disabled, Windows 8.1/10 UEFI Mode enabled\

## "Waiting for Root Device" or Prohibited Sign error

* Generally seen as a USB error, couple ways to fix:
  * if you're hitting the 15 port limit, you can temporarily get around this with `XhciPortLimit` but for long term use, we recommend making a [USBmap](https://github.com/corpnewt/USBMap). CorpNewt also has a guide for this: [USBmap Guide](https://usb-map.gitbook.io/project/)
  * Another issue can be that certain firmware won't pass USB ownership to macOS, to fix this we can enable `ReleaseUsbOwnership`. Clover equivalent is `FixOwnership`

## macOS installer in Russian

Default sample config is in russian because slavs rule the Hackintosh world, check your prev-lang:kbd value under `NVRAM -> Add -> 7C436110-AB2A-4BBB-A880-FE41995C9F82`. Set to `656e2d55533a30` for American: en-US:0 and a full list can be found in [AppleKeyboardLayouts.txt](https://github.com/acidanthera/OcSupportPkg/blob/master/Utilities/AppleKeyboardLayouts/AppleKeyboardLayouts.txt)

You may also need to reset NVRAM in the boot picker as well

Still didn't work? Well time for the big guns. We'll force remove that exact property and let OpenCore rebuild it:

`NVRAM -> Block -> 7C436110-AB2A-4BBB-A880-FE41995C9F82 -> Item 0` then set it Type `String` and Value `prev-lang:kbd`

![](https://cdn.discordapp.com/attachments/456913818467958789/673947840791445538/Screen_Shot_2020-02-03_at_10.47.40_AM.png)

## Stuck on or near `IOConsoleUsers: gIOScreenLock...`

This is right before the GPU is properly initialized, verify the following:

* GPU is UEFI capable(GTX 7XX/2013+)
* CSM is off in the BIOS
* Forcing PCIe 3.0 link speed

## Black screen after `IOConsoleUsers: gIOScreenLock...` on Navi

* Add `agdpmod=pikera` to boot args
* switch between different display outputs

## 300 series Intel stalling on `apfs_module_start...`

Commonly due to systems running AWAC clocks, pleas see the [Getting started with ACPI](/extras/acpi.md) section

## Stalling on `apfs_module_start...`, `Waiting for Root device`, `Waiting on...IOResources...`, `previous shutdown cause...` in Catalina

Verify your EC SSDT is enabled and correct for your system. See the [What's new in macOS Catalina](https://www.reddit.com/r/hackintosh/comments/den28t/whats_new_in_macos_catalina/) post for more info

## Kernel Panic `Cannot perform kext summary`

Generally seen as an issue surrounding the prelinked kernel, specifically that macOS is having a hard time interpreting the ones we injected. Verify that your kexts are in the correct order(master then plugins, Lilu always being first) and that kexts with executables have them and plist only kexts don't.

## Kernel Panic `AppleIntelMCEReporter`

With macOS catalina, dual socket support is broken, and a fun fact about AMD firmware is that some boards will actually report multiple socketed CPUs. To fix this, add [AppleMCEReporterDisabler](https://github.com/acidanthera/bugtracker/files/3703498/AppleMCEReporterDisabler.kext.zip) to both 

## Kernel Panic `AppleIntelCPUPowerManagement`

This is likely due to faultly or outright missing NullCPUPowerManagement, the one hosted on AMD OSX's Vanilla Guide is corrupted. Go yell at Shannee to fix it. To fix the issue, remove NullCPUPowerManagement from `Kernel -> Add` and `EFI/OC/Kexts` then enable `DummyPowerManagement` under `Kernel -> Quirks`

## Stop Sign with corrupted text(Still waiting for Root Device)

With OS X 10.11 El Capitan, Apple imposed a 15 USB port limit. To get around this we actually create a USB map to include ports we want and kick out extras we don't care about. For install, set `Kernel -> Quirks -> XhciPortLimit -> Enabled` but for post install we recommend making a map as the port limit patch isn't guaranteed to work with future versions of macOS.

First try your USB stick in a different USB port.

For 15h and 16h AMD CPUs, you may need to add the following:
* [XLNCUSBFix.kext](https://cdn.discordapp.com/attachments/566705665616117760/566728101292408877/XLNCUSBFix.kext.zip)

If XLNCUSBFix still doesn't work, then try the following:
* [AMD StopSign-fixv5](https://cdn.discordapp.com/attachments/249992304503291905/355235241645965312/StopSign-fixv5.zip)

## Frozen in the macOS installer after 30 seconds

This is likely due to faultly or outright missing NullCPUPowerManagement, the one hosted on AMD OSX's Vanilla Guide is corrupted. Go yell at Shannee to fix it. To fix the issue, remove NullCPUPowerManagement from `Kernel -> Add` and `EFI/OC/Kexts` then enable `DummyPowerManagement` under `Kernel -> Quirks`

## 15h/16h CPU reboot after Data & Privacy screen

Follow directions here after UPDATE 2: [Fix Data and Privacy reboot](https://www.insanelymac.com/forum/topic/335877-amd-mojave-kernel-development-and-testing/?do=findComment&comment=2658085)

## macOS frozen right before login

This is a common example of screwed up TSC, for most system add [VoodooTSCSync](https://bitbucket.org/RehabMan/VoodooTSCSync/downloads/)

For Skylake-X, many firmwares including Asus and EVGA won't write to all cores. So we'll need to reset the TSC on cold boot and wake with [TSCAdjustReset](https://github.com/interferenc/TSCAdjustReset). Compiled version can be found here: [TSCAdjustReset.kext](https://github.com/khronokernel/Opencore-Vanilla-Desktop-Guide/blob/master/extra-files/TSCAdjustReset.kext.zip). Note that you **must** open up the kext(ShowPackageContents in finder, `Contents -> Info.plist`) and change the Info.plist -> `IOKitPersonalities -> IOPropertyMatch -> IOCPUNumber` to the number of CPU threads you have starting from `0`(i9 7980xe 18 core would be `35` as it has 36 threads total)

![](https://cdn.discordapp.com/attachments/478720084072988672/669453323589386254/IMG_20200122_090803.jpg)

# macOS post-install

* [Broken iMessage and Siri](/troubleshooting/troubleshooting.md#Broken-iMessage-and-Siri)
* No on-board audio
* BIOS reset or sent into Safemode after reboot/shutdown?
* macOS GPU acceleration missing on AMD X570
* DRM Broken
* "Memory Modules Misconfigured" on MacPro7,1
* Apps crashing on AMD
* No temperature/fan sensor output

## Broken iMessage and Siri 

* En0 device not setup as `Built-in`, couple ways to fix:
  * Find PCI path for your NIC with [gfxutil](https://github.com/acidanthera/gfxutil/releases)(ie: `ethernet`, GBE1, ). Then via DeviceProperties in your config.plist, apply the property of `built-in` with the value of `01` and type `Data`. Hackintool can also grab the PCIRooth path if you're having issues with gfxutil. **Recommended method**
  * [NullEthernet.kext](https://bitbucket.org/RehabMan/os-x-null-ethernet/downloads/) + [SSDT-RMNE](https://github.com/RehabMan/OS-X-Null-Ethernet/blob/master/ssdt-rmne.aml). **Only recommended when first solution doesn't work**

![](https://i.imgur.com/DtYtwCQ.png)

If these fixes do not work, see the [Fixing iServices page](/post-install/iservices.md) for more in-depth guide.

## No on-board audio

Refer to [Fixing Audio with AppleALC](/post-install/audio.md) section

## BIOS reset or sent into Safemode after reboot/shutdown?

Issue with AppleRTC, quite a simple fix:

* Under `Kernel -> patch`:

| Key | Type | Value |
| :--- | :--- | :--- |
|Comment|String|Disable RTC checksum update on poweroff|
| Enabled | String | YES |
|Count|Number|1|
|Base|String|__ZN8AppleRTC14updateChecksumEv|
|Identifier|String|com.apple.driver.AppleRTC|
|Limit|Number|0|
|Find|Data||
|Replace|Data|c3|

## macOS GPU acceleration missing on AMD X570

Verify the following:

* GPU is UEFI capable(GTX 7XX/2013+)
* CSM is off in the BIOS
* Forcing PCIe 3.0 link speed

## DRM Broken

With Haswell and newer iGPUs, DRM is outright broken on them with macOS Catalina. This includes iTunes Movies, Apple TV+, Amazon Prime and Netflix, the only fix is getting a supported dGPU preferably Polaris or newer that supports HEVC. 

More other GPUs, try different shiki boot args:

* [WhateverGreen's DRM Chart](https://github.com/acidanthera/WhateverGreen/blob/master/Manual/FAQ.Chart.md)

## "Memory Modules Misconfigured" on MacPro7,1

Add [MacProMemoryNotificationDisabler kext](https://github.com/IOIIIO/MacProMemoryNotificationDisabler/releases/) to EFI/OC/Kexts and `Kernel -> Add`. Note that this kext has an odd quirk here it requires WhateverGreen to function correctly.

## Apps crashing on AMD

~~Easy fix, buy Intel~~

So with AMD, whenever Apple calls CPU specific functions the app witll either not work or outright crash. Here are some apps and their "fixes":

* Adobe Products don't always work
   * Some fixes can be found here: [Adobe Fixes](https://adobe.amd-osx.com/)
   * Do note these fixes just disables functionality, they're not really fixes
* Virtual Machine running off of AppleHV's framework will not work(ie: Parallels 15, Vmware)
   * VirtualBox works fine as it doesn't use AppleHV
   * VMware 10 and older can work as well
* Docker broken
   * Docker toolbox is the only solution as it's based off of VirtualBox, many feautures are unavailble with this version
* Xcode AppleWatch simulator is broken in Catalina
   * Mojave works fine
* IDA Pro won't install
   * There's an Intel specific check in the installer, app itself is likely fine
* 15/16h CPU webpages crashing
   * Follow directions here after UPDATE 5: [Fix webpages](https://www.insanelymac.com/forum/topic/335877-amd-mojave-kernel-development-and-testing/?do=findComment&comment=2661857)


# Other issues

* Can't run `acpidump.efi`
* Fixing SSDTTime: `Could not locate or download iasl!`
* Fix Python: `Python is not installed or not found on PATH`
* Windows Startup Disk can't see APFS drives
* Incorrect resolution with OpenCore
* No temperature/fan sensor output
* Can't find Windows/Bootcamp drive in picker

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

## Fixing SSDTTime: `Could not locate or download iasl!`

This is usually due to an outdated version of Python, try either updating Python or add iasl to the scripts folder for SSDTTime:

* [iasl macOS version](https://bitbucket.org/RehabMan/acpica/downloads/iasl.zip)
* [iasl Windows version](https://acpica.org/sites/acpica/files/iasl-win-20180105.zip)
* [iasl Linux version](http://amdosx.kellynet.nl/iasl.zip)

## Fix Python: `Python is not installed or not found on PATH`

Easy fix, download and install the latest python:

* [macOS link](https://www.python.org/downloads/macos)
* [Windows link](https://www.python.org/downloads/windows/)
* [Linux link](https://www.python.org/downloads/source/)

Make sure `Add Python to PATH`

![](https://cdn.discordapp.com/attachments/456913818467958789/668209828958830613/unknown.png)


## Windows Startup Disk can't see APFS drives

* Outdated Bootcamp drivers(generally ver 6.0 will come with brigadier, BootCamp Utility in macOS provides newer version like ver 6.1). CorpNewt has also forked brigadier fixing these issues as well: [CorpNewt's brigadier](https://github.com/corpnewt/brigadier)

## Incorrect resolution with OpenCore

* Follow [Hiding Verbose](verbose.md) for correct setup, set `UIScale` to `02` for HiDPI
* Users also have noticed that setting `ConsoleMode` to Max will sometimes fail, leaving it empty can help

## No temperature/fan sensor output

So couple things:

* iStat Menus doesn't yet support MacPro7,1 readouts
* VirtualSMC's bundled sensors do not support AMD

For iStat, you'll have to wait for an update. For AMD users, you can use either:

* [SMCAMDProcessor](https://github.com/trulyspinach/SMCAMDProcessor/releases)
   * Still in early beta but great work has been done, note it's been mainly tested on Ryzen
* [FakeSMC3_with_plugins](https://github.com/CloverHackyColor/FakeSMC3_with_plugins/releases)

**Note for AMD with FakeSMC**:
* FileVault support requires more work with FakeSMC
* Make sure no other SMC kexts are present, specifically those from [VirtualSMC](https://github.com/acidanthera/VirtualSMC/releases)

## Can't find Windows/Bootcamp drive in picker

So with OpenCore, we have to note that legacy Windows installs are not supported, only UEFI. Most installs now are UEFI based but those made by BootCamp Assistant are legacy based, so you'll have to find other means to make an installer(Google's your friend). This also means MasterBootRecord/Hybrid partitions are also broken so you'll need to format the drive you want to install onto with DiskUtility. See the [Multiboot Guide](https://hackintosh-multiboot.gitbook.io/hackintosh-multiboot/) on best practices

Now to get onto troubleshooting:
* Make sure `Misc -> Security -> ScanPolicy` is set to `0` to show all drives
* Enable `Misc -> Boot -> Hideself` is enabled when Windows bootloader is loacated on the same drive
* Enable `Platforminfo -> Generic -> AdviseWindows -> True` if the EFI partition isn't the first on the partition table
