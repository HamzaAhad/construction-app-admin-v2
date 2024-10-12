import * as Yup from "yup";

const requiredMessage = "This field is required";
const emailMessage = "Invalid email address";
const passswodMessage = "Password must be at least 6 characters";

const invalidMessage = "Invalid email or phone number";

export const loginValidation = Yup.object().shape({
  // email: Yup.string().email(emailMessage).required(requiredMessage),
  email: Yup.string()
    .required(requiredMessage)
    .test("is-valid-email-or-phone", invalidMessage, (value) => {
      // Regular expression for validating email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Regular expression for validating phone number in the format +923472907283
      const phoneRegex = /^\+\d{12}$/; // Matches + followed by 12 digits

      return emailRegex.test(value) || phoneRegex.test(value);
    }),
  password: Yup.string().min(6, passswodMessage).required(requiredMessage),
});

export const signupValidation = Yup.object().shape({
  firstName: Yup.string().required(requiredMessage),
  lastName: Yup.string().required(requiredMessage),
  email: Yup.string().email(emailMessage).required(requiredMessage),
  password: Yup.string().min(6, passswodMessage).required(requiredMessage),
  companyName: Yup.string().required(requiredMessage),
});

export const addEmployee = Yup.object().shape({
  firstName: Yup.string().required(requiredMessage),
  lastName: Yup.string().required(requiredMessage),
  email: Yup.string().email(emailMessage),
  phone: Yup.string()
    .nullable() // allows the phone to be null
    .notRequired() // allows the phone to be optional (empty string or null)
    .matches(
      /^(\+\d+)?$/, // Allows either a phone number starting with + followed by digits or an empty string
      "Phone number must start with + and contain digits only"
    ),
});

export const addClient = Yup.object().shape({
  firstName: Yup.string().required(requiredMessage),
  lastName: Yup.string().required(requiredMessage),
  email: Yup.string().email(emailMessage).required(requiredMessage),
  companyName: Yup.string().required(requiredMessage),
});

export const category = Yup.object().shape({
  categoryName: Yup.string().required(requiredMessage),
});
