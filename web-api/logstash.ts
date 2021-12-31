import { createSocket } from 'dgram';
import { hostname } from 'os';

if (!process.env.LOGSTASH) {
  throw new Error('LOGSTASH is not set');
}

const [LS_HOST, LS_PORT] = process.env.LOGSTASH.split(':');
const NODE_ENV = process.env.NODE_ENV;
const client = createSocket('udp4');

export default function logstash(
  severity: string,
  type: string,
  fields: { [key: string]: string | undefined }
) {
  const payload = JSON.stringify({
    '@timestamp': new Date().toISOString(),
    '@version': 1,
    app: 'web-api',
    environment: NODE_ENV,
    severity,
    type,
    fields,
    host: hostname(),
  });
  console.log(payload);
  client.send(payload, parseInt(LS_PORT, 10), LS_HOST);
}
