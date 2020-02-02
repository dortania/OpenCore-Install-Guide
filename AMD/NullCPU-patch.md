# Improve GPU performance and remove nullcpupowermanagement.kext
Last edited: Febuary 1, 2020

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

Easiest way to check what 

Now edit your SSDT with MaciASL, then export it via `File` -> `SaveAs` -> `ACPI Machine Language`. Don't forget to add this SSDT to both your config.plist under ACPI -> Add and add the file to EFI/OC/ACPI.

Don't forget that compiled SSDTs have a .aml extension(Assembled)

# 3. Creating the AGPM injector kext

Now open up AGPMInjector and run it, then add the kext to both your config.plist under kernel -> Add and into EFI/OC/Kexts.

And voila! you're done!

# 4. Verifying your work

Open IORegistryExplorer and search for your CPU, then verify that both X86PlatformPlugin and AGPM are connected. If so, then you have proper GPU power management and therefore slightly improved performance.



