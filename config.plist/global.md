# All Systems Configuration

We'll first configure some values which are the same across all systems. The values you select below may differ depending on which macOS version you want to boot. This section will go over the general structure of the plist as well. Any sections which are skipped can be left alone. If you want to know more about what these options do, refer to the [Configuration.pdf](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/Configuration.pdf)

## ACPI

### Add

::: tip Info

This is where you'll add SSDTs for your system, these are very important to **booting macOS** and have many uses like [USB maps](https://dortania.github.io/OpenCore-Post-Install/usb/), [disabling unsupported GPUs](../extras/spoof.md) and such. This should be populated already by ProperTree.

Note that you **should not** add your generated `DSDT.aml` here, it is already in your firmware. If you see your `DSDT.aml` here, remove it in your `config.plist` and under EFI/OC/ACPI.

Also note that compiled SSDTs have a .aml extension to them. Do not rename .dsl files into .aml files.

For those wanting a deeper dive into dumping your DSDT, how to make these SSDTs, and compiling them, please see the [**Getting started with ACPI**](https://dortania.github.io/Getting-Started-With-ACPI/) **page.**

:::

### Patch

This section allows us to dynamically modify parts of the ACPI (DSDT, SSDT, etc.) via OpenCore. Unless any SSDTs from the Getting Started With ACPI guide have patches you need to add, you can skip this part. If you have patches from SSDT-Time, you can copy them over into this section now.

## DeviceProperties

![DeviceProperties](../images/config/config-universal/DP-no-igpu.png)

### Add

By default, the Sample.plist has the path for both the Intel iGPU and built-in audio. `PciRoot(0x0)/Pci(0x2,0x0)` is for the Intel iGPU. If you are configuring a system without an (Intel) iGPU, you should remove this device. `PciRoot(0x0)/Pci(0x1b,0x0)` is for audio on Broadwell and earlier hardware. We will configure this in the post install guide, so this device should be removed for now as well.

## Kernel

### Add

Here's where we specify which kexts to load, in what specific order to load, and what architectures each kext is meant for. By default we recommend leaving what ProperTree has done, however for 32-bit CPUs, you may want to set `Arch` to `Any` or `i386` for each kext. 

::: warning Load Order
Some kexts depend on other kexts in order to be loaded. All dependencies must be loaded before the kext that requires them. For example, WhateverGreen and VirtualSMC both depend on Lilu, so Lilu **must** come before WhateverGreen and VirtualSMC.

A reminder that [ProperTree](https://github.com/corpnewt/ProperTree) users can run **Cmd/Ctrl + Shift + R** to add all their kexts in the correct order without manually typing each kext out.
:::

Below has more info about how each kext is defined:

::: details More in-depth Info

* **Arch**
  * Architectures supported by this kext
  * Currently supported values are `Any`, `i386` (32-bit), and `x86_64` (64-bit)
* **BundlePath**
  * Name of the kext
  * ex: `Lilu.kext`
* **Enabled**
  * Self-explanatory, either enables or disables the kext
* **ExecutablePath**
  * Path to the actual executable is hidden within the kext, you can see what path your kext has by right-clicking and selecting `Show Package Contents`. Generally, they'll be `Contents/MacOS/Kext` but some have kexts hidden within under `Plugin` folder. Do note that plist only kexts do not need this filled in.
  * ex: `Contents/MacOS/Lilu`
* **MinKernel**
  * Lowest kernel version your kext will be injected into, see below table for possible values
  * ex. `12.00.00` for OS X 10.8
* **MaxKernel**
  * Highest kernel version your kext will be injected into, see below table for possible values
  * ex. `11.99.99` for OS X 10.7
* **PlistPath**
  * Path to the `info.plist` hidden within the kext
  * ex: `Contents/Info.plist`
  
::: details Kernel Support Table

| OS X Version | MinKernel | MaxKernel |
| :--- | :--- | :--- |
| 10.4 | 8.0.0 | 8.99.99 |
| 10.5 | 9.0.0 | 9.99.99 |
| 10.6 | 10.0.0 | 10.99.99 |
| 10.7 | 11.0.0 | 11.99.99 |
| 10.8 | 12.0.0 | 12.99.99 |
| 10.9 | 13.0.0 | 13.99.99 |
| 10.10 | 14.0.0 | 14.99.99 |
| 10.11 | 15.0.0 | 15.99.99 |
| 10.12 | 16.0.0 | 16.99.99 |
| 10.13 | 17.0.0 | 17.99.99 |
| 10.14 | 18.0.0 | 18.99.99 |
| 10.15 | 19.0.0 | 19.99.99 |
| 11 | 20.0.0 | 20.99.99 |
| 12 | 21.0.0 | 21.99.99 |

:::

### Scheme

Settings for booting macOS versions `10.4-10.6`. If you are booting any later macOS version, you can skip this section.  

::: details Legacy Mac OS X

* **FuzzyMatch**: True
  * Used for ignoring checksums with kernelcache, instead opting for the latest cache available. Can help improve boot performance on many machines in 10.6
* **KernelArch**: x86_64
  * Set the kernel's arch type, you can choose between `Auto`, `i386` (32-bit), and `x86_64` (64-bit).
  * If you're booting older OSes which require a 32-bit kernel(ie. 10.4 and 10.5) we recommend to set this to `Auto` and let macOS decide based on your SMBIOS. See below table for supported values:
    * 10.4-10.5 — `x86_64`, `i386` or `i386-user32`
      * `i386-user32` refers 32-bit userspace, so 32-bit CPUs must use this(or CPUs missing SSSE3)
      * `x86_64` will still have a 32-bit kernelspace however will ensure 64-bit userspace in 10.4/5
    * 10.6 — `i386`, `i386-user32`, or `x86_64`
    * 10.7 — `i386` or `x86_64`
    * 10.8 or newer — `x86_64`

* **KernelCache**: Auto
  * Set kernel cache type, mainly useful for debugging and so we recommend `Auto` for best support

:::

## Misc

### APFS

::: tip Info
macOS High Sierra and newer use APFS instead of HFS Plus for their drive partitions. OpenCore loads the APFS driver
from macOS, though it will only load APFS drivers from Big Sur and newer due to the default minimum version set.

If you are booting macOS High Sierra - Catalina, you can instead any of the below values:

| macOS Version | Min Version | Min Date |
| :------------ | :---------- | :------- |
| High Sierra (`10.13.6`) | `748077008000000` | `20180621` |
| Mojave (`10.14.6`) | `945275007000000` | `20190820` |
| Catalina (`10.15.4`) | `1412101001000000` | `20200306` |
| No restriction | `-1` | `-1` |

If you are booting macOS Sierra or earlier, you can skip this section.

:::

::: details More in-depth Info

* **MinDate**: `-1`
  * Sets the minimum date required for APFS drivers to load. The default in OpenCore is 2021-01-01, which limits booting High Sierra - Catalina when you don't have an APFS driver that satisifes the requirements (aka having Big Sur installed).
  * If you'd like to boot High Sierra - Catalina, set this to `-1`, otherwise you don't need to change it

* **MinVersion**: `-1`
  * Sets the minimum version required for APFS drivers to load. The default in OpenCore is versions from Big Sur and above, which limits booting High Sierra - Catalina when you don't have an APFS driver that satisifes the requirements (aka having Big Sur installed).
  * If you'd like to boot High Sierra - Catalina, set this to `-1`, otherwise you don't need to change it

:::

### Debug

::: tip Info

Helpful for debugging OpenCore boot issues (We'll be changing everything *but* `DisplayDelay`):

| Quirk | Enabled |
| :--- | :--- |
| AppleDebug | YES |
| ApplePanic | YES |
| DisableWatchDog | YES |
| Target | 67 |

:::

::: details More in-depth Info

* **AppleDebug**: YES
  * Enables boot.efi logging, useful for debugging. Note this is only supported on 10.15.4 and newer
* **ApplePanic**: YES
  * Attempts to log kernel panics to disk
* **DisableWatchDog**: YES
  * Disables the UEFI watchdog, can help with early boot issues
* **DisplayLevel**: `2147483650`
  * Shows even more debug information, requires debug version of OpenCore
* **SerialInit**: NO
  * Needed for setting up serial output with OpenCore
* **SysReport**: NO
  * Helpful for debugging such as dumping ACPI tables
  * Note that this is limited to DEBUG versions of OpenCore
* **Target**: `67`
  * Shows more debug information, requires debug version of OpenCore

These values are based of those calculated in [OpenCore debugging](../troubleshooting/debug.md)

:::

### Entries

Used for specifying irregular boot paths that can't be found naturally with OpenCore.

Won't be covered here, see 8.6 of [Configuration.pdf](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/Configuration.pdf) for more info

### Security

::: tip Info

Security is pretty self-explanatory, **do not skip**. We'll be changing the following:

| Quirk | Enabled | Comment |
| :--- | :--- | :--- |
| AllowNvramReset | YES | |
| AllowSetDefault | YES | |
| BlacklistAppleUpdate | YES | |
| ScanPolicy | 0 | |
| Vault | Optional | This is a word, it is not optional to omit this setting. You will regret it if you don't set it to Optional, note that it is case-sensitive |

:::

::: details More in-depth Info

* **AllowNvramReset**: YES
  * Allows for NVRAM reset both in the boot picker and when pressing `Cmd+Opt+P+R`
* **AllowSetDefault**: YES
  * Allow `CTRL+Enter` and `CTRL+Index` to set default boot device in the picker
* **ApECID**: 0
  * Used for netting personalized secure-boot identifiers, currently this quirk is unreliable due to a bug in the macOS installer so we highly encourage you to leave this as default.
* **AuthRestart**: NO
  * Enables Authenticated restart for FileVault 2 so password is not required on reboot. Can be considered a security risk so optional
* **BlacklistAppleUpdate**: YES
  * Used for blocking firmware updates, used as extra level of protection as macOS Big Sur no longer uses `run-efi-updater` variable

* **DmgLoading**: Signed
  * Ensures only signed DMGs load
* **ExposeSensitiveData**: `6`
  * Shows more debug information, requires debug version of OpenCore
* **Vault**: `Optional`
  * We won't be dealing vaulting so we can ignore, **you won't boot with this set to Secure**
  * This is a word, it is not optional to omit this setting. You will regret it if you don't set it to `Optional`, note that it is case-sensitive
* **ScanPolicy**: `0`
  * `0` allows you to see all drives available, please refer to [Security](https://dortania.github.io/OpenCore-Post-Install/universal/security.html) section for further details. **Will not boot USB devices with this set to default**
* **SecureBootModel**: Default (See later in this guide)
  * Controls Apple's secure boot functionality in macOS, please refer to [Security](https://dortania.github.io/OpenCore-Post-Install/universal/security.html) section for further details.
  * Note: Users may find upgrading OpenCore on an already installed system can result in early boot failures. To resolve this, see here: [Stuck on OCB: LoadImage failed - Security Violation](/troubleshooting/extended/kernel-issues.md#stuck-on-ocb-loadimage-failed-security-violation)

:::

## NVRAM

NVRAM is flash storage on your motherboard, which is used to store boot order and what devices there are too boot.
macOS makes extensive use of NVRAM to store boot-args, display scaling in FileVault, background color, etc.

::: details More info - Non-Native NVRAM

* **LegacyEnable**: NO
  * Allows for NVRAM to be stored on nvram.plist, needed for systems without native NVRAM

* **LegacyOverwrite**: NO
  * Permits overwriting firmware variables from nvram.plist, only needed for systems without native NVRAM

* **LegacySchema**
  * Used for assigning NVRAM variables, used with LegacyEnable set to YES

* **WriteFlash**: YES
  * Enables writing to flash memory for all added variables.

:::

### Add
::: tip 4D1EDE05-38C7-4A6A-9CC6-4BCCA8B38C14

Used for OpenCore's UI scaling, default will work for us. See in-depth section for more info

:::

::: details More in-depth Info

Booter Path, mainly used for UI Scaling

* **UIScale**:
  * `01`: Standard resolution
  * `02`: HiDPI (generally required for FileVault to function correctly on smaller displays)

* **DefaultBackgroundColor**: Background color used by boot.efi
  * `00000000`: Syrah Black
  * `BFBFBF00`: Light Gray

:::

::: tip 4D1FDA02-38C7-4A6A-9CC6-4BCCA8B30102

OpenCore's NVRAM GUID, mainly relevant for RTCMemoryFixup users

:::

::: details More in-depth Info

* **rtc-blacklist**: <>
  * To be used in conjunction with RTCMemoryFixup, see here for more info: [Fixing RTC write issues](https://dortania.github.io/OpenCore-Post-Install/misc/rtc.html#finding-our-bad-rtc-region)
  * Most users can ignore this section

:::

::: tip 7C436110-AB2A-4BBB-A880-FE41995C9F82

Apple's NVRAM GUID

* **General Purpose boot-args**:

Boot-args are seperated by spaces, they should looking something like `-v debug=0x100 keepsyms=1`.

| boot-args | Description |
| :-------- | :---------- |
| **-v** | This enables verbose mode, which shows all the behind-the-scenes text that scrolls by as you're booting instead of the Apple logo and progress bar. It's invaluable to any Hackintosher, as it gives you an inside look at the boot process, and can help you identify issues, problem kexts, etc. |
| **debug=0x100** | This disables macOS's watchdog which helps prevents a reboot on a kernel panic. That way you can *hopefully* glean some useful info and follow the breadcrumbs to get past the issues. |
| **keepsyms=1** | This is a companion setting to debug=0x100 that tells the OS to also print the symbols on a kernel panic. That can give some more helpful insight as to what's causing the panic itself. |
| **alcid=1** | Used for setting layout-id for AppleALC, see [supported codecs](https://github.com/acidanthera/applealc/wiki/supported-codecs) to figure out which layout to use for your specific system. More info on this is covered in the [Post-Install Page](https://dortania.github.io/OpenCore-Post-Install/) |

* **GPU-Specific boot-args**:

| boot-args | Description |
| :-------- | :---------- |
| **agdpmod=pikera** | Used for disabling board ID checks on Navi GPUs(RX 5000 series), without this you'll get a black screen. **Don't use if you don't have Navi**(ie. Polaris and Vega cards shouldn't use this) |
| **nvda_drv_vrl=1** | Used for enabling Nvidia's Web Drivers on Maxwell and Pascal cards in Sierra and High Sierra |

* **AMD/HEDT-Specific boot-args**:

| boot-args | Description |
| :-------- | :---------- |
| **npci=0x2000** | This disables some PCI debugging related to `kIOPCIConfiguratorPFM64`, alternative is `npci= 0x3000` which disables debugging related to `gIOPCITunnelledKey` in addition. Required for when getting stuck on `PCI Start Configuration` as there are IRQ conflicts relating to your PCI lanes. **Not needed if Above4GDecoding is enabled**. [Source](https://opensource.apple.com/source/IOPCIFamily/IOPCIFamily-370.0.2/IOPCIBridge.cpp.auto.html) |

* **csr-active-config**: `00000000`
  * Settings for 'System Integrity Protection' (SIP). It is generally recommended to change this with `csrutil` via the recovery partition.
  * csr-active-config by default is set to `00000000` which enables System Integrity Protection. You can choose a number of different values but overall we recommend keeping this enabled for best security practices. More info can be found in our troubleshooting page: [Disabling SIP](../troubleshooting/extended/post-issues.md#disabling-sip)

* **run-efi-updater**: `No`
  * This is used to prevent Apple's firmware update packages from installing and breaking boot order; this is important as these firmware updates (meant for Macs) will not work.

* **prev-lang:kbd**: <>
  * The default in the Config.plist is Russian.
  * Generally we recommend leaving this blank, though you can set your own language using the format:
    * `lang-COUNTRY:keyboard`
    * Ex: `en-US:0` (`656e2d55533a30` in HEX)
  * Full list can be found in [AppleKeyboardLayouts.txt](https://github.com/acidanthera/OpenCorePkg/blob/master/Utilities/AppleKeyboardLayouts/AppleKeyboardLayouts.txt)
  * Hint: `prev-lang:kbd` can be changed into a String so you can input `en-US:0` directly instead of converting to HEX

| Key | Type | Value |
| :--- | :--- | :--- |
| prev-lang:kbd | String | en-US:0 |

:::

### Delete

Lets OpenCore know which NVRAM values to delete.
Note that OpenCore will not overwrite any NVRAM variables already written, so for NVRAM variables to be overwritten,
they need to be under Delete so they're removed.

## UEFI

![UEFI](../images/config/config-universal/aptio-v-uefi.png)

### Drivers

This should be populated by ProperTree already. You should have the below drivers:
* A HFS Driver (`HFSPlus.efi`, `OpenHFSPlus.efi`, or `LegacyHFSPlus.efi`)
* OpenRuntime.efi
* OpenUsbKbDxe.efi (If your computer does not support UEFI)


### Audio

Related to AudioDxe settings, for us we'll be ignoring(leave as default). This is unrelated to audio support in macOS.

* For further use of AudioDxe and the Audio section, please see the Post Install page: [Add GUI and Boot-chime](https://dortania.github.io/OpenCore-Post-Install/)

### Input

Related to boot.efi keyboard passthrough used for FileVault and Hotkey support. See here for more details: [Security and FileVault](https://dortania.github.io/OpenCore-Post-Install/)

::: details Legacy Bios

| Quirk | Value | Comment |
| :--- | :--- | :--- |
| KeySupport | NO | Only disable if your computer does not support UEFI |

:::

### Output

Relating to OpenCore's visual output,  leave everything here as default as we have no use for these quirks.

### ProtocolOverrides

Mainly relevant for Virtual machines, legacy macs and FileVault users. See here for more details: [Security and FileVault](https://dortania.github.io/OpenCore-Post-Install/)


## Selecting your platform

To further configure the Config.plist, you will want to follow the link below which best fits your device.

### Intel Desktop

* Note: Intel's NUC series are considered mobile hardware, for these situations we recommend following the [Intel Laptop Section](#intel-laptop)

| Code Name | Series | Release |
| :--- | :--- | :--- |
| [Yonah, Conroe and Penryn](../config.plist/penryn.md) | E8XXX, Q9XXX, [etc 1](https://en.wikipedia.org/wiki/Yonah_(microprocessor)), [etc 2](https://en.wikipedia.org/wiki/Penryn_(microarchitecture)) | 2006-2009 era |
| [Lynnfield and Clarkdale](../config.plist/clarkdale.md) | 5XX-8XX | 2010 era |
| [Sandy Bridge](../config.plist/sandy-bridge.md) | 2XXX | 2011 era |
| [Ivy Bridge](../config.plist/ivy-bridge.md) | 3XXX | 2012 era |
| [Haswell](../config.plist/haswell.md) | 4XXX | 2013-2014 era |
| [Skylake](../config.plist/skylake.md) | 6XXX | 2015-2016 era |
| [Kaby Lake](../config.plist/kaby-lake.md) | 7XXX | 2017 era |
| [Coffee Lake](../config.plist/coffee-lake.md) | 8XXX-9XXX | 2017-2019 era |
| [Comet Lake](../config.plist/comet-lake.md) | 10XXX | 2020 era |

### Intel Laptop

| Code Name | Series | Release |
| :--- | :--- | :--- |
| [Clarksfield and Arrandale](../config-laptop.plist/arrandale.md) | 3XX-9XX | 2010 era |
| [Sandy Bridge](../config-laptop.plist/sandy-bridge.md) | 2XXX | 2011 era |
| [Ivy Bridge](../config-laptop.plist/ivy-bridge.md) | 3XXX | 2012 era |
| [Haswell](../config-laptop.plist/haswell.md) | 4XXX | 2013-2014 era |
| [Broadwell](../config-laptop.plist/broadwell.md) | 5XXX | 2014-2015 era |
| [Skylake](../config-laptop.plist/skylake.md) | 6XXX | 2015-2016 era |
| [Kaby Lake and Amber Lake](../config-laptop.plist/kaby-lake.md) | 7XXX | 2017 era |
| [Coffee Lake and Whiskey Lake](../config-laptop.plist/coffee-lake.md) | 8XXX | 2017-2018 era |
| [Coffee Lake Plus and Comet Lake](../config-laptop.plist/coffee-lake-plus.md) | 9XXX-10XXX | 2019-2020 era |
| [Ice Lake](../config-laptop.plist/icelake.md) | 10XXX | 2019-2020 era |

### Intel HEDT

This section includes both enthusiast and server based hardware.

| Code Name | Series | Release |
| :--- | :--- | :--- |
| [Nehalem and Westmere](../config-HEDT/nehalem.md) | 9XX, X3XXX, X5XXX, [etc 1](https://en.wikipedia.org/wiki/Nehalem_(microarchitecture)), [2](https://en.wikipedia.org/wiki/Westmere_(microarchitecture)) | 2008-2010 era |
| [Sandy/Ivy Bridge-E](../config-HEDT/ivy-bridge-e.md) | 3XXX, 4XXX | 2011-2013 era |
| [Haswell-E](../config-HEDT/haswell-e.md) | 5XXX | 2014 era |
| [Broadwell-E](../config-HEDT/broadwell-e.md) | 6XXX | 2016 era |
| [Skylake/Cascade Lake-X/W](../config-HEDT/skylake-x.md) | 7XXX, 9XXX, 10XXX | 2017-2019 era |

### AMD

| Code Name | Series | Release |
| :--- | :--- | :--- |
| [Bulldozer/Jaguar](../AMD/fx.md) | [It's weird](https://en.wikipedia.org/wiki/List_of_AMD_processors#Bulldozer_architecture;_Bulldozer,_Piledriver,_Steamroller,_Excavator_(2011%E2%80%932017)) | [AMD was really bad with naming back then](https://en.wikipedia.org/wiki/List_of_AMD_processors#Bulldozer_architecture;_Bulldozer,_Piledriver,_Steamroller,_Excavator_(2011%E2%80%932017)) |
| [Zen](../AMD/zen.md) | 1XXX, 2XXX, 3XXX, 5XXX | 2017-2020 era |

* Note: ~~Threadripper 3rd gen(39XX) are not supported, 1st and 2nd gen however are supported~~
  * Latest BIOS and OpenCore version has resolved this issue, all Threadripper platforms are now supported