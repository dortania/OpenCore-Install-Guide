# Hiding Verbose

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

**`Misc -> Boot`**:

* `ConsoleBehaviourOs`: set to Graphics
* `ConsoleBehaviourUi`: set to Text

Please refer below for other settings if these Misc/Boot values do not work for your firmware

## For Broadwell and newer:

**`Misc -> Boot`**:

* `ConsoleBehaviourOs`: set to ForceGraphics
* `ConsoleBehaviourUi`: set to ForceText

## For Haswell and older:

**`Misc -> Boot`**:

* `ConsoleBehaviourOs`: set to Graphics
* `ConsoleBehaviourUi`: set to ForceText

