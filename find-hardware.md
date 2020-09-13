# Finding your hardware

This section is mostly a mini-guide on how to find what hardware you're currently running; this is mainly relevant for laptop and prebuilt users as hardware specs are a bit more difficult to obtain. You can skip this page and head to [Creating the USB](./installer-guide/) if you already know what hardware you have.

For this, we'll assume you have Windows or Linux installed:

* [Finding hardware using Windows](#finding-hardware-using-windows)
* [Finding hardware using Linux](#finding-hardware-using-linux)

## Finding Hardware using Windows

For this we have mainly 2 options:

* Windows' Built-in DeviceManager
* [AIDA64](https://www.aida64.com/downloads)

Due to the easier to use GUI, we recommend downloading AIDA64 and running this as it's much easier to grab specs. However we'll show you both methods for obtaining hardware specs.

### CPU Model

| AIDA64 | DeviceManager|
| :--- | :--- |
| ![](./images/finding-hardware-md/cpu-model-aida64.png) | ![](./images/finding-hardware-md/cpu-model-devicemanager.png) |

### GPU Model

| AIDA64 | DeviceManager|
| :--- | :--- |
| ![](./images/finding-hardware-md/GPU-model-aida64.png) | ![](./images/finding-hardware-md/GPU-model-devicemanager.png) |

### Chipset Model

| AIDA64 | DeviceManager|
| :--- | :--- |
| ![](./images/finding-hardware-md/chipset-model-aida64.png) | ![](./images/finding-hardware-md/chipset-model-devicemanager.png) |

* Note: Intel SOC based CPUs will have the chipset and other features already on the same die instead of being dedicated chips. This means trying to detect the exact chipset is a bit more difficult

### Keyboard, Trackpad and Touchscreen Connection Type

| DeviceManager |
| :--- |
| ![](./images/finding-hardware-md/trackpad-model-devicemanager.png) |

AIDA64 unfortunately doesn't provide any useful info regarding pointer devices, so we recommend using DeviceManager for this.

* You can find these devices under the following:
  * `Human Interface Devices`
  * `Keyboards`
  * `Mice and other Pointer Devices`

* To view the exact connection type of the device, select the pointer device then enter `View -> Device by Connection`. This will clarify whether it's over PS2, I2C, SMBus, USB, etc

#### Edge Cases

Depending on the device, it may show up under multiple names and connections. The main ones to keep an eye on:

* SMBus
  * These will show up under both PS2 under `Synaptics PS2 device` and PCI as `Synaptic SMBus Driver`
    * ie. `Synaptics Pointer device` and `Synaptic SMBus Driver`
	* ie. `ELAN Pointer device` and `ELAN SMBus Driver`
* USB
  * These will show up as a PS2 Compliant Trackpad
* I2C Connection Type
  * Currently there's many flavours of I2C Touch-pads, so finding your exact connection type can be a bit difficult.
  
::: details SMBus Example

| Synaptics Example | ELAN Example |
| :--- | :--- |
| ![](./images/finding-hardware-md/Windows-SMBus-Device.png) | ![](./images/finding-hardware-md/ELAN-SMBus-DeviceManager.png) |

As you can see, we get 2 Synaptics devices in the left image, however if we take a closer look we'll see the top device is PS2, while the bottom one is SMBus. While you can use the trackpad in either mode, SMBus provides much functionality and precision with [VoodooRMI](https://github.com/VoodooSMBus/VoodooRMI). Same idea applies to ELAN devices

* Note not all Synaptics and ELAN devices support SMBus

:::

::: details USB Example

| Device by Type | Device by Connection |
| :--- | :--- |
| ![](./images/finding-hardware-md/USB-trackpad-normal.png) | ![](./images/finding-hardware-md/USB-trackpad-by-connection.png)

As you can, our trackpad actually shows up under the USB bus when we switch our connection view to `Device by Connection`

:::

::: details I2C Connection Type

Currently VoodooI2C supports these flavours of touch-pads:

| Connection type | Plugin | Notes |
| :--- | :--- | :--- |
| Microsoft HID | VoodooI2CHID | |
| ELAN Proprietary | VoodooI2CElan | ELAN1200+ require VoodooI2CHID instead |
| Synaptic's Proprietary | VoodooI2CSynaptics | Synaptic F12 protocol require VoodooI2CHID instead |
| FTE1001 touchpad | VoodooI2CFTE | |
| Touchbase Driver | VoodooI2CUPDDEngine | |
| Atmel Multitouch Protocol | VoodooI2CAtmelMXT | |

To determine which plugin to use, see here

:::
  
### Audio Codec

| AIDA64 | DeviceManager|
| :--- | :--- |
| ![](./images/finding-hardware-md/audio-controller-aida64.png) | ![](./images/finding-hardware-md/audio-controller-aida64.png.png) |

Due to how certain OEMs present device names, the most accurate info you can get with DeviceManager is via the PCI ID(ie. pci 14F1,50F4). This means you'll need to google the ID and figure out the exact device ID, however AIDA64 can present the name properly which is quite a bit easier on the end user.

### Network Controller models

| AIDA64 | DeviceManager|
| :--- | :--- |
| ![](./images/finding-hardware-md/nic-model-aida64.png) | ![](./images/finding-hardware-md/nic-model-devicemanager.png) |

Due to how certain OEMs present device names, the most accurate info you can get with DeviceManager is via the PCI ID(ie. pci 14e4,43a0). This means you'll need to google the ID and figure out the exact device ID, however AIDA64 can present the name properly which is quite a bit easier on the end user.

### Drive Model

| AIDA64 | DeviceManager|
| :--- | :--- |
| ![](./images/finding-hardware-md/disk-model-aida64.png) | ![](./images/finding-hardware-md/disk-model-devicemanager.png) |

Due to OEMs not providing much details about the drive, you'll need to google a bit which drive matches up with the displayed name.

## Finding Hardware using Linux

For finding hardware using Linux, we'll be using a few tools:

* `cat`
* `pciutils`
* `dmidecode`

Below you'll find a list of commands to run in the terminal, thankfully most Linux distros will come with these tools already installed.

### CPU Model

```sh
cat /proc/cpuinfo | grep 'model name'
```

### GPU Model

```sh
lspci | grep -i --color 'vga\|3d\|2d'
```

### Chipset Model

```sh
dmidecode -t baseboard
```

### Keyboard, Trackpad and  Touchscreen Connection Type

```sh
dmesg |grep -i 'input'
```

### Audio Codec

```sh
lspci | grep -i 'audio'
```

### Network Controller models

Basic info:

```sh
lspci | grep -i 'network'
```

More in-depth info:

```sh
lshw -class network
```

### Drive Model

```sh
lshw -class disk -class storage
```
