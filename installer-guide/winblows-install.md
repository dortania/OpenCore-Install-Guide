# Creando el instalador en Windows 

* Versión soportada: 0.5.9

Si bien no necesitas una nueva instalación de macOS para usar OpenCore, algunos usuarios prefieren tener una nueva instalación con sus actualizaciones del gestor de arranque.

Para comenzar necesitarás lo siguiente:

* Un USB de 4GB (o más)
* [GibMacOS](https://github.com/corpnewt/gibMacOS)

## Descargando macOS

Para comenzar, abre gibMacOS.bat como administrador y selecciona `Toggle Recovery-Only`:

![](../images/installer-guide/winblows-install-md/gib-default.png)

Ahora busca la versión de macOS que necesitas, en este ejemplo seleccionaremos la opción 5 para macOS Catalina:

![](../images/installer-guide/winblows-install-md/gib-recovery.png)

Esto descargará el RecoveryHDMetaDmg.pkg a `\gibmacos-master\macOS Downloads\publicrelease\xxx-xxxxx - 10.x.x macOS xxx`

![](../images/installer-guide/winblows-install-md/gib-done.png)

## Creando el instalador

Ahora, abre el archivo `MakeInstall.bat` como administrador y selecciona tu USB con su número y la opción 0 para OpenCore (en el ejemplo, seleccionamos 1O)

![](../images/installer-guide/winblows-install-md/make-install.png)

Una vez que el disco esté formateado, te preguntará por el `RecoveryHDMetaDMG.pkg` que descargamos anteriormente. La esquina superior izquierda de la ventana del archivo le permitirá copiar la ruta del archivo:

![](../images/installer-guide/winblows-install-md/make-install-location.png)

![](../images/installer-guide/winblows-install-md/recovery-location.png)

MakeInstall terminará instalando OpenCore a la partición EFI de tu USB, podrás encontrar esta partición con el nombre `BOOT`:

![](../images/installer-guide/winblows-install-md/make-install-done.png)

![](../images/installer-guide/winblows-install-md/EFI-base.png)

### Ahora con todo esto hecho

... dirígete a [Configurando la EFI](/installer-guide/opencore-efi.md) para terminar tu trabajo.
