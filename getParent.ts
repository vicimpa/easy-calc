export function getParetChild<T extends typeof HTMLElement>(target: Element, parentClass: T): InstanceType<T> | null {
  while (target?.parentElement) {
    if (target instanceof parentClass)
      return target as InstanceType<T>;
    target = target.parentElement;
  }

  return null;
}