"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { submitInquiry } from "@/features/leads/actions";
import { inquirySchema, type InquiryInput } from "@/features/leads/schemas";

const INTEREST_AREAS = [
  "Videography",
  "Video Editing",
  "Digital Marketing",
  "Content Creation & Reels",
  "Photography",
  "Capstone Project",
];

export function InquiryForm() {
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [areas, setAreas] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { interestAreas: [] },
  });

  function toggleArea(area: string) {
    const next = areas.includes(area) ? areas.filter((a) => a !== area) : [...areas, area];
    setAreas(next);
    setValue("interestAreas", next);
  }

  async function onSubmit(values: InquiryInput) {
    setFormError(null);
    const result = await submitInquiry({ ...values, interestAreas: areas });
    if (!result.success) {
      if (result.fieldErrors) {
        for (const [f, m] of Object.entries(result.fieldErrors)) {
          setError(f as keyof InquiryInput, { message: m });
        }
      }
      setFormError(result.error);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border bg-card p-10 text-center">
        <CheckCircle2 className="size-10 text-primary" />
        <h3 className="font-display text-xl font-semibold">Inquiry received</h3>
        <p className="max-w-md text-sm text-muted-foreground">
          Thank you. Our team will review your requirements and propose a custom program
          and demo session within a few days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {formError ? (
        <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {formError}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="instituteName">Institute name</Label>
          <Input id="instituteName" aria-invalid={!!errors.instituteName} {...register("instituteName")} />
          {errors.instituteName ? <p className="text-xs text-destructive">{errors.instituteName.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactPerson">Contact person</Label>
          <Input id="contactPerson" aria-invalid={!!errors.contactPerson} {...register("contactPerson")} />
          {errors.contactPerson ? <p className="text-xs text-destructive">{errors.contactPerson.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" aria-invalid={!!errors.email} {...register("email")} />
          {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" aria-invalid={!!errors.phone} {...register("phone")} />
          {errors.phone ? <p className="text-xs text-destructive">{errors.phone.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="studentStrength">Expected student strength</Label>
          <Input id="studentStrength" type="number" min={1} aria-invalid={!!errors.studentStrength} {...register("studentStrength")} />
          {errors.studentStrength ? <p className="text-xs text-destructive">{errors.studentStrength.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="timeSlots">Available time slots</Label>
          <Input id="timeSlots" placeholder="e.g. Weekdays 2–4pm" {...register("timeSlots")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Areas of interest</Label>
        <div className="flex flex-wrap gap-2">
          {INTEREST_AREAS.map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => toggleArea(area)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm transition-colors",
                areas.includes(area)
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Anything else? (optional)</Label>
        <Textarea id="message" rows={4} {...register("message")} />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin" /> : null}
        Submit inquiry
      </Button>
    </form>
  );
}
