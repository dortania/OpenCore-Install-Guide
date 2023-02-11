# 安装后的问题

一旦正确安装，围绕macOS的问题。

[[toc]]

## 坏掉的 iMessage 和 Siri

请参阅[修复iServices](https://sumingyd.github.io/OpenCore-Post-Install/universal/iservices.html) 部分

## 没有板载音频

请参阅[使用AppleALC修复音频](https://sumingyd.github.io/OpenCore-Post-Install/)部分

## BIOS重置或在重启/关机后进入安全模式

请参阅[修复RTC/CMOS复位](https://sumingyd.github.io/OpenCore-Post-Install/misc/rtc.html)部分

## 基于Synaptics PS2的触控板无法工作

您可以尝试使用 [SSDT-Enable_DynamicEWMode.dsl](https://github.com/acidanthera/VoodooPS2/blob/master/Docs/ACPI/SSDT-Enable_DynamicEWMode.dsl).
首先，你需要打开设备管理器，进入以下页面:

```
设备管理器->鼠标和其他指向设备->双击触摸板->属性->详细信息> BIOS设备名称
```

然后获取 [SSDT-Enable_DynamicEWMode.dsl](https://github.com/acidanthera/VoodooPS2/blob/master/Docs/ACPI/SSDT-Enable_DynamicEWMode.dsl)
默认情况下，该路径使用PCI0.LPCB.PS2K。您需要相应地重命名。

```c
External (_SB_.PCI0.LPCB.PS2K, DeviceObj) <- 重命名

    Name(_SB.PCI0.LPCB.PS2K.RMCF, Package()  <- 重命名

```

然后用MaciASL编译，复制到OC/ACPI文件夹，并将其添加到配置文件中，这样就可以了。

* 注意:虽然在大多数情况下这是有效的，但触控板可能会滞后，你可能无法使用物理按钮([更多细节](https://github.com/acidanthera/bugtracker/issues/890))。如果你可以不用触控板，这个可能会更好:

找到鼠标的ACPI路径(见上文)，然后获取 [SSDT-DisableTrackpadProbe.dsl](https://github.com/acidanthera/VoodooPS2/blob/master/Docs/ACPI/SSDT-DisableTrackpadProbe.dsl). 默认情况下，它使用PCI0.LPCB.PS2K，因此您必须在必要时将其更改为ACPI路径:

```c
External (_SB_.PCI0.LPCB.PS2K, DeviceObj) <- 重命名

    Name(_SB.PCI0.LPCB.PS2K.RMCF, Package() <- 重命名
```

## 修复戴尔PS2键盘按键不释放的问题

对于那些围绕按键不释放(即无限按)的问题，您将希望启用VoodooPS2的戴尔配置文件。

首先，你需要在设备管理器中找到你的ACPI键盘对象的路径:

```
设备管理器->键盘->双击键盘->属性->详细信息> BIOS设备名称
```

在此之后，获取 [SSDT-KEY-DELL-WN09.dsl](https://github.com/acidanthera/VoodooPS2/blob/master/Docs/ACPI/SSDT-KEY-DELL-WN09.dsl) ，并根据需要将ACPI路径更改为上面找到的路径:

```c
External (_SB_.PCI0.LPCB.PS2K, DeviceObj) <- 重命名

    Method(_SB.PCI0.LPCB.PS2K._DSM, 4) <- 重命名
```

## AMD X570上缺少macOS GPU加速

验证以下内容:

* GPU支持UEFI (GTX 7XX/2013+)
* BIOS中CSM是关闭的
* 强制使用PCIe 3.0链路速度

## DRM损坏

参考[修复DRM](https://sumingyd.github.io/OpenCore-Post-Install/universal/drm.html) 部分

## MacPro7“内存模块配置错误”

遵循这里列出的指南:

* [修复MacPro7,1内存错误](https://sumingyd.github.io/OpenCore-Post-Install/universal/memory.html)

对于那些只想禁用通知(而不是错误本身)的人来说，已经足够了。对于这些用户来说,我们建议安装 [RestrictEvents](https://github.com/acidanthera/RestrictEvents/releases)

## 应用程序在AMD上崩溃

~~容易搞定，买英特尔吧~~

所以对于AMD，每当苹果调用CPU的特定函数时，应用程序要么无法工作，要么彻底崩溃。以下是一些应用程序和它们的“修复”:

* Adobe产品并不总是工作
  * 一些修复可以在这里找到:[Adobe修复程序](https://adobe.amd-osx.com/)
  * 请注意，这些修复只是禁用功能，它们并不是真正的修复
* 运行在AppleHV框架下的虚拟机将无法工作(即:Parallels 15, VMware)
  * VirtualBox工作良好，因为它不使用AppleHV
  * VMware 10及以上版本也可以使用
  * Parallels 13.1.0及更老版本已知也可以工作
* Docker崩溃
  * Docker toolbox是唯一的解决方案，因为它基于VirtualBox，许多功能在这个版本中不可用
* IDA Pro无法安装
  * 在安装程序中有一个英特尔特定的检查，应用程序本身可能是好的
* 15/16h CPU 网页崩溃
  * 请遵循更新5后的指示:[修复网页](https://www.insanelymac.com/forum/topic/335877-amd-mojave-kernel-development-and-testing/?do=findComment&comment=2661857)

## AMD的睡眠崩溃

这在使用芯片组USB控制器的AMD上很常见，特别是Ryzen系列和更新的产品。判断是否有问题的主要方法是在睡眠或醒来后检查日志:

* 在终端中:
  * `log show --last 1d | grep -i "Wake reason"`

结果应该是这样的:

```
Sleep transition timed out after 180 seconds while calling power state change callbacks. Suspected bundle: com.apple.iokit.IOUSBHostFamily.
```

您可以通过IOReg再次检查哪个控制器是XHC0，并检查供应商ID(AMD芯片组为1022)。解决这个睡眠问题的方法是:

* 避免使用USB芯片组(理想情况下设置`_STA = 0x0`来禁用SSDT控制器)
* 将USBX电源属性纠正为控制器期望的值

## AssetCache内容缓存在虚拟机中不可用

错误如下:

```bash
$ sudo AssetCacheManagerUtil activate
AssetCacheManagerUtil[] Failed to activate content caching: Error Domain=ACSMErrorDomain Code=5 "virtual machine"...
```

由于sysctl暴露了`VMM`标志而导致。

应用[VmAssetCacheEnable](https://github.com/ofawx/VmAssetCacheEnable) 内核补丁伪装标志，允许正常操作。

## Coffee Lake 系统无法唤醒

在macOS 10.15.4中，AGPM做了一些更改，可能会在Coffee Lake系统上引起唤醒问题。特别是连接到iGPU的显示器将无法唤醒。要解决这个问题:

* 在引导参数中添加 `igfxonln=1`
* 确保您使用的是 [WhateverGreen v1.3.8](https://github.com/acidanthera/WhateverGreen/releases) 或更新版本

## 双GPU笔记本电脑上没有亮度控制

在macOS 11.3中，对背光控制机制做了一些更改，默认情况下，在启用MUX的双GPU笔记本电脑上，背光由dGPU控制。不过，Optimus只有笔记本电脑不受影响，因为无论如何你都需要禁用dGPU。具体来说，只有当你有一台双GPU笔记本电脑，内部屏幕来自iGPU输出，外部屏幕来自dGPU输出(在某些移动工作站上为`混合模式`)时，这个问题才会导致问题。要解决这个问题，可以禁用iGPU或dGPU，或者执行以下操作:

* 验证是否安装了 SSDT-PNLF(即： 在 EFI/OC/ACPI 中以及 config.plist -> ACPI -> Add)

* 添加到 `PciRoot(0x0)/Pci(0x2,0x0)`:

`@0,backlight-control | Data | 01000000`

`applbkl | Data | 01000000`

`AAPL,backlight-control | Data | 01000000`

`AAPL00,backlight-control | Data | 01000000`

* 添加以下内容到您的dGPU PCI地址:

`@0,backlight-control | Data | 00000000`

`applbkl | Data | 00000000`

`AAPL,backlight-control | Data | 00000000`

## 没有温度/风扇传感器输出

这里有几点:

* iStat Menus 还不能支持MacPro7, 1读数
* VirtualSMC捆绑的传感器不支持AMD

对于iStat，你必须等待更新。对于AMD用户，你可以使用以下两种方式:

* [SMCAMDProcessor](https://github.com/trulyspinach/SMCAMDProcessor/releases)
  * 仍然处于早期测试阶段，但是已经做了很多工作，注意它主要在Ryzen上测试
* [FakeSMC3_with_plugins](https://github.com/CloverHackyColor/FakeSMC3_with_plugins/releases)

**AMD使用FakeSMC的注意事项**:

* 支持FileVault需要使用FakeSMC进行更多工作
* 确保没有其他SMC kext存在，特别是那些来自 [VirtualSMC](https://github.com/acidanthera/VirtualSMC/releases)

## “您不能将启动磁盘更改为所选磁盘”错误

这通常是由于Windows驱动器的不规则分区设置造成的，特别是EFI不是第一个分区。要解决这个问题，我们需要启用这个功能:

* `PlatformInfo -> Generic -> AdviseFeatures -> True`

![](../../images/troubleshooting/troubleshooting-md/error.png)

## 选择启动盘不正确

如果您在启动磁盘正确应用新启动项时遇到问题，这很可能是由于I/O注册表中缺少`DevicePathsSupported`造成的。要解决这个问题，请确保您使用的是`PlatformInfo -> Automatic -> True`

缺少`DevicePathsSupported`的例子:

* [由于PciRoot不同导致默认DevicePath匹配失败#664](https://github.com/acidanthera/bugtracker/issues/664#issuecomment-663873846)

## macOS在错误的时间醒来

有些人可能会注意到一个奇怪的现象，macOS在唤醒后会有一段时间显示错误时间，然后通过网络时间检查进行自我纠正。这个问题的根本原因很可能是由于你的RTC不正常，可以通过一个新的CMOS电池解决(注意，Z270和更新的对电压是相当挑剔的，所以仔细选择)。

要验证您的RTC是否正常工作:

* 下载 [VirtualSMC v1.1.5+](https://github.com/acidanthera/virtualsmc/releases) 并运行smcread工具:

```bash
/path/to/smcread -s | grep CLKT
```

![](../../images/extras/big-sur/readme/rtc-1.png)

这将为你提供一个十六进制的值，一旦转换，它应该等于从午夜相对于Cupertino经过的时间。

因此，在本例中，我们将获取我们的值(`00010D13`)，然后将其转换为小数，最后除以3600。这将得到从午夜开始相对于Cupertino经过的大约时间(以秒为单位)

* 00010D13(转换为十六进制)-> 68883(除以3600所以我们得到小时)-> 19.13小时(所以19:07:48)

接下来，您需要让您的黑苹果休眠一会儿并唤醒它，然后再次检查CLKT值，看看它是否偏离了更多或是否有一个设置的差异。如果你发现从运行时间来看，它实际上没有发出太多信号，你需要考虑买一个新的电池(电压合适)。

## 外部显示器没有音量/亮度控制

奇怪的是，macOS已经锁定了数字音频的控制权。为了恢复一些功能，应用程序[MonitorControl](https://github.com/the0neyouseek/MonitorControl/releases)在改进macOS中的支持方面做了很多工作

## macOS 和 Windows 系统时间不一致

这是由于macOS使用通用时间，而Windows依赖格林威治时间，所以您需要迫使一个操作系统以不同的方式测量时间。我们强烈建议修改Windows，因为它的破坏性和痛苦要小得多:

* [安装Bootcamp实用程序](https://sumingyd.github.io/OpenCore-Post-Install/multiboot/bootcamp.html)
* [修改Windows注册表](https://superuser.com/q/494432)

## 禁用 SIP

SIP 或更恰当地称为系统完整性保护，是一种安全技术，试图防止任何恶意软件和最终用户破坏操作系统。SIP 最初是在 OS X El Capitan 中引入的，随着时间的推移，SIP 已经在 macOS 中控制越来越多的东西，包括将编辑限制在受限的文件位置，以及使用`kextload`加载第三方 kext (OpenCore不受影响，因为kext在启动时注入)。为了解决这个问题，苹果在 NVRAM 变量`csr-active-config`中提供了许多配置选项，可以在 macOS 恢复环境中设置，也可以在 OpenCore 的 NVRAM 部分中设置(后者将在下文讨论)。

* <span style="color:red">警告:</span> 禁用SIP会破坏操作系统功能，如macOS 11, Big Sur和更新版本的软件更新。请注意，只禁用特定的SIP值，而不是完全禁用SIP，以避免这些问题。
  * 启用`CSR_ALLOW_UNAUTHENTICATED_ROOT`和`CSR_ALLOW_APPLE_INTERNAL`是常见的选项，这些选项可能会破坏用户的操作系统更新

您可以选择不同的值来启用或禁用SIP的某些标志。一些有用的工具可以帮助你解决这些问题，[BitmaskDecode](https://github.com/corpnewt/BitmaskDecode) 和 [csrstat](https://github.com/JayBrown/csrstat-NG). 常见值如下(字节为你进行了十六进制交换，注意它们在 NVRAM -> Add -> 7C436110-AB2A-4BBB-A880-FE41995C9F82 -> csr-active-config):

* `00000000` - SIP完全启用(0x0)。
* `03000000` - 禁用kext签名(0x1)和文件系统保护(0x2)。
* `FF030000` - 禁用所有[macOS High Sierra中的标志](https://opensource.apple.com/source/xnu/xnu-4570.71.2/bsd/sys/csr.h.auto.html) (0x3ff).
* `FF070000` - 禁用所有 [macOS Mojave中的标志](https://opensource.apple.com/source/xnu/xnu-4903.270.47/bsd/sys/csr.h.auto.html) and in [macOS Catalina](https://opensource.apple.com/source/xnu/xnu-6153.81.5/bsd/sys/csr.h.auto.html) (0x7ff) 因为苹果公司为可执行策略引入了一个值。
* `FF0F0000` - 禁用macOS Big Sur (0xfff)中的所有标志，该标志具有另一个新的[身份验证root标志](https://eclecticlight.co/2020/06/25/big-surs-signed-system-volume-added-security-protection/).

**注意**:使用OpenCore禁用SIP与Clover有很大不同，特别是NVRAM变量不会被覆盖，除非在 `Delete` 部分明确告知。因此，如果您已经通过OpenCore或macOS设置了一次SIP，则必须覆盖该变量:

* `NVRAM -> Delete -> 7C436110-AB2A-4BBB-A880-FE41995C9F82 -> csr-active-config`
  
![](../../images/troubleshooting/troubleshooting-md/sip.png)

## 写入macOS系统分区

在macOS Catalina及更新版本中，苹果将操作系统和用户数据分成了两个卷，其中系统卷默认是只读的。为了使这些驱动器可写，我们需要做以下几件事:

*注意:如果系统分区被修改了，使用`SecureBootModel`的用户可能会进入RecoveryOS引导循环。要解决这个问题，请重置NVRAM并将`SecureBootModel`设置为`Disabled`

**macOS Catalina**

1. [禁用SIP](#disabling-sip)
2. 挂载驱动器可写 (在终端运行 `sudo mount -uw /`)

**macOS Big Sur**

1. [禁用SIP](#disabling-sip)
2. 将驱动器挂载为可写(参见下面的命令链接)

* *注意:由于操作系统更新在macOS Big Sur和更新的工作方式，更改系统卷实际上会破坏操作系统更新。请谨慎编辑

基于苹果KDK文档的命令:

```bash
# 首先，为您的驱动器创建一个挂载点
mkdir ~/livemount

# 接下来，找到您的系统卷
diskutil list

# 从下面的列表中，我们可以看到我们的系统卷是disk5s5
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

# 挂载驱动器(即：disk5s5)
sudo mount -o nobrowse -t apfs  /dev/disk5s5 ~/livemount

# 现在您可以自由地对系统卷进行任何编辑

# 如果你编辑了 S*/L*/Kernel, S*/L*/Extensions 或 L*/Extensions,
# 您将需要重建内核缓存
sudo kmutil install --volume-root ~/livemount --update-all

# 最后，编辑完系统卷之后，我们需要创建一个新的快照
sudo bless --folder ~/livemount/System/Library/CoreServices --bootefi --create-snapshot
```

## 回滚APFS快照

使用macOS Big Sur，现在对系统卷进行快照，以便在密封损坏导致系统更新中断的情况下进行回滚。由于每次操作系统更新都会创建新的快照，我们也有相当多的数据需要回滚。

要回滚，你首先需要重新启动到恢复分区，然后选择“从时间机器备份恢复”:

![](./../../images/troubleshooting/troubleshooting-md/snapshots.jpg)

* [Credit to Lifewire for image](https://www.lifewire.com/roll-back-apfs-snapshots-4154969)

## Apple Watch解锁问题

对于那些有 Apple Watch 解锁问题的人，请验证以下内容:

* 你有一个支持低功耗蓝牙(4.0+)的苹果无线网卡
* 你的手表和Mac是用同一个账户登录的
* iServices工作正常(例如:iMessage)
* 在系统首选项的安全和隐私设置下，有一个用Apple Watch解锁的选项

![](../../images/troubleshooting/troubleshooting-md/watch-unlock.png)

如果满足以上条件，并且你仍然有解锁问题，我们建议你查看以下指南:

* [修复自动解锁](https://forums.macrumors.com/threads/watchos-7-beta-5-unlock-mac-doesnt-work.2250819/page-2?post=28904426#post-28904426)

## HDMI上的4K iGPU输出问题

对于带有HDMI 2.0接口但存在分辨率问题的机器，请验证以下内容:

* 4k输出在Windows上可以正常工作
* 显示器显式设置为HDMI 2.0
  * 如果使用HDMI到DisplayPort转换器，请确保显示器设置为DisplayPort 1.2或更高
* 确保已分配足够的iGPU内存
  * 对于Broadwell及更新版本，预计会分配64MB内存
  * 依赖于WhateverGreen的`framebuffer-stolenmem`属性的机器应该知道，这可能会导致4k输出问题。请确保您可以将iGPU的内存设置为64MB，以允许您删除这些属性
* 笔记本电脑和许多台式机用户可能需要这个引导参数:
  * `-cdfon`

关于所有其他故障排除，请参考[WhateverGreen的英特尔文档](https://github.com/acidanthera/WhateverGreen/blob/master/Manual/FAQ.IntelHD.en.md)
