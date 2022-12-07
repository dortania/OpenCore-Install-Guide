# ACPI

ACPI (Advanced Configuration and Power Interface) is an open standard to discover and configure computer hardware. The [ACPI specification](https://uefi.org/specifications) defines standard tables (e.g. `DSDT`, `SSDT`, `FACS`, `DMAR`) and various methods (e.g. `_DSM`, `_PRW`) for implementation. Modern hardware needs few changes to maintain `ACPI` compatibility and some options for such changes are provided as part of OpenCore.

To compile and disassemble ACPI tables, the [iASL compiler](https://github.com/acpica/acpica) developed by [ACPICA](https://www.acpica.org) can be used. A GUI front-end to iASL compiler can be downloaded from [Acidanthera/MaciASL](https://github.com/acidanthera/MaciASL/releases).

ACPI changes apply globally (to every operating system) with the following effective order:

* `Delete` is processed
* `Quirks` are processed
* `Patch` is processed
* `Add` is processed

Applying the changes globally resolves the problems of incorrect operating system detection (consistent with the ACPI specification, not possible before the operating system boots), operating system chainloading, and difficult ACPI debugging. Hence, more attention may be required when writing changes to `_OSI`.

Applying the patches early makes it possible to write so called “proxy” patches, where the original method is patched in the original table and is implemented in the patched table.

# Add

::: tip Info

This is where you'll add SSDTs for your system, these are very important to **booting macOS** and have many uses like [USB maps](https://dortania.github.io/OpenCore-Post-Install/usb/), [disabling unsupported GPUs](../extras/spoof.md) and such. And with our system, **it's even required to boot**. Guide on making them found here: [**Getting started with ACPI**](https://dortania.github.io/Getting-Started-With-ACPI/)

For us we'll need a couple of SSDTs to bring back functionality that Clover provided.

Note that you **should not** add your generated `DSDT.aml` here, it is already in your firmware. So if present, remove the entry for it in your `config.plist` and under `EFI/OC/ACPI`.

For those wanting a deeper dive into dumping your DSDT, how to make these SSDTs, and compiling them, please see the [**Getting started with ACPI**](https://dortania.github.io/Getting-Started-With-ACPI/) **page.** Compiled SSDTs have a **.aml** extension(Assembled) and will go into the `EFI/OC/ACPI` folder and **must** be specified in your config under `ACPI -> Add` as well.

:::

## Desktop
### Intel Desktop
#### Penryn

| Required SSDTs | Description |
| :--- | :--- |
| **[SSDT-EC](https://dortania.github.io/Getting-Started-With-ACPI/)** | Fixes the embedded controller, see [Getting Started With ACPI Guide](https://dortania.github.io/Getting-Started-With-ACPI/) for more details. |

#### Clarkdale

| Required SSDTs | Description |
| :--- | :--- |
| **[SSDT-EC](https://dortania.github.io/Getting-Started-With-ACPI/)** | Fixes the embedded controller, see [Getting Started With ACPI Guide](https://dortania.github.io/Getting-Started-With-ACPI/) for more details. |

#### Sandy Bridge

| Required SSDTs | Description |
| :--- | :--- |
| **[SSDT-PM](https://github.com/Piker-Alpha/ssdtPRGen.sh)** | Needed for proper CPU power management, you will need to run Pike's ssdtPRGen.sh script to generate this file. This will be run in [post install](https://dortania.github.io/OpenCore-Post-Install/). |
| **[SSDT-EC](https://dortania.github.io/Getting-Started-With-ACPI/)** | Fixes the embedded controller, see [Getting Started With ACPI Guide](https://dortania.github.io/Getting-Started-With-ACPI/) for more details. |
| **[SSDT-IMEI](https://dortania.github.io/Getting-Started-With-ACPI/)** | Needed to add a missing IMEI device on Sandy Bridge CPU with 7 series motherboards |

#### Ivy Bridge

| Required SSDTs | Description |
| :--- | :--- |
| **[SSDT-PM](https://github.com/Piker-Alpha/ssdtPRGen.sh)** | Needed for proper CPU power management, you will need to run Pike's ssdtPRGen.sh script to generate this file. This will be run in [post install](https://dortania.github.io/OpenCore-Post-Install/). |
| **[SSDT-EC](https://dortania.github.io/Getting-Started-With-ACPI/)** | Fixes the embedded controller, see [Getting Started With ACPI Guide](https://dortania.github.io/Getting-Started-With-ACPI/) for more details. |
| **[SSDT-IMEI](https://dortania.github.io/Getting-Started-With-ACPI/)** | Needed to add a missing IMEI device on Ivy Bridge CPU with 6 series motherboards |

#### Haswell

| Required SSDTs | Description |
| :--- | :--- |
| **[SSDT-PLUG](https://dortania.github.io/Getting-Started-With-ACPI/)** | Allows for native CPU power management on Haswell and newer, see [Getting Started With ACPI Guide](https://dortania.github.io/Getting-Started-With-ACPI/) for more details. |
| **[SSDT-EC](https://dortania.github.io/Getting-Started-With-ACPI/)** | Fixes the embedded controller, see [Getting Started With ACPI Guide](https://dortania.github.io/Getting-Started-With-ACPI/) for more details. |

#### Skylake

| Required SSDTs | Description |
| :--- | :--- |
| **[SSDT-PLUG](https://dortania.github.io/Getting-Started-With-ACPI/)** | Allows for native CPU power management on Haswell and newer, see [Getting Started With ACPI Guide](https://dortania.github.io/Getting-Started-With-ACPI/) for more details. |
| **[SSDT-EC-USBX](https://dortania.github.io/Getting-Started-With-ACPI/)** | Fixes both the embedded controller and USB power, see [Getting Started With ACPI Guide](https://dortania.github.io/Getting-Started-With-ACPI/) for more details. |

#### Kaby Lake

| Required SSDTs | Description |
| :--- | :--- |
| **[SSDT-PLUG](https://dortania.github.io/Getting-Started-With-ACPI/)** | Allows for native CPU power management on Haswell and newer, see [Getting Started With ACPI Guide](https://dortania.github.io/Getting-Started-With-ACPI/) for more details. |
| **[SSDT-EC-USBX](https://dortania.github.io/Getting-Started-With-ACPI/)** | Fixes both the embedded controller and USB power, see [Getting Started With ACPI Guide](https://dortania.github.io/Getting-Started-With-ACPI/) for more details. |

#### Coffee Lake

| Required SSDTs | Description |
| :--- | :--- |
| **[SSDT-PLUG](https://dortania.github.io/Getting-Started-With-ACPI/)** | Allows for native CPU power management on Haswell and newer, see [Getting Started With ACPI Guide](https://dortania.github.io/Getting-Started-With-ACPI/) for more details. |
| **[SSDT-EC-USBX](https://dortania.github.io/Getting-Started-With-ACPI/)** | Fixes both the embedded controller and USB power, see [Getting Started With ACPI Guide](https://dortania.github.io/Getting-Started-With-ACPI/) for more details. |
| **[SSDT-AWAC](https://dortania.github.io/Getting-Started-With-ACPI/)** | This is the [300 series RTC patch](https://www.hackintosh-forum.de/forum/thread/39846-asrock-z390-taichi-ultimate/?pageNo=2), required for most B360, B365, H310, H370, Z390 and some Z370 boards which prevent systems from booting macOS. The alternative is [SSDT-RTC0](https://dortania.github.io/Getting-Started-With-ACPI/) for when AWAC SSDT is incompatible due to missing the Legacy RTC clock, to check whether you need it and which to use please see [Getting started with ACPI](https://dortania.github.io/Getting-Started-With-ACPI/) page. |
| **[SSDT-PMC](https://dortania.github.io/Getting-Started-With-ACPI/)** | So true 300 series motherboards(non-Z370) don't declare the FW chip as MMIO in ACPI and so XNU ignores the MMIO region declared by the UEFI memory map. This SSDT brings back NVRAM support. See [Getting Started With ACPI Guide](https://dortania.github.io/Getting-Started-With-ACPI/) for more details. |

#### Comet Lake

| Required SSDTs | Description |
| :--- | :--- |
| **[SSDT-PLUG](https://dortania.github.io/Getting-Started-With-ACPI/)** | Allows for native CPU power management on Haswell and newer, see [Getting Started With ACPI Guide](https://dortania.github.io/Getting-Started-With-ACPI/) for more details. |
| **[SSDT-EC-USBX](https://dortania.github.io/Getting-Started-With-ACPI/)** | Fixes both the embedded controller and USB power, see [Getting Started With ACPI Guide](https://dortania.github.io/Getting-Started-With-ACPI/) for more details. |
| **[SSDT-AWAC](https://dortania.github.io/Getting-Started-With-ACPI/)** | This is the [300 series RTC patch](https://www.hackintosh-forum.de/forum/thread/39846-asrock-z390-taichi-ultimate/?pageNo=2), required for all B460 and Z490 boards which prevent systems from booting macOS. The alternative is [SSDT-RTC0](https://dortania.github.io/Getting-Started-With-ACPI/) for when AWAC SSDT is incompatible due to missing the Legacy RTC clock, to check whether you need it and which to use please see [Getting started with ACPI](https://dortania.github.io/Getting-Started-With-ACPI/) page. |
| **[SSDT-RHUB](https://dortania.github.io/Getting-Started-With-ACPI/)** | Needed to fix Root-device errors on Asus and potentially MSI boards. Gigabyte and AsRock motherboards **do not** need this SSDT |

### Intel HEDT

#### Nehalem and Westmere

| Required SSDTs | Description |
| :--- | :--- |
| **[SSDT-EC](https://dortania.github.io/Getting-Started-With-ACPI/)** | Fixes the embedded controller, see [Getting Started With ACPI Guide](https://dortania.github.io/Getting-Started-With-ACPI/) for more details. |

#### Sandy and Ivy Bridge-E

| Required SSDTs | Description |
| :--- | :--- |
| **[SSDT-EC](https://dortania.github.io/Getting-Started-With-ACPI/)** | Fixes the embedded controller, see [Getting Started With ACPI Guide](https://dortania.github.io/Getting-Started-With-ACPI/) for more details. |
| **[SSDT-UNC](https://dortania.github.io/Getting-Started-With-ACPI/)** | Required for all Big Sur users to ensure their UNC devices are compatible, see [Getting Started With ACPI Guide](https://dortania.github.io/Getting-Started-With-ACPI/) for more details. |

#### Haswell-E

| Required SSDTs | Description |
| :--- | :--- |
| **[SSDT-PLUG](https://dortania.github.io/Getting-Started-With-ACPI/)** | Allows for native CPU power management on Haswell and newer, see [Getting Started With ACPI Guide](https://dortania.github.io/Getting-Started-With-ACPI/) for more details. |
| **[SSDT-EC-USBX](https://dortania.github.io/Getting-Started-With-ACPI/)** | Fixes both the embedded controller and USB power, see [Getting Started With ACPI Guide](https://dortania.github.io/Getting-Started-With-ACPI/) for more details. |
| **[SSDT-RTC0-RANGE](https://dortania.github.io/Getting-Started-With-ACPI/)** | Required for all Big Sur users to ensure their RTC device is compatible, see [Getting Started With ACPI Guide](https://dortania.github.io/Getting-Started-With-ACPI/) for more details. |
| **[SSDT-UNC](https://dortania.github.io/Getting-Started-With-ACPI/)** | Required for all Big Sur users to ensure their UNC devices are compatible, see [Getting Started With ACPI Guide](https://dortania.github.io/Getting-Started-With-ACPI/) for more details. |

#### Broadwell-E

| Required SSDTs | Description |
| :--- | :--- |
| **[SSDT-PLUG](https://dortania.github.io/Getting-Started-With-ACPI/)** | Allows for native CPU power management on Haswell and newer, see [Getting Started With ACPI Guide](https://dortania.github.io/Getting-Started-With-ACPI/) for more details. |
| **[SSDT-EC-USBX](https://dortania.github.io/Getting-Started-With-ACPI/)** | Fixes both the embedded controller and USB power, see [Getting Started With ACPI Guide](https://dortania.github.io/Getting-Started-With-ACPI/) for more details. |
| **[SSDT-RTC0-RANGE](https://dortania.github.io/Getting-Started-With-ACPI/)** | Required for all Big Sur users to ensure their RTC device is compatible, see [Getting Started With ACPI Guide](https://dortania.github.io/Getting-Started-With-ACPI/) for more details. |
| **[SSDT-UNC](https://dortania.github.io/Getting-Started-With-ACPI/)** | Required for all Big Sur users to ensure their UNC devices are compatible, see [Getting Started With ACPI Guide](https://dortania.github.io/Getting-Started-With-ACPI/) for more details. |

#### Skylake-X/W and Cascade Lake-X/W

| Required SSDTs | Description |
| :--- | :--- |
| **[SSDT-PLUG](https://dortania.github.io/Getting-Started-With-ACPI/)** | Allows for native CPU power management on Haswell and newer, see [Getting Started With ACPI Guide](https://dortania.github.io/Getting-Started-With-ACPI/) for more details. |
| **[SSDT-EC-USBX](https://dortania.github.io/Getting-Started-With-ACPI/)** | Fixes both the embedded controller and USB power, see [Getting Started With ACPI Guide](https://dortania.github.io/Getting-Started-With-ACPI/) for more details. |
| **[SSDT-RTC0-RANGE](https://dortania.github.io/Getting-Started-With-ACPI/)** | Required for enabling the legacy RTC clock in macOS, this is also required for all Big Sur users to ensure their RTC device is compatible. See [Getting Started With ACPI Guide](https://dortania.github.io/Getting-Started-With-ACPI/) for more details. |
### AMD Desktop
#### AMD Bulldozer (15h) and Jaguar (16h)

| Required SSDTs | Description |
| :--- | :--- |
| **[SSDT-EC-USBX](https://dortania.github.io/Getting-Started-With-ACPI/)** | Fixes the embedded controller, see [Getting Started With ACPI Guide](https://dortania.github.io/Getting-Started-With-ACPI/) for more details. |

#### AMD Ryzen and Threadripper (17h and 19h)

| Required SSDTs | Description |
| :--- | :--- |
| **[SSDT-EC-USBX](https://dortania.github.io/Getting-Started-With-ACPI/)** | Fixes the embedded controller, see [Getting Started With ACPI Guide](https://dortania.github.io/Getting-Started-With-ACPI/) for more details. |
| **[SSDT-CPUR](https://github.com/naveenkrdy/Misc/blob/master/SSDTs/SSDT-CPUR.dsl)** | Fixes CPU definitions with B550 and A520 motherboards, **do not use** if you don't have an AMD B550 or A520 system. You can find a prebuilt here: [SSDT-CPUR.aml](https://github.com/dortania/Getting-Started-With-ACPI/blob/master/extra-files/compiled/SSDT-CPUR.aml) |
# Delete

This blocks certain ACPI tables from loading, for us we can ignore this.

# Patch

This section allows us to dynamically modify parts of the ACPI (DSDT, SSDT, etc.) via OpenCore. For us, our patches are handled by our SSDTs. This is a much cleaner solution as this will allow us to boot Windows and other OSes with OpenCore

# Quirks

Settings relating to ACPI, leave everything here as default as we have no use for these quirks.
