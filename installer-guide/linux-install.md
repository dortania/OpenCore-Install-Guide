# Making the installer in Linux

* Last edited: March 15, 2020
* Supported version: 0.5.6



While you don't need a fresh install of macOS to use OpenCore, some users prefer having a fresh slate with their boot manager upgrades.

To start you'll need the following:
* 4GB USB Stick
* [GibMacOS](https://github.com/corpnewt/gibMacOS)

## Downloading macOS

Now to start, run gibmacOS.py in terminal and select `Toggle Recovery-Only`:

* `python gibMacOS.command`

![](https://cdn.discordapp.com/attachments/683011276938543134/688850135794319380/Screen_Shot_2020-03-15_at_2.43.54_PM.png)

Now search through for your desired version of macOS, for this example we'll choose option 5 for macOS Catalina:

![](https://cdn.discordapp.com/attachments/683011276938543134/688850725337563158/Screen_Shot_2020-03-15_at_2.46.39_PM.png)

This will download the RecoveryHDMetaDmg.pkg to `\gibmacos-master\macOS Downloads\publicrelease\xxx-xxxxx - 10.x.x macOS xxx`

![](https://cdn.discordapp.com/attachments/683011276938543134/688851283855409194/Screen_Shot_2020-03-15_at_2.48.54_PM.png)

## Making the installer

This section will target making the necessary partitions in the USB device. You can use your favorite program be it `gdisk` `fdisk` `parted` `gparted` or `gnome-disks`. This guide will focus on `gdisk` as it's nice and can change the partition type later on, as we need it so that macOS Recovery HD can boot. (the distro used here is Ubuntu 18.04, other versions or distros may work)

Credit to [midi1996](https://github.com/midi1996) for his work on the [hackintosh-internet-install-gitbook](https://midi1996.github.io/hackintosh-internet-install-gitbook/) guide which this is based off of.

In terminal:

1. run `lsblk` and determine your USB device block
2. run `sudo gdisk /dev/<your USB block>`
   1. send `p` to print your block's partitions \(and verify it's the one needed\)
   2. send `o` to clear the partition table and make a new GPT one
      1. confirm with `y`
   3. send `n`
      1. partition number: keep blank for default
      2. first sector: keep blank for default
      3. last sector: `+200M` to create a 200MB partition that will be named later on OPENCORE
      4. Hex code or GUID: `0700` for Microsoft basic data partition type
   4. send `n`
      1. partition number: keep blank for default
      2. first sector: keep blank for default
      3. last sector: keep black for default \(or you can make it `+3G` if you want to partition further the rest of the USB\)
      4. Hex code or GUID: `af00` for Apple HFS/HFS+ partition type
   5. send `w`
      1. Confirm with `y`
   6. Close `gdisk` by sending `q`
3. Use `lsblk` again to determine the 200MB drive and the other partition
4. run `mkfs.vfat -F 32 -n "OPENCORE" /dev/<your 200MB partition block>` to format the 200MB partition to FAT32, named OPENCORE
5. then `cd` to `\gibmacos-master\macOS Downloads\publicrelease\xxx-xxxxx - 10.x.x macOS xxx` and keep going until you get to a `pkg` file
   1. download `p7zip-full` \(depending on your distro tools\)
      * for ubuntu/ubuntu-based run `sudo apt install p7zip-full`
      * for arch/arch-based run `sudo pacman -S p7zip`
      * for the rest of you, you should know
   2. run this `7z e -txar *.pkg *.dmg; 7z e *.dmg */Base*; 7z e -tdmg Base*.dmg *.hfs` this will extract the recovery from the pkg through extracting the recovery update package then extracting the recovery dmg then the hfs image from it.
   3. then when you get `4.hfs` or `3.hfs` \(depending on the macOS version used\) run `dd if=*.hfs of=/dev/<your USB's second partition block> bs=8M --progress` \(you may change the input file `if` and the block size to match your needs

### Now with all this done, return to [Creating the USB](/installer-guide/opencore-efi.md) to finish up your work