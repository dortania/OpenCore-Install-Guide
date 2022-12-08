# DeviceProperties

Device configuration is provided to macOS with a dedicated buffer, called `EfiDevicePathPropertyDatabase`. This buffer is a serialised map of DevicePaths to a map of property names and their values.

Device properties are part of the `IODeviceTree (gIODT)` plane of the macOS I/O Registry. This plane has several construction stages relevant for the platform initialisation. While the early construction stage is performed by the XNU kernel in the `IODeviceTreeAlloc` method, the majority of the construction is performed by the platform expert, implemented in `AppleACPIPlatformExpert.kext`.

We're going to use this section mainly for patching the iGPU of Intel CPUs. Please do not try injecting values you don't know about.


<details>
<summary><strong>TABLE of CONTENTS</strong> (click to reveal)</summary>

- [General Configuration Notes](#general-configuration-notes)
	- [About the used properties](#about-the-used-properties)
- [Empty Framebuffers (for Desktop)](#empty-framebuffers-for-desktop)
- [Framebuffers (Desktop)](#framebuffers-desktop)
	- [Coffee Lake and Comet Lake](#coffee-lake-and-comet-lake)
	- [Kaby Lake](#kaby-lake)
	- [Skylake](#skylake)
	- [Haswell and Broadwell](#haswell-and-broadwell)
	- [Ivy Bridge](#ivy-bridge)
	- [Sandy Bridge](#sandy-bridge)
- [Framebuffers (Laptop/NUC)](#framebuffers-laptopnuc)
	- [Ice Lake](#ice-lake)
	- [Coffee Lake Plus and Comet Lake](#coffee-lake-plus-and-comet-lake)
	- [Coffee Lake and Whiskey Lake](#coffee-lake-and-whiskey-lake)
	- [Kaby Lake and Amber Lake](#kaby-lake-and-amber-lake)
		- [Connector Patches for HD 6XX models (not UHD!)](#connector-patches-for-hd-6xx-models-not-uhd)
	- [Skylake](#skylake-1)
	- [Broadwell](#broadwell)
	- [Haswell](#haswell)
	- [Ivy Bridge](#ivy-bridge-1)
		- [Connector Patches for `04006601`](#connector-patches-for-04006601)
		- [Connector Patches for `03006601`](#connector-patches-for-03006601)
	- [Sandy Bridge](#sandy-bridge-1)
- [About VGA](#about-vga)

</details>

## General Configuration Notes
Most of the Framebuffer patches listed below (besides empty framebuffers) represent the bare minimum configuration to get on-board graphics and hardware acceleration working. In cases where your display output does not work, you may have to change the `AAPL,ig-platform-id` and/or add display connector data using Hackintool and following a general framebuffer patching guide [**such as this**](https://www.tonymacx86.com/threads/guide-general-framebuffer-patching-guide-hdmi-black-screen-problem.269149/). 

For more Framebuffer options, please refer to Whatevergreen's [**Intel HD FAQs**](https://github.com/acidanthera/WhateverGreen/blob/master/Manual/FAQ.IntelHD.en.md). But keep in mind the the Framebuffer Data in these FAQs is provided in Big Endian, so you can't use it as is – you have to [**convert it to Little Endian**](https://www.save-editor.com/tools/wse_hex.html#littleendian) first!

### About the used properties

 Key | Function |
 ---------| -------- |
`AAPL,ig-platform-id` |Platform identifier of the iGPU you are using/spoofing.
`AAPL,snb-platform-id`|Same as above but for Sandy Bridge CPUs only. 
`device-id` | Device identifier of the GPU you are spoofing. Only required if the iGPU model on the used CPU is not natively supported by macOS.
`framebuffer-patch-enable` | Switch to enable framebuffer patching. Required when setting properties like `fbmem`, `stolenmem` or `unifiedmem`. 
`framebuffer-fbmem` | Patches framebuffer memory. Required if you cannot set DVMT to 64 MB in the BIOS. ⚠️ Don't use if the DVMT option is available in the BIOS.
`framebuffer-stolenmem` | Patches framebuffer stolen memory. Required if you cannot adjust DVMT to 64MB in the BIOS. ⚠️ Don't use if the DVMT option is available in the BIOS.
`framebuffer-unifiedmem` | Can be used to increase the amount of assigned VRAM. ⚠️ Don't use `framebuffer-unifiedmem` and `framebuffer-stolenmem` together at the same time – use either or!

## Empty Framebuffers (for Desktop)
List of empty Framebuffers for Intel CPUs with on-board graphics. For using on-board graphics for computational tasks only (like QuickSync Video, etc.) when a discrete GPU used for displaying graphics.

**Address**: `PciRoot(0x0)/Pci(0x2,0x0)`

CPU Family (iGPU variant)| Type | AAPL,ig-platform-id | device-id | Notes
-------------------------|:----:|:-------------------:|-----------|------
Comet Lake |Data|`0300C89B`
Coffee Lake | Data |`0300913E`
Kaby Lake | Data |`03001259`
Skylake | Data |`01001219`
Skylake (P530) | Data |`01001219`| `1B190000` | P530 is not natively supported so you need to add the device-id as well.
Haswell | Data| `04001204`
Haswell (HD 4400)| Data| `04001204`|`12040000` ||HD 4400 is unsupported in macOS so the device-id is needed to spoof it as HD 4600 instead.
Ivy Bridge | Data| `07006201`|

CPU Family | Type | AAPL,snb-platform-id | device-id
-----------|:----:|:--------------------:|-----------
Sandy Bridge| Data | `00000500`|`02010000`

## Framebuffers (Desktop)
AMD and 11th gen and newer Intel CPUs are unsupported! Since High End Desktop (HEDT) CPUs don't feature integrated graphics, there are no Device Properties to add for these!

### Coffee Lake and Comet Lake
>For Intel UHD-630. 8th to 10th Gen Intel Core CPUs

**Address**: `PciRoot(0x0)/Pci(0x2,0x0)`

Key | Type | Value| Notes 
----|:----:|:-------:|-----
`AAPL,ig-platform-id` | Data | `07009B3E`| Default
`AAPL,ig-platform-id `| Data| `00009B3E`| If the default causes black screen issues
||||
`framebuffer-patch-enable`| Data | `01000000`
`framebuffer-stolenmem` | Data | `00003001`

**NOTE**: The following mainboards/chipsets require [BusID patches](https://dortania.github.io/OpenCore-Post-Install/gpu-patching/intel-patching/busid.html#parsing-the-framebuffer) if the screen turns black after booting in verbose mode: **B360, B365, H310, H370, Z390**.

### Kaby Lake
>For Intel HD-630. 7th Gen Intel Core.

**Address**: `PciRoot(0x0)/Pci(0x2,0x0)`

Key | Type | Value
----|:----:|:----:
`AAPL,ig-platform-id` | Data | `00001259`|
||||
`framebuffer-patch-enable`| Data | `01000000`
`framebuffer-stolenmem` | Data | `00003001`

### Skylake
>For Intel HD-510-580 and Intel HD P530. 6th Gen Intel Core.</br>
>Officially supported since macOS 10.11.4 to macOS 12.x.

**Address**: `PciRoot(0x0)/Pci(0x2,0x0)`

Key | Type | Value| Notes 
----|:----:|:----:|------
`AAPL,ig-platform-id`| Data| `00001219` 
||||
`framebuffer-patch-enable`| Data | `01000000`
`framebuffer-stolenmem` | Data | `00003001`
`framebuffer-fbmem`| Data | `00009000`
||||
`device-id` | Data | `1B190000` | ⚠️ Only needed when using Intel HD P530!

For enabling Skylake graphics on macOS Ventura, you need a [spoof](https://github.com/5T33Z0/OC-Little-Translated/tree/main/11_Graphics/iGPU/Skylake_Spoofing_macOS13).

### Haswell and Broadwell
>For HD 4400, HD 4600 and Iris Pro 6200. 4th and 5th Gen Intel Core.

**Address**: `PciRoot(0x0)/Pci(0x2,0x0)`

Key | Type | Value| Notes 
----|:----:|:----:|------
`AAPL,ig-platform-id`| Data | `0300220D` | For Haswell/Haswell Refresh and Devil's Canyon CPUs
`AAPL,ig-platform-id`| Data | `07002216` | For Broadwell CPUs
||||
`framebuffer-patch-enable`| Data | `01000000`
`framebuffer-stolenmem` | Data | `00003001`
`framebuffer-fbmem`| Data | `00009000`
||||
`device-id`| Data| `12040000` | ⚠️ Only needed when using HD Intel HD 4400!

### Ivy Bridge
>For Intel HD 2500/4000. 3rd Gen Intel Core</br>
>Supported from OS X 10.8.x to macOS 11.x (officially), macOS 12 with Post-Install patches

**Address**: `PciRoot(0x0)/Pci(0x2,0x0)`

Key | Type | Value|
----|:----:|:----:|
`AAPL,ig-platform-id`| Data | `0A006601`

### Sandy Bridge
>Intel HD 3000. 2nd Gen Intel Core.</br>
>Supported from macOS 10.6.7 to macOS 10.13

**Address**: `PciRoot(0x0)/Pci(0x2,0x0)`

Key | Type | Value
----|:----:|:----:
`AAPL,snb-platform-id`| Data | `10000300`
`device-id` | Data | `26010000`

## Framebuffers (Laptop/NUC)

### Ice Lake
>Intel Iris Plus Graphics. 10th Gen Intel Core Mobile</br>
>Supported since: macOS 10.15.4

**Address**: `PciRoot(0x0)/Pci(0x2,0x0)`

Key | Type | Value
----|:----:|:----:
`AAPL,ig-platform-id`|Data| `0000528A`
||||
`framebuffer-patch-enable`| Data | `01000000`
`framebuffer-stolenmem` | Data | `00003001`
`framebuffer-fbmem`| Data | `00009000`|

### Coffee Lake Plus and Comet Lake
>For Intel UHD-630. 8th to 10th Gen Intel Core Mobile.

**Address**: `PciRoot(0x0)/Pci(0x2,0x0)`

Key | Type | Value| Notes
----|:----:|:----:|------
`AAPL,ig-platform-id`| Data | `0900A53E` | F Laptops with UHD 630
`AAPL,ig-platform-id`| Data | `00009B3E` | For Laptops with UHD 620
`AAPL,ig-platform-id`| Data | `07009B3E` | For NUCs with UHD 620/630
`AAPL,ig-platform-id`| Data | `0000A53E` | For NUCs with UHD 655
||||
`framebuffer-patch-enable`| Data | `01000000`
`framebuffer-stolenmem` | Data | `00003001`
`framebuffer-fbmem`| Data | `00009000`
||||
`device-id` | Data | `9B3E0000` | ⚠️ Only required for UHD 620 and UHD 655!

### Coffee Lake and Whiskey Lake
>For Intel UHD 620/630/655. 8th and 9th Gen Intel Core Mobile.</br>
>Supported since: Coffee Lake: macOS 10.13; Whiskey Lake: macOS 10.14.1

**Address**: `PciRoot(0x0)/Pci(0x2,0x0)`

Key | Type | Value| Notes
----|:----:|:----:|------
`AAPL,ig-platform-id`|Data| `0900A53E` |For Laptops with UHD 630
`AAPL,ig-platform-id`|Data| `00009B3E` |For Laptops with UHD 620
`AAPL,ig-platform-id`|Data| `07009B3E` |For NUCs with UHD 620/630
`AAPL,ig-platform-id`|Data| `0000A53E` |For NUCs with UHD 655
||||
`framebuffer-patch-enable`| Data | `01000000`
`framebuffer-stolenmem` | Data | `00003001`
`framebuffer-fbmem`| Data | `00009000`
||||
`device-id`|Data|`9B3E0000`| ⚠️ For UHD 630: only required if the Device-iD IS NOT `0x3E9B`. Under Windows, open Device Manager, bring up the iGPU, open the properties, select details and click on Hardware IDs and check.
`device-id`|Data|`9B3E0000`| ⚠️ Only required for Coffee Lake CPUs with UHD 620.

**NOTES**:

- For **Lenovo T490**: add and enable the patch located in the `UEFI/ReservedMemory` section of the sample.plist to fix black screen issues after waking from hibernation. 

### Kaby Lake and Amber Lake
>For Intel HD 615/617/620/630/640/650</br>
>Supported since: macOS 10.12

**Address**: `PciRoot(0x0)/Pci(0x2,0x0)`

Key | Type | Value| Notes
----|:----:|:----:|------
`AAPL,ig-platform-id`|Data| `00001B59`| For Laptops with HD 615, HD 620, HD 630, HD 640 and HD 650 UHD 630.
`AAPL,ig-platform-id`|Data| `00001659` |Alternative to `00001B59` if you have acceleration issues, and for all HD and UHD 620 NUCs.
`AAPL,ig-platform-id`|Data| `0000C087`| For Laptops with Amber Lake's UHD 617 and Kaby Lake-R's UHD 620.
`AAPL,ig-platform-id`|Data| `00001E59`| For NUCs with HD 615
`AAPL,ig-platform-id`|Data| `00001B59`| For NUCs with HD 630
`AAPL,ig-platform-id`|Data| `02002659`| For NUCs with HD 640/650
||||
`framebuffer-patch-enable`| Data | `01000000`
`framebuffer-stolenmem` | Data | `00003001`
`framebuffer-fbmem`| Data | `00009000`
||||
`device-id`|Data|`16590000`| ⚠️ All UHD 620 with Kaby Lake-R require a device-id spoof!

#### Connector Patches for HD 6XX models (not UHD!)
HD 6xx users (UHD 6xx users are not concerned) may face some issues with the output where plugging in a display causes a lock up (kernel panic). Listed below are some patches to mitigate that (credits to RehabMan). If you're facing lock ups, try the following sets of patches (try both, but only one set at a time): 

- **con1** as 105, **con2** as 204, both HDMI:

	Key | Type | Value
	----|:----:|:----
	`framebuffer-patch-enable`| Data | `01000000`
	`framebuffer-con1-alldata` | Data | `01050A00 00080000 87010000`
	`framebuffer-con2-enable`| Data | `01000000`
	`framebuffer-con2-alldata` |Data| `02040A00 00080000 87010000`

- **con1** as 105, **con2** as 306, HDMI and DP:

	Key | Type | Value
	----|:----:|:----
	`framebuffer-patch-enable`| Data | `01000000`
	`framebuffer-con1-alldata` | Data | `01050A00 00080000 87010000`
	`framebuffer-con2-enable`| Data | `01000000`
	`framebuffer-con2-alldata` |Data| `03060A00 00040000 87010000`

### Skylake
>For Intel HD 510/515/520/530/540/550/580 and P530. 6th Gen Intel Core Mobile.</br>
>Supported since: macOS 10.11

**Address**: `PciRoot(0x0)/Pci(0x2,0x0)`

Key | Type | Value| Notes
----|:----:|:----:|------
`AAPL,ig-platform-id`|Data| `00001619` | For Laptops with HD 515, HD 520, HD 530, HD 540, HD 550 and P530.
`AAPL,ig-platform-id`|Data| `00001E19` | Alternative for HD 515 if you have issues with the above entry.
`AAPL,ig-platform-id`|Data| `00001B19` | For Laptops with HD 510
`AAPL,ig-platform-id`|Data| `00001E19` | For NUCs with HD 515
`AAPL,ig-platform-id`|Data| `02001619` | For NUCs with HD 520/530
`AAPL,ig-platform-id`|Data| `02002619` | For NUCs with HD 540/550
`AAPL,ig-platform-id`|Data| `05003B19` | For NUCs with HD 580
||||
`framebuffer-patch-enable`| Data | `01000000`
`framebuffer-stolenmem` | Data | `00003001`
`framebuffer-fbmem`| Data | `00009000`
||||
`device-id` |Data |`02190000` | ⚠️ Required for HD 510
`device-id` |Data |`16190000` | ⚠️ Required for HD 550 and P530 

### Broadwell
>For Intel HD 5500/5600/6000 and Iris (Pro) 6100/6200. 5th Gen Intel Core Mobile.</br>
>Supported since: macOS 10.10

**Address**: `PciRoot(0x0)/Pci(0x2,0x0)`

Key | Type | Value| Notes
----|:----:|:----:|------
`AAPL,ig-platform-id`|Data| `06002616` | For Broadwell Laptops
`AAPL,ig-platform-id`|Data| `02001616` | For Broadwell NUCs
||||
`framebuffer-patch-enable`| Data | `01000000`
`framebuffer-stolenmem` | Data | `00003001`
`framebuffer-fbmem`| Data | `00009000`
||||
`device-id` | Data |`26160000` | Required For HD 5600

### Haswell
>For Intel HD 4200/4400/4600 and HD 5000/5100/5200. 4th Gen Intel Core Mobile.</br>
>Supported since: macOS 10.8

**Address**: `PciRoot(0x0)/Pci(0x2,0x0)`

Key | Type | Value| Notes
----|:----:|:----:|------
`AAPL,ig-platform-id`|Data| `0500260A` | For Laptops with HD 5000/5100/5200
`AAPL,ig-platform-id`|Data| `0600260A` | For Laptops with HD 4200/4400/4600. Requires device-id!
`AAPL,ig-platform-id`|Data| `0300220D` | For all Haswell NUCs with HD 4200/4400/4600. Requires device-id!
||||
`framebuffer-patch-enable`| Data | `01000000`
`framebuffer-fbmem`| Data | `00009000`
||||
`device-id` | Data |`12040000` | Required for HD 4200/4400/4600.

### Ivy Bridge
>For Intel HD 4000. 3rd Gen Intel Core Mobile.</br>
>Supported from OS X 10.8.x to macOS 11.x (officially), macOS 12 with Post-Install patches.

**Address**: `PciRoot(0x0)/Pci(0x2,0x0)`

Key | Type | Value| Notes
----|:----:|:----:|------
`AAPL,ig-platform-id`|Data| `03006601` | For Laptop display panels with 1366x768 px or lower (SD).
`AAPL,ig-platform-id`|Data| `04006601` | For Laptop display panels with 1600x900 px or higher (HD+ and Full HD).
`AAPL,ig-platform-id`|Data| `09006601` | For Laptops which use eDP to connect to the display (contrary to classical LVDS). Test with `03006601` and `04006601` first, before trying this!
`AAPL,ig-platform-id`|Data| `0B006601` | For NUCs

Additionally ,you need one of the following sets of Connector patches so external monitors work (including clamshell mode, etc.).

#### Connector Patches for `04006601`
Copy the entry below into the `DeviceProperties/Add/` section of your `config.plist` using ProperTree:

```swift
<key>PciRoot(0x0)/Pci(0x2,0x0)</key>
	<dict>
		<key>#framebuffer-stolenmem</key>
		<data>AAAABA==</data>
		<key>AAPL,ig-platform-id</key>
		<data>BABmAQ==</data>
		<key>framebuffer-con1-alldata</key>
		<data>AgUAAAAEAAAHBAAAAwQAAAAEAACBAAAABAYAAAAEAACBAAAA</data>
		<key>framebuffer-con1-enable</key>
		<integer>1</integer>
		<key>framebuffer-memorycount</key>
		<integer>2</integer>
		<key>framebuffer-patch-enable</key>
		<integer>1</integer>
		<key>framebuffer-pipecount</key>
		<integer>2</integer>
		<key>framebuffer-portcount</key>
		<integer>4</integer>
		<key>framebuffer-unifiedmem</key>
		<data>AAAAgA==</data>
		<key>model</key>
		<string>Intel HD Graphics 4000</string>
	</dict>
```
**NOTES**:

- `framebuffer-unifiedmem` increases VRAM to 2048 MB (instead of 1536 MB). To use the default value, disable it and re-enable `framebuffer-stolenmem` instead!
- You can enable/disable keys by removing/putting `#` in front of them.
- Don't use `framebuffer-unifiedmem` and `framebuffer-stolenmem` together at the same time – use either or!

#### Connector Patches for `03006601`
Copy the entry below into the `DeviceProperties/Add/` section of your `config.plist` using ProperTree:

```swift
<key>PciRoot(0x0)/Pci(0x2,0x0)</key>
	<dict>
		<key>#device-id</key>
		<data>ZgEAAA==</data>
		<key>AAPL,ig-platform-id</key>
		<data>AwBmAQ==</data>
		<key>AAPL,slot-name</key>
		<string>Internal</string>
		<key>framebuffer-con1-enable</key>
		<integer>1</integer>
		<key>framebuffer-con1-flags</key>
		<data>BgAAAA==</data>
		<key>framebuffer-con1-type</key>
		<data>AAgAAA==</data>
		<key>framebuffer-con2-enable</key>
		<integer>1</integer>
		<key>framebuffer-con2-flags</key>
		<data>BgAAAA==</data>
		<key>framebuffer-con2-type</key>
		<data>AAgAAA==</data>
		<key>framebuffer-con3-enable</key>
		<integer>1</integer>
		<key>framebuffer-con3-flags</key>
		<data>BgAAAA==</data>
		<key>framebuffer-con3-type</key>
		<data>AAgAAA==</data>
		<key>framebuffer-patch-enable</key>
		<integer>1</integer>
		<key>framebuffer-unifiedmem</key>
		<data>AAAAgA==</data>
		<key>#framebuffer-stolenmem</key>
		<data>AAAABA==</data>
		<key>model</key>
		<string>Intel HD Graphics 4000</string>
	</dict>
```
**NOTES**:

- `framebuffer-unifiedmem` increases VRAM to 2048 MB (instead of 1536 MB). To use the default value, disable it and re-enable `framebuffer-stolenmem` instead!
- You can enable/disable keys by removing/putting `#` in front of them.
- Don't use `framebuffer-unifiedmem` and `framebuffer-stolenmem` together at the same time – use either or!

### Sandy Bridge
>Intel HD 3000. 2nd Gen Intel Core Mobile.</br>
>Supported from macOS 10.6.7 to macOS 10.13

**Address**: `PciRoot(0x0)/Pci(0x2,0x0)`

Key | Type | Value| Notes
----|:----:|:----:|------
`AAPL,snb-platform-id`| Data | `00000100` | For Laptops
`AAPL,snb-platform-id`| Data | `10000300` | For NUCs

## About VGA

Whether or not your VGA port can be used depends on 2 factors: macOS and the CPU/iGPU.

- VGA support was dropped from macOS since OSX 10.8.2.
- On Ivy Bridge and others, you can try [these Connector Patches](https://github.com/acidanthera/WhateverGreen/blob/master/Manual/FAQ.IntelHD.en.md#vga-support) to enable it (if OSX is < 10.8.2).
- With the release of the Skylake CPU family, Intel dropped VGA support from their iGPUs completely, but manufacturers continued to use it for their devices. In order to do so, they used a DisplayPort connection and a small digital-to-analog RAMDAC to convert the signal from digital to analog so the VGA connection could be utilized.