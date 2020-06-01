# Legacy Install

* Supported version: 0.5.9

Wanna try OpenCore but can't boot UEFI based sources? Well don't fret, there's hope for you! OpenCore supports DuetPkg which emulates a UEFI environment for legacy systems.

To start, you need the following:

* BootInstall.command
* Install source(MacOS Journaled + GUID, size of USB depends on the version of macOS. 16GB recommended for Catalina)

![BootInstall Location](/images/extras/legacy-md/download.png)

Within your OpenCore build folder, navigate to `Utilities/BootInstall`. Here you'll find a file called `BootInstall.command`. What this does is install DuetPkg to your desired drive.

![](/images/extras/legacy-md/run-boot.png)

Now you'll want to run `BootInstall.command`, do note that you may need `sudo` for this to work correctly on newer versions of macOS

```text
sudo Utilities/BootInstall/BootInstall.command
```

![Disk Selection/writing new MBR](/images/extras/legacy-md/boot-disk.png)

This will give you a list of available disks, choose yours and you will be prompted to write a new MBR. Choose yes`[y]` and you'll be finished.

![Finished Installer](/images/extras/legacy-md/boot-done.png)

![Base EFI](/images/extras/legacy-md/efi-base.png)

This will provide you with an EFI partition with a `boot` file, this is where we'll add our OpenCore EFI.

**Note**: The firmware drivers used for legacy users differ slightly:

* [OpenUsbKbDxe.efi](https://github.com/acidanthera/OpenCorePkg/releases)
  * For picker support in the OpenCore menu
* [HfsPlusLegacy.efi](https://github.com/acidanthera/OcBinaryData/blob/master/Drivers/HfsPlusLegacy.efi)
  * Needed for seeing Hfs drives like installers, the legacy variant is required for Sandy Bridge and older due to missing RDRAND instruction support
