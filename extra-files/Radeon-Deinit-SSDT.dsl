DefinitionBlock ("", "SSDT", 2, "Slav", "Radeon", 0x00001000)
{
    External (_SB_.PCI0.GFX0.PEGP, DeviceObj)    // (from opcode)

    Scope (\_SB.PCI0.GFX0.PEGP)
    {
      If (_OSI ("Darwin")){
            
        OperationRegion (PCIB, PCI_Config, Zero, 0x0100)
        Field (PCIB, AnyAcc, NoLock, Preserve)
        {
            Offset (0x10), 
            BAR0,   32, 
            BAR1,   32, 
            BAR2,   64, 
            BAR4,   32, 
            BAR5,   32
        }

        Method (_INI, 0, NotSerialized)  // _INI: Initialize
        {
            If (LEqual (BAR5, Zero))
            {
                Store (BAR2, Local0)
            }
            Else
            {
                Store (BAR5, Local0)
            }

            OperationRegion (GREG, SystemMemory, And (Local0, 0xFFFFFFFFFFFFFFF0), 0x8000)
            Field (GREG, AnyAcc, NoLock, Preserve)
            {
                Offset (0x6800), 
                GENA,   32, 
                GCTL,   32, 
                LTBC,   32, 
                Offset (0x6810), 
                PSBL,   32, 
                SSBL,   32, 
                PTCH,   32, 
                PSBH,   32, 
                SSBH,   32, 
                Offset (0x6848), 
                FCTL,   32, 
                Offset (0x6EF8), 
                MUMD,   32
            }

            Store (Zero, FCTL)
            Store (Zero, PSBH)
            Store (Zero, SSBH)
            Store (Zero, LTBC)
            Store (One, GENA)
            Store (Zero, MUMD)
        }
       }
    }
}