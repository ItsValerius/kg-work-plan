"use client";

import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Calendar } from "../ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { duplicateEvent } from "@/app/events/actions";
import { useRouter } from "next/navigation";

const duplicateSchema = z.object({
    name: z.string().min(1, "Name ist erforderlich"),
    startDate: z.date({
        required_error: "Startdatum ist erforderlich",
    }),
    endDate: z.date({
        required_error: "Enddatum ist erforderlich",
    }),
}).refine((data) => data.endDate >= data.startDate, {
    message: "Enddatum muss nach dem Startdatum liegen",
    path: ["endDate"],
});

type DuplicateFormValues = z.infer<typeof duplicateSchema>;


export function DuplicateEventDialog({
    eventId,
    defaultName,
    defaultStartDate,
    defaultEndDate,
    trigger,
}: {
    eventId: string;
    defaultName: string;
    defaultStartDate: Date;
    defaultEndDate: Date;
    trigger: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const defaultDates = useMemo(() => {
        const oneYearMs = 365 * 24 * 60 * 60 * 1000;
        return {
            startDate: new Date(defaultStartDate.getTime() + oneYearMs),
            endDate: new Date(defaultEndDate.getTime() + oneYearMs),
        };
    }, [defaultStartDate, defaultEndDate]);

    const form = useForm<DuplicateFormValues>({
        resolver: zodResolver(duplicateSchema),
        defaultValues: {
            name: defaultName,
            ...defaultDates,
        },
    });

    async function onSubmit(values: DuplicateFormValues) {
        setLoading(true);
        try {
            await duplicateEvent(eventId, values.name, values.startDate, values.endDate);
            setOpen(false);
            router.refresh();
        } catch {
            setLoading(false);
        }
    }

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        setLoading(false);
        form.reset({
            name: defaultName,
            ...defaultDates,
        });
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Veranstaltung duplizieren</DialogTitle>
                    <DialogDescription>
                        Geben Sie den Namen und die Daten für die neue Veranstaltung ein.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Veranstaltungsname</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Biwak..." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Der Name der neuen Veranstaltung.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Startdatum</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className={cn(
                                                        "w-[240px] pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP", { locale: de })
                                                    ) : (
                                                        <span>Wähle ein Datum</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value ?? undefined}
                                                onSelect={field.onChange}
                                                defaultMonth={field.value ?? defaultDates.startDate}
                                                locale={de}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormDescription>
                                        Das Startdatum der neuen Veranstaltung.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Enddatum</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className={cn(
                                                        "w-[240px] pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP", { locale: de })
                                                    ) : (
                                                        <span>Wähle ein Datum</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value ?? undefined}
                                                onSelect={field.onChange}
                                                defaultMonth={field.value ?? defaultDates.endDate}
                                                locale={de}
                                                disabled={(date) => {
                                                    const startDate = form.watch("startDate");
                                                    return startDate ? date < startDate : false;
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormDescription>
                                        Das Enddatum der neuen Veranstaltung.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleOpenChange(false)}
                                disabled={loading}
                            >
                                Abbrechen
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Duplizieren...
                                    </>
                                ) : (
                                    "Duplizieren"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
