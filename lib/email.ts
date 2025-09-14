import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendScanReportEmail(to: string, token: string) {
  const link = `${process.env.NEXT_PUBLIC_BASE_URL}/coa-scan/${token}`;
  const html = `
    <div style="font-family:Inter,system-ui,sans-serif">
      <h2>Your COA scan</h2>
      <p>View your result here:</p>
      <p><a href="${link}">${link}</a></p>
      <hr/>
      <p style="color:#555;font-size:12px">You’re receiving this because you requested the report in the app.</p>
    </div>`;
  await resend.emails.send({
    from: "CleanIngredients <noreply@yourdomain.com>",
    to,
    subject: "Your COA scan result",
    html,
  });
}
