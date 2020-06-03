# Disabling GPU

* Supported version: 0.5.9

Table of Contents:

* [Boot Flag](/extras/spoof.md#boot-flag)
* [DeviceProperties Method](/extras/spoof.md#deviceproperties-method)
* [SSDT Method](/extras/spoof.md#ssdt-method)
* [Fixing Windows](/extras/spoof.md#fixing-windows)

So you need to hide your unsupported GPU? Well with OpenCore things are slightly different, specifically that we need to specify to which exact device we want to spoof. There are 3 ways we can do this:

* Boot Flag
  * Disables all GPUs except the iGPU
* DeviceProperties
  * Disables GPU on a per-slot basis
* SSDT
  * Disables GPU on a per-slot basis

**CSM must be off in the BIOS for the spoofing to work correctly, especially on AMD CPU based systems**

### Boot Flag

By far the simplest way, all you need to do is add the following boot-arg:

`-wegnoegpu`

Do note that this will disable all GPUs excluding the iGPU

### DeviceProperties Method

Here is quite simple, find the PCI route with [gfxutil](https://github.com/acidanthera/gfxutil/releases) and then create a new DeviceProperties section with your spoof:

```text
path/to/gfxutil -f GFX0
```

And the output will result in something similar:

```text
DevicePath = PciRoot(0x0)/Pci(0x1,0x0)/Pci(0x0,0x0)/Pci(0x0,0x0)/Pci(0x0,0x0)
```

With this, navigate towards `Root -> DeviceProperties -> Add` and add your PCI route with the following properties:

| Key | Type | Value |
| :--- | :--- | :--- |
| name | data | 23646973706C6179 |
| IOName | string | \#display |
| class-code | data | FFFFFFFF |

![](/images/extras/spoof-md/config-gpu.png)

### SSDT Method

There are many ways to find the path but generally, the easiest way is to get into Device Manager under windows and find the PCI path.

Example of device path:

`\_SB.PCI0.PEG0.PEGP`

    DefinitionBlock ("", "SSDT", 2, "hack", "spoof", 0x00000000)
    {
       External (_SB_.PCI0.PEG0.PEGP, DeviceObj)    // (from opcode)
    
       Method (_SB.PCI0.PEG0.PEGP._DSM, 4, NotSerialized)  // _DSM: Device-Specific Method
       {
          If (LOr (LNot (Arg2), LEqual (_OSI ("Darwin"), Zero)))
          {
             Return (Buffer (One)
             {
                0x03                                           
             })
          }
    
          Return (Package (0x0A)
          {
             "name", 
             Buffer (0x09)
             {
                "#display"
             }, 
    
             "IOName", 
             "#display", 
             "class-code", 
             Buffer (0x04)
             {
                0xFF, 0xFF, 0xFF, 0xFF                         
             }, 

             "vendor-id", 
             Buffer (0x04)
             {
                0xFF, 0xFF, 0x00, 0x00                         
             }, 
    
             "device-id", 
             Buffer (0x04)
             {
                0xFF, 0xFF, 0x00, 0x00                         
             }
          })
       }
    }

A copy of this SSDT can be found here: [Spoof-SSDT.dsl](https://github.com/dortania/OpenCore-Desktop-Guide/blob/master/extra-files/Spoof-SSDT.dsl) You will need [MaciASL](https://github.com/acidanthera/MaciASL/releases) to compile this, reminder that .aml is assembled and .dsl is source code. You can compile with MaciASL by running File -> Save As -> ACPI Machine Language.

Source: CorpNewt

## Fixing Windows

So something that many users are annoyed about is the fact that you need to switch between GPU outputs. Well a neat little trick on Windows is that you can reroute your display options to a specific GPU:

![Credit to CorpNewt for image](/images/extras/spoof-md/corp-windows.png)
