# Fixing CFG Lock

* Last edited: March 15, 2020
* Supported version: 0.5.6

Do note that this is only recommended for users who have already installed macOS, for users who are ibnstalling for the first time enable `AppleCpuPmCfgLock` and `AppleXcpmCfgLock` under `Kernel -> Quirks`

## Disabling CFG Lock

So you've installed macOS but you're using those pesky `CFG-Lock` patches that we want to get rid of, well to do this is fairly simple. You'll need the following:

Inside your EFI/OC/Tools folder and config.plist:

* [VerifyMsrE2](https://github.com/acidanthera/OpenCorePkg/releases)
* [Modifed GRUB Shell](https://github.com/datasone/grub-mod-setup_var/releases)

And some apps to help us out:

* [UEFITool](https://github.com/LongSoft/UEFITool/releases) (Make sure it's UEFITool and not UEFIExtrac)
* [Universal-IFR-Extractor](https://github.com/LongSoft/Universal-IFR-Extractor/releases)

And don't forget to disable the following from your config.plist under `Kernel -> Quirks`:

* `AppleCpuPmCfgLock`
* `AppleXcpmCfgLock`

And the final part, grabbing your BIOS from the vendors' website.

Now the fun part!

## Checking if CFG-Lock can be turned off

Boot OpenCore and select the `VerifyMsrE2` option in the picker. This tool will tell you whether your BIOS supports CFG-Lock and if it can be unlocked.

## Turning off CFG-Lock manually

1. Open your firmware with UEFITool and then find `CFG Lock` as a Unicode string. If nothing pops up then your firmware doesn't support `CFG Lock`, otherwise continue on. 

![](https://i.imgur.com/ziN50wL.png)

1. You'll find that this string is found within a Setup folder, right-click and export as `Setup.bin`
2. Open your setup file with `ifrextract` and export as a .txt file with terminal:

   ```text
   path/to/ifrextract path/to/Setup.bin path/to/Setup.txt
   ```

3. Open the text file and search for `CFG Lock, VarStoreInfo (VarOffset/VarName):` and note the offset right after it(ie: `0x5A4`)

![](https://i.imgur.com/Vp8dqI5.png)

1. Run the Modified GRUB Shell and paste the following where `0x5A4` is replaced with your value:

   ```text
   setup_var 0x5A4 0x00
   ```

   Do note that variable offsets are unique not just to each motherboard but even to its firmware version. **Never try to use an offset without checking.**

And you're done! Now you'll have correct CPU power management

**Note**: Every time you reset your BIOS you will need to flip this bit again, make sure to write it down with the BIOS version so you know which.

