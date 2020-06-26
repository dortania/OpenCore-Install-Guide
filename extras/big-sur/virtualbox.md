# VirtualBox

## Requirements

- VirtualBox
- A computer running macOS
- The desired macOS installation software installed to /Applications
- A USB attached hard disk or SSD

## Building Installation Media

Once you have the installation software installed to /Applications you will need to create a VDI of the installation media that will be used to install macOS in your VM.  The instructions below are intended to be cut and pasted without editing unless specified.

First, set the IMAGE variable to the name of the installation you are installing.  The example defines the image for Big Sur.

```bash
export IMAGE="Install macOS Beta"
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
for VDISK in $(hdiutil info 2>&1 | awk '/disk[0-9]/ {print $1}'); hdiutil eject ${VDISK} 2>/dev/null; done
### Next eject the virtual disk itself
hdiutil eject ${DISK}
### Last, create the VDI image
VBoxManage convertfromraw "${IMAGE}.img" "${IMAGE}.vdi" --format VDI
```

## Installing macOS in VirtualBox

First, attach the USB disk that is your target for macOS installation, and create a virtual hard disk that references it to use with VirtualBox.  Note: You may need to remove the partitions of the disk before using it.  You will also need to edit the destination device.

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

![vbox-storage](../../images/extras/bigsur-md/vbox-storage.png)

Now, close VirtualBox and add the following properties to the VM to allow it to boot. 

```bash
sudo VBoxManage modifyvm "Big Sur" --cpuidset 00000001 000306a9 04100800 7fbae3ff bfebfbff

sudo VBoxManage setextradata "Big Sur" "VBoxInternal/Devices/efi/0/Config/DmiSystemProduct" "iMacPro1,1"

sudo VBoxManage setextradata "Big Sur" "VBoxInternal/Devices/efi/0/Config/DmiSystemVersion" "1.0"

sudo VBoxManage setextradata "Big Sur" "VBoxInternal/Devices/efi/0/Config/DmiBoardProduct" "Mac-7BA5B2D9E42DDD94"

sudo VBoxManage setextradata "Big Sur" "VBoxInternal/Devices/smc/0/Config/DeviceKey" "ourhardworkbythesewordsguardedpleasedontsteal(c)AppleComputerInc"

sudo VBoxManage setextradata "Big Sur" "VBoxInternal/Devices/smc/0/Config/GetKeyFromRealSMC" 1
```

Start VirtualBox as root, and start the VM.  The installer should begin to boot.  Complete the installation as you would on any other device.

```bash
sudo VirtualBox
```

When the installation is complete, and you are at the Welcome screen, send an ACPI shutdown signal to macOS and select shutdown.

Add your prepared EFI to the EFI partition on the USB device, and eject it.

Place the drive back in your hack and boot normally.
