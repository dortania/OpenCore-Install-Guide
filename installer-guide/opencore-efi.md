# Creating the USB

Last edited: January 15, 2020

Requirements:

* [OpenCorePkg](https://github.com/acidanthera/OpenCorePkg/releases), highly recommend running the debug version to show more info
* [AppleSupportPkg](https://github.com/acidanthera/AppleSupportPkg/releases)
* [mountEFI](https://github.com/corpnewt/MountEFI) or some form of EFI mounting\(terminal command example can be found [here](https://themacadmin.com/2012/02/15/mounting-the-efi-boot-partition-on-mac-os-x/)\).
* [ProperTree](https://github.com/corpnewt/ProperTree) or Xcode to edit .plist files \(OpenCore Configurator is another tool but is heavily outdated and the Mackie version is known for corruption. **Please avoid these kinds of tools at all costs!**\).
* Cleaned NVRAM\(This is seriously important as you want a clean slate when working with OpenCore, luckily with OC you can press `CleanNvram` in the boot picker when `AllowNvramReset` is enabled
* Knowledge of how a Hackintosh works and what files yours requires\(ie: Type of network controller\).
* You must remove Clover from your system entirely if you wish to use it as your main boot-loader. Keep a backup of your Clover based EFI.

Depending on which OS you're on, see your specific section on making the USB, then return here on making the USB:

* [macOS users](/installer-guide/mac-install.md)
* [Windows users](/installer-guide/winblows-install.md)


# Setting up the EFI

To setup OpenCore’s folder structure, you’ll want to grab the EFI folder found in OpenCorePkg's releases page:

![base EFI folder](https://i.imgur.com/PvNIR4y.png)

Now something you'll notice is that it comes with a bunch of files in `Drivers` and `Tools` folder, we don't want most of these:

* Remove from Drivers:
   * AppleUsbKbDxe.efi
      * Used for OpenCore picker on **legacy systems running DuetPkg**, [not recommended and even harmful on Ivy Bridge and newer](https://applelife.ru/threads/opencore-obsuzhdenie-i-ustanovka.2944066/page-176#post-856653)
   * NvmExpressDxe.efi
      * Used for Haswell and older when no NVMe driver is built into the firmware
   * XhciDxe.efi
      * Used for Sandy Bridge and older when no XHCI driver is built into the firmware

* Remove from Tools:
   * CleanNvram.efi
      * We'll be using OpenCore's built-in function
   * VerifyMsrE2.efi
      * Used for [verifying MSR lock](/extras/msr-lock.md), for install we can igore

A cleaned up EFI:

![Clean EFI](https://i.imgur.com/2INJYol.png)

Now you can place **your** necessary fimrware drivers(.efi) from AppleSupportPkg into the _Drivers_ folder and Kexts/ACPI into their respective folders. Please note that UEFI drivers from Clover are not supported with OpenCore!\(EmuVariableUEFI, AptioMemoryFix, OsxAptioFixDrv, etc\). Please see the [Clover firmware driver conversion](https://github.com/khronokernel/Opencore-Vanilla-Desktop-Guide/blob/master/clover-conversion/clover-efi.md) for more info on supported drivers and those merged into OpenCore.

Here's what a populated EFI can look like:

![Populated EFI folder](https://i.imgur.com/HVuyghf.png)

**Reminder**:

* SSDTs and custom DSDTs go in ACPI folder
* Kexts go in Kexts folder
* Firmware drivers\(.efi\) go in the Drivers folder

See [Gathering Files](ktext.md) on the next page for more info on what you need

