# Making the installer in Windows

* Supported version: 0.6.0

While you don't need a fresh install of macOS to use OpenCore, some users prefer having a fresh slate with their boot manager upgrades.

## Prerequisites for network installer

* 4GB USB Stick
* [GibMacOS](https://github.com/corpnewt/gibMacOS)

## Prerequisites for offline installer

* 12GB USB Stick
* [GibMacOS](https://github.com/corpnewt/gibMacOS)

## Downloading macOS

To start, open gibMacOS.bat as Admin and select `Toggle Recovery-Only` to download  network installer only:

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

test 123

## Now with all this done, head to [Setting up the EFI](../installer-guide/opencore-efi.md) to finish up your work
