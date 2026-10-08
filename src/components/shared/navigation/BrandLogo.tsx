import Link from "next/link";
import Image from "next/image";

export default function BrandLogo() {
    return (
        <Link
            href="/events"
            className="group flex items-center gap-3 shrink-0 rounded-md no-underline"
            aria-label="KG Knallköpp Golkrath Arbeitsplan – zur Startseite"
        >
            <Image
                src="/logo.png"
                alt=""
                width={44}
                height={44}
                priority
                className="size-10 md:size-11 shrink-0"
            />
            <span className="flex flex-col leading-none">
                <span className="text-[12px] font-semibold text-muted-foreground tracking-[0.01em]">
                    KG Knallköpp Golkrath
                </span>
                <span className="font-display text-[25px] md:text-[27px] font-bold leading-[1.05] tracking-[-0.02em] text-primary">
                    Arbeitsplan
                </span>
            </span>
        </Link>
    );
}
