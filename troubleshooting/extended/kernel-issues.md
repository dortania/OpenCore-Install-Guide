# 内核空间问题

从最初启动macOS安装程序到弹出安装GUI之前的问题。

[[toc]]

## 卡在 `[EB|#LOG:EXITBS:START]`

本节将分为3部分，请仔细阅读。

* [启动器问题](#启动器问题)
* [内核补丁问题](#kernel-patch-issues)
* [UEFI 问题](#uefi-issues)
* [虚拟机问题](#virtual-machine-issues)

### 启动器问题

在Booter部分需要注意的主要问题有:

* **DevirtualiseMmio**
  * 某些MMIO空间仍然需要正常工作，所以你需要在 Booter -> MmioWhitelist 中排除这些区域或完全禁用此选项。 更多信息在这里: [Using DevirtualiseMmio](../../extras/kaslr-fix.md#using-devirtualisemmio)
  * 对于TRx40用户，启用此功能
  * 对于X99的用户，禁用这种功能，因为它会被某些固件破坏

* **SetupVirtualMap**
  * 大多数固件都需要这个功能，如果没有这个功能，内核崩溃就很常见，所以如果还没有启用它的话就启用它
    * 主要是Z390和更老的版本需要启用这个功能
    * 但是，某些固件(主要是2020年以上)不能使用这种特性，因此实际上可能会导致这种内核崩溃:
      * 英特尔(Intel)的Ice Lake系列
      * 英特尔Comet Lake系列(B460, H470, Z490等)
      * 英特尔Comet Lake系列(B460, H470, Z490等)
        * 许多B450和X470板2020年底BIOS更新也包括在内
      * AMD的TRx40
      * QEMU等虚拟机
      * X299 2020+ BIOS更新(这适用于2019年底或2020+发布的最新BIOS上的其他X299板)

* **EnableWriteUnprotector**

  * 另一个问题可能是macOS与CR0寄存器的写保护冲突，为了解决这个问题，我们有两个选择:
    * 如果您的固件支持MATs(2018+固件):
      * EnableWriteUnprotector -> False
      * RebuildAppleMemoryMap -> True
      * SyncRuntimePermissions -> True
    * 对于旧的固件:
      * EnableWriteUnprotector -> True
      * RebuildAppleMemoryMap -> False
      * SyncRuntimePermissions -> False
    * 注意:一些笔记本电脑(例如：Dell Inspiron 5370)即使有MATs支持也会在启动时停止，在这种情况下你有两个选择:
      * 启动与旧固件功能组合(即：使用EnableWriteUnprotector 并禁用 `RebuildAppleMemoryMap` + `SyncRuntimePermissions`)
      * 启用 `DevirtualiseMmio` 并遵循[MmioWhitelist指南](https://sumingyd.github.io/OpenCore-Install-Guide/extras/kaslr-fix.html)

关于对MATs的支持，针对EDK 2018构建的固件将支持这一点，许多oem甚至已经增加了对Skylake笔记本电脑的支持。问题是它不是总是明显的，如果一个OEM已经更新固件，你可以检查OpenCore日志是否支持它([查看这里如何获取日志](../debug.html)):

```
OCABC: MAT support is 1
```

* 注意:`1`表示支持MATs，而`0`表示不支持。

### 内核补丁问题

本节将分为英特尔和AMD用户两部分:

#### AMD 用户

* 缺少[内核补丁](https://github.com/AMD-OSX/AMD_Vanilla)(only适用于AMD cpu，确保它们是OpenCore补丁而不是Clover。Clover使用“MatchOS”，而OpenCore有 `MinKernel` 和 `Maxkernel`)
  * 请注意，过时的内核补丁也会有同样的效果，请确保您使用的是AMD OS X的最新补丁

#### Intel 用户

* **AppleXcpmCfgLock** 和 **AppleCpuPmCfgLock**
  * 缺少CFG或XCPM补丁，请启用 `AppleXcpmCfgLock` 和 `AppleCpuPmCfgLock`
    * Haswell和更新版本只需要AppleXcpmCfgLock
    * Ivy Bridge和更老的只需要AppleCpuPmCfgLock
      * 如果运行10.10或更高版本，Broadwell及更老版本需要AppleCpuPmCfgLock
  * 或者你可以正确地禁用CFG-Lock:[修复CFG锁](https://sumingyd.github.io/OpenCore-Post-Install/misc/msr-lock.html)
* **AppleXcpmExtraMsrs**
  * 也可能需要，这通常指的是Pentiums, HEDT和其他macOS原生不支持的特定系统。

#### Intel 老用户

对于macOS Big Sur，许多固件在确定CPU核心数时都存在问题，因此会过早出现内核崩溃，无法进行啰嗦模式的错误显示。通过serial命令，你会看到如下提示:

```
max_cpus_from_firmware not yet initialized
```

解决:

* 在Booter -> Quirks下启用 `AvoidRuntimeDefrag`
  * 这应该适用于大多数固件

然而，在某些机器上，如HP Compaq DC 7900，固件仍然会出现问题，因此我们需要强制设置CPU核心数。只有在AvoidRuntimeDefrag不起作用时，才使用下面的补丁:

::: details 旧CPU核心补丁

为此，添加以下补丁(用硬件支持的CPU线程数量替换B8 **04** 00 00 C3中的04):

| Key | Type | Value |
| :--- | :--- | :--- |
| Base | String | _acpi_count_enabled_logical_processors |
| Count | Integer | 1 |
| Enabled | Boolean | True |
| Find | Data | |
| Identifier | String | Kernel |
| Limit | Integer | 0 |
| Mask | Data | |
| MaxKernel | String | |
| MinKernel | String | 20.0.0 |
| Replace | Data | `B804000000C3` |
| ReplaceMask | Data | |
| Skip | Integer | 0 |

:::

### UEFI 问题

* **ProvideConsoleGop**
  * 需要过渡到下一个屏幕，这最初是AptioMemoryFix的一部分，但现在在OpenCore中以这个功能提供。可以在UEFI -> Output下找到
  * 注意，从0.5.6开始，sample.plist默认启用了这个功能
* **IgnoreInvalidFlexRatio**
  * 这是Broadwell和更老的所需要的。**AMD和Skylake或更新版本不支持**

## 卡在 EndRandomSeed

与上面相同的问题，请参阅此处了解更多详细信息: [卡在 `[EB|#LOG:EXITBS:START]`](#stuck-on-eb-log-exitbs-start)

## 在OpenCore中选择macOS分区后卡住

与上面相同的问题，请参阅此处了解更多详细信息: [卡在 `[EB|#LOG:EXITBS:START]`](#stuck-on-eb-log-exitbs-start)

* 注意:启用[DEBUG OpenCore](../debug.html) 也可以帮助揭示一些信息

## Getting the error X64 Exception Type... 有关AMD FX系统

此错误可能有多种原因:

* 此错误可能有多种原因:

  也可以称为遗留引导支持，加载遗留选项rom /OPROMs

* ProvideCurrentCpuInfo功能(统一补丁所需)与您的固件不兼容:

  这意味着您需要使用[旧版本的补丁](https://github.com/AMD-OSX/AMD_Vanilla/blob/06a9a7f30d139fa3ae897ed2469222c92e99fcad/15h_16h/patches.plist) 和Big Sur或更早的版本。下载上面链接的旧补丁后，将它们合并到config.plist 中(确保先删除旧补丁)。

一个例子:

![](../../images/troubleshooting/troubleshooting-md/x64exception-amdfx.png)

## 内核崩溃 `Invalid frame pointer`

这是由于您设置的`Booter -> Quirks`的一些问题，主要检查:

* `DevirtualiseMmio`
  * 某些MMIO空间仍然需要正确运行，因此您需要在Booter -> MmioWhitelist中排除这些区域或完全禁用此功能
  * 更多信息:[使用 DevirtualiseMmio](../../extras/kaslr-fix.md#using-devirtualisemmio)

* `SetupVirtualMap`
  * 大多数固件都需要这个功能，如果没有这个功能，内核崩溃就很常见，所以如果还没有启用它的话就启用它
    * 但是，某些固件无法处理这种情况，因此实际上可能会导致这种内核错误:
      * 英特尔(Intel)的Ice Lake系列
      * 英特尔的Comet Lake系列
      * AMD 的 B550
      * AMD 的 A520
      * AMD 的 TRx40
      * QEMU等虚拟机
  
另一个问题可能是macOS与CR0寄存器的写保护冲突，要解决这个问题，我们有两个选项:

* 如果您的固件支持MATs(2018+固件):
  * EnableWriteUnprotector -> False
  * RebuildAppleMemoryMap -> True
  * SyncRuntimePermissions -> True
* 对于旧的固件:
  * EnableWriteUnprotector -> True
  * RebuildAppleMemoryMap -> False
  * SyncRuntimePermissions -> False

关于对MATs的支持，针对EDK 2018构建的固件将支持这一点，许多oem甚至已经增加了对Skylake笔记本电脑的支持。问题是它不是总是明显的，如果一个OEM已经更新了固件，你可以检查OpenCore日志是否你的支持:

```
OCABC: MAT support is 1
```

注意:“1”表示支持MATs，而“0”表示不支持。

## Stuck on `[EB|LD:OFS] Err(0xE)` when booting preboot volume

Full error:

```
[EB|`LD:OFS] Err(0xE) @ OPEN (System\\Library\\PrelinkedKernels\\prelinkedkernel)
```

This can happen when the preboot volume isn't properly updated, to fix this you'll need to boot into recovery and repair it:

1. Enable JumpstartHotplug under UEFI -> APFS(Recovery may not boot on macOS Big Sur without this option)
2. Boot into recovery
3. Open the terminal, and run the following:

```bash
# First, find your Preboot volume
diskutil list

# From the below list, we can see our Preboot volume is disk5s2
/dev/disk5 (synthesized):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      APFS Container Scheme -                      +255.7 GB   disk5
                                 Physical Store disk4s2
   1:                APFS Volume ⁨Big Sur HD - Data⁩       122.5 GB   disk5s1
   2:                APFS Volume ⁨Preboot⁩                 309.4 MB   disk5s2
   3:                APFS Volume ⁨Recovery⁩                887.8 MB   disk5s3
   4:                APFS Volume ⁨VM⁩                      1.1 MB     disk5s4
   5:                APFS Volume ⁨Big Sur HD⁩              16.2 GB    disk5s5
   6:              APFS Snapshot ⁨com.apple.os.update-...⁩ 16.2 GB    disk5s5s

# Now mount the Preboot volume
diskutil mount disk5s2

# Next run updatePreboot on the Preboot volume
diskutil apfs updatePreboot /volume/disk5s2
```

Then finally reboot

## Stuck on `OCB: LoadImage failed - Security Violation`

```
OCSB: No suitable signature - Security Violation
OCB: Apple Secure Boot prohibits this boot entry, enforcing!
OCB: LoadImage failed - Security Violation
```

This is due to missing outdated Apple Secure Boot manifests present on your preboot volume resulting is a failure to load if you have SecureBootModel set, reason for these files being missing is actually a bug in macOS.

To resolve this you can do one of the following:

* Disable SecureBootModel
  * ie. set `Misc -> Security -> SecureBootModel -> Disabled`
* Reinstall macOS with the latest version
* Or copy over the Secure Boot manifests from `/usr/standalone/i386` to `/Volumes/Preboot/<UUID>/System/Library/CoreServices`
  * Note you will most likely need to do this via terminal as the Preboot volume isn't easily editable via the Finder
  
To do this via terminal:

```bash
# First, find your Preboot volume
diskutil list

# From the below list, we can see our Preboot volume is disk5s2
/dev/disk5 (synthesized):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      APFS Container Scheme -                      +255.7 GB   disk5
                                 Physical Store disk4s2
   1:                APFS Volume ⁨Big Sur HD - Data⁩       122.5 GB   disk5s1
   2:                APFS Volume ⁨Preboot⁩                 309.4 MB   disk5s2
   3:                APFS Volume ⁨Recovery⁩                887.8 MB   disk5s3
   4:                APFS Volume ⁨VM⁩                      1.1 MB     disk5s4
   5:                APFS Volume ⁨Big Sur HD⁩              16.2 GB    disk5s5
   6:              APFS Snapshot ⁨com.apple.os.update-...⁩ 16.2 GB    disk5s5s

# Now mount the Preboot volume
diskutil mount disk5s2

# CD into your Preboot volume
# Note the actual volume is under /System/Volumes/Preboot
cd /System/Volumes/Preboot

# Grab your UUID
ls
 46923F6E-968E-46E9-AC6D-9E6141DF52FD
 CD844C38-1A25-48D5-9388-5D62AA46CFB8

# If multiple show up(ie. you dual boot multiple versions of macOS), you will
# need to determine which UUID is correct.
# Easiest way to determine is printing the value of .disk_label.contentDetails
# of each volume.
cat ./46923F6E-968E-46E9-AC6D-9E6141DF52FD/System/Library/CoreServices/.disk_label.contentDetails
 Big Sur HD%

cat ./CD844C38-1A25-48D5-9388-5D62AA46CFB8/System/Library/CoreServices/.disk_label.contentDetails
 Catalina HD%

# Next lets copy over the secure boot files
# Replace CD844C38-1A25-48D5-9388-5D62AA46CFB8 with your UUID value
cd ~
sudo cp -a /usr/standalone/i386/. /System/Volumes/Preboot/CD844C38-1A25-48D5-9388-5D62AA46CFB8/System/Library/CoreServices
```

## Stuck on `OCABC: Memory pool allocation failure - Not Found`

This is due to incorrect BIOS settings:

* Above4GDecoding is Enabled
* CSM is Disabled(Enabling Windows8.1/10 WHQL Mode can do the same on some boards)
  * Note on some laptops, CSM must be enabled
* BIOS is up-to-date(Z390 and HEDT are known for having poorly written firmwares)

## Stuck on `Buffer Too Small`

* Enable Above4GDecoding in the BIOS

## Stuck on `Plist only kext has CFBundleExecutable key`

Missing or incorrect `Executable path` in your config.plist, this should be resolved by re-running ProperTree's snapshot tool(Cmd/Ctrl+R).

## Stuck on `This version of Mac OS X is not supported: Reason Mac...`

This error happens when SMBIOS is one no longer supported by that version of macOS, make sure values are set in `PlatformInfo->Generic` with `Automatic` enabled. For a full list of supported SMBIOS and their OSes, see here: [Choosing the right SMBIOS](../../extras/smbios-support.md)

::: details Supported SMBIOS in macOS 10.15, Catalina

* iMac13,x+
* iMacPro1,1
* MacPro6,1+
* Macmini6,x+
* MacBook8,1+
* MacBookAir5,x+
* MacBookPro9,x+

:::

::: details Supported SMBIOS in macOS 11, Big Sur

* iMac14,4+
* iMacPro1,1
* MacPro6,1+
* Macmini7,1+
* MacBook8,1+
* MacBookAir6,x+
* MacBookPro11,x+

:::

::: details Supported SMBIOS in macOS 12, Monterey

* iMac16,1+
* iMacPro1,1
* MacPro6,1+
* Macmini7,1+
* MacBook9,1+
* MacBookAir7,1+
* MacBookPro11,3+

:::

::: details Supported SMBIOS in macOS 13, Ventura

* iMac18,x+
* iMacPro1,1
* MacPro7,1
* Macmini8,1
* MacBook10,1
* MacBookAir8,1+
* MacBookPro14,x+

:::

## `Couldn't allocate runtime area` errors

See [Fixing KASLR slide values](../../extras/kaslr-fix.md)

## Stuck on `RTC...`, `PCI Configuration Begins`, `Previous Shutdown...`, `HPET`, `HID: Legacy...`

Well this general area is where a lot of PCI devices are first setup and configured, and is where most booting issues will happen. Other names include:

* `apfs_module_start...`,
* `Waiting for Root device`,
* `Waiting on...IOResources...`,
* `previous shutdown cause...`

The main places to check:

* **Missing EC patch**:
  * Make sure you have your EC SSDT both in EFI/OC/ACPI and ACPI -> Add, **double check it's enabled.**
  * If you don't have one, grab it here: [Getting started with ACPI](https://dortania.github.io/Getting-Started-With-ACPI/)
* **IRQ conflict**:
  * Most common on older laptops and pre-builts, run SSDTTime's FixHPET option and add the resulting SSDT-HPET.aml and ACPI patches to your config( the SSDT will not work without the ACPI patches)
* **PCI allocation issue**:
  * **UPDATE YOUR BIOS**, make sure it's on the latest. Most OEMs have very broken PCI allocation on older firmwares, especially AMD
  * Make sure either Above4G is enabled in the BIOS, if no option available then add `npci=0x2000` or `npci=0x3000` (try both one at a time) to boot args.
    * Some X99 and X299 boards(ie. GA-X299-UD4) may require both npci boot-arg and Above4G enabled
    * AMD CPU Note: **Do not have both the Above4G setting enabled and npci in boot args, they will conflict**
    * 2020+ BIOS Notes: When enabling Above4G, Resizable BAR Support may become an available. Please ensure that Booter -> Quirks -> ResizeAppleGpuBars is set to `0` if this is enabled.
  * Other BIOS settings that are important: CSM disabled, Windows 8.1/10 UEFI Mode enabled
* **NVMe or SATA issue**:
  * Sometimes if either a bad SATA controller or an unsupported NVMe drive are used, you can commonly get stuck here. Things you can check:
    * Not using either a Samsung PM981 or Micron 2200S NVMe SSD
    * Samsung 970 EVO Plus running the latest firmware(older firmwares were known for instability and stalls, [see here for more info](https://www.samsung.com/semiconductor/minisite/ssd/download/tools/))
    * SATA Hot-Plug is disabled in the BIOS(more commonly to cause issues on AMD CPU based systems)
    * Ensure NVMe drives are set as NVMe mode in BIOS(some BIOS have a bug where you can set NVMe drives as SATA)
* **NVRAM Failing**:
  * Common issue HEDT and 300 series motherboards, you have a couple paths to go down:
    * 300 Series Consumer Intel: See [Getting started with ACPI](https://dortania.github.io/Getting-Started-With-ACPI/) on making SSDT-PMC.aml
    * HEDT(ie. X99): See [Emulating NVRAM](https://dortania.github.io/OpenCore-Post-Install/misc/nvram.html) on how to stop NVRAM write, note that for install you do not need to run the script. Just setup the config.plist

* **RTC Missing**:
  * Commonly found on Intel's 300+ series(ie. Z370, Z490), caused by the RTC clock being disabled by default. See [Getting started with ACPI](https://dortania.github.io/Getting-Started-With-ACPI/) on creating an SSDT-AWAC.aml
  * X99 and X299 have broken RTC devices, so will need to be fixed with SSDT-RTC0-RANGE. See [Getting started with ACPI](https://dortania.github.io/Getting-Started-With-ACPI/) on creating said file
  * Some drunk firmware writer at HP also disabled the RTC on the HP 250 G6 with no way to actually re-enable it
    * Known affected models: `HP 15-DA0014dx`, `HP 250 G6`
    * For users cursed with such hardware you'll need to create a fake RTC clock for macOS to play with. See getting started with ACPI for more details, as well as below image example:

Example of what a disabled RTC with no way to enable looks like(note that there is no value to re-enable it like `STAS`):

![](../../images/troubleshooting/troubleshooting-md/rtc.png)

## Stuck at ACPI table loading on B550

![](../../images/troubleshooting/troubleshooting-md/OC_catalina.jpg)

If you're getting stuck at or near ACPI table loading with an AMD B550 or A520 motherboard, add the following SSDT:

* [SSDT-CPUR.aml](https://github.com/dortania/Getting-Started-With-ACPI/blob/master/extra-files/compiled/SSDT-CPUR.aml)

And please remember to add this SSDT to both EFI/OC/ACPI **and** your config.plist under ACPI -> Add(ProperTree's snapshot function can do this for you)

## "Waiting for Root Device" or Prohibited Sign error

* Other names: Stop Sign, Scrambled

This is generally seen as a USB or SATA error, couple ways to fix:

### USB Issues

This assumes you're only booting the installer USB and not macOS itself.

* If you're hitting the 15 port limit, you need to make an [USB Map](https://dortania.github.io/OpenCore-Post-Install/usb/)

* Another issue can be that certain firmware won't pass USB ownership to macOS
  * `UEFI -> Quirks -> ReleaseUsbOwnership -> True`
  * Enabling EHCI/XHCI Handoff in the BIOS can fix this as well

* Sometimes, if the USB is plugged into a 3.x port, plugging it into a 2.0 port can fix this error and vice versa.

* For AMD's 15h and 16h CPUs, you may need to add the following:
  * [XLNCUSBFix.kext](https://cdn.discordapp.com/attachments/566705665616117760/566728101292408877/XLNCUSBFix.kext.zip)

* If XLNCUSBFix still doesn't work, then try the following alongside XLNCUSBFix:
  * [AMD StopSign-fixv5](https://cdn.discordapp.com/attachments/249992304503291905/355235241645965312/StopSign-fixv5.zip)

* X299 Users: Enable Above4G Decoding
  * Odd firmware bug on X299 where USB breaks otherwise

* Missing USB ports in ACPI:
  * For Intel's Coffee Lake and older, we recommend using [USBInjectAll](https://bitbucket.org/RehabMan/os-x-usb-inject-all/downloads/)
  * For Intel's Ice Lake and Comet Lake, we recommend [SSDT-RHUB](https://github.com/dortania/Getting-Started-With-ACPI/blob/master/extra-files/compiled/SSDT-RHUB.aml)
    * SSDTTime's `7. USB Reset` option can do the same
  * For AMD, run SSDTTime's `7. USB Reset` option and add the provided SSDT-RHUB to your EFI and config.plist
  
### SATA Issues

On rare occasions(mainly laptops), the SATA controller isn't officially supported by macOS. To resolve this, we'll want to do a few things:

* Set SATA to AHCI mode in the BIOS
  * macOS doesn't support hardware RAID or IDE mode properly.
  * Note drives already using Intel Rapid Storage Technology(RST, soft RAID for Windows and Linux) will not be accessible in macOS.
* [SATA-unsupported.kext](https://github.com/khronokernel/Legacy-Kexts/blob/master/Injectors/Zip/SATA-unsupported.kext.zip)
  * Adds support to obscure SATA controllers, commonly being laptops.
  * For very legacy SATA controllers, [AHCIPortInjector.kext](https://www.insanelymac.com/forum/files/file/436-ahciportinjectorkext/) may be more suitable.
* [Catalina's patched AppleAHCIPort.kext](https://github.com/dortania/OpenCore-Install-Guide/blob/master/extra-files/CtlnaAHCIPort.kext.zip)
  * For users running macOS 11, Big Sur and having issues. This backports the known working Catalina kext, SATA-unsupported is not needed with this kext

Note that you will only experience this issue after installing macOS onto the drive, booting the macOS installer will not error out due to SATA issues.

## Kernel panic with IOPCIFamily on X99

For those running the X99 platform from Intel, please go over the following:

* The following kernel patches are enabled:
  * AppleCpuPmCfgLock
  * AppleXcpmCfgLock
  * AppleXcpmExtraMsrs
* You have the following SSDTs:
  * SSDT-UNC(if not, see [Getting started with ACPI](https://dortania.github.io/Getting-Started-With-ACPI/) on creating said file)

## Stuck on or near `IOConsoleUsers: gIOScreenLock...`/`gIOLockState (3...`

This is right before the GPU is properly initialized, verify the following:

* GPU is UEFI capable(GTX 7XX/2013+)
* CSM is off in the BIOS
  * May need to be enabled on laptops
* Forcing PCIe 3.0 link speed
* Double check that ig-platform-id and device-id are valid if running an iGPU.
  * Desktop UHD 630's may need to use `00009B3E` instead
* Trying various [WhateverGreen Fixes](https://github.com/acidanthera/WhateverGreen/blob/master/Manual/FAQ.IntelHD.en.md)
  * `-igfxmlr` boot argument. This can also manifest as a "Divide by Zero" error.
* Coffee Lake iGPU users may also need `igfxonln=1` in 10.15.4 and newer

## Scrambled Screen on laptops

Enable CSM in your UEFI settings. This may appear as "Boot legacy ROMs" or other legacy setting.

## Black screen after `IOConsoleUsers: gIOScreenLock...` on Navi

* Add `agdpmod=pikera` to boot args
* Switch between different display outputs
* Try running MacPro7,1 SMBIOS with the boot-arg `agdpmod=ignore`

For MSI Navi users, you'll need to apply the patch mentioned here: [Installer not working with 5700XT #901](https://github.com/acidanthera/bugtracker/issues/901)

Specifically, add the following entry under `Kernel -> Patch`:

::: details MSI Navi Patch

```
Base:
Comment: Navi VBIOS Bug Patch
Count: 1
Enabled: YES
Find: 4154592C526F6D2300
Identifier: com.apple.kext.AMDRadeonX6000Framebuffer
Limit: 0
Mask:
MinKernel: 19.00.00
MaxKernel: 19.99.99
Replace: 414D442C526F6D2300
ReplaceMask:
Skip: 0
```

:::

Note: macOS 11, Big Sur no longer requires this patch for MSI Navi.

## Kernel Panic `Cannot perform kext summary`

Generally seen as an issue surrounding the prelinked kernel, specifically that macOS is having a hard time interpreting the ones we injected. Verify that:

* Your kexts are in the correct order(master then plugins, Lilu always before the plugins)
* Kexts with executables have them and plist only kexts don't(ie. USBmap.kext, XHCI-unspported.kext, etc does not contain an executable)
* Don't include multiple of the same kexts in your config.plist(ie. including multiple copies of VoodooInput from multiple kexts, we recommend choosing the first kext in your config's array and disable the rest)

Note: this error may also look very similar to [Kernel Panic on `Invalid frame pointer`](#kernel-panic-on-invalid-frame-pointer)

## Kernel Panic `AppleIntelMCEReporter`

With macOS Catalina, dual socket support is broken, and a fun fact about AMD firmware is that some boards will actually report multiple socketed CPUs. To fix this, add [AppleMCEReporterDisabler](https://github.com/acidanthera/bugtracker/files/3703498/AppleMCEReporterDisabler.kext.zip) to both EFI/OC/Kexts and config.plist -> Kernel -> Add

## Kernel Panic `AppleIntelCPUPowerManagement`

This is likely due to faulty or outright missing NullCPUPowerManagement. To fix the issue, remove NullCPUPowerManagement from `Kernel -> Add` and `EFI/OC/Kexts` then enable `DummyPowerManagement` under `Kernel -> Emulate`

* **Note**: On older Intel CPUs(ie. Penryn and older), it may be due to IRQ conflicts or the HPET device being disabled. To resolve, you have 2 options:
  * [SSDTTime's FixHPET Option](https://dortania.github.io/Getting-Started-With-ACPI/ssdt-methods/ssdt-easy.html)
  * Forcing the HPET Device on
  
::: details Forcing the HPET Device on

Under ACPI -> Patch:

| Comment | String | Force HPET Online |
| :--- | :--- | :--- |
| Enabled | Boolean | YES |
| Count | Number | 0 |
| Limit | Number | 0 |
| Find | Data | `A010934F53464C00` |
| Replace | Data | `A40A0FA3A3A3A3A3` |

:::

## Kernel Panic `AppleACPIPlatform` in 10.13

![](../../images/troubleshooting/troubleshooting-md/KA5UOGV.png)

On macOS 10.13, High Sierra the OS is much stricter with ACPI tables, [specifically a bug with how headers were handled](https://alextjam.es/debugging-appleacpiplatform/). To resolve, enable `NormalizeHeaders` under ACPI -> Quirks in your config.plist

## macOS frozen right before login

This is a common example of screwed up TSC, for most system add [CpuTscSync](https://github.com/lvs1974/CpuTscSync)

The most common way to see the TSC issue:

Case 1    |  Case 2
:-------------------------:|:-------------------------:
![](../../images/troubleshooting/troubleshooting-md/asus-tsc.png)  |  ![](../../images/troubleshooting/troubleshooting-md/asus-tsc-2.png)

## Keyboard works but trackpad does not

Make sure that VoodooInput is listed *before* VoodooPS2 and VoodooI2C kexts in your config.plist.

::: details VoodooI2C Troubleshooting

Check the order that your kexts load - make they match what is shown under [Gathering Files](../../ktext.md):

1. VoodooGPIO, VoodooInput, and VoodooI2CServices in any order (Found under VoodooI2C.kext/Contents/PlugIns)
2. VoodooI2C
3. Satellite/Plugin Kext

Make sure you have SSDT-GPIO in EFI/OC/ACPI and in your config.plist under ACPI -> Add in your config.plist. If you are still having issues, reference the [Getting Started With ACPI GPIO page](https://dortania.github.io/Getting-Started-With-ACPI/Laptops/trackpad.html).

:::

## `kextd stall[0]: AppleACPICPU`

This is due to either a missing SMC emulator or broken one, make sure of the following:

* Lilu and VirtualSMC are both in EFI/OC/kexts and in your config.plist
* Lilu is before VirtualSMC in the kext list
* Last resort is to try [FakeSMC](https://github.com/CloverHackyColor/FakeSMC3_with_plugins) instead, **do not have both VirtualSMC and FakeSMC enabled**

## Kernel Panic on AppleIntelI210Ethernet

For those running Comet lake motherboards with the I225-V NIC, you may experience a kernel panic on boot due to the I210 kext. To resolve this, make sure you have the correct PciRoot for your Ethernet. This commonly being either:

* PciRoot(0x0)/Pci(0x1C,0x1)/Pci(0x0, 0x0)
  * By default, this is what Asus and Gigabyte motherboards use
* PciRoot(0x0)/Pci(0x1C,0x4)/Pci(0x0,0x0)
  * Some OEMs may use this instead
  
For those who can to your PciRoot manually, you'll want to install macOS fully and run the following with [gfxutil](https://github.com/acidanthera/gfxutil/releases):

```
/path/to/gfxutil | grep -i "8086:15f3"
```

This should spit out something like this:

```
00:1f.6 8086:15f3 /PC00@0/GBE1@1F,6 = PciRoot(0x0)/Pci(0x1F,0x6)
```

The ending `PciRoot(0x0)/Pci(0x1F,0x6)` is what you want to add in your config.plist with device-id of `F2150000`

## Kernel panic on "Wrong CD Clock Frequency" with Icelake laptop

![](../../images/troubleshooting/troubleshooting-md/cd-clock.jpg)

To resolve this kernel panic, ensure you have `-igfxcdc` in your boot-args.

## Kernel panic on "cckprng_int_gen"

Full panic:

```
"cckprng_int_gen: generator has already been sealed"
```

This is likely to be 1 of 2 things:

* Missing SMC Emulator(ie. no VirtualSMC in your config.plist or EFI)
  * Add [VirtualSMC.kext](https://github.com/acidanthera/VirtualSMC/releases) to your config.plist and EFI
* Incorrect SSDT usage with SSDT-CPUR

For the latter, ensure you're only using SSDT-CPUR with **B550 and A520**. Do not use on X570 or older hardware(ie. B450 or A320)

## Stuck at `Forcing CS_RUNTIME for entitlement` in Big Sur

![Credit to Stompy for image](../../images/extras/big-sur/readme/cs-stuck.jpg)

This is actually the part at where macOS will seal the system volume, and where it may seem that macOS has gotten stuck. **DO NOT RESTART** thinking you're stuck, this will take quite some time to complete.

## Stuck on `ramrod`(^^^^^^^^^^^^^)

![Credit to Notiflux for image](../../images/extras/big-sur/readme/ramrod.jpg)

If you get stuck around the `ramrod` section (specifically, it boots, hits this error, and reboots again back into this, causing a loop), this hints that your SMC emulator is broken. To fix this, you have 2 options:

* Ensure you're using the latest builds of VirtualSMC and Lilu, with the `vsmcgen=1` boot-arg
* Switch over to [Rehabman's FakeSMC](https://bitbucket.org/RehabMan/os-x-fakesmc-kozlek/downloads/) (you can use the `MinKernel`/`MaxKernel` trick mentioned above to restrict FakeSMC to Big Sur and up

And when switching kexts, ensure you don't have both FakeSMC and VirtualSMC enabled in your config.plist, as this will cause a conflict.

## Virtual Machine Issues

* VMWare 15 is known to get stuck on `[EB|#LOG:EXITBS:START]`. VMWare 16 resolves the problem.

## Reboot on "AppleUSBHostPort::createDevice: failed to create device" on macOS 11.3+

This is due to [XhciPortLimit breaking with macOS 11.3 and newer](https://github.com/dortania/bugtracker/issues/162), to resolve this, you **must** disable XhciPortLimit under Kernel -> Quirks. Please ensure you've [mapped your USB ports correctly](https://dortania.github.io/OpenCore-Post-Install/usb/) before doing so.
