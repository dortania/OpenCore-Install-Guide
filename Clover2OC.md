# Converting common properties from Clover to Opencore's Config.plist


# Inject AMD

Using an old GPU that's reliant on the "inject" property?:


InjectIntel:
* 
* 
* 

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

**WIFI**

**XHCI**

* device-id
* device_type
* device_type
*
*
*
*

**IMEI**

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

# Disable Drivers

# Gui

# Graphics

# Kernel and Kext Patches

# Rt Variables

# SMBIOS






# System Parameters

**Custom UUID**: 

**Backlight Level**:

**Inject Kext**:

**No Caches**:

**Inject SystemID**:

**ExposeSysVaraibles**:

**NvidiaWeb**: 

What this does is apply ```sudo nvram nvda_drv=1``` on every boot. To get a similar effect you can find it under the following path:

```NVRAM -> Add -> 7C436110-AB2A-4BBB-A880-FE41995C9F82 -> nvda_drv: <31>```

# Booter

* DiscardAppleS4Map
* EnableAppleSmSlide
* ForceExitBootServices
* ProtectCsmRegion
* SetupAppleMap: YES
* SetupAppleSlide: YES
* ShrinkMemoryMap
