# macOS 26: Tahoe

## Table of Contents

[[toc]]

## Prerequisites

### Dropped CPU Support

**Work in Progress**, if you know please help with [Pull Requests](https://github.com/dortania/OpenCore-Multiboot/pulls)

### Supported SMBIOS

SMBIOS dropped in Tahoe:

* iMac19,x
* MacBookAir9,1
* iMacPro1,1
* Macmini8,1
* MacBookPro15,x
* MacBookPro16,3

If your SMBIOS was supported in Sequoia and is not included above, you're good to go!

::: details Supported SMBIOS

* iMac20,x
* MacBookPro16,x (but MacBookPro16,3)
* MacPro7,1

[Click here](./smbios-support.md) for a full list of supported SMBIOS.

:::

For those on architectures no longer supported by Tahoe:

**Work in Progress**, if you know please help with [Pull Requests](https://github.com/dortania/OpenCore-Multiboot/pulls)

### Supported hardware

**Work in Progress**, if you know please help with [Pull Requests](https://github.com/dortania/OpenCore-Multiboot/pulls)

### AMD Patches

**Work in Progress**, if you know please help with [Pull Requests](https://github.com/dortania/OpenCore-Multiboot/pulls)

## Update from Sequoia

You'll have to be using OpenCore version 1.0.5+ (at least commit 164696d). If you are updating, make sure OpenCore 1.0.4 works.
Make sure:
* Before-hand, enable [FileVault](https://dortania.github.io/OpenCore-Post-Install/universal/security/filevault.html) as install appears to enable it.
* Update all of your kexts.
* Add `-lilubetaall` to your boot-args.
* Disable Jumpstart and add `apfs_aligned.efi` from OcBinaryData.

### Troubeshooting boot errors:
* Stuck in early boot (Waiting for DSMOS): Use the updated OC build; otherwise, you will see an injection error with VirtualSMC in the logs.
* AMDSupport panic: disable WhateverGreen.
* IntelBTPatcher panic: disable Bluetooth kexts.
* AppleEthernetRL panic: Apple now ships a RTL8125 kext, it causes issues for some users. Change IOProbeScore in LucyRTL8125's Info.plist to 5000.
* Stuck on prohibited sign:
  * All USB maps are broken. If you are using:
     * UTBMap.kext: Use [USBToolBox test build](https://github.com/USBToolBox/kext/releases/tag/1.2.0).
     * USBMap.kext: Use USBMapinjectorEdit from the latest USBMap.

## Audio Support

Tahoe remove AppleHDA.kext, as in the supported SMBIOS, the T2 chip manages the audio. So, as it "isn't necesarry", Apple removed it in Tahoe Beta 2. But let's be real: We can't emulate a dedicated ARM chip. That's why AppleALC won't work.

### Solutions

* Use AppleALCU
  * Note that it only supports digital audio
* Use VoodooHDA
  * Also note that it sounds bad and it doesn't support system integration.
* You can try patching AppleHDA back but it's not reccomended and you're on your own.

## The end of a long era

Apple has announced in the [WWDC25](https://www.youtube.com/live/51iONeETSng?t=3278s) that Tahoe will be the last macOS version to support Intel Macs. This marks the end of Hackintosh as we know it.

~~YEAAAAAAAAAAAAA FINALLY THIS TORTURE ENDED WE ARE FREEEEEE~~ Since macOS Tiger, when Intel Macs were introduced, this project has been making PCs run macOS. This is the end of all of it. From now on, all macOS's will be ARM only.
