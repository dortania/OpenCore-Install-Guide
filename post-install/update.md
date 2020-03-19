# Updating OpenCore and macOS

* Last edited: March 15, 2020
* Supported version: 0.5.6

## Updating OpenCore

So the main things to note with updating OpenCore:

* [Releases](https://github.com/acidanthera/OpenCorePkg/releases) happen the first monday of every month
* The [Differences.pdf](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/Differences/Differences.pdf) will tell you all the things added and removed from this version of OpenCore compared to the previous release
* The OpenCore Vanilla Guide will have a note on the [README.md](README.md) about what release version it supports

> So how do I update?

So the process goes as follows:

1. **Download the latest releases of OpenCore and co.**

* [OpenCorePkg](https://github.com/acidanthera/OpenCorePkg/releases)
* [AppleSupportPkg](https://github.com/acidanthera/AppleSupportPkg/releases)

2. **Mount your EFI**

* So first, lets mount your hard drive's EFI and make a copy somewhere safe with [MountEFI](https://github.com/corpnewt/MountEFI). We won't be updating the drive's EFI at first, instead we'll be grabbing a spare USB to be our crash dummy. This allows us to keep a working copy of Opencore incase our update goes south

* For the USB, it must be formatted as GUID. Reason for this is that GUID will autmatically create an EFI partition, though this will be hidden by default so you'll need to mount it with MountEFI.

![](https://cdn.discordapp.com/attachments/683011276938543134/685684724639072296/Screen_Shot_2020-03-06_at_8.06.00_PM.png)

* Now you can place your OpenCore EFI on the USB

![](https://cdn.discordapp.com/attachments/683011276938543134/685686265437487158/Screen_Shot_2020-03-06_at_8.12.18_PM.png)

3. **Replace the OpenCore files with the ones you just downloaded**

* The important ones to update:

   * `EFI/BOOT/BOOTx64.efi`
   * `EFI/OC/OpenCore.efi`
   * `EFI/OC/Drivers/FwRuntimeServices`(**Don't forget this one, OpenCore will not boot with mismatched versions**)

* You can also update other drivers you have if present, these are just the ones that **must** be updated in order to boot correctly

![](https://cdn.discordapp.com/attachments/683011276938543134/685686106385154073/Screen_Shot_2020-03-06_at_8.10.14_PM.png)

4. **Compare your config.plist to that of the new Sample.plist**

* With this, there's a couple ways to do this:

   * [OCConfigCompare](https://github.com/corpnewt/OCConfigCompare) to compare between the sample.plist and your config.plist
   * `diff (file input 1) (file input 2)` in terminal
   * [BeyondCompare](https://www.scootersoftware.com) 
   * Make a new config based off reading the updated Opencore Vanilla Guide

* Once you've made the adjustments and made sure you config is compliant with the newest release of OpenCore, make sure to double check your setting with the OpenCore Guide on what to set everything to, otherwise read the [Differences.pdf](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/Differences/Differences.pdf) if you want to get a bit more technical.

![](https://cdn.discordapp.com/attachments/683011276938543134/685689391703785501/Screen_Shot_2020-03-06_at_8.24.15_PM.png)

4. **Boot!**

* Once everything's working with the dummy USB, you can mount the EFI and move it over to the hard drive's EFI partition. Remember to keep a copy of your old EFI in cases where OpenCore is acting funny down the road

## Updating Kexts

* Updating Kexts is a similar process to updating OpenCore, make a copy of everything and update on a dummy USB in case there's issues

* The easiest way to update your kexts is via 2 tools:

   * [Lilu and Friends](https://github.com/corpnewt/Lilu-and-Friends) to download and compile the kexts
   * [Kext Extractor](https://github.com/corpnewt/KextExtractor) to merge them into your EFI


## Updating macOS

* So this is probably one of the most challenging parts about a hackintosh, maintaining it through OS updates. The main things to keep in mind:
   * With OS updates, make sure everything has been updated and you have some form of recovery like TimeMachine or an older macOS installer with a known good EFI on it
   * Do a bit of google-fu to see if others are having issues with the newest update

* I've also provided a bit more of a detailed map of what's changed in macOS versions, see below:

**macOS Catalina**

* 10.15.0
   * [Requires proper EC](https://khronokernel.github.io/Getting-Started-With-ACPI/)
   * Dual socket and most AMD CPUs need [AppleMCEReporterDisabler.kext](https://github.com/acidanthera/bugtracker/files/3703498/AppleMCEReporterDisabler.kext.zip)
   * MacPro5,1 support has been dropped
* 10.15.1
   * Requires WhateverGreen 1.3.4+
   * Broke DRM for many GPUs(see [DRM Chart](https://github.com/acidanthera/WhateverGreen/blob/master/Manual/FAQ.Chart.md))
   * Requires all previous fixes
* 10.15.2
  * Fixes Navi support in the installer
  * Requires all previous fixes
* 10.15.3
  * No change
  * Requires all previous fixes
* 10.15.4
  * [AMD CPU users need to update `cpuid_set_cpufamily` patch](https://github.com/AMD-OSX/AMD_Vanilla)
  * Fixes DRM on many Ellesmere based Polaris GPUs
  * Requires all previous fixes(excluding `shikigva=80` for Polaris DRM for most users)

