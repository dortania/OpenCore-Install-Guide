# config.plist Setup

Now that we've got all our Kexts(.kext), SSDTs(.aml) and firmware drivers(.efi), your USB should start to look something like this:

![](../images/config/config-universal/almost-done.png)

* **Note**: Your USB **will look different**, everyone's system will have different requirements.

## Creating your config.plist

First we'll want to grab the sample.plist from the [OpenCorePkg](https://github.com/acidanthera/OpenCorePkg/releases), this will be located under the `Docs` folder:

![](../images/config/config-universal/sample-location.png)

Next lets move it onto our USB's EFI partition(will be called BOOT on Windows) under `EFI/OC/`, and rename it to config.plist:

![](../images/config/config-universal/renamed.png)

## Adding your SSDTs, Kexts and Firmware Drivers

For the rest of this guide, you're gonna need some form of plist editing. And for our guide, we'll be using ProperTree and GenSMBIOS to help automate some of the tedious work:

* [ProperTree](https://github.com/corpnewt/ProperTree)
  * Universal plist editor
* [GenSMBIOS](https://github.com/corpnewt/GenSMBIOS)
  * For generating our SMBIOS data

Next, let's open ProperTree and edit our config.plist:

* `ProperTree.command`
  * For macOS
  * Pro tip: there's a `buildapp.command` utility in the `Scripts` folder that lets you turn ProperTree into a dedicated app in macOS
* `ProperTree.bat`
  * For Windows

Once ProperTree is running, open your config.plist by pressing **Cmd/Ctrl + O** and selecting the `config.plist` file on your USB.

After the config is opened, press **Cmd/Ctrl + Shift + R** and point it at your EFI/OC folder to perform a "Clean Snapshot":

* This will remove all the entries from the config.plist and then adds all your SSDTs, Kexts and Firmware drivers to the config
* **Cmd/Ctrl + R** is another option that will add all your files as well but will leave entries disabled if they were set like that before, useful for when you're troubleshooting but for us not needed right now

![](../images/config/config-universal/before-snapshot.png)

Once done, you'll see your SSDTs, Kexts and firmware drivers populated in the config.plist:

![](../images/config/config-universal/after-snapshot.png)

If you wish to clean up the file a bit, you can remove the `#WARNING` entries. Though they cause no issues staying there, so up to personal preference.

## Selecting your platform

Now comes the important part, selecting the configuration path. Each platform has their own unique quirks that you need to account for so knowing your hardware is super important. See below for what to follow:

### Intel Desktop

[Ivy Bridge](/config.plist/ivy-bridge.md)

* 3XXX series, 2012 era

[Haswell](/config.plist/haswell.md)

* 4XXX series, 2013 era
* For the 3 of you in the world with desktop Broadwell, this will also apply to you

[Skylake](/config.plist/skylake.md)

* 6XXX series, 2015-2016 era

[Kaby Lake](/config.plist/kaby-lake.md)

* 7XXX series, 2017 era
* Kaby Lake-R and Amber Lake also apply

[Coffee Lake](/config.plist/coffee-lake.md)

* 8XXX and 9XXX series, 2017-2019 era

[Comet Lake](/config.plist/comet-lake.md)

* 10XXX series, 2020 era

### Intel Laptop

[Ivy Bridge](/config-laptop.plist/ivy-bridge.md)

* 3XXX series, 2012 era

[Haswell](/config-laptop.plist/haswell.md)

* 4XXX series, 2013 era

[Broadwell](/config-laptop.plist/broadwell.md)

* 5XXX series, 2014 era

[Skylake](/config-laptop.plist/skylake.md)

* 6XXX series, 2015-2016 era

[Kaby Lake](/config-laptop.plist/kaby-lake.md)

* 7XXX series, 2017 era
* Kaby Lake-R and Amber Lake also apply

[Coffee Lake(8th Gen)](/config-laptop.plist/coffee-lake.md)

* 8XXX series, 2017-2018 era

[Coffee Lake Plus(9th Gen)](/config-laptop.plist/coffee-lake-plus.md)

* 9XXX series, 2019 era
* Comet Lake also applies(10XXX series)

[Icelake](/config-laptop.plist/icelake.md)

* 10XXX series, 2019-2020 era
* Do not mix this and Comet Lake up
* Guide still under testing as WhateverGreen needs updating

### Intel HEDT

This section includes both enthusiast and server based hardware.

[Haswell-E](/config-HEDT/haswell-e.md)

* 5XXX series, 2014 era

[Broadwell-E](/config-HEDT/broadwell-e.md)

* 6XXX series, 2016 era

[Skylake/Cascade Lake-X/W](/config-HEDT/skylake-x.md)

* 7XXX, 9XXX, 10XXX series, 2017-2019 era

### AMD

[Bulldozer/Jaguar](/AMD/fx.md)

* Google the series, AMD had bad naming schemes and let these generations live for too long.

[Zen](/AMD/zen.md)

* 1XXX, 2XXX, 3XXX series, 2017-2020 era
* Note: Threadripper 3rd gen(39XX) are not supported, 1st and 2nd gen however are supported

### Misc

* [Laptops](https://dortania.github.io/vanilla-laptop-guide/)
  * Dedicated guide to laptop installs.
* [Legacy](https://github.com/dortania/OpenCore-Desktop-Guide/blob/master/config.plist/legacy.md)
  * Mainly for Sandy
