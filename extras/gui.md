# OpenCore beauty treatment

Main thing this guide will go over:

* Giving OpenCore a GUI
* Setting up a bootchime

## Setting up OpenCore's GUI

So to get started, we're gonna need 0.5.7 as this build version has the GUI included with the rest of the files. If you're on an older version, I recommend updating: [Updating OpenCore](/post-install/update.md)

Once that's done, we'll need a couple things:

* [Binary Resources](https://github.com/acidanthera/OcBinaryData)
* [OpenCanopy.efi](https://github.com/acidanthera/OpenCorePkg/releases)

Once you have both of these, we'll next want to add it to our EFI partition:

* Add the Resources folder to EFI/OC
* Add OpenCanopy.efi to EFI/Drivers

![](https://cdn.discordapp.com/attachments/683011276938543134/693888491603361822/Screen_Shot_2020-03-29_at_12.24.22_PM.png)

Now in our config.plist, we have 2 things we need to fix:

* `Misc -> PickerMode -> External`
* `UEFI -> Drivers` and add OpenCanopy.efi

Once all this is saved, you can reboot and be greeted with a true Mac-like GUI

![](https://cdn.discordapp.com/attachments/683011276938543134/693871107354394674/vmware_2019-10-06_19-47-27.png)

## Setting up Bootchime with AudioDxe

So to start, we'll need a couple things:

* Onboard audio output
   * USB DACs will not work
* [AudioDxe](https://github.com/acidanthera/AppleSupportPkg/releases) in both EFI/OC/Drivers and UEFI -> Drivers
* [Binary Resources](https://github.com/acidanthera/OcBinaryData)
   * Add the Resources folder to EFI/OC, just like we did with the OpenCore GUI section
* Debug version of OpenCore with logging enabled
   * See [OpenCore Debugging](/troubleshooting/debug.md) for more info

**Settings up NVRAM**:

* NVRAM -> Add -> 7C436110-AB2A-4BBB-A880-FE41995C9F82:
   * `SystemAudioVolume | Data | 0x46`
   * This is the bootchime and screenreader volume, note it's in hexidecimal so would become `70` in decimal

**Setting up UEFI -> Audio:**

* **AudioCodec:**
   * Codec address of Audio controller
   * To find yours:
      * Check IOReg -> HDEF and see the `IOHDACodecAddress` property
      * ex: `0x0`

* **Audio Device:**
   * PciRoot of audio controller
   * Run [gfxutil](https://github.com/acidanthera/gfxutil/releases) to find the path:
      * `/path/to/gfxutil -f HDEF`
      * ex: `PciRoot(0x0)/Pci(0x1f,0x3)`

* **AudioOut:**
   * The specific output of your Audio controller, easiest way to find the right one is to go through each one(from 0 to N - 1)
   * ex: `2`
      * You can find all the ones for your codec in the OpenCore debug logs:

```text
06:065 00:004 OCAU: Matching PciRoot(0x0)/Pci(0x1F,0x3)/VenMsg(A9003FEB-D806-41DB-A491-5405FEEF46C3,00000000)...
06:070 00:005 OCAU: 1/2 PciRoot(0x0)/Pci(0x1F,0x3)/VenMsg(A9003FEB-D806-41DB-A491-5405FEEF46C3,00000000) (5 outputs) - Success
```

* **AudioSupport:**
   * Set this to `True`

* **MinimumVolume:**
   * Volume level from `0` to `100`
   * To not blow the speakers, set it to `70`
   * Note bootchime will not play if MinimumVolume is higher than `SystemAudioVolume`

* **PlayChime:**
   * Set this to `True`

* **VolumeAmplifier:**
   * The Volume amplification, value will differ depending on your codec
   * Formula is as follows:
      * (SystemAudioVolume * VolumeAmplifier)/100 = Raw Volume(but cannot exceed 100)
      * ex: (`70` * VolumeAmplifier)/`100` = `100`  -> (`100` * `100`) / `70` = VolumeAmplifier = `142.9`(we'll round it to `143` for simplicity)


Once done, you should get something like this:

![](https://cdn.discordapp.com/attachments/683011276938543134/694692811643027517/Screen_Shot_2020-03-31_at_5.40.14_PM.png)


**Note for visually impaired**:

* OpenCore hasn't forgotten about you! With the AudioDxe setup, you can enable both picker audio and FileVault voiceover with these 2 settings:
   * `Misc -> PickerAudioAssist -> True` to enable picker audio
   * `UEFI -> Protocols -> AppleAudio -> True` to enable FileVault voice over
      * See[Security and FileVault](/post-install/security.md) on how to setup the rest for proper FileVault support