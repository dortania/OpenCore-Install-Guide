# Fixing DRM support and iGPU performance

So with DRM, we have a couple things we need to mention:

* DRM requires a supported dGPU
   * See the [GPU Buyers Guide](https://gpu.dortania.ml/) for supported cards
* DRM is broken for iGPU-only systems
   * These have never worked with Haswell and newer
   * For Ivy Bridge, this could be fixed with Shiki (now WhateverGreen) til 10.12.2, but broke with 10.12.3
* Working hardware acceleration and decoding

## Testing Hardware Acceleration and Decoding

So before we can get started with fixing DRM, we need to make sure your hardware is working. The best way to check is by running [VDADecoderChecker](https://i.applelife.ru/2019/05/451893_10.12_VDADecoderChecker.zip):

![](https://cdn.discordapp.com/attachments/683011276938543134/692237447203127356/Screen_Shot_2020-03-24_at_11.04.19_PM.png)

If you fail at this point, there's a couple things you can check for:

* Make sure your hardware is supported
   * See [GPU Buyers Guide](https://gpu.dortania.ml/)
* Make sure the SMBIOS you're running matches with your hardware
   * Don't use a Mac Mini SMBIOS on a desktop for example, as Mac Minis run mobile hardware and so macOS will expect the same
* Make sure the iGPU is enabled in the BIOS and has the correct properties for your setup (`AAPL,ig-platform-id` and if needed, `device-id`)
   * You can either review the DeviceProperties section from the guide or [WhateverGreen's manual](https://github.com/acidanthera/WhateverGreen/blob/master/Manual/FAQ.IntelHD.en.md)
* Avoid unnessary ACPI renames, all important ones are handled in WhateverGreen
   * change GFX0 to IGPU
   * change PEG0 to GFX0
   * change HECI to IMEI
   * [etc](https://github.com/khronokernel/Opencore-Vanilla-Desktop-Guide/blob/master/clover-conversion/Clover-config.md)
* Make sure Lilu and WhateverGreen are loaded
   * Make sure not to have any legacy graphics patches present as they've been absorbed into WhateverGreen:
      * IntelGraphicsFixup.kext
      * NvidiaGraphicsFixup.kext
      *Shiki.kext

To check if Lilu and WhateverGreen loaded correctly:

```text
kextstat | grep -E "Lilu|WhateverGreen"
```

## Testing DRM

So before we get too deep, we need to go over some things, mainly the types of DRM you'll see out in the wild:

**FairPlay 1.x**: Software based DRM, used for supporting legacy Macs more easily

* Easiest way to test this is by playing an iTunes movie: [FairPlay 1.x test](https://drive.google.com/file/d/12pQ5FFpdHdGOVV6jvbqEq2wmkpMKxsOF/view)
  * FairPlay 1.x trailers will work on any configuration if WhateverGreen is properly set up - including iGPU-only configurations. However, FairPlay 1.x *movies* will only play on iGPU-only configurations for around 3-5 seconds, erroring that HDCP is unsupported afterwards.

**FairPlay 2.x/3.x**: Hardware based DRM, found in Netflix, Amazon Prime

* There's a couple ways to test:
   * Play a show in Netflix or Amazon Prime
   * Play an Amazon Prime trailer: [Spider-Man: Far From Home](https://www.amazon.com/Spider-Man-Far-Home-Tom-Holland/dp/B07TP6D1DP)
      * Trailer itself does not use DRM but Amazon still checks before playing
* Note: Requires newer AMD GPU to work (Polaris+)

**FairPlay 4.x**: Mixed DRM, found on AppleTV+

* You can open TV.app, choose TV+ -> Free Apple TV+ Premieres, then click on any episode to test without any trial (you do need an iCloud account)
* Apple TV+ also has a free trial if you want to use it
* Note: Requires either an absent iGPU (Xeon) or newer AMD GPU to work (Polaris+)
   * Possible to force FairPlay 1.x when iGPU is absent

If everything works on these tests, you have no need to continue! Otherwise, proceed on.

## Fixing DRM

So for fixing DRM on hackintoshes we can go down mainly 1 route: patching DRM to use either software or AMD decoding. Vit made a great little chart for different hardware configurations:

* [WhateverGreen's DRM chart](https://github.com/acidanthera/WhateverGreen/blob/master/Manual/FAQ.Chart.md)

So how do you use it? First, identify what configuration you have in the chart (AMD represents GPU, not CPU). The SMBIOS listed (IM = iMac, MM = Mac Mini, IMP = iMac Pro, MP = Mac Pro) is what you should use if you match the hardware configuration. If you don't match any of the configurations in the chart, you're out of luck.

Next, identify what Shiki mode you need to use. If there are two configurations for your setup, they will differ in the Shiki flags used. Generally, you want hardware decoding over software decoding. If the mode column is blank, then you are done. Otherwise, you should add `shikigva` as a property to any GPU, using DevicesProperties > Add. For example, if the mode we need to use is `shikigva=80`:

![Example of shikigva in Devices Properties](https://cdn.discordapp.com/attachments/683011276938543134/693487632247947386/Screen_Shot_2020-03-28_at_9.50.11_AM.png)

You can also use the boot argument - this is in the mode column.

Here's one example. If we have an Intel i9-9900K and an RX 560, the configuration would be "AMD+IGPU", and we should be using an iMac or Mac Mini SMBIOS (for this specific configuration, iMac19,1). Then we see there are two options for the configuration: one where the mode is `shikigva=16`, and one with `shikigva=80`. We see the difference is in "Prime Trailers" and "Prime/Netflix". We want Netflix to work, so we'll choose the `shikigva=80` option. Then inject `shikigva` with type number/integer and value `80` into our iGPU or dGPU, reboot, and DRM should work.

Here's another example. This time, We have an Ryzen 3700X and an RX 480. Our configuration in this case is just "AMD", and we should be using either an iMac Pro or Mac Pro SMBIOS. Again, there are two options: no shiki arguments, and `shikigva=128`. We prefer hardware decoding over software decoding, so we'll choose the `shikigva=128` option, and again inject `shikigva` into our dGPU, this time with value `128`. A reboot and DRM works.

**Notes:**

  * You can use [gfxutil](https://github.com/acidanthera/gfxutil/releases) to find the path to your iGPU/dGPU.
     * `path/to/gfxutil -f GFX0`
	 * `GFX0`: For dGPUs, if multiple installed check IORegistryExplorer for what your AMD card is called
	 * `IGPU`: For iGPU
  * If you inject `shikigva` using DeviceProperties, ensure you only do so to one GPU, otherwise WhateverGreen will use whatever it finds first and it is not guaranteed to be consistent. 
  * IQSV stands for Intel Quick Sync Video: this only works if iGPU is present and enabled and it is set up correctly.
  * Special configurations (like Haswell + AMD dGPU with an iMac SMBIOS, but iGPU is disabled) are not covered in the chart. You must do research on this yourself.
  * [Shiki source](https://github.com/acidanthera/WhateverGreen/blob/master/WhateverGreen/kern_shiki.hpp) is useful in understanding what flags do what and when they should be used, and may help with special configurations.

## Fixing iGPU performance

So how do we fix iGPU performance on a hackintosh? Well by loading Apple's GuC (Graphics Micro Code). The main thing to note is that firmware loading is restricted to:
  * Skylake and newer CPU with a [supported iGPU](https://gpu.dortania.ml/modern-gpus/intel-gpu)
  * **And** a recent chipset, 300-series or newer: Z390, B360, H370, H310, etc. (***not*** Z370, as it is actually 200-series)
  * Do note that even with recent chipsets, firmware loading is not guaranteed to work. If you experience a kernel panic or lots of graphics errors after trying this, it is probably because firmware loading is not supported on your setup.

So how do we apply it?

Under `DeviceProperties -> Add -> PciRoot(0x0)/Pci(0x2,0x0)`, add:
```text
igfxfw | Data | <02 00 00 00>
```
To enable firmware loading.

![Example of igfxfw injected into iGPU](https://cdn.discordapp.com/attachments/683011276938543134/693540218074300516/Screen_Shot_2020-03-28_at_1.19.54_PM.png)

The best way to check is to monitor the iGPU's frequency is with either [Intel Power Gadget](https://software.intel.com/en-us/articles/intel-power-gadget) or checking the boot logs for Apple Scheduler references. Make sure you have the `igfxfw` property applied:

```text
kernel: (AppleIntelCFLGraphics) [IGPU] Graphics Firmware Version: 2.14.0.0
kernel: (AppleIntelCFLGraphics) [IGPU] Graphics Firmware Version: 2.14.0.0
kernel: (AppleIntelCFLGraphics) [IGPU] Graphics accelerator is using scheduler: Apple Firmware
kernel: (AppleIntelCFLGraphics) [IGPU] Graphics accelerator is using scheduler: Apple Firmware
```

![](https://cdn.discordapp.com/attachments/683011276938543134/691724984808243281/Screen_Shot_2020-03-23_at_1.04.57_PM.png)

