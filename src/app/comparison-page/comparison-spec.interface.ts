export type ComparisonDirection = 'higher' | 'lower' | 'none';

export interface ComparisonSpec {
  key: 'price' | 'power' | 'consumption' | 'weight' | 'ipva' | 'insurance' | 'maintenance' | 'engine';
  label: string;
  icon: string;
  direction: ComparisonDirection;
  formatter: (leftValue: unknown, rightValue: unknown) => { left: string; right: string };
}
