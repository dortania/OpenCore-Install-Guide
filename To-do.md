So this little section is just a preview of what I need to add to the guide, specifically all the changes made in OpenCore.

0.5.4 Changes:

* Remove all mentions of VirtualSMC.efi
* Add AppleSmcIo info for FileVault
   * Reinstalls Apple SMC I/O, this is the equivlant of VirtualSMC.efi
* Add AuthRestart info
   * Enables Authenticated restart for FileVault2 so password is not required on reboot. Can be concidered a secuirty risk so optional
* Add SupportsCsm info for Windows
   * Used for when the EFI partition isn't the first partition on the windows disk
* Add WriteFlash
   * Enables writing to flash memory for all added variables
* Add LegacyOverwrite
   * Permits overwriting firmware variables from nvram.plist, only needed for systems requiring emulated NVRAM like Z390
* Add AppleXcpmForceBoost
   * Forces maximum multiplier, only recommended to enable on scientific or media calculation machines
* Rename UsbKbDxe to AppleUsbKbDxe
* Moved VerifyMsrE2 to OpenCorePkg
