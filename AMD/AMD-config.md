# AMD Ryzen, Threadripper, Bulldozer and Jaguar

## Starting Point

You'll want to start with the sample.plist that OpenCorePkg provides you in the DOCS folder and rename it to config.plist. Next, open up your favourite XML editor like [ProperTree](https://github.com/corpnewt/ProperTree) and we can get to work.

Users of ProperTree will also get the benefit of running the Snapshot function which will add all the Firmware drivers, kexts and SSDTs into your config.plist(Cmd/Crtl + R and point to your OC folder).

Kernel patches:
* [Ryzen/Threadripper(17h)](https://github.com/AMD-OSX/AMD_Vanilla/tree/opencore/17h) (10.13, 10.14, and 10.15)
* [Bulldozer/Jaguar(15h/16h)](https://github.com/AMD-OSX/AMD_Vanilla/tree/opencore/15h_16h) (10.13, 10.14, and 10.15)

Please note that 3rd gen Threadripper(19h) is unsupported currently.

**And read this guide more than once before setting up Opencore and make sure you have it setup correctly**

## ACPI

![ACPI](https://i.imgur.com/zqNt4dV.png)


**Add:**

This is where you'll add SSDT patches for your system, these are most useful for laptops and OEM desktops but also common for [USB maps](https://usb-map.gitbook.io/project/), [disabling unsupported GPUs](/post-install/spoof.md) and such.

* [SSDT-EC-AMD](https://github.com/khronokernel/Opencore-Vanilla-Desktop-Guide/blob/master/extra-files/SSDT-EC-AMD.dsl)
   * Corrects your EC devices, **needed for all Catalina users**. To setup you'll need to find out the name of your `PNP0C09` device in your DSDT, this being either `EC0`, `H_EC`, `PGEC` and `ECDV`. You can read more about Embedded Controller issues in Catalina here: [What's new in macOS Catalina](https://www.reddit.com/r/hackintosh/comments/den28t/whats_new_in_macos_catalina/). If no `PNP0C09` device shows up then there is no need for this SSDT. 
   * I've also provided a precompiled version for users with EC0, this is the most common device on AMD systems: [SSDT-EC-AMD.aml](https://github.com/khronokernel/Opencore-Vanilla-Desktop-Guide/blob/master/extra-files/SSDT-EC-AMD.aml)
* [SSDT-USBX-AMD](https://github.com/khronokernel/Opencore-Vanilla-Desktop-Guide/blob/master/extra-files/SSDT-USBX-AMD.aml)
   * Forces power properties onto your USB controller, commonly used for fixing mics, DACs, webcams, bluetooth dongles, etc. This SSDT is optional but I've provided a pre-compiled version as each system uses the same SSDT

For those having troubles understanding the SSDTs regarding EC can use CorpNewt's [SSDTTime](https://github.com/corpnewt/SSDTTime) to properly setup your SSDT. All other SSDTs can be compiled with [MaciASL](https://github.com/acidanthera/MaciASL/releases), don't forget that compiled SSDTs have a .aml extension(Assembled) and will go into the EFI/OC/ACPI folder. You can compile with MaciASL by running File -> Save As -> ACPI Machine Language.

> How do I get a copy of my DSDT for running SSDTTime?

* [MaciASL](https://github.com/acidanthera/MaciASL/releases) -> Save as `System DSDT`, make sure the file format is ACPI Machine Language Binary
   * Do note that all ACPI patches will be applied to the DSDT
* [SSDTTime](https://github.com/corpnewt/SSDTTime) can extract it in Linux and Windows
   * Do note if booting through OpenCore that ACPI patches will be applied to the DSDT
* F4 in Clover Boot menu
   * DSDT can be found in `EFI/CLOVER/ACPI/origin`
* [`acpidump.efi`](https://github.com/khronokernel/Opencore-Vanilla-Desktop-Guide/tree/master/extra-files/acpidump.efi.zip)
   * Add this to `EFI/OC/Tools` and in your config under `Misc -> Tools` then select this option in Opencore's picker. Rename DSDT.dat to DSDT.aml. Tool is provided by [acpica](https://github.com/acpica/acpica/tree/master/source/tools/acpidump).

**Block**

This drops certain ACPI tabes from loading, for us we can ignore this

**Patch**:

This section allows us to dynamically modify parts of the ACPI (DSDT, SSDT, etc.) via OpenCore. Most PCs do not ACPI patches, so in the majority of the cases, you need to do nothing here. For those who need DSDT patches for things like XHC controllers, use SSDTs or similar Device Property patching like what's seen with Framebuffer patching. 

And to grab the location of such devices you can use [gfxutil](https://github.com/acidanthera/gfxutil/releases).

* **Comment** 
   * Name of patch
* **Count** 
   * How many time the patch is applied, `0` will apply to all instances
* **Enabled** 
   * Self explanitory, enables or disables the patch
* **Find**
   * The original name in ACPI
* **Replace** 
   * The new name in ACPI, length must match original

**Quirk**: Settings for ACPI.

* **FadtEnableReset**: NO
   * Enable reboot and shutdown on legacy hardware, not recommended unless needed
* **NormalizeHeaders**: NO
   * Cleanup ACPI header fields, only relevant for macOS High Sierra 10.13
* **RebaseRegions**: NO
   * Attempt to heuristically relocate ACPI memory regions, not needed unless custom DSDT is used.
* **ResetHwSig**: NO
   * Needed for hardware that fail to maintain hardware signature across the reboots and cause issues with waking from hibernation
* **ResetLogoStatus**: NO
   * Workaround for OEM Windows logo not drawing on systems with BGRT tables.

## Booter

![Booter](https://i.imgur.com/suElruh.png)

This section is dedicated to quirks relating to boot.efi patching with FwRuntimeServices, the replacement for AptioMemoryFix.efi

**MmioWhitelist**:

This section is allowing devices to be passthrough to macOS that are generally ignored, most users can ignore this section.

**Quirks**:

* **AvoidRuntimeDefrag**: YES
   * Fixes UEFI runtime services like date, time, NVRAM, power control, etc
* **DevirtualiseMmio**: NO
   * Reduces Stolen Memory Footprint, expands options for `slide=N` values and generally useful for most firmwares though breaks on some AMD systems.
* **DisableSingleUser**: NO
   * Disables use of `Cmd+S` and `-s`, this is closer to the behaviour of T2 based machines
* **DisableVariableWrite**: NO
   * Needed for systems with non-functioning NVRAM like Z390 and such
* **DiscardHibernateMap**: NO
   * Reuse original hibernate memory map, only needed for certain legacy hardware 
* **EnableSafeModeSlide**: YES
   * Allows for slide values to be used in Safemode
* **EnableWriteUnprotector**: YES
   * Removes write protection from CR0 register during their execution
* **ForceExitBootServices**: NO
   * Ensures ExitBootServices calls succeeds even when MemoryMap has changed, don't use unless necessary 
* **ProtectCsmRegion**: NO
   * Needed for fixing artifacts and sleep-wake issues, AvoidRuntimeDefrag resolves this already so avoid this quirk unless necessary
* **ProvideCustomSlide**: YES
   * If there's a conflicting slide value, this option forces macOS to use a pseudo-random value. Needed for those receiving `Only N/256 slide values are usable!` debug message
* **SetupVirtualMap**: YES
   * Fixes SetVirtualAddresses calls to virtual addresses
* **ShrinkMemoryMap**: NO
   * Needed for systems with large memory maps that don't fit, don't use unless necessary

## DeviceProperties

![DeviceProperties](https://i.imgur.com/ThtAO95.png)

**Add**: Sets device properties from a map.

`PciRoot(0x0)/Pci(0x0,0x4)` -&gt; `layout-id`

* Applies AppleALC audio injection, you'll need to do your own research on which codec your motherboard has and match it with AppleALC's layout. [AppleALC Supported Codecs](https://github.com/acidanthera/AppleALC/wiki/Supported-codecs).

Keep in mind that some motherboards have different device locations, you can find yours by either examining the device tree in IOReg or using [gfxutil](https://github.com/acidanthera/gfxutil/releases) You can find your audio path with the following(Do note not all audio controllers are called HDEF, sometimes being known as HDAS, AZAL, HDAU and such):
```
path/to/gfxutil -f HDEF
```

Do note that `layout-id` is a `Data` value meaning you will need to convert from `Number` to `HEX` so `Layout=5` would be interpreted as `<05000000>` and `Layout=11` would be `<0B000000>`. Audio can be left for post install.

The `PciRoot(0x0)/Pci(0x2,0x0)` is only for intel iGPUs, remove this section entirely.

**Block**: Removes device properties from map, for us we can ignore this

Fun Fact: The reason the byte order is swapped is due to [Endianness](https://en.wikipedia.org/wiki/Endianness), specifcally Little Endians that modern CPUs use for ordering bytes. The more you know!

## Kernel

![Kernel](https://i.imgur.com/ehG6Da6.png)

**Add**: Here's where you specify which kexts to load, order matters here so make sure Lilu.kext is always first! Other higher priority kexts come after Lilu such as VirtualSMC, AppleALC, WhateverGreen, etc. Reminder that [ProperTree](https://github.com/corpnewt/ProperTree) users can run Cmd/Ctrl+R to add all their kexts in the correct order without manually typing each kext out.

 * **BundlePath** 
    * Name of the kext
    * ex: `Lilu.kext`
 * **Enabled** 
    * Self explanatory, either enables or diables the kext
 * **ExecutablePath** 
    * Path to the actual executable hidden within the kext, you can see what path you kext has by right clicking and selecting `Show Package Contents`. Generally they'll be `Contents/MacOS/Kext` but some have kexts hiddin within under `Plugin` folder. Do note that plist only kexts do not need this filled in.
    * ex: `Contents/MacOS/Lilu`
 * **PlistPath** 
    * Path to the `info.plist` hidden within the kext
    * ex: `Contents/Info.plist`

**Emulate**: Needed for spoofing unsupported CPUs like Pentiums and Celerons(AMD CPUs don't require this)

* **CpuidMask**: When set to Zero, original CPU bit will be used
   * `<Clover_FCPUID_Extended_to_4_bytes_Swapped_Bytes> | 00 00 00 00 | 00 00 00 00 | 00 00 00 00`
   * ex: CPUID `0x0306A9` would be `A9 06 03 00 | 00 00 00 00 | 00 00 00 00 | 00 00 00 00`
* **CpuidData**: The value for the CPU spoofing
   * `FF FF FF FF | 00 00 00 00 | 00 00 00 00 | 00 00 00 00`
   * Swap `00` for `FF` if needing to swap with a longer value

**Block**: Blocks kexts from loading. Sometimes needed for disabling Apple's trackpad driver for some laptops.

**Patch**: This is where the AMD kernel patching magic happens. Please do note that `MatchOS` from Clover becomes `MinKernel` and `MaxKernel` in OpenCore, you can find pre-made patches by [AlGrey](https://amd-osx.com/forum/memberlist.php?mode=viewprofile&u=10918&sid=e0feb8a14a97be482d2fd68dbc268f97)(algrey#9303):

Kernel patches:
* [Ryzen/Threadripper(17h)](https://github.com/AMD-OSX/AMD_Vanilla/tree/opencore/17h) (10.13, 10.14, and 10.15)
* [Bulldozer/Jaguar(15h/16h)](https://github.com/AMD-OSX/AMD_Vanilla/tree/opencore/15h_16h) (10.13, 10.14, and 10.15)

To merge:
* Open both files, 
* Delete the `Patch` section from config.plist
* Copy the `Patch` section from patches.plist
* Paste into where old patches were in config.plist

**Quirks**:

* **AppleCpuPmCfgLock**: NO 
   * Only needed when CFG-Lock can't be disabled in BIOS, Clover counterpart would be AppleIntelCPUPM. AMD users can ignore
* **AppleXcpmCfgLock**: NO 
   * Only needed when CFG-Lock can't be disabled in BIOS, Clover counterpart would be KernelPM. AMD users can ignore
* **AppleXcpmExtraMsrs**: NO 
   * Disables multiple MSR access needed for unsupported CPUs like Pentiums and certain Xeons
* **CustomSMBIOSGuid**: NO 
   * Performs GUID patching for UpdateSMBIOSMode Custom mode. Usually relevant for Dell laptops. To be used in tandom with `PlatformInfo -> UpdateSMBIOSMode -> Custom`
* **DisableIOMapper**: NO 
   * Needed to get around VT-D if  either unable to disable in BIOS or needed for other operating systems. Effects on AMD systems varies so recommened to disable SVM(SecureVirtualMachine) in BIOS
* **ExternalDiskIcons**: YES 
   * External Icons Patch, for when internal drives are treated as external drives but can also make USB drives internal. For NVMe on Z87 and below you just add built-in property via DeviceProperties.
* **LapicKernelPanic**: NO 
   * Disables kernel panic on AP core lapic interrupt, generally needed for HP systems. Clover equivalent is `Kernel LAPIC`
* **PanicNoKextDump**: YES 
   * Allows for reading kernel panics logs when kernel panics occurs
* **PowerTimeoutKernelPanic**: YES
   * Helps fix kernel panics relating to power changes with Apple drivers in macOS Catalina, most notably with digital audio.
* **ThirdPartyDrives**: NO 
   * Enables TRIM, not needed for NVMe but AHCI based drives may require this. Please check under system report to see if your drive supports TRIM
* **XhciPortLimit**: YES 
   * This is actually the 15 port limit patch, don't rely on it as it's not a guaranteed solution for fixing USB. A more proper solution for AMD can be found here: [AMD USB Mapping](/AMD/AMD-USB-map.md)


## Misc

![Misc](https://i.imgur.com/4ORf7HB.png)

**Boot**: Settings for boot screen \(leave as-is unless you know what you're doing\)
* **HibernateMode**: None
   * Best to avoid hibernation with hackintoshes all together
* **HideSelf**: YES
   * Hides the EFI partition as a boot option in OC's boot picker
* **PollAppleHotKeys**: NO
   * Allows you to use Apple's hot keys during boot, depending on the firmware you may need to use UsbKbDxe.efi instead of OpenCore's builtin support. Do note that if you can select anything in OC's picker, disabling this option can help. Popular commands:
      * `Cmd+V`: Enables verbose
      *  `Cmd+Opt+P+R`: Cleans NVRAM 
      * `Cmd+R`: Boots Recovery partition
      * `Cmd+S`: Boot in Singleuser mode
      * `Option/Alt`: Shows boot picker when `ShowPicker` set to `NO`, alternative is `ESC` key
* **Timeout**: `5`
   * This sets how long OpenCore will wait until it automatically boots from the default selection
* **ShowPicker**: YES
   * Shows OpenCore's UI, needed for seeing your available drives or set to NO to follow default option
* **UsePicker**: YES
   * Uses OpenCore's default GUI, set to NO if you wish to use a different GUI

**Debug**: Debug has special use cases, leave as-is unless you know what you're doing.

* **DisableWatchDog**: YES \(Useful for when OpenCore is stalling on something while booting, can also help for early macOS boot issues\)
* **Target**: `75`
   * Shows more debug information, requires debug version of OpenCore
* **DisplayLevel**: `2147483714`
   * Shows even more debug information, requires debug version of OpenCore

These values are based of those calculated in [OpenCore debugging](/extras/debug.md)

**Security**: Security is pretty self-explanatory.

* **AllowNvramReset**: YES
   * Allows for NVRAM reset both in the boot picker and when pressing `Cmd+Opt+P+R`
* **ExposeSensitiveData**: `6`
   * Shows more debug information, requires debug version of OpenCore
* **RequireSignature**: NO
   * We won't be dealing vault.plist so we can ignore
* **RequireVault**: NO
   * We won't be dealing vault.plist so we can ignore as well
* **ScanPolicy**: `0` 
   * `0` allows you to see all drives available, please refer to [Security](/post-install/security.md) section for furthur details

**Tools** Used for running OC debugging tools like clearing NVRAM
* **Name**
   * Name shown in OpenCore
* **Enabled**
   * Self explanitory, enables or disables
* **Path**
   * Path to file after the `Tools` folder
   * ex: [Shell.efi](https://github.com/acidanthera/OpenCoreShell/releases)

**Entries**: Used for specifying iregular boot paths that can't be found naturally with OpenCore
* **Name**
   * Name shown in boot picker
* **Enabled**
   * Self explanitory, enables or disables
* **Path**
   * PCI route of boot drive, can be found with the [OpenCoreShell](https://github.com/acidanthera/OpenCoreShell) and the `map` command
   * ex: `PciRoot(0x0)/Pci(0x1D,0x4)/Pci(0x0,0x0)/NVMe(0x1,09-63-E3-44-8B-44-1B-00)/HD(1,GPT,11F42760-7AB1-4DB5-924B-D12C52895FA9,0x28,0x64000)/\EFI\Microsoft\Boot\bootmgfw.efi`

## NVRAM

![NVRAM](https://i.imgur.com/rRU63NJ.png)

**Add**: 4D1EDE05-38C7-4A6A-9CC6-4BCCA8B38C14 \(Booter Path, majority can ignore but \)

* **UIScale**:
  * 01: Standard resolution(Clover equivalent is `0x28`)
  * 02: HiDPI (generally required for FileVault to function correctly on smaller displays, Clover equivalent is `0x2A`\)

7C436110-AB2A-4BBB-A880-FE41995C9F82 \(System Integrity Protection bitmask\)

* **boot-args**:
  * `-v` - this enables verbose mode, which shows all the behind-the-scenes text that scrolls by as you're booting instead of the Apple logo and progress bar.  It's invaluable to any Hackintosher, as it gives you an inside look at the boot process, and can help you identify issues, problem kexts, etc.
  * `debug=0x100` - this disables macOS's watchdog which helps prevents a reboot on a kernel panic. That way you can \(hopefully\) glean some useful info and follow the breadcrumbs to get past the issues.

  * `keepsyms=1` - this is a companion setting to debug=0x100 that tells the OS to also print the symbols on a kernel panic. That can give some more helpful insight as to what's causing the panic itself.
  * `npci=0x2000` - This disables some PCI debugging related to `kIOPCIConfiguratorPFM64`, alternative is `npci= 0x3000` which disables debuging related to `gIOPCITunnelledKey`. Required for when getting stuck on `PCI Start Configuration` as there are IRQ conflicts relating to your PCI lanes.
* **csr-active-config**: Settings for SIP, generally recommended to manually change this within Recovery partition with `csrutil` via the recovery partition. Unfortunately AMD systems cannot have SIP enabled
   * `E7030000` - SIP completely disabled.

* **nvda\_drv**: &lt;&gt; 
   * For enabling Nvidia WebDrivers, set to 31 if running a [Maxwell or Pascal GPU](https://github.com/khronokernel/Catalina-GPU-Buyers-Guide/blob/master/README.md#Unsupported-nVidia-GPUs). This is the same as setting nvda\_drv=1 but instead we translate it from [text to hex](https://www.browserling.com/tools/hex-to-text). AMD and Intel GPU users should leave this area blank.
* **prev-lang:kbd**: &lt;&gt; 
   * Needed for non-latin keyboards in the format of `lang-COUNTRY:keyboard`, recommeneded to keep blank though you can specify it(**Default in Sample config is Russian**):
      * American: `en-US:0`(`656e2d55533a30` in HEX)
      * Full list can be found in [AppleKeyboardLayouts.txt](https://github.com/acidanthera/OcSupportPkg/blob/master/Utilities/AppleKeyboardLayouts/AppleKeyboardLayouts.txt)

**Block**: Forcibly rewrites NVRAM variables, do note that `Add` will not overwrite values already present in NVRAM so values like `boot-args` should be left.


**LegacyEnable**: NO
   * Allows for NVRAM to be stored on nvram.plist, needed for systems without native NVRAM

**LegacySchema**
   * Used for assigning NVRAM variables, used with LegacyEnable set to YES

## Platforminfo

![PlatformInfo](https://i.imgur.com/CrqeCea.png)

For setting up the SMBIOS info, we'll use acidanthera's [macserial](https://github.com/acidanthera/MacInfoPkg/releases) application. 

For this example, we'll choose the iMacPro1,1 SMBIOS but some SMBIOS play with certain GPUs better than others:

* iMacPro1,1: AMD RX Polaris and newer
* MacPro7,1: AMD RX Polaris and newer(Note that theres no valid serial numbers yet so iCloud, iMessage, etc will be broken. MacPro7,1 is also a Catalina exclusive)
* MacPro6,1: AMD R5/R7/R9 and older
* iMac14,2: Nvidia Kepler and newer


To get the SMBIOS info generated with macserial, you can run it with the `-a` argument \(which generates serials and board serials for all supported platforms\). You can also parse it with grep to limit your search to one SMBIOS type.

With our iMacPro1,1 example, we would run macserial like so via the terminal:

`macserial -a | grep -i iMacPro1,1`

Which would give us output similar to the following:

```text
    iMacPro1,1 | C02VVYZCHX87 | C02751200GUJG36JC
    iMacPro1,1 | C02TK03CHX87 | C02715701GUJG361F
    iMacPro1,1 | C02V1MY4HX87 | C02727600GUJG36CB
    iMacPro1,1 | C02V50CRHX87 | C02731501J9JG36AD
    iMacPro1,1 | C02VG1Y1HX87 | C02739102J9JG36FB
    iMacPro1,1 | C02TWQY4HX87 | C027256094NJG361F
    iMacPro1,1 | C02TV0M5HX87 | C02724301GUJG361M
    iMacPro1,1 | C02TL2Z0HX87 | C02716310QXJG361M
    iMacPro1,1 | C02TNGZDHX87 | C02718902QXJG36CB
    iMacPro1,1 | C02TQEYYHX87 | C02720802GUJG36UE

```

The order is `Product | Serial | Board Serial (MLB)`

The `iMacPro1,1` part gets copied to Generic -&gt; SystemProductName.

The `Serial` part gets copied to Generic -&gt; SystemSerialNumber.

The `Board Serial` part gets copied to Generic -&gt; MLB.

We can create an SmUUID by running `uuidgen` in the terminal \(or it's auto-generated via CorpNewt's GenSMBIOS script\) - and that gets copied to Generic -&gt; SystemUUID.

We set Generic -&gt; ROM to either an Apple ROM \(dumped from a real Mac\), your NIC MAC address, or any random MAC address \(could be just 6 random bytes, for this guide we'll use `11223300 0000`\)

**Automatic**: YES 
   * Generates PlatformInfo based on Generic section instead of DataHub, NVRAM, and SMBIOS sections

**UpdateDataHub**: YES
   * Update Data Hub fields

**UpdateNVRAM**: YES
   * Update NVRAM fields

**UpdateSMBIOS**: YES
   * Updates SMBIOS fields

**UpdateSMBIOSMode**: Create 
   * Replace the tables with newly allocated EfiReservedMemoryType, use Custom on Dell laptops requiring CustomSMBIOSGuid quirk

## UEFI

![UEFI](https://i.imgur.com/UiGGDWK.png)

**ConnectDrivers**: YES 
   * Forces .efi drivers, change to NO will automatically connect added UEFI drivers. This can make booting slightly faster, but not all drivers connect themselves. E.g. certain file system drivers may not load.

**Drivers**: Add your .efi drivers here

**Input**: Related to boot.efi keyboard passthrough used for for FileVault and Hotkey support

* **KeyForgetThreshold**: `5`
   * The delay between each key input when holding a key down, for best results use `5` milliseconds
* **KeyMergeThreshold**: `2`
   * The lengh of time that a key will be registered before resetting, for best results use `2` milliseconds
* **KeySupport**: `NO`
   * Enables OpenCore's built in key support, do not use with UsbKbDxe.efi
* **KeySupportMode**: `Auto`
   * Keyboard translation for OpenCore
* **KeySwap**: `NO`
   * Swaps `Option` and `Cmd` key
* **PointerSupport**: 
* Used for fixing broken pointer support, commonly used for Z87 Asus boards. Leave blank
* **PointerSupportMode**:
   * Specifies OEM protocol, currently only supports Z87 and Z97 ASUS boards so leave blank
* **TimerResolution**: `50000`
   * Set architecture timer resolution, Asus boards use `60000` for the interface

**Protocols**: (Most values can be ignored here as they're meant for real Macs/VMs)

* **ConsoleControl**: YES
   * Replaces Console Control protocol with a builtin version,  set to YES otherwise you may see text output during booting instead of nice Apple logo. Required for most APTIO firmware
* **FirmwareVolume**: NO
   * Fixes UI regarding Filevault, set to YES for better FileVault compatibilty
* **HashServices**: NO
   * Fixes incorrect cusor size when running FileVault, set to YES for better FileVault compatibilty
* **UnicodeCollation**: NO
   * Some older firmware have broken unicode collation, fixes UEFI shell compatibility on these systems(generally IvyBridge and older)

**Quirks**:

* **AvoidHighAlloc**: NO
   * Workaround for when te motherboard can't properly access higher memory in UEFI Boot Services. Avoid unless necessary(affected models: GA-Z77P-D3 (rev. 1.1))
* **ExitBootServicesDelay**: `0`
   * Only required for very specific use cases like setting to `5` for ASUS Z87-Pro running FileVault2
* **IgnoreInvalidFlexRatio**: NO
   * Fix for when MSR\_FLEX\_RATIO \(0x194\) can't be disabled in the BIOS, required for all pre-skylake based systems
* **IgnoreTextInGraphics**: NO
   * Fix for UI corruption when both text and graphics outputs happen, set to YES with SanitiseClearScreen also set to YES for pure Apple Logo\(no verbose screen\)
* **ProvideConsoleGop**: YES
   * Enables GOP\(Graphics output Protcol\) which the macOS bootloader requires for console handle
* **ReleaseUsbOwnership**: NO
   * Releases USB controller from firmware driver, needed for when your firmware doesn't support EHCI/XHCI Handoff. Clover equivalent is `FixOwnership`
* **RequestBootVarFallback**: YES
   * Request fallback of some Boot prefixed variables from `OC_VENDOR_VARIABLE_GUID` to `EFI_GLOBAL_VARIABLE_GUID`. Used for fixing boot options.
* **RequestBootVarRouting**: YES
   * Redirects AptioMemeoryFix from `EFI_GLOBAL_VARIABLE_GUID` to `OC\_VENDOR\_VARIABLE\_GUID`. Needed for when firmware tries to delete boot entries and is recommended to be enabled on all systems for correct update installation, Startup Disk control panel functioning, etc.
* **ReplaceTabWithSpace**: NO
   * Depending on firmware, some system may need this to properly edit files in the UEFI shell when unable to handle Tabs. This swaps it for spaces instead but majority can ignore it but do note that ConsoleControl set to True may be needed
* **SanitiseClearScreen**: NO
   * Fixes High resolutions displays that display OpenCore in 1024x768, recommened for user with 1080P+ displays
* **ClearScreenOnModeSwitch**: NO
   * Needed for when half of the previously drawn image remains, will force black screen before switching to TextMode. Do note that ConsoleControl set to True may be needed
* **UnblockFsConnect**: NO
   * Some firmwares block partition handles by opening them in By Driver mode, which results in File System protocols being unable to install. Mainly relevant for HP systems when no drives are listed


# Cleaning up

And now you're ready to save and place it into your EFI under EFI/OC.

For those having booting issues, please make sure to read the [Troubleshooting section](/extras/troubleshooting.md) first and if your questions are still unanswered we have plenty of resources at your disposal:

* [AMD OS X Discord](https://discord.gg/QuUWg7)
* [r/Hackintosh Subreddit](https://www.reddit.com/r/hackintosh/)


# Post install

So what in the world needs to be done once everything is installed? Well here's some things:

* [USB mapping](https://github.com/khronokernel/Opencore-Vanilla-Desktop-Guide/blob/master/AMD/AMD-USB-map.md) 
* Correcting audio, reread the DeviceProperties on how
* [Removing NullCPUPowerManagment.kext and improving GPU performance](https://github.com/khronokernel/Opencore-Vanilla-Desktop-Guide/blob/master/AMD/NullCPU-patch.md)
* [Enabling FileVault and other security features](/post-install/security.md)
* Moving OpenCore from the USB to your main drive
   * Mount USB's EFI
   * Copy EFI folder to desktop
   * Unmount USB and mount boot drive's EFI
   * Paste EFI onto root of the drive
