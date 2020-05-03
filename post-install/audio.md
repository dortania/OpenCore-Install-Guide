# Fixing audio with AppleALC

* Supported version: 0.5.7

Table of Contents:

* [Finding your layout ID](/post-install/audio.md#fixing-your-layout-id)
* [Testing your layout](/post-install/audio.md#testing-your-layout)
* [Making Layout ID more permanent](/post-install/audio.md#making-layout-id-more-permanent)
* [Miscellaneous issues](/post-install/audio.md#miscellaneous-issues)
* [Troubleshooting](/post-install/audio.md#troubleshooting)
  * [Checking if you have the right kexts](#checking-if-you-have-the-right-kexts)
  * [Checking if AppleALC is patching correctly](#checking-if-applealc-is-patching-correctly)
  * [Checking AppleHDA is vanilla](#checking-applehda-is-vanilla)

So to start, we'll assume you already have Lilu and AppleALC installed, if you're unsure if it's been loaded correctly you can run the following in terminal(This will also check if AppleHDA is loaded, as without this AppleALC has nothing to patch):

```text
kextstat | grep -E "AppleHDA|AppleALC|Lilu"
```

If all 3 show up, you're good to go. And make sure VoodooHDA **is not present**. This will conflict with AppleALC otherwise.

If you're having issues, see the [Troubleshooting section](/post-install/audio.md#Troubleshooting)

## Finding your layout ID

So for this example, we'll assume your codec is ALC1220. To verify yours, you have a couple options:

* Checking motherboard's spec page and manual
* Check DeviceManager in Windows
* Run `cat` in terminal on Linux
  * `cat /proc/asound/card0/codec#0 | less`

Now with a codec, we'll want to cross reference it with AppleALC's supported codec list:

* [AppleALC Supported Codecs](https://github.com/acidanthera/AppleALC/wiki/Supported-codecs)

With the ALC1220, we get the following:

```text
0x100003, layout 1, 2, 3, 5, 7, 11, 13, 15, 16, 21, 27, 28, 29, 34
```

So from this it tells us 2 things:

* Which hardware revision is supported(`0x100003`), only relevant when multiple revisions are listed with different layouts
* Various layout IDs supported by our codec(`layout 1, 2, 3, 5, 7, 11, 13, 15, 16, 21, 27, 28, 29, 34`)

Now with a list of supported layout IDs,  we're ready to try some out

**Note**: If your Audio Codec is ALC 3XXX this is likely false and just a rebranded controller, do your research and see what the actual controller is.

* An example of this is the ALC3601, but when we load up Linux the real name is shown: ALC 671

## Testing your layout

To test out our layout IDs, we're going to be using the boot-arg `alcid=xxx` where xxx is your layout. Remember that to try layout IDs **one at a time**. Do not add multiple IDs or alcid boot-args, if one doesn't work then try the next ID and etc

```text
config.plist
├── NVRAM
  ├── Add
    ├── 7C436110-AB2A-4BBB-A880-FE41995C9F82
          ├── boot-args | String | alcid=11
```

## Making Layout ID more permanent

Once you've found a Layout ID that works with your hack, we can create a more permanent solution for closer to how real macs set their Layout ID.

With AppleALC, there's a priority hierarchy with which properties are prioritized:

1. `alcid=xxx` boot-arg, useful for debugging and overrides all other values
2. `alc-layout-id` in DeviceProperties, recommended for AppleALC
3. `layout-id` in DeviceProperties, same property Macs use

As we can see in [AppeALC's source](https://github.com/acidanthera/AppleALC/blob/master/AppleALC/kern_alc.cpp#L189-L192), it expects your layout ID to be set via `alc-layout-id` so to make things easier on AppleALC we'll set it with DeviceProperties

To start, we'll need to find out where our Audio controller is located on the PCI map. For this, we'll be using a handy tool called [gfxutil](https://github.com/acidanthera/gfxutil/releases) then with the macOS terminal:

```text
path/to/gfxutil -f HDEF
```

Then add this PciRoot with the child `alc-layout-id` to your config.plist under DeviceProperties -> Add:

![](/images/post-install/audio-md/config-layout-id.png)

Note that the value is in HEX/Data, you can use a simple [decimal to hexadecimal calculator](https://www.rapidtables.com/convert/number/decimal-to-hex.html) to find yours. `printf '%x\n' DECI_VAL`:

![](/images/post-install/audio-md/hex-convert.png)

So in this example, `alcid=11` would become `alc-layout-id | Data | <0B000000>`

Note that the final value should be 4 bytes in total(ie. `0B 00 00 00` ), for layout IDs surpassing 255(`FF 00 00 00`) will need to remember that the bytes are swapped. So 256 will become `FF 01 00 00`

## Miscellaneous issues

**No Mic on AMD**:

* This is a common issue with when running AppleALC with AMD, specifically no patches have been made to support Mic input. At the moment the "best" solution is to either buy a USB DAC/Mic or go the VoodooHDA.kext method. Problem with VoodooHDA is that it's been known to be unstable and have worse audio quality than AppleALC

**Same layout ID from Clover doesn't work on OpenCore**

This is likely do to IRQ conflicts, on Clover there's a whole sweep of ACPI hot-patches that are applied automagically. Fixing this is a little bit painful but [SSDTTime](https://github.com/corpnewt/SSDTTime)'s `FixHPET` option can handle most cases.

For odd cases where RTC and HPET take IRQs from other devices like USB and audio, you can reference the [HP Compaq DC7900 ACPI patch](https://github.com/khronokernel/trashOS/blob/master/HP-Compaq-DC7900/README.md#dsdt-edits) example in the trashOS repo

## Troubleshooting

So for troubleshooting, we'll need to go over a couple things:

* [Checking if you have the right kexts](#checking-if-you-have-the-right-kexts)
* [Checking if AppleALC is patching correctly](#checking-if-applealc-is-patching-correctly)
* [Checking AppleHDA is vanilla](#checking-applehda-is-vanilla)

#### Checking if you have the right kexts

o start, we'll assume you already have Lilu and AppleALC installed, if you're unsure if it's been loaded correctly you can run the following in terminal(This will also check if AppleHDA is loaded, as without this AppleALC has nothing to patch):

```text
kextstat | grep -E "AppleHDA|AppleALC|Lilu"
```

If all 3 show up, you're good to go. And make sure VoodooHDA **is not present**. This will conflict with AppleALC otherwise. Other kexts to make sure you do not have in your system:

* realtekALC.kext
* CloverALC.kext
* VoodooHDA.kext
* HDA Blocker.kext
* HDAEnabler#.kext(# can be 1, 2, or 3)

> Hey Lilu and/or AppleALC aren't showing up

Generally the best place to start is by looking through your OpenCore logs and seeing if Lilu and AppleALC injected correctly:

```text
14:354 00:020 OC: Prelink injection Lilu.kext () - Success
14:367 00:012 OC: Prelink injection AppleALC.kext () - Success
```

If it says failed to inject:

```text
15:448 00:007 OC: Prelink injection AppleALC.kext () - Invalid Parameter
```

Main places you can check as to why:

* **Injection order**: Make sure that Lilu is above AppleALC in kext order
* **All kexts are latest release**: Especially important for Lilu plugins, as mismatched kexts can cause issues

Note: To setup file logging, see [OpenCore Debugging](https://dortania.github.io/OpenCore-Desktop-Guide/troubleshooting/debug.html).

#### Checking if AppleALC is patching correctly

So with AppleALC, one of the most easiest things to check if the patching was done right was to see if your audio controller was renamed correctly. Grab [IORegistryExplorer](https://github.com/toleda/audio_ALCInjection/blob/master/IORegistryExplorer_v2.1.zip) and see if you have an HDEF device:

![](/images/post-install/audio-md/hdef.png)

As you can see from the above image, we have the following:

* HDEF Device meaning our rename did the job
* AppleHDAController attached meaning Apple's audio kext attached successfully
* `alc-layout-id` is a property showing our boot-arg/DeviceProperty injection was successful
  * Note: `layout-id | Data | 07000000` is the default layout, and `alc-layout-id` will override it and be the layout AppleHDA will use

Note: **Do not rename your audio controller manually**, this can cause issues as AppleALC is trying to patch already. Let AppleALC do it's work.

**More examples**:

* Correct vs Incorrect layout IDs:

Correct alc-layout-id           |  Incorrect alc-layout-id
:-------------------------:|:-------------------------:
![](/images/post-install/audio-md/right-layout.png)  |  ![](/images/post-install/audio-md/wrong-layout.png)

As you can see from the above 2, the right image is missing a lot of AppleHDAInput devices, meaning that AppleALC can't match up your physical ports to something it can understand and output to. This means you've got some work to find the right layout ID for your system.

#### Checking AppleHDA is vanilla

This section is mainly relevant for those who were replacing the stock AppleHDA with a custom one, this is going to verify whether or not yours is genuine:

```text
sudo kextcache -i / && sudo kextcache -u /
```

This will check if the signature is valid for AppleHDA, if it's not then you're going to need to either get an original copy of AppleHDA for your system and replace it or update macOS(kexts will be cleaned out on updates). This will only happen when you're manually patched AppleHDA so if this is a fresh install it's highly unlikely you will have signature issues.
