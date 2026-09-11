### Лабораторын ажил 2
execution: local
        script: script.js
        output: -

     scenarios: (100.00%) 1 scenario, 5 max VUs, 1m0s max duration (incl. graceful stop):
              * default: 5 looping VUs for 30s (gracefulStop: 30s)



  █ TOTAL RESULTS 

    checks_total.......: 106     3.390871/s
    checks_succeeded...: 100.00% 106 out of 106
    checks_failed......: 0.00%   0 out of 106

    ✓ status 200 байна

    HTTP
    http_req_duration..............: avg=194.74ms min=56.71ms med=226.15ms max=1.06s p(90)=325.7ms p(95)=359.63ms
      { expected_response:true }...: avg=194.74ms min=56.71ms med=226.15ms max=1.06s p(90)=325.7ms p(95)=359.63ms
    http_req_failed................: 0.00%  0 out of 212
    http_reqs......................: 212    6.781741/s

    EXECUTION
    iteration_duration.............: avg=1.43s    min=1.28s   med=1.32s    max=3.14s p(90)=1.62s   p(95)=2.01s   
    iterations.....................: 106    3.390871/s
    vus............................: 1      min=1        max=5
    vus_max........................: 5      min=5        max=5

    NETWORK
    data_received..................: 432 kB 14 kB/s
    data_sent......................: 27 kB  863 B/s