# Creating the USB

* Supported version: 0.5.7

Requirements:

* [OpenCorePkg](https://github.com/acidanthera/OpenCorePkg/releases), highly recommend running the debug version to show more info
* [AppleSupportPkg](https://github.com/acidanthera/AppleSupportPkg/releases)
* [ProperTree](https://github.com/corpnewt/ProperTree) or Xcode to edit .plist files (OpenCore Configurator is another tool but is heavily outdated and the Mackie version is known for corruption. **Please avoid these kinds of tools at all costs!**).
* Cleaned NVRAM(This is seriously important if you used Clover before, as many variables will remain causing conflicts. Luckily with OC you can press `CleanNvram` in the boot picker when `AllowNvramReset` is enabled in your config)
* Basic knowledge of how a Hackintosh works and what files yours requires(ie: Type of network controller).
* You must remove Clover from your system entirely if you wish to use it as your main boot-loader. Keep a backup of your Clover based EFI. See here on what needs to be cleaned: [Clover Conversion](https://github.com/khronokernel/Opencore-Vanilla-Desktop-Guide/tree/master/clover-conversion)

# Making the installer

Depending on which OS you're on, see your specific section on making the USB, then return here on setting up Opencore:

* [macOS users](/installer-guide/mac-install.md)
* [Windows users](/installer-guide/winblows-install.md)
* [Linux users](/installer-guide/linux-install.md)


# Setting up the EFI

To setup OpenCore’s folder structure, you’ll want to grab the EFI folder found in OpenCorePkg's releases page(this will already be done on the `BOOT` USB drive for windows users):

![base EFI folder](https://i.imgur.com/PvNIR4y.png)

Now something you'll notice is that it comes with a bunch of files in `Drivers` and `Tools` folder, we don't want most of these:

* **Remove from Drivers:**
   * OpenUsbKbDxe.efi
      * Used for OpenCore picker on **legacy systems running DuetPkg**, [not recommended and even harmful on Ivy Bridge and newer](https://applelife.ru/threads/opencore-obsuzhdenie-i-ustanovka.2944066/page-176#post-856653)
   * NvmExpressDxe.efi
      * Used for Haswell and older when no NVMe driver is built into the firmware
   * XhciDxe.efi
      * Used for Sandy Bridge and older when no XHCI driver is built into the firmware
   * HiiDatabase.efi
      * Used for fixing GUI support like OpenShell.efi on Sandy Bridge and older

* **Remove everything from Tools:**
   * BootKicker.efi
      * Used for fixing the Apple picker on genuine Macs
   * CleanNvram.efi
      * We'll be using OpenCore's built-in function
   * GopStop.efi
      * Used for [testing GOP](https://github.com/acidanthera/OcSupportPkg/tree/master/Application/GopStop)
   * HdaCodecDump.efi
      * Used for finding info for AudioDxe setup, this is not covered in this guide so not needed
   * VerifyMsrE2.efi
      * Used for [verifying MSR lock](/extras/msr-lock.md), for install we can ignore
      
A cleaned up EFI:

![Clean EFI](https://i.imgur.com/2INJYol.png)

Now you can place **your** necessary firmware drivers(.efi) from AppleSupportPkg into the _Drivers_ folder and Kexts/ACPI into their respective folders. Please note that UEFI drivers from Clover are not supported with OpenCore!(EmuVariableUEFI, AptioMemoryFix, OsxAptioFixDrv, etc). Please see the [Clover firmware driver conversion](https://github.com/khronokernel/Opencore-Vanilla-Desktop-Guide/blob/master/clover-conversion/clover-efi.md) for more info on supported drivers and those merged into OpenCore.

Here's what a populated EFI can look like:

![Populated EFI folder](https://i.imgur.com/HVuyghf.png)

**Reminder**:

* SSDTs and custom DSDTs go in ACPI folder
* Kexts go in Kexts folder
* Firmware drivers(.efi) go in the Drivers folder

## Now head to [Gathering Files](/ktext.md) to get the needed kexts and firmware drivers

