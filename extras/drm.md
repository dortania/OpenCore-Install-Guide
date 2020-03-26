# Fixing DRM support and iGPU performance

So with DRM, we have a couple things we need to mention:


* DRM requires a supported dGPU
   * See [GPU Buyers Guide](https://khronokernel-3.gitbook.io/gpu-buyers-guide/) for supported cards
* DRM is broken for iGPU-only systems
   * Has never worked for Haswell and up
   * For Ivy Bridge, could be fixed with Shiki (now WhateverGreen) til 10.12.2, but broke with 10.12.3
* Working hardware acceleration and decoding

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

* Easiest way to test this is by playing an iTunes movie: [Fairplay1.x test](https://drive.google.com/file/d/12pQ5FFpdHdGOVV6jvbqEq2wmkpMKxsOF/view)
  * FairPlay 1.x trailers will work on any configuration if WhateverGreen is properly set up - including iGPU-only configurations. However, FairPlay 1.x *movies* will only play on iGPU-only configurations for around 3-5 seconds, erroring after that HDCP is unsupported.

**FairPlay 2.x/3.x**: Hardware based DRM, found in Netflix, Amazon Prime

* There's a couple ways to test:
   * Play a show in Netflix or Amazon Prime
   * Play an Amazon Prime trailer: [Spider-Man: Far From Home](https://www.amazon.com/Spider-Man-Far-Home-Tom-Holland/dp/B07TP6D1DP)
      * Trailer itself isn't DRM encrypted but Amazon still does the check before playing
* Note: Requires newer AMD GPU to work (Polaris+)

**FairPlay 4.x**: Mixed DRM, found on AppleTV+

* You can open TV.app, choose TV+ -> Free Apple TV+ Premieres, then click on any episode to test without any registration or trial
* Apple TV+ also has a free trial if you want to use it
* Note: Requires either an absent iGPU (Xeon) or newer AMD GPU to work (Polaris+)
   * Possible to force FairPlay 1.x when iGPU is absent

If everything passes good on these tests, you have no need to continue! Otherwise proceed on

## Fixing DRM

So for fixing DRM on hackintoshes can go down mainly 1 route: patching DRM to use either software or AMD decoding. Vit made a great little chart for different hardware configurations:

* [WhateverGreen's DRM chart](https://github.com/acidanthera/WhateverGreen/blob/master/Manual/FAQ.Chart.md)

For AMD dGPU + iGPU + Z390, B360, H370, H310 or newer are recommended to use the following under `boot-args`:

* igfxfw=2
* shikigva=80

This will enable Apple's GuC to load but still make the dGPU do the DRM work

Note that shikigva args are meant to be placed in the boot-args section, do not mix shikigva flags together *unless* you are applying `shikigva` to a specific GPU(This is a neat feature of WhateverGreen where you can apply specific falgs to specific GPUs via `DeviceProperties`)

## Fixing iGPU performance

So how do you fix iGPU performance on a hackintosh? Well by loading Apple's GuC (Graphics Micro Code), the main things to note

* Firmware loading is retricted to Kaby Lake and newer
    * This still breaks for many so only recommended on Z390, B360, H370, H310 and newer

> So how do you apply it?

Under `DeviceProperties -> Add -> PciRoot(0x0)/Pci(0x2,0x0)`

```text
igfxfw | Data | <02 00 00 00>
```
For enabling the firmware loading


The best way to check is to monitor the iGPU's frequency is with either [Intel Power Gadget](https://software.intel.com/en-us/articles/intel-power-gadget) or checking the boot logs for Apple Scheduler references. Make sure you have the `igfxfw` property applied:

```text
kernel: (AppleIntelCFLGraphics) [IGPU] Graphics Firmware Version: 2.14.0.0
kernel: (AppleIntelCFLGraphics) [IGPU] Graphics Firmware Version: 2.14.0.0
kernel: (AppleIntelCFLGraphics) [IGPU] Graphics accelerator is using scheduler: Apple Firmware
kernel: (AppleIntelCFLGraphics) [IGPU] Graphics accelerator is using scheduler: Apple Firmware
```

![](https://cdn.discordapp.com/attachments/683011276938543134/691724984808243281/Screen_Shot_2020-03-23_at_1.04.57_PM.png)

