# Introduction

* Supported version: 0.5.9

## About

OpenCore is an open-sourced tool designed to prepare a system for macOS booting and has been architected to alleviate many of the constraints imposed by its alternatives like Clover(these tools are sometimes referred to as "boot loaders"). The main thing OpenCore aims to do is create a more versatile and modular system which can better understand symbols and structures to make patching far more precise and effective. And with its custom prelinker, kext injection becomes macOS version agnostic meaning day 1 support on any macOS version supporting a prelinked kernel. While OpenCore is primarily designed for Hackintosh systems, it can be used in any scenario where an emulated EFI is needed with many using it on KVMs and even [real Macs](https://forums.macrumors.com/threads/opencore-on-the-mac-pro.2207814/)

Please remember that OpenCore is still new and currently in beta. While quite stable, and arguably much more stable than Clover in pretty much every way, is still being frequently updated and so chunks of configuration change quite often(ie. New quirks replacing old ones)

Lastly, this guide is only meant to be a starting point in your journey with OpenCore and not recommended for beginners unless absolutely necessary. For those who have issues can visit both the [r/Hackintosh subreddit](https://www.reddit.com/r/hackintosh/) and [r/Hackintosh discord](https://discord.gg/u8V7N5C) for more help.

## Getting Started

Before we can get into the meat of this guide and setting up OpenCore, we first gotta make sure your hardware can actually run macOS:

* [GPU Buyers Guide](https://dortania.github.io/GPU-Buyers-Guide/)
  * Check if your GPU is supported and which macOS version you can run.
* [Wireless Buyers Guide](https://dortania.github.io/Wireless-Buyers-Guide/)
  * Check if your WiFi card is supported.
* [Anti-Hardware Buyers Guide](https://dortania.github.io/Anti-Hackintosh-Buyers-Guide/)
  * Overall guide on what to avoid and what pitfalls your hardware may hit.

And once you know you're hardware's compatible, we can jump into the guides:

* [OpenCore Desktop Guide](https://dortania.github.io/OpenCore-Desktop-Guide/)
  * Desktop focused and the one you're reading right now
* [OpenCore Laptop guide](https://dortania.github.io/vanilla-laptop-guide/)
  * Laptop focused

## OpenCore Tips

* Kernel extensions are loaded in the order specified in your config file, so you must load an extension's dependencies before you load the extension itself. For example, Lilu must be loaded before WhateverGreen or VirtualSMC.
* SMBIOS data, ACPI patches and DSDT/SSDTs are applied to all operating systems. Adjust your SSDTs with `If (_OSI ("Darwin")) {}`
  * Note that all SSDTs mentioned in this guide have been updated accordingly and should not affect booting
* Some systems require pure UEFI mode to boot. (This setting is commonly called "Windows 8.1/10 UEFI Mode" by motherboard manufacturers. See also on [flashing a UEFI ROM onto older GPUs](https://github.com/acidanthera/WhateverGreen/blob/master/Manual/FAQ.Radeon.en.md))
* OpenCore requires a version of macOS that supports a prelinked kernel, this means any installs of OS X 10.7 Lion or newer are supported.
* Those having issues converting can refer to the [Clover Conversion](https://github.com/dortania/OpenCore-Desktop-Guide/tree/master/clover-conversion) page
