# Choosing the right SMBIOS

When choosing the right SMBIOS for your machine, you've gotta understand that it's more than just simple CPU match up. Many things can affect how your machine works as your SMBIOS determines CPU Power management, GPU profiles, USB maps and much more.

The main things to consider when selecting your SMBIOS:

* CPU Type
  * Specifically mobile vs desktop vs server, as this can greatly affect sleep and overall system stability
  * This also determines whether or not you can use Apple's XCPM and what profiles you get
    * These 2 are mostly resolved with CPUFriend: [Fixing Power management](https://dortania.github.io/OpenCore-Post-Install/universal/pm.html)
  * Note AMD CPUs do not need to concern about this
* GPU Type
  * Many things are affected here, like GPU power management(AGPM), display out support(AGDP), sleep(AGDC) and much more.
    * This is especially relevant when we look to the [Mac Mini](#mac-mini) SMBIOS that only uses mobile hardware, which doesn't match well with desktop hardware. This is the reason we highly discourage them unless used for [Intel's NUC series](https://www.intel.ca/content/www/ca/en/products/boards-kits/nuc.html) and such which are based off mobile hardware.
    * Laptops should also pay very close attention, as Apple always assumes that when a dGPU is present for the SMBIOS, all display outs will be routed through it. This can become an issue when an Optimus laptop has its external displays wired through the iGPU instead, causing black screen issues which would require more patching.
  * CPUs without an iGPU need to pay very close attention, as features like Quicklook and such will be broken if the SMBIOS expects an iGPU(ie. Every single iMac SMBIOS)
    * For these situations, look closely at the iMac Pro and Mac Pro SMBIOS
  * DRM is also tied in here as well however this is mostly resolved here: [Fixing DRM](https://dortania.github.io/OpenCore-Post-Install/universal/drm.html)
  
* OS Support
  * Mainly relevant for older hardware, as macOS may still have support for the CPU however no longer supports SMBIOS from that era
    * Arrandale CPUs are a great example, as they still have OS support even in macOS 11, Big Sur(however no iGPU support past 10.13.6)
* USB Devices
  * Certain SMBIOS will have their own USB map which may attach to your hardware causing USB issues.
    * See here for more info: [USB Mapping](https://dortania.github.io/OpenCore-Post-Install/usb/)
  * Also to note, Skylake+ SMBIOS will also require a [USBX device](https://github.com/acidanthera/OpenCorePkg/tree/master/Docs/AcpiSamples/Source/SSDT-EC-USBX.dsl#L54L79) to fix USB current output
    * See here for more info: [Fixing USB Power](https://dortania.github.io/OpenCore-Post-Install/usb/misc/power.html)

::: details XCPM Supported SMBIOS

| SMBIOS |
| :--- |
| MacBook8,1+ |
| MacBookAir6,x+ |
| MacBookPro11,x+ |
| Macmini7,1+ |
| iMac14,x+ |
| iMacPro1,1 |
| MacPro6,1+ |

:::

## How to decide

Generally our recommendations with SMBIOS is as follows:

1. Find the right CPU Generation and tier as closely as possible
2. Then match up with either iGPU only or dGPU SMBIOS
3. Finally decide on misc things(like exact GPU and CPU)

And there's also some special notes with SMBIOS:

* iMacPro1,1 and MacPro7,1 are the only 2 SMBIOS that will allow for dGPU to handle all the workload including background rendering and other tasks that the iGPU would handle
  * We only recommend this SMBIOS if you require this, however you'll likely need to fix power management as sleep may break if your hardware isn't of this class(ie. HEDT/Server/AMD): [Fixing Power management](https://dortania.github.io/OpenCore-Post-Install/universal/pm.html)
  * Note that this requires a Polaris, Vega or Navi GPU to work properly.
* iMac20,2 is a custom SMBIOS meant only for Apple's custom i9-10910 CPU, so unless you have an i9-10900K we recommend using iMac20,1
* MacMini SMBIOS should be avoided unless you're running mobile hardware without a built-in display
  * Intel NUC are the ideal hardware for this SMBIOS
* iGPU-less CPUs **MUST** pay very close attention when selecting a SMBIOS, as Apple always assumes the iGPU is present on the iMac SMBIOS, so you will need to find a SMBIOS without this requirement like iMac Pro or Mac Pro.
  * This also applies to AMD CPUs

## macOS SMBIOS list

This is a full list of all of the SMBIOS Apple has ever supported in macOS with extra information like CPU and GPU types.

* [MacBook](#macbook)
* [MacBook Air](#macbook-air)
* [MacBook Pro](#macbook-pro)
* [Mac Mini](#mac-mini)
* [iMac](#imac)
* [iMac Pro](#imac-pro)
* [Mac Pro](#mac-pro)
* [Xserve](#xserve)
* [Miscellaneous SMBIOS](#miscellaneous-smbios)

Info pulled from both [EveryMac](https://everymac.com) and [OpenCorePkg](https://github.com/acidanthera/OpenCorePkg)

**Special Note**:

* The letter beside each CPU Family is the tier of CPU, see below table for more info:

| Letter | Type |
| :--- | :--- |
| Y | Mobile(Low end) |
| U, M | Mobile(Mid tier) |
| H, QM, HQ | Mobile(High End) |
| S | Desktop |
| EP, SP, W, X | HEDT/Server |

### MacBook

| SMBIOS | CPU Family | GPU | board-id | Initial Support | Last Supported Version |
| :--- | :--- | :--- | :--- | :--- | :--- |
| MacBook1,1     | Yonah(M)        | GMA 950                       | Mac-F4208CC8       | 10.4.6 (8I2025) | 10.6.8 |
| MacBook2,1     | Merom(M)        | GMA 950                       | Mac-F4208CA9   | 10.4.8 (8N1108) | 10.7.5 |
| MacBook3,1     | Merom(M)        | GMA X3100                     | Mac-F22788C8   | 10.5 (9A3111) | ^^ |
| MacBook4,1     | Penryn(M)       | GMA X3100                     | Mac-F22788A9   | 10.5.2 (9C2015) | ^^ |
| MacBook5,1     | Penryn(M)       | GeForce 9400M                 | Mac-F42D89C8   | 10.5.5 (9F2114) | 10.11.6 |
| MacBook5,2     | Penryn(M)       | GeForce 9400M                 | Mac-F22788AA   | 10.5.6 (9G2110) | ^^ |
| MacBook6,1     | Penryn(M)       | GeForce 9400M                 | Mac-F22C8AC8   | 10.6.1 (10A2047) | 10.13.6 |
| MacBook7,1     | Penryn(M)       | GeForce 320M                  | Mac-F22C89C8   | 10.6.3 (10D2162) | ^^ |
| MacBook8,1     | Broadwell(Y)    | HD 5300                       | Mac-BE0E8AC46FE800CC | 10.10.2 (14C2061) | Current |
| MacBook9,1     | Skylake(Y)      | HD 515                        | Mac-9AE82516C7C6B903 | 10.11.4 (15E2066) | ^^ |
| MacBook10,1    | Kaby Lake(Y)    | HD 615                        | Mac-EE2EBD4B90B839A8 | 10.12.5 (16F207) | ^^ |

### MacBook Air

| SMBIOS | CPU Family | GPU | board-id | Initial Support | Last Supported Version |
| :--- | :--- | :--- | :--- | :--- | :--- |
| MacBookAir1,1  | Merom(M)        | GMA X3100     (11")                | Mac-F42C8CC8 | 10.5.1 (9B2324) | 10.7.5 |
| MacBookAir2,1  | Penryn(M)       | GeForce 9400M (13")                | Mac-F42D88C8 | 10.5.5 | 10.11.6 |
| MacBookAir3,1  | Penryn(M)       | GeForce 320M  (11")                | Mac-942452F5819B1C1B | 10.6.4 (10F3061) | 10.13.6 |
| MacBookAir3,2  | Penryn(M)       | GeForce 320M  (13")                | Mac-942C5DF58193131B | 10.6.4 (10F3061) | ^^ |
| MacBookAir4,1  | Sandy Bridge(M) | HD 3000 (11")                      | Mac-C08A6BB70A942AC2 | 10.7 (11A2063) | ^^ |
| MacBookAir4,2  | Sandy Bridge(M) | HD 3000 (13")                      | Mac-742912EFDBEE19B3 | 10.7 (11A2063) | ^^ |
| MacBookAir5,1  | Ivy Bridge(U)   | HD 4000 (11")                      | Mac-66F35F19FE2A0D05 | 10.7.4 (11E2520) | 10.15.7 |
| MacBookAir5,2  | Ivy Bridge(U)   | HD 4000 (13")                      | Mac-2E6FAB96566FE58C | 10.8.2 (12C2034) | ^^ |
| MacBookAir6,1  | Haswell(U)      | HD 5000 (11")                      | Mac-35C1E88140C3E6CF | 10.8.4 (12E3067) | Current |
| MacBookAir6,2  | Haswell(U)      | HD 5000 (13")                      | Mac-7DF21CB3ED6977E5 | 10.8.4 (12E3067) | ^^ |
| MacBookAir7,1  | Broadwell(U)    | HD 6000 (11")                      | Mac-9F18E312C5C2BF0B | 10.10.2 (14C2507) | ^^ |
| MacBookAir7,2  | Broadwell(U)    | HD 6000 (13")                      | Mac-937CB26E2E02BB01 | 10.10.2 (14C2507) | ^^ |
| MacBookAir8,1  | Amber Lake(Y)   | UHD 617 (13")                      | Mac-827FAC58A8FDFA22 | 10.14.1 (18B2084) | ^^ |
| MacBookAir8,1  | Amber Lake(Y)   | UHD 617 (13")                      | Mac-226CB3C6A851A671 | 10.14.5 (18F2058) | ^^ |
| MacBookAir9,1  | Ice Lake(Y)     | Iris Plus G4/G7 (13")              | Mac-0CFF9C7C2B63DF8D | 10.15.4 (19E287) | ^^ |

### MacBook Pro

| SMBIOS | CPU Family | GPU | board-id | Initial Support | Last Supported Version |
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
| MacBookPro11,1 | Haswell(U)      | Iris 5100 (13")                    | Mac-189A3D4F975D5FFC | 10.9 (13A2093) | Current |
| MacBookPro11,2 | Haswell(HQ)     | Iris Pro 5200 (15")                | Mac-3CBD00234E554E41 | 10.9 (13A3017) | ^^ |
| MacBookPro11,3 | Haswell(HQ)     | Iris Pro 5200/GeForce GT 750M (15")| Mac-2BD1B31983FE1663 | 10.9 (13A3017) | ^^ |
| MacBookPro11,4 | Haswell(HQ)     | Iris Pro 5200 (15")                | Mac-06F11FD93F0323C5 | 10.10.3 (14D2134) | ^^ |
| MacBookPro11,5 | Haswell(HQ)     | Iris Pro 5200/Radeon R9 M370X (15")| Mac-06F11F11946D27C5 | 10.10.3 (14D2134) | ^^ |
| MacBookPro12,1 | Broadwell(U)    | Iris 6100 (13")                    | Mac-E43C1C25D4880AD6 | 10.10.2 (14C2507) | ^^ |
| MacBookPro13,1 | Skylake(U)      | Iris 540 (13")                     | Mac-473D31EABEB93F9B | 10.12 (16A2323a) | ^^ |
| MacBookPro13,2 | Skylake(U)      | Iris 550 (13")                     | Mac-66E35819EE2D0D05 | 10.12.1 (16B2657) | ^^ |
| MacBookPro13,3 | Skylake(H)      | HD 530/Radeon Pro 450 (15")        | Mac-A5C67F76ED83108C | 10.12.1 (16B2659) | ^^ |
| MacBookPro14,1 | Kaby Lake(U)    | Iris Plus 640 (13")                | Mac-B4831CEBD52A0C4C | 10.12.5 (16F2073) | ^^ |
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

| SMBIOS | CPU Family | GPU | board-id | Initial Support | Last Supported Version |
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
| Macmini7,1     | Haswell(U)      | HD 5000 or Iris 5100          | Mac-35C5E08120C7EEAF   | 10.10 (14A389) | Current |
| Macmini8,1     | Coffee Lake(H)  | UHD 630                       | Mac-7BA5B2DFE22DDD8C   | 10.14 (18A2063) | ^^ |

### iMac

| SMBIOS | CPU Family | GPU | board-id | Initial Support | Last Supported Version |
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
| iMac14,4       | Haswell(U)      | HD 5000                       | Mac-81E3E92DD6088272 | 10.9.3 (13D2061)      | Current |
| iMac15,1       | Haswell(S)      | Radeon R9 M290X               | Mac-42FD25EABCABB274 | 10.10 (14A389)      | ^^ |
| iMac16,1       | Broadwell(U)    | HD 6000 or Iris Pro 6200      | Mac-A369DDC4E67F1C45 | 10.11 (15A2301)      | ^^ |
| iMac16,2       | Broadwell(S)    | Iris Pro 6200                 | Mac-FFE5EF870D7BA81A | 10.11 (15A2301)      | ^^ |
| iMac17,1       | Skylake(S)      | Radeon R9 M380                | Mac-DB15BD556843C820, Mac-65CE76090165799A, Mac_B809C3757DA9BB8D | 10.11 (15A4310)      | ^^ |
| iMac18,1       | Kaby Lake(U)    | Iris Plus 640                 | Mac-4B682C642B45593E | 10.12.4 (16E2193)      | ^^ |
| iMac18,2       | Kaby Lake(S)    | Radeon Pro 555                | Mac-77F17D7DA9285301 | 10.12.4 (16F2073)      | ^^ |
| iMac18,3       | ^^              | Radeon Pro 570                | Mac-BE088AF8C5EB4FA2 | 10.12.4 (16F2073)      | ^^ |
| iMac19,1       | Coffee Lake(S)  | Radeon Pro 570X               | Mac-AA95B1DDAB278B95 | 10.14.4 (18E226)      | ^^ |
| iMac19,2       | ^^              | Radeon Pro 555X               | Mac-63001698E7A34814 | 10.14.4 (18E226)      | ^^ |
| iMac20,1       | Comet Lake(S)   | Radeon Pro 5300               | Mac-CFF7D910A743CAAF | 10.15.6 (19G2005)      | ^^ |
| iMac20,2       | ^^   | ^^                                       | Mac-AF89B6D9451A490B | 10.15.6 (19G2005)      | ^^ |

### iMac Pro

| SMBIOS | CPU Family | GPU | board-id | Initial Support | Last Supported Version |
| :--- | :--- | :--- | :--- | :--- | :--- |
| iMacPro1,1     | Skylake-W    | Vega 56                       | Mac-7BA5B2D9E42DDD94       | 10.13.2 (17C2111) | Current |

### Mac Pro

| SMBIOS | CPU Family | GPU | board-id | Initial Support | Last Supported Version |
| :--- | :--- | :--- | :--- | :--- | :--- |
| MacPro1,1      | Woodcrest     | GeForce 7300 GT               | Mac-F4208DC8           | 10.4.7 (8K1079) | 10.7.5 |
| MacPro2,1      | Clovertown    | ^^                            | Mac-F4208DA9           | 10.4.9 (8P4037) | ^^ |
| MacPro3,1      | Harpertown    | Radeon HD 2600 XT             | Mac-F42C88C8           | 10.5.1 (9B2117) | 10.11.6 |
| MacPro4,1      | Nehalem       | GeForce GT 120                | Mac-F221BEC8           | 10.5.6 (9G3553) | ^^ |
| MacPro5,1      | Nehalem       | Radeon HD 5770                | Mac-F221BEC8           | 10.6.4 (10F2521) | 10.14.6 |
| MacPro5,1      | Westmere EP   | ^^                            | Mac-F221BEC8           | 10.6.4 (10F2521) | ^^ |
| MacPro6,1      | Ivy Bridge EP | FirePro D300                  | Mac-F60DEB81FF30ACF6   | 10.9.1 (13B4116) | Current |
| MacPro7,1      | Cascade Lake-W| Radeon Pro 580X               | Mac-27AD2F918AE68F61   | 10.15.0 (19A583) | ^^ |

### Xserve

| SMBIOS | CPU Family | GPU | board-id | Initial Support | Last Supported Version |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Xserve1,1      | Woodcrest    | Radeon X1300                  | Mac-F4208AC8           | Server 10.4.8 (8N1215) | Server 10.7.5 |
| Xserve2,1      | Harpertown   | ^^                            | Mac-F42289C8           | Server 10.5 (9B2117) | ^^ |
| Xserve3,1      | Nehalem EP   | GeForce GT 120                | Mac-F223BEC8           | Server 10.5.6 | 10.11.6 |

### Miscellaneous SMBIOS

All models listed below are not supported by OpenCore however are documented here for ease of reference.

* Apple Development Platforms
  * [Developer Transition Kit](#developer-transition-kit)
* Apple Silicon
  * [Mac Mini](#mac-mini-apple-silicon)
  * [MacBook Air](#macbook-air-apple-silicon)
  * [MacBook Pro](#macbook-pro-apple-silicon)
* PowerPC
  * [PowerBook](#powerbook-powerpc)
  * [iBook](#ibook-powerpc)
  * [PowerMac](#powermac-powerpc)
  * [iMac](#imac-powerpc)
  * [eMac](#emac-powerpc)
  * [Cube](#cube-powerpc)
  * [Mac Mini](#mac-mini-powerpc)
  * [Xserve](#xserve-powerpc)
  
::: details Apple Silicon Notes

Extra information regarding Apple's CPUs:

* They do not rely on ACPI or UEFI
* They do not include DeviceProperties in their firmware
* They use iPad8,6 for iOS/iPadOS applications
* board-id is only applicable with Intel Macs, PowerPC and ARM do not have this entry

:::

#### Developer Transition Kit

| SMBIOS | Year | CPU Family | Secure Enclave Identifier | Initial Support |
| :--- | :--- | :--- | :--- | :--- |
| ADP2,1 | Mid 2005 | Intel Prescott | N/A | 10.4.1 (8B1025) |
| ADP3,2 | Mid 2020 | Apple A12Z | J273 | 11.0.0 (20A5299w) |

#### Mac Mini - Apple Silicon

| SMBIOS | Year | CPU Family | Secure Enclave Identifier | Initial Support |
| :--- | :--- | :--- | :--- | :--- |
| MacMini9,1 | Late 2020 |  Apple M1 | J274 | 11.0.0 (20A2411) |

#### MacBook Air - Apple Silicon

| SMBIOS | Year | CPU Family | Secure Enclave Identifier | Initial Support |
| :--- | :--- | :--- | :--- | :--- |
| MacBookAir10,1 | Late 2020 |  Apple M1 | J313 | 11.0.0 (20A2411) |

#### MacBook Pro - Apple Silicon

| SMBIOS | Year | CPU Family | Secure Enclave Identifier | Initial Support |
| :--- | :--- | :--- | :--- | :--- |
| MacBookPro17,1 | Late 2020 | Apple M1 | J293 | 11.0.0 (20A2411) |

::: details Power PC SMBIOS Table

#### PowerBook - PowerPC

| SMBIOS | Year | CPU Family | Initial Support | Last Supported Version |
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

| SMBIOS | Year | CPU Family | Initial Support | Last Supported Version |
| :--- | :--- | :--- | :--- | :--- |
| PowerBook2,1 | Mid-1999 | PowerPC 750 (G3) | 8.6 | 10.3.9 |
| PowerBook2,2 | Late 20000 | PowerPC 750cx (G3) | 9.0.4 | 10.4.11 |
| PowerBook4,1 | Late 2002 | PowerPC 7455 (G4) | 9.2.2 | 10.5.8 |
| PowerBook4,2 | Early 2002 | PowerPC 750cx (G3) | 9.2.1 | 10.4.11 |
| PowerBook4,3 | Mid-2002 | PowerPC 750fx (G3) | 9.2.2 | ^^ |
| PowerBook6,3 | Late 2003 | PowerPC 7457 (G4) | 10.3 (7B85) | ^^ |
| PowerBook6,5 | Mid-2004 | PowerPC 7447a (G4) | 10.3.3 (7G51) | 10.5.8 |
| PowerBook6,7 | Mid-2005 | ^^ | 10.4.2 (8D37) | ^^ |

#### PowerMac - PowerPC

| SMBIOS | Year | CPU Family | Initial Support | Last Supported Version |
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

| SMBIOS | Year | CPU Family | Initial Support | Last Supported Version |
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

| SMBIOS | Year | CPU Family | Initial Support | Last Supported Version |
| :--- | :--- | :--- | :--- | :--- |
| PowerMac4,4 | Mid-2003 | PowerPC 7445 (G4 | 9.2.2 | 10.5.8 |
| PowerMac6,4 | Early 2004 | PowerPC 7447a (G4) | 10.3.3 | ^^ |

#### Cube - PowerPC

| SMBIOS | Year | CPU Family | Initial Support | Last Supported Version |
| :--- | :--- | :--- | :--- | :--- |
| PowerMac5,1 | Mid-2000 | PowerPC 7400 (G4) | 9.0.4 | 10.4.11 |
| PowerMac5,2 | ^^ | ^^ | ^^ | ^^ |

#### Mac Mini - PowerPC

| SMBIOS | Year | CPU Family | Initial Support | Last Supported Version |
| :--- | :--- | :--- | :--- | :--- |
| PowerMac10,1 | Early 2005 | PowerPC 7447a (G4) | 10.3.7 (7T11) | 10.5.8 |
| PowerMac10,2 | Late 2005 | ^^ | 10.4.2 (8D40) | ^^ |

#### Xserve - PowerPC

| SMBIOS | Year | CPU Family | Initial Support | Last Supported Version |
| :--- | :--- | :--- | :--- | :--- |
| RackMac1,1 | Mid-2002 | PowerPC 7455 (G4) | 10.1.5 (6C115) | Server 10.5.8 |
| RackMac1,2 | Early 2003 | ^^ | 10.2.4 (6I34) | ^^ |
| RackMac3,1 | Early 2004 | PowerPC 970fx (G5) | 10.3.0 | ^^ |

:::
