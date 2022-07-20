# Legacy macOS: Offline method

This method allows us to download full installers from Apple, however is limited to the macOS versions listed below:

* 10.7 Lion
* 10.8 Mountain Lion
* 10.10 Yosemite
* 10.11 El Capitan
* 10.12 Sierra

Note that OS X 10.9 Mavericks is not available from Apple yet. It will need to be grabbed via the "Online Method" mentioned below.

To start, go to one of the following links:

* [Mac OS X Lion Installer](https://support.apple.com/kb/DL2077?locale=en_US)
* [Mac OS X Mountain Lion Installer](https://support.apple.com/kb/DL2076?locale=en_US)
* [How to get old versions of macOS](https://support.apple.com/en-us/HT211683) (for 10.10 - 10.12 installers)

Download your desired version and a .pkg file should be provided.

Depending on what OS you're on, you can run this script and head to [Setting up the installer](#setting-up-the-installer) however if you receive this error:

![](../images/installer-guide/legacy-mac-install-md/unsupported.png)

This means we'll need to manually extract the installer.

### Extracting the Installer

To start, grab the InstallMacOSX/InstallOS.dmg and mount it:

![](../images/installer-guide/legacy-mac-install-md/mount.png)

Next, let's open up terminal window and make a folder on our desktop to break things. Run one at a time:

```sh
cd ~/Desktop
mkdir MacInstall && cd MacInstall
```

Now we get to the fun part, extracting the installer(Note this may take a few minutes):

* For El Capitan(10.11) and older:

```sh
xar -xf /Volumes/Install\ OS\ X/InstallMacOSX.pkg
```

* For Sierra(10.12):

```sh
xar -xf /Volumes/Install\ macOS/InstallOS.pkg
```

Next, run the following(one at a time):

* Lion:

```sh
cd InstallMacOSX.pkg
tar xvzf Payload
mv InstallESD.dmg Install\ Mac\ OS\ X\ Lion.app/Contents/SharedSupport/
mv Install\ Mac\ OS\ X\ Lion.app /Applications
```

* Mountain Lion:

```sh
cd InstallMacOSX.pkg
tar xvzf Payload
mv InstallESD.dmg Install\ Mac\ OS\ X\ Mountain\ Lion.app/Contents/SharedSupport/
mv Install\ Mac\ OS\ X\ Mountain\ Lion.app /Applications
```

* Yosemite:

```sh
cd InstallMacOSX.pkg
tar xvzf Payload
mv InstallESD.dmg Install\ OS\ X\ Yosemite.app/Contents/SharedSupport/
mv Install\ OS\ X\ Yosemite.app /Applications
```

* El Capitan:

```sh
cd InstallMacOSX.pkg
tar xvzf Payload
mv InstallESD.dmg Install\ OS\ X\ El\ Capitan.app/Contents/SharedSupport/
mv Install\ OS\ X\ El\ Capitan.app /Applications
```

* Sierra:

```sh
cd InstallOS.pkg
tar xvzf Payload
mv InstallESD.dmg Install\ macOS\ Sierra.app/Contents/SharedSupport/
mv Install\ macOS\ Sierra.app /Applications
```

### Once you're finished, you can head to [Setting up the installer](./mac-install.md#setting-up-the-installer)
