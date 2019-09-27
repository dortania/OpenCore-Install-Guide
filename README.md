# Introduction

### About

OpenCore is an open source bootloader, designed to be an alternative to Clover. OpenCore aims to resolve the constraints and issues imposed by Clover by providing a more versatile and modular system. While OpenCore is primarily designed for Hackintosh systems, it can be used in any scenario where an emulated EFI is needed.

Please remember that OpenCore is still new and currently in alpha. Unless you want to be on the bleeding edge of Hackintosh development or are planning on contributing to the project, you probably don't want to migrate if you have a stable system currently. Certain aspects of OpenCore such as FileVault support are still under active development and will not be covered in this guide.

Lastly, this guide is only meant to be a starting point in your journey. Read it carefully and bear in mind that your hardware may have different requirements.

### Advantages of OpenCore

* On average, OpenCore systems boot faster than those using Clover.
* OpenCore offers better  overall security and better support for FileVault.
* OpenCore supports boot hotkey support via `boot.efi` - hold `Option` at startup to choose a boot device, `Command+R` to enter Recovery or `Command+Option+P+R` to reset NVRAM.
* OpenCore is designed with the future in mind, and uses modern methods to inject kernel extensions without breaking System Integrity Protection.
* BootCamp and boot device selection are supported by reading NVRAM variables.
* Development for essential projects such [AptioMemoryFix](https://github.com/acidanthera/AptioFixPkg) is tied to OpenCore, with the eventual goal of being absorbed into OpenCore itself.
* UEFI and Legacy boot modes are supported.

### OpenCore Tips

* Kernel extensions are loaded in the order specified in your config file, so you must load an extension's dependencies before you load the extension itself. For example, Lilu must be loaded before WhateverGreen or VirtualSMC.
* ACPI patches and SSDTs are applied to all operating systems. Adjust your SSDTs with `If (_OSI ("Darwin")) {}` or use [rEFind](http://rodsbooks.com/refind/) in conjunction with OpenCore.
* Some systems require pure UEFI mode to boot. (This setting is commonly called "Windows 8/10 Mode" by motherboard manufacturers.)
* Issues can occur if NVMe devices are set up as SATA devices in the BIOS.

## Hey why does this guide look quite similar to CorpNewt's Vanilla Guide?

Well, when I made the [original OpenCore guide](https://github.com/khronokernel/Getting-Started-With-OpenCore) I was quite disappointed in how the whole thing was set up. It felt clunky, confusing and quite easy to get lost in as hardware-specific changes were hard to see. So I took CorpNewt's [r/Hackintosh Vanilla Desktop Guide](https://hackintosh.gitbook.io/-r-hackintosh-vanilla-desktop-guide/) as a base and built it up from there. Full credit to him and also seriously a great guy, definitely check him out on [Github](https://github.com/corpnewt)\(Don't worry I've talked to Corp about all this\).


## Table of contents

* OpenCore Vanilla Desktop guide

   * [Introduction](README.md)
   * [Creating the USB](creating-the-usb.md)
   * [Gathering files](kext.md)

* Intel Config.plist <a id="config.plist"></a>

   * [Ivy Bridge](config.plist/ivy-bridge.md)
   * [Haswell](config.plist/haswell.md)
   * [Skylake](config.plist/skylake.md)
   * [Kaby Lake](config.plist/kaby-lake.md)
   * [Coffee Lake](config.plist/coffee-lake.md)

* AMD Config.plist

   * [Zen/ThreadRipper](AMD-config.md)

* Post Install

   * [Emulated NVRAM](post-install/nvram.md)
   * [GPU Spoof](post-install/spoof.md)
   * [Security](post-install/security.md)

* Extras

   * [Legacy Install](extras/legacy.md)
   * [Hiding Verbose](extras/verbose.md)
   * [Troubleshooting](extras/troubleshooting.md)

* Misc

   * [Credit](misc/credit.md)
