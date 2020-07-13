# Post Install

* Supported version: 0.5.9

So you've finally finished installing macOS with OpenCore but know there's still some things to clean up, well you've come to the right place!

## Universal

This section is beneficial for all, regardless of hardware:

* [Correcting Audio](https://dortania.github.io/OpenCore-Post-Install/)
* [Enabling FileVault and other security features](https://dortania.github.io/OpenCore-Post-Install/universal/security.html)
* [Booting macOS without a USB](https://dortania.github.io/OpenCore-Post-Install/universal/oc2hdd.html)
* [Updating OpenCore, kexts and macOS](https://dortania.github.io/OpenCore-Post-Install/universal/update.html)
* [Disabling OpenCore Logging](/troubleshooting/debug.md)
* [Fixing iServices](https://dortania.github.io/OpenCore-Post-Install/universal/iservices.html)
* [Fixing DRM](https://dortania.github.io/OpenCore-Post-Install/universal/drm.html)
* [Fixing Power Management](https://dortania.github.io/OpenCore-Post-Install/universal/pm.html)
* [Setting up Bootstrap.efi](https://dortania.github.io/OpenCore-Post-Install/multiboot/bootstrap.html)
* [Installing BootCamp](https://dortania.github.io/OpenCore-Post-Install/multiboot/bootcamp.html)
* [Fixing USB](https://dortania.github.io/USB-Map-Guide/)

## Intel

Used for Intel's consumer line:

* [Fixing CFG Lock](https://dortania.github.io/OpenCore-Post-Install/misc/msr-lock.html)

And with the HEDT series:

* [Emulating NVRAM](https://dortania.github.io/OpenCore-Post-Install/misc/nvram.html)

## AMD

Used for AMD CPU based hardware:

* [Fixing AMD Temperature readings](https://github.com/trulyspinach/SMCAMDProcessor)

## Maxwell and Pascal

For those limited to macOS High Sierra and are having issues installing web drivers, the following tool will help patch in support:

* [Web-Driver-Toolkit](https://github.com/corpnewt/Web-Driver-Toolkit)

Note: Kepler GPUs do not need web drivers, they're natively supported by macOS even in Catalina
