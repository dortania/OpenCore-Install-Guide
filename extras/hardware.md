# Supported hardware

**Work in progress**

# Ways to check hardware

* [Speccy](https://www.ccleaner.com/speccy)
* Device Manager
* Product support docs

# CPU Compatibility

* Sierra needs SSE4,1
* Pentiums and some Xeons need CPU ID spoof
* AMD CPUs need [kernel patches](https://github.com/AMD-OSX/AMD_Vanilla/tree/opencore)

# GPU Compatibility

* [See GPU Buyers Guide](https://khronokernel-3.gitbook.io/catalina-gpu-buyers-guide/) for compatible GPUs.
# Motherboard Compatibility

* All AMD and Intel boards are supported
* Z390 and some HEDT systems will need emulated NVRAM
* Some Z370 and Z390 boards have AWAC clocks, these are incompatible with macOS and so will need an RTC fix

# SSD Compatibility

* See [Anti-Hackintosh-Buyers-Guide](https://khronokernel-5.gitbook.io/anti-hackintosh-buyers-guide/)

# Audio Compatibility

* See the AppleALC wiki for supported codecs: [Supported codecs
](https://github.com/acidanthera/applealc/wiki/supported-codecs)

# Networking

See supported chipset on respective drivers:

* [IntelMausiEthernet](https://github.com/Mieze/IntelMausiEthernet)
   * Required for Intel NICs, newer chipsets are based off of I211-AT will need the [I211-AT SmallTree kext](https://cdn.discordapp.com/attachments/390417931659378688/556912824228773888/SmallTree-Intel-211-AT-PCIe-GBE.kext.zip)
* [AtherosE2200Ethernet](https://github.com/Mieze/AtherosE2200Ethernet)
* [RealtekRTL8111](https://github.com/Mieze/RTL8111_driver_for_OS_X)

Unsupported ethernet models:
* Realtek L8200A(Only found in Asus boards)
* Realtek RTL8125(2.5Gbe, mostly found on higher end gaming boards)

And see [Wireless Buyers Guide](https://khronokernel-7.gitbook.io/wireless-buyers-guide/) for supported wifi cards.


