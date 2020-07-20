# Gathering files

* Supported version: 0.5.9

Esta sección es para obtener otros archivos necesarios para arrancar macOS, esperamos que conozcas bien tu hardware  antes de comenzar y que hayas hecho un hackintosh antes, ya que no entraremos en detalle aquí. 

> ¿Cuál es la mejor manera de averiguar si mi hardware es compatible?

Consulta la [**Página de limitaciones de hardware**](/macos-limits.md) para obtener una mejor idea de lo que requiere macOS para arrancar, el soporte de hardware entre Clover y OpenCore es bastante similar.

> ¿Cuáles son algunas formas de averiguar qué hardware tengo?

En general, la página de especificaciones del producto tiene toda la información que necesitas, pero si todavía tienes problemas, hay algunas opciones:

* **Windows**:
  * [Speccy](https://www.ccleaner.com/speccy)
  * Administrador de dispositivos
* **Linux**:
  * Correr `hwinfo` en la terminal

## Drivers del firmware

Los controladores de firmware son controladores utilizados por OpenCore en el entorno UEFI. Se requieren principalmente para arrancar una computadora, ya sea ampliando la capacidad de parcheo de OpenCore o mostrándole diferentes tipos de discos en el selector de OpenCore (específicamente, discos HFS).

* **Dato a tener en cuenta sobre la ubicación**: Estos archivos **deben** colocarse en `EFI / OC / Drivers /`

### Universal

Para la mayoría de los sistemas, solo necesitarás 2 controladores `.efi` para comenzar a funcionar:

* [HfsPlus.efi](https://github.com/acidanthera/OcBinaryData/blob/master/Drivers/HfsPlus.efi)
  * Necesario para ver volúmenes HFS (es decir, instaladores de macOS y particiones/imágenes de recuperación). **No mezclar con otros drivers HFS**
* [OpenRuntime.efi](https://github.com/acidanthera/OpenCorePkg/releases)
  * Reemplazo para [AptioMemoryFix.efi](https://github.com/acidanthera/AptioFixPkg), usado como una extensión para OpenCore que sirve para ayudar a parchear boot.efi, para arreglos relacionados a NVRAM y para una mejor administración de memoria.

### Usuarios Legacy 

Además de lo anterior, si tu hardware no es compatible con UEFI (2011 y anterior), necesitarás lo siguiente. Presta atención a cada entrada, ya que es posible que no necesites todas:

* [OpenUsbKbDxe.efi](https://github.com/acidanthera/OpenCorePkg/releases)
  * Se utiliza para el menú de selección de OpenCore en **sistemas legacy que ejecutan DuetPkg**, [no recomendado e incluso dañino en UEFI (Ivy Bridge y más reciente)](https://applelife.ru/threads/opencore-obsuzhdenie-i-ustanovka.2944066/page-176#post-856653)
* [HfsPlusLegacy.efi](https://github.com/acidanthera/OcBinaryData/blob/master/Drivers/HfsPlusLegacy.efi)
  * Variante legacy de HfsPlus, utilizada para sistemas que carecen de soporte de instrucción RDRAND. Esto se ve generalmente en Sandy Bridge y anteriores.

Para obtener una lista completa de los drivers compatibles, consulta la [Página de conversión a Clover](https://github.com/dortania/OpenCore-Install-Guide/tree/master/clover-conversion). Estos archivos irán a tu carpeta de drivers, encontrada en tu EFI.

## Kexts

Un kexts es una extensión del kernel, o **k**ernel **ext**ension en inglés, puedes pensar en esto como un driver para macOS, estos archivos irán a la carpeta Kexts en su EFI.

* **Windows and Linux note**: Kexts will look like normal folders in your OS, **double check** that the folder you are installing has a .kext extension visible(and do not add one manually if it's missing).
  * If any kext also includes a `.dSYM` file, you can simply delete it. They're only for debugging purposes.
* **Location Note**: These files **must** be placed under `EFI/OC/Kexts/`.

All kext listed below can be found **pre-compiled** in the [Kext Repo](http://kexts.goldfish64.com/). Kexts here are compiled each time there's a new commit.

### Must haves

Without the below 2, no system is bootable:

* [VirtualSMC](https://github.com/acidanthera/VirtualSMC/releases)
  * Emulates the SMC chip found on real macs, without this macOS will not boot
  * Alternative is FakeSMC which can have better or worse support, most commonly used on legacy hardware.
* [Lilu](https://github.com/acidanthera/Lilu/releases)
  * A kext to patch many processes, required for AppleALC, WhateverGreen, VirtualSMC and many other kexts. Without Lilu, they will not work

### VirtualSMC Plugins

The below plugins are not required to boot, and merely add extra functionality to the system like hardware monitoring:

* SMCProcessor.kext
  * Used for monitoring CPU temperature, **doesn't work on AMD CPU based systems**
* SMCSuperIO.kext
  * Used for monitoring fan speed, **doesn't work on AMD CPU based systems**
* SMCLightSensor.kext
  * Used for the ambient light sensor on laptops, **desktops can ignore**
  * Do not use if you don't have an ambient light sensor, can cause issues otherwise
* SMCBatteryManager.kext
  * Used for measuring battery readouts on laptops, **desktops can ignore**
  * Do not use until battery has been properly patched, can cause issues otherwise

### Graphics

* [WhateverGreen](https://github.com/acidanthera/WhateverGreen/releases)
  * Used for graphics patching DRM, boardID, framebuffer fixes, etc, all GPUs benefit from this kext.
  * Note the SSDT-PNLF.dsl file included is only required for laptops and AIOs, see [Getting started with ACPI](https://dortania.github.io/Getting-Started-With-ACPI/) for more info

### Audio

* [AppleALC](https://github.com/acidanthera/AppleALC/releases)
  * Used for AppleHDA patching, used for giving you onboard audio. AMD 15h/16h may have issues with this and Ryzen/Threadripper systems rarely have mic support

### Ethernet

Here we're going to assume you know what ethernet card your system has, reminder that product spec pages will most likely list the type of network card.

* [IntelMausi](https://github.com/acidanthera/IntelMausi/releases)
  * Required for the majority of Intel NICs, chipsets that are based off of I211 will need the SmallTreeIntel82576 kext
  * Intel's 82578, 82579, i217, i218 and i219 NICs are officially supported
* [SmallTreeIntel82576 kext](https://github.com/khronokernel/SmallTree-I211-AT-patch/releases)
  * Required for i211 NICs, based off of the SmallTree kext but patched to support I211
  * Required for most AMD boards running Intel NICs
* [AtherosE2200Ethernet](https://github.com/Mieze/AtherosE2200Ethernet/releases)
  * Required for Atheros and Killer NICs
* [RealtekRTL8111](https://github.com/Mieze/RTL8111_driver_for_OS_X/releases)
  * For Realtek's Gigabit Ethernet
* [LucyRTL8125Ethernet](https://github.com/Mieze/LucyRTL8125Ethernet)
  * For Realtek's 2.5Gb Ethernet
* For Intel's i225-V NICs, patches are mentioned in the desktop Comet Lake DeviceProperty section. No kext is required.

### USB

* [USBInjectAll](https://github.com/Sniki/OS-X-USB-Inject-All/releases)
  * Used for injecting Intel USB controllers on systems without defined USB ports in ACPI
  * Not needed on Skylake and newer(AsRock is dumb and does need this)
  * Does not work on AMD CPUs **at all**

* [XHCI-unsupported](https://github.com/RehabMan/OS-X-USB-Inject-All)
  * Needed for non-native USB controllers
  * AMD CPU based systems don't need this
  * Common chipsets needing this:
    * H370
    * B360
    * H310
    * Z390(Not needed on Mojave and newer)
    * X79
    * X99
    * AsRock boards(On Intel motherboards specifically, Z490 boards do not need it however)

### WiFi and Bluetooth

* [AirportBrcmFixup](https://github.com/acidanthera/AirportBrcmFixup/releases)
  * Used for patching non-Apple Broadcom cards, **will not work on Intel, Killer, Realtek, etc**
* [BrcmPatchRAM](https://github.com/acidanthera/BrcmPatchRAM/releases)
  * Used for uploading firmware on Broadcom Bluetooth chipset, required for all non-Apple/Fenvi Airport cards.
  * To be paired with BrcmFirmwareData.kext
    * BrcmPatchRAM3 for 10.14+ (must be paired with BrcmBluetoothInjector)
    * BrcmPatchRAM2 for 10.11-10.14
    * BrcmPatchRAM for 10.10 or older

The order in `Kernel -> Add` should be:

1. BrcmBluetoothInjector
2. BrcmFirmwareData
3. BrcmPatchRAM3

### AMD CPU Specific kexts

* [~~NullCPUPowerManagment~~](https://www.youtube.com/watch?v=dQw4w9WgXcQ)
  * We have a much better solution known as `DummyPowerManagement` found under `Kernel -> Quirks` in your config.plist, this will be covered in a later page
* [XLNCUSBFIX](https://cdn.discordapp.com/attachments/566705665616117760/566728101292408877/XLNCUSBFix.kext.zip)
  * USB fix for AMD FX systems, not recommended for Ryzen
* [VoodooHDA](https://sourceforge.net/projects/voodoohda/)
  * Audio for FX systems and front panel Mic+Audio support for Ryzen system, do not mix with AppleALC. Audio quality is noticeably worse than AppleALC on Zen CPUs

### Extras

* [AppleMCEReporterDisabler](https://github.com/acidanthera/bugtracker/files/3703498/AppleMCEReporterDisabler.kext.zip)
  * Useful starting with Catalina to disable the AppleMCEReporter kext which will cause kernel panics on AMD CPUs and dual-socket systems
  * Affected SMBIOS:
    * MacPro6,1
    * MacPro7,1
    * iMacPro1,1
* [CpuTscSync](https://github.com/lvs1974/CpuTscSync)
  * Needed for syncing TSC on some of Intel's HEDT and server motherboards, without this macOS may be extremely slow or even unbootable. Skylake-X should use TSCAdjustReset instead
* [TSCAdjustReset](https://github.com/interferenc/TSCAdjustReset)
  * On Skylake-X, many firmwares including Asus and EVGA won't write the TSC to all cores. So we'll need to reset the TSC on cold boot and wake. Compiled version can be found here: [TSCAdjustReset.kext](https://github.com/dortania/OpenCore-Install-Guide/blob/master/extra-files/TSCAdjustReset.kext.zip). Note that you **must** open up the kext(ShowPackageContents in finder, `Contents -> Info.plist`) and change the Info.plist -> `IOKitPersonalities -> IOPropertyMatch -> IOCPUNumber` to the number of CPU threads you have starting from `0`(i9 7980xe 18 core would be `35` as it has 36 threads total)
* [NVMeFix](https://github.com/acidanthera/NVMeFix/releases)
  * Used for fixing power management and initialization on non-Apple NVMe, requires macOS 10.14 or newer

### Laptop Specifics

To figure out what kind of keyboard and trackpad you have, check Device Manager in Windows or `dmesg |grep input` in Linux

#### Input drivers

* [VoodooPS2](https://github.com/acidanthera/VoodooPS2/releases)
  * Required for systems with PS2 keyboards and trackpads
  * Trackpad users should also pair this with [VoodooInput](https://github.com/acidanthera/VoodooInput/releases)(This must come before VoodooPS2 in your config.plist)
* [VoodooI2C](https://github.com/alexandred/VoodooI2C/releases)
  * Used for fixing I2C devices, found with some fancier touchpads and touchscreen machines
  * To be paired with a plugin:
    * VoodooI2CHID - Implements the Microsoft HID device specification.
    * VoodooI2CElan - Implements support for Elan proprietary devices. (does not work on ELAN1200+, use the HID instead)
    * VoodooI2CSynaptics - Implements support for Synaptic's proprietary devices.
    * VoodooI2CFTE - Implements support for the FTE1001 touchpad.
    * VoodooI2CUPDDEngine - Implements Touchbase driver support.

#### Misc

* [NoTouchID](https://github.com/al3xtjames/NoTouchID/releases)
  * Recommended for MacBook SMBIOS that include a TouchID sensor to fix auth issues, generally 2016 and newer SMBIOS will require this

Please refer to [Kexts.md](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/Kexts.md) for a full list of supported kexts

## SSDTs

So you see all those SSDTs in the AcpiSamples folder and wonder whether you need any of them. For us, we will be going over what SSDTs you need in **your specific ACPI section of the config.plist**, as the SSDTs you need are platform specific. With some even system specific where they need to be configured and you can easily get lost if I give you a list of SSDTs to choose from now.

[Getting started with ACPI](https://dortania.github.io/Getting-Started-With-ACPI/) has an extended section on SSDTs including compiling them on different platforms.

A quick TL;DR of needed SSDTs(This is source code, you will have to compile them into a .aml file):

### Desktop

| Platforms | **CPU** | **EC** | **AWAC** | **NVRAM** | **USB** |
| :-------: | :-----: | :----: | :------: | :-------: | :-----: |
| SandyBridge | [CPU-PM](https://dortania.github.io/OpenCore-Post-Install/universal/pm.html#sandy-and-ivy-bridge-power-management) (Run in Post-Install) | [SSDT-EC](https://dortania.github.io/Getting-Started-With-ACPI/Universal/ec-fix.html) | N/A | N/A | N/A |
| Ivy Bridge | ^^ | ^^ | N/A | N/A | N/A |
| Haswell | [SSDT-PLUG](https://dortania.github.io/Getting-Started-With-ACPI/Universal/plug.html) | ^^ | ^^ | ^^ | ^^ |
| Broadwell | ^^ | ^^ | ^^ | ^^ | ^^ |
| Skylake | ^^ | [SSDT-EC-USBX](https://dortania.github.io/Getting-Started-With-ACPI/Universal/ec-fix.html) | ^^ | ^^ | ^^ |
| Kaby Lake | ^^ | ^^ | ^^ | ^^ | ^^ |
| Coffee Lake | ^^ | ^^ | [SSDT-AWAC](https://dortania.github.io/Getting-Started-With-ACPI/Universal/awac.html) | [SSDT-PMC](https://dortania.github.io/Getting-Started-With-ACPI/Universal/nvram.html) | ^^ |
| Comet Lake | ^^ | ^^ | ^^ | ^^ | [SSDT-RHUB](https://dortania.github.io/Getting-Started-With-ACPI/Universal/rhub.html) |
| AMD (15/16/17h) | N/A | ^^ | N/A | N/A | N/A |

### High End Desktop

| Platforms | **CPU** | **EC** | **AWAC** |
| :-------: | :-----: | :----: | :------: |
| Ivy Bridge-E | [SSDT-PLUG](https://dortania.github.io/Getting-Started-With-ACPI/Universal/plug.html) | [SSDT-EC](https://dortania.github.io/Getting-Started-With-ACPI/Universal/ec-fix.html) | N/A |
| Haswell-E | ^^ | [SSDT-EC-USBX](https://dortania.github.io/Getting-Started-With-ACPI/Universal/ec-fix.html) | ^^ |
| Broadwell-E | ^^ | ^^ | ^^ |
| Skylake-X | ^^ | ^^ | [SSDT-AWAC](https://dortania.github.io/Getting-Started-With-ACPI/Universal/awac.html) |

### Laptop

| Platforms | **CPU** | **EC** | **Backlight** | **I2C Trackpad** | **AWAC** | **USB** | **IRQ** |
| :-------: | :-----: | :----: | :-----------: | :--------------: | :------: | :-----: | :-----: |
| SandyBridge | [CPU-PM](https://dortania.github.io/OpenCore-Post-Install/universal/pm.html#sandy-and-ivy-bridge-power-management) (Run in Post-Install) | [SSDT-EC](https://dortania.github.io/Getting-Started-With-ACPI/Universal/ec-fix.html) | [SSDT-PNLF](https://dortania.github.io/Getting-Started-With-ACPI/Laptops/backlight.html) | [SSDT-GPI0](https://dortania.github.io/Getting-Started-With-ACPI/Laptops/trackpad.html) | N/A | N/A | [IRQ SSDT](https://dortania.github.io/Getting-Started-With-ACPI/Universal/irq.html) |
| Ivy Bridge | ^^ | ^^ | ^^ | ^^ | ^^ | ^^ | ^^ |
| Haswell | [SSDT-PLUG](https://dortania.github.io/Getting-Started-With-ACPI/Universal/plug.html) | ^^ | ^^ | ^^ | ^^ | ^^ | ^^ |
| Broadwell | ^^ | ^^ | ^^ | ^^ | ^^ | ^^ | ^^ |
| Skylake | ^^ | [SSDT-EC-USBX](https://dortania.github.io/Getting-Started-With-ACPI/Universal/ec-fix.html) | ^^ | ^^ | ^^ | ^^ | N/A |
| Kaby Lake | ^^ | ^^ | ^^ | ^^ | ^^ | ^^ | ^^ |
| Coffee Lake (8th Gen) | ^^ | ^^ | [SSDT-PNLF-CFL](https://dortania.github.io/Getting-Started-With-ACPI/Laptops/backlight.html) | ^^ | ^^ | ^^ | ^^ |
| Coffee Lake (9th Gen) | ^^ | ^^ | ^^ | ^^ | [SSDT-AWAC](https://dortania.github.io/Getting-Started-With-ACPI/Universal/awac.html) | ^^ | ^^ |
| Comet Lake | ^^ | ^^ | ^^ | ^^ | ^^ | ^^ | ^^ |
| Ice Lake | ^^ | ^^ | ^^ | ^^ | ^^ | [SSDT-RHUB](https://dortania.github.io/Getting-Started-With-ACPI/Universal/rhub.html) | ^^ |

# Now with all this done, head to [Getting Started With ACPI](https://dortania.github.io/Getting-Started-With-ACPI/)
