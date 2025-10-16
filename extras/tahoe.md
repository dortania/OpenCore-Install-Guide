# macOS 26: Tahoe

## Table of Contents

[[toc]]

## Prerequisites

### Analog Audio

AppleHDA.kext is no longer present in macOS 26, resulting in AppleALC not working. This means that analog sound through Realtek, Conexant, and similar sound chips will not work through built-in speakers and headphone jacks.

If you were previously using audio through a digital source (like HDMI, DP, or a USB adapter), then they will continue to work. No changes need to be made to your configuration.

Getting analog audio working again requires the injection of kexts which rely on lowered SIP restrictions.
It is possible to modify the root volume to reinject AppleHDA, but it has the same caveats that OCLP use on Hackintoshes has. You can also use [VoodooHDA](https://github.com/CloverHackyColor/VoodooHDA/releases), which may have reduced audio quality compared to AppleHDA.

#### Installing VoodooHDA

Set `csr-active-config` in your config.plist to `03000000`. Then, copy VoodooHDA.kext to `/Library/Extensions` and VoodooHDA.prefpane to `$HOME/Library/PreferencePanes` using `cp -R` in Terminal. Make sure that VoodooHDA is allowed to load in System Settings < Security.

### Supported SMBIOS

* MacBook Pro 16-inch (2019)
* Mac Pro (2019)
* MacBook Pro 13-inch, Four Thunderbolt 3 Ports (2020)
* iMac (2020)

[Click here](./smbios-support.md) for more details on supported SMBIOS models to pick the best one for your machine.

### Broadcom WiFi

As Broadcom support has been removed since macOS Sonoma, root patches were required to bring it back. However, [AppleBCMWLANCompanion](https://github.com/0xFireWolf/AppleBCMWLANCompanion) brings back support for macOS 15 and 26 without needing root patching. It is not fully stable nor feature-complete yet, so use it at your own discretion. A support thread is available [here](https://www.insanelymac.com/forum/topic/361710-broadcom-fullmac-wi-fi-support-on-macos-sonoma-sequoia-and-tahoe-without-root-patches/).

Note that VT-d must be enabled to use this kext.

### Intel Bluetooth

On macOS 26, use the `-ibtcompatbeta` boot argument to use Intel Bluetooth.

### OTA Updates

On macOS 14.4 and above, OTA updates are only possible by using [RestrictEvents](https://github.com/acidanthera/RestrictEvents/releases) along with the boot argument `revpatch=sbvmm`. Additionally, `SecureBootModel` must be set to `Disabled` in your config.plist. If you want to keep secure boot enabled, add [iBridged](https://github.com/Carnations-Botanica/iBridged) to your kexts.

### WhateverGreen

WhateverGreen has AMD connector patching issues on macOS 26. If you have a kernel panic related to WhateverGreen or AMD GPU kexts, this is likely your problem. As there is no workaround available yet, your only option is to remove WhateverGreen.kext entirely. If you require `agdpmod=pikera` to boot, manually apply this [patch](https://pikeralpha.wordpress.com/2015/11/23/patching-applegraphicsdevicepolicy-kext/) to your configuration. Note that kext patches like this need to go under `Kernel -> Patch` in your config.plist.
