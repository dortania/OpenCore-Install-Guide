# Clover Boot Arg Conversion

Last edited: March 2, 2020

This section is mainly used for explaining what boot-args are no longer relevant, it's quite common for users to be still carrying legacy args which have little to no real affect in newer versions of macOS or have little use in OpenCore

This list is based of memory and an annoyed self with seeing these flags keep popping up, got other flags to add then I recommend [opening an issue](https://github.com/khronokernel/Opencore-Vanilla-Desktop-Guide/issues). All help is welcomed!

## macOS flags

**dart=0**: Used for disabling VT-D support
* With Clover, when this flag was present it would also drop your DMAR table from ACPI 
* This flag also requires SIP to be disabled in macOS 10.15 catalina, so with OpenCore this flag is no longer recommended and instead replaced with `Kernel -> Quirks -> DisableIoMapper`

**kext-dev-mode=1**:
* Used for allowing unsigned kexts to be loaded, this also required `CSR_ALLOW_UNSIGNED_KEXTS` bit to be flipped in `csr-active-config` NVRAM variable
* This is not needed on OpenCore due to the kernel injection method used: Attatching to the prelinked kernel


## Kexts flags

**nvda_drv=1**: Used for enabling Nvidia's WebDrivers, no longer works in macOS 10.12
* This flag was actually turned into `nvda_drv_vrl=1` for Sierra and High Sierra


## Chameleon flags


For some reason people kept using these flags into Clover which had no effect, and so we really need to stop the train on this one with OpenCore

**GraphicsEnabler=No**

**IGPEnabler=Yes**

**PCIRootUID=1**
