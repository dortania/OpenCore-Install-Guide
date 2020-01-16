# Improve GPU performance and remove nullcpupowermanagement.kext
Last edited: January 12, 2020

What you'll need:

* Working hackintosh
* [MaciASL](https://github.com/acidanthera/MaciASL/releases)
* [SSDT-PLUG](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-PLUG.dsl)
* [IORegistryExplorer](https://github.com/toleda/audio_ALCInjection/blob/master/IORegistryExplorer_v2.1.zip)
* [AGPMInjector](https://github.com/Pavo-IM/AGPMInjector/releases)


# 1. Removing nullcpupowermanagement.kext: 


Remove NullCPUPowerManagement.kext and add the following patch to Kernel -> Patch:

Find: `D0 05 00 00 84 C0 74 46 E8`

Replace: `D0 05 00 00 84 C0 EB 46 E8`

Identifier: `com.apple.driver.AppleIntelCPUPowerManagement`

| Enabled | String | YES |
| :--- | :--- | :--- |
| Count | Number | 1 |
| Identifier | String | com.apple.driver.AppleIntelCPUPowerManagement |
| Limit | Nuber | 0 |
| Find | Data | D005000084C07446E8 |
| Replace | Data | D005000084C0EB46E8 |

**Do not reboot yet, you need to follow the entire guide first**
# 2. Create an `plugin-type=1` SSDT:

Now the fun begins, we'll be grabbing our [SSDT-PLUG](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/AcpiSamples/SSDT-PLUG.dsl) and converting it to our system. The specific part we're wanting to adapt is `CPU0` as not all DSDTs have theirs starting with `CPU0`, for us AMD usually exposes this under the CPUSSDT. Generally, AMD uses `C000` but others can be `P000` so you'll want to edit all mentions of `CPU0` to your value.

Easiest way to check what 

Now edit your SSDT with MaciASL, then export it via `File` -> `SaveAs` -> `ACPI Machine Language`. Don't forget to add this SSDT to both your config.plist under ACPI -> Add and add the file to EFI/OC/ACPI.

Don't forget that compiled SSDTs have a .aml extension(Assembled)

# 3. Verifying HPET is on

This is important as this is required for SSDT-PLUG to work correctly, many systems already have it enabled but some need it forced on. To verify yours, open IORegistryExproler and search for `HPET`. Look to the right and try to see what properties this device has, we want it to have `_STA` = `0xF`, if not then we want to enable it.


* [SSDT-XOSI.aml](https://github.com/khronokernel/Opencore-Vanilla-Desktop-Guide/blob/master/extra-files/SSDT-XOSI.aml)
   * Prebuilt so no need to compile, just add to config.plist and EFI/OC/ACPI
* _OSI to XOSI rename under ACPI -> Patch:

| Enabled | String | YES |
| :--- | :--- | :--- |
| Count | Number | 0 |
| Limit | Nuber | 0 |
| Find | Data | 5f 4f 53 49 |
| Replace | Data | 58 4f 53 49 |


# 4. Creating the AGPM injector kext

Now open up AGPMInjector and run it, then add the kext to both your config.plist under kernel -> Add and into EFI/OC/Kexts.

And voila! you're done!

# 5. Verifying your work

Open IORegistryExplorer and search for your CPU, then verify that both X86PlatformPlugin and AGPM are connected. If so, then you have proper GPU power management and therefore slightly improved performance.



