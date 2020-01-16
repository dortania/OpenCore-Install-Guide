# Creating the USB

Last edited: January 15, 2020

Requirements:

* [OpenCorePkg](https://github.com/acidanthera/OpenCorePkg/releases), highly recommend running the debug version to show more info
* [AppleSupportPkg](https://github.com/acidanthera/AppleSupportPkg/releases)
* [mountEFI](https://github.com/corpnewt/MountEFI) or some form of EFI mounting\(terminal command example can be found [here](https://themacadmin.com/2012/02/15/mounting-the-efi-boot-partition-on-mac-os-x/)\).
* [ProperTree](https://github.com/corpnewt/ProperTree) or Xcode to edit .plist files \(OpenCore Configurator is another tool but is heavily outdated and the Mackie version is known for corruption. **Please avoid these kinds of tools at all costs!**\).
* Cleaned NVRAM\(This is seriously important as you want a clean slate when working with OpenCore, luckily with OC you can press `Cmd+Option+P+R` while booting to clean your NVRAM as long as you have `PollAppleHotKeys` set to True. Some firmware require UsbKbDxe.efi for proper keyboard functionality with this setting on\).
* USB formatted as MacOS Journaled with GUID partition map.
* Knowledge of how a Hackintosh works and what files yours requires\(ie: Type of network controller\).
* You must remove Clover from your system entirely if you wish to use it as your main boot-loader. Keep a backup of your Clover based EFI.

> Do I need macOS to setup OpenCore and install macOS?

Actually no, you can go into the release tab of all your required files and grab them that way. MaciASL is only on macOS so compiling them may be more difficult if it's not handled by [SSDTTime](https://github.com/corpnewt/SSDTTime). See the [installer section](creating-the-usb.md#Making-an-installer) below for more info.

**Note for legacy users**

* If you want to use OpenCore on your system, please follow the [Legacy Install](extras/legacy.md) section first, after you can continue following the **Base folder structure** section

## Setting up OpenCore's EFI enviroment

Setting up OpenCore's EFI enviroment is simple, all you need to do is format it with GUID partition map regardless of operating system. There is no real size requirement for the USB as OpenCore's entire EFI will generally be less than 5MB. For those making a full macOS installer should read the whole page before starting as the installer section goes more into what drive size and formats are required.

![Formatting the USB](https://i.imgur.com/5uTJbgI.png)

Next, we'll want to mount the EFI partition on the USB with [mountEFI](https://github.com/corpnewt/MountEFI). Windows and Linux users can refer to [this post](https://noobsplanet.com/index.php?threads/how-to-mount-efi-partition-from-windows-linux-or-mac.56/)

![mountEFI](https://i.imgur.com/4l1oK8i.png)

You'll notice that once we open the EFI partition, it's empty. This is where the fun begins.

![Empty EFI partition](https://i.imgur.com/EDeZB3u.png)

## Base folder structure

To setup OpenCore’s folder structure, you’ll want to grab the EFI folder found in OpenCorePkg's releases page:

![base EFI folder](https://i.imgur.com/PvNIR4y.png)

Now something you'll notcie is that it comes with a bunch of files in `Drivers` and `Tools` folder, we don't want most of these:

* Remove from Drivers:
   * AppleUsbKbDxe.efi
      * Used for OpenCore picker but conflicts with built-in driver, **do not use unless KeySupport doesn't work**
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

* Please do also note that AptioMemoryFix.efi has now been split between OpenCore itself and FwRuntimeServices.efi

Here's what a populated EFI can look like:

![Populated EFI folder](https://i.imgur.com/HVuyghf.png)

**Reminder**:

* SSDTs and custom DSDTs go in ACPI folder
* Kexts go in Kexts folder
* Firmware drivers\(.efi\) go in the Drivers folder

See [Gathering Files](ktext.md) on the next page for more info on what you need

## Making the macOS Installer

While you don't need a fresh install of macOS to use OpenCore, some users prefer having a fresh slate with their boot manager upgrades.

* **Users with a mac**:
  * Format the USB as HFS+/MacOS Journaled with GUID partition map, must be 16GB for Catalina
  * Download a copy of macOS
    * AppStore: 
       * [High Sierra](macappstores://itunes.apple.com/us/app/macos-high-sierra/id1246284741?mt=12), 
       * [Mojave](macappstores://itunes.apple.com/us/app/macos-mojave/id1398502828?mt=12), 
       * [Catalina](macappstores://itunes.apple.com/us/app/macos-catalina/id1466841314?mt=12)
    * [GibMacOS](https://github.com/corpnewt/gibMacOS):
       * Download the full macOS installer
       * Run `BuildmacOSInstallApp` then drag and drop the `macOS Downloads` folder 
  * Run the `createinstallmedia` command provided by [Apple](https://support.apple.com/en-us/HT201372)
* **Users without a mac**:
  * Format USB as Fat32 with GUID partition map, must be 4GB minimum
    * Disk Management in Windows
    * Disks Utility in Linux
  * Download the macOS `BaseSystem.dmg` and `BaseSystem.chunklist`
    * [gibMacOS](https://github.com/corpnewt/gibMacOS)
    * [macrecovery.py](https://github.com/acidanthera/MacInfoPkg/blob/master/macrecovery/macrecovery.py), alternative to gibmacos
  * Create a folder on root of Fat32 partition called `com.apple.recovery.boot` and place the `BaseSystem.dmg` and `BaseSystem.chunklist` in there

Note: Some users may have issues booting the USB, make sure you have an HFS driver and you can also try `AvoidHighAlloc` set to `YES`. If you continue to have issues, I recommend using Midi's [/r/Hackintosh macOS Internet Install](https://internet-install.gitbook.io/macos-internet-install/) and replacing mentions of clover with OpenCore

