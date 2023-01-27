# config.plist 设置

现在我们有了所有的kext (.kext)、ssdt (.aml)和固件驱动程序(.efi)，你的USB应该开始看起来像这样:

![Populated EFI folder](../images/installer-guide/opencore-efi-md/populated-efi.png)

* **注意**: 你的USB **看起来会不同** ，每个人的系统都会有不同的需求。

## 创建你的 config.plist

首先，我们要获取 `Sample.plist` ，在 [OpenCorePkg](https://github.com/acidanthera/OpenCorePkg/releases), 的 `Docs` 文件夹下:

![](../images/config/config-universal/sample-location.png)

接下来让我们将它移动到USB的EFI分区(在Windows上称为BOOT)下的`EFI/OC/`，并将其重命名为config.plist:

![](../images/config/config-universal/renamed.png)

## 添加你的ssdt、kext和固件驱动程序

对于本指南的其余部分，你需要某种形式的plist编辑。对于我们的指南，我们将使用ProperTree和GenSMBIOS来帮助自动化一些乏味的工作:

* [ProperTree](https://github.com/corpnewt/ProperTree)
  * 通用plist编辑器
* [GenSMBIOS](https://github.com/corpnewt/GenSMBIOS)
  * 用于生成SMBIOS数据

接下来，让我们打开ProperTree并编辑我们的config.plist:

* `ProperTree.command`
  * 适用于macOS
  * 专业提示:在 `Scripts` 文件夹中有一个 `buildapp.command` 实用程序，可以让你在macOS中将ProperTree转换为专用应用程序
* `ProperTree.bat`
  * 适用于Windows

在运行ProperTree之后，打开您的配置。通过按 **Cmd/Ctrl + O** 并选择 `config.plist` ，文件在你的USB上。

在配置打开后，按 **Cmd/Ctrl + Shift + R** ，并将其指向你的EFI/OC文件夹来执行“清洁快照”:

* 这将从 config.plist 中删除所有条目，然后将所有ssdt、kext和固件驱动添加到配置中
* **Cmd/Ctrl + R** 是另一个选项，它也会添加你所有的文件，但如果它们之前设置过，则会禁用它们，这对你进行故障排除很有用，但对我们来说现在不需要

![](../images/config/config-universal/before-snapshot.png)

完成后，你会看到配置文件config.plist中填充了你的ssdt、kext和固件驱动:

![](../images/config/config-universal/after-snapshot.png)

* **注意:** 如果弹出 “Disable the following kext with Duplicate CFBundleIdentifiers?” ，按 “Yes” 。这是为了确保你没有重复的kext被注入，因为一些kext可能有一些相同的插件(例如：VoodooInput 在 VoodooPS2 和 VoodooI2C 的插件文件夹中)

![](../images/config/config-universal/duplicate.png)

如果你想稍微清理一下文件，可以删除 `#WARNING` 条目。虽然他们在那里不会造成任何问题，所以取决于个人喜好。

::: danger
config.plist **必须** 与EFI文件夹的内容匹配。如果您删除了一个文件，但将其保留在 Config.plist, OpenCore将出错并停止启动。

如果你做了任何修改，你可以在ProperTree中使用OC快照工具(**Cmd/Ctrl + R**)来更新config.plist。
:::

## 选择你的平台

接下来是重要的部分，选择配置路径。每个平台都有自己独特的特点，所以了解硬件非常重要。看看下面要做什么:

### Intel 台式电脑

* *注意:英特尔的NUC系列被认为是移动硬件，对于这些情况，我们建议遵循[Intel 笔记本电脑部分](#intel-laptop)

| 代号 | 序号 | 发布年代 |
| :--- | :--- | :--- |
| [Yonah, Conroe and Penryn](../config.plist/penryn.md) | E8XXX, Q9XXX, [etc 1](https://en.wikipedia.org/wiki/Yonah_(microprocessor)), [etc 2](https://en.wikipedia.org/wiki/Penryn_(microarchitecture)) | 2006-2009 年代 |
| [Lynnfield and Clarkdale](../config.plist/clarkdale.md) | 5XX-8XX | 2010 年代 |
| [Sandy Bridge](../config.plist/sandy-bridge.md) | 2XXX | 2011 年代 |
| [Ivy Bridge](../config.plist/ivy-bridge.md) | 3XXX | 2012 年代 |
| [Haswell](../config.plist/haswell.md) | 4XXX | 2013-2014 年代 |
| [Skylake](../config.plist/skylake.md) | 6XXX | 2015-2016 年代 |
| [Kaby Lake](../config.plist/kaby-lake.md) | 7XXX | 2017 年代 |
| [Coffee Lake](../config.plist/coffee-lake.md) | 8XXX-9XXX | 2017-2019 年代 |
| [Comet Lake](../config.plist/comet-lake.md) | 10XXX | 2020 年代 |

### Intel 笔记本电脑

| 代号 | 序号 | 发布年代 |
| :--- | :--- | :--- |
| [Clarksfield and Arrandale](../config-laptop.plist/arrandale.md) | 3XX-9XX | 2010 年代 |
| [Sandy Bridge](../config-laptop.plist/sandy-bridge.md) | 2XXX | 2011 年代 |
| [Ivy Bridge](../config-laptop.plist/ivy-bridge.md) | 3XXX | 2012 年代 |
| [Haswell](../config-laptop.plist/haswell.md) | 4XXX | 2013-2014 年代 |
| [Broadwell](../config-laptop.plist/broadwell.md) | 5XXX | 2014-2015 年代 |
| [Skylake](../config-laptop.plist/skylake.md) | 6XXX | 2015-2016 年代 |
| [Kaby Lake and Amber Lake](../config-laptop.plist/kaby-lake.md) | 7XXX | 2017 年代 |
| [Coffee Lake and Whiskey Lake](../config-laptop.plist/coffee-lake.md) | 8XXX | 2017-2018 年代 |
| [Coffee Lake Plus and Comet Lake](../config-laptop.plist/coffee-lake-plus.md) | 9XXX-10XXX | 2019-2020 年代 |
| [Ice Lake](../config-laptop.plist/icelake.md) | 10XXX | 2019-2020 年代 |

### Intel HEDT

本节包括发烧友和基于服务器的硬件。

| 代号 | 序号 | 发布年代 |
| :--- | :--- | :--- |
| [Nehalem and Westmere](../config-HEDT/nehalem.md) | 9XX, X3XXX, X5XXX, [etc 1](https://en.wikipedia.org/wiki/Nehalem_(microarchitecture)), [2](https://en.wikipedia.org/wiki/Westmere_(microarchitecture)) | 2008-2010 年代 |
| [Sandy/Ivy Bridge-E](../config-HEDT/ivy-bridge-e.md) | 3XXX, 4XXX | 2011-2013 年代 |
| [Haswell-E](../config-HEDT/haswell-e.md) | 5XXX | 2014 年代 |
| [Broadwell-E](../config-HEDT/broadwell-e.md) | 6XXX | 2016 年代 |
| [Skylake/Cascade Lake-X/W](../config-HEDT/skylake-x.md) | 7XXX, 9XXX, 10XXX | 2017-2019 年代 |

### AMD

| 代号 | 序号 | 发布年代 |
| :--- | :--- | :--- |
| [Bulldozer/Jaguar](../AMD/fx.md) | [It's weird](https://en.wikipedia.org/wiki/List_of_AMD_processors#Bulldozer_architecture;_Bulldozer,_Piledriver,_Steamroller,_Excavator_(2011%E2%80%932017)) | [AMD was really bad with naming back then](https://en.wikipedia.org/wiki/List_of_AMD_processors#Bulldozer_architecture;_Bulldozer,_Piledriver,_Steamroller,_Excavator_(2011%E2%80%932017)) |
| [Zen](../AMD/zen.md) | 1XXX, 2XXX, 3XXX, 5XXX | 2017-2020 年代 |

* 注意:~~Threadripper第三代(39XX)不支持，但是支持第一代和第二代~~
  * 最新的BIOS和OpenCore版本已经解决了这个问题，现在支持所有的Threadripper平台
