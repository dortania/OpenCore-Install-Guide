# General Troubleshooting

* Supported version: 0.6.5

This section is for those having issues booting either OpenCore, macOS or having issues inside macOS. If you're confused as to where exactly in the macOS boot process you're stuck, reading the [macOS Boot Process](../troubleshooting/boot.md) page can help clarify things.

**And if your issue is not covered, please read the official OpenCore documentation: [Configuration.pdf](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/Configuration.pdf)**. This document goes into much more technical detail around how OpenCore works and has much more detailed info on all supported quirks.

## Table of Contents

If you're unsure where you're currently stuck, please see here: [Understanding the macOS Boot Process](../troubleshooting/boot.md)

* [OpenCore Boot Issues](./extended/opencore-issues.md)
  * This section refers to booting the actual USB and getting to OpenCore's picker. Anything after the picker, like booting macOS, should see below
* [Kernelspace Issues](./extended/kernel-issues.md)
  * Covering everything that many occur in early boot from the moment you select macOS in the OpenCore menu, till the point right before the Apple logo and the installer GUI loads
* [Userspace Issues](./extended/userspace-issues.md)
  * Covering the process from loading macOS's GUI to installing macOS on the drive
* [Post-Install Issues](./extended/post-issues.md)
  * Covering issues once macOS has been installed and is fully booted
* [Miscellaneous Issues](./extended/misc-issues.md)
  * Covering issues after macOS's installation or with other OSes
