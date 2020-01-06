/*
 * Ryzen and ThreadRipper USB power fix
 * Specifically to specify the USB power properties
 * which when not defined can break certain devices 
 * like Mics, DACs, webcams, Bluetooth dongles, etc
 * 
 * The specific devices that nee these properties 
 * are PTXH, XHC0, AS43. Please verify thst your ACPI
 * path is correct for your devices
 */
DefinitionBlock ("", "SSDT", 2, "hack", "SsdtUsbx", 0x00001000)
{
    External (_SB_.PCI0.GPP2.PTXH, DeviceObj) // Full PTXH path
    External (_SB_.PCI0.GP13.XHC0, DeviceObj) // Full XHC0 path
    External (_SB_.PCI0.GP17.AS43, DeviceObj) // Full AS43 path 

    Scope (\_SB.PCI0.GPP2.PTXH) // Full PTXH path
    {
        Method (_DSM, 4, NotSerialized)
        {
            If (LNot (Arg2)) { Return (Buffer(One) { 0x03 } ) }
            Return (Package(0x0a)
            {
                "kUSBSleepPortCurrentLimit",
	            0x0834,
	            "kUSBSleepPowerSupply",
	            0x13EC,
	            "kUSBWakePortCurrentLimit",
	            0x0834,
	            "kUSBWakePowerSupply",
	            0x13EC,
	            "kUSBSHostControllerDisableUSB3LPM",
	            0x01

            })
        }
    }
    Scope (\_SB.PCI0.GP13.XHC0) // Full XHC0 path
    {
                Method (_DSM, 4, NotSerialized)
        {
            If (LNot (Arg2)) { Return (Buffer(One) { 0x03 } ) }
            Return (Package(0x0a)
            {
                "kUSBSleepPortCurrentLimit",
	            0x0834,
	            "kUSBSleepPowerSupply",
	            0x13EC,
	            "kUSBWakePortCurrentLimit",
	            0x0834,
	            "kUSBWakePowerSupply",
	            0x13EC,
	            "kUSBSHostControllerDisableUSB3LPM",
	            0x01

            })
        }
    } 
    Scope (\_SB.PCI0.GP17.AS43) // Full AS43 path
    {
                Method (_DSM, 4, NotSerialized)
        {
            If (LNot (Arg2)) { Return (Buffer(One) { 0x03 } ) }
            Return (Package(0x0a)
            {
                "kUSBSleepPortCurrentLimit",
	            0x0834,
	            "kUSBSleepPowerSupply",
	            0x13EC,
	            "kUSBWakePortCurrentLimit",
	            0x0834,
	            "kUSBWakePowerSupply",
	            0x13EC,
	            "kUSBSHostControllerDisableUSB3LPM",
	            0x01

            })
        }
    }
}