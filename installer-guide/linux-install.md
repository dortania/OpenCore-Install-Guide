# Making the installer in Linux

* Supported version: 0.6.5

While you don't need a fresh install of macOS to use OpenCore, some users prefer having a fresh slate with their boot manager upgrades.

To start you'll need the following:

* 4GB USB Stick
* [macrecovery.py](https://github.com/acidanthera/OpenCorePkg/releases)
  
## Downloading macOS

Now to start, first cd into [macrecovery's folder](https://github.com/acidanthera/OpenCorePkg/releases) and run one of the following commands:

![](../images/installer-guide/legacy-mac-install-md/macrecovery.png)

```sh
# Adjust below command to the correct folder
cd ~/Downloads/OpenCore-0/Utilities/macrecovery/
```

Next, run one of the following commands depending on the OS you'd like to boot:

```sh
# Lion(10.7):
python ./macrecovery.py -b Mac-2E6FAB96566FE58C -m 00000000000F25Y00 download
python ./macrecovery.py -b Mac-C3EC7CD22292981F -m 00000000000F0HM00 download

# Mountain Lion(10.8):
python ./macrecovery.py -b Mac-7DF2A3B5E5D671ED -m 00000000000F65100 download

# Mavericks(10.9):
python ./macrecovery.py -b Mac-F60DEB81FF30ACF6 -m 00000000000FNN100 download

# Yosemite(10.10):
python ./macrecovery.py -b Mac-E43C1C25D4880AD6 -m 00000000000GDVW00 download

# El Capitan(10.11):
python ./macrecovery.py -b Mac-FFE5EF870D7BA81A -m 00000000000GQRX00 download

# Sierra(10.12):
python ./macrecovery.py -b Mac-77F17D7DA9285301 -m 00000000000J0DX00 download

# High Sierra(10.13)
python ./macrecovery.py -b Mac-7BA5B2D9E42DDD94 -m 00000000000J80300 download
python ./macrecovery.py -b Mac-BE088AF8C5EB4FA2 -m 00000000000J80300 download

# Mojave(10.14)
python ./macrecovery.py -b Mac-7BA5B2DFE22DDD8C -m 00000000000KXPG00 download

# Catalina(10.15)
python ./macrecovery.py -b Mac-00BE6ED71E35EB86 -m 00000000000000000 download

# Latest version
# ie. Big Sur(11)
python ./macrecovery.py -b Mac-E43C1C25D4880AD6 -m 00000000000000000 download

# Note, Apple has temporarily removed Big Sur from the Recovery Catalog
# Expect Apple to resolve this sometime after the holidays
```

From here, run one of those commands in terminal and once finished you'll get an output similar to this:

![](../images/installer-guide/legacy-mac-install-md/download-done.png)

* **Note**: Depending on the OS, you'll either get BaseSystem or RecoveryImage files. They both act in the same manner so when we reference BaseSystem the same info apples to RecoveryImage

* **macOS 11, Big Sur Note**: As this OS is quite new, there's still some issues with certain systems to resolve. For more information, see here: [OpenCore and macOS 11: Big Sur](../extras/big-sur/README.md)
  * For first time users, we recommend macOS 10.15, Catalina
* **Nvidia GPU Note**: Reminder to verify whether your hardware support newer OSes, see [Hardware Limitations](../macos-limits.md)

## Making the installer

This section will target making the necessary partitions in the USB device. You can use your favorite program be it `gdisk` `fdisk` `parted` `gparted` or `gnome-disks`. This guide will focus on `gdisk` as it's nice and can change the partition type later on, as we need it so that macOS Recovery HD can boot. (the distro used here is Ubuntu 18.04, other versions or distros may work)

Credit to [midi1996](https://github.com/midi1996) for his work on the [Internet Install Guide](https://midi1996.github.io/hackintosh-internet-install-gitbook/) guide which this is based off of.

### Method 1

In terminal:

1. run `lsblk` and determine your USB device block
  ![lsblk](../images/installer-guide/linux-install-md/unknown-5.png)
2. run `sudo gdisk /dev/<your USB block>`
   1. if you're asked what partition table to use, select GPT.
      ![Select GPT](../images/installer-guide/linux-install-md/unknown-6.png)
   2. send `p` to print your block's partitions \(and verify it's the one needed\)
      ![](../images/installer-guide/linux-install-md/unknown-13.png)
   3. send `o` to clear the partition table and make a new GPT one (if not empty)
      1. confirm with `y`
         ![](../images/installer-guide/linux-install-md/unknown-8.png)
   4. send `n`
      1. `partition number`: keep blank for default
      2. `first sector`: keep blank for default
      3. `last sector`: keep blank for whole disk
      4. `Hex code or GUID`: `0700` for Microsoft basic data partition type
   5. send `w`
      * Confirm with `y`
      ![](../images/installer-guide/linux-install-md/unknown-9.png)
      * In some cases a reboot is needed, but rarely, if you want to be sure, reboot your computer. You can also try re-plugging your USB key.
   6. Close `gdisk` by sending `q` (normally it should quit on its own)
3. Use `lsblk` to determine your partition's identifiers
4. run `sudo mkfs.vfat -F 32 -n "OPENCORE" /dev/<your USB partition block>` to format your USB to FAT32 and named OPENCORE
5. then `cd` to `/OpenCore/Utilities/macrecovery/` and you should get to a `.dmg` and `.chunklist` files
   1. mount your USB partition with `udisksctl` (`udisksctl mount -b /dev/<your USB partition block>`, no sudo required in most cases) or with `mount` (`sudo mount /dev/<your USB partition block> /where/your/mount/stuff`, sudo is required)
   2. `cd` to your USB drive and `mkdir com.apple.recovery.boot` in the root of your FAT32 USB partition
   3. now `cp` or `rsync` both `BaseSystem.dmg` and `BaseSystem.chunklist` into `com.apple.recovery.boot` folder.

### Method 2 (in case 1 didn't work)

In terminal:

1. run `lsblk` and determine your USB device block
   ![](../images/installer-guide/linux-install-md/unknown-11.png)
2. run `sudo gdisk /dev/<your USB block>`
   1. if you're asked what partition table to use, select GPT.
      ![](../images/installer-guide/linux-install-md/unknown-12.png)
   2. send `p` to print your block's partitions \(and verify it's the one needed\)
      ![](../images/installer-guide/linux-install-md/unknown-13.png)
   3. send `o` to clear the partition table and make a new GPT one (if not empty)
      1. confirm with `y`
         ![](../images/installer-guide/linux-install-md/unknown-14.png)
   4. send `n`
      1. partition number: keep blank for default
      2. first sector: keep blank for default
      3. last sector: `+200M` to create a 200MB partition that will be named later on OPENCORE
      4. Hex code or GUID: `0700` for Microsoft basic data partition type
      ![](../images/installer-guide/linux-install-md/unknown-15.png)
   5. send `n`
      1. partition number: keep blank for default
      2. first sector: keep blank for default
      3. last sector: keep black for default \(or you can make it `+3G` if you want to partition further the rest of the USB\)
      4. Hex code or GUID: `af00` for Apple HFS/HFS+ partition type
      ![](../images/installer-guide/linux-install-md/unknown-16.png)
   6. send `w`
      * Confirm with `y`
      ![](../images/installer-guide/linux-install-md/unknown-17.png)
      * In some cases a reboot is needed, but rarely, if you want to be sure, reboot your computer. You can also try re-plugging your USB key.
   7. Close `gdisk` by sending `q` (normally it should quit on its own)
3. Use `lsblk` again to determine the 200MB drive and the other partition
   ![](../images/installer-guide/linux-install-md/unknown-18.png)
4. run `sudo mkfs.vfat -F 32 -n "OPENCORE" /dev/<your 200MB partition block>` to format the 200MB partition to FAT32, named OPENCORE
5. then `cd` to `/OpenCore/Utilities/macrecovery/` and you should get to a `.dmg` and `.chunklist` files
   1. mount your USB partition with `udisksctl` (`udisksctl mount -b /dev/<your USB partition block>`, no sudo required in most cases) or with `mount` (`sudo mount /dev/<your USB partition block> /where/your/mount/stuff`, sudo is required)
   2. `cd` to your USB drive and `mkdir com.apple.recovery.boot` in the root of your FAT32 USB partition
   3. download `dmg2img` (available on most distros)
   4. run `dmg2img -l BaseSystem.dmg` and determine which partition has `disk image` property
      ![](../images/installer-guide/linux-install-md/unknown-20.png)
   5. run `dmg2img -p <the partition number> -i BaseSystem.dmg -o <your 3GB+ partition block>` to extract and write the recovery image to the partition disk
      * It will take some time. A LOT if you're using a slow USB (took me about less than 5 minutes with a fast USB2.0 drive).
      ![](../images/installer-guide/linux-install-md/unknown-21.png)

## Now with all this done, head to [Setting up the EFI](./opencore-efi.md) to finish up your work
