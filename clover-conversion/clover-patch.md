# Converting common Kernel and Kext patches

## Manually converting a patch

When converting a kernel/kext patch into one for OpenCore, you'll need to remember a few things

* `InfoPlistPatch` has no feature parity
* `MatchOS` is replaced with `MinKernel` and `MaxKernel`
* Both kernel and kext patches go under `Kernel -> Patch`, and you use `Identifier` to say whether it's the kernel or a specific kext you want to patch

Now lets look at this example:

**KernelToPatch**:

| Key | Type | Value |
| :--- | :--- | :--- |
| Comment | String | cpuid_set_cpufamily - force CPUFAMILY_INTEL_PENRYN |
| Disabled | Boolean | False |
| MatchBuild | String | 18G95,18G103 |
| MatchOS | String | 10.14.6 |
| Find | Data | 31db803d4869980006755c |
| Replace | Data | bbbc4fea78e95d00000090 |

So to convert this patch, see below:

* `Comment`: Available both on Clover and OpenCore
* `Disabled`: OpenCore uses `Enabled` instead
* `MatchBuild`: OpenCore uses `MinKernel` and `MaxKernel`, see below for more info
* `MatchOS`: OpenCore uses `MinKernel` and `MaxKernel`, see below for more info
* `Find`: Available both on Clover and OpenCore
* `Replace`: Available both on Clover and OpenCore
* `MaskFind`: OpenCore uses `Mask` instead
* `MaskReplace`: Available both on Clover and OpenCore

So the above patch would become:

**Kernel -> Patch**:

| Key | Type | Value |
| :--- | :--- | :--- |
| Comment | String | cpuid_set_cpufamily - force CPUFAMILY_INTEL_PENRYN |
| Enabled | Boolean | True |
| MinKernel | String | 18.7.0 |
| MaxKernel | String | 18.7.0 |
| Find | Data | 31db803d4869980006755c |
| Replace | Data | bbbc4fea78e95d00000090 |
| Identifier | String | kernel |
| Limit | Number | 0 |
| Count | Number | 0 |
| Skip | Number | 0 |
| Mask | Data | |
| ReplaceMask | Data | |

For Min and MaxKernel, we can use the below as for info, so 18G95 has the kernel version `18.7.0` and 18G103 has `18.7.0`(both being the same kernel):

* [macOS Mojave: Release history](https://en.wikipedia.org/wiki/MacOS_Mojave#Release_history)

For Identifier, you'll either define `kernel` or the kext you want to patch(ie. `com.apple.iokit.IOGraphicsFamily` )

Regarding Limit, Count and Skip, they are set to `0` so they apply to all instances. `Mask` and `ReplaceMask` can be left as blank as Clover doesn't support masking(until very recently but won't be covered here).

## Common patches in OpenCore and co

Little section mentioning common Kernel and Kexts patches that have been absorbed into OpenCore or other kexts. This list is not complete so any that may have been forgotten can be mentioned by opening a new [issue](https://github.com/khronokernel/OpenCore-Vanilla-Desktop-Guide/issues). Any help is much appreciated

### Kernel Patches

For a full list of patches OpenCore supports, see [/Library/OcAppleKernelLib/CommonPatches.c](https://github.com/acidanthera/OpenCorePkg/blob/master/Library/OcAppleKernelLib/CommonPatches.c)

**General Patches**:

* `MSR 0xE2 _xcpm_idle instant reboot` (c) Pike R. Alpha
  * `Kernel -> Quirks -> AppleXcpmCfgLock`

**HEDT Specific Patches**:

All of the following patches are inside the `Kernel -> Quirk -> AppleXcpmExtraMsrs`

* `_xcpm_bootstrap` © Pike R. Alpha
* `xcpm_pkg_scope_msrs` © Pike R. Alpha
* `_xcpm_SMT_scope_msrs` 1 © Pike R. Alpha
* `_xcpm_SMT_scope_msrs` #2 (c) Pike R. Alpha
* `_xcpm_core_scope_msrs` © Pike R. Alpha
* `_xcpm_ performance_patch` © Pike R. Alpha
* xcpm MSR Patch 1 and 2 @Pike R. Alpha
* `/0x82D390/MSR_PP0_POLICY 0x63a xcpm support` patch 1 and 2 Pike R. Alpha

### Kext Patches

* `Disable Panic Kext logging`
  * `Kernel -> Quirks -> PanicNoKextDump`
* AppleAHCIPort External Icon Patch1
  * `Kernel -> Quirks -> ExternalDiskIcons`
* SSD Trim Enabler
  * `Kernel -> Quirks -> ThirdPartyDrives`
* USB Port Limit Patches
  * `Kernel -> Quirks -> XhciPortLimit`
* FredWst DP/HDMI patch
  * [AppleALC](https://github.com/acidanthera/AppleALC/releases) + [WhateverGreen](https://github.com/acidanthera/whatevergreen/releases)
* IOPCIFamily Patch
  * `Kernel -> Quirks -> IncreasePciBarSize`
* Disable board-ID check
  * [WhateverGreen](https://github.com/acidanthera/whatevergreen/releases)
* AppleHDA Patch
  * [AppleALC](https://github.com/acidanthera/AppleALC/releases)
* IONVMe Patches
  * Not required anymore on High Sierra and newer
  * For power management on Mojave and newer: [NVMeFix](https://github.com/acidanthera/NVMeFix/releases)
