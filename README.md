# Creando el USB

* Versión soportada: 0.5.9

Requerimientos:

* [OpenCorePkg](https://github.com/acidanthera/OpenCorePkg/releases), altamente recomendado utilizar la versión debug para obtener más información.
* [ProperTree](https://github.com/corpnewt/ProperTree) para editar archivos .plist (OpenCore Configurator es otra herramienta pero está altamente desactualizada y la versión de Mackie es conocida por corromper .plists. **Por favor  evita este tipo de herramientas a toda costa**.
* NVRAM limpia (Esto es de gran importancia si has usado Clover antes, ya que muchas variables seguirán causando conflictos. Afortunadamente con OpenCore puedes usar la herramienta `CleanNvram` en su menú cuando `AllowNvramReset` está habilitado en tu configuración)
* Conocimiento básico de cómo funciona un Hackintosh y qué archivos requiere (por ejemplo el tipo de controlador de red) 
* Debes quitar Clover de tu sistema por completo si deseas usar OpenCore como tu gestor de arranque. Sin embargo, haz una copia de seguridad de tu EFI basada en Clover. Dirígete aquí para ver qué debe ser limpiado de tu sistema:[Conversión de Clover](https://github.com/dortania/OpenCore-Install-Guide/tree/master/clover-conversion)

# Creando el instalador

Dependiendo en el SO que estés corriendo, visita tu sección específica:

* [Usuarios de macOS](/installer-guide/mac-install.md)
  * Si estás corriendo Sierra/versiones anteriores a sierra, dirígete aquí [Legacy macOS install](https://github.com/dortania/OpenCore-Install-Guide/blob/master/installer-guide/legacy-mac-install.md)
* [Usuarios de Windows](/installer-guide/winblows-install.md)
* [Usuarios de Linux](/installer-guide/linux-install.md)
