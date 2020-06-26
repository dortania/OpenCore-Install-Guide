# OpenCore and macOS 11: Big Sur

* To do:
  * Grabbing the macOS installer(## Installation)
  * Add VM guide(### Virtual Machine Route)

It's that time of year again and with it, and a new macOS beta has been dropped. Here's all the info you need to get started.

**Reminder that Dortania and any tools mentioned in this guide are neither responsible for any corruption, data loss, or other ill effects that may arise from this guide, including ones caused by typos. You, the end user, must understand this is beta software on unsupported machines so do not pester developers for fixes. Dortania will not be accepting issues regarding this mini-guide except for typos and/or errors.**

## Backstory

More a mini-explainer as to why this release is a bit more painful than average macOS releases, the main culprits are as follows:

**AvoidRuntimeDefrag**:

With macOS Big Sur, the AvoidRuntimeDefrag Booter quirk in OpenCore broke. Because of this, the macOS kernel will fall flat when trying to boot. Reason for this is due to `cpi_count_enabled_logical_processors` requiring the MADT (APIC) table, and so OpenCore will now copy this table and ensure the kernel can access it.  Users will however need a build of OpenCore 0.6.0 with commit [bb12f5f](https://github.com/acidanthera/OpenCorePkg/commit/9f59339e7eb8c213e84551df0fdbf9905cd98ca4) or newer to resolve this issue.

**Kernel Collections vs prelinkedkernel**:

Since 10.7, the prelinkedkernel has been the default way for real macs to boot. This contained a very minimal amount of kexts to get a mac booted. This same bundle is what OpenCore uses to inject kexts, and was hoped to last quite some time. With macOS Big Sur, a huge change happened in where Apple no longer makes it the default form of booting. Instead opting for a new bundle called the Kernel Collections, which is unfortunately not compatible with OpenCore's kext injection system currently.

To get around this, we can actually force the prelinkedkernel with a simple NVRAM variable. 1 small problem, while an fully installed Big Sur has a PK, the installer doesn't have a prelinkedkernel. So we need a middle man to install macOS for us, this either being:

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
  * Unofficially, many have been able to boot with ease.
* Ivy Bridge iGPUs.
  * HD 4000 and HD 2500.
* BCM94331CD based Wifi cards.
  * See [Wireless Buyers guide](https://dortania.github.io/Wireless-Buyers-Guide/) for potential cards to upgrade to.

Also note that AMD OSX has updated their patches, but they are experimental and unsupported and you will not obtain support for them.

### Up-to-date kexts, bootloader and config.plist:

Ensure you've updated to the latest builds (not releases) of OpenCore and all your kexts, as to avoid any odd incompatibility issues. You can find the latest builds of kexts and OpenCore here: [Kext Repo](http://kexts.goldfish64.com/) and [Driver Repo (contains OpenCore builds too)](http://drivers.goldfish64.com/).

You will also need to ensure you have a few NVRAM variables set:

* **`NVRAM` -> `Add` -> `7C436110-AB2A-4BBB-A880-FE41995C9F82`**:
  * `boot-args`:
    * `-lilubetaall` (Enables Lilu and plugins on beta macOS versions)
    * `vsmcgen=1` (works around VirtualSMC not properly working in Big Sur)
    * `-disablegfxfirmware` (Works around WhateverGreen failing, **iGPUs only**)
  * `booter-fileset-kernel`
    *  Set to `00`
    * Enables prelinkedkernel in the installed OS, you **need** this to inject kexts
  * `booter-fileset-basesystem`
    *  Set to `00`
    *  Attempts to enable the prelinkedkernel in the bootable installer (unfortunately, still doesn't help for many)

See below image as an example:

![](/images/extras/bigsur-md/config-example.png)

### Known issues

With Big Sur, quite a bit broke. Mainly the following:

* VirtualSMC Plugins (including fan, temperature and battery readings)
* AppleALC (for some, not all)
* WhateverGreen (for some, not all)
* AirportBrcmFixup

## Installation

With installation, you'll need a few things:

* macOS Big Sur installer
* Hardware to install with
  * This either being a Genuine Mac or Virtual Machine
* Latest builds of OpenCore and kexts (see above)
* Updated config.plist with prelinkedkernel forced (see above)

To grab the Big Sur installer, either download the beta profile 

### Genuine Mac Route

For this method, you will need to have access to an external media that can later be used as a boot drive for your hackintosh. Ideally a USB to SATA/NVMe adapter would work best

To start, format your test drive as MacOS Journaled or APFS with a GUID partition scheme. Verify you are formatting the entire drive and not a partition, Disk Utility will only show partitions by default so press Cmd+2 to show the full drive.

![](/images/extras/bigsur-md/disk-utility.png)

Next, run the Install macOS Beta.app and select your drive:

![](/images/extras/bigsur-md/select-your-drive.png)

The installer will proceed to install macOS onto the drive and reboot a few times. Once you hit the welcome screen, you can move the drive over to your hackintosh and attempt a boot!

### Virtual Machine Route

#### VMWare

Do your magic Dhinak

#### VirtualBox

##### Requirements

- VirtualBox
- A computer running macOS
- The desired macOS installation software installed to /Applications
- A USB attached hard disk or SSD

##### Building Installation Media

Once you have the installation software installed to /Applications you will need to create a VDI of the installation media that will be used to install macOS in your VM.

First, set the IMAGE variable to the name of the installation you are installing.  The example defines the image for Big Sur.

```bash
export IMAGE="Install macOS Beta"
```

Next, create an empty 16GB image to host the media.

```bash
dd if=/dev/zero of="${IMAGE}.img" bs=1m count=16000
```

Verify that you have a 16GB file named "Install macOS Beta.img" before continuing.  After that, attach it to your macOS system as a virtual disk using the variable you created earlier.

```bash
export DISK=($(hdiutil attach -imagekey diskimage-class=CRawDiskImage -nomount "${IMAGE}.img"))
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
diskutil eraseDisk JHFS+ "${IMAGE}" ${DISK[0]}
```

Once the image is formatted, create the installation media.

```bash
sudo "/Applications/${IMAGE}.app/Contents/Resources/createinstallmedia" --nointeraction --volume "/Volumes/${IMAGE}"
```

Now detach or eject the virtual disk, and convert it to a VDI.

```bash
hdiutil detach ${DISK[0]}
VBoxManage convertfromraw "${IMAGE}.img" "${IMAGE}.vdi" --format VDI
```

##### Installing macOS in VirtualBox

First, attach the USB disk that is your target for macOS installation, and create a virtual hard disk that references it to use with VirtualBox.  Note: You may need to remove the partitions of the disk before using it.

```bash
diskutil list
# locate the external disk that matches, and replace /dev/disk3 below with the device path.
sudo VBoxManage internalcommands createrawvmdk -filename RawHDD.vmdk -rawdisk /dev/disk3
```

Next, start VirtualBox as root and create a new macOS virtual machine.

```bash
sudo VirtualBox
```

* Name: Big Sur
* Type: MacOS 64bit

- 2-4 CPU cores
- 4-8GB RAM
- Do not create a virtual disk.

Attach the disks that you've created in previous steps as shown:

![vbox-storage](../images/extras/bigsur-md/vbox-storage.png)

Now, close VirtualBox and add the following properties to the VM to allow it to boot. 

```bash
VBoxManage modifyvm "Big Sur" --cpuidset 00000001 000306a9 04100800 7fbae3ff bfebfbff

VBoxManage setextradata "Big Sur" "VBoxInternal/Devices/efi/0/Config/DmiSystemProduct" "iMacPro1,1"

VBoxManage setextradata "Big Sur" "VBoxInternal/Devices/efi/0/Config/DmiSystemVersion" "1.0"

VBoxManage setextradata "Big Sur" "VBoxInternal/Devices/efi/0/Config/DmiBoardProduct" "Mac-7BA5B2D9E42DDD94"

VBoxManage setextradata "Big Sur" "VBoxInternal/Devices/smc/0/Config/DeviceKey" "ourhardworkbythesewordsguardedpleasedontsteal(c)AppleComputerInc"

VBoxManage setextradata "Big Sur" "VBoxInternal/Devices/smc/0/Config/GetKeyFromRealSMC" 1
```

Start VirtualBox as root, and start the VM.  The installer should begin to boot.  Complete the installation as you would on any other device.

```bash
sudo VirtualBox
```

When the installation is complete, and you are at the Welcome screen, send an ACPI shutdown signal to macOS and select shutdown.

Add your prepared EFI to the EFI partition on the USB device, and eject it.

Place the drive back in your hack and boot normally.