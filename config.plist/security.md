# Apple Secure Boot

These settings in your config.plist can restrict which macOS versions OpenCore will boot. You will want to check these really quick before booting your USB.

## Misc

### Security -> SecureBootModel

OpenCore by default has [Apple Secure Boot](https://dortania.github.io/OpenCore-Post-Install/universal/security/applesecureboot.html#what-is-apple-secure-boot) enabled.
This enables security features such as the verification of macOS' `boot.efi`, with the side effect of restricting which macOS versions OpenCore will boot.

* Big Sur and Above (11.0+): The recommended value is `Default`.
* High Sierra-Catalina (10.13-10.15):
  * If your model is not listed below, set to `Disabled`.
  * If running Nvidia Web Drivers, set to `Disabled`.
  * If your model is listed, compare the minimum version with the version your installing. Disable if your installer is below the minimum version listed for your SMBIOS.
* Sierra and Below (10.4-10.12): This setting has no effect.
* If booting multiple versions, you may need to set the value to `Disabled`.
  * For example, a non-T2 SMBIOS booting High Sierra and Big Sur would need this disabled.
  * A T2 SMBIOS would be limited by the minimum version listed below.

::: details T2 Mac Models

| SMBIOS                                              | Minimum macOS Version |
| :---                                                | :---                  |
| iMacPro1,1 (December 2017)                          | 10.13.2 (17C2111)     |
| MacBookPro15,1 (July 2018)                          | 10.13.6 (17G2112)     |
| MacBookPro15,2 (July 2018)                          | 10.13.6 (17G2112)     |
| Macmini8,1 (October 2018)                           | 10.14 (18A2063)       |
| MacBookAir8,1 (October 2018)                        | 10.14.1 (18B2084)     |
| MacBookPro15,3 (May 2019)                           | 10.14.5 (18F132)      |
| MacBookPro15,4 (July 2019)                          | 10.14.5 (18F2058)     |
| MacBookAir8,2 (July 2019)                           | 10.14.5 (18F2058)     |
| MacBookPro16,1 (November 2019)                      | 10.15.1 (19B2093)     |
| MacPro7,1 (December 2019)                           | 10.15.1 (19B88)       |
| MacBookAir9,1 (March 2020)                          | 10.15.3 (19D2064)     |
| MacBookPro16,2 (May 2020)                           | 10.15.4 (19E2269)     |
| MacBookPro16,3 (May 2020)                           | 10.15.4 (19E2265)     |
| MacBookPro16,4 (June 2020)                          | 10.15.5 (19F96)       |
| iMac20,1 (August 2020)                              | 10.15.6 (19G2005)     |
| iMac20,2 (August 2020)                              | 10.15.6 (19G2005)     |

:::

# Now with all this done, head to the [Installation Page](../installation/installation-process.md)
