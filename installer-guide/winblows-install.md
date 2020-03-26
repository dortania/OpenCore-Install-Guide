# Making the installer in Windows

* Supported version: 0.5.7

While you don't need a fresh install of macOS to use OpenCore, some users prefer having a fresh slate with their boot manager upgrades.

To start you'll need the following:
* 4GB USB Stick
* [GibMacOS](https://github.com/corpnewt/gibMacOS)

## Downloading macOS

To start, open gibMacOS.bat as Admin and select `Toggle Recovery-Only`:

![](https://cdn.discordapp.com/attachments/456913818467958789/668211243554963533/unknown.png)

Now search through for your desired version of macOS, for this example we'll choose option 5 for macOS Catalina:

![](https://cdn.discordapp.com/attachments/456913818467958789/668211633105010718/unknown.png)

This will download the RecoveryHDMetaDmg.pkg to `\gibmacos-master\macOS Downloads\publicrelease\xxx-xxxxx - 10.x.x macOS xxx`

![](https://cdn.discordapp.com/attachments/456913818467958789/668211921484382218/unknown.png)

## Making the installer

Next open `makeinstall.bat` as Admin and select your drive with option O for OpenCore( ex: 1O).

![](https://cdn.discordapp.com/attachments/456913818467958789/668213205579071598/unknown.png)

Once your drive is formatted, it will then ask you for the `RecoveryHDMetaDMG.pkg` that we downloaded earlier. Top right of the file window will let you copy the file path:

![](https://cdn.discordapp.com/attachments/456913818467958789/668215775378800640/unknown.png)

![](https://cdn.discordapp.com/attachments/456913818467958789/668221636863852578/unknown-2.png)

makeinstall will finish up by installing OpenCore to your USB's EFI System Partition, you can find this partition labeled as `BOOT`:

![](https://cdn.discordapp.com/attachments/456913818467958789/668221887163400265/unknown.png)

![](https://cdn.discordapp.com/attachments/456913818467958789/668222277195661353/unknown.png)




### Now with all this done, return to [Creating the USB](/installer-guide/opencore-efi.md) to finish up your work
