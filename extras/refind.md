# Setting up rEFInd

* Supported version: 0.5.6

This section is for the lazy who don't want to clean up their EFI to fix other OS booting.

To get started we're going to need:

* Working copy of either Linux or Windows(we won't be setting up rEFind in macOS)
* [rEFInd files](http://sourceforge.net/projects/refind/files/0.12.0/refind-bin-0.12.0.zip/download)


And depending on your preferred OS, you've got a couple options for setting up rEFInd:

* [macOS Setup](/extras/refind.md#macos-setup)
* [Linux Setup](/extras/refind.md#linux-setup)
* [Windows Setup](https://www.youtube.com/watch?v=dQw4w9WgXcQ)

## macOS Setup

* [Mount your system's EFI](https://github.com/corpnewt/MountEFI)
* Move OpenCore's `BOOTx64.efi` to EFI/OC/
* Rename `refind_x64.efi` to `BOOTx64.efi`
* Move rEFInd's `BOOTx64.efi`to EFI/BOOT
* Add the folders `drivers_x64`, `tools` and `icons` to EFI/BOOT
* Grab refind.conf-sample and add it to EFI/OC
* Rename `refind.conf-sample`to `refind.conf`

Once done, you should get something like this:

![](https://cdn.discordapp.com/attachments/683011276938543134/694945991064813588/Screen_Shot_2020-04-01_at_10.24.52_AM.png)

Note that the `refind-install` isn't supported due to well not running a real Mac

## Linux Setup

It's super simple on Linux, but make sure you're booted through the BIOS and not OpenCore to avoid any issues. 

* Run `refind-install` and go through the setup

If you have issues with installation, see [Installing rEFInd Manually Using Linux](https://www.rodsbooks.com/refind/installing.html#manual)

# rEFInd Configuration

Now that rEFInd's installed, we'll want to grab the `refind.conf-sample` and rename it to `refind.conf` if you haven't already. Next open it up in a text editor and scroll to the bottom of the file, you'll find some example bootloader setups. For us we care about adding OpenCore to the picker, note that BOOTx64.efi **must** be booted first before OpenCore.

Example of a refind.conf supporting OpenCore, Arch and Windows:


```text
timeout 10

menuentry "trashOS" {
    loader \EFI\OC\BOOTx64.efi
}

menuentry "i uSe aRcH bTw" {
    loader \EFI\arch\grubx64.efi
}

menuentry "Winblows" {
    loader \EFI\Microsoft\Boot\bootmgfw.efi
}

scanfor manual,external
```

For those who want the OpenCore icon, you can grab the original files from OpenCorePkg repo: [OpenCore logo](https://github.com/acidanthera/OpenCorePkg/tree/master/Docs/Logos)

* Note that rEFInd expects a 128x128 PNG for icons

