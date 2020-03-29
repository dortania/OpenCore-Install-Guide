**Work In Progress**

# OpenCore beauty treatment

Main things this guide will go over:

* Giving OpenCore a GUI
* Enabling the BootChime
* Adding rEFind as a preboot to OpenCore

## Setting up OpenCore's GUI

So to get started, we're gonna need 0.5.7 as this build version has the GUI included with the rest of the files. If you're on an older version, I recommend updating: [Updating OpenCore](/post-install/update.md)

Once that's done, we'll need a couple things:

* [GUI Resources](https://github.com/acidanthera/OcBinaryData)
* [OpenCanopy.efi](https://github.com/acidanthera/OpenCorePkg/releases)

Once you have both of these, we'll next want to add it to our EFI partition:

* Add the Resources folder to EFI/OC
* Add OpenCanopy.efi to EFI/Drivers

Now in our config.plist, we have 2 things we need to fix:

* `Misc -> PickerMode -> External`
* `UEFI -> Drivers` and add OpenCanopy

Once all this is saved, you can reboot and be greeted with a true Mac-like GUI

![]()

## Setting up AudioDxe and BootChime 

Use ears

## Setting up rEFind

This section is either for the lazy for have trashy hack configs who don't want to clean up their mess or want to boot Linux without haing OpenCore crash it. To start we'll need the following:

* [rEFInd](https://sourceforge.net/projects/refind/files/latest/download)


Now delete it and just use your BIOS