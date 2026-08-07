import {
  Sparkles,
  ShieldCheck,
  Clock,
  JapaneseYen,
  Leaf,
  Wind,
  Droplet,
  Home,
  Toilet,
  Bath,
  Check,
  Calendar,
  MapPin,
  Star,
  Search,
  ClipboardList,
  SprayCan,
  MessageCircle,
  HeartHandshake,
  Car,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/types";

const iconMap: Record<IconName, LucideIcon> = {
  sparkles: Sparkles,
  shield: ShieldCheck,
  clock: Clock,
  yen: JapaneseYen,
  leaf: Leaf,
  wind: Wind,
  droplet: Droplet,
  home: Home,
  toilet: Toilet,
  bath: Bath,
  line: MessageCircle,
  helper: HeartHandshake,
  check: Check,
  calendar: Calendar,
  map: MapPin,
  star: Star,
  search: Search,
  clipboard: ClipboardList,
  spray: SprayCan,
  chat: MessageCircle,
  car: Car,
  chevronDown: ChevronDown,
};

type IconProps = {
  name: IconName;
  className?: string;
  strokeWidth?: number;
};

export default function Icon({ name, className, strokeWidth = 1.75 }: IconProps) {
  const LucideIconComponent = iconMap[name];
  return <LucideIconComponent className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
