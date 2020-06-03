
# Making the installer in macOS

* Supported version: 0.5.9

While you don't need a fresh install of macOS to use OpenCore, some users prefer having a fresh slate with their boot manager upgrades.

**Note for legacy users**

* If you want to use OpenCore on a system without UEFI, please follow the [Legacy Install](https://dortania.github.io/OpenCore-Desktop-Guide/extras/legacy.html) section first, after you can continue following the **Base folder structure** section

To start we'll want to grab ourselves a copy of macOS, you can skip this and head to formatting the USB if you're just making a bootable OpenCore stick and not an installer. For everyone else, you can either download macOS from the App Store or with gibMacOS

For those needing macOS versions no longer hosted on Apple's catalog(ie. Sierra and older), follow the [Legacy macOS install](https://github.com/dortania/OpenCore-Desktop-Guide/blob/master/installer-guide/legacy-mac-install.md) guide

## Downloading macOS

Now lets grab [GibMacOS](https://github.com/corpnewt/gibMacOS) and run the `gibMacOS.command`:

![](/images/installer-guide/mac-install-md/gib.png)

From this, we get a nice list of macOS installers. If you need beta versions of macOS, you can select `C. Change Catalog`. For this example we'll choose 1:

![](/images/installer-guide/mac-install-md/gib-process.png)

This is going to take a while as we're downloading the entire 8GB+ macOS installer, so highly recommend reading the rest of the guide while you wait.

Once finished, we'll next want to run the `BuildmacOSInstallApp.command`:

![](/images/installer-guide/mac-install-md/gib-location.png)

It's gonna ask for the macOS installer files, at the moment they're in pieces in the `macOS Downloads` folder found in gibMacOS

Once it's done, you can find it with the rest of the files. I recommend moving it to your applications folder to make things a bit easier with the next section.

![](/images/installer-guide/mac-install-md/gib-done.png)

## Setting up the installer

Now we'll be formatting the USB to prep for both the macOS installer and OpenCore. We'll want to use macOS Extended(HFS+) with a GUID partition map. What this will do is create 2 partitions. The main `MyVolume` and a second called `EFI` which is used as a boot partition where your firmware will check for boot files.

* Note by default Disk Utility only shows partitions, press Cmd/Win+2 to show all devices(Alternatively you can press the view button)

![Formatting the USB](/images/installer-guide/mac-install-md/format-usb.png)

Next run the `createinstallmedia` command provided by [Apple](https://support.apple.com/en-us/HT201372), note that the command is made for USB's formatted with the name `MyVolume`:

```text
sudo /Applications/Install\ macOS\ Catalina.app/Contents/Resources/createinstallmedia --volume /Volumes/MyVolume
```

This will take some time so may want to grab a coffee or continue reading the guide(to be fair you really shouldn't be following this guide step by step without reading the whole thing first)

You can also replace the `createinstallmedia` path with that of where your installer's located, same idea with the drive name.

## Setting up OpenCore's EFI environment

Setting up OpenCore's EFI environment is simple, all you need to do is mount our EFI system partition. This is automatically made when we format with GUID but is unmounted by default, this is where our friend [MountEFI](https://github.com/corpnewt/MountEFI) comes in:

![MountEFI](/images/installer-guide/mac-install-md/mount-efi-usb.png)

You'll notice that once we open the EFI partition, it's empty. This is where the fun begins.

![Empty EFI partition](/images/installer-guide/mac-install-md/base-efi.png)

### Now with all this done, head to [Setting up the EFI](/installer-guide/opencore-efi.md) to finish up your work
