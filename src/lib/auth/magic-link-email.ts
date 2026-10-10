/**
 * The sign-in email. Mail clients support only a fraction of CSS, so this sticks to
 * what renders everywhere (Outlook, Gmail, Apple Mail): nested tables, inline styles,
 * bgcolor attributes, system fonts and a table-cell button. Colors are the club palette.
 */

const C = {
  green: "#176717",
  ink: "#17251c",
  muted: "#5b685e",
  wash: "#f5f7f2",
  line: "#dce3d9",
  white: "#ffffff",
};

const FONT = "Arial, Helvetica, sans-serif";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function renderMagicLinkEmail({
  url,
  baseUrl,
  minutesValid,
}: {
  url: string;
  baseUrl: string;
  minutesValid: number;
}) {
  const link = escapeHtml(url);
  const logo = escapeHtml(`${baseUrl.replace(/\/$/, "")}/logo.png`);
  const subject = "Dein Anmeldelink für den Arbeitsplan";
  const preheader = `Ein Klick genügt – der Link ist ${minutesValid} Minuten gültig.`;

  const text = [
    "Hallo!",
    "",
    "Hier ist dein Anmeldelink für den Arbeitsplan der KG Knallköpp Golkrath:",
    "",
    url,
    "",
    `Der Link ist ${minutesValid} Minuten gültig und funktioniert nur einmal.`,
    "Falls du dich nicht anmelden wolltest, kannst du diese E-Mail einfach ignorieren.",
    "",
    "KG Knallköpp Golkrath e.V.",
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:${C.wash};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.wash};">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.wash}" style="background-color:${C.wash};">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
        <tr>
          <td style="padding:0 4px 20px 4px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding-right:12px;" valign="middle">
                  <img src="${logo}" width="52" height="52" alt="KG Knallköpp Golkrath" style="display:block;border:0;width:52px;height:52px;">
                </td>
                <td valign="middle" style="font-family:${FONT};">
                  <div style="font-size:12px;line-height:16px;font-weight:bold;color:${C.muted};">KG Knallköpp Golkrath</div>
                  <div style="font-size:24px;line-height:28px;font-weight:bold;color:${C.green};letter-spacing:-0.5px;">Arbeitsplan</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td bgcolor="${C.white}" style="background-color:${C.white};border:1px solid ${C.line};border-radius:12px;padding:32px 28px;font-family:${FONT};">
            <h1 style="margin:0 0 12px 0;font-family:${FONT};font-size:28px;line-height:32px;font-weight:bold;color:${C.ink};">Hier ist dein Anmeldelink</h1>
            <p style="margin:0 0 28px 0;font-size:17px;line-height:26px;color:${C.ink};">Tipp auf den Knopf, dann bist du angemeldet und kannst dich für Aufgaben eintragen. Ein Passwort brauchst du nicht.</p>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td bgcolor="${C.green}" style="background-color:${C.green};border-radius:6px;">
                  <a href="${link}" target="_blank" style="display:inline-block;padding:15px 30px;font-family:${FONT};font-size:17px;line-height:20px;font-weight:bold;color:${C.white};text-decoration:none;border-radius:6px;">Jetzt anmelden</a>
                </td>
              </tr>
            </table>
            <p style="margin:24px 0 0 0;font-size:15px;line-height:22px;color:${C.muted};">Der Link ist <strong style="color:${C.ink};">${minutesValid} Minuten</strong> gültig und funktioniert nur einmal.</p>
            <p style="margin:24px 0 6px 0;padding-top:20px;border-top:1px solid ${C.line};font-size:14px;line-height:20px;color:${C.muted};">Der Knopf funktioniert nicht? Kopiere diesen Link in deinen Browser:</p>
            <p style="margin:0;font-size:14px;line-height:20px;word-break:break-all;"><a href="${link}" target="_blank" style="color:${C.green};text-decoration:underline;">${link}</a></p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 4px 0 4px;font-family:${FONT};font-size:14px;line-height:20px;color:${C.muted};">
            Falls du dich nicht anmelden wolltest, kannst du diese E-Mail einfach ignorieren.<br>
            KG Knallköpp Golkrath e.V.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;

  return { subject, text, html };
}
