# 杂项问题

与macOS本身无关的杂项问题，例如多引导。

[[toc]]

## 无法运行`acpidump.efi`

调用OpenCore shell:

```
shell> fs0: //替换正确的驱动器

fs0:\> dir //验证这是正确的目录

  Directory of fs0:\

   01/01/01 3:30p  EFI
fs0:\> cd EFI\OC\Tools //注意它带有正向斜杠

fs0:\EFI\OC\Tools> acpidump.efi -b -n DSDT -z
```

## 修复SSDTTime: `无法定位或下载iasl`

这通常是由于过时的Python版本，请尝试更新Python或将iasl添加到SSDTTime的scripts文件夹:

* [iasl macOS 版本](https://bitbucket.org/RehabMan/acpica/downloads/iasl.zip)
* [iasl Windows 版本](https://acpica.org/downloads/binary-tools)
* [iasl Linux 版本](http://amdosx.kellynet.nl/iasl.zip)

## 修复Python: `Python未安装或在路径中未找到`

简单修复，下载并安装最新的python:

* [macOS 链接](https://www.python.org/downloads/macos)
* [Windows 链接](https://www.python.org/downloads/windows/)
* [Linux 链接](https://www.python.org/downloads/source/)

确保 `将Python添加到PATH`

![](../../images/troubleshooting/troubleshooting-md/python-path.png)

## Windows启动盘看不到APFS驱动器

* 过时的BootCamp驱动程序(通常6.0版本将附带brigadier, macOS中的BootCamp Utility提供较新的版本，如6.1版本)。 CorpNewt 的分支 brigadier 修复了这个问题: [CorpNewt 的 brigadier分支](https://github.com/corpnewt/brigadier)

## OpenCore分辨率不正确

* 按照[修复分辨率和详细](https://sumingyd.github.io/OpenCore-Post-Install/cosmetic/verbose.html)的正确设置，设置 `UIScale` 为 `2` 的HiDPI
* 用户还注意到，将`ConsoleMode`设置为Max有时会失败，让它为空可能会有所帮助

## 在选择器中找不到Windows/BootCamp驱动器

因此，有了OpenCore，我们必须注意，不支持传统的Windows安装，只支持UEFI。现在大多数安装都是基于UEFI的，但是BootCamp Assistant制作的是基于传统的，所以你必须找到其他方法来制作安装程序(谷歌是你的朋友)。这也意味着MasterBootRecord/Hybrid分区也被破坏了，所以你需要格式化你想安装到DiskUtility的驱动器。有关最佳实践，请参阅[多引导指南](https://sumingyd.github.io/OpenCore-Multiboot/) on best practices

现在开始进行故障排除:

* 确保将`Misc -> Security -> ScanPolicy`设置为`0`以显示所有驱动器
* 当Windows引导装载程序位于同一驱动器上时，启用`Misc -> Boot -> Hideself`

## 没有正确地选择启动磁盘

如果您在启动磁盘正确应用新启动项时遇到问题，这很可能是由于I/O注册表中缺少`DevicePathsSupported`造成的。要解决这个问题，请确保您使用的是`PlatformInfo -> Automatic -> True`

缺少`DevicePathsSupported`的例子:

* [由于PciRoot不同导致默认DevicePath匹配失败#664](https://github.com/acidanthera/bugtracker/issues/664#issuecomment-663873846)

## 启动Windows会导致蓝屏或Linux崩溃

这是由于对齐问题，请确保在支持MATs的固件上启用了`SyncRuntimePermissions`。检查你的日志，你的固件是否支持内存属性表(通常在2018年或更新的固件上看到)

常见的Windows错误代码:

* `0xc000000d`

## 启动Windows错误: `OCB: StartImage failed - Already started`

这是由于OpenCore在尝试引导Windows时感到困惑，并意外地认为它正在引导OpenCore。这可以通过移动Windows到它自己的驱动器*或*在BlessOverride下添加一个自定义驱动器路径来避免。更多细节请参阅[Configuration.pdf](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/Configuration.pdf)

## iASL警告，只有X未解决

如果你尝试反编译你的DSDT并得到一个类似这样的错误:

```
iASL Warning: There were 19 external control methods found during disassembly, but only 0 were resolved (19 unresolved)
```

当一个ACPI表需要其他表来进行适当的引用时，就会发生这种情况，它不接受dsdt的创建，因为我们只使用它来创建选定的几个ssdt。对于那些担心的人，你可以运行以下命令:

```
iasl * [insert all ACPI files here]
```

## macOS和Windows之间的时间不一致

这是因为macOS使用通用时间，而Windows依赖于格林威治时间，所以你需要强制一个操作系统使用不同的时间测量方式。我们强烈建议修改Windows，因为它的破坏性和痛苦要小得多:

* [安装Bootcamp实用程序](https://sumingyd.github.io/OpenCore-Post-Install/multiboot/bootcamp.html)
* [修改Windows注册表](https://superuser.com/q/494432)
