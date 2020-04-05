# Fixing KASLR slide values

* Supported version: 0.5.7

## Fixing KASLR slide values

This section is for users who wish to understand and fix "Couldn't allocate runtime area" errors. This is most common with either Z390, X99 and X299. This section will also support Clover as the info is also useful for them.

## So what is KASLR?

Well KASLR stands for Kernel address space layout randomization, what it's used for is security purposes. Specifically, this makes it much harder for attackers to figure out where the important objects are in memory as it's always random both between machines and between boots. [M](https://www.youtube.com/watch?v=dQw4w9WgXcQ)[ore in-depth explainer on KASLR](https://lwn.net/Articles/569635/)

Where this becomes an issue is when you introduce devices with either small memory maps or just way too many devices present. There likely is space for the kernel to operate but there's also free space where the kernel won't fit entirely. This is where `slide=xxx` fits in. Instead of letting macOS choose a random area to operate in each boot, we'll constrain it to somewhere that we know will work.

## And who is this info for?

Well as I mentioned earlier, this is for users who don't have enough space for the kernel or moves to a place that is too small. You'll generally experience an error similar to this when booting:

```text
Error allocating 0x1197b pages at 0x0000000017a80000 alloc type 2
Couldn't allocate runtime area
```

With some variation:

```text
Only 244/256 slide values are usable!
```

Or even crashes while running macOS:

```text
panic(cpu 6 caller 0xffffff801fc057ba): a freed zone element has been modified in zone kalloc.4096: expected 0x3f00116dbe8a46f6 but found 0x3f00116d00000000
```

The best part about these errors is that they can be random, also the reason why power cycling your PC 20 times also can fix the issue but only temporarily.

Fun Fact: It takes around 31 ms to find an area to operate in, manually setting a slide value can on average can reduce boot times by 0.207%!!!

## So how do I fix this?

The real fix to this is quite simple actually, the process is both the same for Clover and OpenCore users. What you'll need:

* Clover users:
  * [AptioMemoryFix](https://github.com/acidanthera/AptioFixPkg/releases)(Don't mix Aptio fixes together or use OsxAptioFixDrvX, only AptioMemoryFix is supported in this guide)
  * Clover Shell(most users already have this included, usually called shell64.efi or some variation)
* OpenCore users:
  * [OpenRuntime](https://github.com/acidanthera/OpenCorePkg/releases)
  * [OpenShell](https://github.com/acidanthera/OpenCorePkg/releases)(Don't forget to enable this under `Root->Misc->Tools`)
  * Config.plist settings:
    * AvoidRuntimeDefrag: `YES`
       * Fixes UEFI runtime services like date, time, NVRAM, etc
    * DevirtualiseMmio: `YES`
       * Reduces stolen memory footprint so we're given more options for slide values, **do not use on AMD CPU based systems**
    * EnableSafeModeSlide: `YES`
       * Allows us to use slide in safe mode, just so if you have other issues troubleshooting won't mess it up.
    * EnableWriteUnprotector: `YES`
       * Allows us to write to certain areas that the firmware locks, specifically the CR0 register.
	* ProtectUefiServices: `YES`
	   * This is extremly important to enable on Icelake and Coffeelake machines, otherwise DevirtualiseMmio will not work due to memory protetions in place
    * ProvideCustomSlide: `YES`
       * Kinda need that slide to do any real work.
    * SetupVirtualMap: `YES`
       * Creates a layer between macOS and your memory map for greater support and fewer chances of insecure write access.
    * RebuildAppleMemoryMap: `YES`
       * Fixes issues with very large memory maps that don't fit, very useful for X99 and X299 platforms and sometimes for Z390.

## Prepping the BIOS

The reason we need to reset the memory map is we want it to be more deterministic, what I mean by this is that there will be less variation on each boot so we have fewer edge cases(Memory Maps are not always consistent on boots). To prep:

* Update BIOS(extremely important as early BIOS's shipped are known to have memory map issues, especially with Z390)
* Clear CMOS
* Enable much needed BIOS settings:
  * `Above4GDecoding`: This allows devices to use memory regions above 4GB meaning macOS will have more room to fit, can be problematic on some X99, X299 so recommended to test with and without.
  * `Boot Options -> Windows8.1/10 mode`: This will make sure no old legacy garbage is loaded. Fun fact, `other OS` is only designed for booting older versions of Windows and not for other OS.
* Disable as many unneeded devices in the BIOS(this means there is less variation in the map on each boot, so fewer chances of boot failure). Common settings:
  * `CSM`: For legacy support, adds a bunch of garbage we don't want. This also can break the shell so you can't boot into it.
  * `Intel SGX`: Software Guard Extensions, takes up a lot of space and does nothing in macOS.
  * `Parallel Port`: macOS can't even see parallel.
  * `Serial Port`: I'd like to know how many of you are debugging the kernel...
  * `iGPU`: Not ideal but some systems have such bloated maps that the iGPU just can't fit.
  * `Thunderbolt`: Many hacks don't have thunderbolt working, boards that don't have thunderbolt but have this option just waste more space.
  * `LED lighting`: Sorry mate, time to go.
  * `Legacy USB`: More Legacy Crap.

## Finding the Slide value

Now what you'll want to do is open the EFI shell in your boot manager of choice and run `memmap`. This will give you a list of all pages and their sizes. This is where the fun begins.

Example of what you'll see:

| Type | Start | End | \# Pages | Attributes |
| :--- | :--- | :--- | :--- | :--- |
| RT\_Data | 0000000000000000 | 0000000000000FFF | 0000000000000001 | 800000000000000F |
| Available | 0000000000001000 | 0000000000057FFF | 0000000000000057 | 000000000000000F |
| Reserved | 0000000000058000 | 0000000000058FFF | 0000000000000001 | 000000000000000F |
| Available | 0000000000059000 | 000000000008FFFF | 0000000000000037 | 000000000000000F |
| RT\_Code | 0000000000090000 | 0000000000090FFF | 0000000000000001 | 800000000000000F |
| Available | 0000000000091000 | 000000000009DFFF | 000000000000000D | 000000000000000F |
| Reserved | 000000000009E000 | 000000000009FFFF | 0000000000000002 | 000000000000000F |
| Available | 0000000000100000 | 000000005B635FFF | 000000000005B536 | 000000000000000F |
| BS\_Data | 000000005B636000 | 000000005B675FFF | 0000000000000040 | 000000000000000F |
| Available | 000000005B676000 | 000000006AF77FFF | 000000000000F902 | 000000000000000F |
| LoaderCode | 000000006AF78000 | 000000006B155FFF | 00000000000001DE | 000000000000000F |
| BS\_Data | 000000006B156000 | 000000006B523FFF | 00000000000003CE | 000000000000000F |
| ACPI\_NVS | 000000006B524000 | 000000006B524FFF | 0000000000000001 | 000000000000000F |
| BS\_Data | 000000006B526000 | 000000006B625FFF | 0000000000000100 | 000000000000000F |
| Available | 000000006B626000 | 000000006B634FFF | 000000000000000F | 000000000000000F |

Now you may be wondering how the hell we convert this to a slide value, well it's quite simple. What we're interested in is the largest available value within the `Start` column. In this example we see that `000000006B626000` is our largest, do note that these are in HEX so if there are multiple values close to each other you may need to convert them to decimal. To the calculate slide value(macOS's built-in calculator has a programming function by pressing ⌘+3):

`000000006B626000` = `0x6B626000`

(`0x6B626000` - `0x100000`)/`0x200000` = `0x35A`

And to verify that this is correct:

`0x100000` + (`0x35A` * `0x200000`) = `0x6B500000`

Whenever the returned value is **not** the original(`0x6B500000` vs `0x6B626000`), just add +1 to your final slide value. This is due to rounding. So for example `0x35A` converted to decimal becomes `858` and then +1 will give you `slide=859`.

> But wait for just a second, this is higher than 256!

That is correct, this is caused by memory maps that include `Above4GDecoding` sectors which cannot be used. So you will need to keep going down the list until you find a small enough value(for us that would be `0000000000100000`).

And just to make it a bit clearer on the formula:

(HEX - `0x100000`)/`0x200000` = Slide Value in HEX

`0x100000` + (Slide Value in HEX * `0x200000`) = Your original HEX value(if not then add +1 to your slide value)

Now navigate into your config.plist and add your slide value with the rest of your boot arguments(for us it would be `slide=0` when using `0x100000`). If this value still gives you errors then you may proceed to the second-largest `Start` value and so on.

Sometimes you may find that when you calculate slide that you receive super small vales like `slide=-0.379150390625`, when this happens round this to `slide=0`.

And for users who are having issues finding their slide value can also type `$slide [insert largest #Pages value]` in the #Sandbox channel on the [r/Hackintosh Discord](https://discord.gg/u8V7N5C)

> But this is soooooo hard

Well fret not, for there is a simple solution. After running `memmap` in the shell, run:

```text
shell> fs0: //replace with your USB

fs0:\> dir //to verify this is the right directory, if not try fs1 and so on

Directory of fs0:\
01/01/01 3:30p   EFI

fs0:\> memmap > memmap.txt
```

This will add a `memmap.txt` file to the root of your EFI, you can then proceed to drop it into the r/Hackintosh discord in the #Sandbox channel and type `$slide [insert a link to memmap.txt]`

