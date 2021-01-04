# Creating the USB

* Supported version: 0.6.5

Requirements:

* [OpenCorePkg](https://github.com/acidanthera/OpenCorePkg/releases), highly recommend running the debug version to show more info
* [ProperTree](https://github.com/corpnewt/ProperTree) to edit .plist files (OpenCore Configurator is another tool but is heavily outdated and the Mackie version is known for corruption. **Please avoid these kinds of tools at all costs!**).
* You must remove Clover from your system entirely if you wish to use OpenCore as your main boot-loader. Keep a backup of your Clover based EFI. See here on what needs to be cleaned: [Clover Conversion](https://github.com/dortania/OpenCore-Install-Guide/tree/master/clover-conversion)

### Online vs Offline Installer

Offline installers have a complete copy of macOS, while online installers are only a recovery image (~500MB) which then download macOS from Apple servers once booted.

* Offline
  * Can only be made in macOS
  * Windows/Linux do not have the APFS/HFS drivers needed to assemble a full installer
* Online
  * Can be made in macOS/Linux/Windows
  * Requires a working internet connection via a macOS supported network adapter on the target machine

### Making the Installer

Depending on which OS you're on, see your specific section on making the USB:

* [macOS users](../installer-guide/mac-install.md)
  * Supports OS X 10.4 to current
  * Supports both legacy and UEFI installs
* [Windows users](../installer-guide/winblows-install.md)
  * Supports OS X 10.7 to current
  * Online installer only
  * Supports both legacy and UEFI installs
* [Linux users(UEFI)](../installer-guide/linux-install.md)
  * Supports OS X 10.7 to current
  * Online installer only
  * Meant for machines supporting UEFI Boot
