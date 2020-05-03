# Post-Install

* Supported version: 0.5.7

So you've finally finished installing macOS with OpenCore but know there's still some things to clean up, well you've come to the right place!

## Universal

This section is beneficial for all, regardless of hardware.

* [Correcting Audio](audio.md)
* [Enabling FileVault and other security features](security.md)
* [Booting macOS without a USB](oc2hdd.md)
* [Updating OpenCore, kexts and macOS](update.md)
* [Disabling OpenCore Logging](../../troubleshooting/debug.md)
* [Fixing iServices](iservices.md)
* [Fixing DRM](drm.md)
* [Fixing Power Management](pm.md)

## Intel

Used for Intel's consumer line

* [Fixing Intel USB](https://usb-map.gitbook.io/project/)
* [Fixing CFG Lock](https://github.com/dortania/OpenCore-Desktop-Guide/tree/eb65e8891b0534a231cf2f39e55dd34c6e32ea05/post-install/extras/msr-lock.md)
* [Emulating NVRAM](nvram.md)

## AMD

Used for AMD CPU based hardware

* [Fixing AMD USB](https://dortania.github.io/USB-Map-Guide/)
* [Fixing AMD Temperature readings](https://github.com/trulyspinach/SMCAMDProcessor)

## Maxwell and Pascal

For those limited to macOS High Sierra and are having issues installing web drivers, the following tool will help patch in support:

* [Web-Driver-Toolkit](https://github.com/corpnewt/Web-Driver-Toolkit)

Note: Kepler GPUs do not need web drivers, they're natively supported by macOS even in Catalina

