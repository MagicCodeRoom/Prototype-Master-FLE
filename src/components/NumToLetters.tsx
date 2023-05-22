export const numToLetter: (num: number) => string = (num) => {
  const words = [
      "", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf",
      "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize"
  ];

  const dizaines = [
      "vingt", "trente", "quarante", "cinquante", "soixante", "soixante", "quatre-vingt", "quatre-vingt"
  ];

  if (num === 0) {
      return "zéro";
  }

  if (num < 17) {
      return words[num];
  }

  if (num < 20) {
      return "dix-" + words[num - 10];
  }

  if (num < 100) {
      const ones = num % 10;
      const tens = Math.floor(num / 10) - 2;
      let tens_word = dizaines[tens];
      let ones_word = "";
      if (tens === 5 || tens === 7) {
          if (ones < 7) {
              ones_word = "-" + words[ones + 10];
          } else {
              ones_word = "-" + numToLetter(ones);
          }
      } else {
          ones_word = words[ones];
      }
      const hyphen = ones > 0 && (tens !== 5 && tens !== 7) ? "-" : "";
      return tens_word + hyphen + ones_word;
  }

  if (num < 1000) {
      const hundreds = Math.floor(num / 100);
      const remainder = num % 100;
      const plural = hundreds > 1 ? "s" : "";
      const word = hundreds === 1 ? "cent" : words[hundreds] + " cent" + plural;
      if (remainder === 0) {
          return word;
      }
      return word + " " + numToLetter(remainder);
  }

  if (num === 1000) {
      return "mille";
  }

  return "Nombre trop grand";
}

