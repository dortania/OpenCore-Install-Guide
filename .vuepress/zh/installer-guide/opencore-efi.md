# 添加基础OpenCore文件

要设置OpenCore的文件夹结构，你需要抓取[OpenCorePkg的发行版](https://github.com/acidanthera/OpenCorePkg/releases/)中的EFI文件夹。注意，它们可能位于IA32或X64文件夹下，前者用于32位固件，后者用于64位固件:

![](../images/installer-guide/opencore-efi-md/ia32-x64.png)

关于DEBUG和RELEASE版本:

* **DEBUG**: 可以极大地帮助调试启动问题，但是会增加一些明显的启动时间延迟(例如:3-5秒到选择器)。安装之后，你可以轻松地过渡到RELEASE版本
* **RELEASE**: 更快的启动时间，但是在OpenCore中几乎没有提供有用的调试信息，这使得故障排除更加困难。

下载后，将EFI文件夹(来自OpenCorePkg)放在EFI分区的根目录:

![](../images/installer-guide/opencore-efi-md/efi-moved.png)

**注意**:

* **Windows用户:** 你需要将EFI文件夹放在你之前创建的USB驱动器的根目录下
* **Linux用户:** 这是我们之前创建的`OPENCORE`分区
  * 注意，方法1只创建1个分区，而方法2创建2个分区

现在让我们打开EFI文件夹，看看里面有什么:

![基础EFI文件夹](../images/installer-guide/opencore-efi-md/base-efi.png)

现在你会注意到它在`Drivers`和`Tools`文件夹中有一堆文件，其中大部分我们都不想要:

* **避免驱动程序使用以下内容**(如果适用):

| 驱动 | 状态 | 描述 |
| :--- | :--- | :--- |
| OpenUsbKbDxe.efi | <span style="color:#30BCD5"> 可选 </span> | 非uefi系统必选(2012年前) |
| OpenPartitionDxe.efi | ^^ | 引导macOS 10.7-10.9恢复需要 |
| ResetNvramEntry.efi | ^^ | 重置系统的NVRAM需要 |
| OpenRuntime.efi | <span style="color:red"> 必选 </span> | 正确操作所需 |

::: details 有关提供的驱动程序的更多信息

* AudioDxe.efi
  * 与macOS中的音频支持无关
* CrScreenshotDxe.efi
  * 在UEFI中用于截图，我们不需要
* HiiDatabase.efi
  * 用于修复GUI支持，像OpenShell.efi 在 Sandy Bridge 和更老的
  * 引导时不需要
* NvmExpressDxe.efi
  * 当固件中没有内置NVMe驱动程序时，用于Haswell和更早的版本
  * 除非你知道自己在做什么，否则不要使用
* OpenCanopy.efi
  * 这是OpenCore的可选GUI，我们将讨论如何在[安装后](https://dortania.github.io/OpenCore-Post-Install/cosmetic/gui.html) 中设置这个，所以现在删除这个
* OpenHfsPlus.efi
  * 开源的HFS Plus驱动程序，相当慢，所以我们建议不要使用，除非你知道你在做什么。
* OpenPartitionDxe.efi
  * 在OS X 10.7到10.9上启动恢复需要
    * 注意:OpenDuet用户(例如:没有UEFI)将内置这个驱动程序，不需要它
* OpenUsbKbDxe.efi
  * 这个OpenCore picker用于 **传统系统运行拾取器**, [不推荐，甚至在Ivy Bridge和更新的系统上有害](https://applelife.ru/threads/opencore-obsuzhdenie-i-ustanovka.2944066/page-176#post-856653)
* Ps2KeyboardDxe.efi + Ps2MouseDxe.efi
  * 很明显，当你需要它时，USB键盘和鼠标用户不需要它
  * 提醒: PS2 ≠ USB
* ResetNvramEntry.efi
  * 允许从启动选择器重置NVRAM
* UsbMouseDxe.efi
  * 与OpenUsbKbDxe类似的想法，应该只需要在使用DuetPkg的传统系统上
* XhciDxe.efi
  * 当固件中没有XHCI驱动程序时，用于Sandy Bridge和更老的
  * 只有在旧机器上使用USB 3.0扩展卡时才需要

:::

* **避免使用以下工具:**

| 工具 | 状态 | 说明 |
| :--- | :--- | :--- |
| OpenShell.efi | <span style="color:#30BCD5"> 可选 </span> | 推荐使用，便于调试 |

清理后的EFI:

![清洁EFI](../images/installer-guide/opencore-efi-md/clean-efi.png)

现在你可以将**你的**必要的固件驱动程序(.efi)放在_Drivers_文件夹中，将kext /ACPI放在它们各自的文件夹中。有关应该使用哪些文件的更多信息，请参阅[收集文件](../ktext.md)

* 请注意，来自Clover的UEFI驱动程序不支持OpenCore!(EmuVariableUEFI, AptioMemoryFix, OsxAptioFixDrv,等). 请参阅 [Clover固件驱动程序转换](https://github.com/sumingyd/OpenCore-Install-Guide/blob/master/clover-conversion/clover-efi.md) 了解更多支持的驱动程序和合并到OpenCore的驱动程序。

下面是填充过的EFI **_可能_** 的样子(你的可能会不同):

![填充EFI文件夹](../images/installer-guide/opencore-efi-md/populated-efi.png)

**提醒**:

* 将ssdt和自定义dsdt (`.aml`)放入ACPI文件夹
* kext (`.kext`)放入Kexts文件夹
* 将固件驱动程序(`.efi`)放在drivers文件夹中

# 现在，所有这些都完成了，前往[收集文件](../ktext.md) 获得所需的kext和固件驱动程序
