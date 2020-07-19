# Getting started with OpenCore

Before we can jump head first into making an OpenCore based system, we need to go over a few things.

## Prerequisites
  
1. _**[CRUCIAL]**_ Time and patience.
   * Don't start working on this if you have deadlines or important work. Hackintoshes are not something you should be relying on as a work machine.
2. _**[CRUCIAL]**_ **KNOW YOUR HARDWARE**
   * Your CPU name and generation
   * Your GPUs
   * Your storage devices (HDD/SSD, NVMe/AHCI/RAID/IDE configuration.
   * Your laptop/desktop model if from an OEM
   * Your **Ethernet chipset**
   * Your WLAN/Bluetooth chipset
3. _**[CRUCIAL]**_ **A BASIC KNOWLEDGE OF COMMAND LINES AND HOW TO USE A TERMINAL/COMMAND PROMPT**
   * This is not just [CRUCIAL], this is the basis of this whole guide. We can't help you if you don't know how to `cd` to a directory or delete a file.
4. _**[CRUCIAL]**_ A machine that is compatible as seen in the _**Compatibility**_ section.
   * [Hardware Limitations page](macos-limits.md)
5. _**[CRUCIAL]**_ A minimum of:
   * 12GB USB if you're going to use macOS to create the USB
   * 4GB USB if you're going to use Windows or Linux for USB creation
6. _**[CRUCIAL]**_ An **Ethernet connection** (no WiFi dongles, Ethernet USB adapter may work depending on macOS support) and you must know your LAN card's model
   * You must either have a physical Ethernet port, or a compatible macOS Ethernet dongle/adapter. In case you have a [compatible WiFi card](https://dortania.github.io/Wireless-Buyers-Guide/), you can also use that.
     * Note majority of Wifi cards are not supported by macOS
   * For people who can't use ethernet but have an android phone, you can connect your android phone to WiFi and then tether it using USB with [HoRNDIS](https://joshuawise.com/horndis#available_versions).
7. _**[CRUCIAL]**_ **Proper OS Installation:**
   * Be it:
     * macOS (a fairly recent one would be better)
     * Windows (Windows 10, 1703 or newer)
     * Linux (with Python 2.7 or later), make sure it's clean and properly functioning.
   * For Windows or Linux users, **15GB** of free space on the drive you're working on. On Windows, your OS disk (C:) must have 15GB free at least.
   * For macOS users, **30GB** of free space on the system's drive.

## Other OpenCore Tips

* Kernel extensions are loaded in the order specified in your config file, so you must load an extension's dependencies before you load the extension itself. For example, Lilu must be loaded before WhateverGreen or VirtualSMC.
* SMBIOS data, ACPI patches and DSDT/SSDTs are applied to all operating systems. Adjust your SSDTs with `If (_OSI ("Darwin")) {}`
  * Note that all SSDTs mentioned in this guide have been updated accordingly and should not affect booting
* Some systems require pure UEFI mode to boot. (This setting is commonly called "Windows 8.1/10 UEFI Mode" by motherboard manufacturers. See also on [flashing a UEFI ROM onto older GPUs](https://github.com/acidanthera/WhateverGreen/blob/master/Manual/FAQ.Radeon.en.md))
* OpenCore requires a version of macOS that supports either a Prelinked Kernel or kernel Collections, this means any installs of OS X 10.7 Lion or newer are supported.
* Those having issues converting can refer to the [Clover Conversion](https://github.com/dortania/OpenCore-Install-Guide/tree/master/clover-conversion) page
