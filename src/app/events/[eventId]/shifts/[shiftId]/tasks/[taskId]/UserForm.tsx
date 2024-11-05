"use client";

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
import { taskParticipants } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema } from "drizzle-zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = createInsertSchema(taskParticipants).extend({
  groupName: z.string().optional(),
  groupSize: z.number().optional(),
});
export function UserForm({
  userId,
  taskId,
  shiftId,
  eventId,
}: {
  userId: string;
  taskId: string;
  shiftId: string;
  eventId: string;
}) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupName: "",
      groupSize: 1,
      createdById: userId,
      taskId: taskId,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const res = await fetch(
      `/api/events/${eventId}/shifts/${shiftId}/tasks/${taskId}/users`,
      {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const json = await res.json();
    console.log(json);
    if (json.error) {
      if (res.status === 422) {
        form.setError("root", { type: "422", message: json.error });
      } else {
        form.setError("root", { type: "500" });
      }
    }
  }
  return (
    <Form {...form}>
      {form.formState.errors.root && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
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
                <Input placeholder="Max Mustermann & Freunde..." {...field} />
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
                  onChange={(event) => field.onChange(+event.target.value)}
                />
              </FormControl>
              <FormDescription>
                Die Anzahl der Gruppenmitglieder.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
          Anmelden
        </Button>
      </form>
    </Form>
  );
}
