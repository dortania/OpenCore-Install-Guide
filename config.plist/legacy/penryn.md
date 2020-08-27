# Penryn(Core2 Series)

* Note: A 64bit CPU with SSE3(or higher) will be a requirement for 10.8 and newer
  * 10.6 and 10.7 are bootable with 32 bit based systems, however will require the appropriate SMBIOS

**Overall**:

* Follow Ivy Bridge setup for most config options:
  * [Desktop Ivy Bridge](../../config.plist/ivy-bridge.md)
* Must use [DuetPkg](../../extras/legacy.md) virtually no Penryn boards supported UEFI
* Mojave and newer will need Telemetry due to the SSE4 requirement:  
  * [Telemetrap](https://forums.macrumors.com/threads/mp3-1-others-sse-4-2-emulation-to-enable-amd-metal-driver.2206682/page-4?post=28447707#post-28447707)
* Mountain Lion(10.8) through High Sierra(10.13) are supported
  * This is due to Lilu requiring 10.8 as minimum to operate
  * macOS Mojave through Big Sur is possible with Telemetrap
  * 10.7 and older are possible if Lilu and plugin's have their MinKernel value set to 12.0.0 and use FakeSMC for older OSes

**ACPI**

* Ignore SSDT-PM

**Booter**

* No properties should be required with DuetPkg, entire quirk section can be disabled
  * Note that users planning to boot 10.6 and below may require RebuildAppleMemoryMap to be enabled to avoid an early kernel panic

**DeviceProperties**:

* Ignore DeviceProperties section
* See here for iGPU setup:
  * [GMA950](https://www.applelife.ru/threads/intel-gma950-32bit-only.22726/)
  * [GMA X3100](https://www.applelife.ru/threads/intel-gma-x3100-zavod.36617/)
  * For Mountain Lion and newer, iGPU must be disabled
  
**SMBIOS**:

* Desktop(32 bit):
  * iMac6,1 Tiger(10.4) to Lion(10.7)

* Desktop(64 Bit):
  * iMac10,1 Snow Leopard(10.6) to High Sierra(10.13)
  * iMac13,2 for Mojave(10.14) and Catalina(10.15)
  * iMac15,1 for Big Sur(11)
