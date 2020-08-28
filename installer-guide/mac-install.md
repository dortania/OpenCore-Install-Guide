
# Making the installer in macOS

* Supported version: 0.6.0

This procedure builds a USB drive with a full macOS installer. If your computer already has macOS, and you just want to make a bootable OpenCore stick, you can skip to [**Setting Up the USB Installer Drive**.](./mac-install.md#setting-up-the-usb-installer-drive)

However, many users prefer having a fresh copy for their boot manager upgrades. To do this, download a copy of macOS, either from the App Store or by using gibMacOS.

> **Note for legacy users**
>
> Some people want to use older hardware or macOS versions. OpenCore can handle these "legacy" situations:
>
> * **Legacy Hardware:** If your computer cannot boot from UEFI drives, the [Legacy Hardware](../extras/legacy.html) page shows how to emulate the UEFI environment.
> * **Legacy Software:** For those needing macOS versions no longer hosted on Apple's store (ie. Sierra and older), follow the [Legacy macOS Software Guide,](./legacy-mac-install.md) Then continue at the **[Downloading macOS](#downloading-macos)** section (below).

## Downloading macOS

**If your Mac meets the requirements of the OS version you want to install,** go directly to the AppStore and download the desired OS release. Then continue to [**Setting Up the USB Installer Drive**.](./mac-install.md#setting-up-the-usb-installer-drive) (below)

**If you can't download from the AppStore** for any reason, use the GibMacOS utility. It can download the files directly from Apple servers and assemble them into a full macOS Installer.

Grab [GibMacOS](https://github.com/corpnewt/gibMacOS), and unzip it in a local directory. Next run the `gibMacOS.command`:

![](../images/installer-guide/mac-install-md/gib.png)

This shows a list of macOS installers. If you need beta versions of macOS, you can select `C. Change Catalog`. For this example we'll choose `1` - Catalina 10.15.4:

![](../images/installer-guide/mac-install-md/gib-process.png)

This is going to take a while as we're downloading the entire 8GB+ macOS installer, so we highly recommend reading the rest of the guide while you wait.

When the download completes, gibMacOS displays the path to the download folder for those files:

```
Files saved to:
  /Users/user/github/gibMacOS/macOS Downloads/publicrelease/###-#### - 10.15.# macOS Catalina
```

**Building the full macOS Installer**

Now run the `BuildmacOSInstallApp.command`. This assembles the downloaded files into a full macOS installer.

![](../images/installer-guide/mac-install-md/gib-location.png)

You will be prompted for the path to the download folder where GibMacOS saved the files.

You can copy/paste the path displayed above, or from the Finder, drill down to the folder containing the downloaded files and drag it to the command line.

Once the task is completed, exit the utility.

The full macOS Installer file is in the download folder. Move it to Applications folder: this will simplify the next section.

![](../images/installer-guide/mac-install-md/gib-done.png)

## Setting up the USB Installer Drive

Now format the USB drive (minimum capacity of 16GB) to hold both the macOS installer and OpenCore software.

To do this, use Disk Utility to erase the entire USB drive. (*Note:* Disk Utility only shows partitions by default. If you don't see the top-level USB drive, press the View button (or Cmd/Win+2) to show all devices.)

Give it the name **MyVolume** with **Mac OS Extended (Journaled)** format and the **GUID Partition Map** scheme. (The name will be updated in an upcoming step.) This creates the main `MyVolume` and a second (hidden) volume named `EFI` that holds the OpenCore files.

![Formatting the USB](../images/installer-guide/mac-install-md/format-usb.png)

Next run the `createinstallmedia` command [within the installer](https://support.apple.com/en-us/HT201372) to copy the macOS installer from `/Applications` to a USB drive with the name `MyVolume`. Copy/paste the command below: adjust the command if you used different locations in the procedure above.

```
sudo /Applications/Install\ macOS\ Catalina.app/Contents/Resources/createinstallmedia --volume /Volumes/MyVolume
```

This will take some time so grab a coffee and continue reading the guide (to be honest, you really shouldn't be following this guide step by step without reading the whole thing first.)

## Setting up EFI partition for OpenCore Files

You must mount the EFI system partition on the USB drive to set up OpenCore's EFI environment. This partition was automatically created when formatting with GUID but it is unmounted by default.

Grab [MountEFI](https://github.com/corpnewt/MountEFI), unzip on a local directory.

Next run the `MountEFI.command`. You should see the window below. Enter the number of the drive that you intend to use for the install, then Quit.
![MountEFI](../images/installer-guide/mac-install-md/mount-efi-usb.png)
You may not see the EFI partition listed in a Finder window. If this happens, look at Finder -> Preferences and make sure that Hard disks and External Disks are checked in *both* the General and Sidebar tabs. If the EFI partition still isn't visible, uncheck those boxes, close Finder Preferences, and then check them again.

![Empty EFI partition](../images/installer-guide/mac-install-md/base-efi.png)

At this point, your USB drive has a macOS installer in one partition and an empty EFI partition, both mounted in the Finder. This is where the fun begins.

**Now head to [Adding the Base OpenCore Files](../installer-guide/opencore-efi.md)**
