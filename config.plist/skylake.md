# Skylake

## Starting Point

You'll want to start with the sample.plist that OpenCorePkg provides you and rename it to config.plist. Next open up your favorite XML editior like Xcode and we can get to work

## ACPI

![ACPI](https://i.imgur.com/ByHZn1D.png)

The above ACPI patch is only an example, please read below for more info

**Add:**

This is where you'll add SSDT patches for your system, these are most useful for laptops and OEM desktops but also common for [USB maps](https://usb-map.gitbook.io/project/), [disabling unsupported GPUs](https://khronokernel-4.gitbook.io/disable-unsupported-gpus/) and such

**Block**

This drops certain ACPI tabes from loading, for us we can ignore this

**Patch**:

This section allows us to dynamically modify parts of the ACPI (DSDT, SSDT, etc.) via OpenCore. macOS usually does not care much about ACPI, so in the majority of the cases you need to do nothing here. For those who need DSDT patches for things like EHCI controllers can utilize the [SSDT-EHCx_ODD.dsl](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-EHCx_OFF.dsl) or use similar Device Property patching like what's seen with Framebuffer patching

And to grab the location of such devices can use [gfxutil](https://github.com/acidanthera/gfxutil/releases)

**Quirk**: Settings for ACPI.

* **FadtEnableReset**: Enable reboot and shutdown on legacy hardware, not recommended unless needed
* **NormalizeHeaders**: Cleanup ACPI header fields, only relevant for macOS High Sierra 10.13
* **RebaseRegions**: Attempt to heuristically relocate ACPI memory regions, not needed unless custom DSDT is used.
* **ResetHwSig**: Needed for hardware that fail fail to maintain hardware signature across the reboots and cause issues with waking from hibernation
* **ResetLogoStatus**: Workaround for OEM Windows logo not drawing on systems with BGRT tables.

## DeviceProperties

![DeviceProperties](https://i.imgur.com/N44BEKs.png)

**Add**: Sets device properties from a map.

This section is setup via Headkaze's [_Intel Framebuffer Patching Guide_](https://www.insanelymac.com/forum/topic/334899-intel-framebuffer-patching-using-whatevergreen/?tab=comments#comment-2626271) and applies only one actual property to begin, which is the _ig-platform-id_. The way we get the proper value for this is to look at the ig-platform-id we intend to use, then swap the pairs of hex bytes.

If we think of our ig-plat as `0xAABBCCDD`, our swapped version would look like `DDCCBBAA`

The two ig-platform-id's we use are as follows:

* `0x19120000` - this is used when the iGPU is used to drive a display
  * `00001219` when hex-swapped
* `0x19120001` - this is used when the iGPU is only used for compute tasks, and doesn't drive a display
  * `01001219` when hex-swapped

We also add 2 more properties, framebuffer-patch-enable and framebuffer-stolenmem. The first enables patching via WhateverGreen.kext, and the second sets the min stolen memory to 19MB. This is usually unnecessary, as this can be configured in BIOS.

`PciRoot(0x0)/Pci(0x1b,0x0)` -&gt; `Layout-id`

* Applies AppleALC audio injection, you'll need to do your own research on which codec your motherboard has and match it with AppleALC's layout. [AppleALC Supported Codecs](https://github.com/acidanthera/AppleALC/wiki/Supported-codecs).

Keep in mind that some motherboards have different device locations, you can find yours by either examining the device tree in IOReg or using [GFXutil](https://github.com/acidanthera/gfxutil/releases)

Layout=5 would be interprected as `05000000`

**Block**: Removes device properties from map, for us we can ignore this

## Kernel

![Kernel](https://i.imgur.com/l1pu0cJ.png)

**Add**: Here's where you specify which kexts to load, order matters here so make sure Lilu.kext is always first! Other higher priority kexts come after Lilu such as, VirtualSMC, AppleALC, WhateverGreen, etc.

**Emulate**: Needed for spoofing unsupported CPUs like Pentiums and Celerons

* CpuidMask: When set to Zero, original CPU bit will be used
* CpuidData: The value for the CPU spoofing, don't forget to swap hex

**Block**: Blocks kexts from loading. Sometimes needed for disabling Apple's trackpad driver for some laptops.

**Patch**: Patches kexts \(this is where you would add USB port limit patches and AMD CPU patches\).

**Quirks**:

* **AppleCpuPmCfgLock**: NO \(Only needed when CFG-Lock can't be disabled in BIOS, Clover counter part would be AppleICPUPM\)
* **AppleXcpmCfgLock**: NO \(Only needed when CFG-Lock can't be disabled in BIOS, Clover counter part would be KernelPM\)
* **AppleXcpmExtraMsrs**: NO \(Disables multiple MSR access needed for unsupported CPUs like Pentiums and certain Xeons\)
* **CustomSMBIOSGuid**: NO \(Performs GUID patching for UpdateSMBIOSMode Custom mode. Usually relevant for Dell laptops\)
* **DisableIOMapper**: YES \(Needed to get around VT-D if  either unable to disable in BIOS or needed for other operating systems\)
* **ExternalDiskIcons**: YES \(External Icons Patch, for when internal drives are treated as external drives but can also make USB drives internal. For NVMe on Z87 and below you just add built-in property via DeviceProperties.\)
* **LapicKernelPanic**: NO \(Disables kernel panic on AP core lapic interrupt, gerneally needed for HP systems\)
* **PanicNoKextDump**: YES \(Allows for reading kernel panics logs when kernel panics occurs\)
* **ThirdPartyTrim**: NO \(Enables TRIM, not needed for NVMe but AHCI based drives may require this. Please check under system report to see if your drive supports TRIM\)
* **XhciPortLimit**: YES \(This is actually the 15 port limit patch, don't rely on it as it's not a guaranteed solution for fixing USB. Please create a [USB map](https://usb-map.gitbook.io/project/) when possible. Its a temporary solution for those who have yet to create a USB map\)


## Misc

![Misc](https://i.imgur.com/unCluw5.png)

**Boot**: Settings for boot screen \(leave as-is unless you know what you're doing\)

* **Timeout**: This sets how long OpenCore will wait until it automatically boots from the default selection
* **ShowPicker**: Shows OpenCore's UI, needed for seeing your available drives or set to NO to follow default option
* **UsePicker**: Uses OpenCore's default GUI, set to NO if you wish to use a different GUI

**Debug**: Debug has special use cases, leave as-is unless you know what you're doing.

* **DisableWatchDog**: NO \(May need to be set for YES if macOS is stalling on something while booting, generally avoid unless troubleshooting

**Security**: Security is pretty self-explanatory.

* **RequireSignature**: We won't be dealing vault.plist so we can ignore
* **RequireVault**: We won't be dealing vault.plist so we can ignore as well
* **ScanPolicy**: `0` allows you to see all drives available, please refer to OpenCore's DOC for furthur info on setting up ScanPolicy(dedicated chapter to come)

**Tools** Used for running OC debugging tools like clearing NVRAM, we'll be ignoring this

## NVRAM

![NVRAM](https://i.imgur.com/wWQIh0w.png)

**Add**: 4D1EDE05-38C7-4A6A-9CC6-4BCCA8B38C14 \(Booter Path, majority can ignore but \)

* **UIScale**:
  * 01: 1080P
  * 02: 2160P\(Enables HIDPI\)

7C436110-AB2A-4BBB-A880-FE41995C9F82 \(System Integrity Protection bitmask\)

* **boot-args**:
  * `-v` - this enables verbose mode, which shows all the behind-the-scenes text that scrolls by as you're booting instead of the Apple logo and progress bar.  It's invaluable to any Hackintosher, as it gives you an inside look at the boot process, and can help you identify issues, problem kexts, etc.
  * `dart=0` - this is just an extra layer of protection against Vt-d issues, keep in mind this requires SIP to be disabled
  * `debug=0x100` - this prevents a reboot on a kernel panic. That way you can \(hopefully\) glean some useful info and follow the breadcrumbs to get past the issues.

  * `keepsyms=1` - this is a companion setting to debug=0x100 that tells the OS to also print the symbols on a kernel panic. That can give some more helpful insight as to what's causing the panic itself.
  * `shikigva=40` - this flag is specific to the iGPU.  It enables a few Shiki settings that do the following \(found [here](https://github.com/acidanthera/WhateverGreen/blob/master/WhateverGreen/kern_shiki.hpp#L35-L74)\):
    * 8 - AddExecutableWhitelist - ensures that processes in the whitelist are patched.
    * 32 - ReplaceBoardID - replaces board-id used by AppleGVA by a different board-id.
* **csr-active-config**: Settings for SIP, generally recommeded to manully change this within Recovery partition with `csrutil` via the recovery partition

csr-active-config is set to `E7030000` which effectively disables SIP. You can choose a number of other options to enable/disable sections of SIP. Some common ones are as follows:

* `00000000` - SIP completely enabled
* `30000000` - Allow unsigned kexts and writing to protected fs locations
* `E7030000` - SIP completely disabled
* **nvda\_drv**: &lt;&gt; \(For enabling Nvidia WebDrivers, set to 31 if running a [Maxwell or Pascal GPU](https://github.com/khronokernel/Catalina-GPU-Buyers-Guide/blob/master/README.md#Unsupported-nVidia-GPUs). This is the same as setting nvda\_drv=1 but instead we translate it from [text to hex](https://www.browserling.com/tools/hex-to-text)\)
* **prev-lang:kbd**: &lt;&gt; \(Needed for non-latin keyboards\)

**Block**: Forcibly rewrites NVRAM variables, not needed for us as `sudo nvram` is prefered but useful for those edge cases. Note that `Add` will not overwrite values already present in NVRAM

**LegacyEnable** Allows for NVRAM to be stored on nvram.plist, needed for systems without native NVRAM

**LegacySchema** Used for assigning NVRAM variables, used with LegacyEnable set to YES

## Platforminfo

![PlatformInfo](https://i.imgur.com/RKIXoi5.png)

For setting up the SMBIOS info, we'll use acidanthera's [_macserial_](https://github.com/acidanthera/macserial) application. 

For this Skylake example, we'll choose the _iMac17,1_ SMBIOS.

To get the SMBIOS info generated with macserial, you can run it with the `-a` argument \(which generates serials and board serials for all supported platforms\). You can also parse it with grep to limit your search to one SMBIOS type.

With our iMac17,1 example, we would run macserial like so via the terminal:

`macserial -a | grep -i iMac17,1`

Which would give us output similar to the following:

```text
  iMac17,1 | C02S8DY7GG7L | C02634902QXGPF7FB
  iMac17,1 | C02T4WZSGG7L | C02703104GUGPF71M
  iMac17,1 | C02QQAYPGG7L | C025474014NGPF7FB
  iMac17,1 | C02SNLZ3GG7L | C02645501CDGPF7AD
  iMac17,1 | C02QQRY8GG7L | C025474054NGPF71F
  iMac17,1 | C02QK1ZXGG7L | C02542200GUGPF7JC
  iMac17,1 | C02SL0YXGG7L | C026436004NGPF7JA
  iMac17,1 | C02QW0J5GG7L | C02552130QXGPF7JA
  iMac17,1 | C02RXDZYGG7L | C02626100GUGPF71H
  iMac17,1 | C02R4MYRGG7L | C02603200GUGPF7JA
```

The order is `Product | Serial | Board Serial (MLB)`

The `iMac17,1` part gets copied to Generic -&gt; SystemProductName.

The `Serial` part gets copied to Generic -&gt; SystemSerialNumber.

The `Board Serial` part gets copied to SMBIOS -&gt; Board Serial Number as well as Generic -&gt; MLB.

We can create an SmUUID by running `uuidgen` in the terminal \(or it's auto-generated via my GenSMBIOS script\) - and that gets copied to Generic -&gt; SystemUUID.

We set Generic -&gt; ROM to either an Apple ROM \(dumped from a real Mac\), your NIC MAC address, or any random MAC address \(could be just 6 random bytes, for this guide we'll use `11223300 0000`\)

**Automatic**: YES \(Generates PlatformInfo based on Generic section instead of DataHub, NVRAM, and SMBIOS sections\)

**UpdateDataHub**: Update Data Hub fields

**UpdateNVRAM**: Update NVRAM fields

**UpdateSMBIOS**: Updates SMBIOS fields

**UpdateSMBIOSMode**: Create \(Replace the tables with newly allocated EfiReservedMemoryType, use Custom on Dell laptops requiring CustomSMBIOSGuid quirk\)

## UEFI

![UEFI](https://i.imgur.com/Ockt9D2.png)

**ConnectDrivers**: YES \(Forces .efi drivers, change to NO will automatically connect added UEFI drivers. This can make booting slightly faster, but not all drivers connect themselves. E.g. certain file system drivers may not load.\)

**Drivers**: Add your .efi drivers here

**Protocols**:

* **AppleBootPolicy**: Ensures APFS compatibility on VMs or legacy Macs, not needed since we're running bare-metal
* **ConsoleControl**: Replaces Console Control protocol with a builtin version,  set to YES otherwise you may see text output during booting instead of nice Apple logo. Required for most APTIO firmwares
* **DataHub**: Reinstalls Data Hub
* **DeviceProperties**: Ensures full compatibility on VMs or legacy Macs, not needed since we're running bare-metal

**Quirks**:

* **ExitBootServicesDelay**: Only required for very specifc use cases like setting to `5` for ASUS Z87-Pro running FileVault2
* **IgnoreInvalidFlexRatio**: Fix for when MSR\_FLEX\_RATIO \(0x194\) can't be disabled in the BIOS, required for all pre-skylake based systems
* **IgnoreTextInGraphics**: Fix for UI corruption when both text and graphics outputs happen, set to YES with SanitiseClearScreen also set to YES for pure Apple Logo\(no verbose screen\)
* **ProvideConsoleGop**:Enables GOP\(Graphics output Protcol\) which the macOS bootloader requires for console handle, AptioMemoryFix currently offers this but will soon be removed
* **ReleaseUsbOwnership**: Releases USB controller from firmware driver, avoid unless you know what you're doing
* **RequestBootVarRouting**: Redirects AptioMemeoryFix from `EFI_GLOBAL_VARIABLE_GUID` to `OC\_VENDOR\_VARIABLE\_GUID`. Needed for when firmware tries to delete boot entries and is recommended to be enabled on all systems for correct update installation, Startup Disk control panel functioning, etc.
* **SanitiseClearScreen**: Fixes High resolutions displays that display OpenCore in 1024x768, required for select AMD GPUs on Z370

# Cleaning up

And now you're ready to save and place it into your EFI
