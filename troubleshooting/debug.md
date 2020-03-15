# OpenCore Debugging

* Last edited: March 15, 2020
* Supported version: 0.5.6

Needing to figure out why you're getting issues or stalling? Well, you've come to the right place.

To start, make sure you're using either the `DEBUG` or `NOOPT` versions of OpenCore. This will provide much more info than the `RELEASE` version.

**Target** Used for enabling different levels of debugging

* `0x01` — Enable Logging
* `0x02` — Enable Onscreen debug
* `0x04` — Enable logging to Data Hub.
* `0x08` — Enable serial port logging.
* `0x10` — Enable UEFI variable logging.
* `0x20` — Enable non-volatile UEFI variable logging. 
* `0x40` — Enable logging to file.

To calculate the target, we can use a HEX calculator and then convert it to decimal. For us we want to have our values on stored onto a .txt file for later viewing:

* `0x01` — Enable Logging
* `0x02` — Enable Onscreen debug
* `0x10` — Enable UEFI variable logging.
* `0x40` — Enable logging to file.

`0x01` + `0x02` + `0x10` + `0x40` = `0x53`

`0x53` converted to decimal becomes `83`

So we can set `Misc` -&gt; `Debug` -&gt; `Target` -&gt; `83`

**DisplayLevel**

Used for setting what is logged

* `0x00000002` — DEBUG\_WARN in DEBUG, NOOPT, RELEASE.
* `0x00000040` — DEBUG\_INFO in DEBUG, NOOPT.
* `0x00400000` — DEBUG\_VERBOSE in custom builds.
* `0x80000000` — DEBUG\_ERROR in DEBUG, NOOPT, RELEASE.

  A full list can be found in [DebugLib.h](https://github.com/tianocore/edk2/blob/UDK2018/MdePkg/Include/Library/DebugLib.h).

For us we just want the following:

* `0x00000002` — DEBUG\_WARN in DEBUG, NOOPT, RELEASE.
* `0x00000040` — DEBUG\_INFO in DEBUG, NOOPT.
* `0x80000000` — DEBUG\_ERROR in DEBUG, NOOPT, RELEASE.

Just like with `Target`, we use a HEX calculator then convert to decimal:

`0x80000042` Converted to decimal `Misc` -&gt; `Debug` -&gt; `DisplayLevel` -&gt; `2147483714`

**DisableWatchdog**: YES Disables the UEFI watchdog, used for when OpenCore is stalling on something non-critical.

## Disabling logging

To remove all file logging, set `Target` to `0`
