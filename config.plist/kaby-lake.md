# Kaby Lake

## Starting Point

You'll want to start with the sample.plist that OpenCorePkg provides you and rename it to config.plist. Next open up your favorite XML editior like Xcode and we can get to work

## ACPI

![ACPI](https://i.imgur.com/gV01AMC.png)

**Add:**

This is where you'll add SSDT patches for your system, these are most useful for laptops and OEM desktops but also common for [USB maps](https://usb-map.gitbook.io/project/), [disabling unsupported GPUs](https://github.com/khronokernel/Opencore-Vanilla-Desktop-Guide/tree/48f92fab034e4d2512d623e3590eb7c9e6fd46e6/config.plist/Disable%20Unsupported%20GPUs/README.md) and such

**Block**

This drops certain ACPI tabes from loading, for us we can ignore this

**Patch**:

This section allows us to dynamically rename parts of the DSDT via OpenCore. Since we're not running a real mac, and macOS is pretty particular with how things are named, we can make non-destructive changes to keep things mac-friendly. We have three entries here:

* _change XHCI to XHC_ - helps avoid a conflict with built-in USB injectors
* _change XHC1 to XHC_ - helps avoid a conflict with built-in USB injectors
* _change SAT0 to SATA_ - for potential SATA compatibility

​

| Name | Find | Replace |
| :--- | :--- | :--- |
| change XHCI to XHC | 58484349 | 5848435f |
| change XHC1 to XHC | 58484331 | 5848435f |
| change SAT0 to SATA | 53415430 | 53415441 |

​

**Quirk**: Settings for ACPI.

* **FadtEnableReset**: Enable reboot and shutdown on legacy hardware, not recommended unless needed
* **NormalizeHeaders**: Cleanup ACPI header fields, irrelevant for macOS Mojave 10.14 and higher
* **RebaseRegions**: Attempt to heuristically relocate ACPI memory regions
* **ResetHwSig**: Needed for hardware that fail fail to maintain hardware signature across the reboots and cause issues with waking from hibernation
* ResetLogoStatus: Workaround for systems running BGRT tables, most don't have to worry about this

## DeviceProperties

![DeviceProperties](https://i.imgur.com/pmnjhrp.png)

**Add**: Sets device properties from a map.

This section is setup via Headkaze's [_Intel Framebuffer Patching Guide_](https://www.insanelymac.com/forum/topic/334899-intel-framebuffer-patching-using-whatevergreen/?tab=comments#comment-2626271) and applies only one actual property to begin, which is the _ig-platform-id_. The way we get the proper value for this is to look at the ig-platform-id we intend to use, then swap the pairs of hex bytes.

If we think of our ig-plat as `0xAABBCCDD`, our swapped version would look like `0xDDCCBBAA`

The two ig-platform-id's we use are as follows:

* `0x59120000` - this is used when the iGPU is used to drive a display
  * `00001259` when hex-swapped
* `0x59120003` - this is used when the iGPU is only used for compute tasks, and doesn't drive a display
  * `03001259` when hex-swapped

We also add 2 more properties, framebuffer-patch-enable and framebuffer-stolenmem. The first enables patching via WhateverGreen.kext, and the second sets the min stolen memory to 19MB.

`PciRoot(0x0)/Pci(0x1b,0x0)` -&gt; `Layout-id`

* Applies AppleALC audio injection, you'll need to do your own research on which codec your motherboard has and match it with AppleALC's layout. [AppleALC Supported Codecs](https://github.com/acidanthera/AppleALC/wiki/Supported-codecs).

Layout=5 would be interprected as `05000000`

**Block**: Removes device properties from map, for us we can ignore this

## Kernel

![Kernel](https://i.imgur.com/PzdPNaR.png)

**Add**: Here's where you specify which kexts to load, order matters here so make sure Lilu.kext is always first! Other higher priority kexts come after Lilu such as, VirtualSMC, AppleALC, WhateverGreen, etc.

**Emulate**: Needed for spoofing unsupported CPUs like Pentiums and Celerons

* **CpuidMask**: When set to Zero, original CPU bit will be used
* **CpuidData**: The value for the CPU spoofing, don't forget to swap hex

**Block**: Blocks kexts from loading. Sometimes needed for disabling Apple's trackpad driver for some laptops.

**Patch**: Patches kexts \(this is where you would add USB port limit patches and AMD CPU patches\).

**Quirks**:

* **AppleCpuPmCfgLock**: \(Only needed when CFG-Lock can't be disabled in BIOS, Clover counter part would be AppleICPUPM\)
* **AppleXcpmCfgLock**: \(Only needed when CFG-Lock can't be disabled in BIOS, Clover counter part would be KernelPM\)
* **AppleXcpmExtraMsrs**: \(Disables multiple MSR access needed for unsupported CPUs like Pentiums and certain Xeons\)
* **CustomSMBIOSGuid**: \(Performs GUID patching for UpdateSMBIOSMode Custom mode. Usually relevant for Dell laptops\)
* **DisableIOMapper**: \(Needed to get around VT-D if unable to disable in BIOS, can interfere with Firmware so avoid when possible\)
* **ExternalDiskIcons**: \(External Icons Patch, for when internal drives are treated as external drives\)
* **LapicKernelPanic**: \(Disables kernel panic on AP core lapic interrupt, gerneally needed for HP systems\)
* **PanicNoKextDump**: \(Allows for reading kernel panics logs when kernel panics occurs\)
* **ThirdPartyTrim**: \(Enables TRIM, not needed for AHCI or NVMe SSDs\)
* **XhciPortLimit**: \(This is actually the 15 port limit patch, don't rely on it as it's not a guaranteed solution for fixing USB. Please create a [USB map](https://usb-map.gitbook.io/project/) when possible. Its a temporary solution for those who have yet to create a USB map\)

## Misc

![Misc](https://i.imgur.com/DsCDziN.png)

**Boot**: Settings for boot screen \(leave as-is unless you know what you're doing\)

* **Timeout**: This sets how long OpenCore will wait until it automatically boots from the default selection
* **ShowPicker**: Needed for seeing your availble drives
* **UsePicker**: Uses OpenCore's default GUI, set to NO if you wish to use a different GUI

**Debug**: Debug has special use cases, leave as-is unless you know what you're doing.

* **DisableWatchDog**: NO \(May need to be set for YES if macOS is stalling on something while booting, generally avoid unless troubleshooting

**Security**: Security is pretty self-explanatory.

* **RequireSignature**: We won't be dealing vault.plist so we can ignore
* **RequireVault**: We won't be dealing vault.plist so we can ignore as well
* **ScanPolicy**: This allow you to see all drives available, please refer to OpenCore's DOC for furthur info on setting up ScanPolicy

**Tools** Used for running OC debugging tools like clearing NVRAM, we'll be ignoring this

## NVRAM

![NVRAM](https://i.imgur.com/uyLE6Cx.png)

**Add**: 4D1EDE05-38C7-4A6A-9CC6-4BCCA8B38C14 \(Booter Path, majority can ignore but \)

* **UIScale**:
  * 01: 1080P
  * 10: 2160P\(Enables HIDPI\)

7C436110-AB2A-4BBB-A880-FE41995C9F82 \(System Integrity Protection bitmask\)

* **boot-args**:
  * -v - this enables verbose mode, which shows all the behind-the-scenes text that scrolls by as you're booting instead of the Apple logo and progress bar.  It's invaluable to any Hackintosher, as it gives you an inside look at the boot process, and can help you identify issues, problem kexts, etc.
  * dart=0 - this is just an extra layer of protection against Vt-d issues.

    debug=0x100 - this prevents a reboot on a kernel panic. That way you can \(hopefully\) glean some useful info and follow the breadcrumbs to get past the issues.

  * keepsyms=1 - this is a companion setting to debug=0x100 that tells the OS to also print the symbols on a kernel panic. That can give some more helpful insight as to what's causing the panic itself.
  * shikigva=40 - this flag is specific to the iGPU.  It enables a few Shiki settings that do the following \(found [here](https://github.com/acidanthera/WhateverGreen/blob/master/WhateverGreen/kern_shiki.hpp#L35-L74)\):
    * 8 - AddExecutableWhitelist - ensures that processes in the whitelist are patched.
    * 32 - ReplaceBoardID - replaces board-id used by AppleGVA by a different board-id.
* **csr-active-config**: Settings for SIP, generally recommeded to manully change this within Recovery partition with `csrutil` via the recovery partition

csr-active-config is set to `E7030000` which effectively disables SIP. You can choose a number of other options to enable/disable sections of SIP. Some common ones are as follows:

* `00000000` - SIP completely enabled
* `30000000` - Allow unsigned kexts and writing to protected fs locations
* `E7030000` - SIP completely disabled
* **nvda\_drv**: &lt;&gt; \(For enabling Nvidia WebDrivers, set to 31 if running a [Maxwell or Pascal GPU](https://github.com/khronokernel/Catalina-GPU-Buyers-Guide/blob/master/README.md#Unsupported-nVidia-GPUs). This is the same as setting nvda\_drv=1 but instead we translate it from [text to hex](https://www.browserling.com/tools/hex-to-text)\)
* **prev-lang:kbd**: &lt;&gt; \(Needed for non-latin keyboards\)

**Block**: Forcibly rewrites NVRAM variables, not needed for us as `sudo nvram` is prefered but useful for those edge cases

**LegacyEnable** Allows for NVRAM to be stored on nvram.plist, needed for systems without native NVRAM

**LegacySchema** Used for assigning NVRAM variables, used with LegacyEnable set to YES

## Platforminfo

![PlatformInfo](https://i.imgur.com/O7UJpn7.png)

For setting up the SMBIOS info, I use acidanthera's [_macserial_](https://github.com/acidanthera/macserial) application. I wrote a [_python script_](https://github.com/corpnewt/GenSMBIOS) that can leverage it as well \(and auto-saves to the config.plist when selected\). There's plenty of info that's left blank to allow OpenCore to fill in the blanks; this means that updating OpenCore will update the info passed, and not require you to also update your config.plist.

For this Kaby Lake example, I chose the iMac18,1 SMBIOS - this is done intentionally for compatibility's sake. There are two main SMBIOS used for Kaby Lake:

* `iMac18,1` - this is used for computers utilizing the iGPU for displaying.
* `iMac18,3` - this is used for computers using a dGPU for displaying, and an iGPU for compute tasks only.

To get the SMBIOS info generated with macserial, you can run it with the -a argument \(which generates serials and board serials for all supported platforms\). You can also parse it with grep to limit your search to one SMBIOS type.

With our iMac18,1 example, we would run macserial like so via the terminal:

`macserial -a | grep -i iMac18,1`

Which would give us output similar to the following:

```text
  iMac18,1 | C02T8SZNH7JY | C02707101J9H69F1F
  iMac18,1 | C02VXBYDH7JY | C02753100GUH69FCB
  iMac18,1 | C02T7RY6H7JY | C02706310GUH69FA8
  iMac18,1 | C02VD07ZH7JY | C02737301J9H69FCB
  iMac18,1 | C02TQPYPH7JY | C02720802CDH69FAD
  iMac18,1 | C02VXYYVH7JY | C02753207CDH69FJC
  iMac18,1 | C02VDBZ0H7JY | C02737700QXH69FA8
  iMac18,1 | C02VP0H6H7JY | C02746300CDH69FJA
  iMac18,1 | C02VL0W9H7JY | C02743303CDH69F8C
  iMac18,1 | C02V2NYMH7JY | C02728600J9H69FAD
```

The order is Product \| Serial \| Board Serial \(MLB\)

The `iMac18,1` part gets copied to Generic -&gt; SystemProductName.

The `Serial` part gets copied to Generic -&gt; SystemSerialNumber.

The `Board Serial` part gets copied to SMBIOS -&gt; Board Serial Number as well as Generic -&gt; MLB.

We can create an SmUUID by running `uuidgen` in the terminal \(or it's auto-generated via my GenSMBIOS script\) - and that gets copied to Generic -&gt; SystemUUID.

We set Generic -&gt; ROM to either an Apple ROM \(dumped from a real Mac\), your NIC MAC address, or any random MAC address \(could be just 6 random bytes, for this guide we'll use `11223300 0000`\)

**Automatic**: YES \(Generates PlatformInfo based on Generic section instead of DataHub, NVRAM, and SMBIOS sections\)

**UpdateDataHub**: Update Data Hub fields when newer versions are available from OpenCore

**UpdateNVRAM**: Update NVRAM fields when newer versions are available from OpenCore

**UpdateSMBIOS**: Updates SMBIOS fields when newer versions are available from OpenCore

**UpdateSMBIOSMode**: Create \(Replace the tables with newly allocated EfiReservedMemoryType\)

## UEFI

![UEFI](https://i.imgur.com/uAoUtZs.png)

**ConnectDrivers**: YES \(Forces .efi drivers, change to NO for faster boot times but cerain file system drivers may not load\)

**Drivers**: Add your .efi drivers here

**Protocols**:

* **AppleBootPolicy**: Ensures APFS compatibility on VMs or legacy Macs, not needed since we're running bare-metal
* **ConsoleControl**: Replaces Console Control protocol with a builtin version, needed for when firmware doesn’t support text output mode
* **DataHub**: Reinstalls Data Hub
* **DeviceProperties**: Ensures full compatibility on VMs or legacy Macs, not needed since we're running bare-metal

**Quirks**:

* **ExitBootServicesDelay**: Only required for very specifc use cases like setting to `5` for ASUS Z87-Pro running FileVault2
* **IgnoreInvalidFlexRatio**: Fix for when MSR\_FLEX\_RATIO \(0x194\) can't be disabled in the BIOS, required for all pre-skylake based systems
* **IgnoreTextInGraphics**: Fix for UI corruption when both text and graphics outputs happen, set to YES with SanitiseClearScreen also set to YES for pure Apple Logo\(no verbose screen\)
* **ProvideConsoleGop**:Enables GOP\(Graphics output Protcol\) which the macOS bootloader requires for console handle, AptioMemoryFix currently offers this but will soon be removed
* **ReleaseUsbOwnership**: Releases USB controller from firmware driver, avoid unless you know what you're doing
* **RequestBootVarRouting**: Redirects AptioMemeoryFix from EFI\_GLOBAL\_VARIABLE\_G to OC\_VENDOR\_VARIABLE\_GUID. Needed for when firmware tries to delete boot entries
* **SanitiseClearScreen**: Fixes High resolutions displays that display OpenCore in 1024x768

