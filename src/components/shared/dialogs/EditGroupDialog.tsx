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
    trigger?: React.ReactNode;
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
            try {
                await updateGroup({
                    participantId,
                    ...values,
                });
                toast.success("Gruppeninformationen erfolgreich aktualisiert");
                setOpen(false);
                form.reset();
            } catch (error) {
                if (error instanceof Error) {
                    form.setError("root", { type: "error", message: error.message });
                    toast.error(error.message);
                } else {
                    form.setError("root", {
                        type: "error",
                        message: "Fehler beim Aktualisieren der Gruppeninformationen",
                    });
                    toast.error("Fehler beim Aktualisieren der Gruppeninformationen");
                }
            }
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
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm">
                        <Pencil className="size-4 mr-2" />
                        Bearbeiten
                    </Button>
                )}
            </DialogTrigger>
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
                            <AlertDescription>
                                {form.formState.errors.root.message}
                            </AlertDescription>
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
                                            onChange={(event) =>
                                                field.onChange(+event.target.value || 1)
                                            }
                                            value={field.value || 1}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Die Anzahl der Gruppenmitglieder.
                                    </FormDescription>
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
