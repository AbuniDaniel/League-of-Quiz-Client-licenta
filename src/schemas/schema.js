import * as yup from "yup";

const passwordRules = /^(?=.*\d)(?=.*[A-Z]).{6,}$/;
const usernameRules = /^[a-zA-Z0-9]+$/;

export const schema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Required"),
  username: yup
    .string()
    .required("Required")
    .min(4)
    .max(14)
    .matches(usernameRules, {
      message:
        "Usernames can contain only letters (a-Z) and numbers (0-9)",
    }),
  password: yup
    .string()
    .min(6)
    .matches(passwordRules, {
      message:
        "Password must contain at least 1 uppercase character and 1 number",
    })
    .required("Required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});
