# VirtualBox

## Requirements

* VirtualBox
* A USB attached hard disk or SSD

## Download the Installation Media

You can use [macrecovery](https://github.com/acidanthera/OpenCorePkg/tree/master/Utilities/macrecovery) (see this [guide](../installer-guide/winblows-install.md#downloading-macos)) to optain the basesystem.dmg file.

## Converting Installation Media

VirtualBox cannot directly use a dmg image, so we're going to convert it to a `VDI`.

`cd` to the location of the disk image and run the following:

```bash
### Change "Install macOS Big Sur Beta" if the name of the .img file differs
VBoxManage convertdd "Install macOS Big Sur Beta.img" "Install macOS Big Sur Beta.vdi"
```

## Installing macOS in VirtualBox

Next, start VirtualBox as root and create a new macOS virtual machine.

```bash
sudo VirtualBox
```

* Name: Big Sur
* Type: MacOS 64bit

* 2-4 CPU cores
* 4-8 GB RAM
* Create one virtual disk (we will install macOS in)

Attach the disks that you've created in previous steps as shown:

![](../images/extras/virtualbox/vbox-storage.png)

Now, close VirtualBox and add the following properties to the VM to allow it to boot.

```bash
sudo VBoxManage modifyvm "Big Sur" --cpuidset 00000001 000306a9 04100800 7fbae3ff bfebfbff

sudo VBoxManage setextradata "Big Sur" "VBoxInternal/Devices/efi/0/Config/DmiSystemProduct" "iMacPro1,1"

sudo VBoxManage setextradata "Big Sur" "VBoxInternal/Devices/efi/0/Config/DmiSystemVersion" "1.0"

sudo VBoxManage setextradata "Big Sur" "VBoxInternal/Devices/efi/0/Config/DmiBoardProduct" "Mac-7BA5B2D9E42DDD94"

sudo VBoxManage setextradata "Big Sur" "VBoxInternal/Devices/smc/0/Config/DeviceKey" "ourhardworkbythesewordsguardedpleasedontsteal(c)AppleComputerInc"

sudo VBoxManage setextradata "Big Sur" "VBoxInternal/Devices/smc/0/Config/GetKeyFromRealSMC" 1
```

Start VirtualBox as root, and start the VM. The installer should begin to boot. Complete the installation as you would on any other device.

```bash
sudo VirtualBox
```
