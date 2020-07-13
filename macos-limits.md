# Hardware Limitations

With laptops, there are several limitations regarding hardware that will not work.

* **Low End iGPUs**
  * With macOS, support for iGPUs start at the [GT2 tier](https://en.wikipedia.org/wiki/Intel_Graphics_Technology), this means many low end iGPUs found on Celerons, Pentiums, and Atoms will not work. For a full list, see the [GPU Buyers Guide](https://dortania.github.io/GPU-Buyers-Guide/)
* **No ARM Support**
  * Please don't torture it with macOS. macOS was never optimized for such low end hardware and Apple has never released any ARM binaries for macOS.
* **Fingerprint sensors**
  * There is no way to emulate the Touch ID sensor as of currently, so fingerprint sensors will not work.
* **Discrete GPUs**
  * 90% of discrete GPUs will not work because they are wired in a configuration that macOS doesn't support (switchable graphics). With NVIDIA discrete GPUs, this is usually called Optimus. It is not possible to utilize these dGPUs for the internal display, so it is generally advised to disable them and power them off (will be covered later in this guide.)
  * However, in some cases, the discrete GPU powers any external outputs (HDMI, mini DisplayPort, etc.), which may or may not work; in the case that it will work, you will have to keep the card on and running.
  * However, there are some laptops which rarely do not have switchable graphics, so the discrete card can be used (if supported by macOS), but the wiring and setup usually causes issues.
* **AMD CPU laptops**
  * AMD CPU laptops, while theoretically able to work, are not practical for the following reasons:
    * No CPU power management, so battery life will be bad
    * Non-native support, requiring kernel patches, resulting in delayed updates
    * No support for AMD integrated graphics (Radeon R5, R7, etc.)
* **Most WiFi cards**
  * Most WiFi cards that come with laptops are not supported as they are usually Intel/Qualcomm.
  * If you are lucky, you may have a supported Atheros card, but support only runs up to High Sierra.
  * The best option is getting a Broadcom card; see the [WiFi Buyer's Guide](https://dortania.github.io/Wireless-Buyers-Guide/) for recommendations.
* **Samsung PM981 and Micron 2200S NVMe SSDs**
  * These SSDs are not compatible out of the box (causing kernel panics) and therefore require [NVMeFix.kext](https://github.com/acidanthera/NVMeFix/releases) to fix these kernel panics. Note that these drives may still cause boot issues even with NVMeFix.kext.
  * On a related note, Samsung 970 EVO Plus NVMe SSDs also had the same problem but it was fixed in a firmware update; get the update (Windows via Samsung Magician or bootable ISO) [here](https://www.samsung.com/semiconductor/minisite/ssd/download/tools/).
  * Also to note, laptops that use [Intel Optane Memory](https://www.intel.com/content/www/us/en/architecture-and-technology/optane-memory.html) or [Micron 3D XPoint](https://www.micron.com/products/advanced-solutions/3d-xpoint-technology) for HDD acceleration are unsupported in macOS. Some users have reported success in Catalina with even read and write support but we highly recommend removing the drive to prevent any potential boot issues.
* **Thunderbolt USB-C ports**
  * (Hackintosh) Thunderbolt support is currently still iffy in macOS, even more so with Alpine Ridge controllers, which most current laptops have. There have been attempts to keep the controller powered on, which allows Thunderbolt and USB-C hotplug to work, but it comes at the cost of kernel panics and/or USB-C breaking after sleep. If you want to use the USB-C side of the port and be able to sleep, you must plug it in at boot and keep it plugged in.
  * Note: This does not apply to USB-C only ports - only Thunderbolt 3 and USB-C combined ports.
* **Windows Hello Face Recognition**
  * Some laptops come with WHFR that is I2C connected (and used through your iGPU), those will not work.
  * Some laptops come with WHFR that is USB-Connected, if you're lucky, you may get the camera functionality, but nothing else.
* **Intel Smart Sound Technology**
  * Laptops with Intel SST will not have anything connected through them (usually internal mic) work, as it is not supported. You can check with Device Manager on Windows.
* **Headphone Jack Combo**
  * Some laptops with a combo headphone jack may not get Audio Input through them and will have to either use the built-in microphone or an external Audio Input device through USB.
