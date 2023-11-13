# Making the installer in Windows (Alternate)

While you don't need a fresh install of macOS to use OpenCore, some users prefer having a fresh slate with their boot manager upgrades.

To start you'll need the following:

* 16GB USB Stick (will vary depending on OS version, 16GB will work fine for latest)
* [gibMacOS](https://github.com/corpnewt/GibMacOS)
  * This will require [Python 3 installed](https://python.org/releases)
* [macrecovery.py](https://github.com/acidanthera/OpenCorePkg/releases)
  * This will also require [Python 3 installed](https://python.org/releases)
* [UnPlugged](https://github.com/corpnewt/UnPlugged)
  
## Downloading macOS

Now to start, first open Command Prompt and cd into [gibMacOS's folder](https://github.com/corpnewt/gibMacOS), and run one of the following commands:


```sh
# Adjust below command to the correct folder
cd C:/Users/(username)/Downloads/gibMacOS-master/gibMacOS/
```

From here, you'll want to launch gibMacOS.
```sh
python py gibMacOS.py
```
As of 13 November 2023, the options for the latest stable builds of each version of macOS are as follows
After you launch gibMacOS, it will scan for versions of macOS to download. You will need to look for the **latest build** avaliable. macOS Sonoma 14.1.1 will be used as an example.

23B81

23 - the last 2 years of when the *major version* was released.
B - counts down the alphabet, denotes minor version (In this case 23Bxx references all builds of Sonoma 14.1.x, though not all versions are like this)
81 - denotes subminor version, in this builds case being 14.1.*1*.

# Getting the recovery files

To grab recovery installers is super easy, first grab a copy of [OpenCorePkg](https://github.com/acidanthera/OpenCorePkg/releases) and head to `/Utilities/macrecovery/`. Next, click next to the current folder path and type `cmd` to open a Command Prompt in the current directory:

![](../images/installer-guide/windows-install-md/open-cmd-current-folder.gif)


Now run one of the following depending on what version of macOS you want (Note these scripts rely on [Python 3](https://www.python.org/downloads/) support, please install if you haven't already):

```sh
# Lion (10.7):
python3 macrecovery.py -b Mac-2E6FAB96566FE58C -m 00000000000F25Y00 download
python3 macrecovery.py -b Mac-C3EC7CD22292981F -m 00000000000F0HM00 download

# Mountain Lion (10.8):
python3 macrecovery.py -b Mac-7DF2A3B5E5D671ED -m 00000000000F65100 download

# Mavericks (10.9):
python3 macrecovery.py -b Mac-F60DEB81FF30ACF6 -m 00000000000FNN100 download

# Yosemite (10.10):
python3 macrecovery.py -b Mac-E43C1C25D4880AD6 -m 00000000000GDVW00 download

# El Capitan (10.11):
python3 macrecovery.py -b Mac-FFE5EF870D7BA81A -m 00000000000GQRX00 download

# Sierra (10.12):
python3 macrecovery.py -b Mac-77F17D7DA9285301 -m 00000000000J0DX00 download

# High Sierra (10.13)
python3 macrecovery.py -b Mac-7BA5B2D9E42DDD94 -m 00000000000J80300 download
python3 macrecovery.py -b Mac-BE088AF8C5EB4FA2 -m 00000000000J80300 download

# Mojave (10.14)
python3 macrecovery.py -b Mac-7BA5B2DFE22DDD8C -m 00000000000KXPG00 download

# Catalina (10.15)
python3 macrecovery.py -b Mac-00BE6ED71E35EB86 -m 00000000000000000 download

# Big Sur (11)
python3 macrecovery.py -b Mac-42FD25EABCABB274 -m 00000000000000000 download

# Monterey (12)
python3 macrecovery.py -b Mac-FFE5EF870D7BA81A -m 00000000000000000 download

# Latest version
# ie. Ventura (13)
python3 macrecovery.py -b Mac-4B682C642B45593E -m 00000000000000000 download
```

* **macOS 12 and above note**: As recent macOS versions introduce changes to the USB stack, it is highly advisable that you map your USB ports (with USBToolBox) before installing macOS.
  * <span style="color:red"> CAUTION: </span> With macOS 11.3 and newer, [XhciPortLimit is broken resulting in boot loops](https://github.com/dortania/bugtracker/issues/162).
    * If you've already [mapped your USB ports](https://dortania.github.io/OpenCore-Post-Install/usb/) and disabled `XhciPortLimit`, you can boot macOS 11.3+ without issues.

This will take some time, however once you're finished you should get either BaseSystem or RecoveryImage files:

![](../images/installer-guide/windows-install-md/macrecovery-done.png)

# Building the full USB

    Format your USB with 2 partitions:

    ◦ A FAT32 partition of ~750MB to 1GB (enough to accommodate the EFI and com.apple.recovery.boot folders)

    ◦ An ExFAT partition of the remaining space (needs to be enough to accommodate the files downloaded from gibMacOS)

    Copy your EFI folder and the com.apple.recovery.boot folder over to the FAT32 partition

    Copy the folder containing the files downloaded from gibMacOS to the ExFAT partition

    ◦ You'll be cding to this folder later - so it may make sense to label it something easy to type like macOS

    Copy UnPlugged.command to that same folder on the ExFAT partition

## Now with all this done, head to [Setting up the EFI](./opencore-efi.md) to finish up your work