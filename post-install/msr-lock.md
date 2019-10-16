# Disabling CFG Lock

So you've installed macOS but you're using those pesky `CFG-Lock` patches that we want to get rid of, well to do this is fairly simple. You'll need the following:

In your Tools folder and config.plist
* [VerifyMsrE2](https://github.com/acidanthera/AppleSupportPkg)
* [Modifed GRUB Shell](https://github.com/datasone/grub-mod-setup_var/releases)

And some apps to help us out:
* [UEFITool](https://github.com/LongSoft/UEFITool/releases/tag/t20190818)(Make sure it's UEFITool and not UEFIExtract)
* [Universal-IFR-Extractor](https://github.com/LongSoft/Universal-IFR-Extractor/releases)

And don't forget to disable the following from your config.plist:
* `AppleCpuPmCfgLock`
* `AppleXcpmCfgLock`

And the final part, grabbing your BIOS from the vendors website.

Now the fun part!



1. Open your firmware with UEFITool and then find `CFG Lock` as a unicode string. If nothing pops up then your firmware doesn't support `CFG Lock`, otherwise continue on. 
![](https://i.imgur.com/ziN50wL.png)

2. You'll find that this string in found within a Setup folder, right click and export as `Setup.bin`

3. Open your setup file with `ifrextract` and export as a .txt file with terminal:
```
path/to/ifrextract path/to/Setup.bin path/to/Setup.txt
```
4. Open the text file and search for `CFG Lock, VarStoreInfo (VarOffset/VarName):` and note the offset right after it(ie: `0x5A4`)
![](https://i.imgur.com/Vp8dqI5.png)

5. Run the Modified GRUB Shell and paste the following where `0x5A4` is replaced with your value:
```
setup_var 0x123 0x00
```
Do note that variable offsets are unique not just to each motherboard but even to its firmware version. Never ever try to use an offset without checking.

And you're done! Now you'll have correct CPU power management

