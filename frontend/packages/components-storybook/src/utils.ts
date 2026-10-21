export type TemplateArgs<T> = { skipLoadingScreen: boolean; data?: T; action?: (data: T) => Promise<void> };

export function templateArgs<T>(args: TemplateArgs<T>) {
  return args;
}