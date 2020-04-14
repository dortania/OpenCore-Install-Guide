# Introduction

* Supported version: 0.5.7

### About

OpenCore is an open-source unconventional first-in-class piece of software designed to intercept kernel loading to insert a highly advanced rootkit, designed to be an alternative to Clover. OpenCore aims to resolve the constraints and issues imposed by Clover by providing a more versatile and modular system. While OpenCore is primarily designed for Hackintosh systems, it can be used in any scenario where an emulated EFI is needed with many using it on KVMs and [real Macs](https://forums.macrumors.com/threads/opencore-on-the-mac-pro.2207814/)

Please remember that OpenCore is still new and currently in beta. While quite stable, and arguably much more stable than Clover in pretty much every way, is still being frequently updated and so chunks configuration change quite often(ie. New quirks replacing old ones)

Lastly, this guide is only meant to be a starting point in your journey with OpenCore and not recommended for beginners unless absolutely necessary. For those starting, please see the [r/Hackintosh Vanilla Desktop Guide](https://hackintosh.gitbook.io/-r-hackintosh-vanilla-desktop-guide/). And those who have issues can visit both the [r/Hackintosh subreddit](https://www.reddit.com/r/hackintosh/) and [r/Hackintosh discord](https://discord.gg/u8V7N5C) for more help.

**This guide supports 0.5.7**, newer versions will require you to read the [Differences.pdf](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/Differences/Differences.pdf). Guide will be updated soon after each [OpenCore release](https://github.com/acidanthera/OpenCorePkg/releases)

### Advantages of OpenCore

* On average, OpenCore systems boot faster than those using Clover as less unnecessary patching is done
* Better overall stability as patches can be much more precise : [macOS 10.15.4 update](https://www.reddit.com/r/hackintosh/comments/fo9bfv/macos_10154_update/) as an example
* OpenCore offers better overall security with better support for FileVault, no need to disable System Integrity Protection(SIP) and even secure boot-like functionality support via [Vaulting](/post-install/security.md#Vault)
* OpenCore supports boot hotkey support via `boot.efi` - hold `Option` or `ESC` at startup to choose a boot device, `Cmd+R` to enter Recovery or `Cmd+Opt+P+R` to reset NVRAM.
* OpenCore is designed with the future in mind and uses modern methods to load 3rd party kernel extensions without breaking System Integrity Protection which [Clover uses](https://github.com/CloverHackyColor/CloverBootloader/blob/ea3058f86787149a5b159872cda362c1cbb1fc6c/rEFIt_UEFI/Platform/kext_inject.cpp#L990-L1015)
* BootCamp switching and boot device selection are supported by reading NVRAM variables set by Startup Disk just like a real mac.
* Future development for [AptioMemoryFix](https://github.com/acidanthera/AptioFixPkg) is directly tied to OpenCore, specifically being absorbed into OpenCore itself with the OpenRuntime.efi being used as an extension.
* UEFI and Legacy boot modes are supported
* More sophisticated patching such as mask patching means macOS updates have very little chance of breaking AMD systems, with [AMD OSX patches](https://github.com/AMD-OSX/AMD_Vanilla/tree/opencore) supporting all versions of High Sierra, Mojave and Catalina. **All future AMD OSX development is tied to Opencore**, so for 10.15.2+ you'll need OpenCore

### OpenCore Tips

* Kernel extensions are loaded in the order specified in your config file, so you must load an extension's dependencies before you load the extension itself. For example, Lilu must be loaded before WhateverGreen or VirtualSMC.
* SMBIOS data, ACPI patches and DSDT/SSDTs are applied to all operating systems. Adjust your SSDTs with `If (_OSI ("Darwin")) {}`
   * Note that all SSDTs mentioned in this guide have been updated accordingly and should not affect booting
* Some systems require pure UEFI mode to boot. \(This setting is commonly called "Windows 8.1/10 UEFI Mode" by motherboard manufacturers. See also on [flashing a UEFI ROM onto older GPUs](https://github.com/acidanthera/WhateverGreen/blob/master/Manual/FAQ.Radeon.en.md)\)
* Issues can occur if NVMe devices are set up as SATA devices in the BIOS.
* OpenCore requires a version of macOS that supports a prelinked kernel, this means any installs of OS X 10.7 Lion or newer are supported with some later versions of OS X 10.6 Snow Leopard also having support.
* Those having issues converting can refer to the [Clover Conversion](https://github.com/dortania/OpenCore-Desktop-Guide/tree/master/clover-conversion) page

### Recommended BIOS settings

**Disable:**

* Fast Boot
* VT-d (can be enabled if you set DisableIoMapper to YES)
* CSM
* Thunderbolt
* Intel SGX
* Intel Platform Trust
* CFG Lock (MSR 0xE2 write protection)
  * If this can't be turned off in the BIOS(or even found) please consider patching it out. See [Fixing CFG Lock](extras/msr-lock.md) for more info.
    * AMD CPU users don't need to worry about.

**Enable:**

* VT-X
* Above 4G decoding
* Hyper-Threading
* Execute Disable Bit
* EHCI/XHCI Hand-off
* OS type: Windows 8.1/10 UEFI Mode

