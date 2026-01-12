"use client";

import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { participantSchema, updateGroupSchema } from "@/domains/participants/types";
import { AlertCircle, CheckCircle2, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createParticipant, updateGroup, removeParticipant } from "@/server/actions/participants";
import { useTransition } from "react";
import { taskParticipants } from "@/db/schema";

type Participant = typeof taskParticipants.$inferSelect;

export function UserForm({
  userId,
  taskId,
  taskName,
  existingParticipant,
}: {
  userId: string;
  taskId: string;
  taskName: string;
  existingParticipant?: Participant | null;
}) {
  const [isSubmitting, startSubmitTransition] = useTransition();
  const [isRemoving, startRemoveTransition] = useTransition();
  const router = useRouter();
  const isUpdateMode = !!existingParticipant;

  const updateFormSchema = updateGroupSchema.omit({ participantId: true });
  const form = useForm<z.infer<typeof participantSchema> | z.infer<typeof updateFormSchema>>({
    resolver: zodResolver(isUpdateMode ? updateFormSchema : participantSchema),
    defaultValues: {
      groupName: existingParticipant?.groupName || "",
      groupSize: existingParticipant?.groupSize || 1,
      createdById: userId,
      taskId: taskId,
    },
  });

  // Handle update
  async function onUpdate(values: z.infer<typeof updateFormSchema>) {
    if (!existingParticipant) return;

    startSubmitTransition(async () => {
      try {
        await updateGroup({
          participantId: existingParticipant.id,
          ...values,
        });
        toast.success("Teilnahme erfolgreich aktualisiert");
        router.refresh();
      } catch (error) {
        if (error instanceof Error) {
          form.setError("root", { type: "error", message: error.message });
          toast.error(error.message);
        } else {
          form.setError("root", { type: "500" });
          toast.error("Fehler beim Aktualisieren");
        }
      }
    });
  }

  // Handle create
  async function onCreate(values: z.infer<typeof participantSchema>) {
    startSubmitTransition(async () => {
      try {
        await createParticipant(values);
        toast.success(
          <div className="flex gap-2">
            Du hast dich erfolgreich für {taskName} angemeldet.
            <Button asChild>
              <Link href="/meine-aufgaben">Aufgabenübersicht</Link>
            </Button>
          </div>,
          {
            richColors: true,
          }
        );
        router.refresh();
      } catch (error) {
        if (error instanceof Error) {
          form.setError("root", { type: "error", message: error.message });
          toast.error(error.message);
        } else {
          form.setError("root", { type: "500" });
          toast.error("Fehler beim Anmelden");
        }
      }
    });
  }

  // Handle remove
  async function onRemove() {
    if (!existingParticipant) return;

    startRemoveTransition(async () => {
      try {
        await removeParticipant(existingParticipant.id);
        toast.success("Du wurdest erfolgreich von der Aufgabe entfernt");
        router.refresh();
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Fehler beim Entfernen");
        }
      }
    });
  }

  async function onSubmit(values: z.infer<typeof participantSchema> | z.infer<typeof updateFormSchema>) {
    if (isUpdateMode) {
      await onUpdate(values as z.infer<typeof updateFormSchema>);
    } else {
      await onCreate(values as z.infer<typeof participantSchema>);
    }
  }
  return (
    <Form {...form}>
      {form.formState.errors.root && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Fehler</AlertTitle>
          <AlertDescription>
            {form.formState.errors.root.message}
          </AlertDescription>
        </Alert>
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="groupName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gruppen Name</FormLabel>
              <FormControl>
                <Input placeholder="Max Mustermann & Freunde..." {...field} value={field.value || ""} />
              </FormControl>
              <FormDescription>Der Name der Gruppe.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="groupSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gruppengröße</FormLabel>
              <FormControl>
                <Input
                  placeholder="1"
                  {...field}
                  type="number"
                  min="1"
                  value={field.value || ""}
                  onChange={(event) => {
                    const value = event.target.value;
                    // Allow empty string for clearing, otherwise parse as number
                    if (value === "") {
                      field.onChange(1);
                    } else {
                      const numValue = +value;
                      // Only update if it's a valid positive number
                      if (!isNaN(numValue) && numValue >= 1) {
                        field.onChange(numValue);
                      }
                    }
                  }}
                />
              </FormControl>
              <FormDescription>
                Die Anzahl der Gruppenmitglieder.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="submit"
            disabled={isSubmitting || isRemoving || form.formState.isSubmitting}
            className="w-full sm:w-auto"
          >
            {(isSubmitting || form.formState.isSubmitting) && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isUpdateMode ? "Aktualisieren" : "Anmelden"}
          </Button>
          {isUpdateMode && (
            <Button
              type="button"
              variant="destructive"
              onClick={onRemove}
              disabled={isSubmitting || isRemoving || form.formState.isSubmitting}
              className="w-full sm:w-auto"
            >
              {isRemoving && <Loader2 className="mr-2 size-4 animate-spin" />}
              {!isRemoving && <Trash2 className="mr-2 size-4" />}
              Teilnahme entfernen
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}