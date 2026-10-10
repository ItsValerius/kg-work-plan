"use client";

import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { AlertCircle, Loader2, Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateGroup } from "@/server/actions/participants";
import { updateGroupSchema, type UpdateGroupData } from "@/domains/participants/types";
import { useState, useTransition } from "react";

const formSchema = updateGroupSchema.omit({ participantId: true });

export function EditGroupDialog({
  participantId,
  currentGroupName,
  currentGroupSize,
  trigger,
}: {
  participantId: string;
  currentGroupName: string | null;
  currentGroupSize: number;
  trigger?: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<Omit<UpdateGroupData, "participantId">>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupName: currentGroupName || "",
      groupSize: currentGroupSize,
    },
  });

  async function onSubmit(values: Omit<UpdateGroupData, "participantId">) {
    startTransition(async () => {
      // A dropped connection still throws.
      const result = await updateGroup({ participantId, ...values }).catch(() => ({
        ok: false as const,
        error: "Die Gruppe konnte nicht gespeichert werden. Bitte versuche es noch einmal.",
      }));
      if (!result.ok) {
        form.setError("root", { type: "error", message: result.error });
        toast.error(result.error);
        return;
      }
      toast.success("Gruppeninformationen erfolgreich aktualisiert");
      setOpen(false);
      form.reset();
    });
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!isPending) {
      setOpen(newOpen);
      if (newOpen) {
        form.reset({
          groupName: currentGroupName || "",
          groupSize: currentGroupSize,
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          trigger || (
            <Button variant="outline" size="sm">
              <Pencil className="mr-2 size-4" />
              Bearbeiten
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gruppeninformationen bearbeiten</DialogTitle>
          <DialogDescription>
            Ändere den Gruppennamen und die Gruppengröße für diese Aufgabe.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          {form.formState.errors.root && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertTitle>Fehler</AlertTitle>
              <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="groupName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gruppenname</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Max Mustermann & Freunde..."
                      {...field}
                      value={field.value || ""}
                    />
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
                      type="number"
                      min="1"
                      {...field}
                      onChange={(event) => field.onChange(+event.target.value || 1)}
                      value={field.value || 1}
                    />
                  </FormControl>
                  <FormDescription>Die Anzahl der Gruppenmitglieder.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Abbrechen
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                Speichern
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
