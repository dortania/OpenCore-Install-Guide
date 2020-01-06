# Introduction
### About

OpenCore is an open-source unconventional first-in-class piece of software designed to intercept kernel loading to insert a highly advanced rootkit, designed to be an alternative to Clover. OpenCore aims to resolve the constraints and issues imposed by Clover by providing a more versatile and modular system. While OpenCore is primarily designed for Hackintosh systems, it can be used in any scenario where an emulated EFI is needed.

Please remember that OpenCore is still new and currently in beta. Unless you want to be on the bleeding edge of Hackintosh development or are planning on contributing to the project, you probably don't want to migrate if you have a stable system currently. Certain aspects of OpenCore such as Vault support will not be covered in this guide.

Lastly, this guide is only meant to be a starting point in your journey with OpenCore and not recommended for beginners unless absolutely necessary. For those starting, please see the [r/Hackintosh Vanilla Desktop Guide](https://hackintosh.gitbook.io/-r-hackintosh-vanilla-desktop-guide/). And those who have issues can visit both the [r/Hackintosh subreddit](https://www.reddit.com/r/hackintosh/) and [r/Hackintosh discord](https://discord.gg/u8V7N5C) for more help.

### Advantages of OpenCore

* On average, OpenCore systems boot faster than those using Clover.
* OpenCore offers better overall security with better support for FileVault.
* OpenCore supports boot hotkey support via `boot.efi` - hold `Option` or `ESC` at startup to choose a boot device, `Command+R` to enter Recovery or `Command+Option+P+R` to reset NVRAM.
* OpenCore is designed with the future in mind and uses modern methods to load 3rd party kernel extensions without breaking System Integrity Protection which [Clover uses](https://sourceforge.net/p/cloverefiboot/code/HEAD/tree/rEFIt_UEFI/Platform/kext_inject.c#l663)
* BootCamp switching and boot device selection are supported by reading NVRAM variables set by Startup Disk just like a real mac.
* Future development for [AptioMemoryFix](https://github.com/acidanthera/AptioFixPkg) is directly tied to OpenCore, specifically being absorbed into OpenCore itself with the FwRuntimeVariable.efi being used as an extension.
* UEFI and Legacy boot modes are supported.
* Mask patching means macOS updates very little chance of breaking AMD systems, with [AMD OSX patches](https://github.com/AMD-OSX/AMD_Vanilla/tree/opencore) supporting all versions of High Sierra, Mojave and Catalina

### OpenCore Tips

* Kernel extensions are loaded in the order specified in your config file, so you must load an extension's dependencies before you load the extension itself. For example, Lilu must be loaded before WhateverGreen or VirtualSMC.
* ACPI patches and SSDTs are applied to all operating systems. Adjust your SSDTs with `If (_OSI ("Darwin")) {}` or use [rEFind](http://rodsbooks.com/refind/) in conjunction with OpenCore.
* Some systems require pure UEFI mode to boot. (This setting is commonly called "Windows 8/10 WHQL Mode" by motherboard manufacturers. See also on [flashing a UEFI ROM onto older GPUs](https://github.com/acidanthera/WhateverGreen/blob/master/Manual/FAQ.Radeon.en.md))
* Issues can occur if NVMe devices are set up as SATA devices in the BIOS.
* OpenCore requires a version of macOS that supports a prelinked kernel, this means any installs of OS X 10.7 Lion or newer are supported with some later versions of OS X 10.6 Snow Leopard also having support.

### Recommended BIOS settings

**Disable:**
* Fast Boot
* VT-d\(can be enabled if you set DisableIoMapper to YES, AMD users will need to disable SVM in the BIOS\)
* CSM
* Thunderbolt
* Intel SGX
* Intel Platform Trust
* CFG Lock\(MSR 0xE2 write protection\)
   * If this can't be turned off in the BIOS(or even found) please consider patching it out. See [Fixing CFG Lock](post-install/msr-lock.md) for more info.
    * AMD CPU users don't need to worry about.


**Enable:**
* VT-x
* Above 4G decoding
* Hyper-Threading
* Execute Disable Bit
* EHCI/XHCI Hand-off
* OS type: Windows 8.1/10
* Legacy RTC Device(Relevant for Z370+)

## Hey why does this guide look quite similar to CorpNewt's Vanilla Guide?

Well, when I made the [original OpenCore guide](https://github.com/khronokernel/Getting-Started-With-OpenCore) I was quite disappointed in how the whole thing was set up. It felt clunky, confusing and quite easy to get lost in as hardware-specific changes were hard to see. So I took CorpNewt's [r/Hackintosh Vanilla Desktop Guide](https://hackintosh.gitbook.io/-r-hackintosh-vanilla-desktop-guide/) as a base and built it up from there. Full credit to him and also seriously a great guy, definitely check him out on [Github](https://github.com/corpnewt)\(Don't worry I've talked to Corp about all this\).
