# Configuración de tu config.plist

Ahora que tenemos todos nuestros Kexts (.kext), SSDTs (.aml) y drivers del firmware (.efi), tu USB debería comenzar a verse así:

![](../images/config/config-universal/almost-done.png)

* **Nota**: Tu USB **va a verse distinto**, el sistema de cada uno tendrá requisitos diferentes.

## Creando tu config.plist

Primero queremos tomar el sample.plist desde el [OpenCorePkg](https://github.com/acidanthera/OpenCorePkg/releases), podrás encontrar este archivo dentro de la carpeta `Docs`:

![](../images/config/config-universal/sample-location.png)

Luego, muévelo a la partición EFI de tu USB (se llamará BOOT en Windows) en `EFI/OC/`, y cámbiale el nombre a config.plist:

![](../images/config/config-universal/renamed.png)

## Agregando tus SSDTs, kexts y Drivers del Firmware

Para el resto de esta guía, necesitarás alguna forma de editar plists. En nuestro caso utilizaremos las herramientas Propertree y GenSMBIOS hechas por [CorpNewt](https://github.com/corpnewt) para automatizar parte del trabajo tedioso. 

* [ProperTree](https://github.com/corpnewt/ProperTree)
  * Editor de plists
* [GenSMBIOS](https://github.com/corpnewt/GenSMBIOS)
  * Para generar los datos de nuestra SMBIOS

Next, let's open ProperTree and edit our config.plist:

* `ProperTree.command`
  * Para macOS
  * Consejo: hay una archivo llamado `buildapp.command` en la carpeta `Scripts` que te permite convertir ProperTree en una aplicación dedicada en macOS
* `ProperTree.bat`
  * Para Windows

Una vez que ProperTree se esté ejecutando, abra su config.plist presionando ** Cmd / Ctrl + O ** y seleccionando el archivo `config.plist` en su USB.

Después de abrir la configuración, presiona **Cmd/Ctrl+Shift+R** y apunta a tu carpeta EFI/OC para realizar un "Clean Snapshot":

* Esto eliminará todas las entradas de config.plist y luego agregará todos sus SSDTs, Kexts y Drivers del Firmware a la configuración
* **Cmd/Ctrl+R** es otra opción que agregará todos sus archivos también, pero dejará las entradas deshabilitadas si se configuraron así antes, esto es útil para cuando estés solucionando problemas, pero para nosotros no es necesario en este momento

![](../images/config/config-universal/before-snapshot.png)

Una vez hecho esto, verás tus SSDT, Kexts y Drivers de firmware incluidos en tu config.plist:

![](../images/config/config-universal/after-snapshot.png)

Si deseas limpiar un poco el archivo, puedes eliminar las entradas `# WARNING`. Sin embargo si las dejas esto no causará problemas, así que depende tu preferencia personal.

## Seleccionando tu plataforma

Ahora viene la parte importante, seleccionar la ruta a seguir para configurar tu config.plist. Cada plataforma tiene sus propias peculiaridades que debes tener en cuenta, por lo que conocer tu hardware es muy importante. Ve a continuación lo que debes seguir:


### PC de escritorio Intel

| Nombre clave | Series | época |
| :--- | :--- | :--- |
| [Ivy Bridge](/config.plist/ivy-bridge.md) | 3XXX | 2012  |
| [Haswell](/config.plist/haswell.md) | 4XXX | 2013-2014 |
| [Skylake](/config.plist/skylake.md) | 6XXX | 2015-2016 |
| [Kaby Lake](/config.plist/kaby-lake.md) | 7XXX | 2017 |
| [Coffee Lake](/config.plist/coffee-lake.md) | 8XXX-9XXX | 2017-2019 |
| [Comet Lake](/config.plist/comet-lake.md) | 10XXX | 2020 |

### Laptops Intel

| Nombre clave | Series | época |
| :--- | :--- | :--- |
| [Ivy Bridge](/config-laptop.plist/ivy-bridge.md) | 3XXX | 2012 |
| [Haswell](/config-laptop.plist/haswell.md) | 4XXX | 2013-2014 |
| [Skylake](/config-laptop.plist/skylake.md) | 6XXX | 2015-2016 |
| [Kaby Lake y Amber Lake](/config-laptop.plist/kaby-lake.md) | 7XXX | 2017 |
| [Coffee Lake](/config-laptop.plist/coffee-lake.md) | 8XXX | 2017-2018 |
| [Coffee Lake Plus y Comet Lake](/config-laptop.plist/coffee-lake.md) | 9XXX-10XXX | 2019-2020 |
| [Ice Lake](/config-laptop.plist/ice-lake.md) | 10XXX | 2019-2020 |

### PCs de gama alta de Intel

Esta sección incluye tanto hardware de entusiastas como servidores.

| Nombre clave | Series | época |
| :--- | :--- | :--- |
| [Haswell-E](/config-HEDT/haswell-e.md) | 5XXX | 2014 |
| [Broadwell-E](/config-HEDT/broadwell-e.md) | 6XXX | 2016 |
| [Skylake/Cascade Lake-X/W](/config-HEDT/skylake-x.md) | 7XXX, 9XXX, 10XXX | 2017-2019 |

### AMD

| Nombre clave | Series | época |
| :--- | :--- | :--- |
| [Bulldozer/Jaguar](/AMD/fx.md) | [Es raro](https://en.wikipedia.org/wiki/Advanced_Micro_Devices) | [AMD era muy malo con los nombres en esos tiempos](https://en.wikipedia.org/wiki/Advanced_Micro_Devices) |
| [Zen](/AMD/zen.md) | 1XXX, 2XXX, 3XXX | 2017-2020 |

* Nota: Threadripper de 3ra gen (39XX) no son compatibles, sin embargo, los de primera y seguna generación lo son.

### Legacy

Ten en cuenta que estas son solo pautas y no serán guías completas como en las otras generaciones. Esto se debe principalmente a la falta de pruebas en estos sistemas, información verificable y soporte general de la comunidad, ya que este hardware se usa cada vez menos.

| Nombre clave | Series | época |
| :--- | :--- | :--- |
| [Penryn](/config.plist/legacy/penryn.md) | [demasiadas](https://en.wikipedia.org/wiki/Penryn_(microarchitecture)) | 2008-2010 |
| [Nehalem y Westmere](/config.plist/legacy/nehalem.md) | 7XX, 8XX, 9XX | 2008-2010 |
| [Sandy Bridge](/config.plist/legacy/sandy-bridge.md) | 2XXX | 2011 |
| [Sandy y Ivy bridge-E](/config.plist/legacy/sandy-bridge-e.md) | 2XXX, 3XXX | 2011-2013 |
