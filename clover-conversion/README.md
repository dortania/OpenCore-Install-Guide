# Converting from Clover to OpenCore

Last edited: Febuary 13, 2020

So you see the new fancy Opencore bootloader and just dying to try it out, well you've come to the right place! Many things in Clover have feature parody with Opencore but many do not, here we'll be going over what you can bring over and what you cannot.

To get started, we have some resouces that will aid you:

* [Config.plist conversion](/clover-conversion/Clover-config.md)
* [Firmware driver conversion(.efi)](/clover-conversion/clover.efi.md)

# Cleaning the Clover Junk in macOS

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

Users of Clover's Preference Pane will also need to remove that:
* `/Library/PreferencePanes/Clover.prefPane`

# Cleaning the Clover Junk in your hardware

The other thing that Clover may have hidden from you is NVRAM variables, this is bad as Opencore won't overwrite variables unless explicitly told via the `Block` feature found under `NVRAM -> Block`. To fix this, we'll need to clear then via Opencore's `ClearNvram` feature.

In you config.plist:
* `Misc -> Secuirty -> AllowNvramReset -> True`

And on your initl boot of Opencore, select `ClearNvram` boot option. This will wipe everything and reboot the system when finished.
