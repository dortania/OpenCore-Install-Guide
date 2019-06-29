# ACPI

**Add:** You'll want to go through and disable all of them or rename them to the files you have under EFI/OC/ACPI/Custom (set enabled to no or delete).

**Block**: We won't be doing anything here.

**Patch**: Here you'll be adding some USB and SATA patches, follow the [Vanilla guide](https://hackintosh.gitbook.io/-r-hackintosh-vanilla-desktop-guide/) for what patches your system may need.

**Quirk**: Settings for ACPI.

* FadtEnableReset: NO (Enable reboot and shutdown on legacy hardware, not recommended unless needed)
* NormalizeHeaders: NO (Cleanup ACPI header fields, irrelevant in 10.14)
* RebaseRegions: NO (Attempt to heuristically relocate ACPI memory regions)
* ResetHwSig: NO (Needed for hardware that fail fail to maintain hardware signature across the reboots and cause issues with
waking from hibernation)
* ResetLogoStatus: NO (Workaround for systems running BGRT tables)

![ACPI](https://i.imgur.com/sjlX3aT.png)

&#x200B;

# DeviceProperties

**Add**: Sets device properties from a map.

`PciRoot(0x0)/Pci(0x2,0x0)` -> `AAPL,ig-platform-id`

* Applies Framebuffer patch, insert required value from Framebuffer guide [here](https://www.insanelymac.com/forum/topic/334899-intel-framebuffer-patching-using-whatevergreen/?tab=comments#comment-2626271). Don't forget to add Stolemen and patch-enable.

`PciRoot(0x0)/Pci(0x1b,0x0)` -> `Layout-id`

* Applies AppleALC audio injection, you'll need to do your own research on which codec your motherboard has and match it with AppleALC's layout. [AppleALC Supported Codecs](https://github.com/acidanthera/AppleALC/wiki/Supported-codecs).

**Block**: Removes device properties from map

![DeviceProperties](https://i.imgur.com/8gujqhJ.png)

# Kernel

**Add**: Here's where you specify which kexts to load, order matters here so make sure Lilu.kext is always first! Other higher priority kexts come after Lilu such as, VirtualSMC, AppleALC, WhateverGreen, etc.

**Emulate**: Needed for spoofing unsupported CPUs like Pentiums and Celerons

* CpuidMask: When set to Zero, original CPU bit will be used
* CpuidData: The value for the CPU spoofing, don't forget to swap hex

**Block**: Blocks kexts from loading. Sometimes needed for disabling Apple's trackpad driver for some laptops.

**Patch**: Patches kexts (this is where you would add USB port limit patches and AMD CPU patches).

**Quirks**:

* AppleCpuPmCfgLock: NO (Only needed when CFG-Lock can't be disabled in BIOS)
* AppleXcpmCfgLock: NO (Only needed when CFG-Lock can't be disabled in BIOS)
* AppleXcpmExtraMsrs: NO (Disables multiple MSR access needed for unsupported CPUs like Pentiums and certain Xeons)
* CustomSMBIOSGuid: NO (Performs GUID patching for UpdateSMBIOSMode Custom mode. Usually relevant for Dell laptops)
* DisbaleIOMapper: NO (Needed to get around VT-D if unable to disable in BIOS, can interfere with Firmware so avoid when possible)
* ExternalDiskIcons: YES (External Icons Patch, for when internal drives are treated as external drives)
* LapicKernelPanic: NO (Disables kernel panic on AP core lapic interrupt)
* PanicNoKextDump: YES (Allows for reading kernel panics logs when kernel panics occurs)
* ThirdPartyTrim: NO (Enables TRIM, not needed for AHCI or NVMe SSDs)
* XhciPortLimit: YES (This is actually the 15 port limit patch, don't rely on it as it's not a guaranteed solution for fixing USB. Please create a [USB map](https://usb-map.gitbook.io/project/) when possible. Its a temporary solution for those who have yet to create a USB map)

![Kernel](https://i.imgur.com/DcafUhE.png)

# Misc

**Boot**: Settings for boot screen (leave as-is unless you know what you're doing).
* Timeout: 5 (This sets how long OpenCore will wait until it automatically boots from the default selection).
* ShowPicker: YES (
* UsePicker: YES (Uses OpenCore's default GUI, set to NO if you wish to use a different GUI)

**Debug**: Debug has special use cases, leave as-is unless you know what you're doing.
* DisableWatchDog: NO (May need to be set for yes if macOS is stalling on something while booting)

**Security**: Security is pretty self-explanatory.

* RequireSignature: NO (We won't be dealing vault.plist so we can ignore)
* RequireVault: NO (We won't be dealing vault.plist so we can ignore as well)
* ScanPolicy: 0 (This allow you to see all drives available, please refer to OpenCore's DOC for furthur info on setting up ScanPolicy)

**Tools** Used for running OC debugging tools like clearing NVRAM, we'll be ignoring this

![Misc](https://i.imgur.com/6NPXq0A.png)

# NVRAM

**Add**: 7C436110-AB2A-4BBB-A880-FE41995C9F82 (System Integrity Protection bitmask)

* boot-args: -v dart=0 debug=0x100 keepsyms=1 , etc (Boot flags)
* csr-active-config: <00000000> (Settings for SIP, recommeded to manully change this within Recovery partition with csrutil)
* nvda_drv:  <> (For enabling WebDrivers)
* prev-lang:kbd: <> (Needed for non-latin keyboards)

**Block**: Forcibly rewrites NVRAM variables, not needed for us as `sudo nvram` is prefered but useful for those edge cases

**LegacyEnable** Allows for NVRAM to be stored on nvram.plist 

**LegacySchema** Used for assigning nvram variable

![NVRAM](https://i.imgur.com/MPFj3TS.png)

# Platforminfo

**Automatic**: YES (Generates PlatformInfo based on Generic section instead of DataHub, NVRAM, and SMBIOS sections)

**Generic**:

* SpoofVendor: YES
* SystemUUID: Can be generated with MacSerial or use pervious from Clover's config.plist.
* MLB: Can be generated with MacSerial or use pervious from Clover's config.plist.
* ROM: <> (6 character MAC address, can be entirely random)
* SystemProductName: Can be generated with MacSerial or use pervious from Clover's config.plist.
* SystemSerialNumber: Can be generated with MacSerial or use pervious from Clover's config.plist.
`ROM must either be Apple ROM (dumped from a real Mac), or your NIC MAC address, or any random MAC address (could be just 6 random bytes)` - Vit9696

**DataHub**

**PlatformNVRAM**

**SMBIOS**

**UpdateDataHub**: YES (Update Data Hub fields)

**UpdateNVRAM**: YES (Update NVRAM fields)

**UpdateSMBIOS**: YES (Update SMBIOS fields)

**UpdateSMBIOSMode**: Create (Replace the tables with newly allocated EfiReservedMemoryType)

![PlatformInfo](https://i.imgur.com/dIKAlhj.png)

# UEFI

**ConnectDrivers**: YES (Forces .efi drivers, change to NO for faster boot times but cerain file system drivers may not load)

**Drivers**: Add your .efi drivers here.

**Protocols**:

* AppleBootPolicy: NO (Ensures APFS compatibility on VMs or legacy Macs)
* ConsoleControl: NO (Replaces Console Control protocol with a builtin version, needed for when firmware doesn’t support text output mode)
* DataHub: NO (Reinstalls Data Hub)
* DeviceProperties: NO (Ensures full compatibility on VMs or legacy Macs)

**Quirks**:

* ExitBootServicesDelay: 0 (Switch to 5 if running ASUS Z87-Pro with FileVault2)
* IgnoreInvalidFlexRatio: NO (Fix for when MSR_FLEX_RATIO (0x194) can't be disabled in the BIOS, required for all pre-skylake based systems)
* IgnoreTextInGraphics: NO (Fix for UI corruption when both text and graphics outputs happen)
* ProvideConsoleGop: YES (Enables GOP, AptioMemoryFix currently offers this but will soon be removed)
* ReleaseUsbOwnership: NO (Releases USB controller from firmware driver)
* RequestBootVarRouting: NO (Redirects AptioMemeoryFix from EFI_GLOBAL_VARIABLE_G to OC_VENDOR_VARIABLE_GUID. Needed for when firmware tries to delete boot entries)
* SanitiseClearScreen: NO (Fixes High resolutions displays that display OpenCore in 1024x768)
