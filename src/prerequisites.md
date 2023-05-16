# Getting started

The central piece of software that allows macOS to run is the bootloader OpenCore.
It has a few major features that will help us run macOS on our systems:

1. ACPI Patching
  * ACPI is software provided by the firmware of your system. This often needs to be patched to play nice with macOS.
  * ACPI is important as it lists the devices within a computer and provides controls for doing power management.
2. Kernel Patching
  * OpenCore is able to inject drivers called "Kexts" into macOS during boot, allowing protections such as [SIP] to remain enabled while adding support for your hardware.
  * OpenCore is also able to patch macOS itself to better support your hardware.
3. UEFI Patching
  * OpenCore is used to patch system information to make your system look like a mac!
  * OpenCore is also able to load UEFI drivers. An example where this is useful is for adding support for booting from NVMe Storage in older systems.

OpenCore lives in the UEFI environment, which is what your computer starts up in before loading Windows or Linux. Because of this, there can be some confusion between UEFI drivers and Kexts:

* UEFI drivers are drivers that OpenCore and your firmware can use. These are often only relevant very early in the boot process, as macOS does not use these UEFI drivers.
* Kexts are a shorthand for "Kernel Extensions". These are drivers that macOS use, and are relevant once you have started booting into macOS.

## Prerequisites

1. Know your hardware for the target system!
  * The most important information to know is the CPU model and GPU.
    * Not every CPU and GPU is supported, so it is important to know for compatibilty reasons!
  * Other important hardware:
    * Storage Devices (HDD/SSD)
    * Ethernet Chipset
    * Wireless Card and Bluetooth
    * Trackpad on Laptops
  * The next page will help you gather this information.
1. A USB Drive to put the macOS installer on
  * 16GB USB when using macOS to create the USB.
  * 4GB USB when using Windows or Linux for USB creation.
1. Already installed OS (or another system) to create the USB
  * Many of the tools **require Python 3**
    * Make sure "Add Python to environment" is enabled when installing Python 3 in Windows.
  * In Windows and Linux, expect **1-2GB** of free space to be needed for downloads.
  * In macOS, expect **30GB** of free space to be needed to download macOS.
1. Latest BIOS installed on the target system

::: Warning Notes on making the installer in Windows and Linux

An **Ethernet Connection** or **Supported** Wifi Adapter is needed!
When making the installer in Windows or Linux, a smaller recovery image is used.
This image will **download** macOS from Apple servers when booted!

Many USB Wifi Adapters and Ethernet dongles do not work in macOS, so should not be relied upon for installation.

An alternative is to use [HoRNDIS](https://joshuawise.com/horndis#available_versions) for USB tethering with an Android phone.

:::
