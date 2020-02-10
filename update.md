# To-do list

0.5.5 Changes:

* ~~Remove NullCPUPowerManagement.kext~~
* ~~Add DummyPowerManagement~~
* ~~Replace SupportsCsm with AdviseWindows~~
* ~~Add TakeoffDelay~~


0.5.4 Changes:

* ~~Remove all mentions of VirtualSMC.efi~~
* ~~Add info for FileVault, AppleSmcIo~~
   * ~~Reinstalls Apple SMC I/O, this is the equivlant of VirtualSMC.efi~~
* ~~Add AuthRestart info~~
   * ~~Enables Authenticated restart for FileVault2 so password is not required on reboot. Can be concidered a security risk so optional~~
* ~~AllowSetDefault~~
   * Allow CTRL+Enter and CTRL+Index to set default boot device in the picker
* ~~Add SupportsCsm info for Windows~~
   * ~~Used for when the EFI partition isn't the first partition on the windows disk~~
* ~~Add WriteFlash~~
   * Enables writing to flash memory for all added variables, recommeneded for most firmwares
* ~~Add LegacyOverwrite~~
   * ~~Permits overwriting firmware variables from nvram.plist, only needed for systems requiring emulated NVRAM like Z390~~
* ~~Add AppleXcpmForceBoost~~
   * ~~Forces maximum multiplier, only recommended to enable on scientific or media calculation machines~~
* ~~Rename UsbKbDxe to AppleUsbKbDxe~~
* ~~Moved VerifyMsrE2 to OpenCorePkg~~
* ~~Add IncreasePciBarSize quirk~~
   * ~~Expands IOPCIFamily's size from 1GB to 4GB, enabling Above4GDecoding in the BIOS is a much cleaner and safer approach. Some X99 boards may require this, you'll generally expereince a kernel panic on IOPCIFamily if you need this~~
