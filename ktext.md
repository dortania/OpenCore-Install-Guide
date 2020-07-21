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

Un kext es una extensión del kernel, o **k**ernel **ext**ension en inglés, puedes pensar en esto como un driver para macOS, estos archivos irán en la carpeta Kexts en tu EFI.

* **Nota para Windows y Linux**: Los kexts se verán como carpetas normales en tu sistema operativo, **verifica** que la carpeta que estás instalando tiene una extensión .kext visible (y no agregues una manualmente si falta).
  * Si cualquier kext también include un archivo `.dSYM`, puedes simplemente eliminarlo, ya que sólo son para depuración. 
* **Nota importante sobre la ubicación**: Estos archivos **deben** ser puestos en `EFI/OC/Kexts/`.

Todos los kexts mencionados abajo pueden ser encontrados **pre-compilados** [en el repositorio de kexts](http://kexts.goldfish64.com/). Los kexts aquí son compilados cada vez que hay un commit. 

### Kexts imprescindibles

Sin los siguientes 2, ningún sistema es booteable:

* [VirtualSMC](https://github.com/acidanthera/VirtualSMC/releases)
  * Emula el chip SMC que se encuentra en Macs reales, sin este macOS no se iniciará
  * La alternativa es FakeSMC, que puede tener mejor o peor soporte, más comúnmente utilizado en hardware Legacy.
* [Lilu](https://github.com/acidanthera/Lilu/releases)
  * Un kext para parchear muchos procesos, requerido para AppleALC, WhateverGreen, VirtualSMC y muchos otros kexts. Sin Lilu, no funcionarán.

### Plugins de VirtualSMC

Los complementos a continuación no son necesarios para bootear, y simplemente agregan funcionalidad adicional al sistema, como la supervisión del hardware:

* SMCProcessor.kext
  * Utilizado para monitorear la temperatura de la CPU, **No funciona en sistemas basados en CPUs de AMD**
* SMCSuperIO.kext
  * Utilizado para monitorear la velocidad de los ventiladores, **No funciona en sistemas basados en CPUs de AMD**
* SMCLightSensor.kext
  * Utilizado para el sensor de luz ambiental en laptops, **las computadoras de escritorio pueden ignorar esto**
  * No lo uses si no tienes un sensor de luz ambiental, de lo contrario este kext puede causar problemas
* SMCBatteryManager.kext
  * Utilizado para medir lecturas de batería en laptops, **las computadoras de escritorio pueden ignorar esto**
  * No usar hasta que la batería haya sido parcheada correctamente, de lo contrario puede causar problemas

### Gráficos

* [WhateverGreen](https://github.com/acidanthera/WhateverGreen/releases)
  * Utilizado para DRM, el boardID, arreglos del framebuffer, etc., todas las GPUs se benefician de este kext.
  * Tenga en cuenta que el archivo SSDT-PNLF.dsl incluido solo se requiere para laptops y computadoras All-In-One, consulte [Introducción a ACPI](https://dortania.github.io/Getting-Started-With-ACPI/) para obtener más información

### Audio

* [AppleALC](https://github.com/acidanthera/AppleALC/releases)
  * Se usa para parchear AppleHDA, el cual se usa para brindarte audio integrado. AMD 15h/16h pueden tener problemas con esto y los sistemas Ryzen/Threadripper rara vez tienen soporte de micrófono.

### Ethernet

Ahora asumiremos que sabes qué tarjeta de ethernet tiene tu sistema, recuerda que las páginas de especificaciones probablemente incluyan esta información

* [IntelMausi](https://github.com/acidanthera/IntelMausi/releases)
  * Requerido por la mayoría de NICs de Intel, chipsets basados en I211 necesitarán el kext SmallTreeIntel82576.
  * Los NICs 82578, 82579, i217, i218 e i219 de Intel son soportados oficialmente.
* [SmallTreeIntel82576 kext](https://github.com/khronokernel/SmallTree-I211-AT-patch/releases)
  * Necesario para NICs i211 de Intel, este kext está basado en el kext SmallTree pero ha sido parcheado para soportar I211.
  * Necesario para la mayoría de placas base AMD con NICs de Intel
* [AtherosE2200Ethernet](https://github.com/Mieze/AtherosE2200Ethernet/releases)
  * Necesario para NICs Atheros y Killer
* [RealtekRTL8111](https://github.com/Mieze/RTL8111_driver_for_OS_X/releases)
  * Para el Ethernet Gigabit de Realtek
* [LucyRTL8125Ethernet](https://github.com/Mieze/LucyRTL8125Ethernet)
  * Para el Ethernet Realtek de 2.5Gb
* Para las NICs i225-V de Intel, los parches se mencionan en la sección de "Device Properties" en la guía para Comet Lake de escritorio. No se requiere kext.

### USB

* [USBInjectAll](https://github.com/Sniki/OS-X-USB-Inject-All/releases)
  * Se utiliza para inyectar controladores USB Intel en sistemas sin puertos USB definidos en ACPI
  * No necesario en SkyLake y posterior (AsRock es tonto y necesita esto)
  * **No funciona** en CPUs de AMD

* [XHCI-unsupported](https://github.com/RehabMan/OS-X-USB-Inject-All)
  * Necesario para controladores USB no nativos
  * Sistemas basados en CPUs de AMD no necesitan esto
  * Chipsets que comúnmente necesitan esto:
    * H370
    * B360
    * H310
    * Z390 (No necesario en Mojave y posterior)
    * X79
    * X99
    * Placas madre AsRock (en las placas base Intel específicamente, sin embargo las placas Z490 no lo necesitan)

### WiFi y Bluetooth

* [AirportBrcmFixup](https://github.com/acidanthera/AirportBrcmFixup/releases)
  * Se usa para parchear tarjetas Broadcom que no son de Apple, **no funcionará en Intel, Killer, Realtek, etc.**
* [BrcmPatchRAM](https://github.com/acidanthera/BrcmPatchRAM/releases)
  * Se utiliza para cargar firmware en el chipset Bluetooth Broadcom, requerido para todas las tarjetas que no sean Apple/Airport de Fenvi.
  * Debe ser emparejado con BrcmFirmwareData.kext
    * BrcmPatchRAM3 para 10.14+ (debe estar acompañado de BrcmBluetoothInjector)
    * BrcmPatchRAM2 para 10.11-10.14
    * BrcmPatchRAM para 10.10 o anterior

El órden en `Kernel -> Add` debe ser:

1. BrcmBluetoothInjector
2. BrcmFirmwareData
3. BrcmPatchRAM3

### Kexts específicos de AMD

* [~~NullCPUPowerManagment~~](https://www.youtube.com/watch?v=dQw4w9WgXcQ)
  * Tenemos una solución mucho mejor conocida como `DummyPowerManagement` que se encuentra en `Kernel -> Quirks` en su config.plist, esto se tratará en una página luego
* [XLNCUSBFIX](https://cdn.discordapp.com/attachments/566705665616117760/566728101292408877/XLNCUSBFix.kext.zip)
  * Arreglo de USBs para sistemas AMD FX, no recomendado para Ryzen
* [VoodooHDA](https://sourceforge.net/projects/voodoohda/)
  * Audio para sistemas FX y soporte de Mic+Audio en panel frontal para sistemas Ryzen, no mezclar con AppleALC. La calidad de audio es notablemente peor que AppleALC en CPUs Zen

### Extras

* [AppleMCEReporterDisabler](https://github.com/acidanthera/bugtracker/files/3703498/AppleMCEReporterDisabler.kext.zip)
  * Útil desde Catalina en adelante para deshabilitar el kext AppleMCEReporter que causará pánicos en el kernel en las CPUs AMD y los sistemas de doble socket.
  * SMBIOS afectadas:
    * MacPro6,1
    * MacPro7,1
    * iMacPro1,1
* [CpuTscSync](https://github.com/lvs1974/CpuTscSync)
  * Necesario para sincronizar el TSC en algunas de las placas madre de servidores y HEDT de Intel, sin este macOS puede ser extremadamente lento o incluso no booteable. Skylake-X debería usar TSCAdjustReset en su lugar
* [TSCAdjustReset](https://github.com/interferenc/TSCAdjustReset)
  * En Skylake-X, muchos firmwares, incluidos Asus y EVGA, no escribirán el TSC en todos los núcleos, por lo que tendremos que restablecer el TSC en el arranque en frío y en la reactivación luego de suspender el PC. La versión compilada se puede encontrar aquí: [TSCAdjustReset.kext](https://github.com/dortania/OpenCore-Install-Guide/blob/master/extra-files/TSCAdjustReset.kext.zip). Ten en cuenta que  **debe** abrir el kext (Mostrar contenidos del paquete en Finder, `Contents -> Info.plist`) y cambiar el Info.plist -> `IOKitPersonalities -> IOPropertyMatch -> IOCPUNumber` a la cantidad de hilos de CPU que tener desde `0` (por ejemplo, el i9 7980xe, que tiene 18 núcleos sería `36`,  ya que tiene 36 hilos en total)

* [NVMeFix](https://github.com/acidanthera/NVMeFix/releases)
  * Se utiliza para arreglar la administración de energía y la inicialización en NVMes que no sean de Apple, requiere macOS 10.14 o posterior

### Específicos de laptops

Para saber qué tipo de teclado y trackpad tienes, consulta el Administrador de dispositivos en Windows o `dmesg | grep input` en Linux

#### Input drivers

* [VoodooPS2](https://github.com/acidanthera/VoodooPS2/releases)
  * Necesario para sistemas con teclados y trackpads PS/2
  * Usuarios de Trackpad también deben emparejar esto con [VoodooInput](https://github.com/acidanthera/VoodooInput/releases) (Esto debe aparecer antes que VoodooPS2 en tu config.plist)
* [VoodooI2C](https://github.com/alexandred/VoodooI2C/releases)
  * Se utiliza para reparar dispositivos I2C, los cuales se encuentran en algunas laptops con touchpads y pantallas táctiles más elegantes. 
  * Debe ser emparejado a un plugin:
    * VoodooI2CHID - Implementa la especificación del dispositivos HID de Microsoft.
    * VoodooI2CElan - Implementa soporte para dispositivos propietarios de Elan. (no funciona en ELAN1200 +, usa el HID en vez de este)
    * VoodooI2CSynaptics - Implementa soporte para dispositivos propietarios de Synaptics.
    * VoodooI2CFTE - Implementa soporte para el touchpad FTE1001.
    * VoodooI2CUPDDEngine - Implementa el soporte de drivers Touchbase.

#### Otros

* [NoTouchID](https://github.com/al3xtjames/NoTouchID/releases)
  * Recomendado para SMBIOS de MacBook que incluyen un sensor TouchID para solucionar problemas de autenticación, generalmente las SMBIOS de 2016 en adelante requerirán esto

Consulta [Kexts.md](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/Kexts.md) para obtener una lista completa de los kexts compatibles

## SSDTs

Probablemente cuando veas todos esos SSDTs en la carpeta AcpiSamples te preguntarás si necesitas alguno de ellos. Por eso, ahora repasaremos qué SSDT(s) necesitas en **TU sección ACPI específica de tu config.plist**, ya que los SSDTs que necesitas son específicos de cada plataforma. Algunos pueden ser incluso específicos de algun sistema en particular donde deben configurarse. Es posible que te pierdas fácilmente si te doy una lista de SSDTs para elegir.

[Comenzando con ACPI](https://dortania.github.io/Getting-Started-With-ACPI/) htiene una sección más a fondo sobre SSDTs que incluye la información de cómo compilarlos en diferentes plataformas.

Un dato rápido importante de los SSDTs necesarios por si no lo sabías (este es el código fuente, deberás compilarlos en un archivo .aml):

### PCs de escritorio

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

### PCs de escritorio de gama alta

| Platforms | **CPU** | **EC** | **AWAC** |
| :-------: | :-----: | :----: | :------: |
| Ivy Bridge-E | [SSDT-PLUG](https://dortania.github.io/Getting-Started-With-ACPI/Universal/plug.html) | [SSDT-EC](https://dortania.github.io/Getting-Started-With-ACPI/Universal/ec-fix.html) | N/A |
| Haswell-E | ^^ | [SSDT-EC-USBX](https://dortania.github.io/Getting-Started-With-ACPI/Universal/ec-fix.html) | ^^ |
| Broadwell-E | ^^ | ^^ | ^^ |
| Skylake-X | ^^ | ^^ | [SSDT-AWAC](https://dortania.github.io/Getting-Started-With-ACPI/Universal/awac.html) |

### Laptops

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

# Ahora, con todo esto hecho dirígete a [Comenzando con ACPI](https://dortania.github.io/Getting-Started-With-ACPI/)
