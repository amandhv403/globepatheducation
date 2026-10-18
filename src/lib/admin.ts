export const leadStageOptions = [
  ["new_lead", "New lead"],
  ["contacted", "Contacted"],
  ["counselling", "Counselling"],
  ["profile_assessment", "Profile assessment"],
  ["university_selection", "University selection"],
  ["application", "Application"],
  ["offer_received", "Offer received"],
  ["visa_preparation", "Visa preparation"],
  ["visa_submitted", "Visa submitted"],
  ["visa_decision", "Visa decision"],
  ["pre_departure", "Pre-departure"],
  ["completed", "Completed"],
] as const;

export type LeadStageValue = typeof leadStageOptions[number][0];

export const leadTypeLabels: Record<string, string> = {
  consultation: "Consultation",
  profile_assessment: "Profile assessment",
  event: "Event interest",
  destination_finder: "Destination finder",
};

export function stageLabel(stage: string) {
  return leadStageOptions.find(([value]) => value === stage)?.[1] || stage.replaceAll("_", " ");
}

export function typeLabel(type: string) {
  return leadTypeLabels[type] || type.replaceAll("_", " ");
}

export function formatAdminDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Dhaka" }).format(new Date(date));
}
