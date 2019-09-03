# Introduction

### What is OpenCore?

OpenCore is an alternative to Clover. By design, OpenCore is versatile by being more modular and open as it aims to resolve the constraints and issues that Clover brings. It is not only for Hackintoshes as it can be used for other purposes that require an emulated EFI. Please remember we’re still in very early infancy so there will be issues. This specific guide will be omitting Vault.plist and Vault.sig as there's still quite a bit of development happening there. OpenCore should be considered in Alpha stage at this time. If you have a working, stable system you should not migrate unless you prefer "bleeding edge" development, want to contribute, and don't mind recovering your system should it fail to boot.

And please keep in mind that this guide is more of a jumping-off point, your hardware may have different requirements so please read the guide carefully.


### Benefits of OpenCore over Clover

* Much faster booting.
* Better overall security and better support for FileVault.
* Support holding Option for BootPicker, Command+R for Recovery and Command+P+R for NVRAM reset
* Much better future-proofing as OpenCore doesn't rely on heavily deprecated methods for kext injection like Clover does
* Automatic drive/partition boot is handled by StartUp Disk just like a real Mac, including BootCamp support. This feature is also referred to as "bless" and is determined by reading NVRAM variables set by Startup Disk.
* All future development for [AptioMemoryFix](https://github.com/acidanthera/AptioFixPkg) is tied to OpenCore, specifically being absorbed into OpenCore itself with the FwRuntimeVariable.efi being used as an extension.
* OpenCore supports both UEFI and Legacy boot options.


### Things to note with OpenCore

* Order of kexts matter: Make sure to have kexts like Lilu and VoodooPS2Controller are to be injected first before kexts that require them like WhateverGreen, VirtualSMC, keyboard/Mouse/Trackpad, etc.
* ACPI patches and SSDTs apply to all operating systems, please adjust your SSDTs accordingly with `If (_OSI ("Darwin")) {}` or use [rEFind](http://www.rodsbooks.com/refind/) in conjunction with OpenCore.
* Some systems like Z97 require pure UEFI mode for booting \(also known as Windows 8/10 mode\).
* NVMe issues if setup as a SATA device in BIOS.
* AptioMemoryFix has been split between OpenCore and FwRuntimeServices.efi, please use that instead.

## Hey why does this guide look quite similar to CorpNewt's Vanilla Guide?

Well, when I made the [original OpenCore guide](https://github.com/khronokernel/Getting-Started-With-OpenCore) I was quite disappointed in how the whole thing was set up. It felt clunky, confusing and quite easy to get lost in as hardware-specific changes were hard to see. So I took CorpNewt's [r/Hackintosh Vanilla Desktop Guide](https://hackintosh.gitbook.io/-r-hackintosh-vanilla-desktop-guide/) as a base and built it up from there. Full credit to him and also seriously a great guy, definitely check him out on [Github](https://github.com/corpnewt)\(Don't worry I've talked to Corp about all this\).


## Table of contents

* OpenCore Vanilla Desktop guide

   * [Introduction](README.md)
   * [Creating the USB](creating-the-usb.md)

* Intel Config.plist <a id="config.plist"></a>

   * [Ivy Bridge](config.plist/ivy-bridge.md)
   * [Haswell](config.plist/haswell.md)
   * [Skylake](config.plist/skylake.md)
   * [Kaby Lake](config.plist/kaby-lake.md)
   * [Coffee Lake](config.plist/coffee-lake.md)

* AMD Config.plist

   * [AMD CPU](AMD-config.md)

* Post Install

   * [Emulated NVRAM](post-install/nvram.md)
   * [GPU Spoof](post-install/spoof.md)
   * [Security](post-install/security.md)

* Extras

   * [Legacy Install](extras/legacy.md)
   * [Hiding Verbose](extras/verbose.md)

* Misc

   * [Credit](misc/credit.md)
