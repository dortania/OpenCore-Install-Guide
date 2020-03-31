
# Making the installer in macOS

* Last edited: March 15, 2020
* Supported version: 0.5.6

While you don't need a fresh install of macOS to use OpenCore, some users prefer having a fresh slate with their boot manager upgrades.

**Note for legacy users**
* If you want to use OpenCore on a system without UEFI, please follow the [Legacy Install](/extras/legacy.md) section first, after you can continue following the **Base folder structure** section

To start we'll want to grab ourselves a copy of macOS, you can skip this and head to formatting the USB if you're just making a bootable OpenCore stick and not an installer. For everyone else, you can either download macOS from the appstore or with GibMacOS

## Dowloading macOS

Now lets grab [GibMacOS](https://github.com/corpnewt/gibMacOS) and run the `gibMacOS.command`:

![](https://cdn.discordapp.com/attachments/683011276938543134/694020134993657896/Screen_Shot_2020-03-29_at_9.07.46_PM.png)

From this, we get a nice list of macOS installers. If you need beta versions of macOS, you can select `C. Change Catalog`. For this example we'll choose 1:

![](https://cdn.discordapp.com/attachments/683011276938543134/694021256974041128/Screen_Shot_2020-03-29_at_9.12.31_PM.png)

This is going to take a while as we're downloading the entire 8GB+ macOS installer, so highly recommend reading the rest of the guide while you wait.

Once finished, we'll next want to run the `BuildmacOSInstallApp.command`:

![](https://cdn.discordapp.com/attachments/683011276938543134/694022317956923442/Screen_Shot_2020-03-29_at_9.16.29_PM.png)

It's gonna ask for the macOS installer files, at the moment they're in pieces in the `macOS Downloads` folder found in GibMacOS

Once it's done, you can find it with the rest of the files. I recommend moving it to your applications folder to make things a bit easier with the next section.

![](https://cdn.discordapp.com/attachments/683011276938543134/694022821902549054/Screen_Shot_2020-03-29_at_9.18.19_PM.png)

## Setting up the installer

Now we'll be formatting the USB to prep for both the macOS installer and OpenCore. We'll want to use MacOS Extended(HFS+) with a GUID partition map. What this will do is create 2 partitions. The main `MyVolume` and a second called `EFI` which is used as a boot partition where your fimrware will check for boot files.

![Formatting the USB](https://i.imgur.com/numOUnF.png)

Next run the `createinstallmedia` command provided by [Apple](https://support.apple.com/en-us/HT201372), note that the command is made for USB's formatted with the name `MyVolume`:

```text
sudo /Applications/Install\ macOS\ Catalina.app/Contents/Resources/createinstallmedia --volume /Volumes/MyVolume
```

This will take some time so may want to grab a coffee or continue reading the guide(to be fair you really shouldn't be following this guide step by step without reading the whole thing first)

You can also replace the `createinstallmedia` path with that of where your installer's located, same idea with the drive name.

## Setting up OpenCore's EFI environment

Setting up OpenCore's EFI environment is simple, all you need to do is mount our EFI system partition. This is automatically made when we format with GUID but is unmounted by default, this is where our friend [mountEFI](https://github.com/corpnewt/MountEFI) comes in:

![MountEFI](https://i.imgur.com/4l1oK8i.png)

You'll notice that once we open the EFI partition, it's empty. This is where the fun begins.

![Empty EFI partition](https://i.imgur.com/EDeZB3u.png)

### Now with all this done, return to [Creating the USB](/installer-guide/opencore-efi.md) to finish up your work
