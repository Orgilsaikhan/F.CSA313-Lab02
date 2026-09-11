import http from 'k6/http';
import { sleep, check } from 'k6';

// 2 baseline хэмжилтэд ашигласан хувилбар
// export const options = { vus: 5, duration: '30s' };

// 3: ачааллыг үе шаттай өсгөж, буулгах хувилбар

// export const options = {
//   stages: [
//     { duration: '30s', target: 5 },   // халаалт
//     { duration: '1m', target: 30 },   // өсгөлт
//     { duration: '30s', target: 100 }, // оргил
//     { duration: '30s', target: 0 },   // буулт
//   ],
// };

// 4: SLO-г threshold болгож, автомат PASS/FAIL quality gate болгосон хувилбар
export const options = {
  vus: 30,
  duration: '1m',

  thresholds: {
    // Baseline (Алхам 2, 30 VU, 1 мин): p95 = 311.99 ms
    // SLO = baseline x 1.5 = 468 ms -> 470 ms болгож тоймлосон
    http_req_duration: ['p(95)<470'],

    // Baseline: алдааны хувь 0% (0 / 2660). 1% нь хэвийн хэлбэлзлийн зай.
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const res = http.get('https://test.k6.io');

  check(res, { 'status 200 байна': (r) => r.status === 200 });

  sleep(1);
}
