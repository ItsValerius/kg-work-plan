"use client";

import { z } from "zod";

// Form validation runs in the browser, so its messages must be German there.
z.config(z.locales.de());

export function ZodLocale() {
  return null;
}
