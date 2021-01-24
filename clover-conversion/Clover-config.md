# Converting common properties from Clover to OpenCore

* Supported version: 0.6.5

So this little(well not so little as I reread this...) page is for users who are having issues migrating from Clover to OpenCore as some of their legacy quirks are required or the Configuration.pdf isn't well suited for laptop users.  

# Kexts and Firmware drivers

See [Kexts and Firmware drivers](https://github.com/dortania/OpenCore-Install-Guide/blob/master/clover-conversion/clover-efi.md).

# Acpi

**ACPI Renames**:

So with the transition from Clover to OpenCore we should start removing unneeded patches you may have carried along for some time:

* EHCI Patches: Recommended to power off the controller with [SSDT-EHCx_OFF](https://github.com/acidanthera/OpenCorePkg/tree/master/Docs/AcpiSamples/Source/SSDT-EHCx_OFF.dsl). Skylake and newer users do not have an EHCI controller so no need for this.
  * change EHC1 to EH01
  * change EHC2 to EH02
* XHCI Patches: Not needed once an [Injector kext](https://github.com/corpnewt/USBMap) is made
  * change XHCI to XHC
  * change XHC1 to XHC
* SATA patches: Purely cosmetic in macOS now
  * change SAT0 to SATA
  * change SAT1 to SATA
* IMEI Patches: Handled by [WhateverGreen](https://github.com/acidanthera/whatevergreen/releases)
  * change HECI to IMEI
  * change HEC1 to IMEI
  * change MEI to IMEI
  * change IDER to MEID
* GFX patches: Handled by [WhateverGreen](https://github.com/acidanthera/whatevergreen/releases)
  * change GFX0 to IGPU
  * change PEG0 to GFX0
  * change PEGP to GFX0
  * change SL01 to PEGP
* EC Patches: See here on best solution: [Getting started with ACPI](https://dortania.github.io/Getting-Started-With-ACPI/)
  * change EC0 to EC
  * change H_EC to EC
  * change ECDV to EC
  * change PGEC to EC
* Audio renames: Handled by [AppleALC](https://github.com/acidanthera/AppleALC)
  * change HDAS to HDEF
  * change CAVS to HDEF
  * change AZAL to HDEF
  * change ALZA to HDEF
  * change B0D3 to HDAU
* Z390 BIOS RTC bug fix: See here on best solution: [Getting started with ACPI](https://dortania.github.io/Getting-Started-With-ACPI/)(SSDT-AWAC)
  * change STAS to [Blank]
  * Fix Z390 BIOS DSDT Device(RTC) bug
  * Fix 300-series RTC Bug
* NVMe patches: [NVMeFix](https://github.com/acidanthera/NVMeFix) fixes power management
  * change PXSX to ANS1
  * change PXSX to ANS2
* Airport/WiFi Patches: [AirportBrcmFixup](https://github.com/acidanthera/AirportBrcmFixup)
  * change PXSX to ARPT
* Other purely cosmetic patches:
  * change LPC0 to LPCB(use [SSDT-SBUS-MCHC](https://github.com/acidanthera/OpenCorePkg/tree/master/Docs/AcpiSamples/Source/SSDT-SBUS-MCHC.dsl) for fixing SMBUS support)
  * change PC00 to PCIO
  * change FPU to MATH
  * change TMR to TIMR
  * change PIC to IPIC
  * change GBE1 to ETH0

**Patches**

* TgtBridge patches: No feature parity in OpenCore, see comments(TgtBridge was very buggy in Clover):
  * [Vit's Comment](https://www.insanelymac.com/forum/topic/338516-opencore-discussion/?do=findComment&comment=2682158)
  * [Andrey's Comment](https://www.insanelymac.com/forum/topic/338516-opencore-discussion/?do=findComment&comment=2678273)

* DisableASPM:
  * `DeviceProperties -> Add -> PciRoot... -> pci-aspm-default | Data | <00>`

* HaltEnabler:
  * `ACPI -> Quirks -> FadtEnableReset -> YES`

**Fixes**:

* **FixAirport**:
  * [AirportBrcmFixup](https://github.com/acidanthera/AirportBrcmFixup)
* **FixIPIC**:
  * CorpNewt's [SSDTTime](https://github.com/corpnewt/SSDTTime) to make the proper SSDT, `FixHPET - Patch out IRQ Conflicts`

* **FixSBUS**:
  * [SSDT-SBUS-MCHC](https://github.com/acidanthera/OpenCorePkg/tree/master/Docs/AcpiSamples/Source/SSDT-SBUS-MCHC.dsl)

* **FixShutdown**:
  * [FixShutdown-USB-SSDT](https://github.com/dortania/OpenCore-Post-Install/blob/master/extra-files/FixShutdown-USB-SSDT.dsl)
  * [`_PTS` to `ZPTS` Patch](https://github.com/dortania/OpenCore-Post-Install/blob/master/extra-files/FixShutdown-Patch.plist)
  * This will not harm Windows or Linux installs as this is just adding missing methods that should've been there to start with. *Blame the firmware writers*

* **FixDisplay**:
  * Manual framebuffer patching, WhateverGreen does most of the work already

* **FixHDA**:
  * Handled by AppleALC
* **FixHPET**:
  * CorpNewt's [SSDTTime](https://github.com/corpnewt/SSDTTime) to make the proper SSDT, `FixHPET - Patch out IRQ Conflicts`
* **FixSATA**:
  * `Kernel -> Quirks -> ExternalDiskIcons -> YES`

* **FixADP1**:
  * Renames device `AC0_` to `ADP1`, see [Rename-SSDT](https://github.com/dortania/OpenCore-Install-Guide/blob/master/extra-files/Rename-SSDT.dsl) for an example
  * Also injects `Name (_PRW, Package (0x02) {0x1C,0x03})` into the device if not present. [Source](https://github.com/CloverHackyColor/CloverBootloader/blob/81f2b91b1552a4387abaa2c48a210c63d5b6233c/rEFIt_UEFI/Platform/FixBiosDsdt.cpp#L1677-L1692)

* **FixRTC**:
  * CorpNewt's [SSDTTime](https://github.com/corpnewt/SSDTTime) to make the proper SSDT, `FixHPET - Patch out IRQ Conflicts`
* **FixTMR**:
  * CorpNewt's [SSDTTime](https://github.com/corpnewt/SSDTTime) to make the proper SSDT, `FixHPET - Patch out IRQ Conflicts`

* **AddPNLF**:
  * See [SSDT-PNLF](https://dortania.github.io/Getting-Started-With-ACPI/Laptops/backlight.html)
* **AddMCHC**:
  * [SSDT-SBUS-MCHC](https://github.com/acidanthera/OpenCorePkg/tree/master/Docs/AcpiSamples/Source/SSDT-SBUS-MCHC.dsl)
* **AddIMEI**:
  * [SSDT-SBUS-MCHC](https://github.com/acidanthera/OpenCorePkg/tree/master/Docs/AcpiSamples/Source/SSDT-SBUS-MCHC.dsl)
  * WhateverGreen will also handle fixing IMEI naming
  * For Sandy Bridge on Z77 or IvyBridge on Z67, the IMEI will need to be faked: [SSDT-IMEI](https://github.com/acidanthera/OpenCorePkg/tree/master/Docs/AcpiSamples/Source/SSDT-IMEI.dsl)
* **FakeLPC**:
  * `DeviceProperties -> Add -> PciRoot... -> device-id`
  * You'll want to spoof it to a supported LPC controller already in AppleLPC

* **FixIntelGfx**:
  * WhateverGreen handles this

* **AddHDMI**:
  * WhateverGreen handles this

**DropTables**:

* `ACPI -> Delete`

**SSDT**:

* **PluginType**:
  * [SSDT-PLUG](https://dortania.github.io/Getting-Started-With-ACPI/)
  * See [Getting started with ACPI](https://dortania.github.io/Getting-Started-With-ACPI/Universal/plug.html) for more details

* **Generate P States**: [ssdtPRGen.sh](https://github.com/Piker-Alpha/ssdtPRGen.sh)(For Sandy Bridge and IvyBridge)
* **Generate C States**: [ssdtPRGen.sh](https://github.com/Piker-Alpha/ssdtPRGen.sh)(For Sandy Bridge and IvyBridge)

# Boot

**Boot Argument**:

* `NVRAM -> Add -> 7C436110-AB2A-4BBB-A880-FE41995C9F82 -> boot-args`

**NeverHibernate**:

* `Misc -> Boot -> HibernateMode -> None`

**Default Boot Volume**:

* `Misc -> Security -> AllowSetDefault -> True`
  * Press Ctrl+Enter in the picker to set default device
* Alternative is Startup Disk in macOS's System Preferences, just like on real Macs

# Boot Graphics

**DefaultBackgroundColor**:

* `NVRAM -> Add -> 4D1EDE05-38C7-4A6A-9CC6-4BCCA8B38C14 -> DefaultBackgroundColor`
  * `00000000`: Syrah Black
  * `BFBFBF00`: Light Gray
  * To calculate your own, convert an `RGB` value to `HEX`

**EFILoginHiDPI**:

* Clover only flag, for OpenCore UI scaling see UIScale and `UEFI -> Output`

**flagstate**:

* `NVRAM -> Add -> 4D1EDE05-38C7-4A6A-9CC6-4BCCA8B38C14 -> flagstate | Data | <>`
  * 0 -> `<00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000`(dumped from a mac)
  * NVRAM location needs to be double checked for this one

**UIScale**:

* `NVRAM -> Add -> 4D1EDE05-38C7-4A6A-9CC6-4BCCA8B38C14 -> UIScale | Data | <>`
  * 1 -> `<01>`
  * 2 -> `<02>`

# CPU

**Type**:

* `PlatformInfo -> Generic -> ProcessorType`
* See [AppleSmBios.h](https://github.com/acidanthera/OpenCorePkg/blob/master/Include/Apple/IndustryStandard/AppleSmBios.h) for all supported values

**HWPEnable**: Better alternative is to properly manage `MSR 0x770` with [HWPEnable](https://github.com/headkaze/HWPEnable)

**QEMU**: Proper VM/KVM support is implemented in OpenCore

**TurboDisable**: Better alternative is to control your frequencies with [CPUFriend](https://github.com/acidanthera/CPUFriend) or [ssdtPRGen](https://github.com/Piker-Alpha/ssdtPRGen.sh)

# Devices

**USB**:

* FixOwnership: `UEFI -> Quirk -> ReleaseUsbOwnership`
* ClockID: `DeviceProperties -> Add -> PciRoot... -> AAPL,clock-id`
* HighCurrent: `DeviceProperties -> Add -> PciRoot... -> AAPL, HighCurrent`
  * Irrelevant for OS X 10.11 and newer
  * Newer variant is either PowerProperties defined in `IOUSBHostFamily.kext -> AppleUSBHostPlatformProperties` or added with a USBX SSDT for Skylake SMBIOS and newer

**Audio**:

For the following, you will need to know your PciRoot for your audio controller and its name(commonly known as HDEF but also HDAS, HDAU and such), this can be found with [gfxutil](https://github.com/acidanthera/gfxutil/releases):

```
path/to/gfxutil -f HDEF
```

* Inject: `DeviceProperties -> Add -> PciRoot... -> layout-id`
* AFGLowPowerState: `DeviceProperties -> Add -> PciRoot... -> AFGLowPowerState -> <01000000>`
* ResetHDA: [JackFix](https://github.com/fewtarius/jackfix)(well to be specific it's `jackfix.sh`)

**Add Properties**:

* No equivalent, need to specify with a PciRoot path

**Properties**:

* `DeviceProperties -> Add`

**FakeID**:
For the following, you will need to know your PciRoot for your device and apply their properties with `DeviceProperties -> Add`, PciRoot can be found with [gfxutil](https://github.com/acidanthera/gfxutil/releases)

* **USB**
  * `device-id`
  * `device_type`
  * `device_type`
* **IMEI**
  * `device-id`
  * `vendor-id`

* **WIFI**

  * `name`
  * `compatible`

* **LAN**

  * `device-id`
  * `compatible`
  * `vendor-id`

* **XHCI**

  * `device-id`
  * `device_type: UHCI`
  * `device_type: OHCI`

device_type: EHCI

* `device-id`
* `AAPL,current-available`
* `AAPL,current-extra`
* `AAPL,current-available`
* `AAPL,current-extra`
* `AAPL,current-in-sleep`
* `built-in`

device_type: XHCI

* `device-id`
* `AAPL,current-available`
* `AAPL,current-extra`
* `AAPL,current-available`
* `AAPL,current-in-sleep`
* `built-in`

# Disable Drivers

Just don't add your drivers to `UEFI -> Drivers`

# Gui

# Graphics

* Note: PciRoot... should be replaced with

**InjectIntel**:

* [GMA Patching](https://dortania.github.io/OpenCore-Post-Install/gpu-patching/)

**InjectAti**:

* `DeviceProperties -> Add -> PciRoot... -> device-id`
  * ie: `<B0670000>` for the R9 390X
* `DeviceProperties -> Add -> PciRoot... -> @0,connector-type`
  * You may need to add additional Connectors (ie. @1,connector-type, @2,connector-type) for the amount of ports you have. See here for the list of connector types:

```
LVDS                    <02 00 00 00>
DVI (Dual Link)         <04 00 00 00>
DVI (Single Link)       <00 02 00 00>
VGA                     <10 00 00 00>
S-Video                 <80 00 00 00>
DP                      <00 04 00 00>
HDMI                    <00 08 00 00>
DUMMY                   <01 00 00 00>
```

**InjectNvidia**:

* [Nvidia Patching](https://dortania.github.io/OpenCore-Post-Install/gpu-patching/)

**FakeIntel**:

* `DeviceProperties -> Add -> PciRoot(0x0)/Pci(0x2,0x0) -> device-id`
  * ie. `66010003` for the HD 4000
* `DeviceProperties -> Add -> PciRoot(0x0)/Pci(0x2,0x0) -> vendor-id -> <86800000>`

**FakeAti**:

* `DeviceProperties -> Add -> PciRoot... -> device-id`
  * ie: `<B0670000>` for the R9 390X
* `DeviceProperties -> Add -> PciRoot... -> ATY,DeviceID`
  * ie: `<B067>` for the R9 390X
* `DeviceProperties -> Add -> PciRoot... -> @0,compatible`
  * ie. `ATY,Elodea` for HD 6970M
* `DeviceProperties -> Add -> PciRoot... -> vendor-id-> <02100000>`
* `DeviceProperties -> Add -> PciRoot... -> ATY,VendorID -> <0210>`

**Note**: See here on making an SSDT for GPU Spoofing, DeviceProperties injection via OpenCore seems to fail sometimes when trying to spoof a GPU: [Renaming GPUs](https://dortania.github.io/Getting-Started-With-ACPI/Universal/spoof.html)
For others like InjectAti, see the [Sample.dsl](https://github.com/acidanthera/WhateverGreen/blob/master/Manual/Sample.dsl) in the WhateverGreen docs

**Custom EDID**

* [WhateverGreen's EDID docs](https://github.com/acidanthera/WhateverGreen/blob/master/Manual/FAQ.IntelHD.en.md#edid)

**Dual Link**:

* `DeviceProperties -> Add -> PciRoot... -> AAPL00,DualLink`
  * 1 -> `<01000000>`
  * 0 -> `<00000000>`

**NVCAP**

* [Nvidia Patching](https://dortania.github.io/OpenCore-Post-Install/gpu-patching/)

**display-cfg**:

* `DeviceProperties -> Add -> PciRoot... -> @0,display-cfg`
* See fassl's post on the matter: [Nvidia injection](https://www.insanelymac.com/forum/topic/215236-nvidia-injection/)

**LoadVBios**:

* See [sample.dsl](https://github.com/acidanthera/WhateverGreen/blob/master/Manual/Sample.dsl) for more info on custom VBIOS injection

**PatchVBios**: See LoadVBIOS

**NvidiaGeneric**:

* `DeviceProperties -> Add -> PciRoot... -> model | string | Add the GPU name`

**NvidiaSingle**: See [disabling unsupported GPUs](https://dortania.github.io/OpenCore-Post-Install/)

**NvidiaNoEFI**:

* `DeviceProperties -> Add -> PciRoot... -> NVDA,noEFI | Boolean | True`
* See FredWst' comment for more info: [GT 640 scramble](https://www.insanelymac.com/forum/topic/306156-clover-problems-and-solutions/?do=findComment&comment=2443062)

**ig-platform-id**:

* `DeviceProperties -> Add -> PciRoot(0x0)/Pci(0x2,0x0) -> APPL,ig-platform-id`

**BootDisplay**:

* `DeviceProperties -> Add -> PciRoot... ->  @0,AAPL,boot-display`

**RadeonDeInit**:

* [Radeon-Denit-SSDT](https://github.com/dortania/OpenCore-Install-Guide/blob/master/extra-files/Radeon-Deinit-SSDT.dsl)
  * Do note that this is meant for GFX0, adjust for your system

# Kernel and Kext Patches

**KernelPm**:

* `Kernel -> Quirks -> AppleXcpmCfgLock -> YES`
* Note that Clover will auto-apply this patch without setting it if the MSR E2 was locked, so you may actually need AppleXcpmCfgLock even if Clover didn't

**AppleIntelCPUPM**:

* `Kernel -> Quirks -> AppleCpuPmCfgLock -> YES`

**DellSMBIOSPatch**:

An odd quirk for Dell systems running APTIO V(or just Skylake, Slice doesn't really know either)

* `Kernel -> Quirks -> CustomSMBIOSGuid -> YES`
* `PlatformInfo -> UpdateSMBIOSMode -> Custom`

**KextsToPatch**:

* `Kernel -> Patch`
* See [Common Kernel and Kext patch conversions](../clover-conversion/clover-patch.md) for common patch conversions

**KernelToPatch**:

* `Kernel -> Patch`
* See [Common Kernel and Kext patch conversions](../clover-conversion/clover-patch.md) for common patch conversions

**ForceKextsToLoad**:

* `Kernel -> Force`

**Kernel LAPIC**:

* `Kernel -> Quirks -> LapicKernelPanic -> YES`

**KernelXCPM**:

* `Kernel -> Quirks -> AppleXcpmExtraMsrs -> YES`

For an extensive list of patches, please compare [OpenCore's `CommonPatches.c`](https://github.com/acidanthera/OpenCorePkg/blob/master/Library/OcAppleKernelLib/CommonPatches.c) with [Clover's kernel_patcher.c](https://github.com/CloverHackyColor/CloverBootloader/blob/master/rEFIt_UEFI/Platform/kernel_patcher.cpp). Some patches are not transferred over so if you're having issues this is the section to check, example is converting the [`KernelIvyBridgeXCPM()`](https://github.com/CloverHackyColor/CloverBootloader/blob/master/rEFIt_UEFI/Platform/kernel_patcher.cpp#L1466-L1565) to OpenCore:

```
Base: _xcpm_bootstrap
Comment: _xcpm_bootstrap (Ivy Bridge) 10.15
Count: 1
Enabled: YES
Find: 8D43C43C22
Identifier: kernel
Limit: 0
Mask: FFFF00FF
MinKernel: 19.
MaxKernel: 19.99.99
Replace: 8D43C63C22
ReplaceMask: 0000FF0000
Skip: 0
```

[Source](https://github.com/khronokernel/OpenCore-Vanilla-Desktop-Guide/issues/32)

For Low end Haswell+ like Celerons, please see here for recommended patches: [Bugtracker Issues 365](https://github.com/acidanthera/bugtracker/issues/365)

**USB Port Limit Patches**:

* `Kernel -> Quirks -> XhciPortLimit -> YES`

**External Icons Patch**:

* `Kernel -> Quirks -> ExternalDiskIcons -> YES`
* Used for when you internal disk are seen as external on macOS

**AppleRTC**

Issue with AppleRTC, quite a simple fix:

* config.plist -> Kernel -> Quirks -> DisableRtcChecksum -> true

**Note**: If you still have issues, you'll need to use [RTCMemoryFixup](https://github.com/acidanthera/RTCMemoryFixup/releases) and exclude ranges. See [here for more info](https://github.com/acidanthera/bugtracker/issues/788#issuecomment-604608329)

The following boot-arg should handle 99% of cases(pair this with RTCMemoryFixup):

```
rtcfx_exclude=00-FF
```

If this works, slowly shorten the excluded area until you find the part macOS is getting fussy on

**FakeCPUID**:

* `Kernel -> Emulate`:
  * `CpuidMask`: `<Clover_FCPUID_Extended_to_4_bytes_Swapped_Bytes> | 00 00 00 00 | 00 00 00 00 | 00 00 00 00`
    * ex(`0x0306A9`): `A9060300 00000000 00000000 00000000`
  * `CpuidData`(Swap `00` for `FF` if needing to swap with a longer value)
    * ex: `FFFFFFFF 00000000 00000000 00000000`

Note: Finding CPUID's for Intel can be a bit harder than looking at Intel ARK, easiest way to find it is via Microsoft's [Intel microcode update notes](https://support.microsoft.com/en-ca/help/4093836/summary-of-intel-microcode-updates)

# Rt Variables

**ROM**:

* No direct translation for `UseMacAddr0` as you need to provide your hardware ROM, can be found in `System Preferences -> Network -> Advanced -> Hardware`
* Also verify your En0 is still built-in when running OpenCore, this can break iMessage and iCloud when there's no `built-in` property.

**MLB**:

* `PlatformInfo -> Generic -> MLB`

**BooterConfig**:

* `NVRAM -> Add -> 4D1EDE05-38C7-4A6A-9CC6-4BCCA8B38C14-> UIScale`:

  * 0x28: `Data | <01>`
  * 0x2A: `Data | <02>`

**CsrActiveConfig**:

* `NVRAM -> Add -> 7C436110-AB2A-4BBB-A880-FE41995C9F82 -> csr-active-config`:

  * 0x0: `00000000`
  * 0x3: `03000000`
  * 0x67: `67000000`
  * 0x3E7: `E7030000`

# SMBIOS

**Product Name**:

* `PlatformInfo -> Generic -> SystemProductName`

**Serial Number**:

* `PlatformInfo -> Generic -> SystemSerialNumber`

**Board Serial Number**:

* `PlatformInfo -> Generic -> MLB`

**SmUUID**:

* `PlatformInfo -> Generic -> SystemUUID`

**Memory**:

* `PlatformInfo -> CustomMemory -> True`
* `PlatformInfo -> Memory`
  * See [Configuration.pdf](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/Configuration.pdf) for more info

**Slots AAPL Injection**:

* `DeviceProperties -> Add -> PciRoot... -> APPL,slot-name | string | Add slot`

# System Parameters

**CustomUUID**:

* Heavily deprecated and not recommended even on Clover, no equivalent on OpenCore
* More info on why: [Hardware UUID injection for OpenCore #711](https://github.com/acidanthera/bugtracker/issues/711)

**InjectSystemID**:

* Also legacy as it's used for replicating Chameleon user's UUIDs

**BacklightLevel**:

* Property set in NVRAM
* `NVRAM -> Add -> 7C436110-AB2A-4BBB-A880-FE41995C9F82 -> backlight-level | Data | <Insert value>`
  * 0x0101 -> `<0101>`

**InjectKexts**:

* No equivalent but you really have no excuse to keep FakeSMC inside macOS

**NoCaches**:

* This only works up to 10.7 on Clover, and OpenCore requires an OS that supports a prelinked(10.7) so there can't be an equivalent

**ExposeSysVariables**:

* Just add your SMBIOS properties under `PlatformInfo`
* Confusing quirk tbh, it's not even mentioned in more recent versions of the Clover docs on AppleLife

**NvidiaWeb**:

* What this does is apply ```sudo nvram nvda_drv=1``` on every boot. To get a similar effect you can find it under the following path:
* `NVRAM -> Add -> 7C436110-AB2A-4BBB-A880-FE41995C9F82 -> nvda_drv: <31>`

# Status

**Section finished 100%**:

* Boot Graphics
* Disable Drivers
* KernelAndKextPatches
* RTVariables
* SMBIOS
* SystemParameters

**Section mostly finished**:

* Acpi
* Boot
* CPU
* Device

**Section missing**:

* GUI
