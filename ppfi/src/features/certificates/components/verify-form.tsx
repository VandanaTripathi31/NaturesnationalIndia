"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function VerifyForm() {
  const router = useRouter();
  const [id, setId] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = id.trim();
    if (trimmed) router.push(`/verify/${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <Input
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="e.g. PPFI-2026-A1B2C3D4"
        aria-label="Certificate ID"
      />
      <Button type="submit">Verify</Button>
    </form>
  );
}
