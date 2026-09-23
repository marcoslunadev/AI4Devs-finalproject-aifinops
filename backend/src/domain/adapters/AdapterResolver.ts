import { LogAdapter } from './LogAdapter';
import { OpenAIAdapter } from './OpenAIAdapter';
import { AzureAdapter } from './AzureAdapter';

export class AdapterResolver {
  private adapters: LogAdapter[];

  constructor() {
    this.adapters = [
      new OpenAIAdapter(),
      new AzureAdapter()
    ];
  }

  resolve(filename: string): LogAdapter {
    const adapter = this.adapters.find(a => a.canHandle(filename));
    if (!adapter) {
      throw new Error(`No suitable adapter found for file: ${filename}`);
    }
    return adapter;
  }
}
