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
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { User, userUpdateSchema } from "@/domains/users/types";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

export function UserDataForm({ user }: { user: User }) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof userUpdateSchema>>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      id: user?.id,
      name: user.name || "",
    },
  });

  const router = useRouter();

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof userUpdateSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const res = await fetch(`/api/users`, {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();
    if (json.error) {
      if (res.status === 422) {
        form.setError("root", { type: "422", message: json.error });
      } else {
        form.setError("root", { type: "500" });
      }
      toast.error("Fehler beim Aktualisieren des Namens", {
        description: json.error || "Bitte versuche es erneut.",
      });
      return;
    }
    toast.success("Name erfolgreich aktualisiert", {
      description: `Dein Name wurde auf "${values.name}" geändert.`,
    });
    router.refresh();
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Max Mustermann..." {...field} />
              </FormControl>
              <FormDescription>Dein Name auf der Website.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
          Aktualisieren
        </Button>
      </form>
    </Form>
  );
}
