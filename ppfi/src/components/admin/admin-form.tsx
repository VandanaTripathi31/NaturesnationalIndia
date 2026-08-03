"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ActionState } from "@/features/admin/actions";

export type FieldConfig = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "url" | "select" | "checkbox" | "tags";
  options?: { value: string; label: string }[];
  placeholder?: string;
  help?: string;
  required?: boolean;
  rows?: number;
};

type ServerFormAction = (prev: ActionState, formData: FormData) => Promise<ActionState>;

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : null}
      {label}
    </Button>
  );
}

export function AdminForm({
  action,
  fields,
  initial = {},
  hidden = {},
  submitLabel = "Save",
}: {
  action: ServerFormAction;
  fields: FieldConfig[];
  initial?: Record<string, unknown>;
  hidden?: Record<string, string>;
  submitLabel?: string;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(action, null);

  return (
    <form action={formAction} className="max-w-2xl space-y-5" noValidate>
      {state?.error ? (
        <p
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {state.error}
        </p>
      ) : null}

      {Object.entries(hidden).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}

      {fields.map((field) => {
        const err = state?.fieldErrors?.[field.name];
        const value = initial[field.name];
        const id = `field-${field.name}`;
        return (
          <div key={field.name} className="space-y-2">
            {field.type !== "checkbox" ? <Label htmlFor={id}>{field.label}</Label> : null}

            {field.type === "textarea" ? (
              <Textarea
                id={id}
                name={field.name}
                rows={field.rows ?? 5}
                placeholder={field.placeholder}
                defaultValue={typeof value === "string" ? value : ""}
                aria-invalid={!!err}
              />
            ) : field.type === "tags" ? (
              <Textarea
                id={id}
                name={field.name}
                rows={field.rows ?? 4}
                placeholder={field.placeholder ?? "One per line"}
                defaultValue={Array.isArray(value) ? (value as string[]).join("\n") : ""}
                aria-invalid={!!err}
              />
            ) : field.type === "select" ? (
              <select
                id={id}
                name={field.name}
                defaultValue={typeof value === "string" ? value : ""}
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {field.options?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : field.type === "checkbox" ? (
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  id={id}
                  type="checkbox"
                  name={field.name}
                  defaultChecked={Boolean(value)}
                  className="size-4 rounded border-input"
                />
                {field.label}
              </label>
            ) : (
              <Input
                id={id}
                name={field.name}
                type={field.type === "number" ? "number" : field.type === "url" ? "url" : "text"}
                placeholder={field.placeholder}
                defaultValue={
                  typeof value === "string" || typeof value === "number" ? String(value) : ""
                }
                aria-invalid={!!err}
              />
            )}

            {field.help ? (
              <p className="text-xs text-muted-foreground">{field.help}</p>
            ) : null}
            {err ? <p className="text-xs text-destructive">{err}</p> : null}
          </div>
        );
      })}

      <SubmitButton label={submitLabel} />
    </form>
  );
}
