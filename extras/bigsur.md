# OpenCore and macOS 11: Big Sur

* To do:
  * Grabbing the macOS installer(## Installation)
  * Add VM guide(### Virtual Machine Route)

It's that time of year again and with it, and a new macOS beta has been dropped. Here's all the info you need to get started.

**Reminder that Dortania and any tools mentioned in this guide are neither responsible for damage to your hardware or deaths of any loved ones. You, the end user, must understand this is beta software on unsupported machines so do not pester developers for fixes**

## Backstory

More a mini-explainer as to why this release is a bit more painful than average macOS releases, the main culprits are as follows:

**AvoidRuntimeDefrag**:

With macOS Big Sur, AvoidRuntimeDefrag Booter quirk in OpenCore broke. And because of this, the macOS kernel will fall flat when trying to boot. Reason for this is due to `cpi_count_enabled_logical_processors` requiring the MADT(APIC) table, and so OpenCore will now copy this table and ensure the kernel can access it.  Users will however need a build of OpenCore 0.6.0 with commit [bb12f5f](https://github.com/acidanthera/OpenCorePkg/commit/9f59339e7eb8c213e84551df0fdbf9905cd98ca4) or newer to resolve this issue.

**Kernel Collections vs Prelinked kernel**:

Since 10.7, the prelinked kernel has be the default way for real macs to boot. This contained a very minimal amount of kexts to get a mac booted. This same bundle is what OpenCore uses to inject kexts, and was hoped to last quite some time. With macOS Big Sur, a huge change happened in where Apple no longer makes it the default form of booting. Instead opting for a new bundle called the Kernel Collections, which is unfortunately not compatible with OpenCore's kext injection system

To get around this, we can actually force the prelinked kernel with a simple NVRAM variable. 1 small problem, while an installed Big Sur has a PK the installer actually doesn't have a prelinked kernel. So we need a middle man to install macOS for us, this either being:

* A Genuine Mac
* Virtual Machine

For the former, it's as simple as run the installer, and swap the drive over to the hackintosh. With the latter, we'll be documenting this under [Installation's Virtual Machine Route](#virtual-machine-route).

## Prerequisites

Before we can jump head first into installing Big Sur, we need to go over a few things:

### A supported SMBIOS:

Big Sur dropped a few Ivy Bridge and Haswell based SMBIOS from macOS, so see below that yours wasn't dropped:

* MacBookAir5,x
* MacBookPro10,x and older
* MacMini6,x and older
* iMac 14,3 and older(note iMac14,4 is still supported)

If your SMBIOS was supported in Catalina and isn't included above, you're good to go!

### Supported hardware:

Not much hardware has been dropped, though the few that have:

* Ivy Bridge CPUs.
  * Officially, many have been able to boot with ease.
* Ivy Bridge iGPUs.
  * HD 4000 and HD 2500.
* BCM94331CD based Wifi cards.
  * See [Wireless Buyers guide](https://dortania.github.io/Wireless-Buyers-Guide/) for potential cards to upgrade to.

Also note that AMD OSX has not yet updated their patches, so AMD CPU users will need to wait some time.

### Up-to-date kexts, bootloader and config.plist:

Ensure you've updated to the latest builds(not releases) of OpenCore and all your kexts, as to avoid any odd incompatibility issues. You can find the latest builds of kexts and OpenCore here: [Kext Repo](http://kexts.goldfish64.com/) and [Driver Repo](http://drivers.goldfish64.com/)

You will also need to ensure you have a few NVRAM variables set:

* **NVRAM -> Add -> 7C436110-AB2A-4BBB-A880-FE41995C9F82**:
  * boot-args:
    * `-lilubetaall` (Enables Lilu and plugins on beta macOS versions)
    * `vsmcgen=1` (works around VirtualSMC not properly working in Big Sur)
    * `-disablegfxfirmware` (Works around WhateverGreen failing, **iGPUs only**)
  * booter-fileset-kernel
    *  Set to `00`
    * Enables prelinked kernel in the installed OS, you **need** this to inject kexts
  * booter-fileset-basesystem
    *  Set to `00`
    *  Attempts to enable the prelinked kernel in the installer(unfortunately fails for majority)

See below image as an example:

![](/images/extras/bigsur-md/config-example.png)

### Known issues

With Big Sur, quite a bit broke. Mainly the following:

* VirtualSMC Plugins(including fan, temperature and battery readings)
* AppleALC(for some, not all)
* WhateverGreen(for some, not all)
* AirportBrcmFixup.kext

## Installation

With installation, you'll need a few things:

* macOS Big Sur installer
* Hardware to install with
  * This either being a Genuine Mac or Virtual Machine
* Latest builds of OpenCore and kexts(see above)
* Updated config.plist with prelinked kernel forced(see above)

To grab the Big Sur installer, ..........................

### Genuine Mac Route

For this method, you will need to have access to an external media that can later be used as a boot drive for your hackintosh. Ideally a USB to SATA/NVMe adapter would work best

To start, format your test drive as MacOS Journaled or APFS with a GUID partition scheme. Verify you are formatting the entire drive and not a partition, Disk Utility will only show partitions by default so press Cmd+2 to show the full drive.

![](/images/extras/bigsur-md/disk-utility.png)

Next, run the Install macOS Beta.app and select your drive:

![](/images/extras/bigsur-md/select-your-drive.png)

The installer will proceed to install macOS onto the drive and reboot a few times. Once you hit the welcome screen, you can move the drive over to your hackintosh and attempt a boot!

### Virtual Machine Route

Do your magic Dhinak