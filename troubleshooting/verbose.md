# Fixing Resolution and Verbose

Last edited: Febuary 18, 2020

Wanting a more clean booting experience with macOS without all that verbose text while booting? Well you need a couple things:

## Recommended Configuration:

**`NVRAM -> 7C436110-AB2A-4BBB-A880-FE41995C9F82 -> boot-args`**

* Remove `-v` from your config.plist

**`UEFI -> Protocols`**:

* `ConsoleControl` set to True

**`UEFI -> Quirks`**:

* `ProvideConsoleGop` set to True
* `IgnoreTextInGraphics`: set to True
* `SanitiseClearScreen`: set to True
   * Use on Higher resolution displays like 2K and 4K, lower resolutions should leave this disabled

**`Misc -> Boot`**:

* `Resolution`: set to your monitor's resolution
   * `WxH@Bpp (e.g. 1920x1080@32) or WxH (e.g. 1920x1080)`
* `ConsoleBehaviourOs`: set to Graphics
* `ConsoleBehaviourUi`: set to Text
* `ConsoleMode` set to [Blank]
  * Setting to Max can help fix the resolution, do note that Max should not be used when `SanitiseClearScreen` is enabled

Please refer below for other settings if these Misc/Boot values do not work for your firmware.

## For Broadwell and newer:

**`Misc -> Boot`**:

* `ConsoleBehaviourOs`: set to ForceGraphics
* `ConsoleBehaviourUi`: set to ForceText

## For Haswell and older:

**`Misc -> Boot`**:

* `ConsoleBehaviourOs`: set to Graphics
* `ConsoleBehaviourUi`: set to ForceText

