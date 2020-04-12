# Setting up the EFI

* Supported version: 0.5.7

To setup OpenCore’s folder structure, you’ll want to grab the EFI folder found in OpenCorePkg's releases page(this will already be done on the `BOOT` USB drive for windows users):

![base EFI folder](/images/installer-guide/opencore-efi-md/base-efi.png)

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
   * OpenCanopy.efi
      * This is OpenCore's optional GUI, we'll be going over how to set this up in installer-guide so remove this for now

* **Remove everything from Tools:**
   * Way to many to list them all, but I recommend keeping OpenShell.efi for troubleshooting purposes
      
A cleaned up EFI:

![Clean EFI](/images/installer-guide/opencore-efi-md/clean-efi.png)

Now you can place **your** necessary firmware drivers(.efi) from AppleSupportPkg into the _Drivers_ folder and Kexts/ACPI into their respective folders. Please note that UEFI drivers from Clover are not supported with OpenCore!(EmuVariableUEFI, AptioMemoryFix, OsxAptioFixDrv, etc). Please see the [Clover firmware driver conversion](https://github.com/khronokernel/Opencore-Vanilla-Desktop-Guide/blob/master/clover-conversion/clover-efi.md) for more info on supported drivers and those merged into OpenCore.

Here's what a populated EFI ***can*** look like(yours will be different):

![Populated EFI folder](/images/installer-guide/opencore-efi-md/populated-efi.png)

**Reminder**:

* SSDTs and custom DSDTs(`.aml`) go in ACPI folder
* Kexts(`.kext`) go in Kexts folder
* Firmware drivers(`.efi`) go in the Drivers folder

## Now head to [Gathering Files](/ktext.md) to get the needed kexts and firmware drivers

