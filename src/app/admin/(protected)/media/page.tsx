import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { MediaLibrary } from "@/components/admin/media-library";

export const metadata: Metadata = { title: "Media Library" };

export default function AdminMediaPage() {
  return <div className="admin-page">
    <header className="admin-page-header"><div><p>Photos & sliders</p><h1>Media library</h1><span>Upload photos, then add them to any image slider on the website.</span></div><Link className="admin-button" href="/admin/settings#sliders">Edit sliders <ArrowRight size={15} /></Link></header>
    <div className="admin-notice"><Info size={19} /><div><strong>How to add a photo to a slider</strong><p>1. Upload the image here. 2. Press <b>Copy slider line</b>. 3. Open Site settings → Image sliders and paste it on a new line in the slider you want. 4. Save. The order of lines is the order of slides.</p></div></div>
    <MediaLibrary />
  </div>;
}
