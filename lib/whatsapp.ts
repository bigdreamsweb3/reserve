/**
 * Builds a WhatsApp click-to-chat URL for order notifications.
 * `phoneDigits` should be digits only, country code included, e.g. "2348012345678".
 */
export function buildWhatsAppUrl(phoneDigits: string, message: string) {
  const cleaned = phoneDigits.replace(/\D/g, "");
  if (!cleaned) {
    return null;
  }

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleaned}?text=${encoded}`;
}

export function getPublicOrderWhatsAppDigits() {
  const raw = process.env.NEXT_PUBLIC_RESERVE_WHATSAPP ?? "";
  return raw.replace(/\D/g, "");
}
