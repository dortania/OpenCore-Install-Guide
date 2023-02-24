# macOS 13: Ventura

## Table of Contents

[[toc]]

## Prerequisites

### Dropped CPU Support

macOS Ventura drops support for pre-Haswell CPUs. Much of userspace now requires AVX2 support, along with AMD Polaris GPU drivers and some instances of AVX2 instructions in some kexts. Although the kexts can be [patched](https://forums.macrumors.com/threads/monterand-probably-the-start-of-an-ongoing-saga.2320479/post-31125212) or [downgraded](https://github.com/dortania/OpenCore-Legacy-Patcher/blob/92ff4244ae78de715977d9f8d054cdf9bdce4011/payloads/Kexts/Misc/NoAVXFSCompressionTypeZlib-AVXpel-v12.6.zip), the Polaris GPU drivers and most of userspace rely on AVX2 too much to be able to be patched.

Apple has left a dyld cache that does not use AVX2 instructions in Ventura to support Rosetta on Apple Silicon machines, but this cache is not installed by default. You can use [CryptexFixup](https://github.com/acidanthera/CryptexFixup) to force this dyld cache to be installed, but:

* Apple may remove this cache at any time in the future if they add AVX2 support to Rosetta
* Delta updates (small 1-3GB updates) will no longer be available and you must install the full update (12GB), as delta updates only contain the non-AVX2 cache on Apple Silicon machines
* Polaris GPUs remain unsupported on machines without AVX2

Because of these caveats, Dortania will no longer be supporting pre-Haswell CPUs for Ventura and above. The pages for these CPUs will remain updated for Monterey.

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

For those on architectures no longer supported by Ventura:

* All desktops with dGPUs should use iMac18,2, MacPro7,1 or iMacPro1,1. Unsupported GPUs still require OCLP, while supported GPUs do not.
* All desktops with unsupported iGPUs should use iMac18,1.
* All unsupported laptops (Haswell, Broadwell, Skylake) should use MacBookPro14,1.

### Supported hardware

Dropped GPU Hardware:

* Haswell (HD 4200/4400/4600/5000/P4600/P4700, Iris 5100, Iris Pro 5200)
* Broadwell (HD 5300/5500/5600/6000/P5700, Iris 6100, Iris Pro 6200/P6300)
* Skylake (HD 5xx/P5xx, Iris 5xx, Iris Pro 5xx/P5xx)
  * Skylake can be spoofed as Kaby Lake with WhateverGreen v1.6.1 and up
  * Change your `device-id` and `AAPL,ig-platform-id` to the most similar Kaby Lake model
  * If using the same EFI to boot Monterey and below, add `-igfxsklaskbl` to your boot args

* You can use [OpenCore-Legacy-Patcher](https://github.com/dortania/OpenCore-Legacy-Patcher/) to add back support
  * No support is provided for Hackintoshes using OCLP!
  * You will lose access to non-full updates (Small 1-3GB updates)
  * Requires SIP, Apple Secure Boot, and AMFI disabled.

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
