import { DB } from "@msync/plugins/db/index.js";
import { Callback } from "@msync/entities/callback.js";

async function doCallback(url: string) {
  try {
    await fetch(url, {
      method: "POST",
    });
  } catch (error) {
    console.error(`Error notifying callback URL ${url}:`, error);
  }
}

export class Notifier {
  completedUrls: string[] = [];
  errorUrls: string[] = [];

  async load(db: DB) {
    const callbacks = await db.find(Callback, {});
    for (const callback of callbacks) {
      if (callback.eventType === "completed") {
        this.completedUrls.push(callback.url);
      } else if (callback.eventType === "error") {
        this.errorUrls.push(callback.url);
      }
    }
  }

  async notifyCompleted() {
    await Promise.all(this.completedUrls.map(doCallback));
  }

  async notifyError() {
    await Promise.all(this.errorUrls.map(doCallback));
  }
}
