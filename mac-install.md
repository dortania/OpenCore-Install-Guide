
# Creando el instalador en macOS

* Versión soportada 0.5.9

Si bien no necesitas una nueva instalación de macOS para usar OpenCore, algunos usuarios prefieren tener una nueva instalación con sus actualizaciones del gestor de arranque.

Para comenzar, queremos obtener una copia de macOS, puedes omitir esto y dirigirte a formatear el USB si solo estás haciendo un dispositivo de arranque con OpenCore y no un instalador. Para los demás, pueden descargar macOS de la App Store o con gibMacOS

**Nota para usuarios legacy**

1. Primero sigan la sección [Instalación Legacy](/extras/legacy.html)
2. Una vez terminado, continúen la guía en la sección de **[Descargando macOS](#downloading-macos)**.

Aquellos que necesiten versiones de macOS que no son alojadas en el catálogo de Apple, pueden seguir la siguiente guía (en inglés): [Legacy macOS install](https://github.com/dortania/OpenCore-Install-Guide/blob/master/installer-guide/legacy-mac-install.md) 

## Downloading macOS

Desde una computadora con macOS que cumple los requerimientos de la versión del SO que quieres instalar, vé directamente a el AppStore y descarga la versión de macOS que desees, y continúa en [**Configurando el instalador**](#setting-up-the-installer)

Para las computadoras que necesiten una versión específica de macOS o que no tengan acceso a el AppStore para descargar la versión deseada, pueden usar la herramienta GibMacOS

Ahora, obtén [GibMacOS](https://github.com/corpnewt/gibMacOS) y descomprímelo a un directorio local. 

Luego, corre el archivo `gibMacOS.command`:

![](../images/installer-guide/mac-install-md/gib.png)

Como puedes ver, obtenemos una lista de instaladores de macOS. Si necesitas versiones beta de este SO, puedes seleccionar `C. Change Catalog`. En este ejemplo escogeremos la opción 1:

![](../images/installer-guide/mac-install-md/gib-process.png)

Esto tomará un rato ya que estamos descargando el instalador completo de macOS (8gb+), así que recomendamos que leas el resto de la guía mientras esperas. 

Una vez terminado, tendremos que correr el archivo `BuildmacOSInstallApp.command`:

![](../images/installer-guide/mac-install-md/gib-location.png)

Se te solicitarán los archivos del instalador de macOS que ya fueron descargados a una carpeta llamada `macOS Downloads` en el directorio de GibMacOS.

Desde Finder, busca la carpeta que contiene los archivos descargados y luego arrástralos a la terminal o usa "Cmd+C¨y pégalo en la terminal (cualquiera de las dos). 

Una vez que la operación haya terminado, sal de la herramienta, encontrarás el archivo de instalación en el directorio. 

Mueve esta aplicación a la carpeta de Aplicaciones, esto nos será útil para la siguiente sección:

![](../images/installer-guide/mac-install-md/gib-done.png)

## Setting up the installer

Ahora formatearemos el USB para prepararlo para el instalador de macOS y OpenCore. Querremos utilizar el formato macOS Extended (HFS+) con el mapa de particiones GUID. Esto creará dos particiones, la principal, `MyVolume` y una segunda llamada `EFI`, la cual es la partición de arranque donde el firmware buscará archivos de arranque. 

* Ten en cuenta que la Utilidad de Discos muestra solamente las particiones por defecto, presiona Cmd/Win+2 para mostrar todos los dispositivos (o alternativamente presiona el botón de vista)

![Formateando el USB](../images/installer-guide/mac-install-md/format-usb.png)

Luego de esto, corre el comando `createinstallmedia`, proveído por [Apple](https://support.apple.com/en-us/HT201372), Ten en cuenta que el comando está hecho para USBs formateados con el nombre `MyVolume`:

```
sudo /Applications/Install\ macOS\ Catalina.app/Contents/Resources/createinstallmedia --volume /Volumes/MyVolume
```

Esto tomará un tiempo así que si quieres ve a buscar un café o continúa leyendo la guía (en realidad no deberías estar siguiendo la guía paso a paso sin haberla leído antes)

También puedes reemplazar la ruta de el comando `createinstallmedia` con la ruta de donde está localizado el instalador que descargaste previamente, lo mismo con el nombre del disco. 

## Configurar el entorno de OpenCore

Configurar el entorno de OpenCore es simple, todo lo que necesitas hacer es montar la partición EFI de tu USB. Esto es hecho automáticamente cuando formateamos un disco con GUID, pero esta partición esta desmontada por defecto, aquí es cuando nuestro amigo [MountEFI](https://github.com/corpnewt/MountEFI) entra a jugar:

![MountEFI](../images/installer-guide/mac-install-md/mount-efi-usb.png)

Te darás cuenta que cuando abrimos la partición EFI, esta está vacía. Aquí comienza lo divertido. 

![Partición EFI vacía](../images/installer-guide/mac-install-md/base-efi.png)

### Ahora, con todo esto hecho

... dirígete a [Configurando la EFI](/installer-guide/opencore-efi.md) para terminar tu trabajo.
