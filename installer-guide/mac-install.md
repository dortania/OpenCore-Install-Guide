
# Making the installer in macOS

* Supported version: 0.5.9

While a fresh macOS install is not essential for OpenCore, some users prefer having a fresh slate with their boot manager upgrades.

**Note for legacy users**

* If you want to use OpenCore on a system without UEFI, please follow the [Legacy Install](https://dortania.github.io/OpenCore-Desktop-Guide/extras/legacy.html) section first. After that, you can continue following the **Base folder structure** section.

To start, we'll want to grab ourselves a copy of macOS. You can skip this and head to formatting the USB if you are just making a bootable OpenCore stick and not an installer. For everyone else, you can either download macOS from the App Store or using gibMacOS.

For those who need macOS versions no longer hosted on Apple's catalog (ie. Sierra and older), follow [Legacy macOS install](https://github.com/dortania/OpenCore-Desktop-Guide/blob/master/installer-guide/legacy-mac-install.md) guide.

## Downloading macOS

Now, let's grab [GibMacOS](https://github.com/corpnewt/gibMacOS) and run the `gibMacOS.command`:

![](/images/installer-guide/mac-install-md/gib.png)

We will get a list of macOS installers (if you need macOS beta versions, select `C. Change Catalog`). In this example, we will choose macOS installer listed under number 1:

![](/images/installer-guide/mac-install-md/gib-process.png)

Downloading the entire 8GB+ macOS installer will take a while. While waiting for files to download, we highly recommend reading the rest of this guide. 

Once downloading has finished, we will run `BuildmacOSInstallApp.command`:

![](/images/installer-guide/mac-install-md/gib-location.png)

To build macOS Install app, this command will ask you for the location of macOS installer files. Installer files are in `macOS Downloads` folder in gibMacOS folder. So, drag the folder containing installer files into Terminal and press 'Enter'.

Once building process for macOS Install app has been done, our new macOS Install app will be in the same folder that contains your installer files. I recommend moving it to your applications folder to make things a bit easier with the next section.

![](/images/installer-guide/mac-install-md/gib-done.png)

## Setting up the installer

Now, we will format a USB flash drive to prepare it for both the macOS installer and OpenCore. We will want to use macOS Extended (HFS+) with a GUID partition map. What this will do is create 2 partitions. The main `MyVolume` and a second called `EFI` which is used as a boot partition where your firmware will check for boot files.

* Note that by default Disk Utility only shows partitions, press Cmd/Win+2 to show all devices (alternatively, you can press the view button)

![Formatting the USB](/images/installer-guide/mac-install-md/format-usb.png)

Next, run the `createinstallmedia` command provided by [Apple](https://support.apple.com/en-us/HT201372). Please note that the command below presumes USB ihas been formatted with the name `MyVolume`:

```text
sudo /Applications/Install\ macOS\ Catalina.app/Contents/Resources/createinstallmedia --volume /Volumes/MyVolume
```

Again, this will take time. You might want to grab a cup of coffee and/or continue reading this guide. To be honest, you really should not be following this guide without reading the whole thing first.

Of course, you can replace the `createinstallmedia` path with any other path containing your macOS Install app. The same applies to the drive name part.

## Setting up OpenCore's EFI environment

Setting up OpenCore's EFI environment is simple. All you need to do is mount our EFI system partition. This is automatically made when we format with GUID but is unmounted by default. This is where our friend [MountEFI](https://github.com/corpnewt/MountEFI) comes in:

![MountEFI](/images/installer-guide/mac-install-md/mount-efi-usb.png)

You will notice that once we open the EFI partition, it's empty. This is where the fun begins.

![Empty EFI partition](/images/installer-guide/mac-install-md/base-efi.png)

### With this done, head to [Setting up the EFI](/installer-guide/opencore-efi.md) to finish up your work
