"Inject ATI" Property from Clover

      AtiDevProp ati_devprop_list[] = {
     {FLAGTRUE, FALSE, "@0,AAPL,boot-display",  get_bootdisplay_val, NULVAL    },
     // {FLAGTRUE, FALSE, "@0,ATY,EFIDisplay",  NULL,     STRVAL("TMDSA")   },
   
     //{FLAGTRUE, TRUE, "@0,AAPL,vram-memory",  get_vrammemory_val,  NULVAL    },
     {FLAGDYNAMIC, TRUE, "AAPL00,override-no-connect",  get_edid_val,       NULVAL        },
     {FLAGNOTFAKE, TRUE, "@0,compatible",              get_name_val,       NULVAL    },
     {FLAGTRUE, TRUE, "@0,connector-type",          get_conntype_val,  NULVAL        },
     {FLAGTRUE, TRUE, "@0,device_type",             NULL,     STRVAL("display")   },
     // {FLAGTRUE, FALSE, "@0,display-connect-flags", NULL,    DWRVAL(0)   },
   
     //some set of properties for mobile radeons
     {FLAGMOBILE, FALSE, "@0,display-link-component-bits",  NULL,  DWRVAL(6) },
     {FLAGMOBILE, FALSE, "@0,display-pixel-component-bits", NULL,  DWRVAL(6) },
     {FLAGMOBILE, FALSE, "@0,display-dither-support",       NULL,  DWRVAL(0) },
     {FLAGMOBILE, FALSE, "@0,backlight-control",       NULL,  DWRVAL(1) },
     {FLAGTRUE,   FALSE, "AAPL00,Dither", NULL,  DWRVAL(0) },
   
   
     //  {FLAGTRUE, TRUE, "@0,display-type",          NULL,     STRVAL("NONE")   },
     {FLAGTRUE, TRUE, "@0,name",                    get_name_val,   NULVAL          },
     {FLAGTRUE, TRUE, "@0,VRAM,memsize",   get_vrammemsize_val, NULVAL          },
     //  {FLAGTRUE, TRUE, "@0,ATY,memsize",     get_vrammemsize_val, NULVAL          },
   
     {FLAGTRUE, FALSE, "AAPL,aux-power-connected", NULL,     DWRVAL(1)  },
     {FLAGTRUE, FALSE, "AAPL00,DualLink",          get_dual_link_val,   NULVAL  },
     {FLAGMOBILE, FALSE, "AAPL,HasPanel",          NULL,     DWRVAL(1)   },
     {FLAGMOBILE, FALSE, "AAPL,HasLid",            NULL,     DWRVAL(1)   },
     {FLAGMOBILE, FALSE, "AAPL,backlight-control", NULL,     DWRVAL(1)   },
     {FLAGTRUE, FALSE, "AAPL,overwrite_binimage", get_binimage_owr,  NULVAL    },
     {FLAGDYNAMIC, FALSE, "ATY,bin_image",        get_binimage_val,  NULVAL    },
     {FLAGTRUE, FALSE, "ATY,Copyright", NULL, STRVAL("Copyright AMD Inc. All Rights Reserved. 2005-2011") },
     {FLAGTRUE, FALSE, "ATY,EFIVersion", NULL, STRVAL("01.00.3180")                  },
     {FLAGTRUE, FALSE, "ATY,Card#",   get_romrevision_val, NULVAL                },
     //  {FLAGTRUE, FALSE, "ATY,Rom#", NULL, STRVAL("www.amd.com")                  },
     {FLAGNOTFAKE, FALSE, "ATY,VendorID",  NULL,     WRDVAL(0x1002)        },
     {FLAGNOTFAKE, FALSE, "ATY,DeviceID",  get_deviceid_val,  NULVAL                  },
   
     // {FLAGTRUE, FALSE, "ATY,MCLK",     get_mclk_val,   NULVAL       },
     // {FLAGTRUE, FALSE, "ATY,SCLK",     get_sclk_val,   NULVAL       },
     {FLAGTRUE, FALSE, "ATY,RefCLK",    get_refclk_val,   DWRVAL(0x0a8c)  },
   
     {FLAGTRUE, FALSE, "ATY,PlatformInfo",   get_platforminfo_val, NULVAL     },
     {FLAGOLD,  FALSE, "compatible",      get_name_pci_val,     NULVAL       },
     {FLAGTRUE, FALSE, "name",      get_nameparent_val,     NULVAL       },
     {FLAGTRUE, FALSE, "device_type",  get_nameparent_val,     NULVAL       },
     {FLAGTRUE, FALSE, "model",     get_model_val,          STRVAL("ATI Radeon")},
     //  {FLAGTRUE, FALSE, "VRAM,totalsize", get_vramtotalsize_val, NULVAL              },
   
     {FLAGTRUE, FALSE, NULL, NULL, NULVAL}
};`
