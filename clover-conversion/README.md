# Converting from Clover to OpenCore

* Supported version: 0.5.9

So you see the new fancy OpenCore bootloader and just dying to try it out, well you've come to the right place! Many things in Clover have feature parity with OpenCore but many do not, here we'll be going over what you can bring over and what you cannot.

To get started, we have some resources that will aid you:

* [Config.plist conversion](/clover-conversion/Clover-config.md)
* [Firmware driver conversion(.efi)](/clover-conversion/clover-efi.md)
* [Boot Argument conversion](/clover-conversion/Clover-boot-arg.md)
* [Common Kernel and Kext patch conversions](/clover-conversion/clover-patch.md)

## Cleaning the Clover Junk in macOS

So to start, Clover would like to give a big F*** You if you're using emulated NVRAM. Why? Well it likely installed some trash that's a pain in the arse to get rid of. You will need to have SIP disabled to clean it up.

Things to check for:

* `/Volumes/EFI/EFI/CLOVER/drivers64UEFI/EmuVariableUefi-64.efi`
* `/Volumes/EFI/nvram.plist`
* `/etc/rc.clover.lib`
* `/etc/rc.boot.d/10.save_and_rotate_boot_log.local`
* `/etc/rc.boot.d/20.mount_ESP.local`
* `/etc/rc.boot.d/70.disable_sleep_proxy_client.local.disabled`
* `/etc/rc.shutdown.d/80.save_nvram_plist.local​`

If folders are empty then delete them as well:

* `/etc/rc.boot.d`
* `/etc/rc.shutdown.d​`

Users of Clover's Preference Pane will also need to remove these:

* `/Library/PreferencePanes/Clover.prefPane`
* `/Library/Application\ Support/clover`

## Removing kexts from macOS(S/L/E and L/E)

A common tradition with Clover was to install kexts into macOS, specifically System/Library/Extensions and Library/Extensions. Reasoning being that Clover's kext injection system was known to fail either with OS updates or just spontaneously. Thankfully with OpenCore, a much more robust and stable injection mechanism's been made that is far harder to break. So time to do a bit of spring cleaning.

**Note**: OpenCore will fail to inject kexts already in your kernelcache so cleaning this out will also resolve those issues

Now open up terminal and run the following:

```
sudo kextcache -i /
```

This command will yell at you about any kexts that shouldn't be in either S/L/E or L/E.

**Remove all hack kexts**:

```
sudo -s
touch /Library/Extensions /System/Library/Extensions​
kextcache -i /​
```

* **Note**, macOS Catalina and newer will need the `mount -uw /` command to mount the system drive as Read/Write

## Cleaning the Clover Junk in your hardware

The other thing that Clover may have hidden from you is NVRAM variables, this is bad as OpenCore won't overwrite variables unless explicitly told via the `Block` feature found under `NVRAM -> Block`. To fix this, we'll need to clear then via OpenCore's `ClearNvram` feature.

In you config.plist:

* `Misc -> Security -> AllowNvramReset -> True`

And on your initial boot of OpenCore, select `ClearNvram` boot option. This will wipe everything and reboot the system when finished.
