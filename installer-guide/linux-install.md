# Creando el instalador en Linux

* Versión soportada: 0.5.9

Si bien no necesitas una nueva instalación de macOS para usar OpenCore, algunos usuarios prefieren tener una nueva instalación con sus actualizaciones del gestor de arranque.

Para comenzar necesitarás lo siguiente:

* Un USB de 4GB
* [GibMacOS](https://github.com/corpnewt/gibMacOS)

## Descargando macOS

Ahora, para comenzar, corre gibmacOS.py en la terminal con `Toggle Recovery-Only`:

* `python gibMacOS.command -r`

Ahora busca a la versión de macOS que estás buscando, en este ejemplo utilizaremos la opción 5 para macOS Catalina:

![](../images/installer-guide/linux-install-md/1-gib.png)

Esto descargará el RecoveryHDMetaDmg.pkg a `\gibmacos-master\macOS Downloads\publicrelease\xxx-xxxxx - 10.x.x macOS xxx`

![](../images/installer-guide/linux-install-md/3-gib-finished.png)

## Creando el instalador

Esta sección tendrá como objetivo crear las distintas particiones en tu USB. Puedes utilizar tu programa favorito, ya sea `gdisk`` fdisk` `parted`` gparted` o `gnome-disks`. Esta guía se centrará en `gdisk` ya que es agradable y puede cambiar el tipo de partición más adelante, ya que la necesitamos para que macOS Recovery HD pueda arrancar. (La distro utilizada aquí es Ubuntu 18.04, otras versiones o distros pueden funcionar)


Créditos a [midi1996](https://github.com/midi1996) por su trabajo en la [guía de instalación por Internet](https://midi1996.github.io/hackintosh-internet-install-gitbook/), en la que esta guía está basada. 

### Método 1

En la terminal

1. Corre `lsblk` y determina el bloque de tu USB
2. Corre `sudo gdisk /dev/<el bloque de tu USB>`
   1. Si eres preguntado qué mapa de particiones usar, selecciona GPT.
      ![](../images/installer-guide/linux-install-md/unknown-5.png)
   2. Manda `p` para imprimir los bloques de las particiones \(y verifica que es la que necesitas\)
      ![](../images/installer-guide/linux-install-md/unknown-6.png)
   3. Manda `o` para borrar la tabla de particiones y crear una nueva GPT (si no está vacía)
      1. Confirma con `y`
         ![](../images/installer-guide/linux-install-md/unknown-8.png)
   4. Manda `n`
      1. `número de la partición`:  mantener en blanco para usar el predeterminado 
      2. `primer sector`:  mantener en blanco para usar el predeterminado 
      3. `segundo sector`:  mantener en blanco para usar el disco entero
      4. `Código hexadecimal o GUID`: `0700` para el tipo de partición de datos básicos de Microsoft
   5. Manda `w`
      * Confirma con `y`
      ![](../images/installer-guide/linux-install-md/unknown-9.png)
      * En algunos casos es necesario reiniciar, pero raramente. Si quieres estar seguro, reinicia tu computadora. También puedes intentar volver a enchufar tu USB.
   6. Cierra `gdisk` mandando `q` (normalmente debería cerrarse solo)
3. Usa `lsblk` para determinar los identificadores de tu partición.
4. Corre `sudo mkfs.vfat -F 32 -n "OPENCORE" /dev/<el bloque de partición de tu USB>` para formatear tu USB a FAT32 y llamarlo OPENCORE
5. Luego usa `cd` a `gibmacos-master/macOS\ Downloads/publicrelease/xxx-xxxxx - 10.x.x macOS xxx` y deberías llegar a un archigo `pkg`. 
   ![](../images/installer-guide/linux-install-md/unknown-10.png)
   1. descarga `p7zip-full` \(dependiendo en las herramientas de tu distro\)
      * para Ubuntu/Basadas en Ubuntu corre `sudo apt install p7zip-full`
      * para arch arch/basadas en arch corre `sudo pacman -S p7zip`
      * para el resto, deberías saber como hacerlo
      * para todas las distros: **asegúrate que estas usando bash para que 7zip funcione**.
   2. corre esto `7z e -txar *.pkg *.dmg; 7z e *.dmg */Base*` para extraer `BaseSystem.dmg` y `BaseSystem.chunklist`
   3. monta tu partición USB con `udisksctl` (`udisksctl mount -b /dev/<el bloque de partición de tu USB>`, (sudo no es requerido en la mayoría de los casos) o con `mount` (`sudo mount /dev/<el bloque de partición de tu USB> /donde/montas/tus/cosas`, sudo es necesario)
   4. `cd` a tu USB y `mkdir com.apple.recovery.boot` en el root de la partición FAT32 de tu USB
   5. ahora `cp` o `rsync` ambos `BaseSystem.dmg` y `BaseSystem.chunklist` a la carpeta`com.apple.recovery.boot`.

### Método 2 (en caso de que el método 1 no funcionó)

En la terminal:

1. corre `lsblk` y determina el bloque de tu dispositivo USB
   ![](../images/installer-guide/linux-install-md/unknown-11.png)
2. corre `sudo gdisk /dev/<your USB block>`
   0. si eres preguntado qué tabla de particiones usar, selecciona GPT.
      ![](../images/installer-guide/linux-install-md/unknown-12.png)
   1. manda `p` para imprimir el bloque de tus particiones \(y verifica que es la que necesitas\)
      ![](../images/installer-guide/linux-install-md/unknown-13.png)
   2. manda `o` para eliminar el mapa de particiones y para crear una nueva con GPT (si no está vacía)
      1. confirma con `y`
         ![](../images/installer-guide/linux-install-md/unknown-14.png)
   3. manda `n`
      1. `número de la partición`:  mantener en blanco para usar el predeterminado 
      2. `primer sector`:  mantener en blanco para usar el predeterminado
      3. `segundo sector`:  mantener en blanco para usar el disco entero
      4. `Código hexadecimal o GUID`: `0700` para el tipo de partición de datos básicos de Microsoft
      ![](../images/installer-guide/linux-install-md/unknown-15.png)
   4. manda `n`
      1. numero de la partición: mantener en blanco para usar el predeterminadokeep 
      2. primer sector: mantener en blanco para usar el predeterminado
      3. último sector: mantener en blanco por defecto \(o puedes hacerlo `+3G` si deseas particionar aún más el resto del USB\)
      4. Código hexadecimal o GUID: `af00` para el tipo de particiones de Apple (HFS/HFS+)
      ![](../images/installer-guide/linux-install-md/unknown-16.png)
   5. manda `w`
      * Confirma con `y`
      ![](../images/installer-guide/linux-install-md/unknown-17.png)
      * En algunos casos es necesario reiniciar, pero raramente. Si quieres estar seguro, reinicia tu computadora. También puedes intentar volver a enchufar tu USB.
   6. Cierra `gdisk` mandando `q` (normalmente debería cerrarse solo)
3. Usa `lsblk` de nuevo para determinar el disco de 200MB y la otra partición
   ![](../images/installer-guide/linux-install-md/unknown-18.png)
4. corre `sudo mkfs.vfat -F 32 -n "OPENCORE" /dev/<tu bloque de particiones de 200MB>` para formatear la partición de 200MB a FAT32 y ponerle el nombre "OPENCORE"
5. luego usa `cd` a `gibmacos-master/macOS\ Downloads/publicrelease/xxx-xxxxx - 10.x.x macOS xxx` y deberías obtener un archivo `pkg`
   ![](../images/installer-guide/linux-install-md/unknown-19.png)
   1. descarga `p7zip-full` \(dependiendo en las herramientas de tu distro\)
      * para Ubuntu/Basadas en Ubuntu corre `sudo apt install p7zip-full`
      * para arch arch/basadas en arch corre `sudo pacman -S p7zip`
      * para el resto, deberías saber como hacerlo
      * para todas las distros: **asegúrate que estas usando bash para que 7zip funcione**.
   2. corre esto `7z e -txar *.pkg *.dmg; 7z e *.dmg */Base*` para extraer `BaseSystem.dmg` y `BaseSystem.chunklist`
   3. descarga `dmg2img` (disponible en la mayoria de las distros)
   4. corre `dmg2img -l BaseSystem.dmg` y determina qué partición tiene la propiedad `disk image` property
      ![](../images/installer-guide/linux-install-md/unknown-20.png)
   5. corre `dmg2img -p <el número de la partición> -i BaseSystem.dmg -o <tu bloque de partición 3GB+>` para extraer y escribir la imagen de recuperación a la partición
      * Esto llevará un tiempo. Y aún más si estás usando un USB lento.
      ![](../images/installer-guide/linux-install-md/unknown-21.png)

## Ahora con todo esto hecho, dirígete a [Configurando tu EFI](../installer-guide/opencore-efi.md) para terminar tu trabajo
