import { Award, BadgeDollarSign, BarChart3, Binary, BookOpenCheck, BriefcaseBusiness, Building2, CalendarDays, Check, ClipboardCheck, Compass, Cpu, Eye, FileCheck2, FilePenLine, Files, Globe, Globe2, GraduationCap, HandCoins, Heart, HeartPulse, House, Landmark, Lightbulb, MapPinned, MessageSquareText, Palette, PlaneTakeoff, Rocket, Scale, ScanSearch, SearchCheck, ShieldCheck, Sprout, Star, Stamp, Stethoscope, Target, TestTube2, Users, UserRoundCheck, WalletCards, type LucideIcon } from "lucide-react";

export const iconRegistry: Record<string, LucideIcon> = {
  Award, BadgeDollarSign, BarChart3, Binary, BookOpenCheck, BriefcaseBusiness, Building2, CalendarDays, Check, ClipboardCheck, Compass, Cpu, Eye, FileCheck2, FilePenLine, Files, Globe, Globe2, GraduationCap, HandCoins, Heart, HeartPulse, House, Landmark, Lightbulb, MapPinned, MessageSquareText, Palette, PlaneTakeoff, Rocket, Scale, ScanSearch, SearchCheck, ShieldCheck, Sprout, Star, Stamp, Stethoscope, Target, TestTube2, Users, UserRoundCheck, WalletCards,
};

export const iconNames = Object.keys(iconRegistry);

export function getIcon(name: string | undefined | null): LucideIcon {
  return (name && iconRegistry[name]) || Compass;
}
