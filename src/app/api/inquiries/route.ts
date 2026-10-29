import { Resend } from "resend";
import { PROFILE } from "@/lib/data";

type Inquiry = {
  name: string;
  email: string;
  phone: string;
  description: string;
  website: string;
};

type EmailMessage = {
  from: string;
  to: string[];
  replyTo: string[];
  subject: string;
  html: string;
  text: string;
};

type EmailSendResult =
  | { ok: true }
  | { ok: false; error: string };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+()\d\s.-]{7,32}$/;
const configurationError =
  "Email is not configured. Add RESEND_API_KEY and RESEND_FROM_EMAIL to .env.local (or your hosting environment), then restart the server. The sender must use a verified Resend domain.";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function validateInquiry(value: unknown): Inquiry | null {
  if (!isRecord(value)) return null;

  const { name, email, phone, description, website } = value;
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof phone !== "string" ||
    typeof description !== "string" ||
    typeof website !== "string"
  ) {
    return null;
  }

  const inquiry = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    description: description.trim(),
    website: website.trim(),
  };

  if (
    inquiry.name.length < 2 ||
    inquiry.name.length > 100 ||
    /[\r\n<>]/.test(inquiry.name) ||
    inquiry.email.length > 254 ||
    !emailPattern.test(inquiry.email) ||
    !phonePattern.test(inquiry.phone) ||
    (inquiry.phone.match(/\d/g)?.length ?? 0) < 7 ||
    inquiry.description.length < 10 ||
    inquiry.description.length > 4000
  ) {
    return null;
  }

  return inquiry;
}

function createOwnerMessage(
  inquiry: Inquiry,
  fromAddress: string
): EmailMessage {
  const name = escapeHtml(inquiry.name);
  const email = escapeHtml(inquiry.email);
  const phone = escapeHtml(inquiry.phone);
  const description = escapeHtml(inquiry.description).replace(/\n/g, "<br>");

  return {
    from: fromAddress,
    to: [PROFILE.email],
    replyTo: [inquiry.email],
    subject: `Portfolio enquiry from ${inquiry.name}`,
    html: `
      <div style="background:#f4f2ee;padding:32px;font-family:Arial,sans-serif;color:#171512">
        <div style="max-width:620px;margin:0 auto;background:#fffdf8;border:1px solid #171512;padding:32px">
          <p style="color:#df755d;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase">New portfolio enquiry</p>
          <h1 style="font-size:26px;margin:12px 0 24px">A new conversation is waiting.</h1>
          <p><strong>Name</strong><br>${name}</p>
          <p><strong>Email</strong><br><a href="mailto:${email}" style="color:#c45f49">${email}</a></p>
          <p><strong>Mobile number</strong><br>${phone}</p>
          <p><strong>What they would like to discuss</strong></p>
          <div style="background:#f4f2ee;padding:16px;line-height:1.7">${description}</div>
        </div>
      </div>`,
    text: [
      "New portfolio enquiry",
      "",
      `Name: ${inquiry.name}`,
      `Email: ${inquiry.email}`,
      `Mobile number: ${inquiry.phone}`,
      "",
      "What they would like to discuss:",
      inquiry.description,
    ].join("\n"),
  };
}

function createVisitorMessage(
  inquiry: Inquiry,
  fromAddress: string,
  replyAddress: string
): EmailMessage {
  const name = escapeHtml(inquiry.name);
  const description = escapeHtml(inquiry.description).replace(/\n/g, "<br>");

  return {
    from: fromAddress,
    to: [inquiry.email],
    replyTo: [replyAddress],
    subject: "Thanks for starting a conversation",
    html: `
      <div style="background:#f4f2ee;padding:32px;font-family:Arial,sans-serif;color:#171512">
        <div style="max-width:620px;margin:0 auto;background:#fffdf8;border:1px solid #171512;padding:32px">
          <p style="color:#df755d;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase">Your message made it</p>
          <h1 style="font-size:28px;line-height:1.2;margin:12px 0 18px">Thanks for reaching out, ${name}.</h1>
          <p style="color:#5f5a52;line-height:1.7">I appreciate you sharing a little about what you have in mind. Your enquiry is in my inbox, and I&apos;ll be in touch as soon as I can.</p>
          <div style="margin-top:24px;border-left:3px solid #df755d;background:#f4f2ee;padding:16px;line-height:1.7">${description}</div>
          <p style="margin-top:28px">Looking forward to the conversation,<br><strong>${PROFILE.name}</strong></p>
        </div>
      </div>`,
    text: [
      `Thanks for reaching out, ${inquiry.name}.`,
      "",
      "I appreciate you sharing a little about what you have in mind. Your enquiry is in my inbox, and I'll be in touch as soon as I can.",
      "",
      "Your message:",
      inquiry.description,
      "",
      `Looking forward to the conversation,`,
      PROFILE.name,
    ].join("\n"),
  };
}

