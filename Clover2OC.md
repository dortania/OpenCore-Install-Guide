# Converting common properties from Clover to Opencore

## **Work in Progress**

# Acpi

**Fixes**:

* **FixSBUS**:
   * [SSDT-SBUS-MCHC](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-SBUS-MCHC.dsl)

* **FixShutdown**:
   * Add `If(arg=5){}` to all `method _PTS` in your DSDTs and SSDTs

* **FixDisplay**:
   * Manual framebuffer patching, WhaterGreen does most of the work already

* **AddMCHC**:
   * [SSDT-SBUS-MCHC](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-SBUS-MCHC.dsl)

* **FixHDA**:
   * Handled by AppleALC
* **FixHPET**:
   * CorpNewt's [SSDTTime](https://github.com/corpnewt/SSDTTime) to make the proper SSDT

* **FixSATA**:
   * `Kernel -> Quriks -> ExternalDiskIcons -> YES`

* **FixADP1**:
   * Renames device AC0 to ADP1, see [Rename-SSDT](https://github.com/khronokernel/Opencore-Vanilla-Desktop-Guide/blob/master/extra-files/Rename-SSDT.dsl) for an example

* **FixRTC**:
   * CorpNewt's [SSDTTime](https://github.com/corpnewt/SSDTTime) to make the proper SSDT
* **FixTMR**:
   * CorpNewt's [SSDTTime](https://github.com/corpnewt/SSDTTime) to make the proper SSDT

* **AddPNLF**:
   * See Rehabman's [SSDT-PNLF](https://github.com/RehabMan/OS-X-Clover-Laptop-Config/blob/master/hotpatch/SSDT-PNLF.dsl)
* **AddIMEI**:
  * [SSDT-SBUS-MCHC](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-SBUS-MCHC.dsl)

* **FixIntelGfx**:
   * WhateverGreen handles this

* **AddHDMI**:
   * WhateverGreen handles this

**SSDT**:
* **PluginType**:
   * [SSDT-PLUG](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-PLUG.dsl)
   * Do note that this SSDT is made for systems where AppleACPICPU attaches CPU0, though some ACPI tables have theirs starting at PR00 so adjust accordingly. CorpNewt's [SSDTTime](https://github.com/corpnewt/SSDTTime) can help you with this
# Boot

**Boot Argument**
* `NVRAM -> Add -> 7C436110-AB2A-4BBB-A880-FE41995C9F82 -> boot-args`

**NeverHibernate**: 
* `Misc -> Boot -> HibernateMode -> None`

# Boot Graphics

# Cpu

# Devices

**USB**:
* FixOwnership: `UEFI -> Qurik -> ReleaseUsbOwnership`
* ClockID: `DeviceProperties -> Add -> PCIRoot... -> AAPL,clock-id`

**Audio**:
* Inject: `DeviceProperties -> Add -> PCIRoot... -> layout-id`
* AFGLowPowerState: `DeviceProperties -> Add -> PCIRoot... -> AFGLowPowerState -> <01000000>`
* ResetHDA: [CodecCommander](https://bitbucket.org/RehabMan/os-x-eapd-codec-commander/downloads/)

**Add Properties**: 
* No equivalent, need to specify with a PCIRoot path

**Properties**:
* `DeviceProperties -> Add`

**FakeID**

* **USB**
   * `device-id`
   * `device_type`
   * `device_type`
* **IMEI**
   * `device-id`
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

* **WIFI**

   * `name`
   * `compatible`
   
* **LAN**

   * `device-id`
   * `compatible`
   * `vendor-id`

# Disable Drivers

# Gui

# Graphics

**InjectIntel**:
* `Vendor`
* `deviceID`

**InjectAti**:
* `deviceID`
* `Connectors`

**InjectNvidia**:
* `DeviceID`
* `Family`


**FakeIntel**:
* `device-id`
* `vendor-id`

**FakeAti**:
* `device-id`
* `ATY,DeviceID`
* `@0,compatible`
* `vendor-id`
* `ATY,VendorID`

**RadeonDeInit**:
* [Radeon-Denit-SSDT](https://github.com/khronokernel/Opencore-Vanilla-Desktop-Guide/blob/master/extra-files/Radeon-Deinit-SSDT.dsl)
   * Do note that this is meant for gfx0, adjust for your system

# Kernel and Kext Patches

**KernelPm**: 
* `Kernel -> Quirks -> AppleXcpmCfgLock -> YES`

**AppleIntelCPUPM**:
* `Kernel -> Quirks -> AppleCpuPmCfgLock -> YES`

**DellSMBIOSPatch**:
* `Kernel -> Quirks -> CustomSMBIOSGuid -> YES`
* `PlatformInfo -> UpdateSMBIOSMode -> Custom`

**KextsToPatch**:
* `Kernel -> Patch`

**KernelToPatch**:
* `Kernel -> Patch`

**Kernel LAPIC**:
* `Kernel -> Quirks -> LapicKernelPanic -> YES`

**KernelXCPM**
* `Kernel -> Quirks -> AppleXcpmExtraMsrs -> YES`

# Rt Variables

**ROM**:
* No direct translation for `UseMacAddr0` as you need to provide your hadware ROM, can be found in `System Preferences -> Network -> Advanced -> Hardware`

**MLB**: 
* `PlatformInfo -> Generic -> MLB`

**BooterConfig**: 

`NVRAM -> Add -> 4D1EDE05-38C7-4A6A-9CC6-4BCCA8B38C14-> UIScale`

* 0x28: `01`
* 0x2A: `02`

**CsrActiveConfig**:
`NVRAM -> Add -> csr-active-config`

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

# System Parameters

**NvidiaWeb**: 

What this does is apply ```sudo nvram nvda_drv=1``` on every boot. To get a similar effect you can find it under the following path:
* `NVRAM -> Add -> 7C436110-AB2A-4BBB-A880-FE41995C9F82 -> nvda_drv: <31>`

