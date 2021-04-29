# VMware Workstation (Player)

## Requirements

* VMware Workstation or VMware Workstation Player
* Java (both the JRE and JDK work)
* A computer running macOS
* The desired macOS installation software installed to /Applications
* A USB attached hard disk or SSD, or an internal disk that can be passed through entirely

## Converting Installation Media

VMware cannot directly use a raw disk image, so we'll create a linked VMDK, which will allow you to use it as a virtual hard drive in VMware Fusion.

Download raw2vmdk from [here](https://github.com/dortania/OpenCore-Install-Guide/blob/master/extra-files/raw2vmdk.jar), and put it in the same directory as the `.img` file. Then, run the following command:

```bash
### Change "Install macOS Big Sur Beta" if the name of the .img file differs
java -jar raw2vmdk.jar "Install macOS Big Sur Beta.img" "Install macOS Big Sur Beta.vmdk"
```

This will create a VMDK that references the `.img` file (the raw disk image) for VMware to use. If you're going to move this vmdk or transfer it to another computer, you must move the img file along with it.

## Unlock VMware

To use macOS on these systems, we have to patch some files. To do it, we can use [this tool](https://github.com/paolo-projects/auto-unlocker/releases).
Execute it when VMware is shutted down.

## Create the Virtual Machine

You can use the classic settings that VMware offers, remember that macOS cannot support IDE neither GPU acceleration.

## Edit the vmx file

For booting macos, we have to add some strings to the vmx file that contains all the settings of our VM.

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

## Boot the machine and install macOS

## Install VMware tools

Mount the `darwin.iso` included with VMware (otherwise you can download from [here](https://www.insanelymac.com/forum/files/file/987-vmware-tools-for-os-x-macos-darwiniso-and-darwinpre15iso/))

## Can I have graphical acceleration?

Maybe soon! I'm studying how to do it...
