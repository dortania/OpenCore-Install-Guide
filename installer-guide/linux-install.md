# Making the installer in Linux

* Supported version: 0.5.7



While you don't need a fresh install of macOS to use OpenCore, some users prefer having a fresh slate with their boot manager upgrades.

To start you'll need the following:
* 4GB USB Stick
* [GibMacOS](https://github.com/corpnewt/gibMacOS)

## Downloading macOS

Now to start, run gibmacOS.py in terminal with `Toggle Recovery-Only`:

* `python gibMacOS.command -r`

Now search through for your desired version of macOS, for this example we'll choose option 5 for macOS Catalina:

![](https://cdn.discordapp.com/attachments/683011276938543134/688850725337563158/Screen_Shot_2020-03-15_at_2.46.39_PM.png)

This will download the RecoveryHDMetaDmg.pkg to `\gibmacos-master\macOS Downloads\publicrelease\xxx-xxxxx - 10.x.x macOS xxx`

![](https://cdn.discordapp.com/attachments/683011276938543134/688851283855409194/Screen_Shot_2020-03-15_at_2.48.54_PM.png)

## Making the installer

This section will target making the necessary partitions in the USB device. You can use your favorite program be it `gdisk` `fdisk` `parted` `gparted` or `gnome-disks`. This guide will focus on `gdisk` as it's nice and can change the partition type later on, as we need it so that macOS Recovery HD can boot. (the distro used here is Ubuntu 18.04, other versions or distros may work)

Credit to [midi1996](https://github.com/midi1996) for his work on the [hackintosh-internet-install-gitbook](https://midi1996.github.io/hackintosh-internet-install-gitbook/) guide which this is based off of.

### Method 1

In terminal:

1. run `lsblk` and determine your USB device block
   ![](https://media.discordapp.net/attachments/580631240991047701/688920468220280842/unknown.png)
2. run `sudo gdisk /dev/<your USB block>`
   0. if you're asked what partition table to use, select GPT.
      ![](https://media.discordapp.net/attachments/580631240991047701/688920849771659265/unknown.png)
   1. send `p` to print your block's partitions \(and verify it's the one needed\)
      ![](https://media.discordapp.net/attachments/580631240991047701/688921334775939093/unknown.png)
   2. send `o` to clear the partition table and make a new GPT one (if not empty)
      1. confirm with `y`
         ![](https://media.discordapp.net/attachments/580631240991047701/688921581032046659/unknown.png)
   3. send `n`
      1. `partition number`: keep blank for default
      2. `first sector`: keep blank for default
      3. `last sector`: keep blank for whole disk
      4. `Hex code or GUID`: `0700` for Microsoft basic data partition type
   4. send `w`
      * Confirm with `y`
      ![](https://media.discordapp.net/attachments/580631240991047701/688922153835692052/unknown.png)
      * In some cases a reboot is needed, but rarely, if you want to be sure, reboot your computer. You can also try re-plugging your USB key.
   6. Close `gdisk` by sending `q` (normally it should quit on its own)
3. Use `lsblk` to determin your partition's identifiers
4. run `sudo mkfs.vfat -F 32 -n "OPENCORE" /dev/<your USB partition block>` to format your USB to FAT32 and named OPENCORE
5. then `cd` to `gibmacos-master/macOS\ Downloads/publicrelease/xxx-xxxxx - 10.x.x macOS xxx` and you should get to a `pkg` file
   ![](https://media.discordapp.net/attachments/580631240991047701/688923503202009227/unknown.png)
   1. download `p7zip-full` \(depending on your distro tools\)
      * for ubuntu/ubuntu-based run `sudo apt install p7zip-full`
      * for arch/arch-based run `sudo pacman -S p7zip`
      * for the rest of you, you should know
      * for all distros: **make sure you're using bash for 7zip to work**.
   2. run this `7z e -txar *.pkg *.dmg; 7z e *.dmg */Base*` to extract `BaseSystem.dmg` and `BaseSystem.chunklist`
   3. mount your USB partition with `udisksctl` (`udisksctl mount -b /dev/<your USB partition block>`, no sudo required in most cases) or with `mount` (`sudo mount /dev/<your USB partition block> /where/your/mount/stuff`, sudo is required)
   4. `cd` to your usb driver and `mkdir com.apple.recovery.boot` in the root of your FAT32 USB partition
   5. now `cp` or `rsync` both `BaseSystem.dmg` and `BaseSystem.chunklist` into `com.apple.recovery.boot` folder.

### Method 2 (in case 1 didn't work)

In terminal:

1. run `lsblk` and determine your USB device block
   ![](https://media.discordapp.net/attachments/580631240991047701/688920468220280842/unknown.png)
2. run `sudo gdisk /dev/<your USB block>`
   0. if you're asked what partition table to use, select GPT.
      ![](https://media.discordapp.net/attachments/580631240991047701/688920849771659265/unknown.png)
   1. send `p` to print your block's partitions \(and verify it's the one needed\)
      ![](https://media.discordapp.net/attachments/580631240991047701/688921334775939093/unknown.png)
   2. send `o` to clear the partition table and make a new GPT one (if not empty)
      1. confirm with `y`
         ![](https://media.discordapp.net/attachments/580631240991047701/688921581032046659/unknown.png)
   3. send `n`
      1. partition number: keep blank for default
      2. first sector: keep blank for default
      3. last sector: `+200M` to create a 200MB partition that will be named later on OPENCORE
      4. Hex code or GUID: `0700` for Microsoft basic data partition type
      ![](https://media.discordapp.net/attachments/580631240991047701/688921775098298436/unknown.png)
   4. send `n`
      1. partition number: keep blank for default
      2. first sector: keep blank for default
      3. last sector: keep black for default \(or you can make it `+3G` if you want to partition further the rest of the USB\)
      4. Hex code or GUID: `af00` for Apple HFS/HFS+ partition type
      ![](https://media.discordapp.net/attachments/580631240991047701/688922034796757080/unknown.png)
   5. send `w`
      * Confirm with `y`
      ![](https://media.discordapp.net/attachments/580631240991047701/688922153835692052/unknown.png)
      * In some cases a reboot is needed, but rarely, if you want to be sure, reboot your computer. You can also try re-plugging your USB key.
   6. Close `gdisk` by sending `q` (normally it should quit on its own)
3. Use `lsblk` again to determine the 200MB drive and the other partition
   ![](https://media.discordapp.net/attachments/580631240991047701/688922702060585135/unknown.png)
4. run `sudo mkfs.vfat -F 32 -n "OPENCORE" /dev/<your 200MB partition block>` to format the 200MB partition to FAT32, named OPENCORE
5. then `cd` to `gibmacos-master/macOS\ Downloads/publicrelease/xxx-xxxxx - 10.x.x macOS xxx` and you should get to a `pkg` file
   ![](https://media.discordapp.net/attachments/580631240991047701/688923503202009227/unknown.png)
   1. download `p7zip-full` \(depending on your distro tools\)
      * for ubuntu/ubuntu-based run `sudo apt install p7zip-full`
      * for arch/arch-based run `sudo pacman -S p7zip`
      * for the rest of you, you should know
      * for all distros: **make sure you're using bash for 7zip to work**.
   2. run this `7z e -txar *.pkg *.dmg; 7z e *.dmg */Base*` this will extract the recovery from the pkg through extracting the recovery update package then extracting the recovery dmg then the hfs image from it (BaseSystem.dmg).
   3. download `dmg2img` (available on most distros)
   4. run `dmg2img -l BaseSystem.dmg` and determin which partition has `disk image` property
      ![](https://media.discordapp.net/attachments/580631240991047701/688928772707319891/unknown.png)
   5. run `dmg2img -p <the partition number> -i BaseSystem -o <your 3GB+ partition block>` to extract and write the recovery image to the partition disk
      * It will take some time. A LOT if you're using a slow USB (took me about less than 5 minutes with a fast USB2.0 drive).
      ![](https://media.discordapp.net/attachments/580631240991047701/688931658904502272/unknown.png)

### Now with all this done, return to [Creating the USB](/installer-guide/opencore-efi.md) to finish up your work
