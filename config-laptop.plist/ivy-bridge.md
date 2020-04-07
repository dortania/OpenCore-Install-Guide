# Ivy Bridge

* Supported version: 0.5.7

## Starting Point

So making a config.plist may seem hard, its not. It just takes some time but this guide will tell you how to configure eveything, you won't be left in the cold. This also means if you have issues, review your config settings to make sure they're correct. Main things to note with OpenCore:

* **All properties must be defined**, there are no default OpenCore will fall back on so **do not delete sections unless told explicitly so**. If the guide doesn't mention the option, leave it at default.
* **The Sample.plist cannot be used As-Is**, you must configure it to your system
* **DO NOT USE CONFIGURATORS**, these rarely respect OpenCore's configuration and even some like Mackie's will add Clover properties and corrupt plists!

Now with all that, we'll need some things to get started:

* [ProperTree](https://github.com/corpnewt/ProperTree): For editing our config, this editor has some super useful tools for OpenCore
* [GenSMBIOS](https://github.com/corpnewt/GenSMBIOS): For generating our SMBIOS
* [Sample.plist](https://github.com/acidanthera/OpenCorePkg/releases): This is found under the Docs folder of the release download

Now with those downloaded, we can get to really get started:

* Grab the **Sample.plist** and rename to **config.plist**
* Open your new config.plist in ProperTree
   * macOS: `ProperTree.command`
   * Windows: `ProperTree.bat`
* Run the Clean Snapshot function(**Cmd/Ctrl + Shift + R** and point it at your EFI/OC folder), 
   * This will remove all the entries from the config.plist and then adds all your SSDTs, Kexts and Firmware drivers to the config
   * Cmd+R is another option that will add all your files as well but will leave entries disabled if they were set like that before, useful for when you're troubleshooting

**And read this guide more than once before setting up OpenCore and make sure you have it set up correctly. Do note that images will not always be the most up-to-date so please read the text below them, if nothing's mentioned then leave as default.**

## ACPI

![ACPI](https://i.imgur.com/QFsl9R1.png)

**Add:**

This is where you'll add SSDTs for your system, these are very important to **booting macOS** and have many uses like [USB maps](https://usb-map.gitbook.io/project/), [disabling unsupported GPUs](/post-install/spoof.md) and such. And with our system, **its even required to boot**. Guide on making them found here: [**Getting started with ACPI**](https://acpi.dortania.ml/)

For us we'll need a couple of SSDTs to bring back functionality that Clover provided:

* [CPU-PM](https://github.com/Piker-Alpha/ssdtPRGen.sh)
   * Needed for proper CPU power management, you will need to run Pike's ssdtPRGen.sh script to generate this file. This will be run in post install.
* [SSDT-PNLF](https://github.com/acidanthera/WhateverGreen/blob/master/Manual/SSDT-PNLF.dsl)
   * Adds brightness control support
* [SSDT-XOSI](https://github.com/hackintosh-guides/vanilla-laptop-guide/tree/master/Misc-files/SSDT-XOSI.aml)
   * Used for enabling Windows features in macOS, mainly needed for I2C controllers
* [SSDT-GPIO](https://github.com/khronokernel/Getting-Started-With-ACPI/blob/master/extra-files/SSDT-GPI0.dsl)
   * Creates a stub so VoodooI2C can connect

Note that you **should not** add your generated `DSDT.aml` here, it is already in your firmware. So if present, remove the entry for it in your `config.plist` and under EFI/ACPI.

For those wanting a deeper dive into dumping your DSDT, how to make these SSDTs, and compiling them, please see the [**Getting started with ACPI**](https://acpi.dortania.ml/) **page.** Compiled SSDTs have a **.aml** extension(Assembled) and will go into the `EFI/OC/ACPI` folder and **must** be specified in your config under `ACPI -> Add` as well.


**Block**

This blocks certain ACPI tabes from loading, for us we can ignore this

**Patch**:

This section allows us to dynamically modify parts of the ACPI \(DSDT, SSDT, etc.\) via OpenCore. For us, we'll need a couple:

* EC Rename
   * Needed for Catalina support as it doesn't like the standard one found on most PCs, follow the [Fixing Embedded Controllers Guide](https://acpi.dortania.ml/) on how to determine what EC you have and apply the appropriate patches
* OSI rename
   * This is required when using SSDT-XOSI as we redirect all OSI calls to this SSDT
   
| Comment | String | Change XXXX to EC |
| :--- | :--- | :--- |
| Enabled | String | YES |
| Count | Number | 0 |
| Limit | Nuber | 0 |
| Find | Data | xxxxxxxx |
| Replace | Data | 45435f5f |
   
| Comment | String | Change _OSI to XOSI |
| :--- | :--- | :--- |
| Enabled | String | YES |
| Count | Number | 0 |
| Limit | Nuber | 0 |
| Find | Data | 5f4f5349 |
| Replace | Data | 584f5349 |

**Quirk**: 

Settings relating to ACPI, leave everything here as default.

* **FadtEnableReset**: NO
   * Enable reboot and shutdown on legacy hardware, not recommended unless needed
* **NormalizeHeaders**: NO
   * Cleanup ACPI header fields, only relevant for macOS High Sierra 10.13
* **RebaseRegions**: NO
   * Attempt to heuristically relocate ACPI memory regions, not needed unless custom DSDT is used.
* **ResetHwSig**: NO
   * Needed for hardware that fails to maintain hardware signature across the reboots and cause issues with waking from hibernation
* **ResetLogoStatus**: NO
   * Workaround for OEM Windows logo not drawing on systems with BGRT tables.

## Booter

![Booter](https://cdn.discordapp.com/attachments/456913818467958789/681325158815760384/Screen_Shot_2020-02-23_at_7.22.44_PM.png)

This section is dedicated to quirks relating to boot.efi patching with OpenRuntime, the replacement for AptioMemoryFix.efi

**MmioWhitelist**:

This section is allowing spaces to be passthrough to macOS that are generally ignored, useful when paired with `DevirtualiseMmio`

**Quirks**:

Settings relating to boot.efi patching and firmware fixes, for us we care about enabling `SetupVirtualMap`

* **AvoidRuntimeDefrag**: YES
   * Fixes UEFI runtime services like date, time, NVRAM, power control, etc
* **DevirtualiseMmio**: NO
   * Reduces Stolen Memory Footprint, expands options for `slide=N` values and generally useful especially on HEDT and Xeon systems
* **DisableSingleUser**: NO
   * Disables the use of `Cmd+S` and `-s`, this is closer to the behaviour of T2 based machines
* **DisableVariableWrite**: NO
   * Needed for systems with non-functioning NVRAM, you can verify [here](/post-install/nvram.md) if yours works
* **DiscardHibernateMap**: NO
   * Reuse original hibernate memory map, only needed for certain legacy hardware 
* **EnableSafeModeSlide**: YES
   * Allows for slide values to be used in Safemode
* **EnableWriteUnprotector**: YES
   * Removes write protection from CR0 register during their execution
* **ForceExitBootServices**: NO
   * Ensures ExitBootServices calls succeeds even when MemoryMap has changed, don't use unless necessary 
* **ProtectCsmRegion**: NO
   * Needed for fixing artefacts and sleep-wake issues, AvoidRuntimeDefrag resolves this already so avoid this quirk unless necessary
* **ProtectSecureBoot**: NO
   * Fixes secureboot keys on MacPro5,1 and Insyde firmwares
* **ProtectUefiServices**: NO
   * Protects UEFI services from being overridden by the firmware, mainly relevant for VMs, Icelake and certain Coffeelake systems
* **ProvideCustomSlide**: YES
   * If there's a conflicting slide value, this option forces macOS to use a pseudo-random value. Needed for those receiving `Only N/256 slide values are usable!` debug message
* **SetupVirtualMap**: YES
   * Fixes SetVirtualAddresses calls to virtual addresses
* **ShrinkMemoryMap**: NO
   * Needed for systems with large memory maps that don't fit, don't use unless necessary
* **SignalAppleOS**: NO
   * Tricks the hardware into thinking its always booting macOS, mainly benifitial for MacBook Pro's with dGPUs as booting Windows won't allow for the iGPU to be used

## DeviceProperties
![DeviceProperties](https://i.imgur.com/Aw9t9vI.png)

**Add**: Sets device properties from a map.

This section is set up via WhateverGreen's [Framebuffer Patching Guide](https://github.com/acidanthera/WhateverGreen/blob/master/Manual/FAQ.IntelHD.en.md) and is used for fixing certain iGPU properties like `ig-platform-id`. The way we get the proper value for this is to look at the framebuffer we intend to use, then swap the pairs of hex bytes.


If we think of our ig-plat as `0xAABBCCDD`, our swapped version would look like `DDCCBBAA`

| iGPU | device-id | AAPL,ig-platform-id | Port Count | Stolen Memory | Framebuffer Memory | Video RAM | Connectors |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Intel HD Graphics 4000 | 66010001 | 01006601 | 4 | 96MB | 24MB | 1536MB | LVDS1 HDMI1 DP2 |
| Intel HD Graphics 4000 | 66010002 | 02006601 | 1 | 64MB | 24MB | 1536MB | LVDS1 |
| **Intel HD Graphics 4000 <sup>1</sup>** * | 66010003 | 03006601 | 4 | 64MB | 16MB | 1536MB | LVDS1 DP3 |
| **Intel HD Graphics 4000 <sup>2</sup>** | 66010004 | 04006601 | 1 | 32MB | 16MB | 1536MB | LVDS1 |
| Intel HD Graphics 4000 | 66010008 | 08006601 | 3 | 64MB | 16MB | 1536MB | LVDS1 DP2 |
| **Intel HD Graphics 4000 <sup>3</sup>** | 66010009 | 09006601 | 3 | 64MB | 16MB | 1536MB | LVDS1 DP2 |

#### Special Notes:

* For these cards, no `device-id` property is required.

* <sup>1</sup> : to be used with 1366 by 768 displays or lower (main)

* <sup>2</sup> : to be used with 1600 by 900 displays or higher (main)

* <sup>3</sup> : to be used with some devices that have `eDP` connected monitor (contrary to classical LVDS), must be tested with <sup>1</sup> and <sup>2</sup> first then try this.

* VGA is *not* supported (unless it's running through a DP to VGA internal adapter, which apparently only rare devices will see it as DP and not VGA, it's all about luck.)

* For `04006601` platform, as you can tell, it has only one output, which is not enough for external connectors (HDMI/DP), you may need to add these extra parameters (credit to Rehabman)

  | Key | Type | Value | Explanation |
  | :--- | :--- | :--- | :--- |
  | `framebuffer-patch-enable` | Number | `1`                                                          | *enabling the semantic patches in principle* (from WEG manual) |
  | `framebuffer-memorycount`  | Number | `2`                                                          | Matching FBMemoryCount to the one on `03006601` (1 on `04` vs 2 on `03`) |
  | `framebuffer-pipecount`    | Number | `2`                                                          | Matching PipeCount to the one on `03006601` (3 on `04` vs 2 on `03`) |
  | `framebuffer-portcount`    | Number | `4`                                                          | Matching PortCount to the one on `03006601` (1 on `04` vs 4 on `03`) |
  | `framebuffer-stolenmem`    | Data   | `00000004`                                                   | Matching STOLEN memory to 64MB (0x04000000 from hex to base 10 in Bytes) to the one on `03006601`<br />Check [here](https://www.tonymacx86.com/threads/guide-alternative-to-the-minstolensize-patch-with-32mb-dvmt-prealloc.221506/) for more information. |
  | `framebuffer-con1-enable`  | Number | `1`                                                          | This will enable patching on *connector1* of the driver. (Which is the second connector after con0, which is the eDP/LVDS one) |
  | `framebuffer-con1-alldata` | Data   | `02050000 00040000 07040000 03040000 00040000 81000000 04060000 00040000 81000000` | When using `all data` with a connector, either you give all information of that connector (port-bused-type-flag) or that port and the ones following it, like in this case.<br />In this case, the ports in `04` are limited to `1`:<br />`05030000 02000000 30020000` (which corresponds to port 5, which is LVDS)<br />However on `03` there are 3 extra ports:<br />`05030000 02000000 30000000` (LVDS, con0, like `04`)<br/>`02050000 00040000 07040000` (DP, con1)<br/>`03040000 00040000 81000000` (DP, con2)<br/>`04060000 00040000 81000000` (DP, con3)<br />Since we changed the number of PortCount to `4` in a platform that has only 1, that means we need to define the 3 others (and we that starting with con1 to the end).<br /> |

* Some laptops from this era came with a mixed chipset setup, using Ivy Bridge CPUs with Sandy Bridge chipsets which creates issues with macOS since it expects a certain IMEI ID that it doesn't find and would get stuck at boot, to fix this we need to fake the IMEI's IDs in these models

  * To know if you're affected check if your CPU is an intel Core ix-3xxx and your chipset is Hx6x (for example a laptop with HM65 or HM67 with a Core i3-3110M)
  * In your config add a new PciRoot device named `PciRoot(0x0)/Pci(0x16,0x0)`
    * Key: `device-id`
    * Type: Data
    * Value: `3A1E0000`

`PciRoot(0x0)/Pci(0x1f,0x3)` -> `Layout-id`

* Applies AppleALC audio injection, you'll need to do your own research on which codec your motherboard has and match it with AppleALC's layout. [AppleALC Supported Codecs](https://github.com/acidanthera/AppleALC/wiki/Supported-codecs).

For us, we'll be using the boot-arg `alcid=xxx` instead to accomplish this. `alcid` will override all other layout-IDs present

**Block**: Removes device properties from the map, for us we can ignore this

Fun Fact: The reason the byte order is swapped is due to [Endianness](https://en.wikipedia.org/wiki/Endianness), specifically Little Endians that modern CPUs use for ordering bytes. The more you know!

## Kernel

![Kernel](https://media.discordapp.net/attachments/456913818467958789/681335231080300564/Screen_Shot_2020-02-23_at_8.02.45_PM.png?width=1486&height=1771)

**Add**: Here's where you specify which kexts to load, order matters here so make sure Lilu.kext is always first! Other higher priority kexts come after Lilu such as VirtualSMC, AppleALC, WhateverGreen, etc. A reminder that [ProperTree](https://github.com/corpnewt/ProperTree) users can run **Cmd/Ctrl + Shift + R** to add all their kexts in the correct order without manually typing each kext out.

* **BundlePath**
   * Name of the kext
   * ex: `Lilu.kext`
* **Enabled**
   * Self-explanatory, either enables or disables the kext
* **ExecutablePath**
   * Path to the actual executable is hidden within the kext, you can see what path your kext has by right-clicking and selecting `Show Package Contents`. Generally, they'll be `Contents/MacOS/Kext` but some have kexts hidden within under `Plugin` folder. Do note that plist only kexts do not need this filled in.
   * ex: `Contents/MacOS/Lilu`
* **PlistPath**
   * Path to the `info.plist` hidden within the kext
   * ex: `Contents/Info.plist`

**Emulate**: Needed for spoofing unsupported CPUs like Pentiums and Celerons

* **CpuidMask**: Leave this blank
* **CpuidData**: Leave this blank

**Block**: Blocks kexts from loading. Not relevant for us

**Patch**: Patches both the kernel and kexts

**Quirks**:

Settings relating to the kernel, for us we'll be enabling `AppleCpuPmCfgLock`, `AppleXcpmCfgLock`, `DisableIOMapper`,  `PanicNoKextDump`, `PowerTimeoutKernelPanic` and `XhciPortLimit`. Everything else should be left as default

* **AppleCpuPmCfgLock**: YES 
   * Only needed when CFG-Lock can't be disabled in BIOS, Clover counterpart would be AppleIntelCPUPM. **Please verify you can disable CFG-Lock, most systems won't boot with it on so requiring use of this quirk**
* **AppleXcpmCfgLock**: YES 
   * Only needed when CFG-Lock can't be disabled in BIOS, Clover counterpart would be KernelPM. **Please verify you can disable CFG-Lock, most systems won't boot with it on so requiring use of this quirk**
* **AppleXcpmExtraMsrs**: NO 
   * Disables multiple MSR access needed for unsupported CPUs like Pentiums and many Xeons.
* **AppleXcpmForceBoost**: NO
   * Forces maximum multiplier, only recommended to enable on scientific or media calculation machines that are constantly under load. Main Xeons benifit from this
* **CustomSMBIOSGuid**: NO 
   * Performs GUID patching for UpdateSMBIOSMode Custom mode. Usually relevant for Dell laptops
* **DisableIoMapper**: YES 
   * Needed to get around VT-D if either unable to disable in BIOS or needed for other operating systems, much better alternative to `dart=0` as SIP can stay on in Catalina
* **DummyPowerManagement**: NO
   * New alternative to NullCPUPowerManagement, required for all AMD CPU based systems as there's no native power management. Intel can ignore
* **ExternalDiskIcons**: NO 
   * External Icons Patch, for when internal drives are treated as external drives but can also make USB drives internal. For NVMe on Z87 and below you just add built-in property via DeviceProperties.
* **IncreasePciBarSize**: NO
   * Increases 32-bit PCI bar size in IOPCIFamily from 1 to 4 GB, enabling Above4GDecoding in the BIOS is a much cleaner and safer approach. Some X99 boards may require this, you'll generally expereince a kernel panic on IOPCIFamily if you need this
* **LapicKernelPanic**: NO 
   * Disables kernel panic on AP core lapic interrupt, generally needed for HP systems. Clover equivalent is `Kernel LAPIC`
* **PanicNoKextDump**: YES 
   * Allows for reading kernel panics logs when kernel panics occur
* **PowerTimeoutKernelPanic**: YES
   * Helps fix kernel panics relating to power changes with Apple drivers in macOS Catalina, most notably with digital audio.
* **ThirdPartyDrives**: NO 
   * Enables TRIM, not needed for NVMe but AHCI based drives may require this. Please check under system report to see if your drive supports TRIM
* **XhciPortLimit**: YES 
   * This is actually the 15 port limit patch, don't rely on it as it's not a guaranteed solution for fixing USB. Please create a [USB map](https://usb-map.gitbook.io/project/) when possible.

The reason being is that UsbInjectAll reimplements builtin macOS functionality without proper current tuning. It is much cleaner to just describe your ports in a single plist-only kext, which will not waste runtime memory and such

## Misc

![Misc](https://cdn.discordapp.com/attachments/683011276938543134/683011604182466560/Screen_Shot_2020-02-28_at_10.52.25_AM.png)

**Boot**: Settings for boot screen (Leave everything as default)
* **HibernateMode**: None
   * Best to avoid hibernation with Hackintoshes all together
* **PickerMode**: `Builtin`
   * Sets OpenCore to use the builtin picker
* **HideAuxiliary**: NO
   * Hides Recovery and other partitions unless spacebar is pressed, more closely matches real Mac behaviour
* **HideSelf**: YES
   * Hides the EFI partition as a boot option in OC's boot picker
* **PickerAttributes**:
   * Sets OpenCore's UI color, won't be covered here but see 8.3.8 of [Configuration.pdf](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/Configuration.pdf) for more info
* **PickerAudioAssist**: NO
   * Used for enabling VoiceOver like support in the picker, unless you want your hack talking to you keep this disabled
* **PollAppleHotKeys**: NO
   * Allows you to use Apple's hotkeys during boot, depending on the firmware you may need to use OpenUsbKbDxe.efi instead of OpenCore's builtin support. Do note that if you can select anything in OC's picker, disabling this option can help. Popular commands:
      * `Cmd+V`: Enables verbose
      * `Cmd+Opt+P+R`: Cleans NVRAM 
      * `Cmd+R`: Boots Recovery partition
      * `Cmd+S`: Boot in Single-user mode
      * `Option/Alt`: Shows boot picker when `ShowPicker` set to `NO`, an alternative is `ESC` key
* **TakeoffDelay**: `0`
  * Used to add a delay for hotkeys when OpenCore is a bit to fast to register, 5000-10000 microseconds is the prefered range for users with broken hotkeys support  
* **Timeout**: `5`
  * This sets how long OpenCore will wait until it automatically boots from the default selection

**Debug**: Helpful for debugging OpenCore boot issues(We'll be changing everything *but* `DisplayDelay`)

* **AppleDebug**: YES
   * Enables boot.efi logging, useful for debuuging. Note this is only supported on 10.15.4 and newer
* **DisableWatchDog**: YES
   * Disables the UEFI watchdog, can help with early boot issues
* **Target**: `67`
   * Shows more debug information, requires debug version of OpenCore
* **DisplayLevel**: `2147483714`
   * Shows even more debug information, requires debug version of OpenCore

These values are based of those calculated in [OpenCore debugging](/troubleshooting/debug.md)


**Security**: Security is pretty self-explanatory, **do not skip**

We'll be changing `AllowNvramReset`, `AllowSetDefault`, `Vault` and `ScanPolicy`

* **AllowNvramReset**: YES
   * Allows for NVRAM reset both in the boot picker and when pressing `Cmd+Opt+P+R`
* **AllowSetDefault**: YES
   * Allow `CTRL+Enter` and `CTRL+Index` to set default boot device in the picker
* **AuthRestart**: NO:
   * Enables Authenticated restart for FileVault2 so password is not required on reboot. Can be concidered a security risk so optional
* **ExposeSensitiveData**: `6`
   * Shows more debug information, requires debug version of OpenCore
* **Vault**: `Optional`
   * We won't be dealing vaulting so we can ignore, **you won't boot with this set to Secure**
* **ScanPolicy**: `0` 
   * `0` allows you to see all drives available, please refer to [Security](/post-install/security.md) section for further details. **Will not boot USBs with this set to default**

**Tools** Used for running OC debugging tools like the shell, ProperTree's snapshot function will add these for you. For us, we won't be using any tools
* **Name** 
   * Name shown in OpenCore
* **Enabled** 
   * Self-explanatory, enables or disables
* **Path** 
   * Path to file after the `Tools` folder
   * ex: [OpenShell.efi](https://github.com/acidanthera/OpenCorePkg/releases)

**Entries**: Used for specifying irregular boot paths that can't be found naturally with OpenCore

Won't be covered here, see 8.6 of [Configuration.pdf](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/Configuration.pdf) for more info

## NVRAM

![NVRAM](https://cdn.discordapp.com/attachments/456913818467958789/681330600606826568/Screen_Shot_2020-02-23_at_7.44.23_PM.png)

**Add**: 

4D1EDE05-38C7-4A6A-9CC6-4BCCA8B38C14 (Booter Path, mainly used for UI Scaling)

* **UIScale**:
   * `01`: Standard resolution(Clover equivalent is `0x28`)
   * `02`: HiDPI (generally required for FileVault to function correctly on smaller displays, Clover equivalent is `0x2A`)

* **DefaultBackgroundColor**: Background color used by boot.efi
   * `00000000`: Syrah Black
   * `BFBFBF00`: Light Gray

7C436110-AB2A-4BBB-A880-FE41995C9F82 (System Integrity Protection bitmask)

* **boot-args**:
   * **-v** - this enables verbose mode, which shows all the behind-the-scenes text that scrolls by as you're booting instead of the Apple logo and progress bar. It's invaluable to any Hackintosher, as it gives you an inside look at the boot process, and can help you identify issues, problem kexts, etc.
   * **debug=0x100**- this disables macOS's watchdog which helps prevents a reboot on a kernel panic. That way you can *hopefully* glean some useful info and follow the breadcrumbs to get past the issues.
   * **keepsyms=1** - this is a companion setting to debug=0x100 that tells the OS to also print the symbols on a kernel panic. That can give some more helpful insight as to what's causing the panic itself.
   * **alcid=1** - used for setting layout-id for AppleALC, see [supported codecs](https://github.com/acidanthera/applealc/wiki/supported-codecs) to figure out which layout to use for your specific system.
   * **-wegnoegpu** - Disables all other GPUs besides the integrated GPU, needed as the dGPUs in laptops are not supported
   
   
* **csr-active-config**: Settings for SIP, generally recommended to manually change this within Recovery partition with `csrutil` via the recovery partition

csr-active-config is set to `00000000` which enables System Integrity Protection. You can choose a number of other options to enable/disable sections of SIP. Some common ones are as follows:

* `00000000` - SIP completely enabled
* `03000000` - Allow unsigned kexts and writing to protected fs locations
* `E7030000` - SIP completely disabled

Recommended to leave enabled for best security practices

* **nvda\_drv**: &lt;> 
   * For enabling Nvidia WebDrivers, set to 31 if running a [Maxwell or Pascal GPU](https://github.com/khronokernel/Catalina-GPU-Buyers-Guide/blob/master/README.md#Unsupported-nVidia-GPUs). This is the same as setting nvda\_drv=1 but instead we translate it from [text to hex](https://www.browserling.com/tools/hex-to-text), Clover equivalent is `NvidiaWeb`. **AMD, Intel and Kepler GPU users should delete this section.**
* **prev-lang:kbd**: &lt;> 
   * Needed for non-latin keyboards in the format of `lang-COUNTRY:keyboard`, recommeneded to keep blank though you can specify it(**Default in Sample config is Russian**):
   * American: `en-US:0`(`656e2d55533a30` in HEX)
   * Full list can be found in [AppleKeyboardLayouts.txt](https://github.com/acidanthera/OpenCorePkg/blob/master/Utilities/AppleKeyboardLayouts/AppleKeyboardLayouts.txt)
   * Hint: `prev-lang:kbd` can be changed into a String so you can input `en-US:0` directly instead of converting to HEX
   
| Key | Type | Value |
| :--- | :--- | :--- |
| prev-lang:kbd | String | en-US:0 |

**Block**: Forcibly rewrites NVRAM variables, do note that `Add` **will not overwrite** values already present in NVRAM so values like `boot-args` should be left alone.

**LegacyEnable**: NO
* Allows for NVRAM to be stored on nvram.plist, needed for systems without native NVRAM

**LegacyOverwrite**: NO
* Permits overwriting firmware variables from nvram.plist, only needed for systems without native NVRAM

**LegacySchema**
* Used for assigning NVRAM variables, used with LegacyEnable set to YES

**WriteFlash**: YES
* Enables writing to flash memory for all added variables.

## Platforminfo

![PlatformInfo](https://i.imgur.com/5rl12dZ.png)

For setting up the SMBIOS info, we'll use CorpNewt's [GenSMBIOS](https://github.com/corpnewt/GenSMBIOS) application. 

For this Ivy Bridge example, we'll chose the iMac13,2 SMBIOS - this is done intentionally for compatibility's sake. The typical breakdown is as follows:

| SMBIOS | CPU Type | GPU Type | Display Size |
| :--- | :--- | :--- | :--- |
| MacBookAir5,1 | Dual Core 17w | iGPU: HD 4000 | 11" |
| MacBookAir5,2 | Dual Core 17w | iGPU: HD 4000 | 13" |
| MacBookPro10,1 | Quad Core 45w | iGPU: HD 4000 + dGPU: GT650M | 15" |
| MacBookPro10,2 | Dual Core 35w(High End) | iGPU: HD 4000 | 13" |

Run GenSMBIOS, pick option 1 for downloading MacSerial and Option 3 for selecting out SMBIOS.  This will give us an output similar to the following:

```text
  #######################################################
 #               MacBookPro10,2 SMBIOS Info                  #
#######################################################

Type:         MacBookPro10,2
Serial:       C02KCYZLDNCW
Board Serial: C02309301QXF2FRJC
SmUUID:       A154B586-874B-4E57-A1FF-9D6E503E4580
```
The `Type` part gets copied to Generic -> SystemProductName.

The `Serial` part gets copied to Generic -> SystemSerialNumber.

The `Board Serial` part gets copied to Generic -> MLB.

The `SmUUID` part gets copied toto Generic -> SystemUUID.

We set Generic -> ROM to either an Apple ROM (dumped from a real Mac), your NIC MAC address, or any random MAC address (could be just 6 random bytes, for this guide we'll use `11223300 0000`. After install follow the [Fixing iServices](/post-install/iservices.md) page on how to find your real MAC Address)

**Reminder that you want either an invalid serial or valid serial numbers but those not in use, you want to get a message back like: "Invalid Serial" or "Purchase Date not Validated"**

[Apple Check Coverage page](https://checkcoverage.apple.com)

**Automatic**: YES 

* Generates Platforminfo based on Generic section instead of DataHub, NVRAM, and SMBIOS sections

**Generic**:

* **SpoofVendor**: YES
   * Swaps vendor field for Acidanthera, generally not safe to use Apple as a vendor in most case
* **SupportsCsm**: NO
   * Used for when the EFI partition isn't first on the windows drive

**UpdateDataHub**: YES

* Update Data Hub fields

**UpdateNVRAM**: YES

* Update NVRAM fields

**UpdateSMBIOS**: YES

* Updates SMBIOS fields

**UpdateSMBIOSMode**: Create

* Replace the tables with newly allocated EfiReservedMemoryType, use Custom on Dell laptops requiring CustomSMBIOSGuid quirk

## UEFI

![UEFI](https://cdn.discordapp.com/attachments/683011276938543134/683518166915481677/Screen_Shot_2020-02-29_at_8.36.55_PM.png)

**ConnectDrivers**: YES

* Forces .efi drivers, change to NO will automatically connect added UEFI drivers. This can make booting slightly faster, but not all drivers connect themselves. E.g. certain file system drivers may not load.

**Drivers**: Add your .efi drivers here

Only drivers present here should be:

* HfsPlus.efi
* ApfsDriverLoader.efi
* OpenRuntime.efi

**Audio**: Related to AudioDxe settings, for us we'll be ignoring(leave as default). This is unrelated to audio support in macOS

* **AudioSupport**: NO
   * Used for enabling the audio port out, this requires AudioOut
* **AudioDevice**: [Blank]
   * This will be the PciRoot of your audio device, [gfxutil](https://github.com/acidanthera/gfxutil/releases) and debug log are great ways to find this
* **AudioCodec**: 0
   * Specify your audio codec address, can be found in either debug log or with under `IOHDACodecAddress` in IOService
* **AudioOut**: 0
   * Specifies which output is used, use the debug log to see what your board has
   * Same idea, can be found in either debug log or with [HdaCodecDump.efi](https://github.com/acidanthera/OpenCorePkg/releases)
* **MinimumVolume**: 20
   * Default sound level for audio output
* **PlayChime**: NO
   * Emulates the iconic Mac startup sound
   * This also requires [`AXEFIAudio_VoiceOver_Boot.wav`](https://github.com/acidanthera/OcBinaryData/blob/master/Resources/Audio/AXEFIAudio_VoiceOver_Boot.wav) under EFI/OC/Resources/Audio
* **VolumeAmplifier**: 0
   * Multiplication coefficient for system volume to raw volume linear translation from 0 to 1000, see [Configuration.pdf](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/Configuration.pdf) for more info on calculation

**Input**: Related to boot.efi keyboard passthrough used for FileVault and Hotkey support

* **KeyFiltering**: NO
   * Verifies and discards uninitialised data, mainly prevalent on 7 series Gigabyte boards
* **KeyForgetThreshold**: `5`
   * The delay between each key input when holding a key down, for best results use `5` milliseconds
* **KeyMergeThreshold**: `2`
   * The length of time that a key will be registered before resetting, for best results use `2` milliseconds
* **KeySupport**: `YES`
   * Enables OpenCore's built in key support and **required for boot picker selection**, do not use with OpenUsbKbDxe.efi
* **KeySupportMode**: `Auto`
   * Keyboard translation for OpenCore
* **KeySwap**: `NO`
   * Swaps `Option` and `Cmd` key
* **PointerSupport**: `NO`
   * Used for fixing broken pointer support, commonly used for Z87 Asus boards
* **PointerSupportMode**:
   * Specifies OEM protocol, currently only supports Z87 and Z97 ASUS boards so leave blank
* **TimerResolution**: `50000`
   * Set architecture timer resolution, Asus Z87 boards use `60000` for the interface. Settings to `0` can also work for some

**Output**: Relating to visual output

* **TextRenderer**: `BuiltinGraphics`
   * Used for fixing resoltuion of OpenCore itself, `Resolution` must be set to `Max` to work correctly
* **ConsoleMode**: [Blank]
   * Specifies Console output size, best to keep it blank
* **Resolution**: `Max`
   * Sets OpenCore's resolution, `Max` will use the highest avalible reolution or can be specified (`WxH@Bpp (e.g. 1920x1080@32) or WxH (e.g. 1920x1080)`)
* **ClearScreenOnModeSwitch**: NO
   * Needed for when half of the previously drawn image remains, will force black screen before switching to TextMode. Do note that this is only required in cases when using `System` TextRenderer
* **IgnoreTextInGraphics**: NO
   * Fix for UI corruption when both text and graphics outputs, only relevant for users using `System` TextRenderer 
* **ProvideConsoleGop**: YES
   * Enables GOP(Graphics output Protcol) which the macOS bootloader requires for console handle, **required for graphical output once the kernel takes over**
* **DirectGopRendering**: NO
   * Use builtin graphics output protocol renderer for console, mainly relevant for MacPro5,1 users
* **ReconnectOnResChange**: NO
* **ReplaceTabWithSpace**: NO
   * Depending on the firmware, some system may need this to properly edit files in the UEFI shell when unable to handle Tabs. This swaps it for spaces instead-but majority can ignore it but do note that ConsoleControl set to True may be needed   
* **SanitiseClearScreen**: NO
   * Fixes High resolutions displays that display OpenCore in 1024x768, only relevant for users using `System` TextRenderer

**Protocols**: (Most values can be ignored here as they're meant for real Macs/VMs)

* **AppleSmcIo**: NO
   * Reinstalls Apple SMC I/O, this is the equivlant of VirtualSMC.efi which is only needed for users using FileVault
* **FirmwareVolume**: NO
   * Fixes UI regarding Filevault, set to YES for better FileVault compatibility
* **HashServices**: NO
   * Fixes incorrect cursor size when running FileVault, set to YES for better FileVault compatibility
* **UnicodeCollation**: NO
   * Some older firmware have broken Unicode collation, fixes UEFI shell compatibility on these systems(generally IvyBridge and older)


**Quirks**:

* **ExitBootServicesDelay**: `0`
   * Only required for very specific use cases like setting to `3000` - `5000` for ASUS Z87-Pro running FileVault2
* **IgnoreInvalidFlexRatio**: YES
   * Fix for when MSR\_FLEX\_RATIO (0x194) can't be disabled in the BIOS, required for all pre-skylake based systems
* **ReleaseUsbOwnership**: NO
   * Releases USB controller from firmware driver, needed for when your firmware doesn't support EHCI/XHCI Handoff. Clover equivalent is `FixOwnership`
* **RequestBootVarFallback**: YES
   * Request fallback of some Boot prefixed variables from `OC_VENDOR_VARIABLE_GUID` to `EFI_GLOBAL_VARIABLE_GUID`. Used for fixing boot options.
* **RequestBootVarRouting**: YES
   * Redirects AptioMemeoryFix from `EFI_GLOBAL_VARIABLE_GUID` to `OC\_VENDOR\_VARIABLE\_GUID`. Needed for when firmware tries to delete boot entries and is recommended to be enabled on all systems for correct update installation, Startup Disk control panel functioning, etc.
* **UnblockFsConnect**: NO
   * Some firmware block partition handles by opening them in By Driver mode, which results in File System protocols being unable to install. Mainly relevant for HP systems when no drives are listed

## Cleaning up

And now you're ready to save and place it into your EFI under EFI/OC.

For those having booting issues, please make sure to read the [Troubleshooting section](../troubleshooting/troubleshooting.md) first and if your questions are still unanswered we have plenty of resources at your disposal:

* [r/Hackintosh Subreddit](https://www.reddit.com/r/hackintosh/)
* [r/Hackintosh Discord](https://discord.gg/2QYd7ZT)

**Sanity check**:

So thanks to the efforts of Ramus, we also have an amazing tool to help verify your config for those who may have missed something:

* [**Sanity Checker**](https://opencore.slowgeek.com)

# Intel BIOS settings

**Disable:**

* Fast Boot
* VT-d(can be enabled if you set `DisableIoMapper` to YES)
* CSM
* Thunderbolt
* Intel SGX
* Intel Platform Trust
* CFG Lock(MSR 0xE2 write protection)(**This must be off, if you can't find the option then enable both `AppleCpuPmCfgLock` and `AppleXcpmCfgLock` under Kernel -> Quirks. Your hack will not boot with CFG-Lock enabled**)

**Enable:**

* VT-x
* Above 4G decoding
* Hyper-Threading
* Execute Disable Bit
* EHCI/XHCI Hand-off
* OS type: Windows 8.1/10 UEFI Mode
* DVMT Pre-Allocated(iGPU Memory): 32MB

# [Post-install](/post-install/README.md)

