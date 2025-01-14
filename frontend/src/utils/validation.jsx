
export const validateInput = (field, value, rules) => {
  if (!value) return "This field is required";
  if (rules.min && value.length < rules.min) return `Minimum ${rules.min} characters required`;
  if (rules.max && value.length > rules.max) return `Maximum ${rules.max} characters allowed`;
  return "";
};