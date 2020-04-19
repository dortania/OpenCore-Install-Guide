
# Making the installer in macOS

* Supported version: 0.5.7

While you don't need a fresh install of macOS to use OpenCore, some users prefer having a fresh slate with their boot manager upgrades.
This guide works for a release of you choice as long as it is listed in the catalog

**Note for legacy users**

* To use OpenCore on an older system with no UEFI (Plain Bios):
1. First follow the [Legacy Install](https://dortania.github.io/OpenCore-Desktop-Guide/extras/legacy.html) section
2. Once completed, continue the guide at the **Base folder structure** section

* If you are making an OpenCore bootable stick skip this section and head to **Formatting the USB**

## Downloading macOS

From a Mac OS machine that meets the requirements of the OS version you want to install, go directly to the Appstore and download the desired OS release the continue and continue to **Setting up the installer**

For machines that cannot download from the Appstore an image or for specific OS releases please use the GibMacOS utility.

Now lets grab [GibMacOS](https://github.com/corpnewt/gibMacOS), unzip on a local directory.
Open a terminal window in the /gibMacOS/master directory and at the prompt run with "sudo" the `gibMacOS.command`: sudo gibMacOS.command

![](/images/installer-guide/mac-install-md/gib.png)

By default you get a list of the latest macOS installers.
If you need beta versions of macOS, you can select `C. Change Catalog` which will give you additional options.
In this example we will be installing Catalina and we will enter 1 at the prompt:

![](/images/installer-guide/mac-install-md/gib-process.png)

This is going to take a while as we're downloading the entire 8GB+ macOS installer, so highly recommend reading the rest of the guide while you wait.

Once the download is finished exit the utility but do no close the terminal window
At the prompt run with "sudo" the utility `BuildmacOSInstallApp.command`: sudo BuildmacOSInstallApp.command

![](/images/installer-guide/mac-install-md/gib-location.png)

You will be prompted for the macOS installer files which were downloaded to the `macOS Downloads` folder in GibMacOS.
From the Finder drill down to the folder containing the downloaded files and either drag it to the command line or "command+c" and paste it to the command line.

Once the task is completed exit the utility
You will find the Install file in the directory
Move the newly created image to Applications folder. It will simplify the next section.

![](/images/installer-guide/mac-install-md/gib-done.png)

## Setting up the installer
Note. Be aware that in some instances you may need a USB 2.0 stick and/or port.
Make sure that there are no partitions in the stick.
Now we'll be formatting the USB to prep for both the macOS installer and OpenCore. We'll want to use MacOS Extended(HFS+) with a GUID partition map. What this will do is create 2 partitions. The main `MyVolume` and a second called `EFI` which is used as a boot partition where your firmware will check for boot files (The EFI is hidden).

![Formatting the USB](/images/installer-guide/mac-install-md/format-usb.png)

Next run the `createinstallmedia` command provided by [Apple](https://support.apple.com/en-us/HT201372), note that the command is made for USB's formatted with the name `MyVolume`:

```text
sudo /Applications/Install\ macOS\ Catalina.app/Contents/Resources/createinstallmedia --volume /Volumes/MyVolume
```

This will take some time so may want to grab a coffee or continue reading the guide(to be fair you really shouldn't be following this guide step by step without reading the whole thing first)

You can also replace the `createinstallmedia` path with that of where your installer's located, same idea with the drive name.

## Setting up OpenCore's EFI environment

Setting up OpenCore's EFI environment is simple, all you need to do is mount our EFI system partition. This is automatically made when we format with GUID but is unmounted by default, this is where our friend [mountEFI](https://github.com/corpnewt/MountEFI) comes in:

![MountEFI](/images/installer-guide/mac-install-md/mount-efi-usb.png)

You'll notice that once we open the EFI partition, it's empty. This is where the fun begins.

![Empty EFI partition](/images/installer-guide/mac-install-md/base-efi.png)

### Now with all this done, head to [Setting up the EFI](/installer-guide/opencore-efi.md) to finish up your work
