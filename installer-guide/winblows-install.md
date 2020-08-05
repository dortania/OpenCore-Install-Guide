# Making the installer in Windows

* Supported version: 0.6.0

While you don't need a fresh install of macOS to use OpenCore, some users prefer having a fresh slate with their boot manager upgrades.

## Prerequisites for network installer

* 4GB USB Stick
* [GibMacOS](https://github.com/corpnewt/gibMacOS)

## Prerequisites for offline installer

* 12GB USB Stick
* [GibMacOS](https://github.com/corpnewt/gibMacOS)
* [BDU](http://cvad-mac.narod.ru/index/bootdiskutility_exe/0-5)
* [MakeInstallmacOS](https://github.com/doesprintfwork/MakeInstallmacOS)
* [PARAGON-Partition-Manager-free](https://www.paragon-software.com/free/pm-express/#)
* [Paragon-hfs-windows-trial-version](https://www.paragon-software.com/home/hfs-windows/)

## Downloading macOS

To start, open gibMacOS.bat as Admin and if only want to download  network installer select `Toggle Recovery-Only` this will only download the offline installer:

![](../images/installer-guide/winblows-install-md/gib-default.png)

Now search through for your desired version of macOS, for this example we'll choose option 5 for macOS Catalina:

![](../images/installer-guide/winblows-install-md/gib-recovery.png)

This will download the installer to `\gibmacos-master\macOS Downloads\publicrelease\xxx-xxxxx - 1x.x.x macOS xxx`

![](../images/installer-guide/winblows-install-md/gib-done.png)

## Making the installer

* [Making the network installer](#making-the-network-installer)
* [Making the offline installer](#making-the-offline-installer)

### Making the network installer

Next open `MakeInstall.bat` as Admin and select your drive with option O for OpenCore( ex: 1O).

![](../images/installer-guide/winblows-install-md/make-install.png)

Once your drive is formatted, it will then ask you for the `RecoveryHDMetaDMG.pkg` that we downloaded earlier. Top left of the file window will let you copy the file path:

![](../images/installer-guide/winblows-install-md/make-install-location.png)

![](../images/installer-guide/winblows-install-md/recovery-location.png)

MakeInstall will finish up by installing OpenCore to your USB's EFI System Partition, you can find this partition labeled as `BOOT`:

![](../images/installer-guide/winblows-install-md/make-install-done.png)

![](../images/installer-guide/winblows-install-md/EFI-base.png)

### Making the offline installer

To make an offline installer

1. Plug in your USB Stick if you didn't
2. extract BDU and run it
![](../images/installer-guide/winblows-install-md/offline/BDU.png)
3. Go to Options-->Configuration
4. Tick Not Install Boot Records as Clover and name it EFI and rest leave as is and press OK.
![](../images/installer-guide/winblows-install-md/offline/BDU-Config.png)
5. now select your USB Stick and press format.
6. Now that we have a EFI and installer partitions lets add the installer to the installer partition    
7. Go to Tools--> Extract HFS(HFS+) partition from DMG-files and here go to the location where your downloaded macOS Installer files folder(i.e.: `gibMacOS/macOS Downloads/publicrelease/xxx-xxxxx`) and select the BaseSystem.dmg and then select where you want to save the output
![](../images/installer-guide/winblows-install-md/offline/BDU-DMG.png)
![](../images/installer-guide/winblows-install-md/offline/BDU-HFS.png)
8. now a Command Prompt will open and it will create 4.hfs in the location you selected this will take some time so be patient after that you will get a pop up HFS Volume Extracted click OK and continue
![](../images/installer-guide/winblows-install-md/offline/BDU-HFS-Out.png)
![](../images/installer-guide/winblows-install-md/offline/BDU-HFS-OK.png)
9. Now we have to expand our USB Stick By pressing + in BDU then select the second partition
![](../images/installer-guide/winblows-install-md/offline/BDU-USB.png)
10. now press restore and select the 4.hfs we extracted before
![](../images/installer-guide/winblows-install-md/offline/BDU-Restore.png)
11. now it is going to create the installer this will take time about 10mins.
![](../images/installer-guide/winblows-install-md/offline/BDU-Restore-Prog.png)
12. now that we have a installer lets make it a offline installer.
13. Put the PackAppWin.py (from MakeInstallmacOS) into the downloaded macOS Installer files folder(i.e.: `gibMacOS/macOS Downloads/publicrelease/xxx-xxxxx`) and Double click it then type P to create offline installer files inside `gibMacOS/macOS Downloads/publicrelease/xxx-xxxxx/SharedSupport` this will take approximately 10 mins after that type Q to exit.
14. now we have to extend the installer partition created by BDU is it has enough space for the offline installer files
15. open PARAGON Partition Manager and select your usb sticks second partition and press extend
16. 


## Now with all this done, head to [Setting up the EFI](../installer-guide/opencore-efi.md) to finish up your work
