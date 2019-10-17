/*
 * Example of a rename via an SSDT which is only applied to macOS
 * Please note that you will need to add your own device properties
 * and methods as we're hiding the real H_EC device. 
 */


 If (_OSI ("Darwin"))
    {
        Scope (\_SB.PCI0.LPCB.H_EC)
        {
            Scope (H_EC)
            {
                Method (_STA, 0, NotSerialized)  // _STA: Status
                {
                    Return (Zero)
                }
            }

            Device (EC)
            {
                Name (_ADR, Zero)  // _ADR: Address
                Method (_STA, 0, NotSerialized)  // _STA: Status
                {
                    Return (0x0F)
                    /*
                     * Insert H_EC properties/methods
                     */
                }
            }
        }
    }
}