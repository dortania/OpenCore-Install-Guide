# macOS 13: Ventura

**Reminder that Dortania and any tools mentioned in this guide are neither responsible for any corruption, data loss, or other ill effects that may arise from this guide, including ones caused by typos. You, the end user, must understand this is beta software on unsupported machines so do not pester developers for fixes. Dortania will not be accepting issues regarding this mini-guide except for typos and/or errors.**

**This guide expects you to have a basic understanding of hackintoshing. If you are not familiar with it, we highly recommend you to wait until there is an easier and more straight-forward solution available.**

## Table of Contents

[[toc]]

## Prerequisites

### Supported SMBIOS

SMBIOS dropped in Ventura:

* iMac17,x and older
* Macmini7,1 and older
* MacBook9,1 and older
* MacBookAir7,x and older
* MacBookPro13,x and older
* MacPro6,1 and older

If your SMBIOS was supported in Monterey and is not included above, you're good to go!

::: details Supported SMBIOS

* iMac18,x and newer
* MacPro7,1 and newer
* iMacPro1,1 and newer
* Macmini8,1
* MacBook10,1
* MacBookAir8,1 and newer
* MacBookPro14,x and newer

[Click here](./smbios-support.md) for a full list of supported SMBIOS.

:::

For those on Haswell or Ivy Bridge, here are some simple conversions:

* Ivy Bridge desktops with dGPU should use MacPro6,1
* Haswell desktops with dGPU should use iMac17,1
* Haswell desktops with only an iGPU should use iMac16,2
* Haswell laptops should use MacBookPro11,4 or MacBookPro11,5

### Supported hardware

Dropped GPU Hardware:

* Haswell (HD 4200/4400/4600/5000/P4600/P4700, Iris 5100, Iris Pro 5200)
* Broadwell (HD 5300/5500/5600/6000/P5700, Iris 6100, Iris Pro 6200/P6300)
* Skylake (HD 5xx/P5xx, Iris 5xx, Iris Pro 5xx/P5xx)
  * Skylake can be spoofed as Kaby Lake with WhateverGreen v1.6.1 and up
  * Change your `device-id` and `AAPL,ig-platform-id` to the most similar Kaby Lake model
  * If using the same EFI to boot Monterey and below, add `-igfxsklaskbl` to your boot args
<!--

OCLP is not supported yet

* You can use [OpenCore-Legacy-Patcher](https://github.com/dortania/OpenCore-Legacy-Patcher/) to add back support
  * No support is provided for Hackintoshes using OCLP!
  * You will lose access to non-full updates (Small 1-3GB updates)
  * Requires SIP, Apple Secure Boot, and AMFI disabled.
-->

### AMD Patches

For those on AMD CPUs, make sure to update your [kernel patches](https://github.com/AMD-OSX/AMD_Vanilla) for Ventura.
Don't forget to update your patches as well with the core count of your CPU.
The patches which need to be edited are all named `algrey - Force cpuid_cores_per_package`, and you only need to change the `Replace` value. You should change:

* `B8000000 0000` => `B8 <core count> 0000 0000`
* `BA000000 0000` => `BA <core count> 0000 0000`
* `BA000000 0090` => `BA <core count> 0000 0090`

Where `<core count>` is replaced with the physical core count of your CPU in hexadecimal. For example, an 8-Core 5800X would have the new Replace value be:

* `B8 08 0000 0000`
* `BA 08 0000 0000`
* `BA 08 0000 0090`

::: details Core Count => Hexadecimal Table

| Core Count | Hexadecimal |
| :--------- | :---------- |
| 4 Core | `04` |
| 6 Core | `06` |
| 8 Core | `08` |
| 12 Core | `0C` |
| 16 Core | `10` |
| 24 Core | `18` |
| 32 Core | `20` |
| 64 Core | `40` |

:::
