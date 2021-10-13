# Last Config.plist Details

## SecureBootModel

SecureBootModel is used set the Apple Secure Boot hardware model and policy, allowing us to enable Apple's Secure Boot. This has the byproduct of restricting which macOS versions OpenCore will boot though. If you are booting Big Sur or newer, the recommended value is `Default`. If your booting High Sierra-Catalina, you may need to either select `Disabled` or another SecureBootModel which has a low enough minimum version. What `Default` selects is based on your SMBIOS:

* If SMBIOS model is not listed below, `x86legacy` is selected.
* If SMBIOS is listed below, the corrosponding secure boot model is used.

If you are booting anything earlier than High Sierra, you will want to set this value to `Disabled`.
If you are using Nvidia Web Drivers, you will also need to set this value to `Disabled`.

Currently the following options for `Misc -> Security -> SecureBootModel` are supported:

| Value     | SMBIOS                                  | Minimum macOS Version |
| :---      | :---                                    | :---                  |
| Disabled  | No model, Secure Boot will be disabled. | N/A                   |
| Default   | See explanation above                   | Depends on SMBIOS     |
| j137      | iMacPro1,1 (December 2017)              | 10.13.2 (17C2111)     |
| j680      | MacBookPro15,1 (July 2018)              | 10.13.6 (17G2112)     |
| j132      | MacBookPro15,2 (July 2018)              | 10.13.6 (17G2112)     |
| j174      | Macmini8,1 (October 2018)               | 10.14 (18A2063)       |
| j140k     | MacBookAir8,1 (October 2018)            | 10.14.1 (18B2084)     |
| j780      | MacBookPro15,3 (May 2019)               | 10.14.5 (18F132)      |
| j213      | MacBookPro15,4 (July 2019)              | 10.14.5 (18F2058)     |
| j140a     | MacBookAir8,2 (July 2019)               | 10.14.5 (18F2058)     |
| j152f     | MacBookPro16,1 (November 2019)          | 10.15.1 (19B2093)     |
| j160      | MacPro7,1 (December 2019)               | 10.15.1 (19B88)       |
| j230k     | MacBookAir9,1 (March 2020)              | 10.15.3 (19D2064)     |
| j214k     | MacBookPro16,2 (May 2020)               | 10.15.4 (19E2269)     |
| j223      | MacBookPro16,3 (May 2020)               | 10.15.4 (19E2265)     |
| j215      | MacBookPro16,4 (June 2020)              | 10.15.5 (19F96)       |
| j185      | iMac20,1 (August 2020)                  | 10.15.6 (19G2005)     |
| j185f     | iMac20,2 (August 2020)                  | 10.15.6 (19G2005)     |
| x86legacy | Non-T2 Macs in 11.0(Recommended for VMs)| 11.0.1 (20B29)        |

## Cleaning up

And now you're ready to save and place it into your EFI under EFI/OC.

For those having booting issues, please make sure to read the [Troubleshooting section](../troubleshooting/troubleshooting.md) first and if your questions are still unanswered we have plenty of resources at your disposal:

* [r/Hackintosh Subreddit](https://www.reddit.com/r/hackintosh/)
* [r/Hackintosh Discord](https://discord.gg/hackintosh)

# Now with all this done, head to the [Installation Page](../installation/installation-process.md)