import Link from "next/link";
import Image from "next/image";

export default function BrandLogo() {
  return (
    <Link
      href="/veranstaltungen"
      className="group flex shrink-0 items-center gap-3 rounded-md no-underline"
      aria-label="KG Knallköpp Golkrath Arbeitsplan – zur Startseite"
    >
      <Image
        src="/logo.png"
        alt=""
        width={44}
        height={44}
        priority
        className="size-10 shrink-0 md:size-11"
      />
      <span className="flex flex-col leading-none">
        <span className="text-[12px] font-semibold tracking-[0.01em] text-muted-foreground">
          KG Knallköpp Golkrath
        </span>
        <span className="font-display text-[25px] leading-[1.05] font-bold tracking-[-0.02em] text-primary md:text-[27px]">
          Arbeitsplan
        </span>
      </span>
    </Link>
  );
}
