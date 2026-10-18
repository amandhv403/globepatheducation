import type { Metadata } from "next";
import { getPageHero, pageMetadata } from "@/lib/cms";
import { ProfileAssessmentForm } from "@/components/profile-assessment-form";
import { PageHero } from "@/components/ui";

export async function generateMetadata(): Promise<Metadata> { return pageMetadata("profile-assessment"); }
export default async function ProfileAssessmentPage(){return <main><PageHero {...(await getPageHero("profile-assessment"))}/><section className="assessment-page"><div className="assessment-shell"><ProfileAssessmentForm/></div></section></main>}
