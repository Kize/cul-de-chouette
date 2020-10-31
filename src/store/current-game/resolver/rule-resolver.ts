export interface Resolver<T> {
  getResolution: () => Promise<T>;
}

export abstract class RuleResolver<T> implements Resolver<T> {
  protected resolveCallback?: (s: T) => void;
  protected rejectCallback?: () => void;

  abstract openResolver(): void;

  getResolution(): Promise<T> {
    this.openResolver();

    return new Promise<T>((resolve, reject) => {
      this.resolveCallback = resolve;
      this.rejectCallback = reject;
    });
  }

  resolve(resolution: T): void {
    if (this.resolveCallback) {
      this.resolveCallback(resolution);
    }
  }

  reject(): void {
    if (this.rejectCallback) {
      this.rejectCallback();
    }
  }
}
