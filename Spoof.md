So ou need to hide your unsupported GPU? Well with OpenCore things are slightly different, specifcally that we need to specify to which exact device we want to spoof. There's 2 ways we can do this:
* Spoofing via DeviceProperties
* Spoofing via SSDT

# DevicePropeties Method

Here is quite simple, find the PCI route with [gfxutil](https://github.com/acidanthera/gfxutil/releases) and then create a new DeviceProperties section with your spoof:
```
/Users/(YourUsername)/Downloads/(gfxdownload folder)/gfxutil -f GFX0
```
And the output will result in something similar:

```
DevicePath = PciRoot(0x0)/Pci(0x1,0x0)/Pci(0x0,0x0)/Pci(0x0,0x0)/Pci(0x0,0x0)
```
With this, navigate towards `Root -> DeviceProperties -> Add` and add your PCI route with the following properties:

|Key|Type|Value|
|:-|:-|:-|
|name|data|23646973706C6179|
|IONAME|string|\#display|
|class-code|data|FFFFFFFF|

![](https://i.imgur.com/ctw6W4b.png)




# SSDT Method
There's many ways to find the path but generally the easiest way is to got into Device Manager under windows and find the PCI path.

Example of device path:

`\_SB.PCI0.PEG0.PEGP`



```
DefinitionBlock ("", "SSDT", 2, "hack", "spoof", 0)
{
    Method(_SB.PCI0.PEG0.PEGP._DSM, 4)
    {
        If (_OSI ("Darwin"))
        {
            If (!Arg2) { Return (Buffer() { 0x03 } ) }
            Return (Package()
                {
                    "name", Buffer() { "#display" },
                    "IOName", "#display",
                    "class-code", Buffer() { 0xFF, 0xFF, 0xFF, 0xFF },
                    "vendor-id", Buffer() { 0xFF, 0xFF, 0,  0 },
                    "device-id", Buffer() { 0xFF, 0xFF, 0, 0 },
            })
        }
    }
}
```

What this SSDT does special compared to Rehabman's SSDT is that this adds the `If (_OSI ("Darwin")){}` block so that this SSDT wouldn't be applied when booting other operating systems
