# GPU Spoof

So you need to hide your unsupported GPU? Well with OpenCore things are slightly different, specifcally that we need to specify to which exact device we want to spoof. There's 3 ways we can do this:

* Boot Flag
  * Disables all GPUs except the iGPU
* DeviceProperties
  * Disables GPU on per-slot basis
* SSDT
  * Disables GPU on per-slot basis

## Boot Flag

By far the simplest way, all you need to do is add the following bootflag:

`-wegnoegpu`

Do note that this will disable all GPUs excluding the iGPU

## DevicePropeties Method

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

![](https://i.imgur.com/IjrDgNz.png)

## SSDT Method

There's many ways to find the path but generally the easiest way is to got into Device Manager under windows and find the PCI path.

Example of device path:

`\_SB.PCI0.PEG0.PEGP`

```text
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

# Fixing Windows

So something that many users are annoyed about is the fact that you need to switch between GPU outputs. Well a neat little trick on Windows is that you can reroute your display options to a specific GPU:

![Credit to CorpNewt for image](https://i.imgur.com/TG3jGBC.png)
