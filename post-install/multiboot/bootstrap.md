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

* [Verify Bootstrap entry was applied](#verify-bootstrap-entry-was-applied)
* [Removing Bootstrap entry from BIOS](#removing-bootstrap-entry-from-bios)

### Verify Bootstrap entry was applied

For those wanting to verify that the entry was applied in OpenCore, enabling logging(see [OpenCore Debugging](/troubleshooting/debug.md)) and check for entries similar to these:

```
OCB: Have existing option 1, valid 1
OCB: Boot order has first option as the default option
```

### Removing Bootstrap entry from BIOS

Because the Bootstrap entry is a protected entry when resetting NVRAM, you'll need to set certain settings:

* Misc -> Security -> AllowNvramReset -> true
* Misc -> Security -> BootProtect -> None

Once these 2 are set in your config.plist, you can next reboot into the OpenCore picker and select the `Reset NVRAM` entry
