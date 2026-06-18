export const sanitizeName = (value) => {
  let name = (value ?? "").trim();

  name = name.replace(/[\-]{2,}/g, "-");
  name = name.replace(/[\']{2,}/g, "'");

  name = name
    .split("-")
    .map((w) =>
      w
        .split(" ")
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
        .join(" "),
    ).join("-");
  return name;
};


export const sanitizeEmail = (value) => { 
    let email = (value ?? "").trim()

    email = email.replace(/[@]{2,}/g, "@")
    email = email.replace(/[.]{2,}/g, ".")
    email = email.replace(/[@]$/g, "")
    email = email.replace(/^[@]/g, "")

    return email
 }

 export const sanitizePhoneNumber = (value) => {
    let number = (value ?? "").trim()

    number = number.replace(/[^\d\+]/g, "")
    number = number.replace(/[\+]{2,}/g, "+")
    number = number.replace(/[\+]$/g, "")

    return number
  }