# Improve GPU power management and remove nullcpupowermanagement.kext

* Last edited: March 15, 2020
* Supported version: 0.5.6

What you'll need:

* Working hackintosh
* [MaciASL](https://github.com/acidanthera/MaciASL/releases)
* [SSDT-PLUG](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-PLUG.dsl)
* [IORegistryExplorer](https://github.com/toleda/audio_ALCInjection/blob/master/IORegistryExplorer_v2.1.zip)
* [AGPMInjector](https://github.com/Pavo-IM/AGPMInjector/releases)


# 1. Removing nullcpupowermanagement.kext: 

With the release of 0.5.5, OpenCore added a new quirk called `DummyPowerManagement`. This is our new form of NullCPUPowerManagement and should be much stabler compared to the old kext. To enable, make sure BOOTx64.efi, OpenCore.efi and your config.plist have been updated to 0.5.5, then in your config:

* `Kernel  -> Quirks -> DummyPowerManagement -> Enabled`

# 2. Create an `plugin-type=1` SSDT:

Now the fun begins, we'll be grabbing our [SSDT-PLUG](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-PLUG.dsl) and converting it to our system. The specific part we're wanting to adapt is `CPU0` as not all DSDTs have theirs starting with `CPU0`, for us AMD usually exposes this under the CPUSSDT. Generally, AMD uses `C000` but others can be `P000` so you'll want to edit all mentions of `CPU0` to your value.

Easiest way to check what type you have is by opening up MaciASL, then `File -> NewFromACPI -> CPUSSDT`. The problem with this is that many OEMs won't even label their SSDTs correctly, instead opting for `SSDT-1`. To get around this, we have to search through *every god damn SSDT* hoping at least one of them will hold a `Processor` reference. Once you found one, it'll look something like this:

![](https://cdn.discordapp.com/attachments/683011276938543134/687323498649354296/Screen_Shot_2020-03-11_at_9.37.51_AM.png)

From this example, our first `Processor` is tied to `C000` which means that this is our value we want to replace `CPU0` with in our SSDT-PLUG 

Now edit our SSDT-PLUG with MaciASL with the correct name, then export it via `File` -> `SaveAs` -> `ACPI Machine Language`. Don't forget to add this SSDT to both your config.plist under ACPI -> Add and add the file to EFI/OC/ACPI.

Remember that compiled SSDTs have a **.aml** extension(Assembled)

# 3. Creating the AGPM injector kext

Now open up AGPMInjector and run it, then add the kext to both your config.plist under kernel -> Add and into EFI/OC/Kexts.

The specifics of what this kext does is inject extra profiles into AppleGraphicsPowerManagement's Info.plist, as only a select few PCI IDs are within it with SMBIOS lock-in also being prevalent 

And voila! you're done!

# 4. Verifying your work

Open IORegistryExplorer and search for your CPU, then verify that both X86PlatformPlugin and AGPM are connected. If so, then you have proper GPU power management and therefore slightly improved performance.



