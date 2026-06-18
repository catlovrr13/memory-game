import {
  sanitizeEmail,
  sanitizeName,
  sanitizePhoneNumber,
} from "./sanitization";
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePhoneNumber,
} from "./validation";

export const handleName = (e, warnings, setWarnings = () => {}) => {
  const sanitized = sanitizeName(e.target.value);
  const validated = validateName(sanitized);

  let tempWarnings = { ...warnings };
  tempWarnings[e.target.id] = validated;

  setWarnings(tempWarnings);

  e.target.value = sanitized;
  return tempWarnings;
};

export const handleEmail = (e, warnings, setWarnings = () => {}) => {
  const sanitized = sanitizeEmail(e.target.value);
  const validated = validateEmail(sanitized);

  let tempWarnings = { ...warnings };
  tempWarnings[e.target.id] = validated;

  setWarnings(tempWarnings);

  e.target.value = sanitized;
  return tempWarnings;
};

export const handlePhoneNumber = (e, warnings, setWarnings = () => {}) => {
  const sanitized = sanitizePhoneNumber(e.target.value);
  const validated = validatePhoneNumber(sanitized);

  let tempWarnings = { ...warnings };
  tempWarnings[e.target.id] = validated;

  setWarnings(tempWarnings);

  e.target.value = sanitized;
  return tempWarnings;
};

export const handlePassword = (e, warnings, setWarnings = () => {}) => {
  const validated = validatePassword(e.target.value);

  let tempWarnings = { ...warnings };
  tempWarnings[e.target.id] = validated;

  handlePasswordConfirm(
    {
      target: {
        value: document.getElementById("password_confirmation")?.value,
      },
    },
    tempWarnings,
    setWarnings,
  );

  setWarnings(tempWarnings);

  return tempWarnings;
};

export const handlePasswordConfirm = (e, warnings, setWarnings = () => {}) => {
  const password = document.getElementById("password");
  const confirmPassword = e.target.value;

  delete warnings.password_confirmation;

  if (password?.value !== confirmPassword) {
    warnings.password_confirmation = "Password does not match";
  }

  setWarnings({ ...warnings });

  return warnings;
};
