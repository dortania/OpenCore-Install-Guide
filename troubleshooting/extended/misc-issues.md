# Miscellaneous Issues

* Supported version: 0.6.5

Miscellaneous issues not revolving around macOS itself such as multibooting.

* [Can't run `acpidump.efi`](#can-t-run-acpidump-efi)
* [Fixing SSDTTime: `Could not locate or download iasl!`](#fixing-ssdttime-could-not-locate-or-download-iasl)
* [Fix Python: `Python is not installed or not found on PATH`](#fix-python-python-is-not-installed-or-not-found-on-path)
* [Windows Startup Disk can't see APFS drives](#windows-startup-disk-can-t-see-apfs-drives)
* [Incorrect resolution with OpenCore](#incorrect-resolution-with-opencore)
* [Can't find Windows/BootCamp drive in picker](#can-t-find-windows-bootcamp-drive-in-picker)
* [Selecting Startup Disk doesn't apply correctly](#selecting-startup-disk-doesn-t-apply-correctly)
* [Booting Windows results in BlueScreen or Linux crashes](#booting-windows-results-in-bluescreen-or-linux-crashes)
* [Booting Windows error: `OCB: StartImage failed - Already started`](#booting-windows-error-ocb-startimage-failed-already-started)
* [iASL warning, # unresolved](#iasl-warning-unresolved)

## Can't run `acpidump.efi`

Call upon OpenCore shell:

```
shell> fs0: //replace with proper drive

fs0:\> dir //to verify this is the right directory

  Directory of fs0:\

   01/01/01 3:30p  EFI
fs0:\> cd EFI\OC\Tools //note that its with forward slashes

fs0:\EFI\OC\Tools> acpidump.efi -b -n DSDT -z
```

## Fixing SSDTTime: `Could not locate or download iasl!`

This is usually due to an outdated version of Python, try either updating Python or add iasl to the scripts folder for SSDTTime:

* [iasl macOS version](https://bitbucket.org/RehabMan/acpica/downloads/iasl.zip)
* [iasl Windows version](https://acpica.org/downloads/binary-tools)
* [iasl Linux version](http://amdosx.kellynet.nl/iasl.zip)

## Fix Python: `Python is not installed or not found on PATH`

Easy fix, download and install the latest python:

* [macOS link](https://www.python.org/downloads/macos)
* [Windows link](https://www.python.org/downloads/windows/)
* [Linux link](https://www.python.org/downloads/source/)

Make sure `Add Python to PATH`

![](../../images/troubleshooting/troubleshooting-md/python-path.png)

## Windows Startup Disk can't see APFS drives

* Outdated BootCamp drivers(generally ver 6.0 will come with brigadier, BootCamp Utility in macOS provides newer version like ver 6.1). CorpNewt has also forked brigadier fixing these issues as well: [CorpNewt's brigadier](https://github.com/corpnewt/brigadier)

## Incorrect resolution with OpenCore

* Follow [Fixing Resolution and Verbose](https://dortania.github.io/OpenCore-Post-Install/cosmetic/verbose.html) for correct setup, set `UIScale` to `02` for HiDPI
* Users also have noticed that setting `ConsoleMode` to Max will sometimes fail, leaving it empty can help

## Can't find Windows/BootCamp drive in picker

So with OpenCore, we have to note that legacy Windows installs are not supported, only UEFI. Most installs now are UEFI based but those made by BootCamp Assistant are legacy based, so you'll have to find other means to make an installer(Google's your friend). This also means MasterBootRecord/Hybrid partitions are also broken so you'll need to format the drive you want to install onto with DiskUtility. See the [Multiboot Guide](https://hackintosh-multiboot.gitbook.io/hackintosh-multiboot/) on best practices

Now to get onto troubleshooting:

* Make sure `Misc -> Security -> ScanPolicy` is set to `0` to show all drives
* Enable `Misc -> Boot -> Hideself` when Windows bootloader is located on the same drive

## Selecting Startup Disk doesn't apply correctly

If you're having issues with Startup Disk correctly applying your new boot entry, this is most likely caused by a missing `DevicePathsSupported` in your I/O Registry. To resolve this, ensure you are using `PlatformInfo -> Automatic -> True`

Example of missing `DevicePathsSupported`:

* [Default DevicePath match failure due to different PciRoot #664](https://github.com/acidanthera/bugtracker/issues/664#issuecomment-663873846)

## Booting Windows results in BlueScreen or Linux crashes

This is due to alignment issues, make sure `SyncRuntimePermissions` is enabled on firmwares supporting MATs. Check your logs whether your firmware supports Memory Attribute Tables(generally seen on 2018 firmwares and newer)

Common Windows error code:

* `0xc000000d`

## Booting Windows error: `OCB: StartImage failed - Already started`

This is due to OpenCore getting confused when trying to boot Windows and accidentally thinking it's booting OpenCore. This can be avoided by either move Windows to it's own drive *or* adding a custom drive path under BlessOverride. See [Configuration.pdf](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/Configuration.pdf) for more details.

## iASL warning, # unresolved

If you try to decompile your DSDT and get an error similar to this:

```
iASL Warning: There were 19 external control methods found during disassembly, but only 0 were resolved (19 unresolved)
```

This happens when one ACPI table requires the rest for proper referencing, it does not accept the creation of DSDTs as we're only using it for creating a select few SSDTs. For those who are worried, you can run the following:

```
iasl * [insert all ACPI files here]
```

## Time inconsistency between macOS and Windows

This is due to macOS using Universal Time while Windows relies on Greenwhich time, so you'll need to force one OS to a different way of measuring time. We highly recommend modifying Windows instead as it's far less destructive and painful:

* [Install Bootcamp utilities](https://dortania.github.io/OpenCore-Post-Install/multiboot/bootcamp.html)
* [Modify Windows' registry](https://superuser.com/q/494432)
