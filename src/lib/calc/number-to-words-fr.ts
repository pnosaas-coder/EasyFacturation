/**
 * Conversion de nombres entiers en toutes lettres en français
 * Règles spécifiques :
 * - "mille" est invariable (jamais de 's')
 * - "cent" prend un 's' si multiplié et non suivi (deux cents, deux cent dix)
 * - "quatre-vingts" prend un 's' si non suivi (quatre-vingts, quatre-vingt-deux)
 * - "et un" pour 21, 31, 41, 51, 61, 71
 */

const UNITS = [
  "",
  "un",
  "deux",
  "trois",
  "quatre",
  "cinq",
  "six",
  "sept",
  "huit",
  "neuf",
  "dix",
  "onze",
  "douze",
  "treize",
  "quatorze",
  "quinze",
  "seize",
  "dix-sept",
  "dix-huit",
  "dix-neuf",
];

const TENS = [
  "",
  "dix",
  "vingt",
  "trente",
  "quarante",
  "cinquante",
  "soixante",
  "soixante-dix",
  "quatre-vingt",
  "quatre-vingt-dix",
];

function convertBelowThousand(n: number): string {
  if (n === 0) return "";

  let result = "";

  const hundreds = Math.floor(n / 100);
  const remainder = n % 100;

  if (hundreds > 0) {
    if (hundreds === 1) {
      result += "cent";
    } else {
      result += UNITS[hundreds] + " cent";
      if (remainder === 0) {
        result += "s";
      }
    }
    if (remainder > 0) result += " ";
  }

  if (remainder > 0) {
    if (remainder < 20) {
      result += UNITS[remainder];
    } else if (remainder < 70) {
      const ten = Math.floor(remainder / 10);
      const unit = remainder % 10;
      if (unit === 1) {
        result += TENS[ten] + " et un";
      } else if (unit > 1) {
        result += TENS[ten] + "-" + UNITS[unit];
      } else {
        result += TENS[ten];
      }
    } else if (remainder < 80) {
      const unit = remainder - 60;
      if (unit === 11) {
        result += "soixante et onze";
      } else {
        result += "soixante-" + UNITS[unit];
      }
    } else if (remainder < 100) {
      const isNinety = remainder >= 90;
      const unit = isNinety ? remainder - 80 : remainder - 80;

      if (remainder === 80) {
        result += "quatre-vingts";
      } else if (isNinety) {
        result += "quatre-vingt-" + UNITS[remainder - 80];
      } else {
        result += "quatre-vingt-" + UNITS[unit];
      }
    }
  }

  return result;
}

export function numberToWordsFr(amount: number): string {
  if (amount === 0) return "zéro franc CFA";

  const absAmount = Math.floor(Math.abs(amount));

  const billions = Math.floor(absAmount / 1_000_000_000);
  const millions = Math.floor((absAmount % 1_000_000_000) / 1_000_000);
  const thousands = Math.floor((absAmount % 1_000_000) / 1_000);
  const remainder = absAmount % 1_000;

  const parts: string[] = [];

  if (billions > 0) {
    parts.push(convertBelowThousand(billions) + (billions > 1 ? " milliards" : " milliard"));
  }

  if (millions > 0) {
    parts.push(convertBelowThousand(millions) + (millions > 1 ? " millions" : " million"));
  }

  if (thousands > 0) {
    if (thousands === 1) {
      parts.push("mille");
    } else {
      parts.push(convertBelowThousand(thousands) + " mille");
    }
  }

  if (remainder > 0) {
    parts.push(convertBelowThousand(remainder));
  }

  const words = parts.join(" ").trim();
  return `Arrêtée la présente facture à la somme de ${words} francs CFA`;
}
