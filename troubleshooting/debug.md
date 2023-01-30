# OpenCore调试

需要弄清楚为什么你会遇到问题或停滞不前?嗯，你来对地方了:

[[toc]]

## 文件交换

首先，确保你使用的是`DEBUG`或`NOOPT`版本的OpenCore。这将提供比`RELEASE`版本更多的信息，需要交换的特定文件:

* EFI/BOOT/
  * `BOOTx64.efi`
* EFI/OC/Drivers/
  * `OpenRuntime.efi`
  * `OpenCanopy.efi`(如果你正在使用它)
* EFI/OC/
  * `OpenCore.efi`

![](../images/troubleshooting/debug-md/replace.png)

* **注意**:通常最好调试没有OpenCanopy的系统，如果需要，确保这个文件来自debug，否则几乎没有调试信息。

## 配置更改

接下来，转到你的config plist并找到`Misc` > `Debug`部分，我们有几个条目需要使用:

### Misc > Debug

这里我们需要启用以下功能:

* **AppleDebug**: 是
  * 提供更多调试信息，特别是与 boot.efi 相关的信息，并将日志存储到磁盘。

* **ApplePanic**: 是
  * 这将允许内核错误被存储到磁盘，强烈建议在boot-args中保持`keepsyms=1`以尽可能多地保存信息。

* **DisableWatchdog**: 是
  * 禁用UEFI看门狗，用于OpenCore在一些非关键的东西上停滞。

* **Target**: `67` (或者在下面计算一个)
  * 用于开启不同级别的调试

| 值 | 说明 |
| :--- | :--- |
| `0x01` | 启用日志记录 |
| `0x02` | 启用屏幕调试 |
| `0x04` | 启用记录到数据中心 |
| `0x08` | 启用串口日志功能. |
| `0x10` | 启用UEFI变量日志记录. |
| `0x20` | 启用非易失性UEFI变量日志记录. |
| `0x40` | 启用文件记录功能. |

要计算目标，可以使用十六进制计算器，然后将其转换为小数。对于我们来说，我们希望将我们的值存储到一个.txt文件中，以便以后查看:

* `0x01` — 启用日志记录
* `0x02` — 启用屏幕调试
  * 请注意，对于GOP实现不佳的固件，这可能会严重增加启动时间
* `0x40` — 将日志写入文件

`0x01` + `0x02` + `0x40` = `0x43`

`0x43` 转换成小数后变成 `67`

我们可以设置 `Misc` -> `Debug` -> `Target` -> `67`

* **DisplayLevel**: `2147483714` (或者在下面计算一个)
  * 用于设置记录的内容

| 值 | 说明 |
| :--- | :--- |
| `0x00000002` | 在DEBUG, NOOPT, RELEASE中发出警告|
| `0x00000040` | DEBUG, NOOPT 中的调试信息。 |
| `0x00400000` | 自定义构建中的调试详细信息。 |
| `0x80000000` | 在DEBUG, NOOPT, RELEASE中出现的错误。 |

  完整的列表可以在 [DebugLib.h](https://github.com/tianocore/edk2/blob/UDK2018/MdePkg/Include/Library/DebugLib.h)中找到。

对于我们来说，我们只需要以下内容:

* `0x00000002` — 在DEBUG, NOOPT, RELEASE中发出警告
* `0x00000040` — DEBUG, NOOPT 中的调试信息。
* `0x80000000` — 在DEBUG, NOOPT, RELEASE中出现的错误。

就像`Target`一样，我们使用十六进制计算器，然后转换为十进制:

`0x80000042` 转换为小数变成 `2147483714`

`Misc` -> `Debug` -> `DisplayLevel` -> `2147483714`

一旦完成，你的config.plist应该是这样的:

![](../images/troubleshooting/debug-md/debug.png)

## 禁用所有的日志

要删除所有文件日志和调试消息，只需将所有OpenCore文件替换为发布中的文件，就像我们之前在[file swap](#file-swap)部分所做的那样。

最后，要删除写入磁盘的操作，设置如下:

* AppleDebug = `NO`
* ApplePanic = `NO`
* Target = `0`
