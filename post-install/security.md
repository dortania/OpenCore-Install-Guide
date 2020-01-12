# Security

So something that makes OpenCore truly special is how it's been built with security in mind which is quite rare especially in the Hackintosh community. Well here we'll be going through setting up FileVault and talking about 2 features of OpenCore:

* ScanPolicy
* Vault(work in progress)

**Reminder**: Keep a backup of your EFI and macOS data in case you have issues getting into macOS after enabling FileVault.

## FileVault Setup

To start, you'll need the following .efi drivers:

* VirtualSMC.efi(To be used in conjunction with VirtualSMC.kext)
* FwRuntimeServices.efi
* UsbKbDxe.efi may be needed if OpenCore's built-in input doesn't work

Setting in your config.plist:

* Misc -> Boot 
* `PollAppleHotKeys` set to YES(While not needed can be helpful)
* NVRAM -> Add -> 4D1EDE05-38C7-4A6A-9CC6-4BCCA8B38C14
* `UIScale` set to `02` for high resolution, small displays
* UEFI -> Input
* `KeySupport` set to YES(Only when using OpenCore's built-in input, users of UsbKbDxe should avoid)
* UEFI -> Protocols
* `FirmwareVolume` set to YES
* `HashServices` set to YES for Haswell and older, this is needed for systems with broken SHA-1 hashing
* UEFI -> Quirks
* `ProvideConsoleGOP` to YES
* `RequestBootVarRouting` set to YES
* `ExitBootServicesDelay` set to `5` if you recieve `Still waiting for root device` on Aptio IV firmwares(Haswell and older)

With all this, reboot testing the keyboard still works in the picker and you can proceed to enable FileVault like on a normal mac under `System Preferences -> Security & Privacy -> FileVault`

## Scan Policy

What this quirk allows to prevent scanning and booting from untrusted sources. Setting to `0` will allow all sources present to be bootable but calculating a specific ScanPolicy value will allow you a greater range of flexibility and security.

To calculate the ScanPolicy value, you simply add up all the hexadecimal values\(with a hexadecimal calculator, you can access this from the built-in macOS caluclator app with `⌘+3`\). Once it's all added up, you would add this hexadecimal value to ScanPolicy\(you will need to convert it to a decimal value first, Xcode will automatically convert it when you paste it\)

`0x00000001 (bit 0)` — OC\_SCAN\_FILE\_SYSTEM\_LOCK

* restricts scanning to only known file systems defined as a part of this policy. File system drivers may not be aware of this policy, and to avoid mounting of undesired file systems it is best not to load its driver. This bit does not affect dmg mounting, which may have any file system. Known file systems are prefixed with OC_SCAN\_ALLOW\_FS_.

`0x00000002 (bit 1)` — OC\_SCAN\_DEVICE\_LOCK

* restricts scanning to only known device types defined as a part of this policy. This is not always possible to detect protocol tunnelling, so be aware that on some systems it may be possible e.g. USB HDDs to be recognised as SATA. Cases like this must be reported. Known device types are prefixed with OC_SCAN\_ALLOW\_DEVICE_.

`0x00000100 (bit 8)` — OC\_SCAN\_ALLOW\_FS\_APFS

* allows scanning of APFS file system.

`0x00000200 (bit 9)` — OC\_SCAN\_ALLOW\_FS\_HFS

* allows scanning of HFS file system.

`0x00000400 (bit 10)` — OC\_SCAN\_ALLOW\_FS\_ESP

* allows scanning of EFI System Partition file system.

`0x00010000 (bit 16)` — OC\_SCAN\_ALLOW\_DEVICE\_SATA

* allow scanning SATA devices.

`0x00020000 (bit 17)` — OC\_SCAN\_ALLOW\_DEVICE\_SASEX

* allow scanning SAS and Mac NVMe devices.

`0x00040000 (bit 18)` — OC\_SCAN\_ALLOW\_DEVICE\_SCSI

* allow scanning SCSI devices.

`0x00080000 (bit 19)` — OC\_SCAN\_ALLOW\_DEVICE\_NVME

* allow scanning NVMe devices.

`0x00100000 (bit 20)` — OC\_SCAN\_ALLOW\_DEVICE\_ATAPI

* allow scanning CD/DVD devices.

`0x00200000 (bit 21)` — OC\_SCAN\_ALLOW\_DEVICE\_USB

* allow scanning USB devices.

`0x00400000 (bit 22)` - OC\_SCAN\_ALLOW\_DEVICE\_FIREWIRE

* allow scanning FireWire devices. 

`0x00800000 (bit 23)` — OC\_SCAN\_ALLOW\_DEVICE\_SDCARD

* allow scanning card reader devices.

By default, ScanPolicy is given a value of `0xF0103`\(983,299\) which is the combination of the following:

* OC\_SCAN\_FILE\_SYSTEM\_LOCK 
* OC\_SCAN\_DEVICE\_LOCK
* OC\_SCAN\_ALLOW\_FS\_APFS
* OC\_SCAN\_ALLOW\_DEVICE\_SATA 
* OC\_SCAN\_ALLOW\_DEVICE\_SASEX 
* OC\_SCAN\_ALLOW\_DEVICE\_SCSI 
* OC\_SCAN\_ALLOW\_DEVICE\_NVME

And let's just say for this example that you want to add OC\_SCAN\_ALLOW\_DEVICE\_USB:

`0x00200000` + `0xF0103` = `0x2F0103`

And converting this to decimal gives us `3,080,451`

## Vault

**Work in progress**

What is vaulting? Well vaulting is based around 2 things, vault.plist and vault.sig:
* vault.plist: a "snapshot" of your EFI
* vault.sig: validation of vault.plist

Do note that nvram.plist won't be vaulted



Setting in your config.plist:
* `RequireSignature` set to YES
* `RequireVault` set to YES



