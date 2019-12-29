# Creating the USB

## Setting up OpenCore

Requirements:

* [OpenCorePkg](https://github.com/acidanthera/OpenCorePkg/releases), highly recommend running the debug version to show more info
* [AppleSupportPkg](https://github.com/acidanthera/AppleSupportPkg/releases)
* [mountEFI](https://github.com/corpnewt/MountEFI) or some form of EFI mounting\(terminal command example can be found [here](https://themacadmin.com/2012/02/15/mounting-the-efi-boot-partition-on-mac-os-x/)\).
* [ProperTree](https://github.com/corpnewt/ProperTree) or Xcode to edit .plist files \(OpenCore Configurator is another tool but is heavily outdated and the Mackie version is known for corruption. **Please avoid these kinds of tools at all costs!**\).
* Cleaned NVRAM\(This is seriously important as you want a clean slate when working with OpenCore, luckily with OC you can press `Cmd+Option+P+R` while booting to clean your NVRAM as long as you have `PollAppleHotKeys` set to True. Some firmware require UsbKbDxe.efi for proper keyboard functionality with this setting on).
* USB formatted as MacOS Journaled with GUID partition map.
* Knowledge of how a Hackintosh works and what files yours requires(ie: Type of network controller).
* You must remove Clover from your system entirely if you wish to use it as your main boot-loader. Keep a backup of your Clover based EFI.

> Do I need macOS to setup OpenCore and install macOS?

Actually no, you can go into the release tab of all your required files and grab them that way. MaciASL is only on macOS so compiling them may be more difficult if it's not handled by [SSDTTime](https://github.com/corpnewt/SSDTTime). See the [installer section](creating-the-usb.md#Making-an-installer) below for more info.

Recommended BIOS settings:

* Disable:
 * Fast Boot
 * VT-d\(can be enabled if you set DisableIoMapper to YES, AMD users will need to disable SVM in the BIOS\)
 * CSM
 * Thunderbolt
 * Intel SGX
 * Intel Platform Trust
 * CFG Lock\(MSR 0xE2 write protection\)
    * If this can't be turned off in the BIOS(or even found) please consider patching it out. See [Fixing CFG Lock](post-install/msr-lock.md) for more info.
    * AMD CPU users don't need to worry about.
* Enable
 * VT-x
 * Above 4G decoding
 * Hyper-Threading
 * Execute Disable Bit
 * EHCI/XHCI Hand-off
 * OS type: Windows 8.1/10
 * Legacy RTC Device(Relevant for Z370+)

**Note for legacy users**

* If you want to use OpenCore on your system, please follow the [Legacy Install](extras/legacy.md) section first, after you can continue following the **Base folder structure** section

## Creating the USB

Creating the USB is simple, all you need to do is format it with GUID partition map. There is no real size requirement for the USB as OpenCore's entire EFI will generally be less than 5MB. This changes when you're making an instller, see installer section below for more info.

![Formatting the USB](https://i.imgur.com/5uTJbgI.png)

Next, we'll want to mount the EFI partition on the USB with mountEFI.

![mountEFI](https://i.imgur.com/4l1oK8i.png)

You'll notice that once we open the EFI partition, it's empty. This is where the fun begins.

![Empty EFI partition](https://i.imgur.com/EDeZB3u.png)

## Base folder structure

To setup OpenCore’s folder structure, you’ll want to grab those files from OpenCorePkg and construct your EFI to look like the one below:

![base EFI folder](https://i.imgur.com/1Ssvqfw.png)

Now you can place your necessary .efi drivers from AppleSupportPkg into the _drivers_ folder and kexts/ACPI into their respective folders. Please note that UEFI drivers from Clover are not supported with OpenCore!\(EmuVariableUEF, AptioMemoryFix, OsxAptioFixDrv, etc\).

* Please do also note that AptioMemoryFix.efi has now been split between OpenCore itself and FwRuntimeServices.efi

Here's what mine looks like\(For the majority of users you can ignore Tools but it can be useful like for Shell.efi and other such tools\):

![Populated EFI folder](https://i.imgur.com/HVuyghf.png)

**Reminder**:
* SSDTs and custom DSDTs go in ACPI folder
* Kexts go in Kexts folder
* Firmware drivers(.efi) go in the Drivers folder

## Making an installer

While you don't need a fresh install of macOS to use OpenCore, some users prefer having a fresh slate with their boot manager upgrades. 

* Users with a mac:
   * Format the USB as HFS+/MacOS Journaled with GUID partition map, must be 16GB for Catalina
   * Download a copy of macOS
    * AppStore: [High Sierra](macappstores://itunes.apple.com/us/app/macos-high-sierra/id1246284741?mt=12), [Mojave](macappstores://itunes.apple.com/us/app/macos-mojave/id1398502828?mt=12), [Catalina](macappstores://itunes.apple.com/us/app/macos-catalina/id1466841314?mt=12)
    * [GibMacOS](https://github.com/corpnewt/gibMacOS) with the `BuildmacOSInstallApp.command`
   * Run the `createinstallmedia` command provided by [Apple](https://support.apple.com/en-us/HT201372)
  
* Users without a mac:
   * Format USB as Fat32 with GUID partition map, must be 4GB minimum
   * Download the macOS `BaseSystem.dmg` and `BaseSystem.chunklist`
    * [gibMacOS](https://github.com/corpnewt/gibMacOS)
    * [macrecovery.py](https://github.com/acidanthera/MacInfoPkg/blob/master/macrecovery/macrecovery.py)
   * Create a folder on root of Fat32 partition called `com.apple.recovery.boot` and place the `BaseSystem.dmg` and `BaseSystem.chunklist` in there


Note: Some users may have issues booting the USB, make sure you have an HFS driver and you can also try `AvoidHighAlloc` set to `YES`. If you continue to have issues, I recommend using Midi's [/r/Hackintosh macOS Internet Install](https://internet-install.gitbook.io/macos-internet-install/)
