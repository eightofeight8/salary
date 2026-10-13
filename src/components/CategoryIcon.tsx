import {
  ShoppingCart,
  Zap,
  Home,
  Car,
  PartyPopper,
  HeartPulse,
  Tag,
  Briefcase,
  Wrench,
  Award,
  Percent,
  Gift,
  Wallet,
  Coins,
  Banknote,
  PiggyBank,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  'shopping-cart': ShoppingCart,
  zap: Zap,
  home: Home,
  car: Car,
  'party-popper': PartyPopper,
  'heart-pulse': HeartPulse,
  tag: Tag,
  briefcase: Briefcase,
  wrench: Wrench,
  award: Award,
  percent: Percent,
  gift: Gift,
  wallet: Wallet,
  coins: Coins,
  banknote: Banknote,
  'piggy-bank': PiggyBank,
};

interface CategoryIconProps {
  name?: string | null;
  className?: string;
}

export function CategoryIcon({ name, className }: CategoryIconProps) {
  const Icon = (name && ICONS[name]) || Tag;
  return <Icon className={className} aria-hidden="true" />;
}