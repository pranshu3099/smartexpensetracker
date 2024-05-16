const regexPatterns = {
  emailRegex: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  nameRegex: /^[a-zA-Z]+(?:[' -][a-zA-Z]+)*$/,
  passwordRegex: /^.{8,10}$/,
};

export default regexPatterns;
