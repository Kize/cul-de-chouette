export interface Resolver<T, U = void> {
  getResolution: (payload: U) => Promise<T>;
}

export abstract class RuleResolver<T, U = void> implements Resolver<T, U> {
  protected resolveCallback?: (s: T) => void;
  protected rejectCallback?: () => void;

  protected abstract initResolution(payload: U): void;
  protected abstract endResolution(): void;

  getResolution(payload: U): Promise<T> {
    this.initResolution(payload);

    return new Promise<T>((resolve, reject) => {
      this.resolveCallback = resolve;
      this.rejectCallback = reject;
    });
  }

  resolve(resolution: T): void {
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
