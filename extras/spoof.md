# 禁用 GPU

所以你需要隐藏你的不支持GPU吗?使用OpenCore，事情略有不同，特别是我们需要指定我们想要欺骗的确切设备。有三种方法可以做到这一点:

* 引导标志
  * 禁用除iGPU外的所有gpu
* DeviceProperties
  * 在每个插槽的基础上禁用GPU
* SSDT
  * 在每个插槽的基础上禁用GPU

**CSM必须在BIOS中关闭，才能使欺骗正常工作，特别是在基于AMD CPU的系统上。**

### 引导标志

到目前为止最简单的方法，你所需要做的就是添加以下引导参数:

`-wegnoegpu`

请注意，这将禁用除iGPU之外的所有gpu。

### DeviceProperties 方法

这里很简单，用[gfxutil](https://github.com/acidanthera/gfxutil/releases) 找到PCI路由，然后用你的spoof创建一个新的DeviceProperties部分:

```
path/to/gfxutil -f GFX0
```

输出结果类似:

```
DevicePath = PciRoot(0x0)/Pci(0x1,0x0)/Pci(0x0,0x0)/Pci(0x0,0x0)/Pci(0x0,0x0)
```

导航到`Root -> DeviceProperties -> Add`并使用以下属性添加您的PCI路由:

| Key | Type | Value |
| :--- | :--- | :--- |
| disable-gpu | Boolean | `True` |

![](../images/extras/spoof-md/config-gpu.png)

### SSDT 方法

有许多方法可以找到路径，但通常最简单的方法是进入windows下的设备管理器并找到PCI路径。

`\_SB.PCI0.PEG0.PEGP`的设备路径示例:

```

    DefinitionBlock ("", "SSDT", 2, "DRTNIA", "spoof", 0x00000000)
    {
       External (_SB_.PCI0.PEG0.PEGP, DeviceObj)

       Method (_SB.PCI0.PEG0.PEGP._DSM, 4, NotSerialized)
       {
          If ((!Arg2 || !(_OSI ("Darwin"))))
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
          })
       }
    }

```

可以在这里找到该SSDT的副本:[Spoof-SSDT.dsl](https://github.com/dortania/OpenCore-Install-Guide/blob/master/extra-files/Spoof-SSDT.dsl). 你需要[MaciASL](https://github.com/acidanthera/MaciASL/releases) 来编译。记住， `.aml` 是已编译的，而 `.dsl` 是源代码。您可以通过选择File -> Save As -> ACPI Machine Language，使用MaciASL进行编译。

来源:CorpNewt

## Windows GPU选择

根据你的设置，你可能会发现Windows渲染游戏或应用程序使用了不需要的GPU。

许多用户只有两个gpu。NVIDIA和Intel HD/UHD IGPU。由于NVIDIA不再在macOS上工作，为了方便，他们可能有显示器插入主板的HDMI/DP连接。因此，Windows将通过IGPU渲染所有的游戏和应用程序。您可以通过以下方式将特定的游戏或应用程序重路由到不同的GPU:设置>系统>显示>图形设置

![Credit to CorpNewt for image](../images/extras/spoof-md/corp-windows.png)

渲染后的游戏或应用程序将其缓冲区复制到IGPU。然后显示给你看。这也有一些缺点:

* GSync将不再工作。
* NVIDIA设置不能再打开。这需要显示器与GPU连接
* 降低帧速率。
* 增加输入延迟。
* 刷新率上限。

如果你的主板只有一个用于iGPU的HDMI连接器，规格2.1的最大刷新率是[120Hz](https://www.hdmi.org/spec21Sub/EightK60_FourK120). 这假设您的主板和显示器具有相同的规格。这意味着您的144Hz显示器仅看到硬件决定的最大120Hz。如果你的板上有IGPU的DP连接器，这个限制**不**适用。

如果您有两个以上的gpu (AMD、NVIDIA和Intel)，则此设置将受到限制。显示器连接到AMD GPU意味着Windows将只允许您选择AMD GPU或Intel IGPU。NVIDIA GPU将不显示。在Windows的未来版本中，将删除此[限制](https://pureinfotech.com/windows-10-21h1-new-features/#:~:text=Graphics%20settings).

作为建议，如果你使用两种操作系统，并且不希望有任何缺点，你最好的选择是HDMI或DP开关。
