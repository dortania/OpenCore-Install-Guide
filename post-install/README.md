# Post Install

* Supported version: 0.5.8

So you've finally finished installing macOS with OpenCore but know there's still some things to clean up, well you've come to the right place!

## Universal

This section is beneficial for all, regardless of hardware.

* [Correcting Audio](/post-install/audio.md)
* [Enabling FileVault and other security features](/post-install/security.md)
* [Booting macOS without a USB](/post-install/oc2hdd.md)
* [Updating OpenCore, kexts and macOS](/post-install/update.md)
* [Disabling OpenCore Logging](/troubleshooting/debug.md)
* [Fixing iServices](/post-install/iservices.md)
* [Fixing DRM](/post-install/drm.md)
* [Fixing Power Management](/post-install/pm.md)

## Intel

Used for Intel's consumer line

* [Fixing Intel USB](https://usb-map.gitbook.io/project/)
* [Fixing CFG Lock](/extras/msr-lock.md)
* [Emulating NVRAM](/post-install/nvram.md)

## AMD

Used for AMD CPU based hardware

* [Fixing AMD USB](https://dortania.github.io/USB-Map-Guide/)
* [Fixing AMD Temperature readings](https://github.com/trulyspinach/SMCAMDProcessor)

## Maxwell and Pascal

For those limited to macOS High Sierra and are having issues installing web drivers, the following tool will help patch in support:

* [Web-Driver-Toolkit](https://github.com/corpnewt/Web-Driver-Toolkit)

Note: Kepler GPUs do not need web drivers, they're natively supported by macOS even in Catalina
