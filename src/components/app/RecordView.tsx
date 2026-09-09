"use client";

import { useEffect } from "react";
import { recordProfileView } from "@/lib/actions/view";

export function RecordView({ viewedId }: { viewedId: string }) {
  useEffect(() => {
    void recordProfileView(viewedId);
  }, [viewedId]);
  return null;
}
