# AMD Kernel Patches

Running an AMD CPU but still want to try out OpenCore? Well something to keep in mind:

* Currently the kernel patches have only been updated for Zen, you can still try out OpenCore if you're running FX series of CPUs but keep in mind they can be buggy

## Applying kernel patches

To start, grab the [patches.plist from AMD\_Vanilla](https://github.com/AMD-OSX/AMD_Vanilla) and then navigate to your config.plist. Under `Root -> Kernel -> Patch`, you'll notice that patches are implemented are slightly different so you can't copy and paste them.

The main difference you'll notice is that `MatchOS` from Clover becomes `MatchKernel` in OpenCore. This becomes an issue becuase they're no longer 1-to-1, instead needing to find the darwin version associated with the OS version. Luckinly the mad man that is CorpNewt has already scrapped the web for this information which you can find in [kernel.json](https://github.com/khronokernel/Opencore-Vanilla-Desktop-Guide/blob/master/kernels.json). These are some relavant ones:

```text
  {
    "os_version": "10.13",
    "build_version": "17A365",
    "darwin_version": "17.0.0"
  },
  {
    "os_version": "10.13",
    "build_version": "17A405",
    "darwin_version": "17.0.0"
  },
  {
    "os_version": "10.13.1",
    "build_version": "17B48",
    "darwin_version": "17.2.0"
  },
  {
    "os_version": "10.13.1",
    "build_version": "17B1002",
    "darwin_version": "17.2.0"
  },
  {
    "os_version": "10.13.1",
    "build_version": "17B1003",
    "darwin_version": "17.2.0"
  },
  {
    "os_version": "10.13.2",
    "build_version": "17C88",
    "darwin_version": "17.3.0"
  },
  {
    "os_version": "10.13.2",
    "build_version": "17C89",
    "darwin_version": "17.3.0"
  },
  {
    "os_version": "10.13.2",
    "build_version": "17C205",
    "darwin_version": "17.3.0"
  },
  {
    "os_version": "10.13.2",
    "build_version": "17C2205",
    "darwin_version": "17.3.0"
  },
  {
    "os_version": "10.13.3",
    "build_version": "17D47",
    "darwin_version": "17.4.0"
  },
  {
    "os_version": "10.13.3",
    "build_version": "17D2047",
    "darwin_version": "17.4.0"
  },
  {
    "os_version": "10.13.3",
    "build_version": "17D102",
    "darwin_version": "17.4.0"
  },
  {
    "os_version": "10.13.3",
    "build_version": "17D2102",
    "darwin_version": "17.4.0"
  },
  {
    "os_version": "10.13.4",
    "build_version": "17E199",
    "darwin_version": "17.5.0"
  },
  {
    "os_version": "10.13.4",
    "build_version": "17E202",
    "darwin_version": "17.5.0"
  },
  {
    "os_version": "10.13.5",
    "build_version": "17F77",
    "darwin_version": "17.6.0"
  },
  {
    "os_version": "10.13.6",
    "build_version": "17G65",
    "darwin_version": "17.7.0"
  },
  {
    "os_version": "10.13.6",
    "build_version": "17G2208",
    "darwin_version": "17.7.0"
  },
  {
    "os_version": "10.13.6",
    "build_version": "17G3025",
    "darwin_version": "17.7.0"
  },
  {
    "os_version": "10.13.6",
    "build_version": "17G4015",
    "darwin_version": "17.7.0"
  },
  {
    "os_version": "10.13.6",
    "build_version": "17G5019",
    "darwin_version": "17.7.0"
  },
  {
    "os_version": "10.13.6",
    "build_version": "17G6029",
    "darwin_version": "17.7.0"
  },
  {
    "os_version": "10.13.6",
    "build_version": "17G6030",
    "darwin_version": "17.7.0"
  },
  {
    "os_version": "10.13.6",
    "build_version": "17G7024",
    "darwin_version": "17.7.0"
  },
  {
    "os_version": "10.14",
    "build_version": "18A391",
    "darwin_version": "18.0.0"
  },
  {
    "os_version": "10.14.1",
    "build_version": "18B75",
    "darwin_version": "18.2.0"
  },
  {
    "os_version": "10.14.1",
    "build_version": "18B2107",
    "darwin_version": ""
  },
  {
    "os_version": "10.14.1",
    "build_version": "18B3094",
    "darwin_version": ""
  },
  {
    "os_version": "10.14.2",
    "build_version": "18C54",
    "darwin_version": "18.2.0"
  },
  {
    "os_version": "10.14.3",
    "build_version": "18D42",
    "darwin_version": "18.2.0"
  },
  {
    "os_version": "10.14.3",
    "build_version": "18D43",
    "darwin_version": "18.2.0"
  },
  {
    "os_version": "10.14.3",
    "build_version": "18D109",
    "darwin_version": "18.2.0"
  },
  {
    "os_version": "10.14.4",
    "build_version": "18E226",
    "darwin_version": "18.5.0"
  },
  {
    "os_version": "10.14.4",
    "build_version": "18E227",
    "darwin_version": "18.5.0"
  },
  {
    "os_version": "10.14.5",
    "build_version": "18F132",
    "darwin_version": "18.6.0"
  },
  {
    "os_version": "10.14.6",
    "build_version": "18G84",
    "darwin_version": "18.7.0"
  }
]
```

