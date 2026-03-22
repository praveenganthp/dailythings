/**
 * Enhanced Sanitization Utility
 * Strictly prevents HTML tag injections, <script> patterns, and provides validation.
 */

// Returns true if the text CONTAINS any HTML tags like <script> or <br>
export const containsHtml = (text: string): boolean => {
  if (!text) return false;
  // Regex looks for anything matching <tag>, </tag>, or <tag/>
  const htmlRegex = /<\/?[a-z][\s\S]*>/i;
  // Also block explicit JS patterns
  const unsafePatterns = /javascript:|eval\(|onload=|onerror=/i;
  return htmlRegex.test(text) || unsafePatterns.test(text);
};

export const sanitizeInput = (text: string): string => {
  if (!text) return "";
  // Strip tags and trim
  return text.replace(/<\/?[^>]+(>|$)/g, "").trim();
};

export const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const hasImproperContent = (text: string): boolean => {
  if (!text) return false;
  return containsHtml(text);
};
