# 在 Linux 中制作安装程序

虽然你不需要重新安装macOS来使用OpenCore，但一些用户更喜欢使用全新的引导管理器升级。

开始之前，你需要准备以下内容:

* 4GB U盘
* [macrecovery.py](https://github.com/acidanthera/OpenCorePkg/releases)
  
## 下载macOS

现在开始，首先 cd 到[macrecovery 的文件夹](https://github.com/acidanthera/OpenCorePkg/releases) 并运行以下命令之一:

![](../images/installer-guide/legacy-mac-install-md/macrecovery.png)

```sh
# Adjust below command to the correct folder
cd ~/Downloads/OpenCore-0/Utilities/macrecovery/
```

接下来，根据要启动的操作系统运行以下命令之一:

```sh
# Lion (10.7):
python3 ./macrecovery.py -b Mac-2E6FAB96566FE58C -m 00000000000F25Y00 download
python3 ./macrecovery.py -b Mac-C3EC7CD22292981F -m 00000000000F0HM00 download

# Mountain Lion (10.8):
python3 ./macrecovery.py -b Mac-7DF2A3B5E5D671ED -m 00000000000F65100 download

# Mavericks (10.9):
python3 ./macrecovery.py -b Mac-F60DEB81FF30ACF6 -m 00000000000FNN100 download

# Yosemite (10.10):
python3 ./macrecovery.py -b Mac-E43C1C25D4880AD6 -m 00000000000GDVW00 download

# El Capitan (10.11):
python3 ./macrecovery.py -b Mac-FFE5EF870D7BA81A -m 00000000000GQRX00 download

# Sierra (10.12):
python3 ./macrecovery.py -b Mac-77F17D7DA9285301 -m 00000000000J0DX00 download

# High Sierra (10.13)
python3 ./macrecovery.py -b Mac-7BA5B2D9E42DDD94 -m 00000000000J80300 download
python3 ./macrecovery.py -b Mac-BE088AF8C5EB4FA2 -m 00000000000J80300 download

# Mojave (10.14)
python3 ./macrecovery.py -b Mac-7BA5B2DFE22DDD8C -m 00000000000KXPG00 download

# Catalina (10.15)
python3 ./macrecovery.py -b Mac-00BE6ED71E35EB86 -m 00000000000000000 download

# Big Sur (11)
python3 ./macrecovery.py -b Mac-42FD25EABCABB274 -m 00000000000000000 download

# Monterey (12)
python3 ./macrecovery.py -b Mac-FFE5EF870D7BA81A -m 00000000000000000 download

# Latest version
# ie. Ventura (13)
python3 ./macrecovery.py -b Mac-4B682C642B45593E -m 00000000000000000 download
```

现在，在终端中运行其中一个命令，完成后你将得到类似于下面的输出:

![](../images/installer-guide/legacy-mac-install-md/download-done.png)

* **注意**: 根据操作系统的不同，您将获得 BaseSystem 或 RecoveryImage 文件。它们以相同的方式工作，所以当我们引用 BaseSystem 时，相同的信息适用于 RecoveryImage

* **macOS 12及以上版本注意**: 由于最新macOS版本引入了USB堆栈的更改，在安装macOS之前，强烈建议您映射USB端口(使用USBToolBox)。
  * <span style="color:red"> 注意: </span> 在macOS 11.3及更新版本中，[XhciPortLimit被破坏导致启动循环](https://github.com/dortania/bugtracker/issues/162).
    * 如果你已经[映射了你的USB端口](https://dortania.github.io/OpenCore-Post-Install/usb/) 并且禁用了 `XhciPortLimit` ，那么你可以正常启动macOS 11.3+。

## 制作安装程序

本节的目标是在USB设备中创建必要的分区。你可以使用你最喜欢的程序，比如`gdisk` `fdisk` `parted` `gparted` 或 `gnome-disks`。本指南将重点介绍 `gdisk` ，因为它很好，可以在稍后更改分区类型，因为我们需要它来引导 macOS Recovery HD。(这里使用的发行版是Ubuntu 18.04，其他版本或发行版也可以)

感谢 [midi1996](https://github.com/midi1996) 为 [Internet安装指南](https://midi1996.github.io/hackintosh-internet-install-gitbook/) 所做的工作。

### 方法 1

在终端:

1. 运行 `lsblk` 并确定你的USB设备块
  ![lsblk](../images/installer-guide/linux-install-md/unknown-5.png)
2. 运行 `sudo gdisk /dev/<你的USB块>`
   1. 如果您被问及使用什么分区表，选择GPT。
      ![Select GPT](../images/installer-guide/linux-install-md/unknown-6.png)
   2. 发送 `p` 来打印你的区块的分区\(并验证它是否是需要的分区\)
      ![](../images/installer-guide/linux-install-md/unknown-13.png)
   3. 发送 `o` 来清除分区表，并创建一个新的GPT表(如果不是空的)
      1. 用 `y` 确认
         ![](../images/installer-guide/linux-install-md/unknown-8.png)
   4. 发送 `n`
      1. `partition number`: 默认为空
      2. `first sector`: 默认为空
      3. `last sector`: 整个磁盘保持空白
      4. `Hex code or GUID`: `0700` 用于Microsoft基本数据分区类型
   5. 发送 `w`
      * 用 `y` 确认
      ![](../images/installer-guide/linux-install-md/unknown-9.png)
      * 在某些情况下需要重启电脑，但如果你想确定的话，很少会重启电脑。你也可以尝试重新插入你的u盘。
   6. 通过发送 `q` 来关闭 `gdisk` (通常它应该自己退出)
3. 使用 `lsblk` 来确定分区的标识符
4. 运行 `sudo mkfs.vfat -F 32 -n "OPENCORE" /dev/<你的USB分区块>` 格式化USB到FAT32并命名为OPENCORE
5. 然后 `cd` 到 `/OpenCore/Utilities/macrecovery/` 你应该得到一个 `.dmg` 和 `.chunklist` 文件
   1. 挂载您的USB分区 `udisksctl` (`udisksctl mount -b /dev/<你的USB分区块>`, 在大多数情况下不需要sudo) 或者 `mount` (`sudo mount /dev/<你的USB分区块> /where/your/mount/stuff`, sudo是必需的)
   2. `cd` 到你的USB驱动器和 `mkdir com.apple.recovery.boot` 在FAT32 USB分区的根目录下
   3. 现在 `cp` 或者 `rsync` 将 `BaseSystem.dmg` 和 `BaseSystem.chunklist` 放入 `com.apple.recovery.boot` 文件夹.

### 方法 2 (在情况1无效的情况下)

在终端:

1. 运行 `lsblk` 并确定您的USB设备块
   ![](../images/installer-guide/linux-install-md/unknown-11.png)
2. 运行 `sudo gdisk /dev/<你的USB块>`
   1. 如果询问使用什么分区表，选择GPT。
      ![](../images/installer-guide/linux-install-md/unknown-12.png)
   2. 发送 `p` 来打印你的区块的分区\(并验证它是否是需要的分区\)
      ![](../images/installer-guide/linux-install-md/unknown-13.png)
   3. 发送 `o` 来清除分区表，并创建一个新的GPT表(如果不是空的)
      1. 用 `y` 确认
         ![](../images/installer-guide/linux-install-md/unknown-14.png)
   4. 发送 `n`
      1. partition number: 默认为空
      2. first sector: 默认为空
      3. last sector:`+200M`来创建一个200MB的分区，稍后将在OPENCORE上命名
      4. Hex code or GUID: `0700` 用于Microsoft基本数据分区类型
      ![](../images/installer-guide/linux-install-md/unknown-15.png)
   5. 发送 `n`
      1. partition number: 默认为空
      2. first sector: 默认为空
      3. last sector: 保持默认 \(或者如果你想进一步划分USB的其余部分，可以将其设为“+3G”\)
      4. Hex code or GUID: `af00` 为苹果HFS/HFS+分区类型
      ![](../images/installer-guide/linux-install-md/unknown-16.png)
   6. 发送 `w`
      * 用 `y` 确认
      ![](../images/installer-guide/linux-install-md/unknown-17.png)
      * 在某些情况下需要重启电脑，但如果你想确定的话，很少会重启电脑。你也可以尝试重新插入你的u盘。
   7. 通过发送 `q` 来关闭 `gdisk` (通常它应该自己退出)
3. 再次使用 `lsblk` 来确定200MB驱动器和其他分区
   ![](../images/installer-guide/linux-install-md/unknown-18.png)
4. 运行 `sudo mkfs.vfat -F 32 -n "OPENCORE" /dev/<你的 200MB 分区块>` 将200MB分区格式化为FAT32，命名为OPENCORE
5. 然后 `cd` 到 `/OpenCore/Utilities/macrecovery/` 你应该得到一个 `.dmg` 和 `.chunklist` 文件
   1. 挂载你的USB分区 `udisksctl` (`udisksctl mount -b /dev/<你的 200MB 分区块>`, 大多数情况下不需要sudo) 或用 `mount` (`sudo mount /dev/<你的 200MB 分区块> /where/your/mount/stuff`, sudo是必需的)
   2. `cd` 到你的U盘和 `mkdir com.apple.recovery.boot` 在你的FAT32 USB分区根
   3. 下载 `dmg2img` (在大多数发行版上可用)
   4. 运行 `dmg2img -l BaseSystem.dmg` 并确定哪个分区具有 `disk image` 属性
      ![](../images/installer-guide/linux-install-md/unknown-20.png)
   5. 运行 `sudo dmg2img -p <the partition number> BaseSystem.dmg /dev/<你的 3GB+ 分区块>` 来提取恢复映像并将其写入分区磁盘
      * 这需要一些时间。如果你用的是速度较慢的USB(我用一个速度较快的USB2.0驱动器只花了不到5分钟)。
      ![](../images/installer-guide/linux-install-md/unknown-21.png)

## 现在所有这些都完成了，前往[设置EFI](./opencore-efi.md) 来完成你的工作
