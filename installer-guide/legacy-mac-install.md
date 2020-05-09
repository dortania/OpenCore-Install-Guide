# Grabbing older versions of macOS/OS X

* Note: For those doubting OpenCore works on older versions, see here: [OpenCore running on legacy](https://github.com/dortania/OpenCore-Desktop-Guide/blob/master/installer-guide/legacy/README.md)

So with older versions of macOS/OS X, Apple removed them from their Software Catalog that GibMacOS pulls from. To get around this, we can actually use Apple's archived versions. Luckily for us, we don't need to resort to sketchy sites instead using Apple's official site(Note that Mavericks and older are no longer officially hosted):

* [How to upgrade to OS X Yosemite](https://support.apple.com/en-ca/HT210717)
* [How to upgrade to OS X El Capitan](https://support.apple.com/en-us/HT206886)
* [How to upgrade to macOS Sierra](https://support.apple.com/en-us/HT208202)

Step 4. within those sites will give you a link to either Apple's `InstallMacOSX.dmg` for El Capitan and older or `InstallOS.dmg` for Sierra. For this example, we'll be making an OS X 10.10.

For those on newer OSes than those you're trying to create an installer for, Apple will give you a pleasant error that makes you want to cave your head into a desk:

![](/images/installer-guide/legacy-mac-install-md/unsupported.png)

If this is you, follow below. For those able to run the installer can skip and go to [Creating the installer](#creating-the-installer)

## Extracting the Installer

To start, grab the InstallMacOSX/InstallOS.dmg and mount it:

![](/images/installer-guide/legacy-mac-install-md/mount.png)

Next, let's open up terminal window and make a folder on our desktop to break things. Run one at a time:

```
cd ~/Desktop
mkdir MacInstall && cd MacInstall
```

Now we get to the fun part, extracting the installer(Note this may take a few minutes):

* For El Capitan(10.11) and older:

```
xar -xf /Volumes/Install\ OS\ X/InstallMacOSX.pkg
```

* For Sierra(10.12):

```
xar -xf /Volumes/Install\ macOS/InstallOS.pkg
```

Next, run the following(one at a time):

* Yosemite:

```
cd InstallMacOSX.pkg
tar xvzf Payload
mv InstallESD.dmg Install\ OS\ X\ Yosemite.app/Contents/SharedSupport/
mv Install\ OS\ X\ Yosemite.app /Applications
```

* El Capitan:

```
cd InstallMacOSX.pkg
tar xvzf Payload
mv InstallESD.dmg Install\ OS\ X\ El\ Capitan.app/Contents/SharedSupport/
mv Install\ OS\ X\ El\ Capitan.app /Applications
```

* Sierra:

```
cd InstallOS.pkg
tar xvzf Payload
mv InstallESD.dmg Install\ macOS\ Sierra.app/Contents/SharedSupport/
mv Install\ macOS\ Sierra.app /Applications
```

## Creating the Installer

Now we'll be formatting the USB to prep for both the macOS installer and OpenCore. We'll want to use macOS Extended(HFS+) with a GUID partition map. What this will do is create 2 partitions. The main `MyVolume` and a second called `EFI` which is used as a boot partition where your firmware will check for boot files.

* Note by default Disk Utility only shows partitions, press Cmd/Win+2 to show all devices(Alternatively you can press the view button)

![Formatting the USB](/images/installer-guide/mac-install-md/format-usb.png)

Next run the `createinstallmedia` command provided by [Apple](https://support.apple.com/en-us/HT201372), note that the command is made for USB's formatted with the name `MyVolume`:

* Mavericks:

```text
sudo /Applications/Install\ OS\ X\ Mavericks.app/Contents/Resources/createinstallmedia --volume /Volumes/MyVolume --applicationpath /Applications/Install\ OS\ X\ Mavericks.app --nointeraction
```

* Yosemite:

```text
sudo /Applications/Install\ OS\ X\ Yosemite.app/Contents/Resources/createinstallmedia --volume /Volumes/MyVolume --applicationpath /Applications/Install\ OS\ X\ Yosemite.app
```

* El Capitan:

```text
sudo /Applications/Install\ OS\ X\ El\ Capitan.app/Contents/Resources/createinstallmedia --volume /Volumes/MyVolume --applicationpath /Applications/Install\ OS\ X\ El\ Capitan.app
```

* Sierra:

```text
sudo /Applications/Install\ macOS\ Sierra.app/Contents/Resources/createinstallmedia --volume /Volumes/MyVolume
```

This will take some time so may want to grab a coffee or continue reading the guide(to be fair you really shouldn't be following this guide step by step without reading the whole thing first)

## Setting up OpenCore's EFI environment

Setting up OpenCore's EFI environment is simple, all you need to do is mount our EFI system partition. This is automatically made when we format with GUID but is unmounted by default, this is where our friend [MountEFI](https://github.com/corpnewt/MountEFI) comes in:

![MountEFI](/images/installer-guide/mac-install-md/mount-efi-usb.png)

You'll notice that once we open the EFI partition, it's empty. This is where the fun begins.

![Empty EFI partition](/images/installer-guide/mac-install-md/base-efi.png)

### Now with all this done, head to [Setting up the EFI](https://dortania.github.io/OpenCore-Desktop-Guide/installer-guide/opencore-efi.html) to finish up your work
