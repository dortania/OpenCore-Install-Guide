
So something that makes OpenCore truly special is how it's been built with security in mind which is quite rare especially in the hackintosh community. Well here we'll be talking about 2 features of OpenCore:

* ScanPolicy
* Vault


# Scan Policy

What this quirk allows to prevent scanning and booting from untrusted sources. Setting to `0` will allow all sources present to be bootable but calculating a specific ScanPolicy value will allow you a greater range of flexibilty and security.

To calculate the ScanPolicy value, you simply add up all the hexidecimal values(with a hexideciaml calculator, you can access this from the built-in macOS caluclator app with `⌘+3`). Once it's all added up, you would add this hexidecimal value to ScanPolicy(you will need to convert it to a decimal value first, Xcode will automatically convert it when you paste it)

`0x00000001 (bit 0)` — OC_SCAN_FILE_SYSTEM_LOCK 
* restricts scanning to only known file systems defined as a part of this policy. File system drivers may not be aware of this policy, and to avoid mounting of undesired file systems it is best not to load its driver. This bit does not affect dmg mounting, which may have any file system. Known file systems are prefixed with OC_SCAN_ALLOW_FS_.

`0x00000002 (bit 1)` — OC_SCAN_DEVICE_LOCK
* restricts scanning to only known device types defined as a part of this policy. This is not always possible to detect protocol tunneling, so be aware that on some systems it may be possible for e.g. USB HDDs to be recognised as SATA. Cases like this must be reported. Known device types are prefixed with OC_SCAN_ALLOW_DEVICE_.
`0x00000100 (bit 8)` — OC_SCAN_ALLOW_FS_APFS
* allows scanning of APFS file system.

`0x00000200 (bit 9)` — OC_SCAN_ALLOW_FS_HFS
* allows scanning of HFS file system.

`0x00000400 (bit 10)` — OC_SCAN_ALLOW_FS_ESP
* allows scanning of EFI System Partition file system.

`0x00010000 (bit 16)` — OC_SCAN_ALLOW_DEVICE_SATA
* allow scanning SATA devices.

`0x00020000 (bit 17)` — OC_SCAN_ALLOW_DEVICE_SASEX
* allow scanning SAS and Mac NVMe devices.

`0x00040000 (bit 18)` — OC_SCAN_ALLOW_DEVICE_SCSI
* allow scanning SCSI devices.

`0x00080000 (bit 19)` — OC_SCAN_ALLOW_DEVICE_NVME
* allow scanning NVMe devices.

`0x00100000 (bit 20)` — OC_SCAN_ALLOW_DEVICE_ATAPI
* allow scanning CD/DVD devices.

`0x00200000 (bit 21)` — OC_SCAN_ALLOW_DEVICE_USB
* allow scanning USB devices.

`0x00400000 (bit 22)` - OC_SCAN_ALLOW_DEVICE_FIREWIRE
* allow scanning FireWire devices. 

`0x00800000 (bit 23)` — OC_SCAN_ALLOW_DEVICE_SDCARD
* allow scanning card reader devices.


By default, ScanPolicy is given a value of `0xF0103`(983,299) which is the combination of the following:

* OC_SCAN_FILE_SYSTEM_LOCK 
* OC_SCAN_DEVICE_LOCK
* OC_SCAN_ALLOW_FS_APFS
* OC_SCAN_ALLOW_DEVICE_SATA 
* OC_SCAN_ALLOW_DEVICE_SASEX 
* OC_SCAN_ALLOW_DEVICE_SCSI 
* OC_SCAN_ALLOW_DEVICE_NVME

And lets just say for this example that you want to add OC_SCAN_ALLOW_DEVICE_USB:

`0x00400000` + `0xF0103` = `0x4F0103`

And converting this to decimal gives us `5,177,603`


# Vault

**Work in progress**
