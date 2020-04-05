# Post Install

* Last edited: March 15, 2020
* Supported version: 0.5.6

So you've finally finsihed installing macOS with OpenCore but know there's still some things to clean up, well you've come to the right place!

## Universal

This section is benificial for all, regardless of hardware.

* [Correcting Audio](/post-install/audio.md)
* [Enabling FileVault and other security features](/post-install/security.md)
* [Booting macOS without a USB](/post-install/oc2hdd.md)
* [Updating OpenCore, kexts and macOS](/post-install/update.md)
* [Disabling OpenCore Logging](/troubleshooting/debug.md)
* [Fixing iServices](/post-install/iservices.md)
* [Fixing DRM](/post-install/drm.md)

## Intel

Used for Intel's consumer line

* [Fixing Intel USB](https://usb-map.gitbook.io/project/)
* [Fixing CFG Lock](extras/msr-lock.md)


For sandy and Ivy Bridge:
* [Fixing Power Management](https://github.com/Piker-Alpha/ssdtPRGen.sh)

## Intel HEDT

Used for Intel's High End and Server line

* [Fixing Intel USB](https://usb-map.gitbook.io/project/)
* [Emulating NVRAM](/post-install/nvram.md)

For Sandy and Ivy Bridge E:
* [Fixing Power Management](https://github.com/Piker-Alpha/ssdtPRGen.sh)

## AMD

Used for AMD CPU based hardware

* [Fixing AMD USB](https://github.com/khronokernel/Opencore-Vanilla-Desktop-Guide/blob/master/AMD/AMD-USB-map.md)
* [Fixing AMD Temperature readings](https://github.com/trulyspinach/SMCAMDProcessor)
