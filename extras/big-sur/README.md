# OpenCore and macOS 11: Big Sur

* To do:
  * Clarify that raw disk works for both internal and external for VBox
  * Add Workstation, with USB passing and raw disk passing
  * Pass USB device instead of using raw disk for VBox, will leave to fewt

It's that time of year again and with it, and a new macOS beta has been dropped. Here's all the info you need to get started.

**Reminder that Dortania and any tools mentioned in this guide are neither responsible for any corruption, data loss, or other ill effects that may arise from this guide, including ones caused by typos. You, the end user, must understand this is beta software on unsupported machines so do not pester developers for fixes. Dortania will not be accepting issues regarding this mini-guide except for typos and/or errors.**

**This guide expects you to have a basic understanding of the terminal, virtual machines, and hackintoshing. If you are not familiar with these, we highly recommend you to wait until there is an easier and more straight-forward solution available.**

## Backstory

More a mini-explainer as to why this release is a bit more painful than average macOS releases, the main culprits are as follows:

### `AvoidRuntimeDefrag`

With macOS Big Sur, the `AvoidRuntimeDefrag` Booter quirk in OpenCore broke. Because of this, the macOS kernel will fall flat when trying to boot. Reason for this is due to `cpi_count_enabled_logical_processors` requiring the MADT (APIC) table, and so OpenCore will now copy this table and ensure the kernel can access it.  Users will however need a build of OpenCore 0.6.0 with commit [`bb12f5f`](https://github.com/acidanthera/OpenCorePkg/commit/9f59339e7eb8c213e84551df0fdbf9905cd98ca4) or newer to resolve this issue.

### Kernel Collections vs prelinkedkernel

Since 10.7, the prelinkedkernel has been the default way for real macs to boot. This contained a very minimal amount of kexts to get a mac booted. This same bundle is what OpenCore uses to inject kexts, and was hoped to last quite some time. With macOS Big Sur, a huge change happened in where Apple no longer makes it the default form of booting. Instead opting for a new bundle called the Kernel Collections, which is unfortunately not compatible with OpenCore's kext injection system currently.

To get around this, we can actually force the prelinkedkernel with a simple NVRAM variable. 1 small problem; while a fully installed Big Sur has a PK, the installer doesn't have a prelinkedkernel. So we need a middle man to install macOS for us, this either being:

* A Genuine Mac
* Virtual machine

For the former, it's as simple as run the installer, and swap the drive over to the hackintosh. With the latter, we'll be documenting this under [Installation's Virtual Machine Route](#virtual-machine-route).

## Prerequisites

Before we can jump head first into installing Big Sur, we need to go over a few things:

### A supported SMBIOS

Big Sur dropped a few Ivy Bridge and Haswell based SMBIOS from macOS, so see below that yours wasn't dropped:

* iMac14,3 and older
  * Note iMac14,4 is still supported
* MacPro5,1 and older
* MacMini6,x and older
* MacBook7,1 and older
* MacBookAir5,x and older
* MacBookPro10,x and older

If your SMBIOS was supported in Catalina and isn't included above, you're good to go!

### Supported hardware

Not much hardware has been dropped, though the few that have:

* Ivy Bridge CPUs.
  * Unofficially, many have been able to boot with ease.
* Ivy Bridge iGPUs.
  * HD 4000 and HD 2500, initial developer beta forgot to remove drivers but more than likely to be removed in later updates.
* BCM94331CD based Wifi cards.
  * See [Wireless Buyers guide](https://dortania.github.io/Wireless-Buyers-Guide/) for potential cards to upgrade to.

Also note that AMD OSX has updated their patches, but they are experimental and unsupported and you will not obtain support for them.

### Up-to-date kexts, bootloader and config.plist

Ensure you've updated to the latest builds (not releases) of OpenCore and all your kexts, as to avoid any odd incompatibility issues. You can find the latest builds of kexts and OpenCore here: [Kext Repo](http://kexts.goldfish64.com/) and [Driver Repo (contains OpenCore builds too)](http://drivers.goldfish64.com/).

You will also need to ensure you have a few NVRAM variables set:

* **`NVRAM` -> `Add` -> `7C436110-AB2A-4BBB-A880-FE41995C9F82`**:
  * `boot-args`:
    * `-lilubetaall` (Enables Lilu and plugins on beta macOS versions)
    * `vsmcgen=1` (works around VirtualSMC not properly working in Big Sur)
    * `-disablegfxfirmware` (Works around WhateverGreen failing, **iGPUs only**. Note newer builds of WhateverGreen should fix this)
  * `booter-fileset-kernel`
    * Set to `00`
    * Enables prelinkedkernel in the installed OS, you **need** this to inject kexts
  * `booter-fileset-basesystem`
    * Set to `00`
    * Attempts to enable the prelinkedkernel in the bootable installer (unfortunately, still doesn't help for many)

See below image as an example:

![](/images/extras/bigsur-md/config-example.png)

### Known issues

With Big Sur, quite a bit broke. Mainly the following:

* SMCBatteryManager
  * Currently Rehabman's [ACPI Battery Manager](https://bitbucket.org/RehabMan/os-x-acpi-battery-driver/downloads/) is the only working kext.
* AirportBrcmFixup
  * Forcing a specific driver to load with `brcmfx-driver=` may help
  * BCM94352Z users for example may need `brcmfx-driver=2` in boot-args to resolve this, other chipsets will need other variables.

And while not an issue, SIP has now gained a new bit so to properly disable SIP you need set `csr-acive-config` to `FF0F0000`

## Installation

With installation, you'll need a few things:

* macOS Big Sur installer
* Hardware to install with
  * This either being a Genuine Mac or virtual machine
* A Mac, hack, or preexisting VM to download the installer and create install media
* Latest builds of OpenCore and kexts (see above)
* Updated config.plist with prelinkedkernel forced (see above)

To grab the Big Sur installer, download the beta profile from Apple's developer portal, then check for updates in System Preferences. If you don't have a developer account, you can use gibMacOS to download it:

1. Download gibMacOS and open `gibMacOS.command`.
2. Press `M` to change the Max OS, then enter `10.16` to switch the (update) catalog to the Big Sur one. (screenshot)
3. Press `C` to change the catalog, then select the number for the developer catalog.
4. Select the number for the Big Sur beta to start downloading it. (screenshot)
5. Once finished, open the InstallAssistant.pkg that was downloaded - it will be located in the `gibMacOS/macOS Downloads/developer/XXX-XXXXX - Install macOS Beta` folder. This package from Apple will create `Install macOS Beta.app` in your `/Applications` folder. (screenshot)

### Genuine Mac Route

For this method, you will need to have access to external media that can later be used as a boot drive for your hackintosh. Ideally a USB to SATA/NVMe adapter would work best.

To start, format your test drive as MacOS Journaled or APFS with a GUID partition scheme. Verify you are formatting the entire drive and not a partition, Disk Utility will only show partitions by default so press Cmd+2 to show the full drive.

![](/images/extras/big-sur/readme/disk-utility.png)

Next, run the Install macOS Beta.app and select your drive:

![](/images/extras/big-sur/readme/select-your-drive.png)

The installer will proceed to install macOS onto the drive and reboot a few times. Once you hit the welcome screen, you can move the drive over to your hackintosh and attempt to boot!

### Virtual Machine Route

#### Building the Installation Media

Requirements:

* A computer or VM running macOS
* The desired macOS installation software installed to /Applications

Once you have the installation software installed to /Applications you will need to create a VDI of the installation media that will be used to install macOS in your VM.  The instructions below are intended to be cut and pasted without editing unless specified.

First, set the IMAGE variable to the name of the installation you are installing.  The example defines the image for Big Sur.

```bash
export IMAGE="Install macOS Big Sur Beta"
```

Next, create an empty 16GB image to host the media.

```bash
mkfile -n 16g "${IMAGE}.img"
```

Verify that you have a 16GB file named "Install macOS Beta.img" before continuing.  After that, attach it to your macOS system as a virtual disk using the variable you created earlier.

```bash
export DISK=$(hdiutil attach -imagekey diskimage-class=CRawDiskImage -nomount "${IMAGE}.img"| awk '{printf $1}')
```

Run diskutil list and verify that you have a disk attached that is type "disk image".

```bash
diskutil list
<snip>
/dev/disk4 (disk image):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:                                                   +16.8 GB    disk4
```

Now that the image is mounted, format it to Journaled HFS+.

```bash
diskutil eraseDisk JHFS+ "${IMAGE}" ${DISK}
```

Once the image is formatted, create the installation media.

```bash
sudo "/Applications/${IMAGE}.app/Contents/Resources/createinstallmedia" --nointeraction --volume "/Volumes/${IMAGE}"
```

(insert unmount SharedSupport here)

Now detach or eject the virtual disk, and convert it to a VDI.

```bash
### Eject all of the sub volumes first.
for VDISK in $(hdiutil info 2>&1 | awk '/disk[0-9]/ {print $1}'); do hdiutil eject ${VDISK} 2>/dev/null; done
### Next eject the virtual disk itself
hdiutil eject ${DISK}
```

You now have an raw image of the installer. Follow the appropriate page for the hypervisor you'll be choosing:

* [VirtualBox](virtualbox.md)
* [VMware Fusion](fusion.md)
* [VMware Workstation](workstation.md)
