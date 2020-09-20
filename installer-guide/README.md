# Creating the USB

* Supported version: 0.6.2

Requirements:

* [OpenCorePkg](https://github.com/acidanthera/OpenCorePkg/releases), highly recommend running the debug version to show more info
* [ProperTree](https://github.com/corpnewt/ProperTree) to edit .plist files (OpenCore Configurator is another tool but is heavily outdated and the Mackie version is known for corruption. **Please avoid these kinds of tools at all costs!**).
* Cleaned NVRAM(This is seriously important if you used Clover before, as many variables will remain causing conflicts. Luckily with OC you can press `CleanNvram` in the boot picker when `AllowNvramReset` is enabled in your config)
* Basic knowledge of how a Hackintosh works and what files yours requires(ie: Type of network controller).
* You must remove Clover from your system entirely if you wish to use OpenCore as your main boot-loader. Keep a backup of your Clover based EFI. See here on what needs to be cleaned: [Clover Conversion](https://github.com/dortania/OpenCore-Install-Guide/tree/master/clover-conversion)

# Making the installer

Depending on which OS you're on, see your specific section on making the USB:

* [macOS users](../installer-guide/mac-install.md)
  * Supports OS X 10.4 to current
* [Windows users](../installer-guide/winblows-install.md)
  * Supports OS X 10.7 to current
* [Linux users](../installer-guide/linux-install.md)
  * Supports OS X 10.7 to current
