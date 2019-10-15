# Converting common properties from Clover to Opencore

## **Work in Progress**


# Inject AMD

Using an old GPU that's reliant on the "inject" property?:


InjectIntel:
* Vendor
* deviceID

InjectAti:
* deviceID
* Connectors


InjectNvidia:
* DeviceID
* Family


FakeIntel:
* device-id
* vendor-id

FakeAti:
* device-id
* ATY,DeviceID
* @0,compatible
* vendor-id
* ATY,VendorID


Info from: 
* FixBiosDSDT
* Ati.c

# FakeID

Found in device_inject.c

**ATI**

**IntelGFX**

**LAN**

* device-id
* compatible
* vendor-id

**Nvidia**

**SATA**

* 
**WIFI**

* name
* compatible

**XHCI**

* device-id
* device_type: UHCI
* device_type: OHCI

device_type: EHCI

* device-id
* AAPL,current-available
* AAPL,current-extra
* AAPL,current-available
* AAPL,current-extra
* AAPL,current-in-sleep
* built-in

device_type: XHCI

* device-id
* AAPL,current-available
* AAPL,current-extra
* AAPL,current-available
* AAPL,current-in-sleep
* built-in

**IMEI**

* device-id
* vendor-id




# USB

* device-id
* device_type
* device_type






# Acpi

**Fixes**:

* **AddDTGP**:

* **FixIPIC**:

* **FixUSB**:

* **FixDarwin**:

* **FixSBUS**:

* **FixLAN**:

* **FixShutdown**:

* **FixDisplay**:

* **FixAirport**:

* **AddMCHC**:

* **FixIDE**:

* **FixHDA**:

* **FixHPET**:

* **FixSATA**:

* **FakeLPC**:

* **FixFirewire**:

* **FixDarwin7**:

* **FixADP1**:

* **FixRegions**:

* **FixRTC**:

* **DeleteUnused**:

* **FixMutex**:

* **FixTMR**:

* **AddPNLF**:

* **AddIMEI**:

* **FixS3D**:

* **FixIntelGfx**:

* **FixACST**:

* **FixWAK**:

* **AddHDMI**:

# Boot

# Boot Graphics

# Cpu

# Devices

**USB**:
* FixOwnership: `UEFI -> Qurik -> ReleaseUsbOwnership`

**Audio**:
* Inject:
* AFGLowPowerState:

**Add Properties**: 
* No equivalent, need to specify with a PCIRoot path

**Properties**:
* `DeviceProperties -> Add`

# Disable Drivers

# Gui

# Graphics

**RadeonDeInit**:
* [Radeon-Denit-SSDT](extras/Radeon-Deinit-SSDT)

# Kernel and Kext Patches

**KernelPm**: 
* `AppleXcpmCfgLock`

**AppleIntelCPUPM**:
* `AppleCpuPmCfgLock`

**DellSMBIOSPatch**:
* `CustomSMBIOSGuid -> YES`
* `UpdateSMBIOSMode -> Custom`

**KextsToPatch**:
* `Kernel -> Patch`

**KernelToPatch**:
* `Kernel -> Patch`

# Rt Variables

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

 `PlatformInfo -> Generic`

# System Parameters

**NvidiaWeb**: 

What this does is apply ```sudo nvram nvda_drv=1``` on every boot. To get a similar effect you can find it under the following path:

```NVRAM -> Add -> 7C436110-AB2A-4BBB-A880-FE41995C9F82 -> nvda_drv: <31>```

