# Using Bootstrap.efi

* [Preparation](#preperation)
* [Troubleshooting](#troubleshooting)
* [Quick UEFI Shell Reference Guide](#quick-uefi-shell-reference-guide)
* [Adding OpenCore to your BIOS](#adding-opencore-to-your-bios)

So with OpenCore 0.5.8 and newer, we get a neat little file inside our EFI/OC/Bootstrap folder called Bootstrap.efi. What this allows us to do is add OpenCore to our motherboard's boot menu and prevent issues where either Windows or Linux try to overwrite the BOOTx64.efi file which can happen during updates and completely delete any way of booting OpenCore.

## Preparation

So to start we're gonna need the following:

* [OpenCore 0.5.8 or newer](https://github.com/acidanthera/OpenCorePkg/releases)
  * Verify you have EFI/OC/Bootstrap/Bootstrap.efi
* config.plist settings:
  * Misc -> Security -> BootProtect -> Bootstrap
  * UEFI -> Quirks -> RequestBootVarRouting -> True
* [OpenShell](https://github.com/acidanthera/OpenCorePkg/releases)
  * Bundled with OpenCore
  * Remember to add this to both EFI/OC/Tools and config.plist -> Misc -> Tools
  * This is mainly for troubleshooting
  
## Booting

So once you've got the prerequisites out of the way, we're ready to boot! So what the first boot with these settings enabled is create a new boot option in our BIOS(Boot9696) and every boot after this will update the entry making sure it's correct. This now allows us to either remove BOOTx64.efi or not worry about it when other OSes overwrite this file.

If no new boot option is created, you can go down and follow the troubleshooting steps on manually adding it. But triple check the above settings are correct on your system.
  
## Troubleshooting

This is mainly as a mini-guide in case BootProtect doesn't work or you'd like to do it manually.

### Quick UEFI Shell Reference Guide

* `map` \- Lists devices that you can boot from.
* `drive:` \- Change to the drive you select. Ex. `FS0:`
* `ls` or `dir` \- List the content of the selected drive.
* `cd` \- Change directories.
* `bcfg` \- Boot configuration, used to read and write BIOS boot data.

### Adding OpenCore to your BIOS

* First, use `map` to find your devices.
* Once you have an idea of your device, select it by typing `DEVICE:` replacing device with the actual device. Ex. FS0:
* Use `ls` to determine the content of the device. It should contain an EFI folder. Use `ls EFI` to look inside the EFI folder. Within the EFI folder you should find BOOT and OC.
* Use `bcfg boot dump` to view your currently configured boot devices.
* Use `bcfg boot add 00 {The device containing your EFI}:\EFI\OC\Bootstrap\Bootstrap.EFI Boot9696` to add an entry to the beginning of your boot map.
  * ex. `bcfg boot add 00 FS0:\EFI\OC\Bootstrap\Bootstrap.EFI Boot9696`
  * Note: 00 is the boot order ranking, 00 being the very first one, and it increments by one, 01 being the second, 02 being the third and so on.
* Rerun the boot dump command to verify.
* Reboot.

Credit to [Fewtarious](https://gist.github.com/fewtarius/99e24d7f5afa13cf26ecbe33b864a657) for the original guide
