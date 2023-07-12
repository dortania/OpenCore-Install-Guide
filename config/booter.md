# Booter

[[toc]]

This section is dedicated to configuring settings for patching bootloaders; for us, this will be the Apple bootloader, `boot.efi`. Different firmwares will need different quirks in order to be able to boot macOS, and you may need to tinker further with these settings to get your system to boot.

## `MmioWhitelist`

This section is used to whitelist specific memory regions when `DevirtualiseMmio` is being used. If you need `DevirtualiseMmio` and need to whitelist regions, see the [KASLR fix](/extras/kaslr-fix.md) page for instructions.

::: tip
If you'd like, you can delete the sample entries in this section, but do not delete the section itself.
:::

## `Patch`

This section is for binary patches for the bootloader. We won't be doing this, so you can ignore this section.

::: tip
If you'd like, you can delete the sample entries in this section, but do not delete the section itself.
:::

## `Quirks`

::: warning TODO
Dump all of the quirk setups for each platform here, then we will organize and combine platforms as needed
:::

This section configures the various quirks that OpenCore provides to patch the bootloader.

### FX

* **AvoidRuntimeDefrag**: YES
* **EnableSafeModeSlide**: YES
* **EnableWriteUnprotector**: YES
* **ProvideCustomSlide**: YES
* **SetupVirtualMap**: YES

### Zen
