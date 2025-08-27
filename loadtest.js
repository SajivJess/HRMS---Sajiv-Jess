import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 50, // number of virtual users
  duration: '1m', // test duration
};

export default function () {
    let res = http.get('https://velvety-duckanoo-a2774e.netlify.app/');
    check(res, { 'status was 200': (r) => r.status == 200 });
    sleep(1);
}