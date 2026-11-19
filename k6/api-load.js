import http from 'k6/http';
import { sleep, check } from 'k6';

const BASE = __ENV.BASE_URL || 'http://127.0.0.1:8000';
const TOKEN = __ENV.TOKEN || '';

const VUS = parseInt(__ENV.VUS || '5');
const DUR = __ENV.DURATION || '60s';
const PROFILE = __ENV.PROFILE || 'constant';

export const options = PROFILE === 'stages'
  ? {
      stages: [
        { duration: '30s', target: 5 },
        { duration: '40s', target: 30 },
        { duration: '40s', target: 100 },
        { duration: '20s', target: 0 },
      ],
      thresholds: {
        'http_req_duration': ['p(95)<500', 'p(99)<1000'],
        'http_req_failed': ['rate<0.01'],
        'checks': ['rate>0.99'],
        'http_req_duration{endpoint:health}': ['p(95)<50'],
        'http_req_duration{endpoint:auth}': ['p(95)<200'],
        'http_req_duration{endpoint:chatbots}': ['p(95)<300'],
        'http_req_duration{endpoint:chat}': ['p(95)<800'],
        'http_req_duration{endpoint:conversations}': ['p(95)<400'],
        'iteration_duration': ['p(95)<3000'],
      },
    }
  : {
      vus: VUS,
      duration: DUR,
      thresholds: {
        'http_req_duration': ['p(95)<500', 'p(99)<1000'],
        'http_req_failed': ['rate<0.01'],
        'checks': ['rate>0.99'],
        'http_req_duration{endpoint:health}': ['p(95)<50'],
        'http_req_duration{endpoint:auth}': ['p(95)<200'],
        'http_req_duration{endpoint:chatbots}': ['p(95)<300'],
        'http_req_duration{endpoint:chat}': ['p(95)<800'],
        'http_req_duration{endpoint:conversations}': ['p(95)<400'],
        'iteration_duration': ['p(95)<3000'],
      },
    };

const headers = { 'Content-Type': 'application/json' };
if (TOKEN) headers['Authorization'] = `Bearer ${TOKEN}`;

export default function () {
  // 1. Виджет нээгдэв
  let r = http.get(`${BASE}/v1/health`, { tags: { endpoint: 'health' } });
  check(r, { 'health 200': (r) => r.status === 200 });

  // 2. Хэн бэ
  r = http.get(`${BASE}/v1/auth/me`, { headers, tags: { endpoint: 'auth' } });
  check(r, { 'auth 200': (r) => r.status === 200 });

  sleep(0.5);

  // 3. Ботуудын жагсаалт
  r = http.get(`${BASE}/v1/chatbots`, { headers, tags: { endpoint: 'chatbots' } });
  check(r, { 'chatbots 200': (r) => r.status === 200 });

  // 4. Асуулт
  const body = JSON.stringify({ message: 'Сайн байна уу?', chatbot_id: __ENV.BOT_ID || '1' });
  r = http.post(`${BASE}/v1/chat`, body, { headers, tags: { endpoint: 'chat' } });
  check(r, { 'chat 200/201': (r) => r.status === 200 || r.status === 201 });

  sleep(0.5);

  // 5. Түүх
  r = http.get(`${BASE}/v1/conversations?limit=20`, { headers, tags: { endpoint: 'conversations' } });
  check(r, { 'conversations 200': (r) => r.status === 200 });
}
