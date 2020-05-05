# Converting common Kernel and Kext patches

Little section mentioning common Kernel and Kexts patches that have been absorbed into OpenCore or other kexts. This list is not complete so any that may have been forgotten can be mentioned by opening a new [issue](https://github.com/khronokernel/OpenCore-Vanilla-Desktop-Guide/issues). Any help is much appreciated

## Kernel Patches

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

## Kext Patches

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
