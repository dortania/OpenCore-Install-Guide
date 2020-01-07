# A quick explainer on ACPI

So what are DSDTs and SSDTs? Well these are tables present in your firmware that outline hardware devices like USB controllers, CPU threads, embedded controllers, system clocks and such. A DSDT(Differentiated System Description Table) can be seen as the body holding most of the info with smaller bits of info being passed by the SSDT(Secondary System Description Table)


> So why do we care ablout these tables?

macOS can be very picky about the devices present in the DSDT and so our job is to correct it. The main devices that need to be corrected to boot are:

*  Embedded controllers(EC) 
   * All semi-modern intel machines have an EC exposed in their DSDT, with many AMD systems also having it exposed. These controllers are not compatible with macOS so then need to be hidden from macOS and replaced with a dumby EC.
* AWAC system clock.
   * This applies to all 300 series motherboards including Z370 boards, the specific issue is that newer baords ship with AWAC clock enabled. This is a problem because macOS cannot communicate with AWAC clocks, so this requiring us to either force on the Legacy RTC clock or if unavailble create a fake one for macOS to play with


# Getting a copy of our DSDT

So to get a copy of your DSDT there's a couple options:

* [MaciASL](https://github.com/acidanthera/MaciASL/releases)
   * Open the app on the target machine and the system's DSDT will show, then File -> SaveAs `System DSDT`. Make sure the file format is ACPI Machine Language Binary(.AML), this will require the machine to be running macOS
   * Do note that all ACPI patches from clover/OpenCore will be applied to the DSDT

* [SSDTTime](https://github.com/corpnewt/SSDTTime) 
   * Supports both Windows and Linux for DSDT dumping
   
* F4 in Clover Boot menu
   * DSDT can be found in `EFI/CLOVER/ACPI/origin`, the folder **must** exist before dumping

* [`acpidump.efi`](https://github.com/khronokernel/Opencore-Vanilla-Desktop-Guide/tree/master/extra-files/acpidump.efi.zip)
   * Add this to `EFI/OC/Tools` and in your config under `Misc -> Tools` with the argument: `-b -n DSDT -z` and select this option in Opencore's picker. Rename the DSDT.dat to DSDT.aml. Tool is provided by [acpica](https://github.com/acpica/acpica/tree/master/source/tools/acpidump)

If OpenCore is having issues running acpidump, you can call it from the shell with OpenCoreShell(reminder to add to both `EFI/OC/Tools` and in your config under `Misc -> Tools` ):

```
shell> fs0: //replace with proper drive

fs0:\> dir //to verify this is the right directory

Directory of fs0:\

01/01/01 3:30p  EFI

fs0:\> cd EFI\OC\Tools //note that its with forward slashes

fs0:\EFI\OC\Tools> acpidump.efi -b -n DSDT -z
```

# Compiling and decompiling DSDTs and SSDTs

### macOS
So compiling DSDTs and SSDTs are quite easy with macOS, all you need is [MaciASL](https://github.com/acidanthera/MaciASL). To compile, just File -> SaveAs -> ACPI Machine Language Binary(.AML), decompiling is just opening the file in MaciASL.

### Windows
Compiling and decompiling on windows is fairly simple though, you will need [iasl.exe](https://acpica.org/sites/acpica/files/iasl-win-20180105.zip) and cmd.exe:

```
path/to/iasl.exe path/to/DSDT.aml
```

If compiled .aml file is provided, a decompiled .dsl file will be given and vice versa.

### Linux

Compiling and decompiling with Linux is just as simple, you will need a special copy of  [iasl.exe](http://amdosx.kellynet.nl/iasl.zip) and terminal:

```
path/to/iasl.exe path/to/DSDT.aml
```

If compiled .aml file is provided, a decompiled .dsl file will be given and vice versa.
