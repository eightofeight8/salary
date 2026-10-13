import { existsSync } from 'node:fs';
import { config } from 'dotenv';

export function loadEnv() {
  const path = existsSync('.env.local') ? '.env.local' : '.env';
  config({ path });
}