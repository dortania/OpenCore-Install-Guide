# Why OpenCore over Clover and others

* Supported version: 0.6.1

This section contains a brief rundown as to why the community has been transitioning over to OpenCore. Those who just want a macOS machine can skip this page.

## OpenCore features

* On average, OpenCore systems boot faster than those using Clover as less unnecessary patching is done
* Better overall stability as patches can be much more precise:
  * [macOS 10.15.4 update](https://www.reddit.com/r/hackintosh/comments/fo9bfv/macos_10154_update/)
  * AMD OSX patches not needing to update with every minor security update
* Better overall security in many forms:
  * No need to disable System Integrity Protection (SIP)
  * Built-in FileVault 2 support
  * [Vaulting](https://dortania.github.io/OpenCore-Post-Install/universal/security.html#Vault) allowing to create EFI snapshots preventing unwanted modifications
  * True secure-boot support (currently going through security audit, coming soon)
* BootCamp switching and boot device selection are supported by reading NVRAM variables set by Startup Disk, just like a real Mac.
* Supports boot hotkey via `boot.efi` - hold `Option` or `ESC` at startup to choose a boot device, `Cmd+R` to enter Recovery or `Cmd+Opt+P+R` to reset NVRAM.

## Software Support

The biggest reason someone may want to switch from other boot loaders is actually software support:

* Kexts no longer testing for Clover:
  * Got a bug with a kext? Many developers including the organization [Acidanthera](https://github.com/acidanthera) (maker of most of your favorite kexts) won't provide support unless on OpenCore
* Many firmware drivers being merged into OpenCore:
  * [APFS Support](https://github.com/acidanthera/AppleSupportPkg)
  * [FileVault support](https://github.com/acidanthera/AppleSupportPkg)
  * [Firmware patches](https://github.com/acidanthera/AptioFixPkg)
* [AMD OSX patches](https://github.com/AMD-OSX/AMD_Vanilla/tree/opencore):
  * Have AMD-based hardware? The kernel patches required to boot macOS no longer support Clover – they now only support OpenCore.

## Kext Injection

To better understand OpenCore's kext injection system, we should first look at how Clover works:

1. Patches SIP open
2. Patches to enable XNU's zombie code for kext injection
3. Patches race condition with kext injection
4. Injects kexts
5. Patches SIP back in

Things to note with Clover's method:

* Calling XNU's zombie code that hasn't been used since 10.7, it's seriously impressive Apple hasn't removed this code yet
  * OS updates commonly break this patch, like recently with 10.14.4 and 10.15
* Disables SIP and attempts to re-enable it, don't think much needs to be said
* Likely to break with macOS 11.0 (Big Sur)
* Supports OS X all the way back to 10.5

Now let's take a look at OpenCore's method:

1. Takes existing prelinked kernel and kexts ready to inject
2. Rebuilds the cache in the EFI environment with the new kexts
3. Adds this new cache in

Things to note with OpenCore's method:

* OS agnostic as the prelinked kernel format as stayed the same since  10.6, far harder to break support.
  * OpenCore also supports cacheless, Mkext and KernelCollections meaning it also has proper support for all Intel versions of OS X/macOS. However, proper support has been added at 10.6 and newer.
* Far better stability as there is far less patching involved
