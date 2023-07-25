export class BullMQAdapter {
  get PORT(): number {
    return parseInt(process.env.BULLMQ_REDIS_PORT, 10);
  }

  get HOST(): string {
    return process.env.BULLMQ_REDIS_HOST;
  }

  get PASS(): string {
    return process.env.BULLMQ_REDIS_PASS;
  }

  get USER(): string {
    return process.env.BULLMQ_REDIS_USER;
  }
}
