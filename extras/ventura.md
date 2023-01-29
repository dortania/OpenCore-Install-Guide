# macOS 13: Ventura 系统事项

## 目录

[[toc]]

## 注意事项

### 去掉的CPU支持

macOS Ventura（macOS 13） 删除了对Haswell架构以前的cpu的支持。许多用户空间需要AVX2指令集的支持，以及AMD北极星架构的显卡驱动和一些kext中AVX2的指令实例。尽管这些kext可以通过 打[补丁](https://forums.macrumors.com/threads/monterand-probably-the-start-of-an-ongoing-saga.2320479/post-31125212) 的方式或者 [降级](https://github.com/dortania/OpenCore-Legacy-Patcher/blob/92ff4244ae78de715977d9f8d054cdf9bdce4011/payloads/Kexts/Misc/NoAVXFSCompressionTypeZlib-AVXpel-v12.6.zip)kext的方式解决, 但是无法通过打补丁的方式解决北极星架构的显卡驱动和大部分基于AVX2指令集的用户空间问题。

苹果留下了一个dyld缓存，在Ventura中不使用AVX2指令集来支持苹果硅机器上的Rosetta，但默认情况下没有安装这个缓存。 你可以使用 [CryptexFixup](https://github.com/acidanthera/CryptexFixup) 来强制安装dyld缓存, 但是有如下几点:

* 如果苹果将AVX2支持添加到Rosetta中，他们可能会在未来的任何时候删除这个缓存
* 无法进行增量更新(1-3GB的小更新)，你必须安装完整的更新(12GB)，因为增量更新只包含无avx2缓存Apple Silicon机器
* 北极星架构的显卡无法在无AVX2指令集的机器上使用

因为以上原因，Dortania团队将不再对Haswell架构以前的cpu提供Ventura（macOS 13）及以上的支持，对应这些cpu的页面将只针对Monterey（macOS 12）系统进行更新。
### 支持的机型

Ventura 删除了如下机型的支持:

* iMac17,x 以及更早的机型
* Macmini7,1 以及更早的机型
* MacBook9,1 以及更早的机型
* MacBookAir7,x 以及更早的机型
* MacBookPro13,x 以及更早的机型
* MacPro6,1 以及更早的机型

如果你的机型是在能够被Monterey系统支持并且没有出现在上述列表, 那么你可以继续完好的使用！

::: 详细的机型支持

* iMac18,x 以及更新的机型
* MacPro7,1 以及更新的机型
* iMacPro1,1 以及更新的机型
* Macmini8,1
* MacBook10,1
* MacBookAir8,1 以及更新的机型
* MacBookPro14,x 以及更新的机型

[点这里](./smbios-support.md) 查看完整的机型支持列表。

:::

对于那些在Ventura不再支持的架构上:

* 所有有独立显卡的台式机应该使用iMac18，iMac18,2，MacPro7,1或者iMacPro1,1。不受支持的独立显卡（非免驱独立显卡）仍然需要OCLP，免驱的显卡则不需要。
* 所有使用不受支持的核心显卡（非免驱核心显卡）的台式机应该使用iMac18,1。
* 所有不受支持的笔记本(使用Haswell, Broadwell, Skylake架构cpu的笔记本) 应该使用 MacBookPro14,1。

### 支持的硬件

去掉了如下硬件的支持:

* Haswell (HD 4200/4400/4600/5000/P4600/P4700, Iris 5100, Iris Pro 5200)
* Broadwell (HD 5300/5500/5600/6000/P5700, Iris 6100, Iris Pro 6200/P6300)
* Skylake (HD 5xx/P5xx, Iris 5xx, Iris Pro 5xx/P5xx)
  * Skylake可以用v1.6.1版本或者更新版本的WhateverGreen来仿冒成Kaby Lake
  * 更换最接近你配置的Kaby Lake架构的 `device-id`和`AAPL,ig-platform-id`
  * 如果你想通过同样的配置来引导Monterey（macOS 12）或者更老的系统, 请在启动参数（boot-args）中添加`-igfxsklaskbl`

* 你可以使用[OpenCore-Legacy-Patcher](https://github.com/dortania/OpenCore-Legacy-Patcher/)来添加回删掉的硬件支持
  * 不会为使用OCLP的设备提供支持
  * 你讲不能进行增量更新 (1-3GB的小更新)
  * 必须将SIP，Apple Secure Boot，和AMFI禁用.

### AMD 补丁

对于AMD的cpu, 请确保你更新了针对Ventura（macOS 13）的[内核补丁](https://github.com/AMD-OSX/AMD_Vanilla)。
不要忘记更新补丁以及你的cpu内核数量.
需要编辑的补丁名称为 `algrey - Force cpuid_cores_per_package`, 并且你只需要编辑 `Replace` 的值。你应该按照如下更改:

* `B8000000 0000` => `B8 <core count> 0000 0000`
* `BA000000 0000` => `BA <core count> 0000 0000`
* `BA000000 0090` => `BA <core count> 0000 0090`

这里的`<core count>`应该被替换为你cpu物理核心数的16进制数。举个例子,一颗8核心的5800x应该设置成下面这样:

* `B8 08 0000 0000`
* `BA 08 0000 0000`
* `BA 08 0000 0090`

::: 核心数量 => 对应的16进制

| Core Count | Hexadecimal |
| :--------- | :---------- |
| 4 Core | `04` |
| 6 Core | `06` |
| 8 Core | `08` |
| 12 Core | `0C` |
| 16 Core | `10` |
| 24 Core | `18` |
| 32 Core | `20` |
| 64 Core | `40` |

:::
