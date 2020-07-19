# Sandy and Ivy Bridge-E(HEDT and server)

**Overall**:

* Follow Haswell setup for most config options
  * [Haswell-E](../../config-HEDT/haswell-e.md)
* May need to use [DuetPkg](../../extras/legacy.md) as most Sandy and Ivy Bridge-E motherboards do not support UEFI
* Mavericks(10.9) through Big Sur(11) are officially supported

**ACPI**:

* Use SSDT-EC instead of SSDT-EC-USBX

**Kernel**:

* Ignore the `Emulate` section as the CPUs are properly supported

**SMBIOS**:

* MacPro6,1
