# 苹果安全引导

config.plist中的这些设置可以限制OpenCore引导哪些macOS版本。在启动USB之前，你需要快速检查这些。

## Misc

### Security -> SecureBootModel

OpenCore默认启用 [Apple Secure Boot](https://dortania.github.io/OpenCore-Post-Install/universal/security/applesecureboot.html#what-is-apple-secure-boot) 。
这将支持安全功能，如验证macOS的“boot.efi”，其副作用是限制OpenCore将引导哪些macOS版本。

* Big Sur 及以上 (11.0+): 建议设置为 `Default`.
* High Sierra-Catalina (10.13-10.15):
  * 如果你的型号没有在下面列出，设置为`Disabled`
  * 如果运行 NVIDIA Web Drivers, 请将其设置为 `Disabled`.
  * 如果列出了你的型号，将最小版本与你正在安装的版本进行比较。如果您的安装程序低于为您的SMBIOS列出的最低版本，则 Disable 。
* Sierra 及以下 (10.4-10.12): 此设置没有影响。
* 如果引导多个版本，你可能需要将值设置为`Disabled`。
  * 例如，引导High Sierra和Big Sur的非t2 SMBIOS需要禁用此功能。
  * T2 SMBIOS会受到下面列出的最低版本的限制。

::: details T2 Mac 型号

| SMBIOS                                              | macOS 最低版本 |
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

# 现在所有这些都完成了，转到[安装页面](../installation/installation-process.md)
