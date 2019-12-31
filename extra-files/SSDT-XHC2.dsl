  /*
 * Intel ACPI Component Architecture
 * AML/ASL+ Disassembler version 20190509 (64-bit version)
 * Copyright (c) 2000 - 2019 Intel Corporation
 * 
 * Disassembling to symbolic ASL+ operators
 *
 * Disassembly of iASLf9D8FJ.aml, Tue Dec 31 12:16:52 2019
 *
 * Original Table Header:
 *     Signature        "SSDT"
 *     Length           0x000000A4 (164)
 *     Revision         0x02
 *     Checksum         0x2B
 *     OEM ID           "hack"
 *     OEM Table ID     "_XHC2"
 *     OEM Revision     0x00000000 (0)
 *     Compiler ID      "INTL"
 *     Compiler Version 0x20190509 (538510601)
 */
DefinitionBlock ("", "SSDT", 2, "hack", "_XHCX", 0x00000000)
{
    External (_SB_.PCI0.GP13, DeviceObj) // Partial path to controller
    External (_SB_.PCI0.GP13.XHC0, DeviceObj) // Full path to controller
    External (DTGP, MethodObj)    // 5 Arguments

    Scope (\_SB.PCI0.GP13) // Full path to controller
    {
        Scope (XHC0) //Replace with the controller you want to rename
        {
            Name (_STA, Zero)  // _STA: Status
        }

        Device (XHC2)
        {
            Name (_ADR, Zero)  // _ADR: Address
            Method (_DSM, 4, NotSerialized)  // _DSM: Device-Specific Method
            {
                If ((Arg2 == Zero))
                {
                    Return (Buffer (One)
                    {
                         0x03                                             // .
                    })
                }

                Local0 = Package (0x1B){}
                DTGP (Arg0, Arg1, Arg2, Arg3, RefOf (Local0))
                Return (Local0)
            }
        }
    }
}

