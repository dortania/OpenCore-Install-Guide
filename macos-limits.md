# Limitaciones de Hardware

Con macOS, hay numerosas limitaciones de hardware que debes tener en cuenta antes de iniciar una instalación. Esto se debe a la cantidad limitada de hardware que admite Apple, por lo que estamos limitados por Apple o por los parches que ha creado la comunidad.

Las secciones principales a verificar son:

* [CPU](#cpu-support)
* [GPU](#gpu-support)
* [Placa base](#motherboard-support)
* [Almacenamiento](#storage-support)
* [Internet cableado (Ethernet)](#wired-networking)
* [Internet inalámbrico (WiFi)](#wireless-networking)
* [Otros](#miscellaneous)

Para guías más detalladas en el tema, véase:

* [GPU Buyers Guide](https://dortania.github.io/GPU-Buyers-Guide/)
  * Verifica si tu GPU es compatible y qué version de macOS puedes correr. 
* [Wireless Buyers Guide](https://dortania.github.io/Wireless-Buyers-Guide/)
  * Verifica si tu tarjeta WiFi es compatible.
* [Anti-Hardware Buyers Guide](https://dortania.github.io/Anti-Hackintosh-Buyers-Guide/)
  * Guía en general en qué evitar y qué problemas podrías enfrentarte con tus componentes. 

## Soporte de CPUs

Para el soporte de CPUs, tenemos el siguiente desglose:

* Las CPUs de escritorio de Intel son compatibles.
  * Esta guía soporta desde Ivy Bridge hasta Comet Lake.
* CPUs de gama alta y servidores de Intel.
  * Esta guía soporta desde Haswell-E hasta Cascade Lake X.
* CPUs de la serie i y Xeon para laptops
  * Esta guía soporta desde Ivy Bridge hasta Ice Lake.
  * A tener en cuenta: Las CPUs de la serie Atom, Celeron y Pentium no son compatibles.
* Las series Bulldozer (15h), Jaguar (16h) y Ryzen (17h) AMD de escritorio.
  * CPUs de laptop **no** son compatibles.
  * Ten en cuenta que ThreadRipper de tercera generación no está oficialmente soportado sin un KVM (máquina virtual), pero ThreadRipper de primera y segunda generación son compatibles.

**Para obtener información más detallada, consulta aquí: [Guía de compradores Anti-Hackintosh](https://dortania.github.io/Anti-Hackintosh-Buyers-Guide/)**

## Soporte de GPUs

El soporte de GPUs se vuelve mucho más complicado debido a la cantidad casi infinita de GPUs en el mercado, pero el desglose general es el siguiente:

* Las GPUs AMD basadas en GCN son compatibles con las versiones más recientes de macOS.
  * Sin embargo, las APUs de AMD no son compatibles.
  * Las GPUs de AMD con [núcleos basados en Lexa](https://www.techpowerup.com/gpu-specs/amd-lexa.g806) de la serie Polaris tampoco son compatibles.
* El soporte de GPUs de Nvidia es complicado:
  * Las GPUs de la serie [Maxwell(9XX)](https://en.wikipedia.org/wiki/GeForce_900_series) y [Pascal(10XX)](https://en.wikipedia.org/wiki/GeForce_10_series) están limitadas a macOS 10.13: High Sierra
  * La serie de GPUs [Tuning de Nvidia(20XX,](https://en.wikipedia.org/wiki/GeForce_20_series)[16XX)](https://en.wikipedia.org/wiki/GeForce_16_series) **no son compatibles con ninguna versión de macOS**
  * Las GPUs de la serie [Kepler(7XX)](https://en.wikipedia.org/wiki/GeForce_700_series) son compatibles en las series más nuevas de macOS (Incluyendo macOS 11: Big Sur)
    * Esto es debido a que Apple sigue soportando algunas [MacBook Pros con GPUs de Nvidia](https://dortania.github.io/GPU-Buyers-Guide/modern-gpus/nvidia-gpu.html)
* iGPUs de Intel de la serie [GT2+](https://en.wikipedia.org/wiki/Intel_Graphics_Technology) 
  * Esta guía cubre iGPUs desde Ivy Bridge hasta Ice lake
  * Cabe mencionar que GT2 se refiere a la serie del iGPU, iGPUs de la serie GT1, encontrada en Pentiums, Celerons y Atoms no son compatibles con macOS.

Una nota importante para las **Laptops con GPU dedicada**:

* El 90% de las GPUs dedicadas en laptops no funcionarán porque están cableadas en una configuración que macOS no admite (gráficos intercambiables). Con las GPUs dedicadas de NVIDIA, esto generalmente se llama Optimus. No es posible utilizar estas GPUs para la pantalla interna, por lo que generalmente se recomienda desactivarlas y apagarlas (se tratará más adelante en esta guía).
* Sin embargo, en algunos casos, la GPU dedicada alimenta cualquier salida externa (HDMI, mini DisplayPort, etc.), que puede o no funcionar; en caso de que funcione, deberás mantener la tarjeta en funcionamiento.
* Sin embargo, hay algunas laptops que en raros casos no tienen gráficos intercambiables, por lo que se puede usar la tarjeta dedicada (si es compatible con macOS). Sin embargo, el cableado y la configuración de estas generalmente causan problemas.

**Si quieres una lista completa de las GPUs compatibles, visita la [Guía de compra de GPUs](https://dortania.github.io/GPU-Buyers-Guide/)**

## Soporte de placas base

En su mayor parte, todas las placas base son compatibles siempre que la CPU lo sea tambíen. La única excepción es:

* [La placas base AMD B550](https://www.amd.com/en/chipsets/b550)

Actualmente no hay soluciones para las placas además de ejecutarse en una KVM (máquina virtual), similar a las CPUs ThreadRipper de tercera generación de AMD.

## Compatibilidad de almacenamiento

En su mayor parte, todas las unidades basadas en SATA son compatibles y la mayoría de las unidades NVMe también. Sin embargo, tenemos unas pocas excepciones:

* **SSDs NVMe Samsung PM981, PM991 y Micron 2200S**
  * Estos SSD no son compatibles desde el primer momento (lo que causa un "kernel panic") y, por lo tanto, requieren de [NVMeFix.kext](https://github.com/acidanthera/NVMeFix/releases) para corregir este problema. Ten en cuenta que estas unidades pueden causar problemas de arranque incluso con NVMeFix.kext.
  * Otro caso similar fue con la SSD NVMe 970 EVO Plus de Samsung, pero esto fue corregido con una actualización de firmware. Puedes obtenerla via Windows usando la herramienta Samsung Magician o con una ISO booteable [aquí](https://www.samsung.com/semiconductor/minisite/ssd/download/tools/).
  * También para tener en cuenta, las computadoras portátiles que usan [Intel Optane](https://www.intel.com/content/www/us/en/architecture-and-technology/optane-memory.html) o [Micron 3D XPoint](https://www.micron.com/products/advanced-solutions/3d-xpoint-technology) para la aceleración de discos duros, no son compatibles con macOS. Sin embargo algunos usuarios han reportado éxito en Catalina incluso con soporte de lectura y escritura, pero recomendamos encarecidamente quitar la unidad para evitar posibles problemas de arranque.

## Conexión a internet cableada (Ethernet)

Prácticamente todos los adaptadores de red con cable tienen algún tipo de soporte en macOS, ya sea por los controladores incorporados o por kexts hechos por la comunidad. Las principales excepciones son:

* Ethernet i225 2.5GBe de Intel
  * Encontrado en placas base Comet Lake de gama alta de escritorio.
  * Son postibles soluciones alternativas: [Fuente](https://www.hackintosh-forum.de/forum/thread/48568-i9-10900k-gigabyte-z490-vision-d-er-läuft/?postID=606059#post606059) y [Ejemplo](/config.plist/comet-lake#add-2)
* NICs de servidores de Intel
  * Hay soluciones alternativas para los chipsets [X520 y X540](https://www.tonymacx86.com/threads/how-to-build-your-own-imac-pro-successful-build-extended-guide.229353/)
* NICs de servidores Mellanox y Qlogic

## Conexión a internet inalámbrica (WiFi)

La mayoría de las tarjetas WiFi que vienen con las laptops no son compatibles, ya que generalmente son Intel/Qualcomm. Si tienes suerte, es posible que tengas una tarjeta Atheros compatible, pero son compatibles hasta High Sierra.

La mejor opción es tener una tarjeta Broadcom compatible; consulta la [Guía de compras de WiFi](https://dortania.github.io/Wireless-Buyers-Guide/) para obtener recomendaciones.

## Otros

* **Sensores de huellas**
  * Actualmente no hay forma de emular el sensor Touch ID, por lo que los sensores de huellas digitales no funcionarán.
* **Reconocimiento Facial con Windows Hello**
  * Algunas laptops vienen con WHFR que está conectado a I2C (y se usa a través de tu iGPU), esas no funcionarán.
  * Otras vienen con WHFR que está conectado por USB, y si tienes suerte, puedes obtener la funcionalidad de la cámara, pero nada más.
* **Tecnología Intel Smart Sound**
  * Las laptops con Intel SST no tendrán nada conectado a través de ellas (generalmente micrófono interno) funcionando, ya que no es compatible. Puedes consultar con el Administrador de dispositivos en Windows.
* **Combo de headphone jack**
  * Es posible que algunas laptops con un headphone jack combinado para auriculares no reciban la entrada de audio a través de ellas y tengan que usar el micrófono incorporado o un dispositivo externo de entrada de audio a través de USB.
* **Puertos Thunderbolt USB-C**
  * En el caso de los hackintosh, la compatibilidad con Thunderbolt todavía es dudosa en macOS, aún más con los controladores Alpine Ridge, que son los que tienen la mayoría de las laptops actuales. Han habido intentos de mantener el controlador encendido, lo que permite que funcionen Thunderbolt y USB-C, pero esto trae como consecuencia "kernel panics" y/o la pérdida de USB-C después de suspender la laptop. Si deseas utilizar el lado USB-C del puerto y poder suspender tu hack, debes enchufarlo en el arranque y mantenerlo enchufado.
  * Nota: Esto no se aplica solo a los puertos USB-C, solo a los puertos combinados Thunderbolt 3 y USB-C.
  * Deshabilitar Thunderbolt en la BIOS también resolverá esto.
