# OpenCore beauty treatment

Main thing this guide will go over:

* Giving OpenCore a GUI

## Setting up OpenCore's GUI

So to get started, we're gonna need 0.5.7 as this build version has the GUI included with the rest of the files. If you're on an older version, I recommend updating: [Updating OpenCore](/post-install/update.md)

Once that's done, we'll need a couple things:

* [GUI Resources](https://github.com/acidanthera/OcBinaryData)
* [OpenCanopy.efi](https://github.com/acidanthera/OpenCorePkg/releases)

Once you have both of these, we'll next want to add it to our EFI partition:

* Add the Resources folder to EFI/OC
* Add OpenCanopy.efi to EFI/Drivers

![](https://cdn.discordapp.com/attachments/683011276938543134/693888491603361822/Screen_Shot_2020-03-29_at_12.24.22_PM.png)

Now in our config.plist, we have 2 things we need to fix:

* `Misc -> PickerMode -> External`
* `UEFI -> Drivers` and add OpenCanopy

Once all this is saved, you can reboot and be greeted with a true Mac-like GUI

![](https://cdn.discordapp.com/attachments/683011276938543134/693871107354394674/vmware_2019-10-06_19-47-27.png)