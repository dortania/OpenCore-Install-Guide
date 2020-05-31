# Config setup for Legacy Hardware

While this guide will not cover the entirety of config setup for hardware not included in this guide, we will however give some pointers as to the specifics of installing with older hardware.

Note that critical thinking and google will be required.

## Sandy Bridge(Second Generation i-series)

Actually almost identical to an Ivy Bridge hack, the main things that need to be changed:

* Follow Ivy Bridge setup for most config options
* Must use [DuetPkg](https://dortania.github.io/OpenCore-Desktop-Guide/extras/legacy.html) as most Sandy Bridge motherboards do not support UEFI
* IMEI will need to be faked if running Sandy Bridge CPU on an Ivy Bridge based chipset(B75, Q75, Q77, H77, Z75, Z77)
  * [device-id method](https://github.com/acidanthera/WhateverGreen/blob/master/Manual/FAQ.IntelHD.en.md#intel-hd-graphics-20003000-sandy-bridge-processors)
  * [SSDT-IMEI Method](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-IMEI.dsl)
* iGPU setup is different
  * Use `AAPL,snb-platform-id` instead of `AAPL,ig-platform-id`
    * Desktop iGPU only:
    * `AAPL,snb-platform-id | Data | 10000300`
    * `device-id | Data | 26010000`
    * Desktop iGPU + dGPU:
    * `AAPL,snb-platform-id | Data | 00000500`
    * `device-id | Data | 26010000`
  * For Mojave and newer, iGPU must be disabled
* SMBIOS will depend on macOS version
  * iMac12,1 or iMac12,2 for High Sierra and older
  * iMac13,2 for Mojave and newer

## Clarkdale/Arrendale(First Generation i-series)

* Follow Ivy Bridge setup for most config options
* Must use [DuetPkg](https://dortania.github.io/OpenCore-Desktop-Guide/extras/legacy.html) virtually no Arrendale boards supported UEFI
* Ignore DeviceProperties section
* See here for iGPU setup: [1st Generation Intel HD Graphics QE/CI](https://www.insanelymac.com/forum/topic/286092-guide-1st-generation-intel-hd-graphics-qeci/?hl=%20vertek)
  * For Mojave and newer, iGPU must be disabled
* SMBIOS will depend on macOS version
  * iMac11,1, iMac11,2 or iMac11,3 for High Sierra and older
  * iMac13,2 for Mojave and newer

## Penryn(Core2 Series)

* Follow Ivy Bridge setup for most config options
* Must use [DuetPkg](https://dortania.github.io/OpenCore-Desktop-Guide/extras/legacy.html) virtually no Penryn boards supported UEFI
* Ignore DeviceProperties section
* See here for iGPU setup:
  * [GMA950](https://www.applelife.ru/threads/intel-gma950-32bit-only.22726/)
  * [GMA X3100](https://www.applelife.ru/threads/intel-gma-x3100-zavod.36617/)
  * For Mountain Lion and newer, iGPU must be disabled
* SMBIOS will depend on macOS version
  * iMac10,1 High Sierra and older
  * iMac13,2 for Mojave and newer
* Mojave and newer will need Telemetry fixed:
  * [Telemetrap](https://forums.macrumors.com/threads/mp3-1-others-sse-4-2-emulation-to-enable-amd-metal-driver.2206682/page-4?post=28447707#post-28447707)
