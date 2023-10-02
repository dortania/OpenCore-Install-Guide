# 修复KASLR滑动值

本节面向希望理解和修复 "Couldn't allocate runtime area" 错误的用户。这在Z390、X99和X299中最常见。

* 注意:OpenCore是必需的，在本指南中不再支持Clover

## 那么什么是KASLR呢

KASLR代表内核地址空间布局随机化，它的用途是为了安全。具体来说，这使得攻击者很难弄清楚重要对象在内存中的位置，因为在机器和引导之间总是随机的。[更多关于KASLR的深入讲解](https://lwn.net/Articles/569635/)

当您引入内存映射较小或存在太多设备的设备时，这就成为一个问题。可能有内核运行的空间，但也有内核不能完全容纳的空闲空间。这就是`slide=xxx`的作用。我们不是让macOS在每次启动时随机选择一个区域进行操作，而是将其限制在我们知道可以工作的地方。

## 这些信息是给谁的

正如我前面提到的，这是针对那些没有足够的内核空间或者移动到一个太小的地方的用户。在引导时，你通常会遇到类似的错误:

```
Error allocating 0x1197b pages at 0x0000000017a80000 alloc type 2
Couldn't allocate runtime area
```

随着一些变化:

```
Only 244/256 slide values are usable!
```

甚至在运行macOS时崩溃:

```
panic(cpu 6 caller 0xffffff801fc057ba): a freed zone element has been modified in zone kalloc.4096: expected 0x3f00116dbe8a46f6 but found 0x3f00116d00000000
```

关于这些错误最好的部分是，它们可以是随机的，这也是为什么循环你的电脑20次也可以解决这个问题，但只是暂时的。

有趣的事实:查找一个区域需要大约31毫秒，手动设置滑动值平均可以减少0.207%的启动时间!!

## 那么我怎么解决这个问题呢

真正的解决办法其实很简单。你需要:

* **OpenCore 用户**:
  * [OpenRuntime](https://github.com/acidanthera/OpenCorePkg/releases)
  * [OpenShell](https://github.com/acidanthera/OpenCorePkg/releases)(别忘了启用这个 `Root -> Misc -> Tools`)

我们还需要配置我们的 config.plist -> Booter:

* **AvoidRuntimeDefrag**: YES
  * 修复UEFI运行时服务，如日期、时间、NVRAM、电源控制等
* **DevirtualiseMmio**: YES
  * 减少被盗内存占用，扩展`slide=N`值的选项，并对修复Z390上的内存分配问题非常有帮助。
* **EnableSafeModeSlide**: YES
  * 允许在安全模式下使用slide值
* **ProtectUefiServices**: NO
  * 保护UEFI服务不被固件覆盖，主要适用于VMs、300系列和较新的系统，如Ice Lake和Comet Lake
* **ProvideCustomSlide**: YES
  * 这可以确保内核只选择好的区域，避免那些可能导致引导失败的区域。它仍然是随机的，但在随机化中省略了那些不好的区域
* **RebuildAppleMemoryMap**: YES
  * 生成与macOS兼容的内存映射，可能在一些笔记本电脑的OEM固件上损坏，所以如果您收到早期启动失败禁用此功能，这可以确保我们的内存映射将符合内核期望

## 准备BIOS

我们需要重置内存映射的原因是我们希望它更确定，我的意思是每次启动都会有更少的变化，所以我们有更少的边缘情况(内存映射在启动上并不总是一致的)。准备好:

* 更新BIOS(非常重要，因为早期的BIOS已知有内存映射问题，特别是Z390)
* 清除CMOS
* 启用需要的BIOS设置:
  * `Above4GDecoding`: 这允许设备使用4GB以上的内存区域，这意味着macOS将有更多的空间来容纳，但在一些X99/X299 boasrd上可能会出现问题。
    * 如果遇到问题，请确保“MMIOH Base”设置为12 TB或更低，因为macOS只支持44位物理寻址。
    * 注意:在支持Resizable BAR Support的BIOS上，启用 Above 4G 将解锁此选项。如果启用了此功能，请确保 Booter -> Quirks -> ResizeAppleGpuBars 设置为`0`。
  * `Boot Options -> Windows8.1/10 mode`: 这将确保没有加载旧的遗留垃圾。有趣的事实是，`其他操作系统`只用于引导旧版本的Windows，而不是其他操作系统。
* 在BIOS中禁用尽可能多的不需要的设备(这意味着每次引导时map的变化更小，因此引导失败的机会更少)。常见的设置:
  * `CSM`: 对于传统支持，添加了一堆我们不想要的垃圾。这也会破坏shell，让你无法启动它。
  * `Intel SGX`: 软件保护扩展，占用大量空间，在macOS中不起任何作用。
  * `Parallel Port`: macOS甚至看不到并口。
  * `Serial Port`: 我想知道有多少人正在调试内核…
  * `iGPU`: 并不理想，但有些系统的映射过于臃肿，iGPU无法容纳。
  * `Thunderbolt`: 许多使用黑苹果的人没有使用Thunderbolt，没有Thunderbolt但有这个选项的主板只会浪费更多的空间。
  * `LED lighting`: 对不起，伙计，该走了。
  * `Legacy USB`: 更多的传统垃圾。

## 测试启动

在调整了EFI、config plist和BIOS设置后，是时候试试我们的新设置了。如果你仍然有问题，那么看起来我们需要深入研究并计算我们的slide值

## 查找 Slide 值

现在你要做的是在你选择的引导管理器中打开EFI shell并运行`memmap`。这将给你所有页面的列表和他们的大小。这是有趣的地方。

你将会看到的例子:

| Type | Start | End | \# Pages | Attributes |
| :--- | :--- | :--- | :--- | :--- |
| RT_Data | `0000000000000000` | `0000000000000FFF` | `0000000000000001` | `800000000000000F` |
| Available | `0000000000001000` | `0000000000057FFF` | `0000000000000057` | `000000000000000F` |
| Reserved | `0000000000058000` | `0000000000058FFF` | `0000000000000001` | `000000000000000F` |
| Available | `0000000000059000` | `000000000008FFFF` | `0000000000000037` | `000000000000000F` |
| RT_Code | `0000000000090000` | `0000000000090FFF` | `0000000000000001` | `800000000000000F` |
| Available | `0000000000091000` | `000000000009DFFF` | `000000000000000D` | `000000000000000F` |
| Reserved | `000000000009E000` | `000000000009FFFF` | `0000000000000002` | `000000000000000F` |
| Available | `0000000000100000` | `000000005B635FFF` | `000000000005B536` | `000000000000000F` |
| BS_Data | `000000005B636000` | `000000005B675FFF` | `0000000000000040` | `000000000000000F` |
| Available | `000000005B676000` | `000000006AF77FFF` | `000000000000F902` | `000000000000000F` |
| LoaderCode | `000000006AF78000` | `000000006B155FFF` | `00000000000001DE` | `000000000000000F` |
| BS_Data | `000000006B156000` | `000000006B523FFF` | `00000000000003CE` | `000000000000000F` |
| ACPI_NVS | `000000006B524000` | `000000006B524FFF` | `0000000000000001` | `000000000000000F` |
| BS_Data | `000000006B526000` | `000000006B625FFF` | `0000000000000100` | `000000000000000F` |
| Available | `000000006B626000` | `000000006B634FFF` | `000000000000000F` | `000000000000000F` |

现在你可能想知道我们怎么把它转换成slide值，其实很简单。我们感兴趣的是`Start`列中最大的可用值。在这个例子中，我们看到`000000006B626000`是最大的，请注意，这些值是十六进制的，因此如果有多个值彼此接近，你可能需要将它们转换为十进制。转换为计算slide值(macOS内置的计算器有一个编程功能，可以按⌘+3):

`000000006B626000` = `0x6B626000`

(`0x6B626000` - `0x100000`)/`0x200000` = `0x35A`

为了验证这是正确的:

`0x100000` + (`0x35A` * `0x200000`) = `0x6B500000`

当返回值**不是**原始值(`0x6B500000` vs `0x6B626000`)时，只需在最终的slide值上加1。这是由于四舍五入。例如，`0x35A`转换成十进制后会变成`858`，然后+1会得到`slide=859`。

> 但是稍等一下，它比256高!

这是正确的，这是由于内存映射中包含无法使用的`Above4GDecoding`扇区导致的。因此，你需要一直往下看，直到找到一个足够小的值(对我们来说是`0000000000100000`)。

为了让公式更清楚一点

(十六进制 - `0x100000`)/`0x200000` = 十六进制的 Slide 值

`0x100000` +( 十六进制的Slide值 * `0x200000`) = 原始的十六进制值(如果不是，则给 Slide 值加1)

记住这个公式，要获得足够低的滑动值，可以使用的最高起始值是0x20100000。

现在导航到 config.plist 并添加 slide 值和其他启动参数(对我们来说，当使用`0x100000`时，它是`slide=0`)。如果这个值仍然给你错误，那么你可以继续使用第二大的`Start`值，以此类推。

有时你可能会发现，当你计算slide时，你会收到非常小的值，如`slide=-0.379150390625`，当这种情况发生时，将其舍入为`slide=0`。

对于有问题的用户，也可以在[r/Hackintosh Discord](https://discord.gg/u8V7N5C)上的#Sandbox频道输入`$slide [insert largest #Pages value]`。

> 但是这太难了

别担心，有一个简单的解决办法。在shell中运行`memmap`后，运行:

```
shell> fs0: //替换为您的USB

fs0:\> dir //验证这是正确的目录，如果不是，尝试fs1，以此类推

Directory of fs0:\
01/01/01 3:30p   EFI

fs0:\> memmap > memmap.txt
```

这将添加一个`memmap.txt`文件到你的EFI的根目录，然后你可以继续把它放到 r/Hackintosh discord 的 #Sandbox 通道，并键入`$slide[插入一个链接到memmap.txt]`

## 使用 DevirtualiseMmio

DevirtualiseMmio 是一个非常有趣的功能，特别是它克服了许多PCI设备系统(如一些Z390板)和几乎所有HEDT板(如X99和X299板)的巨大障碍。它是如何做到这一点的，它使用 MMIO 区域并删除运行时属性，允许它们作为内核舒适放置的空间，再加上`ProvideCustomSlide`的特殊之处，这意味着我们可以在保持 slide 的安全特性的同时获得一个可引导的机器。

对于像Threadripper TRX40 19h这样问题严重的系统，我们需要找到不需要正确操作的特定区域。这就是`MmioWhitelist`发挥作用的地方。请注意，大多数系统都不需要白名单

如果您使用DevirtualiseMmio运行调试版本的OpenCore，您将在日志中看到以下内容:

```
21:495 00:009 OCABC: MMIO devirt start
21:499 00:003 OCABC: MMIO devirt 0x60000000 (0x10000 pages, 0x8000000000000001) skip 0
21:503 00:003 OCABC: MMIO devirt 0xFE000000 (0x11 pages, 0x8000000000000001) skip 0
21:506 00:003 OCABC: MMIO devirt 0xFEC00000 (0x1 pages, 0x8000000000000001) skip 0
21:510 00:003 OCABC: MMIO devirt 0xFED00000 (0x1 pages, 0x8000000000000001) skip 0
21:513 00:003 OCABC: MMIO devirt 0xFEE00000 (0x1 pages, 0x800000000000100D) skip 0
21:516 00:003 OCABC: MMIO devirt 0xFF000000 (0x1000 pages, 0x800000000000100D) skip 0
21:520 00:003 OCABC: MMIO devirt end, saved 278608 KB
```

* 注意:关于如何打开日志文件，请参见[OpenCore Debugging](../troubleshooting/debug.md)

所以我们需要浏览6个区域，看看哪些是坏的，最好的主意是屏蔽所有MMIO区域**除了**一个，并尝试每个区域以获得一个好区域的列表。

现在让我们看看上面的例子并创建我们自己的MmioWhitelist，我们首先需要将地址从十六进制转换为十进制:

* MMIO devirt 0x60000000 -> 1610612736
* MMIO devirt 0xFE000000 -> 4261412864
* MMIO devirt 0xFEC00000 -> 4273995776
* MMIO devirt 0xFED00000 -> 4275044352
* MMIO devirt 0xFEE00000 -> 4276092928
* MMIO devirt 0xFF000000 -> 4278190080

完成后应该是这样的:

![](../images/extras/kaslr-fix-md/mmio-white.png)
