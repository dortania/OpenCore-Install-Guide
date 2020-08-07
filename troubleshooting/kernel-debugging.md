# System Debugging: In-depth

This section will go a bit deeper into the troubleshooting rabbit hole, specifically focusing on more low level debugging with proper debug output and optional serial setup.

**Note**: 99% of users do not need this level of debugging, this is only for the hardcore or extreme edge-cases.

* [EFI Setup](#efi-setup)
* [Config.plist Setup](#config-plist-setup)
* [Serial Setup(Optional)](#serial-setup-optional)
  * [CoolTerm Setup](#coolterm-setup)
* [IDA Setup(Optional)](#ida-setup-optional)(Undecided if I want to)

## EFI Setup

For most part, there's fairly minimal changes required. Main things we recommend are DEBUG version of **OpenCore** and all your **kexts**. This can help ensure you get all the necessary data, see here for more details on OpenCore debugging: [OpenCore debugging](./debug.md)

Besides just using DEBUG variants of OpenCore and kexts, these tools can also help out greatly:

* [DebugEnhancer.kext](https://github.com/acidanthera/DebugEnhancer/releases)
  * Helps greatly with kernel debugging
* [SSDT-DBG](https://gist.github.com/al3xtjames/39ebea4d615c8aed829109a9ea2cd0b5)
  * Enables debug statements from your ACPI tables
  * Note you will need to [compile the SSDT](https://dortania.github.io/Getting-Started-With-ACPI/Manual/compile.html)

## Config.plist Setup

For serial setup, OpenCore actually makes this quite straight forward.

### Misc

* **SerialInt**: YES
  * Performs serial port initialization
* **Target**: `67`
  * Enables debug output with OpenCore
  * Target = 75 adds the additional serial output flag(0x08) if you [plan to use serial](#serial-setup-optional)
  * You can calculate your own vale here: [OpenCore debugging](./debug.md)
  
### NVRAM

#### boot-args

Here we get to set some variables that will help us with debug output, for us we'll be using the following boot-args:

```
-v keepsyms=1 debug=0x12a msgbuf=1048576
```

Now lets go over what each arg does:

* **-v**
  * Enables verbose output
* **keepsyms=1**
  * Ensures symbols are kept during kernel panics, which are greatly helpful for troubleshooting
* **debug=0x12a**
  * Combination of `DB_KPRT`(0x8), `DB_KDP_BP_DIS`(0x32), `DB_KDP_GETC_ENA(0x200)`
  * A full list of values can be found here: [debug.h](https://github.com/apple/darwin-xnu/blob/master/osfmk/kern/debug.h#L419L447)
* **msgbuf=1048576**
  * Sets the kernel's message buffer size, this helps with getting proper logs during boot.

**Other helpful boot-args**:

Depending on what you're debugging, you may also find these boot-args extremely helpful:

* **-liludbgall**
  * Enables debugging on Lilu and any other plugins, though note that this requires DEBUG versions of the kexts
* **io=0xff**
  * Enables IOKit debugging, with greater output
* **igdebug=0xff**
  * Enables iGPU related debugging, helpful when working with iGPU systems
* **serial=5**
  * Redirects output to serial if you [plan to use serial](#serial-setup-optional)

## Serial Setup(Optional)

* [Hardware Setup](#hardware-setup)
* [EFI Setup](#efi-setup)
* [Config.plist Setup](#config-plist-setup)

While optional, serial can be super helpful in grabbing all the important info flooding your PC. It's also the only way to properly log super early kernel panics(such as things right after `[EB|#LOG:EXITBS:START]`)

For this setup, you'll need a few things:

* A serial header/port on the test machine
* A serial-to-serial or serial-to-USB cable
* A second machine to receive the serial logging(with either Serial or USB)
* Software to monitor the serial output
  * For this guide, we'll use [CoolTerm](https://freeware.the-meiers.org) as it supports macOS, Linux, Windows and even Raspberry Pi's

### Hardware Setup

For this example, we'll be using an Asus X299-E Strix board which does have a serial header. To verify whether your board comes with one, check the owners or service manual and search for the serial/COM port:

![](../images/troubleshooting/kernel-debugging-md/serial-header.png)

As you can see, we have a COM port on the bottom of our motherboard and even provides us with a diagram for manually hooking up our serial pins if you're not using a 9/10 Pin Serial Header to DB9 adapter.

For me, I'm using a simple [Serial header to DB9](https://www.amazon.ca/gp/product/B001Y1F0HW/ref=ppx_yo_dt_b_asin_title_o00_s00?ie=UTF8&psc=1), then a [DB9 to USB  RS 232 adapter](https://www.amazon.ca/gp/product/B075YGKFC1/ref=ppx_yo_dt_b_asin_title_o00_s01?ie=UTF8&psc=1) which finally terminates at my laptop:

| Serial header to DB9 | DB9 to USB  RS 232 adapter |
| :--- | :--- |
| ![817DNdBZDkL. AC SL1500 ](../images/troubleshooting/kernel-debugging-md/817DNdBZDkL._AC_SL1500_.jpg) | ![61yHczOwpTL. AC SL1001 ](../images/troubleshooting/kernel-debugging-md/61yHczOwpTL._AC_SL1001_.jpg) |

The OpenCore manual generally recommends CP21202-based UART devices:

> To obtain the log during boot you can make the use of serial port debugging. Serial port debugging is enabled in Target, e.g. 0xB for onscreen with serial. OpenCore uses 115200 baud rate, 8 data bits, no parity, and 1 stop bit. For macOS your best choice are CP2102-based UART devices. Connect motherboard TX to USB UART RX, and motherboard GND to USB UART GND. Use screen utility to get the output, or download GUI software, such as CoolTerm.
> Note: On several motherboards (and possibly USB UART dongles) PIN naming may be incorrect. It is very common to have GND swapped with RX, thus you have to connect motherboard “TX” to USB UART GND, and motherboard “GND” to USB UART RX.

**Important reminder**: Don't forget to also enable the serial port in your BIOS, most motherboards will disable it by default

### CoolTerm Setup

Now lets fire up [CoolTerm](https://freeware.the-meiers.org) and set a few options. When you open CoolTerm, you'll likely be greeted with a simple window. here select the Options entry:

![](../images/troubleshooting/kernel-debugging-md/coolterm-first-start.png)
![](../images/troubleshooting/kernel-debugging-md/coolterm-settings.png)

Here we're given quite a few options, but the mains ones we care about are:

* Port: Ensure this matches with your serial controller.
* Baudrate = 115200
* Data Bits = 8
* Parity = none
* Stop Bit = 1

Next save these settings.