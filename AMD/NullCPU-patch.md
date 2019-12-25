Improve GPU performance and remove nullcpupowermanagement.kext

What you'll need:

* Working hackintosh
* [MaciASL](https://github.com/acidanthera/MaciASL/releases)
* [SSDT-PLUG](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-PLUG.dsl)
* [IORegistryExplorer](https://github.com/toleda/audio_ALCInjection/blob/master/IORegistryExplorer_v2.1.zip)
* [AGPMInjector](https://github.com/Pavo-IM/AGPMInjector/releases)


1. Removing nullcpupowermanagement.kext: 


Remove nullcpupowermanagement and add the following patch to Kernel -> Patch:

Find: `D0 05 00 00 84 C0 74 46 E8`
Replace: `D0 05 00 00 84 C0 EB 46 E8`
Identifier: `com.apple.driver.AppleIntelCPUPowerManagement`

2. Create an `plugin-type=1` SSDT:

Now the fun begins, we'll be grabbing our [SSDT-PLUG](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-PLUG.dsl) and converting it to our system. The specific part we're wanting to adapt is `_PR.CPU0` as not all DSDTs have theirs starting with `CPU0`, to verify yours you can open IORegistryExplorer and see what's the first device connected to AppleACPICPU. You'll also notice that `C000` will increment based off the number of threads your CPU has. This name is pulled from your DSDT.

For AMD, `C000` is the most common value but `CP00`, `CPU0`, `PR00` are other common values. Please verify yours.

Now edit your SSDT with MaciASL, then export it via `File` -> `SaveAs` -> `ACPI Machine Language`. Don't forget to add this SSDT to both your config.plist under ACPI -> Add and add the file to EFI/OC/ACPI.

Don't forget that compiled SSDTs have a .aml extension(Assembled)

3. Creating the AGPM injector kext

Now open up AGPMInjector and run it, then add the kext to both your config.plist under kernel -> Add and into EFI/OC/Kexts.

And voila! you're done!

4. Verifying your work

Open IORegistryExplorer and search for your CPU, then verify that both X86PlatformPlugin and AGPM are connected. If so, then you have proper GPU power management and therefore slightly improved performance.