async function sendResendEmail(
  resend: Resend,
  message: EmailMessage
): Promise<EmailSendResult> {
  try {
    const { error } = await resend.emails.send(message);

    if (error) {
      console.error(`Resend failed to send an enquiry email: ${error.message}`);
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected network error.";
    console.error(
      "Could not connect to Resend:",
      message
    );
    return { ok: false, error: message };
  }
}

function isUnverifiedDomainError(message: string) {
  return /domain.{0,30}(not verified|unverified)|not verified.{0,30}domain/i.test(
    message
  );
}

function getUnverifiedDomainMessage(senderAddress: string) {
  const senderDomain = senderAddress.split("@")[1];
  const domain = senderDomain ? ` ${senderDomain}` : "";
  return `Resend has not verified the sender domain${domain}. Add it in Resend, publish the DNS records Resend provides at your domain registrar, and wait for verification. Then set RESEND_FROM_EMAIL to an address on that verified domain and restart or redeploy the app. No enquiry email was sent.`;
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > 16_384) {
    return Response.json(
      { error: "The enquiry is too long. Please shorten it and try again." },
      { status: 413 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "The enquiry form data is invalid." }, { status: 400 });
  }

  if (isRecord(body) && typeof body.website === "string" && body.website.trim()) {
    return Response.json(
      { error: "This enquiry could not be accepted." },
      { status: 400 }
    );
  }

  const inquiry = validateInquiry(body);
  if (!inquiry) {
    return Response.json(
      { error: "Please check your details and try again." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY?.trim() ?? "";
  const fromAddress = process.env.RESEND_FROM_EMAIL?.trim() ?? "";
  const replyAddress = process.env.CONTACT_REPLY_EMAIL?.trim() || PROFILE.email;
  const senderAddress = fromAddress.match(/<([^<>]+)>/)?.[1]?.trim() || fromAddress;

  const missingConfiguration: string[] = [];
  if (
    !apiKey.startsWith("re_") ||
    apiKey === "re_your_resend_api_key"
  ) {
    missingConfiguration.push("RESEND_API_KEY");
  }
  if (
    !emailPattern.test(senderAddress) ||
    /[\r\n]/.test(fromAddress)
  ) {
    missingConfiguration.push("RESEND_FROM_EMAIL");
  }
  if (!emailPattern.test(replyAddress)) {
    missingConfiguration.push("CONTACT_REPLY_EMAIL");
  }

  if (
    missingConfiguration.length > 0
  ) {
    console.error(
      `Inquiry email configuration is incomplete: ${missingConfiguration.join(", ")}.`
    );
    return Response.json(
      { error: configurationError },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);
  const ownerEmail = await sendResendEmail(
    resend,
    createOwnerMessage(inquiry, fromAddress)
  );

  if (!ownerEmail.ok) {
    if (isUnverifiedDomainError(ownerEmail.error)) {
      return Response.json(
        { error: getUnverifiedDomainMessage(senderAddress) },
        { status: 503 }
      );
    }

    console.error("Resend could not deliver the owner enquiry email.");
    return Response.json(
      {
        error:
          "Resend could not deliver your enquiry to Jatin. Please try again shortly.",
      },
      { status: 502 }
    );
  }

  const visitorEmail = await sendResendEmail(
    resend,
    createVisitorMessage(inquiry, fromAddress, replyAddress)
  );

  if (!visitorEmail.ok) {
    if (isUnverifiedDomainError(visitorEmail.error)) {
      return Response.json(
        {
          error: `Your enquiry reached Jatin, but Resend could not send the confirmation because the sender domain is not verified. ${getUnverifiedDomainMessage(senderAddress)}`,
        },
        { status: 502 }
      );
    }

    console.error("Resend could not deliver the visitor confirmation email.");
    return Response.json(
      {
        error:
          "Your enquiry reached Jatin, but the confirmation email could not be delivered. Please check your inbox for a reply.",
      },
      { status: 502 }
    );
  }

  return Response.json({ success: true });
}
