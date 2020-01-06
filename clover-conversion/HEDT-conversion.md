Just a cumulation of data for running HEDT hardware with OpenCore:

Comment: _xcpm_performance_patch by JamesK
Find: 41C1E608 4963D689 D048C1EA 20
Replace: 41C1E608 B800FF00 0031D290 90
 
Comment: _xcpm_SMT_scope_msrs_1 by JamesK
Find: BE060000 005DE908 000000
Replace: BE060000 005DC390 909090
 
Comment: _xcpm_SMT_scope_msrs_2 by JamesK
Find: 31D2E844 FDFFFF
Replace: 31D29090 909090
 
Comment: _xcpm_pkg_scope_msrs by JamesK
Find: 31D2E879 FDFFFF
Replace: 31D29090 909090
 
Comment: _xcpm_core_scope_msrs by JamesK
Find: 31D2E857 FDFFFF
Replace: 31D29090 909090
