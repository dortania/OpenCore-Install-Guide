# 选择正确的SMBIOS

在为您的机器选择正确的SMBIOS时，您必须了解这不仅仅是简单的CPU匹配。很多事情会影响你的机器的工作方式，因为你的SMBIOS决定了CPU电源管理、GPU配置文件、USB映射等等。

选择SMBIOS时要考虑的主要事情:

* CPU 类型
  * 特别是移动端vs桌面端vs服务器端，因为这会极大地影响睡眠和整个系统的稳定性
  * 这也决定了你是否可以使用苹果的XCPM以及你会得到什么配置文件
    * 这2个主要通过CPUFriend解决:[修复电源管理](https://sumingyd.github.io/OpenCore-Post-Install/universal/pm.html)
  * 注意:AMD cpu不需要关心这个
* GPU 类型
  * 这里会影响很多东西，比如GPU电源管理(AGPM)，显示支持(AGDP)，睡眠(AGDC)等等。
    * 当我们着眼于只使用移动硬件的 [Mac Mini](#mac-mini) SMBIOS时，这一点尤其重要，因为它与桌面硬件并不匹配。这就是我们不鼓励使用它们的原因，除非它们被用于[英特尔的NUC系列](https://www.intel.ca/content/www/ca/en/products/boards-kits/nuc.html) 等基于移动硬件的产品。
    * 笔记本电脑也应该密切关注，因为苹果公司总是假设，当SMBIOS存在dGPU时，所有的显示输出都将通过它路由。当Optimus笔记本电脑的外部显示器通过iGPU连接时，这可能会成为一个问题，导致黑屏问题，需要更多的补丁。
  * 没有iGPU的cpu需要密切关注，因为如果SMBIOS期望iGPU(即每一个iMac SMBIOS)，像快速查看这样的功能将被破坏。
    * F对于这些情况，请仔细查看iMac Pro和Mac Pro的SMBIOS
  * DRM也被捆绑在这里，但这主要是在这里解决:[修复DRM](https://sumingyd.github.io/OpenCore-Post-Install/universal/drm.html)
  
* 操作系统支持
  * 主要与旧的硬件相关，因为macOS可能仍然支持CPU，但不再支持那个时代的SMBIOS
    * Arrandale cpu是一个很好的例子，因为即使在Big Sur它们仍然支持操作系统(但是在10.13.6之后没有iGPU支持)
* USB 设备
  * 某些SMBIOS会有自己的USB地图，可能会连接到你的硬件，导致USB问题。
    * 参见这里了解更多信息:[USB映射](https://sumingyd.github.io/OpenCore-Post-Install/usb/)
  * 还要注意的是，Skylake+ SMBIOS还需要一个[USBX设备](https://github.com/acidanthera/OpenCorePkg/tree/master/Docs/AcpiSamples/Source/SSDT-EC-USBX.dsl#L54L79) 来修复USB电流输出
    * 参见这里了解更多信息:[修复USB电源](https://sumingyd.github.io/OpenCore-Post-Install/usb/misc/power.html)

::: details XCPM 支持 SMBIOS

| SMBIOS |
| :--- |
| MacBook8,1+ |
| MacBookAir6,x+ |
| MacBookPro11,x+ |
| Macmini7,1+ |
| iMac14,x+ |
| iMacPro1,1 |
| MacPro7,1+ |

:::

## 如何决定

通常我们对SMBIOS的建议如下:

1. 尽可能地找到正确的CPU代数和架构
2. 然后只匹配iGPU或dGPU SMBIOS
3. 最终决定杂项内容(如精确的GPU和CPU)

还有一些关于SMBIOS的特别注意事项:

* iMacPro1,1和MacPro7,1是唯一允许dGPU处理所有工作负载的2个SMBIOS，包括后台渲染和其他iGPU将处理的任务
  * 如果你需要，我们只推荐这个SMBIOS，但是你可能需要修复电源管理，因为如果你的硬件不是这个类(如HEDT/Server/AMD)，睡眠可能会中断:[修复电源管理](https://sumingyd.github.io/OpenCore-Post-Install/universal/pm.html)
  * 请注意，这需要Polaris, Vega或Navi GPU才能正常工作。
* iMac20,2是一个定制的SMBIOS，只适用于苹果定制的i9-10910 CPU，所以除非你有i9-10900K，我们建议使用iMac20,1
* 应该避免使用Mac Mini SMBIOS，除非你运行的是没有内置显示器的移动硬件
  * Intel NUCs是这种SMBIOS的理想硬件
* 不支持iGPU的cpu在选择SMBIOS时**必须**非常注意，因为苹果公司总是假设iMac SMBIOS上存在iGPU，所以你需要找一个没有这个要求的SMBIOS，比如iMac Pro或Mac Pro。
  * 这也适用于AMD cpu

## macOS SMBIOS列表

这是苹果在macOS中支持的所有SMBIOS的完整列表，包括CPU和GPU类型等额外信息。

[[toc]]

信息来源：[EveryMac](https://everymac.com)和[OpenCorePkg](https://github.com/acidanthera/OpenCorePkg)

**特别注意**:

* 每个CPU家族旁边的字母是CPU的级别，详见下表:

| 字母 | 类型 |
| :--- | :--- |
| Y | 移动(低端) |
| U, M | 移动(中端) |
| H, QM, HQ | 移动(高端) |
| S | 桌面 |
| EP, SP, W, X | HEDT/服务器 |

### MacBook

| SMBIOS | CPU家族 | GPU | board-id | 最初支持 | 最后支持版本 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| MacBook1,1     | Yonah(M)        | GMA 950                       | Mac-F4208CC8       | 10.4.6 (8I2025) | 10.6.8 |
| MacBook2,1     | Merom(M)        | GMA 950                       | Mac-F4208CA9   | 10.4.8 (8N1108) | 10.7.5 |
| MacBook3,1     | Merom(M)        | GMA X3100                     | Mac-F22788C8   | 10.5 (9A3111) | ^^ |
| MacBook4,1     | Penryn(M)       | GMA X3100                     | Mac-F22788A9   | 10.5.2 (9C2015) | ^^ |
| MacBook5,1     | Penryn(M)       | GeForce 9400M                 | Mac-F42D89C8   | 10.5.5 (9F2114) | 10.11.6 |
| MacBook5,2     | Penryn(M)       | GeForce 9400M                 | Mac-F22788AA   | 10.5.6 (9G2110) | ^^ |
| MacBook6,1     | Penryn(M)       | GeForce 9400M                 | Mac-F22C8AC8   | 10.6.1 (10A2047) | 10.13.6 |
| MacBook7,1     | Penryn(M)       | GeForce 320M                  | Mac-F22C89C8   | 10.6.3 (10D2162) | ^^ |
| MacBook8,1     | Broadwell(Y)    | HD 5300                       | Mac-BE0E8AC46FE800CC | 10.10.2 (14C2061) | 11.7.x |
| MacBook9,1     | Skylake(Y)      | HD 515                        | Mac-9AE82516C7C6B903 | 10.11.4 (15E2066) | 12.6.x |
| MacBook10,1    | Kaby Lake(Y)    | HD 615                        | Mac-EE2EBD4B90B839A8 | 10.12.5 (16F207) | Current |

### MacBook Air

| SMBIOS | CPU家族 | GPU | board-id | 最初支持 | 最后支持版本 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| MacBookAir1,1  | Merom(M)        | GMA X3100     (11")                | Mac-F42C8CC8 | 10.5.1 (9B2324) | 10.7.5 |
| MacBookAir2,1  | Penryn(M)       | GeForce 9400M (13")                | Mac-F42D88C8 | 10.5.5 | 10.11.6 |
| MacBookAir3,1  | Penryn(M)       | GeForce 320M  (11")                | Mac-942452F5819B1C1B | 10.6.4 (10F3061) | 10.13.6 |
| MacBookAir3,2  | Penryn(M)       | GeForce 320M  (13")                | Mac-942C5DF58193131B | 10.6.4 (10F3061) | ^^ |
| MacBookAir4,1  | Sandy Bridge(M) | HD 3000 (11")                      | Mac-C08A6BB70A942AC2 | 10.7 (11A2063) | ^^ |
| MacBookAir4,2  | Sandy Bridge(M) | HD 3000 (13")                      | Mac-742912EFDBEE19B3 | 10.7 (11A2063) | ^^ |
| MacBookAir5,1  | Ivy Bridge(U)   | HD 4000 (11")                      | Mac-66F35F19FE2A0D05 | 10.7.4 (11E2520) | 10.15.7 |
| MacBookAir5,2  | Ivy Bridge(U)   | HD 4000 (13")                      | Mac-2E6FAB96566FE58C | 10.8.2 (12C2034) | ^^ |
| MacBookAir6,1  | Haswell(U)      | HD 5000 (11")                      | Mac-35C1E88140C3E6CF | 10.8.4 (12E3067) | 11.7.x |
| MacBookAir6,2  | Haswell(U)      | HD 5000 (13")                      | Mac-7DF21CB3ED6977E5 | 10.8.4 (12E3067) | ^^ |
| MacBookAir7,1  | Broadwell(U)    | HD 6000 (11")                      | Mac-9F18E312C5C2BF0B | 10.10.2 (14C2507) | 12.6.x |
| MacBookAir7,2  | Broadwell(U)    | HD 6000 (13")                      | Mac-937CB26E2E02BB01 | 10.10.2 (14C2507) | ^^ |
| MacBookAir8,1  | Amber Lake(Y)   | UHD 617 (13")                      | Mac-827FAC58A8FDFA22 | 10.14.1 (18B2084) | Current |
| MacBookAir8,2  | Amber Lake(Y)   | UHD 617 (13")                      | Mac-226CB3C6A851A671 | 10.14.5 (18F2058) | ^^ |
| MacBookAir9,1  | Ice Lake(Y)     | Iris Plus G4/G7 (13")              | Mac-0CFF9C7C2B63DF8D | 10.15.4 (19E287) | ^^ |

### MacBook Pro

| SMBIOS | CPU家族 | GPU | board-id | 最初支持 | 最后支持版本 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| MacBookPro1,1  | Yonah(M)        | Radeon X1600 (15")                 | Mac-F425BEC8 | 10.4.5 (8G1453) | 10.6.8 |
| MacBookPro1,2  | Yonah(M)        | Radeon X1600 (17")                 | Mac-F42DBEC8 | 10.4.6 (8I2032) | ^^ |
| MacBookPro2,1  | Merom(M)        | Radeon X1600 (15")                 | Mac-F42189C8 | 10.4.8 (8N1051) | 10.7.5 |
| MacBookPro2,2  | Merom(M)        | Radeon X1600 (17")                 | Mac-F42187C8 | 10.4.8 (8N1037) | ^^ |
| MacBookPro3,1  | Merom(M)        | GeForce 8600M GT (15/17")          | Mac-F4238BC8 | 10.4.9 (8Q1058) | 10.11.6 |
| MacBookPro4,1  | Penryn(M)       | GeForce 8600MG GT (17")            | Mac-F42C89C8 | 10.5.2 (9C2018) | ^^ |
| MacBookPro5,1  | Penryn(M)       | GeForce 9400M/9600M GT (15")       | Mac-F42D86C8 | 10.5.5 (9F2114) | ^^ |
| MacBookPro5,2  | Penryn(M)       | GeForce 9400M/9600M GT (17")       | Mac-F2268EC8 | 10.5.6 (9G2141) | ^^ |
| MacBookPro5,3  | Penryn(M)       | GeForce 9400M/9600M GT (15")       | Mac-F22587C8 | 10.5.7 (9J3050) | ^^ |
| MacBookPro5,4  | Penryn(M)       | GeForce 9400M/9600M GT (15")       | Mac-F22587A1 | 10.5.7 (9J3050) | ^^ |
| MacBookPro5,5  | Penryn(M)       | GeForce 9400M/9600M GT (13")       | Mac-F2268AC8 | 10.5.7 (9J3050) | ^^ |
| MacBookPro6,1  | Arrandale(M)    | HD Graphics/GeForce GT 330M (17")  | Mac-F22589C8 | 10.6.3 (10D2063a) | 10.13.6 |
| MacBookPro6,2  | Arrandale(M)    | HD Graphics/GeForce GT 330M (15")  | Mac-F22586C8 | 10.6.3 (10D2094) | 10.13.6 |
| MacBookPro7,1  | Penryn(M)       | GeForce 320M (13")                 | Mac-F222BEC8 | 10.6.3 (10D2125) | ^^ |
| MacBookPro8,1  | Sandy Bridge(M) | HD 3000 (13")                      | Mac-94245B3640C91C81 | 10.6.6 (10J3210) | ^^ |
| MacBookPro8,2  | Sandy Bridge(QM)| HD 3000/Radeon HD 6490M (15")      | Mac-94245A3940C91C80 | 10.6.6 (10J3210) | ^^ |
| MacBookPro8,3  | Sandy Bridge(QM)| HD 3000/Radeon HD 6750M (17")      | Mac-942459F5819B171B | 10.6.6 (10J3210) | ^^ |
| MacBookPro9,1  | Ivy Bridge(QM)  | HD 4000/GeForce GT 650M (15")      | Mac-4B7AC7E43945597E | 10.7.3 (11D2097) | 10.15.7 |
| MacBookPro9,2  | Ivy Bridge(M)   | HD 4000 (13")                      | Mac-6F01561E16C75D06 | 10.7.3 (11D2515) | ^^ |
| MacBookPro10,1 | Ivy Bridge(QM)  | HD 4000/GeForce GT 650M (15")      | Mac-C3EC7CD22292981F | 10.7.4 (11E2068) | ^^ |
| MacBookPro10,2 | Ivy Bridge(M)   | HD 4000 (13")                      | Mac-AFD8A9D944EA4843 | 10.8.2 (12C2034) | ^^ |
| MacBookPro11,1 | Haswell(U)      | Iris 5100 (13")                    | Mac-189A3D4F975D5FFC | 10.9 (13A2093) | 11.7.x |
| MacBookPro11,2 | Haswell(HQ)     | Iris Pro 5200 (15")                | Mac-3CBD00234E554E41 | 10.9 (13A3017) | ^^ |
| MacBookPro11,3 | Haswell(HQ)     | Iris Pro 5200/GeForce GT 750M (15")| Mac-2BD1B31983FE1663 | 10.9 (13A3017) | ^^ |
| MacBookPro11,4 | Haswell(HQ)     | Iris Pro 5200 (15")                | Mac-06F11FD93F0323C5 | 10.10.3 (14D2134) | 12.6.x |
| MacBookPro11,5 | Haswell(HQ)     | Iris Pro 5200/Radeon R9 M370X (15")| Mac-06F11F11946D27C5 | 10.10.3 (14D2134) | ^^ |
| MacBookPro12,1 | Broadwell(U)    | Iris 6100 (13")                    | Mac-E43C1C25D4880AD6 | 10.10.2 (14C2507) | ^^ |
| MacBookPro13,1 | Skylake(U)      | Iris 540 (13")                     | Mac-473D31EABEB93F9B | 10.12 (16A2323a) | ^^ |
| MacBookPro13,2 | Skylake(U)      | Iris 550 (13")                     | Mac-66E35819EE2D0D05 | 10.12.1 (16B2657) | ^^ |
| MacBookPro13,3 | Skylake(H)      | HD 530/Radeon Pro 450 (15")        | Mac-A5C67F76ED83108C | 10.12.1 (16B2659) | ^^ |
| MacBookPro14,1 | Kaby Lake(U)    | Iris Plus 640 (13")                | Mac-B4831CEBD52A0C4C | 10.12.5 (16F2073) | Current |
| MacBookPro14,2 | Kaby Lake(U)    | Iris Plus 650 (13")                | Mac-CAD6701F7CEA0921 | 10.12.5 (16F2073) | ^^ |
| MacBookPro14,3 | Kaby Lake(H)    | HD 630/Radeon Pro 555 (15")        | Mac-551B86E5744E2388 | 10.12.5 (16F2073) | ^^ |
| MacBookPro15,1 | Coffee Lake(H)  | UHD 630/Radeon Pro 555X (15")      | Mac-937A206F2EE63C01 | 10.13.6 (17G2112) | ^^ |
| MacBookPro15,2 | Coffee Lake(U)  | Iris Plus 655 (13")                | Mac-827FB448E656EC26 | 10.13.6 (17G2112) | ^^ |
| MacBookPro15,3 | Coffee Lake(H)  | UHD 630/Radeon Pro Vega 16 (15")   | Mac-1E7E29AD0135F9BC | 10.14.1 (18B3094) | ^^ |
| MacBookPro15,4 | Coffee Lake(U)  | Iris Plus 645 (13")                | Mac-53FDB3D8DB8CA971 | 10.14.5 (18F2058) | ^^ |
| MacBookPro16,1 | Coffee Lake(H)  | UHD 630/Radeon Pro 5300 (16")      | Mac-E1008331FDC96864 | 10.15.1 (19B2093) | ^^ |
| MacBookPro16,2 | Ice Lake(U)     | Iris Plus G4/G7 (13")              | Mac-5F9802EFE386AA28 | 10.15.4 (19E2269) | ^^ |
| MacBookPro16,3 | Coffee Lake(U)  | Iris Plus 645 (13")                | Mac-E7203C0F68AA0004 | 10.15.4 (19E2269) | ^^ |
| MacBookPro16,4 | Coffee Lake(H)  | UHD 630/Radeon Pro 5600M (16")     | Mac-A61BADE1FDAD7B05 | 10.15.1 (19B2093) | ^^ |

### Mac Mini

| SMBIOS | CPU家族 | GPU | board-id | 最初支持 | 最后支持版本 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Macmini1,1     | Yonah(M)        | GMA 950                       | Mac-F4208EC8           | 10.4.5 (8H1619) | 10.6.8 |
| Macmini2,1     | Merom(M)        | GMA 950                       | Mac-F4208EAA           | 10.4.10 (8R3014) | 10.7.5 |
| Macmini3,1     | Penryn(M)       | GeForce 9400M                 | Mac-F22C86C8           | 10.5.6 (9G2030) | 10.11.6 |
| Macmini4,1     | Penryn(M)       | GeForce 320M                  | Mac-F2208EC8           | 10.6.4 (10F2025) | 10.13.6 |
| Macmini5,1     | Sandy Bridge(M) | HD 3000                       | Mac-8ED6AF5B48C039E1   | 10.7 (11A2061) | ^^ |
| Macmini5,2     | Sandy Bridge(M) | Radeon HD 6630M               | Mac-4BC72D62AD45599E   | 10.7 (11A2061) | ^^ |
| Macmini5,3     | Sandy Bridge(QM)| HD 3000                       | Mac-7BA5B2794B2CDB12   | 10.7 (11A2061) | ^^ |
| Macmini6,1     | Ivy Bridge(M)   | HD 4000                       | Mac-031AEE4D24BFF0B1   | 10.8.1 (12B2080) | 10.15.7 |
| Macmini6,2     | Ivy Bridge(QM)  | HD 4000                       | Mac-F65AE981FFA204ED   | 10.8.1 (12B2080) | ^^ |
| Macmini7,1     | Haswell(U)      | HD 5000 or Iris 5100          | Mac-35C5E08120C7EEAF   | 10.10 (14A389) | 12.6.x |
| Macmini8,1     | Coffee Lake(H)  | UHD 630                       | Mac-7BA5B2DFE22DDD8C   | 10.14 (18A2063) | Current |

### iMac

| SMBIOS | CPU家族 | GPU | board-id | 最初支持 | 最后支持版本 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| iMac4,1        | Yonah(M)        | Radeon X1600                  | Mac-F42786C8   | 10.4.4 (8G1165)      | 10.6.8 |
| iMac4,2        | Yonah(M)        | GMA 950                       | Mac-F4218EC8   | 10.4.7 (8I2057)      | ^^ |
| iMac5,1        | Merom(M)        | Radeon X1600                  | Mac-F4228EC8   | 10.4.7 (8K1106)      | 10.7.5 |
| iMac5,2        | Merom(M)        | GMA 950                       | Mac-F4218EC8   | 10.4.7 (8K1106)      | ^^ |
| iMac6,1        | Merom(M)        | GeForce 7300GT                | Mac-F4218FC8   | 10.4.7 (8K1123)      | ^^ |
| iMac7,1        | Merom(M)        | Radeon HD 2400 XT             | Mac-F42386C8   | 10.4.10 (8R4031)      | 10.11.6 |
| iMac8,1        | Penryn(M)       | Radeon HD 2400 XT             | Mac-F227BEC8   | 10.5.2 (9C2028)      | ^^ |
| iMac9,1        | Penryn(M)       | GeForce 9400M                 | Mac-F2218FA9   | 10.5.6 (9G2030)      | ^^ |
| iMac10,1       | Wolfdale(S)     | GeForce 9400M                 | Mac-F221DCC8   | 10.6.1 (10A2155)      | 10.13.6 |
| iMac10,1       | Wolfdale(S)     | Radeon HD 4670                | Mac-F2268CC8   | 10.6.1 (10A2155)      | ^^ |
| iMac11,1       | Lynnfield(S)    | Radeon HD 4850                | Mac-F2268DAE   | 10.6.2 (10C2234)      | ^^ |
| iMac11,2       | Clarkdale(S)    | Radeon HD 4670                | Mac-F2238AC8   | 10.6.3 (10D2322a)      | ^^ |
| iMac11,3       | Clarkdale(S)    | Radeon HD 5670                | Mac-F2238BAE   | 10.6.3 (10D2322a)      | ^^ |
| iMac12,1       | Sandy Bridge(S) | Radeon HD 6750M               | Mac-942B5BF58194151B | 10.6.6 (10J4026)      | ^^ |
| iMac12,2       | Sandy Bridge(S) | Radeon HD 6770M               | Mac-942B59F58194171B | 10.6.6 (10J4026)      | ^^ |
| iMac13,1       | Ivy Bridge(S)   | GeForce GT 640M               | Mac-00BE6ED71E35EB86 | 10.8.2 (12C3104)      | 10.15.7 |
| iMac13,1       | Ivy Bridge(S)   | HD 4000                       | Mac-00BE6ED71E35EB86 | 10.8.2 (12C3104)      | ^^ |
| iMac13,2       | Ivy Bridge(S)   | GeForce GTX 660M              | Mac-FC02E91DDD3FA6A4 | 10.8.2 (12C2037)      | ^^ |
| iMac13,3       | Ivy Bridge(S)   | HD 4000                       | Mac-7DF2A3B5E5D671ED | 10.8.2 (12C2037)      | ^^ |
| iMac14,1       | Haswell(S)      | Iris Pro 5200                 | Mac-031B6874CF7F642A | 10.8.4 (12E4022)      | ^^ |
| iMac14,2       | Haswell(S)      | GeForce GT 750M               | Mac-27ADBB7B4CEE8E61 | 10.8.4 (12E4022)      | ^^ |
| iMac14,3       | Haswell(S)      | GeForce GT 755M               | Mac-77EB7D7DAF985301 | 10.8.4 (12E4022)      | ^^ |
| iMac14,4       | Haswell(U)      | HD 5000                       | Mac-81E3E92DD6088272 | 10.9.3 (13D2061)      | 11.7.x |
| iMac15,1       | Haswell(S)      | Radeon R9 M290X               | Mac-42FD25EABCABB274 | 10.10 (14A389)      | ^^ |
| iMac16,1       | Broadwell(U)    | HD 6000 or Iris Pro 6200      | Mac-A369DDC4E67F1C45 | 10.11 (15A2301)      | 12.6.x |
| iMac16,2       | Broadwell(S)    | Iris Pro 6200                 | Mac-FFE5EF870D7BA81A | 10.11 (15A2301)      | ^^ |
| iMac17,1       | Skylake(S)      | Radeon R9 M380                | Mac-DB15BD556843C820, Mac-65CE76090165799A, Mac-B809C3757DA9BB8D | 10.11 (15A4310)      | ^^ |
| iMac18,1       | Kaby Lake(U)    | Iris Plus 640                 | Mac-4B682C642B45593E | 10.12.4 (16E2193)      | Current |
| iMac18,2       | Kaby Lake(S)    | Radeon Pro 555                | Mac-77F17D7DA9285301 | 10.12.4 (16F2073)      | ^^ |
| iMac18,3       | ^^              | Radeon Pro 570                | Mac-BE088AF8C5EB4FA2 | 10.12.4 (16F2073)      | ^^ |
| iMac19,1       | Coffee Lake(S)  | Radeon Pro 570X               | Mac-AA95B1DDAB278B95 | 10.14.4 (18E226)      | ^^ |
| iMac19,2       | ^^              | Radeon Pro 555X               | Mac-63001698E7A34814 | 10.14.4 (18E226)      | ^^ |
| iMac20,1       | Comet Lake(S)   | Radeon Pro 5300               | Mac-CFF7D910A743CAAF | 10.15.6 (19G2005)      | ^^ |
| iMac20,2       | ^^   | ^^                                       | Mac-AF89B6D9451A490B | 10.15.6 (19G2005)      | ^^ |

### iMac Pro

| SMBIOS | CPU家族 | GPU | board-id | 最初支持 | 最后支持版本 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| iMacPro1,1     | Skylake-W    | Vega 56                       | Mac-7BA5B2D9E42DDD94       | 10.13.2 (17C2111) | Current |

### Mac Pro

| SMBIOS | CPU家族 | GPU | board-id | 最初支持 | 最后支持版本 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| MacPro1,1      | Woodcrest     | GeForce 7300 GT               | Mac-F4208DC8           | 10.4.7 (8K1079) | 10.7.5 |
| MacPro2,1      | Clovertown    | ^^                            | Mac-F4208DA9           | 10.4.9 (8P4037) | ^^ |
| MacPro3,1      | Harpertown    | Radeon HD 2600 XT             | Mac-F42C88C8           | 10.5.1 (9B2117) | 10.11.6 |
| MacPro4,1      | Nehalem       | GeForce GT 120                | Mac-F221BEC8           | 10.5.6 (9G3553) | ^^ |
| MacPro5,1      | Nehalem       | Radeon HD 5770                | Mac-F221BEC8           | 10.6.4 (10F2521) | 10.14.6 |
| MacPro5,1      | Westmere EP   | ^^                            | Mac-F221BEC8           | 10.6.4 (10F2521) | ^^ |
| MacPro6,1      | Ivy Bridge EP | FirePro D300                  | Mac-F60DEB81FF30ACF6   | 10.9.1 (13B4116) | 12.6.x |
| MacPro7,1      | Cascade Lake-W| Radeon Pro 580X               | Mac-27AD2F918AE68F61   | 10.15.0 (19A583) | Current |

### Xserve

| SMBIOS | CPU家族 | GPU | board-id | 最初支持 | 最后支持版本 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Xserve1,1      | Woodcrest    | Radeon X1300                  | Mac-F4208AC8           | Server 10.4.8 (8N1215) | Server 10.7.5 |
| Xserve2,1      | Harpertown   | ^^                            | Mac-F42289C8           | Server 10.5 (9B2117) | ^^ |
| Xserve3,1      | Nehalem EP   | GeForce GT 120                | Mac-F223BEC8           | Server 10.5.6 | 10.11.6 |

### 其他SMBIOS

OpenCore不支持下面列出的所有型号，但为了方便参考，这里列出了文档。

* 苹果开发平台
  * [Developer Transition Kit](#developer-transition-kit)
* 苹果芯片
  * [Mac Mini](#mac-mini-apple-silicon)
  * [MacBook Air](#macbook-air-apple-silicon)
  * [MacBook Pro](#macbook-pro-apple-silicon)
  * [iMac](#imac-apple-silicon)
* PowerPC
  * [PowerBook](#powerbook-powerpc)
  * [iBook](#ibook-powerpc)
  * [PowerMac](#powermac-powerpc)
  * [iMac](#imac-powerpc)
  * [eMac](#emac-powerpc)
  * [Cube](#cube-powerpc)
  * [Mac Mini](#mac-mini-powerpc)
  * [Xserve](#xserve-powerpc)
  
::: details 苹果芯片笔记本

关于苹果cpu的额外信息:

* 它们不依赖ACPI或UEFI
* 他们的固件中不包含DeviceProperties
* 他们使用iPad8,6 iOS/iPadOS应用程序
* board-id仅适用于Intel mac, PowerPC和ARM没有这个条目

:::

#### Developer Transition Kit

| SMBIOS | 年代 | CPU家族 | 产品标识 | 初始支持 |
| :--- | :--- | :--- | :--- | :--- |
| ADP2,1 | Mid 2005 | Intel Prescott | N/A | 10.4.1 (8B1025) |
| ADP3,2 | Mid 2020 | Apple A12Z | J273 | 11.0.0 (20A5299w) |

#### Mac Mini - Apple Silicon

| SMBIOS | 年代 | CPU家族 | 产品标识 | 初始支持 |
| :--- | :--- | :--- | :--- | :--- |
| Macmini9,1 | Late 2020 |  Apple M1 | J274 | 11.0.0 (20A2411) |

#### MacBook Air - Apple Silicon

| SMBIOS | 年代 | CPU家族 | 产品标识 | 初始支持 |
| :--- | :--- | :--- | :--- | :--- |
| MacBookAir10,1 | Late 2020 |  Apple M1 | J313 | 11.0.0 (20A2411) |

#### MacBook Pro - Apple Silicon

| SMBIOS | 年代 | CPU家族 | 产品标识 | 初始支持 |
| :--- | :--- | :--- | :--- | :--- |
| MacBookPro17,1 | Late 2020 | Apple M1 | J293 | 11.0.0 (20A2411) |

<!-- Needed for VuePress to not break -->
<!-- | MacBookPro18,1 | Late 2021 | Apple M1X(?) | J314 | Unknown | -->
<!-- | MacBookPro18,2 | Late 2021 | Apple M1X(?) | J316 | Unknown | -->

#### iMac - Apple Silicon

| SMBIOS | 年代 | CPU家族 | 产品标识 | 初始支持 |
| :--- | :--- | :--- | :--- | :--- |
| iMac21,1 | Mid 2021 | Apple M1 | J256 | 11.3 (20E232?) |
| iMac21,2 | Mid 2021 | Apple M1 | J257 | 11.3 (20E232?) |

::: details Power PC SMBIOS Table

<br/>

#### PowerBook - PowerPC

| SMBIOS | 年代 | CPU家族 | 初始支持 | 最后支持版本 |
| :--- | :--- | :--- | :--- | :--- |
| PowerBook1,1 | Mid-1999 | PowerPC 750 (G3) | 8.6 | 10.3.9 |
| PowerBook3,1 | Early 2000 | ^^ | 9.0.2 | 10.4.11 |
| PowerBook3,2 | Early 2001 | PowerPC 7410 (G4) | 9.1 | ^^ |
| PowerBook3,3 | Late 2001 | PowerPC 7440 (G4) | 9.2.1 | ^^ |
| PowerBook3,4 | Mid-2002 | PowerPC 7451 (G4) | 9.2.2 | ^^ |
| PowerBook3,5 | Late 2002 | PowerPC 7455 (G4) | ^^ | 10.5.8 |
| PowerBook5,1 | Early 2003 | ^^ | 10.2.4 | ^^ |
| PowerBook5,2 | Late 2003 | PowerPC 7447 (G4) | 10.2.7 | ^^ |
| PowerBook5,3 | ^^ | ^^ | ^^ | ^^ |
| PowerBook5,4 | Mid-2004 | PowerPC 7447a (G4) | 10.3.3 | ^^ |
| PowerBook5,5 | ^^ | ^^ | ^^ | ^^ |
| PowerBook5,6 | Early 2005 | 10.3.7 | ^^ | ^^ |
| PowerBook5,7 | ^^ | ^^ | ^^ | ^^ |
| PowerBook5,8 | Late 2005 | ^^ | 10.4.2 | ^^ |
| PowerBook5,9 | ^^ | ^^ | ^^ | ^^ |
| PowerBook6,1 | Early 2003 | PowerPC 7455 (G4) | 10.2.3 | ^^ |
| PowerBook6,2 | ^^ | ^^ | ^^ | ^^ |
| PowerBook6,4 | Mid-2004 | PowerPC 7447a (G4) | 10.2.7 | ^^ |
| PowerBook6,8 | Early 2005 | ^^ | 10.3.7 | ^^ |

#### iBook - PowerPC

| SMBIOS | 年代 | CPU家族 | 初始支持 | 最后支持版本 |
| :--- | :--- | :--- | :--- | :--- |
| PowerBook2,1 | Mid-1999 | PowerPC 750 (G3) | 8.6 | 10.3.9 |
| PowerBook2,2 | Late 2000 | PowerPC 750cx (G3) | 9.0.4 | 10.4.11 |
| PowerBook4,1 | Late 2002 | PowerPC 7455 (G4) | 9.2.2 | 10.5.8 |
| PowerBook4,2 | Early 2002 | PowerPC 750cx (G3) | 9.2.1 | 10.4.11 |
| PowerBook4,3 | Mid-2002 | PowerPC 750fx (G3) | 9.2.2 | ^^ |
| PowerBook6,3 | Late 2003 | PowerPC 7457 (G4) | 10.3 (7B85) | ^^ |
| PowerBook6,5 | Mid-2004 | PowerPC 7447a (G4) | 10.3.3 (7G51) | 10.5.8 |
| PowerBook6,7 | Mid-2005 | ^^ | 10.4.2 (8D37) | ^^ |

#### PowerMac - PowerPC

| SMBIOS | 年代 | CPU家族 | 初始支持 | 最后支持版本 |
| :--- | :--- | :--- | :--- | :--- |
| PowerMac1,1 | Early 1999 | PowerPC 750 (G3) | 8.5.1 | 10.4.11 |
| PowerMac1,2 | Mid 1999 | PowerPC 7400 (G4) | 8.6 | ^^ |
| PowerMac3,1 | ^^ | ^^ | ^^ | ^^ |
| PowerMac3,2 | Mid-2001 | PowerPC 7450 (G4) | 9.2 | ^^ |
| PowerMac3,3 | Mid-2000 | PowerPC 7400 (G4) | 9.0.4 | ^^ |
| PowerMac3,4 | Early 2001 | PowerPC 7410 (G4) | 9.1 | ^^ |
| PowerMac3,5 | Mid-2001 | PowerPC 7450 (G4) | 9.2 | 10.5.8 |
| PowerMac3,6 | Mid-2002 | PowerPC 7455 (G4) | 9.2.2 | ^^ |
| PowerMac7,2 | Mid-2003 | PowerPC 970 (G5) | 10.2.7 | ^^ |
| PowerMac7,3 | Early-2005 | PowerPC 970fx (G5) | 10.4 | ^^ |
| PowerMac9,1 | Late 2004 | ^^ | 10.3.5 (8E90) | ^^ |
| PowerMac11,2 | Late 2005 | PowerPC 970MP (G5) | 10.4.2 | ^^ |

#### iMac - PowerPC

| SMBIOS | 年代 | CPU家族 | 初始支持 | 最后支持版本 |
| :--- | :--- | :--- | :--- | :--- |
| iMac,1 | Mid 1998 | PowerPC 750 (G3) | 8.1 | 10.3.9 |
| PowerMac2,1 | Late 1999 | ^^ | 8.6 | 10.4.11 |
| PowerMac2,2 | Mid 2000 | ^^ | 9.0.4 | 10.3.9 |
| PowerMac4,1 | Early 2001 | PowerPC 750cx (G3) | 9.1 | 10.4.11 |
| PowerMac4,2 | Early 2002 | PowerPC 7441 (G4) | 9.2.2 | ^^ |
| PowerMac4,5 | Mid-2002 | PowerPC 7445 (G4) | 9.2.2 | ^^ |
| PowerMac6,1 | Early 2003 | ^^ | 10.2.3 | 10.5.8 |
| PowerMac6,3 | Late 2003 | ^^ | 10.3.1 | ^^ |
| PowerMac8,1 | Mid-2004 | PowerPC 970 (G5) | 10.3.5 (7P35) | ^^ |
| PowerMac8,2 | Mid-2005 | ^^ | 10.4 (8A428) | ^^ |
| PowerMac12,1 | Late 2005 | PowerPC 970fx (G5) | 10.4.2 (8E102) | ^^ |

#### eMac - PowerPC

| SMBIOS | 年代 | CPU家族 | 初始支持 | 最后支持版本 |
| :--- | :--- | :--- | :--- | :--- |
| PowerMac4,4 | Mid-2003 | PowerPC 7445 (G4 | 9.2.2 | 10.5.8 |
| PowerMac6,4 | Early 2004 | PowerPC 7447a (G4) | 10.3.3 | ^^ |

#### Cube - PowerPC

| SMBIOS | 年代 | CPU家族 | 初始支持 | 最后支持版本 |
| :--- | :--- | :--- | :--- | :--- |
| PowerMac5,1 | Mid-2000 | PowerPC 7400 (G4) | 9.0.4 | 10.4.11 |
| PowerMac5,2 | ^^ | ^^ | ^^ | ^^ |

#### Mac Mini - PowerPC

| SMBIOS | 年代 | CPU家族 | 初始支持 | 最后支持版本 |
| :--- | :--- | :--- | :--- | :--- |
| PowerMac10,1 | Early 2005 | PowerPC 7447a (G4) | 10.3.7 (7T11) | 10.5.8 |
| PowerMac10,2 | Late 2005 | ^^ | 10.4.2 (8D40) | ^^ |

#### Xserve - PowerPC

| SMBIOS | 年代 | CPU家族 | 初始支持 | 最后支持版本 |
| :--- | :--- | :--- | :--- | :--- |
| RackMac1,1 | Mid-2002 | PowerPC 7455 (G4) | 10.1.5 (6C115) | Server 10.5.8 |
| RackMac1,2 | Early 2003 | ^^ | 10.2.4 (6I34) | ^^ |
| RackMac3,1 | Early 2004 | PowerPC 970fx (G5) | 10.3.0 | ^^ |

:::
