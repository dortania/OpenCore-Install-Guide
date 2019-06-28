# What is OpenCore?

OpenCore is an alternative to Clover. By design, OpenCore is versatile by being more modular and open as it aims to resolve the constraints and issues that Clover brings. It is not only for Hackintoshes as it can be used for other purposes that require an emulated EFI. Please remember we’re still in very early infancy so there will be issues. This specific guide will be omitting Vault.plist and Vault.sig as there's still quite a bit of development happening there. OpenCore should be considered in Alpha stage at this time. If you have a working, stable system you should not migrate unless you prefer "bleeding edge" development, want to contribute, and don't mind recovering your system should it fail to boot.

# Current issues with OpenCore

* Order of kexts matter: Make sure to have kexts like Lilu and VoodooPS2Controller to be injected first beofre kexts that require them like WhateverGreen, VirtualSMC, keyboard/Mouse/Trackpad and etc
* Z97 based systems require pure UEFI mode for booting (also known as Windows 8/10 mode).
* NVMe issues if setup as a SATA device in BIOS.
* Sometimes can't access other partitions on the drive, solution is to "bless" the drive with Startup Disk

# Setting up OpenCore

Requirements:

* [OpenCorePkg](https://github.com/acidanthera/OpenCorePkg/releases) (Recommend to build from scratch instead of using the prebuilt package as OpenCore is constantly being updated. As of writing we're on Version 0.0.3 even though the current official release is 0.0.1)
* [AppleSupportPkg](https://github.com/acidanthera/AppleSupportPkg/releases)
* [AptioFixPkg](https://github.com/acidanthera/AptioFixPkg/releases)
* [mountEFI](https://github.com/corpnewt/MountEFI) or some form of EFI mounting. Clover Configurator works just as well
* Xcode to edit .plist files ([OpenCore Configurator](https://www.insanelymac.com/forum/topic/338686-opencore-configurator/) is another tool, but vit9696 has stated multiple times he does not support these tools and they even break OpenCore's specifications. Use at own risk!)
* USB formatted as MacOS Journaled with GUID partition map.
* Knowledge of how a hackintosh works and what files yours requires.
* A working Hackintosh to test on.
* You must remove Clover from your system entirely if you wish to use it as your main boot-loader. Keep a backup of your Clover based EFI.
