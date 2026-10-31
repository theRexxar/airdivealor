"use client";

import { useState } from "react";
import { useCmsUser } from "@/components/cms/CmsUser";
import { MediaDetails, MediaLibrary, type MediaItem } from "@/components/cms/media";
import { PageHead } from "@/components/cms/Shell";
import { Forbidden } from "../Forbidden";

export default function MediaPage() {
  const { can } = useCmsUser();
  const [open, setOpen] = useState<MediaItem | null>(null);
  const [version, setVersion] = useState(0);
  if (!can("media.view")) return <Forbidden />;
  return (
    <>
      <PageHead title="Media library" sub="Photos and videos for the website. Uploads go straight to storage, then a background worker makes web-sized versions: WebP images in several sizes, and an MP4 with a poster for videos." />
      <div className="cms-card">
        <div className="cms-card__body">
          <MediaLibrary key={version} onPick={setOpen} />
        </div>
      </div>
      {open && (
        <MediaDetails
          m={open}
          onClose={() => setOpen(null)}
          onChanged={(m) => {
            setOpen(m);
            setVersion((v) => v + 1);
          }}
          onDeleted={() => {
            setOpen(null);
            setVersion((v) => v + 1);
          }}
        />
      )}
    </>
  );
}
