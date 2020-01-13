# Getting started with ACPI

## A quick explainer on ACPI and how to make SSDTs

So what are DSDTs and SSDTs? Well, these are tables present in your firmware that outline hardware devices like USB controllers, CPU threads, embedded controllers, system clocks and such. A DSDT\(Differentiated System Description Table\) can be seen as the body holding most of the info with smaller bits of info being passed by the SSDT\(Secondary System Description Table\)

> So why do we care about these tables?

macOS can be very picky about the devices present in the DSDT and so our job is to correct it. The main devices that need to be corrected for macOS to work properly:

* Embedded controllers\(EC\) 
  * All semi-modern intel machines have an EC exposed in their DSDT, with many AMD systems also having it exposed. These controllers are not compatible with macOS so then need to be hidden from macOS and replaced with a dummy EC when running macOS Catalina
* Plugin type
  * This is used to enable native CPU power management on Intel Haswell and newer CPUs, the SSDT will connect to the first thread of the CPU. For Intel CPUs only, for AMD see [NullCPUPowerManagement patch](https://github.com/khronokernel/Opencore-Vanilla-Desktop-Guide/blob/master/AMD/NullCPU-patch.md)
* AWAC system clock.
  * This applies to all 300 series motherboards including Z370 boards, the specific issue is that newer boards ship with AWAC clock enabled. This is a problem because macOS cannot communicate with AWAC clocks, so this requires us to either force on the Legacy RTC clock or if unavailable create a fake one for macOS to play with

## Getting a copy of our DSDT

So to get a copy of your DSDT there's a couple of options:

* [MaciASL](https://github.com/acidanthera/MaciASL/releases)
  * Open the app on the target machine and the system's DSDT will show, then File -&gt; SaveAs `System DSDT`. Make sure the file format is ACPI Machine Language Binary\(.AML\), this will require the machine to be running macOS
  * Do note that all ACPI patches from clover/OpenCore will be applied to the DSDT
* [SSDTTime](https://github.com/corpnewt/SSDTTime)
  * Supports both Windows and Linux for DSDT dumping
* [acpidump.exe](https://acpica.org/sites/acpica/files/iasl-win-20180105.zip)
  * In command prompt run `path/to/acpidump.exe -b -n DSDT -z`, this will dump your DSDT
* F4 in Clover Boot menu
  * DSDT can be found in `EFI/CLOVER/ACPI/origin`, the folder **must** exist before dumping
* [`acpidump.efi`](https://github.com/khronokernel/Opencore-Vanilla-Desktop-Guide/tree/master/extra-files/acpidump.efi.zip)
  * Add this to `EFI/OC/Tools` and in your config under `Misc -> Tools` with the argument: `-b -n DSDT -z` and select this option in OpenCore's picker. Rename the DSDT.dat to DSDT.aml. Tool is provided by [acpica](https://github.com/acpica/acpica/tree/master/source/tools/acpidump)

If OpenCore is having issues running acpidump, you can call it from the shell with [OpenCoreShell](https://github.com/acidanthera/OpenCoreShell/releases)\(reminder to add to both `EFI/OC/Tools` and in your config under `Misc -> Tools` \):

```text
shell> fs0: //replace with proper drive

fs0:\> dir //to verify this is the right directory

Directory of fs0:\

01/01/01 3:30p EFI

fs0:\> cd EFI\OC\Tools //note that it's with forward slashes

fs0:\EFI\OC\Tools> acpidump.efi -b -n DSDT -z
```

## Compiling and decompiling DSDTs and SSDTs

#### macOS

So compiling DSDTs and SSDTs are quite easy with macOS, all you need is [MaciASL](https://github.com/acidanthera/MaciASL). To compile, just File -&gt; SaveAs -&gt; ACPI Machine Language Binary\(.AML\), decompiling is just opening the file in MaciASL.

#### Windows

Compiling and decompiling on windows is fairly simple though, you will need [iasl.exe](https://acpica.org/sites/acpica/files/iasl-win-20180105.zip) and Command Prompt:

```text
path/to/iasl.exe path/to/DSDT.aml
```

![](https://i.imgur.com/IY7HMof.png)

If compiled .aml file is provided, a decompiled .dsl file will be given and vice versa.

#### Linux

Compiling and decompiling with Linux is just as simple, you will need a special copy of [iasl](http://amdosx.kellynet.nl/iasl.zip) and terminal:

```text
path/to/iasl path/to/DSDT.aml
```

If compiled .aml file is provided, a decompiled .dsl file will be given and vice versa.

## Creating SSDTs

### EC SSDT

This one's fairly easy to figure out, open your decompiled DSDT and search for `PNP0C09`. This should give you a result like this:

![](https://i.imgur.com/lQ4kpb9.png)

As you can see our `PNP0C09` is found within the `Device (EC0)` meaning this is the device we want to hide from macOS. Now grab our SSDT-EC and uncomment the EC0 function:

* [SSDT-EC-USBX](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-EC-USBX.dsl)
  * For Skylake+ and all AMD systems
* [SSDT-EC](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-EC.dsl)
  * For Haswell and older

```text
External (_SB_.PCI0.LPCB.EC0, DeviceObj)

   Scope (\_SB.PCI0.LPCB.EC0)
   {   
      Method (_STA, 0, NotSerialized) // _STA: Status
      {
         If (_OSI ("Darwin"))
         {
            Return (0)
         }
         Else
      {
      Return (0x0F)
     }
  }
}
```

But looking back at the screenshot above we notice something, our ACPI path is different: `PC00.LPC0` vs `PCI0.LPCB`. This is very important especially when you're dealing with Intel consumer vs Intel HEDT and AMD, `PC00.LPC0` is common on Intel HEDT while `PCI0.SBRG` is common on AMD. **Always verify your path**

> What happens if multiple `PNP0C09` show up

When this happens you need to figure out which is the main and which is not, it's fairly easy to figure out. Check each controller for the following properties:

* `_HID`
* `_CRS`
* `_GPE`

> Hey what about USBX? Do I need to do anything?

USBX is universal across all systems, it just creates a USBX device that forces USB power properties. This is crucial for fixing Mics, DACs, Webcams, Bluetooth Dongles and other high power draw devices. This is not mandatory to boot but should be added in post-install if not before. Note that USBX is only used on skylake+ systems, Broadwell and older can ignore

For those who want a deeper dive into the issue: [What's new in macOS Catalina](https://www.reddit.com/r/hackintosh/comments/den28t/whats_new_in_macos_catalina/)

### PLUG SSDT

**Intel CPUs only, for AMD see** [**NullCPUPowerManagement patch**](https://github.com/khronokernel/Opencore-Vanilla-Desktop-Guide/blob/master/AMD/NullCPU-patch.md)

CPU naming is fairly easy to figure out as well, open your decompiled DSDT and search for `Processor`. This should give you a result like this:

![](https://i.imgur.com/U3xffjU.png)

As we can see, the first processor in our list is `PR00`. This is what we'll be applying the `plugin-type=1` property too. Now grab [SSDT-PLUG](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-PLUG.dsl) and replace the default `CPU0` with our `PR00`. Note that there are 2 mentions of `CPU0` in the SSDT.

There are also some edge cases with `Processor`, specifically on HEDT series like X79, X99 and X299. This edge case is that the ACPI path is much longer and not so obvious:

![](https://i.imgur.com/HzOmbx2.png)

If we then search for instances of `CP00` we find that it's ACPI path is `SB.SCK0.CP00`:

![](https://i.imgur.com/CtL6Csn.png)

So for this X299 board, we'd change `\_PR.CPU0` with `\_SB.SCK0.CP00` and `External (_PR_.CPU0, ProcessorObj)` with `External (_SB_.SCK0.CP00, ProcessorObj)`

### AWAC SSDT

**This is required for most B360, B365, H310, H370, Z390 and even some newer BIOS revisions on Z370 like the Gigabyte Z370 Aurus Ultra firmware version 13+** 

What the [SSDT-AWAC](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-AWAC.dsl) will do is force enable the Legacy RTC device in macOS, the reason we want to do this is that macOS currently does not support AWAC as a system clock. In some rare cases, there is no Legacy RTC device to force enable so we'll need to create a fake RTC device for macOS to play with using [SSDT-RTC0](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-RTC0.dsl)

To determine whether you need [SSDT-AWAC](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-AWAC.dsl) or [SSDT-RTC0](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-RTC0.dsl), open your decompiled DSDT and search for `AWAC`. If you get a result then you have an `AWAC` system clock present, if nothing shows then no need to continue. Next search for `STAS`:

![](https://i.imgur.com/uuUF857.png)

As you can see we found the `STAS` in our DSDT, this means we're able to force enable our Legacy RTC. In this case, [SSDT-AWAC](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-AWAC.dsl) will be used As-Is with no modifications required. Just need to compile.

For systems where no `STAS` shows up, you can use [SSDT-RTC0](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-RTC0.dsl) though you will need to check whether your DSDT uses `LPCB`, `LBC` or `LBC0`. By default it uses `LPCB`, you can check by just searching for instances of `LPCB`, `LBC` and `LBC0`

## Cleaning up

Now that we have all our SSDTs compiled, the last thing to do is add our SSDTs to both EFI/OC/ACPI and our config under ACPI -&gt; Add. A reminder that ProperTree users can press the hotkey Cmd/Ctrl+R for automatically adding your SSDTs to the config. A reminder that there is no need to add your DSDT as its already inside your firmware.

