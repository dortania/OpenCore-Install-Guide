# Booter

This section allows the application of different types of UEFI modifications to operating system bootloaders, primarily the Apple bootloader (boot.efi). The modifications currently provide various patches and environment alterations for different firmware types. Some of these features were originally implemented as part of [AptioMemoryFix.efi](https://github.com/acidanthera/AptioFixPkg), which is no longer maintained

Booter changes apply with the following effective order:

* `Quirks` are processed.
* `Patch` is processed.

Please note that most of the time, `MmioWhitelist`, which is allowing spaces to be passthrough to macOS that are generally ignored, useful when paired with `DevirtualiseMmio`. For more info read [here](https://dortania.github.io/OpenCore-Install-Guide/extras/kaslr-fix.html#using-devirtualisemmio)

## Desktop

### Intel Desktop

#### Penryn

| Legacy | UEFI
| :--- | :--- |
| ![](../images/config/config-legacy/booter-duetpkg.png) | ![](../images/config/config-universal/aptio-iv-booter-sl.png) |

##### Quirks

::: tip Info
Settings relating to boot.efi patching and firmware fixes, depending where your board has UEFI, you have 2 options depending what your motherboard supports:

##### Legacy Settings

| Quirk | Enabled | Comment |
| :--- | :--- | :--- |
| AvoidRuntimeDefrag | No | Big Sur may require this quirk enabled |
| EnableSafeModeSlide | No | |
| EnableWriteUnprotector | No | |
| ProvideCustomSlide | No | |
| RebuildAppleMemoryMap | Yes | This is required to boot OS X 10.4 through 10.6 |
| SetupVirtualMap | No | |

##### UEFI Settings

| Quirk | Enabled | Comment |
| :--- | :--- | :--- |
| RebuildAppleMemoryMap | Yes | This is required to boot OS X 10.4 through 10.6 |

:::
::: details More in-depth Info

* **AvoidRuntimeDefrag**: NO
  * Fixes UEFI runtime services like date, time, NVRAM, power control;
  * macOS Big Sur however requires the APIC table present, otherwise causing early kernel panics so this quirk is recommended for those users.
* **EnableSafeModeSlide**: YES
  * Enables slide variables to be used in safe mode.
* **EnableWriteUnprotector**: NO
  * Needed to remove write protection from CR0 register on UEFI platforms.
* **ProvideCustomSlide**: YES
  * Used for Slide variable calculation. However the necessity of this quirk is determined by `OCABC: Only N/256 slide values are usable!` message in the debug log. If the message `OCABC: All slides are usable! You can disable ProvideCustomSlide!` is present in your log, you can disable `ProvideCustomSlide`.
* **RebuildAppleMemoryMap**: YES
  * Resolves early memory kernel panics on 10.6 and below.
* **SetupVirtualMap**: YES
  * Fixes SetVirtualAddresses calls to virtual addresses on UEFI boards.

:::

#### Clarkdale

| Legacy | UEFI
| :--- | :--- |
| ![](../images/config/config-legacy/booter-duetpkg.png) | ![](../images/config/config-universal/aptio-iv-booter-sl.png) |

##### Quirks

::: tip Info
Settings relating to boot.efi patching and firmware fixes, depending where your board has UEFI, you have 2 options depending what your motherboard supports:

#### Legacy Settings

| Quirk | Enabled | Comment |
| :--- | :--- | :--- |
| AvoidRuntimeDefrag | No | Big Sur may require this quirk enabled |
| EnableSafeModeSlide | No | |
| EnableWriteUnprotector | No | |
| ProvideCustomSlide | No | |
| RebuildAppleMemoryMap | Yes | This is required to boot OS X 10.4 through 10.6 |
| SetupVirtualMap | No | |

#### UEFI Settings

| Quirk | Enabled | Comment |
| :--- | :--- | :--- |
| RebuildAppleMemoryMap | Yes | This is required to boot OS X 10.4 through 10.6 |

:::
::: details More in-depth Info

* **AvoidRuntimeDefrag**: NO
  * Fixes UEFI runtime services like date, time, NVRAM, power control;
  * macOS Big Sur however requires the APIC table present, otherwise causing early kernel panics so this quirk is recommended for those users.
* **EnableSafeModeSlide**: YES
  * Enables slide variables to be used in safe mode.
* **EnableWriteUnprotector**: NO
  * Needed to remove write protection from CR0 register.
* **ProvideCustomSlide**: YES
  * Used for Slide variable calculation. However the necessity of this quirk is determined by `OCABC: Only N/256 slide values are usable!` message in the debug log. If the message `OCABC: All slides are usable! You can disable ProvideCustomSlide!` is present in your log, you can disable `ProvideCustomSlide`.
* **RebuildAppleMemoryMap**: YES
  * Resolves early memory kernel panics on 10.6 and below.
* **SetupVirtualMap**: YES
  * Fixes SetVirtualAddresses calls to virtual addresses.

:::
#### Sandy Bridge

![Booter](../images/config/config-universal/aptio-iv-booter.png)

##### Quirks

::: tip Info
Settings relating to boot.efi patching and firmware fixes, for us, we leave it as default
:::
::: details More in-depth Info

* **AvoidRuntimeDefrag**: YES
  * Fixes UEFI runtime services like date, time, NVRAM, power control, etc.
* **EnableSafeModeSlide**: YES
  * Enables slide variables to be used in safe mode, however this quirk is only applicable to UEFI platforms.
* **EnableWriteUnprotector**: YES
  * Needed to remove write protection from CR0 register.
* **ProvideCustomSlide**: YES
  * Used for Slide variable calculation. However the necessity of this quirk is determined by `OCABC: Only N/256 slide values are usable!` message in the debug log. If the message `OCABC: All slides are usable! You can disable ProvideCustomSlide!` is present in your log, you can disable `ProvideCustomSlide`.
* **SetupVirtualMap**: YES
  * Fixes SetVirtualAddresses calls to virtual addresses, required for Gigabyte boards to resolve early kernel panics

:::
#### Ivy Bridge

![Booter](../images/config/config-universal/aptio-iv-booter.png)

::: tip Info
Settings relating to boot.efi patching and firmware fixes, for us, we leave it as default
:::
::: details More in-depth Info

* **AvoidRuntimeDefrag**: YES
  * Fixes UEFI runtime services like date, time, NVRAM, power control, etc.
* **EnableSafeModeSlide**: YES
  * Enables slide variables to be used in safe mode, however this quirk is only applicable to UEFI platforms.
* **EnableWriteUnprotector**: YES
  * Needed to remove write protection from CR0 register.
* **ProvideCustomSlide**: YES
  * Used for Slide variable calculation. However the necessity of this quirk is determined by `OCABC: Only N/256 slide values are usable!` message in the debug log. If the message `OCABC: All slides are usable! You can disable ProvideCustomSlide!` is present in your log, you can disable `ProvideCustomSlide`.
* **SetupVirtualMap**: YES
  * Fixes SetVirtualAddresses calls to virtual addresses, required for Gigabyte boards to resolve early kernel panics.

:::
#### Haswell

![Booter](../images/config/config-universal/aptio-iv-booter.png)

##### Quirks

::: tip Info
Settings relating to boot.efi patching and firmware fixes, for us, we leave it as default
:::
::: details More in-depth Info

* **AvoidRuntimeDefrag**: YES
  * Fixes UEFI runtime services like date, time, NVRAM, power control, etc.
* **EnableSafeModeSlide**: YES
  * Enables slide variables to be used in safe mode, however this quirk is only applicable to UEFI platforms.
* **EnableWriteUnprotector**: YES
  * Needed to remove write protection from CR0 register.
* **ProvideCustomSlide**: YES
  * Used for Slide variable calculation. However the necessity of this quirk is determined by `OCABC: Only N/256 slide values are usable!` message in the debug log. If the message `OCABC: All slides are usable! You can disable ProvideCustomSlide!` is present in your log, you can disable `ProvideCustomSlide`.
* **SetupVirtualMap**: YES
  * Fixes SetVirtualAddresses calls to virtual addresses, required for Gigabyte boards to resolve early kernel panics.

:::
#### Skylake

![Booter](../images/config/config-universal/aptio-iv-booter.png)

##### Quirks

::: tip Info
Settings relating to boot.efi patching and firmware fixes, for us, we leave it as default
:::
::: details More in-depth Info

* **AvoidRuntimeDefrag**: YES
  * Fixes UEFI runtime services like date, time, NVRAM, power control, etc.
* **EnableSafeModeSlide**: YES
  * Enables slide variables to be used in safe mode.
* **EnableWriteUnprotector**: YES
  * Needed to remove write protection from CR0 register.
* **ProvideCustomSlide**: YES
  * Used for Slide variable calculation. However the necessity of this quirk is determined by `OCABC: Only N/256 slide values are usable!` message in the debug log. If the message `OCABC: All slides are usable! You can disable ProvideCustomSlide!` is present in your log, you can disable `ProvideCustomSlide`.
* **SetupVirtualMap**: YES
  * Fixes SetVirtualAddresses calls to virtual addresses, required for Gigabyte boards to resolve early kernel panics.

:::
#### Kaby Lake

![Booter](../images/config/config-universal/aptio-iv-booter.png)

##### Quirks

::: tip Info
Settings relating to boot.efi patching and firmware fixes, for us, we leave it as default
:::
::: details More in-depth Info

* **AvoidRuntimeDefrag**: YES
  * Fixes UEFI runtime services like date, time, NVRAM, power control, etc.
* **EnableSafeModeSlide**: YES
  * Enables slide variables to be used in safe mode.
* **EnableWriteUnprotector**: YES
  * Needed to remove write protection from CR0 register.
* **ProvideCustomSlide**: YES
  * Used for Slide variable calculation. However the necessity of this quirk is determined by `OCABC: Only N/256 slide values are usable!` message in the debug log. If the message `OCABC: All slides are usable! You can disable ProvideCustomSlide!` is present in your log, you can disable `ProvideCustomSlide`.
* **SetupVirtualMap**: YES
  * Fixes SetVirtualAddresses calls to virtual addresses, required for Gigabyte boards to resolve early kernel panics.

:::

#### Coffee Lake

![Booter](../images/config/config-universal/hedt-booter.png)

##### Quirks

::: tip Info
Settings relating to boot.efi patching and firmware fixes, for us, we need to change the following:

| Quirk | Enabled | Comment |
| :--- | :--- | :--- |
| DevirtualiseMmio | YES | |
| EnableWriteUnprotector | NO | |
| ProtectUefiServices | YES | Needed on Z390 system |
| RebuildAppleMemoryMap | YES | |
| ResizeAppleGpuBars | -1 | If your firmware supports increasing GPU Bar sizes (ie Resizable BAR Support), set this to `0` |
| SyncRuntimePermissions | YES | |
:::

::: details More in-depth Info

* **AvoidRuntimeDefrag**: YES
  * Fixes UEFI runtime services like date, time, NVRAM, power control, etc.
* **DevirtualiseMmio**: YES
  * Reduces Stolen Memory Footprint, expands options for `slide=N` values and very helpful with fixing Memory Allocation issues on Z390. Requires `ProtectUefiServices` as well on IceLake and Z390 Coffee Lake.
* **EnableSafeModeSlide**: YES
  * Enables slide variables to be used in safe mode.
* **EnableWriteUnprotector**: NO
  * This quirk and RebuildAppleMemoryMap can commonly conflict, recommended to enable the latter on newer platforms and disable this entry.
  * However, due to issues with OEMs not using the latest EDKII builds you may find that the above combo will result in early boot failures. This is due to missing the `MEMORY_ATTRIBUTE_TABLE` and such we recommend disabling RebuildAppleMemoryMap and enabling EnableWriteUnprotector. More info on this is covered in the [troubleshooting section](/troubleshooting/extended/kernel-issues.md#stuck-on-eb-log-exitbs-start).
* **ProtectUefiServices**: NO
  * Protects UEFI services from being overridden by the firmware, mainly relevant for VMs, Icelake and Z390 systems'.
  * If on Z390, **enable this quirk**.
* **ProvideCustomSlide**: YES
  * Used for Slide variable calculation. However the necessity of this quirk is determined by `OCABC: Only N/256 slide values are usable!` message in the debug log. If the message `OCABC: All slides are usable! You can disable ProvideCustomSlide!` is present in your log, you can disable `ProvideCustomSlide`.
* **RebuildAppleMemoryMap**: YES
  * Generates Memory Map compatible with macOS, can break on some laptop OEM firmwares so if you receive early boot failures disable this.
* **ResizeAppleGpuBars**: -1
  * Will reduce the size of GPU PCI Bars if set to `0` when booting macOS, set to `-1` to disable
  * Setting other PCI Bar values is possible with this quirk, though can cause instabilities
  * This quirk being set to zero is only necessary if Resizable BAR Support is enabled in your firmware.
* **SetupVirtualMap**: YES
  * Fixes SetVirtualAddresses calls to virtual addresses, shouldn't be needed on Skylake and newer. Some firmware like Gigabyte may still require it, and will kernel panic without this.
* **SyncRuntimePermissions**: YES
  * Fixes alignment with MAT tables and required to boot Windows and Linux with MAT tables, also recommended for macOS. Mainly relevant for RebuildAppleMemoryMap users.

:::

#### Comet Lake

![Booter](../images/config/config-universal/hedt-booter.png)

##### Quirks

::: tip Info
Settings relating to boot.efi patching and firmware fixes, for us, we need to change the following:

| Quirk | Enabled | Comment |
| :--- | :--- | :--- |
| DevirtualiseMmio | YES | |
| EnableWriteUnprotector | NO | |
| ProtectUefiServices | YES | |
| RebuildAppleMemoryMap | YES | |
| ResizeAppleGpuBars | -1 | If your firmware supports increasing GPU Bar sizes (ie Resizable BAR Support), set this to `0` |
| SetupVirtualMap | NO | |
| SyncRuntimePermissions | YES | |
:::

::: details More in-depth Info

* **AvoidRuntimeDefrag**: YES
  * Fixes UEFI runtime services like date, time, NVRAM, power control, etc.
* **DevirtualiseMmio**: YES
  * Reduces Stolen Memory Footprint, expands options for `slide=N` values and very helpful with fixing Memory Allocation issues , requires `ProtectUefiServices` as well for Z490.
* **EnableSafeModeSlide**: YES
  * Enables slide variables to be used in safe mode.
* **EnableWriteUnprotector**: NO
  * This quirk and RebuildAppleMemoryMap can commonly conflict, recommended to enable the latter on newer platforms and disable this entry.
  * However, due to issues with OEMs not using the latest EDKII builds you may find that the above combo will result in early boot failures. This is due to missing the `MEMORY_ATTRIBUTE_TABLE` and such we recommend disabling RebuildAppleMemoryMap and enabling EnableWriteUnprotector. More info on this is covered in the [troubleshooting section](/troubleshooting/extended/kernel-issues.md#stuck-on-eb-log-exitbs-start).
* **ProtectUefiServices**: YES
  * Protects UEFI services from being overridden by the firmware, required for Z490.
* **ProvideCustomSlide**: YES
  * Used for Slide variable calculation. However the necessity of this quirk is determined by `OCABC: Only N/256 slide values are usable!` message in the debug log. If the message `OCABC: All slides are usable! You can disable ProvideCustomSlide!` is present in your log, you can disable `ProvideCustomSlide`.
* **RebuildAppleMemoryMap**: YES
  * Generates Memory Map compatible with macOS, can break on some laptop OEM firmwares so if you receive early boot failures disable this.
* **ResizeAppleGpuBars**: -1
  * Will reduce the size of GPU PCI Bars if set to `0` when booting macOS, set to `-1` to disable
  * Setting other PCI Bar values is possible with this quirk, though can cause instabilities
  * This quirk being set to zero is only necessary if Resizable BAR Support is enabled in your firmware.
* **SetupVirtualMap**: NO
  * Fixes SetVirtualAddresses calls to virtual addresses, however broken due to Comet Lake's memory protections. ASUS, Gigabyte and AsRock boards will not boot with this on.
* **SyncRuntimePermissions**: YES
  * Fixes alignment with MAT tables and required to boot Windows and Linux with MAT tables, also recommended for macOS. Mainly relevant for RebuildAppleMemoryMap users.

:::
### Intel HEDT

### AMD

## Intel Laptop

