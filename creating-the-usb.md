# Creating the USB

## Setting up OpenCore

Requirements:

* [OpenCorePkg](https://github.com/acidanthera/OpenCorePkg) \(Recommend to build from scratch instead of using the prebuilt package as OpenCore is constantly being updated. As of writing we're on Version `0.5.0` even though the current official release is `0.0.4`\). Easiest way to build is via the [`macbuild.tool`](https://github.com/acidanthera/OpenCorePkg/blob/master/macbuild.tool)
* [AppleSupportPkg](https://github.com/acidanthera/AppleSupportPkg/releases)
* [mountEFI](https://github.com/corpnewt/MountEFI) or some form of EFI mounting\(terminal command example can be found [here](https://themacadmin.com/2012/02/15/mounting-the-efi-boot-partition-on-mac-os-x/)\).
* [ProperTree](https://github.com/corpnewt/ProperTree) or Xcode to edit .plist files \([OpenCore Configurator](https://www.insanelymac.com/forum/topic/338686-opencore-configurator/) is another tool, but vit9696 has stated multiple times he does not support these tools and they even break OpenCore's specifications. Use at own risk!\).
* Cleaned NVRAM\(This is seriously important as you want a clean slate when working with OpenCore, luckily OC comes with a tool called CleanNvram.efi that can called from the shell\).
* USB formatted as MacOS Journaled with GUID partition map.
* Knowledge of how a hackintosh works and what files yours requires.
* A working Hackintosh to test on.
* You must remove Clover from your system entirely if you wish to use it as your main boot-loader. Keep a backup of your Clover based EFI.

Recommended BIOS settings:

* Disable:
  * Fast Boot
  * CFG Lock\(MSR 0xE2 write protection\)
  * VT-d\(can be enabled if you set DisableIoMapper to YES\)
  * CSM
* Enable
  * VT-x
  * Above 4G decoding
  * Hyper Threading
  * Execute Disable Bit
  * EHCI/XHCI Hand-off
  * OS type: Windows 8.1/10

**Note for legacy users**

* If you want to use OpenCore on your system, please follow the [Legacy Install](extras/legacy.md) section first, after you continue following the **Base folder structure** section

## Creating the USB

Creating the USB is simple. All you need to do is format it as macOS Journaled with GUID partition map\(HFS+ macOS Journaled\). There is no real size requirement for the USB as OpenCore's entire EFI will generally be less than 5MB.

![Formatting the USB](https://i.imgur.com/5uTJbgI.png)

Next we'll want to mount the EFI partition on the USB with mountEFI.

![mountEFI](https://i.imgur.com/4l1oK8i.png)

You'll notice that once we open the EFI partition, it's empty. This is where the fun begins.

![Empty EFI partition](https://i.imgur.com/EDeZB3u.png)

## Base folder structure

To setup OpenCore’s folder structure, you’ll want to grab those files from OpenCorePkg and construct your EFI to look like the one below:

![base EFI folder](https://i.imgur.com/tzQEfuv.png)

Now you can place your necessary .efi drivers from AppleSupportPkg into the _drivers_ folder and kexts/ACPI into their respective folders. Please note that UEFI drivers from Clover are not supported with OpenCore!\(ie: EmuVariableUEFI\).

* Please do also note that AptioMemoryFix.efi has now been split between OpenCore itself and FwRuntimeServices.efi

Here's what mine looks like\(For the majority of users you can ignore Tools but it can be useful like of for clearing NVRAM and other such things\):

![Populated EFI folder](https://i.imgur.com/3BqRyI5.png)

