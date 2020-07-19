# Penryn(Core2 Series)

**Overall**:

* Follow Ivy Bridge setup for most config options:
  * [Desktop Ivy Bridge](../../config.plist/ivy-bridge.md)
* Must use [DuetPkg](../../extras/legacy.md) virtually no Penryn boards supported UEFI
* Mojave and newer will need Telemetry due to the SSE4 requirement:  
  * [Telemetrap](https://forums.macrumors.com/threads/mp3-1-others-sse-4-2-emulation-to-enable-amd-metal-driver.2206682/page-4?post=28447707#post-28447707)
* Lion(10.7) through High Sierra(10.13) are officially supported
  * macOS Mojave through Big Sur is possible with Telemetrap

**ACPI**

* Ignore SSDT-PM

**DeviceProperties**:

* Ignore DeviceProperties section
* See here for iGPU setup:
  * [GMA950](https://www.applelife.ru/threads/intel-gma950-32bit-only.22726/)
  * [GMA X3100](https://www.applelife.ru/threads/intel-gma-x3100-zavod.36617/)
  * For Mountain Lion and newer, iGPU must be disabled
  
**SMBIOS**:

* Desktop:
  * iMac10,1 Snow Leopard(10.6) to High Sierra(10.13)
    * Not supported by OpenCore by default, see here: [Adding older SMBIOS to OpenCore](../../config.plist/legacy.md#adding-older-smbios-to-opencore)
  * iMac13,2 for Mojave(10.14) and Catalina(10.15)
  * iMac14,4 for Big Sur(11)
