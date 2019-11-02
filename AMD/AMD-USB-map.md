With OpenCore I think it's about time we finally destroy some AMD myths, like how USB is just screwed on AMD and can't be mapped. Well that is false! And I will show you the way of enlightenment.

So why would I want to use this? Well couple reasons:
* Add missing USB ports that macOS didn't automatically add
* Remove unwanted devices like intel bluetooth conflicting with broadcoms
* Stability by removing USB port limit patches, these patches are known for data corruption

# Backstory to USB on macOS
**Work in progress**

See Corp's [USB map guide for now](https://usb-map.gitbook.io/project/terms-of-endearment)

# Getting started

So what you'll need to get started:
* Running macOS(this can be done in windows/linux though you'll ne)
* [MaciASL](https://github.com/acidanthera/MaciASL/releases)
* [ProperTree](https://github.com/corpnewt/ProperTree) or some other plist editor
* [IORegistryExplorer](https://github.com/toleda/audio_ALCInjection/raw/master/IORegistryExplorer_v2.1.zip)
* [AMD-USB-Map.kext](https://github.com/khronokernel/Opencore-Vanilla-Desktop-Guide/tree/master/extra-files/AMD-USB-Map.kext.zip)
* Copy of your DSDT


# Gettting your DSDT

Couple different ways:
* [MaciASL](https://github.com/acidanthera/MaciASL/releases) -> SaveAs SystemSDDT
* F4 in Clover
   * DSDT can be found in `EFI/CLOVER/ACPI/origin`
* [SSDTTime](https://github.com/corpnewt/SSDTTime) for Linux
   * IOIIIO's fork of [SSDTTime](https://github.com/IOIIIO/SSDTTime) also supports windows DSDT dumping.
* [`acpidump.efi`](https://github.com/khronokernel/Opencore-Vanilla-Desktop-Guide/tree/master/extra-files/acpidump.efi.zip)
   * Add this to `EFI/OC/Tools` and in your config under `Misc -> Tools` then select this option in Opencore's picker

![](https://i.imgur.com/vHAomNm.png)

For those having issues running acpidump from the OpenCore picker can call it from the shell:

```
shell> fs0: //replace with proper drive

fs0:\> dir //to verify this is the right directory

   Directory of fs0:\
     01/01/01 3:30p   EFI
     
fs0:\> cd EFI\OC\Tools //note that its with forward slashes

fs0:\EFI\OC\Tools> acpidump.efi -b -n DSDT -z
```
You'll find that `DSDT.bat` is on the root of your EFI, reboot and rename the file to `DSDT.aml` and lets get cooking.

# Creating the map

So to start off, open IORegistryExplorer and find the USB controller you'd wish to map. For controllers, they come in some variantions:
* XHC
* XHC0
* XHC1
* XHC2
* XHC3
* XHCI
* XHCX
* AS43
* PTXH(Commonly associated with AMD Chipset controllers)

For today's example we'll be adding missing ports for the X399 chipset which has the identifier `PTXH`

![PTXH IOReg](https://i.imgur.com/wh7mMa4.png)

As you can see from the photo above, we're missing a shit ton of ports! Specifically ports POT3, POT4, POT7, POT8, PO12, PO13, PO15, PO16, PO17, PO18, PO19, PO20, PO21, PO22!

So how do we fix this? Well if you look in the corner you'll see the `port` value. This is going to be important to us when mapping

Next lets take a peak at our DSDT and check for our `PTXH` device:

![](https://i.imgur.com/ofYGYBS.png)
![](https://i.imgur.com/BZtkLl7.png)
All of our ports are here! So why in the world is macOS hiding them? Well there's a couple reasons but this being the main: Conflicting SMBIOS USB map

Inside the `AppleUSBHostPlatformProperties.kext` you'll find the USB map for most SMBIOS, this mean that that machine's USB map is forced onto your system. 

Well to kick out these ports, we gotta make a plugin kext. For us that's the [AMD-USB-Map.kext](https://github.com/khronokernel/Opencore-Vanilla-Desktop-Guide/tree/master/extra-files/AMD-USB-Map.kext.zip)

Now right click and press `Show Package Contents`, then navigate to `Contents/Info.plist`

![](https://i.imgur.com/Vfou3S1.png)
If the port values don't show in Xcode, right click and select `Show Raw Keys/Values`
![](https://i.imgur.com/ggsZw35.png)


So what kind of data do we shove into this plist? Well there's a cuple sections to note:

* **Model**: The SMBIOS this kext will match against
* **IONameMatch**: The name of the controlller it'll match against
* **port-count**: The last/largest port value
* **port**: The address of the USB controller
* **UsbConnector**: The type of USB connector, which can be found on the [ACPI 6.3 spec, section 9.14](https://uefi.org/sites/default/files/resources/ACPI_6_3_final_Jan30.pdf)

UsbConnector types that we care about:
```
0: Type A connector // USB 2.0
3: USB 3 Standard-A connector
8: Type C connector - USB 2.0-only
9: Type C connector - USB 2.0 and USB 3.0 with Switch
10: Type C connector - USB 2.0 and USB 3.0 without Switch
255: Proprietary connector // For Internal USB ports like bluetooth
```
Now lets take this section:

```
Device (PO18)
{
   Name (_ADR, 0x12)  // _ADR: Address
   Name (_UPC, Package (0x04)  // _UPC: USB Port Capabilities
   {
        Zero, 
        0xFF, 
        Zero, 
        Zero
   })
}
```
For us, what matters is the `Name (_ADR, 0x12)  // _ADR: Address` as this tells us the location of the USB port. This value will be turned into our `port` value on the plist.

![](https://i.imgur.com/9R6cab8.png)


Now save and add this to both your keytext folder and config.plist then reboot!

![I need photo of IOReg, ass hasn't messaged back even after I setup his hack for him]()

Look at that, all the ports have been added! Now we can start to slowly remove unwanted ports.
