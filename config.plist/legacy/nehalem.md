# Nehalem and Westmere(First Gen i-series and Xeon)

**Overall**:

* Follow Ivy Bridge setup for most config options:
  * [Desktop Ivy Bridge](../../config.plist/ivy-bridge.md)
* Must use [DuetPkg](../../extras/legacy.md) as virtually no boards from this generation supported UEFI
* Mountain Lion(10.8) through High Sierra(10.13) are supported
  * This is due to Lilu requiring 10.8 as minimum to operate
  * macOS Lion(10.7 and Big Sur(11) is possible with iGPU disabled

**DeviceProperties**:

* See here for iGPU setup:
  * [First generation Intel HD Graphics on macOS](https://github.com/Goldfish64/ArrandaleGraphicsHackintosh)
  * [1st Generation Intel HD Graphics QE/CI](https://github.com/acidanthera/WhateverGreen/blob/master/Manual/FAQ.IntelHD.en.md#intel-hd-graphics-first-generation--ironlake-arrandale-processors)
  * For Mojave and newer, iGPU must be disabled

**SMBIOS**:

* Consumer Desktop:
  * iMac11,1, iMac11,2 or iMac11,3 for Snow Leopard(10.6) to High Sierra(10.13)
    * Not supported by OpenCore by default, see here: [Adding older SMBIOS to OpenCore](../../config.plist/legacy.md#adding-older-smbios-to-opencore)
  * iMac13,2 for Mojave(10.14) and Catalina(10.15)
  * iMac14,4 for Big Sur(11)
* Server/HEDT desktop
  * MacPro5,1 for Lion(10.7) through Mojave(10.14)
  * MacPro6,1 for Catalina(10.15) and Big Sur(11)
* Laptop(Snow Leopard(10.6) to High Sierra(10.13)):
  * MacBookPro6,1
    * Not supported by OpenCore by default, see here: [Adding older SMBIOS to OpenCore](../../config.plist/legacy.md#adding-older-smbios-to-opencore)
  * MacBookPro6,2
    * Not supported by OpenCore by default, see here: [Adding older SMBIOS to OpenCore](../../config.plist/legacy.md#adding-older-smbios-to-opencore)
