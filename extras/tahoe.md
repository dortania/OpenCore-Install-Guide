# macOS 26: Tahoe

## Table of Contents

[[toc]]

## Prerequisites

### Analog Audio
AppleHDA.kext is no longer present in macOS 26, resulting in AppleALC not working. This means that analog sound through Realtek, Conexant, and similar sound chips will not work through built-in speakers and headphone jacks.

If you were previously using audio through a digital source (like HDMI, DP, or a USB adapter), then they will continue to work. No changes need to be made to your configuration. 

Getting analog audio working again requires the injection of kexts which rely on lowered SIP restrictions.
There are methods to reinject AppleHDA (such as OCLP-Mod), although they follow the same caveats that traditional OCLP use on Hackintoshes has. You may also use [VoodooHDA](https://github.com/CloverHackyColor/VoodooHDA/releases), which may have reduced audio quality compared to AppleHDA.

#### Installing VoodooHDA

Set `csr-active-config` in your config.plist to `03000000`. Then, copy VoodooHDA.kext to `/Library/Extensions` and VoodooHDA.prefpane to `$HOME/Library/PreferencePanes` using `cp -R` in Terminal. Make sure that VoodooHDA is allowed to load in System Settings < Security.

### Supported SMBIOS

* MacBook Pro 16-inch (2019)
* Mac Pro (2019)
* MacBook Pro 13-inch, Four Thunderbolt 3 Ports (2020)
* iMac (2020)

[Click here](./smbios-support.md) for more details on supported SMBIOS models to pick the best one for your machine.

### Intel Bluetooth

On macOS 26, use this [fork](https://github.com/lshbluesky/IntelBluetoothFirmware/releases) of IntelBluetoothFirmware.kext. If it does not work, verify that Intel Bluetooth works in macOS 15.

### OTA Updates
On macOS 14.4 and above, OTA updates are only possible by using [RestrictEvents](https://github.com/acidanthera/RestrictEvents/releases) along with the boot argument `revpatch=sbvmm`. Additionally, `SecureBootModel` must be set to `Disabled` in your config.plist. If you want to keep secure boot enabled, add [iBridged](https://github.com/Carnations-Botanica/iBridged) to your kexts.

### WhateverGreen
WhateverGreen has AMD connector patching issues on macOS 26. If you have a kernel panic related to WhateverGreen or AMD GPU kexts, this is likely your problem. There are two workarounds to this:

1. Use this [custom build of WhateverGreen](https://github.com/Carnations-Botanica/WhateverGreen/actions/runs/17772496735) which prevents the connectors from being patched. This may not work for your machine.
2. Remove WhateverGreen.kext entirely. If you require `agdpmod=pikera` to boot, manually apply this [patch](https://pikeralpha.wordpress.com/2015/11/23/patching-applegraphicsdevicepolicy-kext/) to your configuration. Note that kext patches like this need to go under `Kernel -> Patch` in your config.plist. 