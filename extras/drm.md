# Fixing DRM support

So with DRM, we have a couple things we need to mention:


* DRM requires a supported GPU
   * See [GPU Buyers Guide](https://khronokernel-3.gitbook.io/gpu-buyers-guide/) for supported cards
* DRM on Z370 and older are broken for iGPU only systems
   * Z390, B360, H370, H310 boards and newer are supported
* Working Hadware acceleration and decoding

## Testing Hardware Acceleration and Decoding

So before we can get started with fixing DRM, we need to make sure you hardware is working. The best way to check is by running [VDADecoderChecker](https://i.applelife.ru/2019/05/451893_10.12_VDADecoderChecker.zip):

![](https://cdn.discordapp.com/attachments/683011276938543134/692237447203127356/Screen_Shot_2020-03-24_at_11.04.19_PM.png)

If you fail at this point, there's a couple things you can check for:

* Make sure the hardware is even supported
   * See [GPU Buyers Guide](https://khronokernel-3.gitbook.io/gpu-buyers-guide/)
* Make sure the SMBIOS you're running matches with your hardware
   * Don't use a MacMini SMBIOS on a desktop for example, as MacMini's run mobile hardware and so macOS will expect the same
* Make sure the iGPU is enabled in the BIOS and has the correct properties for your setup(`AAPL,ig-platform-id` and `device-id`)
   * You can either review the DevicePorperties section from the guide or [WhateverGreen's manual](https://github.com/acidanthera/WhateverGreen/blob/master/Manual/FAQ.IntelHD.en.md)
* Avoid unnessary ACPI renames, all important ones are handled in WhateverGreen
   * change GFX0 to IGPU
   * change PEG0 to GFX0
   * change HECI to IMEI
   * [etc](https://github.com/khronokernel/Opencore-Vanilla-Desktop-Guide/blob/master/clover-conversion/Clover-config.md)
* Make sure Lilu and WhateverGreen are loaded
   * Make sure not to have any legacy graphics patches present as they've been absorbed into WhateverGreen:
      * IntelGraphicsFixup.kext
      * NvidiaGraphicsFixup.kext

To check if Lilu and WhateverGreen loaded correctly:

```text
kextstat | grep -E "Lilu|WhateverGreen"
```

## Testing DRM

So before we get too deep, lets actually make sure that DRM is broken, but we'll need to go over some things. Mainly the types of DRM you'll see out in the wild:

**FairPlay 1.x**: Software based DRM, used for supporting legacy macs more easily

* Easiest way to test this is by playing an iTunes movies or trailer: [Fairplay1.x test](https://drive.google.com/file/d/12pQ5FFpdHdGOVV6jvbqEq2wmkpMKxsOF/view)

**FairPlay 2.x/3.x**: Hardware based DRM, found in Netflix, AmazonPrime

* There's a couple ways to test:
   * Play a show in Netflix or Amazon Prime
   * Play an AmazonPrime trailer: [Spiderman Far from home](https://www.amazon.com/Spider-Man-Far-Home-Tom-Holland/dp/B07TP6D1DP)
      * Trailer itself isn't DRM encrypted but Amazon still does the check before playing
* Note: Requires either an iGPU or newer AMD GPU to work(Polaris+)

**FairPlay 4.x**: Hardware based DRM, found on AppleTV+

* AppleTV+ comes with a free trial
* Note: Requires either an iGPU or newer AMD GPU to work(Polaris+)
   * Possible to force Fairplay 1,x for unsupported/older hardware combinations

If everything passes good on these tests, you have no need to continue! Otherwise proceed on

## Fixing DRM

So for fixing DRM on hackintoshes can go down 2 routes:

* Load Apple's own GuC onto the iGPU(only properly supported on Z390, B360, H370, H310 and newer)
* Patching DRM to use either software or AMD decoding

**iGPU for DRM**

So a neat feature with newer Lilu and WhateverGreen builds are that you can now load Apple's iGPU firmware(GuC, Graphics micro code). There's still some limitation but a huge advancement like allowing GPU frequency, main issue:

* Firmware loading is retricted to Kabylake and newer
    * This still breaks for many so only recommended on Z390, B360, H370, H310 and newer

> So how do you apply it?

Under `DeviceProperties -> Add -> PciRoot(0x0)/Pci(0x2,0x0)`

```text
igfxfw | Data | <02 00 00 00>
```
For enabling the firmware loading

```text
shikigva | Data | <50 00 00 00>
```
For disabling WEG/Shiki's DRM patches

You can also add `shikigva=128` to boot-args to force the hardware RM for Fairplay 1.x though not required


**dGPU/software for DRM**


For dGPU/software setups, it gets a bit more complicated. Luckily Vit made a great little chart for different hardware configurations:

* [WhateverGreen's DRM chart](https://github.com/acidanthera/WhateverGreen/blob/master/Manual/FAQ.Chart.md)

Note that shikigva args are meant to be placed in the boot-args section, **do not mix shikigva flags together**

## Testing iGPU performance

The best way to check is to monitor the iGPU's frequency is with either [Intel Power Gadget](https://software.intel.com/en-us/articles/intel-power-gadget) or checking the boot logs for Apple Scheduler references. Make sure you have the `igfxfw` property applied:

```text
kernel: (AppleIntelCFLGraphics) [IGPU] Graphics Firmware Version: 2.14.0.0
kernel: (AppleIntelCFLGraphics) [IGPU] Graphics Firmware Version: 2.14.0.0
kernel: (AppleIntelCFLGraphics) [IGPU] Graphics accelerator is using scheduler: Apple Firmware
kernel: (AppleIntelCFLGraphics) [IGPU] Graphics accelerator is using scheduler: Apple Firmware
```

![](https://cdn.discordapp.com/attachments/683011276938543134/691724984808243281/Screen_Shot_2020-03-23_at_1.04.57_PM.png)


Sources for this guide:


