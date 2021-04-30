# VMware Workstation (Player)

## Requirements

* VMware Workstation or VMware Workstation Player (Linux or Windows)
* qemu-img
  * [Windows](https://cloudbase.it/qemu-img-windows/)
  * Linux: it's automatically installed with qemu.

## Download the Installation Media

You can use [macrecovery](https://github.com/acidanthera/OpenCorePkg/tree/master/Utilities/macrecovery) (see this [guide](../installer-guide/winblows-install.md#downloading-macos)) to obtain the basesystem.dmg file.

## Converting Installation Media

VMware cannot directly use a dmg disk image, so we'll create a vmdk file, which will allow you to use it as a virtual disk drive in VMware Fusion.
With some conversions, we can create our disk image:

```bash
### Change "BaseSystem" if the name of the .dmg file differs
./qemu-img convert BaseSystem.dmg -O vmdk BaseSystem.vmdk
```

## Unlock VMware

To use macOS on these systems, we have to patch some files. To do it, we can use [this tool](https://github.com/paolo-projects/auto-unlocker/releases).
Execute it when VMware is shutted down.

## Create the Virtual Machine

You can use the classic settings that VMware offers, remember that macOS cannot support IDE neither GPU acceleration.

## Edit the vmx file

For booting macOS, we have to add some strings to the vmx file that contains all the settings of our VM.

### VMX patch for Intel Processors

```bash
hw.model = "iMac20,2"
board-id = "Mac-AF89B6D9451A490B"
smc.version = "0"
```

### VMX patch for AMD Processors

```bash
hw.model = "iMac20,2"
board-id = "Mac-AF89B6D9451A490B"
smc.version = "0"
cpuid.0.eax = "0000:0000:0000:0000:0000:0000:0000:1011"
cpuid.0.ebx = "0111:0101:0110:1110:0110:0101:0100:0111"
cpuid.0.ecx = "0110:1100:0110:0101:0111:0100:0110:1110"
cpuid.0.edx = "0100:1001:0110:0101:0110:1110:0110:1001"
cpuid.1.eax = "0000:0000:0000:0001:0000:0110:0111:0001"
cpuid.1.ebx = "0000:0010:0000:0001:0000:1000:0000:0000"
cpuid.1.ecx = "1000:0010:1001:1000:0010:0010:0000:0011"
cpuid.1.edx = "0000:1111:1010:1011:1111:1011:1111:1111"
featureCompat.enable = "FALSE"
```

After that, you can boot up macOS without any problem!

## Install VMware tools

Mount the `darwin.iso` included with VMware (otherwise you can download from [here](https://www.insanelymac.com/forum/files/file/987-vmware-tools-for-os-x-macos-darwiniso-and-darwinpre15iso/))

## Can I have graphical acceleration?

Maybe soon! I'm studying how to do it...
