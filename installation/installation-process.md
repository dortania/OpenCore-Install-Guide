# Installation Process

You've finished setting up all the OpenCore files on your USB drive.
The next steps are:

* Plug the USB drive into your computer, and boot from it.
You will need to use Boot Options to select the USB drive,
and may need to adjust other BIOS options and settings.
* Once you do, you can continue to boot from the USB drive.
The computer's built-in firmware invokes the OpenCore EFI files
that inject all the other software (from the USB drive) necessary to run macOS.
* When that completes, OpenCore displays a GUI listing the choices of disk partitions to boot from.
* Select the macOS installer partition and let the computer start up macOS (it's just the installer, not the full OS.)
You'll use that to...
* Format your computer's internal hard drive to be suitable for macOS:
GUID Partition Scheme, APFS formatting for the macOS partition.
When that's complete...
* Run the macOS Installer to copy all the macOS files to the macOS partition on the internal drive.
* Reboot, and tell the OpenCore GUI to start up the macOS partition on the internal drive
* Finally, perform a suite of post-install steps to make the OpenCore and other files permanently reside on the internal hard drive.
At that point, your computer should boot up the macOS partition by default.

## A Few Last Steps Before Booting

1. Check your EFI setup:
   Good EFI          |  Bad EFI
   :-------------------------:|:-------------------------:
   ![](../images/installation/install-md/good-efi.png)  |  ![](../images/installation/install-md/bad-efi.png)
   EFI folder found on EFI partition | EFI folder missing
   ACPI Files are compiled(.aml) | ACPI Files are not compiled(.dsl)
   DSDT is not included |* DSDT is included
   Removed unneeded Drivers(.efi) | Leaves default Drivers
   Removed unneeded Tools(.efi) | Leaves default Tools
   All files in the Kexts folder end in .kext | Includes source code and folders
   config.plist found under EFI/OC | Neither renamed or placed the .plist in right location
   Only uses kexts that are needed | Downloaded every kext listed
2. Use the **Sanity Checker** from slowgeek to check out your config.plist file.
It's your friend. [**Sanity Checker from slowgeek**](https://opencore.slowgeek.com)
3. Assemble troubleshooting and other guides.
You should have the following on-hand:

   * A copy of the [General Troubleshooting](../troubleshooting/troubleshooting.md) page
   * The [macOS Boot Process](../troubleshooting/boot.md) can also help if the installation gets stuck
   * If you're planning to run multiple OSes on the single drive, open the
[Multiboot Guide](https://hackintosh-multiboot.gitbook.io/hackintosh-multiboot/)
   * A ton time and of patience

## Booting from the OpenCore USB Drive

The time has come.
Plug the USB stick into your computer and restart it.
You'll need to enter the BIOS or boot menu and select the USB as the boot device,
otherwise your device will still default to the internal drive (with Windows.)
Check in the user manual or Google ("*your model* boot options")
to find out what function key accesses the BIOS and boot menu (ie. Esc, F2, F10 or F12)

Once you boot from the USB, you'll likely be greeted with the boot choices like this:

1. Windows
2. macOS Base System (External) / Install macOS Catalina (External)
3. OpenShell.efi
4. Reset NVRAM

**Use Option 2** Depending how the installer was made, it may report as either **macOS Base System (External)**
if created in Linux or Windows or **Install macOS Catalina (External)** if created in macOS.

## macOS Installer

After you select the macOS partition,
expect to see a huge number of verbose log messages scroll by.
When that completes (and if everything goes well), you will be looking at the macOS Installer.

Now use **Disk Utility** to format the computer's internal drive.
You can use the same procedure as described in creating the USB Installer drive for macOS.
Keep in mind:

* The internal drive **must** be formatted with **GUID Partition Scheme**
* Drives for modern macOS on **must** be formatted with **APFS**.
(Older OS's, High Sierra on HDD and all Sierra users, must use macOS Journaled(HFS+))
* The drive **must** also have a 200MB EFI partition.
macOS Disk Utility creates this partition by default when using the GUID partition scheme.
* See the [Multiboot Guide](https://hackintosh-multiboot.gitbook.io/hackintosh-multiboot/)
for more info on partitioning for a Windows OS.

Once you start the installation, you must wait until the system restarts.
Once again, boot from the USB drive into OpenCore,
but select the macOS installer on the hard drive to continue installation.

You should ultimately see an Apple logo,
and after a few minutes you should get a message at the bottom saying "x minutes remaining".
This may be another good time to get a drink or snack as this step takes a while.
The computer may restart a couple more times, but if all goes well,
it should finally drop you at the "Setup your Mac screen"

You're in! 🎉
Go through the Post-Installation pages to finish setting up your system.
