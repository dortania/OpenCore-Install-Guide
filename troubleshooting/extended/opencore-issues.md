# OpenCore启动问题

从启动USB本身到选择启动macOS安装程序之前的问题

[[toc]]

## 在出现选择菜单之前卡在黑屏上

这可能是您的固件或OpenCore上的一些错误，特别是它在加载所有驱动程序和显示菜单时有问题。诊断它的最佳方法是通过[OpenCore的DEBUG Build](./../ DEBUG .md)并检查日志OpenCore是否实际加载，如果是，则是什么卡住了。

**OpenCore未加载的情况**:

* 如果在设置了OpenCore的DEBUG版本，Target设置为67后，仍然没有日志，则可能存在以下问题:
  * 不正确的USB文件夹结构
    * 参见[引导OpenCore重启到BIOS](#booting-opencore-reboots-to-bios) 了解更多信息
  * 固件不支持UEFI
    * 你需要设置DuetPkg，这在[macOS](../../installer-guide/mac-install.md) 和 [Windows](../../installer-guide/windows-install.md) 安装页面中都有介绍

**OpenCore已加载的情况**:

* 检查日志中打印的最后一行，很可能有加载的 .efi 驱动程序或者某种形式的ASSERT
  * 对于ASSERT，你需要在这里通知开发人员这个问题: [Acidanthera's Bugtracker](https://github.com/acidanthera/bugtracker)
  * 如果.efi驱动卡住了，请检查以下内容:
    * **HfsPlus.efi 加载问题:**
      * 尝试使用 [HfsPlusLegacy.efi](https://github.com/acidanthera/OcBinaryData/blob/master/Drivers/HfsPlusLegacy.efi) 代替
      * 这建议用于不支持RDRAND的cpu，主要与第3代Ivy bridge i3及更老的cpu有关
      * [VBoxHfs.efi](https://github.com/acidanthera/AppleSupportPkg/releases/tag/2.1.7) 是另一个选择，但是比HfsPlus的版本要慢得多
    * **HiiDatabase.efi 加载问题:**
      * 可能你的固件已经支持HiiDatabase，所以驱动程序是冲突的。只需移除驱动程序，因为你不需要它。

## 卡在 `no vault provided!`

在你的config.plist `Misc -> Security -> Vault` 中将Vault设置为:

* `Optional`

如果您已经执行了 `sign.command` 您将需要恢复OpenCore.efi文件，因为已经插入了256字节的RSA-2048签名。可以在这里获取新的OpenCore.efi副本:[OpenCorePkg](https://github.com/acidanthera/OpenCorePkg/releases)

**注意**:Vault和FileVault是两个不同的东西，请参阅[安全和FileVault](https://sumingyd.github.io/OpenCore-Post-Install/universal/security.html) 了解更多细节

## 卡在 `OC: Invalid Vault mode`

这可能是一个拼写错误，OpenCore中的选项是区分大小写的，所以请务必仔细检查， **O**是在`Misc -> Security -> Vault`下正确的输入方式。

## 无法看到macOS分区

主要检查:

* ScanPolicy设置为 `0` 将显示所有驱动器
* 拥有合适的固件驱动程序，例如HfsPlus(注意 ApfsDriverLoader 不应该在0.5.8中使用)
* 在config plist -> UEFI -> Quirks 中将 UnblockFsConnect 设置为 True 。一些HP系统需要
* 在BIOS中设置 **SATA 模式**: `AHCI`
* 设置`UEFI -> APFS`以查看基于APFS的驱动器:
  * **EnableJumpstart**: YES
  * **HideVerbose**: NO
  * 如果运行旧版本的High Sierra(即 10.13.5或更老版本)，设置如下:
    * **MinDate**: `-1`
    * **MinVersion**: `-1`

## 卡在 `OCB: OcScanForBootEntries failure - Not Found`

这是由于OpenCore无法找到任何驱动器与当前的ScanPolicy，设置为 `0` 将允许所有引导选项显示

* `Misc -> Security -> ScanPolicy -> 0`

## 卡在 `OCB: failed to match a default boot option`

与`OCB: OcScanForBootEntries failure - Not Found`相同的修复，OpenCore无法找到任何驱动器与当前的ScanPolicy，设置为`0`将允许所有引导选项显示

* `Misc -> Security -> ScanPolicy -> 0`

## 卡在 `OCB: System has no boot entries`

与上述2相同的修复:

* `Misc -> Security -> ScanPolicy -> 0`

## 卡在 `OCS: No schema for DSDT, KernelAndKextPatch, RtVariable, SMBIOS, SystemParameters...`

这是因为在 OpenCore 中使用了 Clover 配置，或者使用了像 Mackie 的 Clover 和 OpenCore configurator 这样的配置器。你需要重新开始并创建一个新的配置，或者找出所有需要从配置中删除的垃圾。**这就是为什么我们不支持配置器的原因，配置器在这些问题上是众所周知的**

* 注意:如果您将过时的配置与新版本的OpenCore混合使用，也会发生相同的问题。请相应地更新它们

## 卡在 `OC: Driver XXX.efi at 0 cannot be found`

这是由于在你的 config.plist 中有一个条目，但在你的 EFI 中没有。解决方法:

* 确保你的 EFI/OC/Drivers 与 config plist -> UEFI -> Drivers 匹配
  * 如果不是，请使用OpenCore运行Cmd/Ctrl+R重新快照config.plist

注意，这些条目是区分大小写的。

## 收到 "Failed to parse real field of type 1"

这是因为当一个值不应该是`real`时，它被设置为`real`，通常是Xcode意外转换了`HaltLevel`:

```xml
<key>HaltLevel</key>
 <real>2147483648</real>
```

要解决这个问题，把`real`换成`integer`:

```xml
<key>HaltLevel</key>
 <integer>2147483648</integer>
```

## 无法在选择菜单中选择任何内容

这是由于一些事情

* 不兼容的键盘驱动程序:
  * 禁用`PollAppleHotKeys`并启用`KeySupport`，然后从 config.plist -> UEFI -> Drivers 中删除[OpenUsbKbDxe](https://github.com/acidanthera/OpenCorePkg/releases)
  * 如果上述方法无效，反向操作:禁用' KeySupport`，然后将[OpenUsbKbDxe](https://github.com/acidanthera/OpenCorePkg/releases) 添加到你的 config.plist -> UEFI -> Drivers

* 缺少PS2键盘驱动程序(如果使用USB键盘则忽略):
  * *虽然大多数固件默认包含它，但一些笔记本电脑和旧电脑可能仍然需要[Ps2KeyboardDxe.efi](https://github.com/acidanthera/OpenCorePkg/releases) 才能工作。记得把这个添加到你的config.plist中

## 收到 “SSDTs not being added”

使用OpenCore，在ACPI文件周围添加了一些额外的安全检查，特别是表长度头必须等于文件大小。这实际上是iASL在编译文件时的错误。如何找到它的例子:

```c
* Original Table Header:
*     Signature        "SSDT"
*     Length           0x0000015D (349)
*     Revision         0x02
*     Checksum         0xCF
*     OEM ID           "ACDT"
*     OEM Table ID     "SsdtEC"
*     OEM Revision     0x00001000 (4096)
*     Compiler ID      "INTL"
*     Compiler Version 0x20190509 (538510601)
```

`Length`和`checksum`值是我们关心的，所以如果我们的SSDT实际上是347字节，那么我们希望将`Length`更改为`0x0000015B (347)`(`015B`是十六进制的)

解决这个问题的最好方法是获取一个更新的iASL副本或Acidanthera的[MaciASL](https://github.com/acidanthera/MaciASL/releases)副本并重新制作SSDT

* 注:由 Rehabman 发布的 MaciASL 容易发生 ACPI 损坏，请避免使用，因为他们不再维持他们的仓库

## 引导OpenCore重启到BIOS

* 不正确的EFI文件夹结构，确保所有OC文件都在ESP(EFI系统分区)上的EFI文件夹中

::: details 文件夹结构示例

![Directory Structure from OpenCore's Documentation](../../images/troubleshooting/troubleshooting-md/oc-structure.png)

:::

## 收到 “OCABC: Incompatible OpenRuntime r4, require r10”

过时的OpenRuntime.efi，确保BOOTx64.efi, OpenCore.efi和OpenRuntime **都来自相同的构建**。任何不匹配的东西都会破坏启动

* **注意**:0.5.7及以上版本，FwRuntimeServices已重命名为OpenRuntime

## 收到 “Failed to open OpenCore image - Access Denied”

在较新的微软Surface设备固件上，即使禁用了安全引导，加载OpenCore也会导致安全违规。要解决这个问题，请在 config.plist 中启用`UEFI -> Quirks -> DisableSecurityPolicy`。查看这里了解更多信息:[Failed to open OpenCore image - Access Denied #1446](https://github.com/acidanthera/bugtracker/issues/1446)

## 收到 “OC: Failed to find SB model disable halting on critical error”

This is a typo, ensure that in your config.plist `Misc -> Security -> SecureBootModel` is set to Disable**d**

## Legacy boot stuck on `BOOT FAIL!`

This error means that EFI/OC/OpenCore.efi could not be found on any partition.
Double check that the EFI folder structure is correct.

::: details Example of folder structure

![Directory Structure from OpenCore's Documentation](../../images/troubleshooting/troubleshooting-md/oc-structure.png)

:::
