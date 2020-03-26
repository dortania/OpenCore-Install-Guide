
# Making the installer in macOS

* Supported version: 0.5.7

While you don't need a fresh install of macOS to use OpenCore, some users prefer having a fresh slate with their boot manager upgrades.

**Note for legacy users**
* If you want to use OpenCore on a system without UEFI, please follow the [Legacy Install](/extras/legacy.md) section first, after you can continue following the **Base folder structure** section

To start we'll want to grab ourselves a copy of macOS, you can skip this and head to formatting the USB if you're just making a bootable OpenCore stick and not an installer. For everyone else, here's your options for obtaining macOS directly from Apple's servers:

* AppStore links: 
   * [High Sierra](macappstores://itunes.apple.com/us/app/macos-high-sierra/id1246284741?mt=12), 
   * [Mojave](macappstores://itunes.apple.com/us/app/macos-mojave/id1398502828?mt=12), 
   * [Catalina](macappstores://itunes.apple.com/us/app/macos-catalina/id1466841314?mt=12)

* [GibMacOS](https://github.com/corpnewt/gibMacOS):
   * Download the full macOS installer
   * Run `BuildmacOSInstallApp` then drag and drop the `macOS Downloads` folder found in GibMacOS

Next we'll want to format our USB HFS+/MacOS Journaled with GUID partition map, must be 12GB for macOS Catalina.as-is recommended to name it `MyVolume` as the script below can be used as-is.

![Formatting the USB](https://i.imgur.com/numOUnF.png)

Next run the `createinstallmedia` command provided by [Apple](https://support.apple.com/en-us/HT201372), note that the command is made for USB's formatted with the name `MyVolume`:

```text
sudo /Applications/Install\ macOS\ Catalina.app/Contents/Resources/createinstallmedia --volume /Volumes/MyVolume
```

This will take some time so may want to grab a coffee or continue reading the guide(to be fair you really shouldn't be following this guide step by step without reading the whole thing first)


## Setting up OpenCore's EFI environment

Setting up OpenCore's EFI environment is simple, all you need to do is mount our EFI system partition. This is automatically made when we format with GUID but is hidden from the end user, this is where our friend [mountEFI](https://github.com/corpnewt/MountEFI) comes in:

![MountEFI](https://i.imgur.com/4l1oK8i.png)

You'll notice that once we open the EFI partition, it's empty. This is where the fun begins.

![Empty EFI partition](https://i.imgur.com/EDeZB3u.png)

### Now with all this done, return to [Creating the USB](/installer-guide/opencore-efi.md) to finish up your work
