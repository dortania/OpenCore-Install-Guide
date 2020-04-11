# Fixing audio with AppleALC

* Supported version: 0.5.7

So to start, we'll assume you already have Lilu and AppleALC installed, if you're unsure if it's been loaded correctly you can run the following in terminal(This will also check if AppleHDA is loaded, as without this AppleALC has nothing to patch):

```text
kextstat | grep -E "AppleHDA|AppleALC|Lilu"
```

If all 3 show up, you're good to go. And make sure VoodooHDA **is not present**. This will conflict with AppleALC otherwise

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

## Testing your layout

To test out our layout IDs, we're going to be using the boot-arg `alcid=xxx` where xxx is your layout. Remember that to try layout IDs **one at a time**. Do not add multiple IDs or alcid boot-args, if one doesn't work then try the next ID and etc

```text
NVRAM
├── Add
   ├── 7C436110-AB2A-4BBB-A880-FE41995C9F82
      ├── bootargs | String | alcid=11
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


## Miscellaneous issues

**No Mic on AMD**:

* This is a common issue with when running AppleALC with AMD, specifically no patches have been made to support Mic input. At the moment the "best" solution is to either buy a USB DAC/Mic or go the VoodooHDA.kext method. Problem with VoodooHDA is that it's been known to be unstable and have worse audio quality than AppleALC

**Same layout ID from Clover doesn't work on OpenCore**

This is likely do to IRQ conflicts, on Clover there's a whole sweep of ACPI hot-patches that are applied automagically. Fixing this is a little bit painful but [SSDTTime](https://github.com/corpnewt/SSDTTime)'s `FixHPET` option can handle most cases.

For odd cases where RTC and HPET take IRQs from other devices like USB and audio, you can reference the [HP Compaq DC7900 ACPI patch](https://github.com/khronokernel/trashOS/blob/master/HP-Compaq-DC7900/README.md#dsdt-edits) example in the trashOS repo
