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
import { userUpdateSchema } from "@/domains/users/types";
import { Suspense, use, useEffect } from "react";
import { useForm, type ControllerRenderProps, type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { updateProfile } from "@/server/actions/users";

type ProfileValues = z.infer<typeof userUpdateSchema>;
/** Null while the visitor is signed out; the page redirects them. */
type ProfileUser = Promise<{ id: string; name: string } | null>;

/**
 * The form renders right away; only the name input waits for the session, so the label,
 * hint and button are part of the page's static shell.
 */
export function UserDataForm({ user }: { user: ProfileUser }) {
  // 1. Define your form.
  const form = useForm<ProfileValues>({
    resolver: zodResolver(userUpdateSchema),
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof userUpdateSchema>) {
    const result = await updateProfile(values).catch(() => ({
      ok: false as const,
      error: "Dein Profil konnte nicht gespeichert werden. Bitte versuch es noch einmal.",
    }));
    if (!result.ok) {
      form.setError("root", { message: result.error });
      toast.error("Fehler beim Aktualisieren des Namens", { description: result.error });
      return;
    }
    toast.success("Name erfolgreich aktualisiert", {
      description: values.name
        ? `Dein Name wurde auf "${values.name}" geändert.`
        : "Dein Name wird nicht mehr angezeigt.",
    });
  }
  return (
    <Form {...form}>
      {form.formState.errors.root && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Fehler</AlertTitle>
          <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
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
                <NameInput field={field} form={form} user={user} />
              </FormControl>
              <FormDescription>
                Dein Name auf der Website. Lass das Feld leer, wenn er nicht angezeigt werden soll.
              </FormDescription>
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

type NameInputProps = Omit<React.ComponentProps<"input">, "form"> & {
  field: ControllerRenderProps<ProfileValues, "name">;
  form: UseFormReturn<ProfileValues>;
  user: ProfileUser;
};

/** Gets FormControl's id and aria props and passes them on to whichever input shows. */
function NameInput({ field, form, user, ...props }: NameInputProps) {
  return (
    <Suspense fallback={<Input placeholder="Max Mustermann..." disabled {...props} />}>
      <LoadedNameInput field={field} form={form} user={user} {...props} />
    </Suspense>
  );
}

function LoadedNameInput({ field, form, user, ...props }: NameInputProps) {
  const profile = use(user);

  useEffect(() => {
    if (!profile) return;
    form.setValue("id", profile.id);
    form.resetField("name", { defaultValue: profile.name });
  }, [form, profile]);

  if (!profile) return <Input placeholder="Max Mustermann..." disabled {...props} />;
  return (
    <Input
      placeholder="Max Mustermann..."
      {...props}
      {...field}
      // Until the effect above runs (and in the server HTML) the form has no value yet.
      value={field.value ?? profile.name}
    />
  );
}
