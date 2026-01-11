import Link from "next/link";
import Image from "next/image";

export default function BrandLogo() {
    return (
        <Link
            href="/events"
            className="flex items-center space-x-1 sm:space-x-2 font-bold shrink-0"
        >
            <Image
                src="/logo.png"
                alt="KG Arbeitsplan Logo"
                width={20}
                height={20}
                className="size-5 shrink-0"
            />
            <span className="hidden sm:inline-block whitespace-nowrap">KG Knallköpp Golkrath Arbeitsplan</span>
        </Link>
    );
}

