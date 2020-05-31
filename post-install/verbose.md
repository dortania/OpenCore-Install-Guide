# Fixing Resolution and Verbose

* Supported version: 0.5.9

Wanting a more clean booting experience with macOS without all that verbose text while booting? Well you need a couple things:

* [macOS Decluttering](#macos-decluttering)
* [OpenCore Decluttering](#opencore-decluttering)

## macOS Decluttering

**`Misc -> Debug`**

* Set `AppleDebug` to False, this will remove boot.efi debugging right at the start of booting.

**`NVRAM -> Add -> 7C436110-AB2A-4BBB-A880-FE41995C9F82`**:

* Remove `-v` from boot-args in your config.plist

**`NVRAM -> Add -> 4D1EDE05-38C7-4A6A-9CC6-4BCCA8B38C14`**:

* UIScale
  * `01`: Standard resolution
  * `02`: HiDPI (generally required for FileVault to function correctly on smaller displays)

**`UEFI -> Output`**:

* `TextRenderer` set to`BuiltinGraphics`
* `Resolution`: set to `Max` for best results
  * Optionally can specify resolution: `WxH@Bpp (e.g. 1920x1080@32) or WxH (e.g. 1920x1080)`
* `ProvideConsoleGop` set to True

If still having issues, see [Configuration.pdf](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/Configuration.pdf) for all possible options.

## OpenCore Decluttering

So if you followed closely to this guide during install, you'll likely be running the debug version of OpenCore and a .txt file would be created on each boot. For those who want to remove OpenCore's extra debugging messages and that .txt file generation, see below:

**Inside your config.plist**:

* `Misc -> Debug -> Target`: 3
  * `Target` is what determines both what is logged and how, see [OpenCore Debugging](/troubleshooting/debug.md) for more values
  
**Inside your EFI**:

* Replace the following files with the [release versions](https://github.com/acidanthera/OpenCorePkg/releases)(if previously using DEBUG versions):
  * EFI/BOOT/
    * `BOOTx64.efi`
  * EFI/OC/Bootstrap/
    * `Bootstrap.efi`
  * EFI/OC/Drivers/
    * `OpenRuntime.efi`
  * EFI/OC/
    * `OpenCore.efi`
