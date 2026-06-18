let disposableDomains = [];

fetch("/disposable_email_blocklist.conf")
  .then((res) => res.text())
  .then((domain) => (disposableDomains = domain.split("\n")));

export const validateName = (value) => {
  let name = value;

  if (!name) return "Name is required";

  if (name.length > 255) return "Name should not exceed 255 characters.";

  if (/^[^a-zA-Z]/g.test(name) || /[^a-zA-Z]$/g.test(name)) {
    return "Name must start and end with a letter.";
  }

  if (/[\d]+/g.test(name)) {
    return "Name must not contain any numbers.";
  }
};

export const validateEmail = (value) => {
  let email = value;

  if (!email) return "Email is required";

  if (email.length > 255) return "Email should not exceed 255 characters.";

  if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+.{2,}$/.test(email)) {
    return "Email should be a valid email address.";
  }

  const domain = email.split("@");
  if (disposableDomains.includes(domain[1].toLowerCase())) {
    return "Disposable domains are not allowed.";
  }
};

export const validatePhoneNumber = (value) => {
  let number = value;
  if (!number) return "Phone Number is required";

  if (!/^(?:\+63|0)9\d{9}$/g.test(number)) {
    return "Phone number should be a valid Philippine (PH) phone number.";
  }
};

export const validatePassword = (value) => {
  let password = value;

  if (!password) return "Password is required";

  if (password.length > 255)
    return "Password should not exceed 255 characters.";
  if (password.length < 8) return "Password should be atleast 8 characters.";

  if (!/^(?=.*[^a-zA-Z0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(password)) {
    return "Password must contain: Special Character, Uppercase letter, Lowercase letter, and a Number";
  }

  const unique = [...new Set(password)];
  if (unique.length < 5) {
    return "Password should have atleast 5 unique characters.";
  }
};
