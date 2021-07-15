export interface Resolver<T, U = void> {
  getResolution: (payload: U) => Promise<T>;
}

export abstract class RuleResolver<Resolution, ResolverInputPayload = void>
  implements Resolver<Resolution, ResolverInputPayload>
{
  protected resolveCallback?: (s: Resolution) => void;
  protected rejectCallback?: () => void;

  protected abstract initResolution(payload: ResolverInputPayload): void;

  protected abstract endResolution(): void;

  getResolution(payload: ResolverInputPayload): Promise<Resolution> {
    this.initResolution(payload);

    return new Promise<Resolution>((resolve, reject) => {
      this.resolveCallback = resolve;
      this.rejectCallback = reject;
    });
  }

  resolve(resolution: Resolution): void {
    if (this.resolveCallback) {
      this.resolveCallback(resolution);
      this.endResolution();
    }
  }

  reject(): void {
    if (this.rejectCallback) {
      this.rejectCallback();
      this.endResolution();
    }
  }
}
