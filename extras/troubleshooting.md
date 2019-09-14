# Stuck on EndRandomSeed

* `ProvideConsoleGop` is likely missing, this was originally part of AptioMemoryFix but is now within OpenCore as this quirk

# Still waiting on root device

* Gernally seen as a USB error, couple ways to fix:
   * if you're hitting the 15 port limit, you can temporarily get around this with `XhciPortLimit` but for long term use we recommend making a [USBmap](https://github.com/corpnewt/USBMap). CorpNewt also has a guide for this: [USBmap Guide](https://usb-map.gitbook.io/project/)
   * Other issue can be that certain firmwares won't pass USB ownership to macOS, to fix this we can enable `ReleaseUsbOwnership`

# iMessage and Siri Broken

* En0 device not setup as `Built-in`, couple ways to fix:
   * Find PCI path for your NIC with [gfxutil](https://github.com/acidanthera/gfxutil/releases)(ex: ethernet@0). Then via DeviceProperties in your config.plist, apply the property of `built-in` with the value of `01` and type `Data`
   * [NullEthernet.kext](https://bitbucket.org/RehabMan/os-x-null-ethernet/downloads/) + [SSDT-RMNE](https://github.com/RehabMan/OS-X-Null-Ethernet/blob/master/ssdt-rmne.aml)

# Windows Startup Disk can't see APFS drives

* Outdated Bootcamp drivers(generally ver 6.0 will come with brigadier, BootCamp Utility in macOS provides newer version like ver 6.1). CorpNewt has also forked brigadier fixing these issues as well: [CorpNewt's brigadier](https://github.com/corpnewt/brigadier)

# Incorrect resolution with OpenCore

* Follow [Hiding Verbose](verbose.md) for correct setup, set `UIScale` to `02` for HiDPI
* Users also have noticed that setting `ConsoleMode` to Max will sometimes fail, leaving it empty can help

# Receiving "Failed to parse real field of type 1"
* A value is set as `real` when it's not supposed to be, generally being that Xcode converted `HaltLevel` by accident:
```
<key>HaltLevel</key>
<real>2147483648</real>
```
To fix, swap `real` for `integer`:
```
<key>HaltLevel</key>
<integer>2147483648</integer>
```

# Booting OpenCore reboots to BIOS

* Incorrect EFI folder structure, make sure all of your OC files are within an EFI folder located on your ESP(EFI system partition)

![Directory Structure from OpenCore's DOC](https://i.imgur.com/9RyBQ0L.png)
