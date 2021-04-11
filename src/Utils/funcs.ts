export const splitCamelCase = (word: string): string => {
  const regex = /[A-Z]/;

  const output = [];

  for (let i = 0; i < word.length; i += 1) {
    if (i === 0) {
      output.push(word[i].toUpperCase());
    } else {
      if (i > 0 && regex.test(word[i])) {
        output.push(" ");
      }
      output.push(word[i]);
    }
  }

  return output.join("");
};
