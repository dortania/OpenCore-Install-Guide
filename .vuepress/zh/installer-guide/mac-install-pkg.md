# Legacy macOS: Offline Method

This method allows us to download full installers from Apple, however is limited to the following macOS versions:

* Lion (10.7)
* Mountain Lion (10.8)
* Yosemite (10.10)
* El Capitan (10.11)
* Sierra (10.12)

::: tip

Mavericks (10.9) is not available with this method. See [Legacy macOS: Online Method](./mac-install-recovery.md) for this version.

:::

To start, go to one of the following links:

* [Mac OS X Lion Installer](https://support.apple.com/kb/DL2077)
* [Mac OS X Mountain Lion Installer](https://support.apple.com/kb/DL2076)
* [How to get old versions of macOS](https://support.apple.com/en-us/HT211683) (for 10.10 - 10.12 installers)

Download your desired version and a .dmg file should be provided, with a .pkg inside.

Depending on what OS you're on, you can install this package, which will provide you with a "Install (macOS version).app" and head to [Setting up the installer](#setting-up-the-installer); however if you receive this error:

![](../images/installer-guide/legacy-mac-install-md/unsupported.png)

Your SMBIOS is too new to run that version natively (even if you're trying to make a USB for a different computer, it still checks). This means we'll need to manually extract the installer.

### Extracting the Installer

To start, grab the InstallMacOSX/InstallOS.dmg and mount it:

![](../images/installer-guide/legacy-mac-install-md/mount.png)

Next, let's open up a Terminal window and extract the package to a folder on our desktop. This may take a while.

* For Lion and Mountain Lion:

```sh
cd ~/Desktop
pkgutil --expand-full "/Volumes/Install Mac OS X/InstallMacOSX.pkg" OSInstaller
```

* For Yosemite and El Capitan:

```sh
cd ~/Desktop
pkgutil --expand-full "/Volumes/Install OS X/InstallMacOSX.pkg" OSInstaller
```

* For Sierra:

```sh
cd ~/Desktop
pkgutil --expand-full "/Volumes/Install macOS/InstallOS.pkg" OSInstaller
```

Next, run the following (one at a time):

* Lion:

```sh
cd OSInstaller/InstallMacOSX.pkg
mv InstallESD.dmg "Payload/Install Mac OS X Lion.app/Contents/SharedSupport/"
mv "Payload/Install Mac OS X Lion.app" /Applications
```

* Mountain Lion:

```sh
cd OSInstaller/InstallMacOSX.pkg
mv InstallESD.dmg "Payload/Install OS X Mountain Lion.app/Contents/SharedSupport/"
mv "Payload/Install OS X Mountain Lion.app" /Applications
```

* Yosemite:

```sh
cd OSInstaller/InstallMacOSX.pkg
mv InstallESD.dmg "Payload/Install OS X Yosemite.app/Contents/SharedSupport/"
mv "Payload/Install OS X Yosemite.app" /Applications
```

* El Capitan:

```sh
cd OSInstaller/InstallMacOSX.pkg
mv InstallESD.dmg "Payload/Install OS X El Capitan.app/Contents/SharedSupport/"
mv "Payload/Install OS X El Capitan.app" /Applications
```

* Sierra:

```sh
cd OSInstaller/InstallOS.pkg
mv InstallESD.dmg "Payload/Install macOS Sierra.app/Contents/SharedSupport/"
mv "Payload/Install macOS Sierra.app" /Applications
```

### Once you're finished, you can head to [Setting up the installer](./mac-install.md#setting-up-the-installer)
