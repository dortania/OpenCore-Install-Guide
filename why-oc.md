
# ¿Por qué OpenCore encima de Clover y otros?

* Versión soportada 0.5.9

Esta sección es un breve resumen de por qué la comunidad ha estado haciendo la transición a OpenCore. Aquellos que solo quieren una máquina con macOS pueden omitir esta página.

## Características de OpenCore

* En promedio, los sistemas con OpenCore se inician más rápido que los que usan Clover, ya que se realizan menos parches innecesarios.
* Mejor estabilidad general debido a que los parches pueden ser mucho más precisos:
  * [Actualización 10.15.4 de macOS (Post en inglés)](https://www.reddit.com/r/hackintosh/comments/fo9bfv/macos_10154_update/)
  * Los parches AMD no necesitan actualizarse con cada actualización de seguridad menor
* Mayor seguridad en general:
  * No es necesario deshabilitar la Protección de integridad del sistema (SIP)
  * Soporte de FileVault 2 incorporado
  * [Vaulting](https://dortania.github.io/OpenCore-Post-Install/universal/security.html#Vault) Permite crear EFIs instantáneas que eviten modificaciones no deseadas
  * Soporte de arranque seguro o "secure boot" (actualmente en auditoría de seguridad, vendrá próximamente)
* Cambios de SO con BootCamp y la selección del dispositivo de arranque son compatibles ya que OpenCore lee las variables NVRAM configuradas por el disco de arranque como una Mac real.
* Omite la tecla de acceso rápido de arranque a través de boot.efi. Mantener presionada la tecla Option o ESC al inicio para elegir un dispositivo de arranque, Cmd + R para ingresar a Recuperación o Cmd + Opt + P + R para restablecer NVRAM.

## Soporte de Software

La principal razón por la que alguien puede querer cambiar de otros gestores de arranque a OpenCore es en realidad por el soporte de software:

* No se hacen mas pruebas de Kexts con Clover:
  * Tienes un bug con un kext? Muchos desarrolladores incluyendo la organización [Acidanthera](https://github.com/acidanthera), la cual hace la mayoría de tus Kexts favoritos, no te darán soporte a menos que estés utilizando OpenCore.
* Muchos drivers de firmware han sido fusionados en OpenCore:
  * [Soporte de APFS](https://github.com/acidanthera/AppleSupportPkg)
  * [Soporte de FileVault](https://github.com/acidanthera/AppleSupportPkg)
  * [Parches de Firmware](https://github.com/acidanthera/AptioFixPkg)
* [Parches para AMD](https://github.com/AMD-OSX/AMD_Vanilla/tree/opencore):
  * Tienes hardware basado en AMD? Bueno, los parches de kernel requeridos para iniciar macOS ya no están soportados por Clover, y sólo funcionan con OpenCore. 

## Inyección de Kexts

Para entender mejor el sistema de inyección de Kexts de OpenCore, primero debemos mirar cómo funciona Clover:

1. Parchea el SIP para deshabilitarlo
2. Parchea para habilitar el código zombie del XNU para poder inyectar kexts
3. Parchea la condición de carrera con inyección de kexts
4. Inyecta los kexts
5. Parchea el SIP para habilitarlo de nuevo

Cosas a tener en cuenta con el método de Clover:

* El llamado al código zombie del XNU no se ha utilizado desde 10.7, es sorprendente que Apple no haya quitado este código aún.
  * Con este parche, las actualizaciones del SO se rompen frecuentemente, como ha ocurrido recientemente con macOS 10.14.4 y 10.15
  * Deshabilita el SIP y luego intenta habilitarlo nuevamente, no creo que sea necesario decir mucho más. 
* Probablemente se rompa con 10.16
* Soporta macOS hasta versiones antiguas (10.5 en adelante)

Hechémosle un vistazo al método de OpenCore:

1. Toma el llamado "prelinked kernel" y kexts listos para inyectar
2. Reconstruye el caché en el ambiente del EFI con los nuevos kexts
3. Agrega este nuevo cache

Cosas a tener en cuenta con el método de OpenCore:

* El formato del "prelinked kernel" sigue siendo el mismo desde 10.6, por lo que es más dificil perder soporte. 
  * Esto significa que el soporte comienza en 10.7, pero 10.6 puede ser utilizado debido a que esta versión no tiene un "prelinked kernel"
* Es mucho más estable, ya que se hacen mucho menos parches.