# Clover Boot Arg Conversion

* Supported version: 0.6.5

This section is mainly used for explaining what boot-args are no longer relevant, it's quite common for users to be still carrying legacy args which have little to no real affect in newer versions of macOS or have little use in OpenCore

This list is based of memory and an annoyed self with seeing these flags keep popping up, got other flags to add then I recommend [opening an issue](https://github.com/khronokernel/OpenCore-Vanilla-Desktop-Guide/issues). All help is welcomed!

## macOS flags

**dart=0**:

* Used for disabling VT-D support
* With Clover, when this flag was present it would also drop your DMAR table from ACPI
* This flag also requires SIP to be disabled in macOS 10.15 Catalina, so with OpenCore this flag is no longer recommended and instead replaced with `Kernel -> Quirks -> DisableIoMapper`

**kext-dev-mode=1**:

* Used for allowing unsigned kexts to be loaded, flag only present in Yosemite
* `CSR_ALLOW_UNSIGNED_KEXTS` bit to be flipped in `csr-active-config` NVRAM variable for newer releases
* This is not needed on OpenCore due to the kernel injection method used: Attaching to the prelinked kernel

## Kexts flags

**nvda_drv=1**: Used for enabling Nvidia's Web Drivers, no longer works in macOS 10.12

* This flag was actually turned into `nvda_drv_vrl=1` for Sierra and High Sierra

## Chameleon flags

For some reason people kept using these flags into Clover which had no effect, and so we really need to stop the train on this one with OpenCore

**PCIRootUID=Value**

* This sets the `_UID` of `Device (PCI0)` to whatever the value is, supposedly needed on legacy AMD GPUs but this is debatable. Ironically Clover still uses this flag but most users know it from Chameleon. [Source](https://github.com/CloverHackyColor/CloverBootloader/blob/81f2b91b1552a4387abaa2c48a210c63d5b6233c/rEFIt_UEFI/Platform/FixBiosDsdt.cpp#L1630-L1674)

**GraphicsEnabler=Yes/No**

* InjectAMD/Nvidia was the Clover equivalent but no feature parity in OpenCore besides running [WhateverGreen](https://github.com/acidanthera/WhateverGreen)

**IGPEnabler=Yes/No**

* Same idea as GraphicsEnabler, Clover equivalent is InjectIntel so feature parity would be [WhateverGreen's Framebuffer patching](https://github.com/acidanthera/WhateverGreen/blob/master/Manual/FAQ.IntelHD.en.md)

**-f**

* Enables cacheless booting on Chameleon and Clover, OpenCore has a slightly different option under `Kernel -> Scheme -> KernelCache` and set the entry to `Cacheless`
  * Currently cacheless booting is only supported on 64-bit kernels from OS X 10.6 to 10.9
