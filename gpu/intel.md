# Intel iGPUs

Intel iGPUs are configured through device properties that are created in the config.plist. These device properties are set based on the PCI address of the device, though this is easy to find because all Intel iGPUs are located at `PciRoot(0x0)/Pci(0x2,0x0)`. You will want to create a new dictionary entry under `Config.plist->Device Properties->Add` where the name is the PCI address of the iGPU `(PciROot(0x0)/Pci(0x2,0x0)`.

The main property that needs to be set is `AAPL,ig-platform-id`. Normally, most iGPUs are recognized automatically by macOS but you may need to come back to this page and set the device id or add other properties.

If you are just setting up the config.plist for the first time, just set `AAPL,ig-platform-id` and come back here if further configuration is needed.

This section is based on WhateverGreen's [Framebuffer Patching Guide](https://github.com/acidanthera/WhateverGreen/blob/master/Manual/FAQ.IntelHD.en.md). If you have trouble getting the Intel iGPU set up, you will want to check it out.

::: warning

VGA is not supported on Intel iGPUs HD5x00 and older.

:::

[[toc]]

## Sandy Bridge

## Ivy Bridge (HD 4000/2000)

| AAPL,ig-platform-id | Type | Comment |
| ------------------- | ---- | ------- |
| **`03006601`** | Laptop | To be used with **1366 by 768** displays and lower |
| **`04006601`** | Laptop | To be used with **1600 by 900** displays and higher. See note below for addition patches |
| **`09006601`** | Laptop | To be used with some devices that have `eDP` connected monitor (contrary to classical LVDS). Test with **03006601** and **04006601** first before trying this. |
| **`0B006601`** | NUC | To be used with Intel NUCs |
| **`0A006601`** | Desktop | |

::: details Additional Patches for Platform ID `04006601`

If you're using `04006601` as your ig-platform-id, you may need to add the following parameters to fix external outputs as otherwise you will only have one output. (Credit to Rehabman)

| Key | Type | Value | Explanation |
| :--- | :--- | :--- | :--- |
| `framebuffer-patch-enable` | Number | `1`                                                          | *enabling the semantic patches in principle* (from the WhateverGreen manual) |
| `framebuffer-memorycount`  | Number | `2`                                                          | Matching FBMemoryCount to the one on `03006601` (1 on `04` vs 2 on `03`) |
| `framebuffer-pipecount`    | Number | `2`                                                          | Matching PipeCount to the one on `03006601` (3 on `04` vs 2 on `03`) |
| `framebuffer-portcount`    | Number | `4`                                                          | Matching PortCount to the one on `03006601` (1 on `04` vs 4 on `03`) |
| `framebuffer-stolenmem`    | Data   | `00000004`                                                   | Matching STOLEN memory to 64MB (0x04000000 from hex to base 10 in Bytes) to the one on `03006601`<br />Check [here](https://www.tonymacx86.com/threads/guide-alternative-to-the-minstolensize-patch-with-32mb-dvmt-prealloc.221506/) for more information. |
| `framebuffer-con1-enable`  | Number | `1`                                                          | This will enable patching on *connector 1* of the driver. (Which is the second connector after con0, which is the eDP/LVDS one) |
| `framebuffer-con1-alldata` | Data   | `02050000 00040000 07040000 03040000 00040000 81000000 04060000 00040000 81000000` | When using `all data` with a connector, either you give all information of that connector (port-bused-type-flag) or that port and the ones following it, like in this case.<br />In this case, the ports in `04` are limited to `1`:<br />`05030000 02000000 30020000` (which corresponds to port 5, which is LVDS)<br />However on `03` there are 3 extra ports:<br />`05030000 02000000 30000000` (LVDS, con0, like `04`)<br/>`02050000 00040000 07040000` (DP, con1)<br/>`03040000 00040000 81000000` (DP, con2)<br/>`04060000 00040000 81000000` (DP, con3)<br />Since we changed the number of PortCount to `4` in a platform that has only 1, that means we need to define the 3 others (and we that starting with con1 to the end).<br /> |

:::

::: details Desktop 6 Series Motherboards

When using 6 series motherboards (ie. H61, B65, Q65, P67, H67, Q67, Z68), the Intel Management Engine needs to be spoofed to a 7 series device. Create a new dictionary under `Device Properties->Add` for the PCI device `PciRoot(0x0)/Pci(0x16,0x0)`, and add the below device id.

| Key | Type | Value |
| :--- | :--- | :--- |
| device-id | Data | `3A1E0000` |

**Note**: This is not needed if you have a 7 series motherboard(ie. B75, Q75, Z75, H77, Q77, Z77)

:::

## Haswell (HD 4x00)

## Broadwell (HD 5x00)

## Skylake (HD 5xx)

## Kabylake (HD 6xx)

## Coffeelake/Whiskeylake (UHD 6xx)