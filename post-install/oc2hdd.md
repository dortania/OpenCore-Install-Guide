# Moving OpenCore from USB to macOS Drive

Last edited: March 03, 2020

## Grabbing OpenCore off the USB

So to start, we'll first want to grab OpenCore off of our installer. To do this, we'll be using a neat tool from CorpNewt called [MountEFI](https://github.com/corpnewt/MountEFI)

For this example, we'll assume your USB is called `Install macOS Catalina`:

![](https://cdn.discordapp.com/attachments/683011276938543134/684629962539663390/Screen_Shot_2020-03-03_at_10.13.56_PM.png)

Once the EFI's mounted, we'll want to grab our EFI folder on there and keep in a safe place. We'll then want to eject the drive as having multiple EFIs mounted can onfuse macOS sometimes, best practice is to keep only 1 EFI mounted at a time(you can eject just the EFI, the drive itself doesn't need to be removed)

![](https://cdn.discordapp.com/attachments/683011276938543134/684634974753652970/Screen_Shot_2020-03-03_at_10.34.15_PM.png)

Now with this done, lets mount our macOS drive. With macOS Catalina, macOS is actually parttioned into 2 volumes: System Partition and User Partition. This means that MountEFI may report multiple drives in it's picker but each partition will still share the same EFI(The UEFI spec only allows for 1 EFI per drive). You can tell if it's the same drive with disk**X**sY (Y is just to say what parition it is)

![](https://cdn.discordapp.com/attachments/683011276938543134/684635377297915932/Screen_Shot_2020-03-03_at_10.22.20_PM.png)

When you mount your main drive's EFI, you may be greeted with a folder called `APPLE`, this is used for updating the firmware on real Macs but has no effect on our hardware. You can wipe everything on the EFI partition and replace it with the one ound on your USB


## Special notes for legacy users

When transfering over your EFI, there as still boot sectors that need to be written to so your non-UEFI BIOS would be able to find it So don't forget to rerun the [`BootInstall.command`](/extras/legacy.md) on your macOS drive


