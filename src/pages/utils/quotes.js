export const QUOTES = [
  "The future depends on what you do today.",
  "Well done is better than well said.",
  "It always seems impossible until it's done.",
  "Don’t watch the clock; do what it does. Keep going.",
  "Success usually comes to those who are too busy to be looking for it.",
  "Quality is not an act, it is a habit.",
  "Great things are done by a series of small things brought together.",
];

export function getRandomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}
