import { FormData } from "./types";

export type FieldErrors = Partial<Record<keyof FormData, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\(\d{3}\) \d{3}-\d{4}$/;
const SSN_REGEX = /^\d{3}-\d{2}-\d{4}$/;
const EIN_REGEX = /^\d{2}-\d{7}$/;
const ZIP_REGEX = /^\d{5}(-\d{4})?$/;
const URL_REGEX = /^https?:\/\/[a-zA-Z0-9]([a-zA-Z0-9-]*\.)+[a-zA-Z]{2,}/;
const ROUTING_REGEX = /^\d{9}$/;

// Valid US state and territory codes
const VALID_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN",
  "IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV",
  "NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN",
  "TX","UT","VT","VA","WA","WV","WI","WY","DC","PR","VI","GU","AS","MP",
];

/**
 * Validate SSN against SSA rules:
 * - Area number (first 3 digits): cannot be 000, 666, or 900-999
 * - Group number (middle 2 digits): cannot be 00
 * - Serial number (last 4 digits): cannot be 0000
 */
function isValidSSN(ssn: string): boolean {
  const parts = ssn.split("-");
  if (parts.length !== 3) return false;
  const area = parseInt(parts[0], 10);
  const group = parseInt(parts[1], 10);
  const serial = parseInt(parts[2], 10);
  if (area === 0 || area === 666 || area >= 900) return false;
  if (group === 0) return false;
  if (serial === 0) return false;
  return true;
}

/**
 * Validate EIN against IRS rules:
 * - First two digits cannot be 00
 * - Valid prefix ranges (01-99 except 00)
 */
function isValidEIN(ein: string): boolean {
  const parts = ein.split("-");
  if (parts.length !== 2) return false;
  const prefix = parseInt(parts[0], 10);
  const suffix = parseInt(parts[1], 10);
  if (prefix === 0) return false;
  if (suffix === 0) return false;
  return true;
}

/**
 * Validate ABA routing number checksum.
 * Algorithm: 3*(d1+d4+d7) + 7*(d2+d5+d8) + (d3+d6+d9) must be divisible by 10
 */
function isValidRoutingNumber(routing: string): boolean {
  if (!ROUTING_REGEX.test(routing)) return false;
  const digits = routing.split("").map(Number);
  const sum = 3 * (digits[0] + digits[3] + digits[6]) +
              7 * (digits[1] + digits[4] + digits[7]) +
              (digits[2] + digits[5] + digits[8]);
  return sum % 10 === 0;
}

export type FieldRequirements = Record<string, boolean>;

export const DEFAULT_FIELD_REQUIREMENTS: FieldRequirements = {
  ownerName: true,
  ownerEmail: true,
  ownerPhone: true,
  ownerDOB: true,
  ssn: true,
  ownerAddress: true,
  ownerCity: true,
  ownerState: true,
  ownerZip: true,
  businessName: true,
  dba: false,
  businessType: true,
  industry: true,
  ein: true,
  website: false,
  yearsInBusiness: true,
  businessAddress: true,
  businessCity: true,
  businessState: true,
  businessZip: true,
  monthlyVolume: true,
  avgTicket: true,
  highestTicket: true,
  currentProcessor: false,
  monthsProcessing: true,
  chargebackRate: false,
  previousIssues: false,
  bankName: true,
  bankRouting: true,
  bankAccount: true,
  bankAccountType: true,
  productDescription: true,
  deliveryMethod: true,
  refundPolicy: true,
  acquisitionMethods: true,
};

function isRequired(field: string, customRequirements?: FieldRequirements): boolean {
  if (!customRequirements) return DEFAULT_FIELD_REQUIREMENTS[field] ?? false;
  if (field in customRequirements) return customRequirements[field];
  return DEFAULT_FIELD_REQUIREMENTS[field] ?? false;
}

export function validateStep(
  step: number,
  data: FormData,
  customRequirements?: FieldRequirements
): FieldErrors {
  switch (step) {
    case 0:
      return validateAboutYou(data, customRequirements);
    case 1:
      return validateBusiness(data, customRequirements);
    case 2:
      return validateProcessing(data, customRequirements);
    case 3:
      return validateBanking(data, customRequirements);
    case 4:
      return validateProducts(data, customRequirements);
    case 5:
      return validateDocuments(data, customRequirements);
    default:
      return {};
  }
}

function validateAboutYou(data: FormData, customRequirements?: FieldRequirements): FieldErrors {
  const errors: FieldErrors = {};

  if (isRequired('ownerName', customRequirements)) {
    if (!data.ownerName.trim()) {
      errors.ownerName = "Full name is required";
    } else if (data.ownerName.trim().length < 2) {
      errors.ownerName = "Please enter a valid name";
    }
  }

  if (isRequired('ownerEmail', customRequirements)) {
    if (!data.ownerEmail.trim()) {
      errors.ownerEmail = "Email is required";
    } else if (!EMAIL_REGEX.test(data.ownerEmail)) {
      errors.ownerEmail = "Please enter a valid email address";
    }
  }

  if (isRequired('ownerPhone', customRequirements)) {
    if (!data.ownerPhone.trim()) {
      errors.ownerPhone = "Phone number is required";
    } else if (!PHONE_REGEX.test(data.ownerPhone)) {
      errors.ownerPhone = "Please use format (555) 123-4567";
    }
  }

  if (isRequired('ownerDOB', customRequirements)) {
    if (!data.ownerDOB.trim()) {
      errors.ownerDOB = "Date of birth is required";
    } else {
      const dobParts = data.ownerDOB.split("/");
      if (dobParts.length !== 3 || dobParts.some((p) => !/^\d+$/.test(p))) {
        errors.ownerDOB = "Please use MM/DD/YYYY format";
      } else {
        const month = parseInt(dobParts[0], 10);
        const day = parseInt(dobParts[1], 10);
        const year = parseInt(dobParts[2], 10);
        if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1900 || year > new Date().getFullYear() - 18) {
          errors.ownerDOB = "Please enter a valid date";
        } else {
          const dob = new Date(year, month - 1, day);
          const now = new Date();
          const age = now.getFullYear() - dob.getFullYear() - (
            now.getMonth() < dob.getMonth() ||
            (now.getMonth() === dob.getMonth() && now.getDate() < dob.getDate()) ? 1 : 0
          );
          if (age < 18) {
            errors.ownerDOB = `You must be at least 18 years old (currently ${age})`;
          }
        }
      }
    }
  }

  if (isRequired('ssn', customRequirements)) {
    if (!data.ssn.trim()) {
      errors.ssn = "SSN is required for identity verification";
    } else if (!SSN_REGEX.test(data.ssn)) {
      errors.ssn = "Please use XXX-XX-XXXX format";
    } else if (!isValidSSN(data.ssn)) {
      errors.ssn = "Please enter a valid SSN";
    }
  }

  if (isRequired('ein', customRequirements)) {
    if (!data.ein.trim()) {
      errors.ein = "EIN is required for verification";
    } else if (!EIN_REGEX.test(data.ein)) {
      errors.ein = "Please use XX-XXXXXXX format";
    } else if (!isValidEIN(data.ein)) {
      errors.ein = "Please enter a valid EIN";
    }
  }

  if (isRequired('ownerAddress', customRequirements)) {
    if (!data.ownerAddress.trim()) {
      errors.ownerAddress = "Home address is required";
    }
  }

  if (isRequired('ownerCity', customRequirements)) {
    if (!data.ownerCity.trim()) {
      errors.ownerCity = "City is required";
    }
  }

  if (isRequired('ownerState', customRequirements)) {
    if (!data.ownerState.trim()) {
      errors.ownerState = "State is required";
    } else if (data.ownerState.length !== 2) {
      errors.ownerState = "Please use 2-letter state code";
    } else if (!VALID_STATES.includes(data.ownerState.toUpperCase())) {
      errors.ownerState = "Please enter a valid state code";
    }
  }

  if (isRequired('ownerZip', customRequirements)) {
    if (!data.ownerZip.trim()) {
      errors.ownerZip = "ZIP code is required";
    } else if (!ZIP_REGEX.test(data.ownerZip)) {
      errors.ownerZip = "Please enter a valid ZIP code";
    }
  }

  return errors;
}

function validateBusiness(data: FormData, customRequirements?: FieldRequirements): FieldErrors {
  const errors: FieldErrors = {};

  if (isRequired('businessName', customRequirements)) {
    if (!data.businessName.trim()) {
      errors.businessName = "Legal business name is required";
    }
  }

  if (isRequired('businessType', customRequirements)) {
    if (!data.businessType) {
      errors.businessType = "Business type is required";
    }
  }

  if (isRequired('dba', customRequirements)) {
    // DBA is optional unless explicitly required
  }

  if (isRequired('industry', customRequirements)) {
    if (!data.industry) {
      errors.industry = "Industry is required";
    }
  }

  if (isRequired('website', customRequirements)) {
    if (!data.website.trim()) {
      errors.website = "Website is required";
    } else if (!URL_REGEX.test(data.website)) {
      errors.website = "Please enter a valid URL (e.g., https://example.com)";
    }
  } else if (data.website.trim() && !URL_REGEX.test(data.website)) {
    errors.website = "Please enter a valid URL (e.g., https://example.com)";
  }

  if (isRequired('yearsInBusiness', customRequirements)) {
    if (!data.yearsInBusiness) {
      errors.yearsInBusiness = "Years in business is required";
    }
  }

  if (isRequired('businessAddress', customRequirements)) {
    if (!data.businessAddress.trim()) {
      errors.businessAddress = "Business address is required";
    }
  }

  if (isRequired('businessCity', customRequirements)) {
    if (!data.businessCity.trim()) {
      errors.businessCity = "City is required";
    }
  }

  if (isRequired('businessState', customRequirements)) {
    if (!data.businessState.trim()) {
      errors.businessState = "State is required";
    } else if (data.businessState.length !== 2) {
      errors.businessState = "Please use 2-letter state code";
    } else if (!VALID_STATES.includes(data.businessState.toUpperCase())) {
      errors.businessState = "Please enter a valid state code";
    }
  }

  if (isRequired('businessZip', customRequirements)) {
    if (!data.businessZip.trim()) {
      errors.businessZip = "ZIP code is required";
    } else if (!ZIP_REGEX.test(data.businessZip)) {
      errors.businessZip = "Please enter a valid ZIP code";
    }
  }

  return errors;
}

function validateProcessing(data: FormData, customRequirements?: FieldRequirements): FieldErrors {
  const errors: FieldErrors = {};

  if (isRequired('monthlyVolume', customRequirements)) {
    if (!data.monthlyVolume) {
      errors.monthlyVolume = "Monthly volume is required";
    }
  }

  if (isRequired('avgTicket', customRequirements)) {
    if (!data.avgTicket) {
      errors.avgTicket = "Average ticket size is required";
    }
  }

  if (isRequired('highestTicket', customRequirements)) {
    if (!data.highestTicket.trim()) {
      errors.highestTicket = "Highest ticket is required";
    } else if (!/^\$?[\d,]+(\.\d{2})?$/.test(data.highestTicket)) {
      errors.highestTicket = "Please enter a valid dollar amount";
    }
  }

  if (isRequired('currentProcessor', customRequirements)) {
    if (!data.currentProcessor?.trim()) {
      errors.currentProcessor = "Current processor is required";
    }
  }

  if (isRequired('monthsProcessing', customRequirements)) {
    if (!data.monthsProcessing) {
      errors.monthsProcessing = "Months processing is required";
    }
  }

  if (isRequired('chargebackRate', customRequirements)) {
    if (!data.chargebackRate.trim()) {
      errors.chargebackRate = "Chargeback rate is required";
    } else if (!/^\d+(\.\d+)?%$/.test(data.chargebackRate)) {
      errors.chargebackRate = "Please use format like 1.5%";
    }
  } else if (data.chargebackRate.trim() && !/^\d+(\.\d+)?%$/.test(data.chargebackRate)) {
    errors.chargebackRate = "Please use format like 1.5%";
  }

  if (isRequired('previousIssues', customRequirements)) {
    // previousIssues is typically a text field or select
  }

  return errors;
}

function validateBanking(data: FormData, customRequirements?: FieldRequirements): FieldErrors {
  const errors: FieldErrors = {};

  if (isRequired('bankName', customRequirements)) {
    if (!data.bankName.trim()) {
      errors.bankName = "Bank name is required";
    }
  }

  if (isRequired('bankAccountType', customRequirements)) {
    if (!data.bankAccountType) {
      errors.bankAccountType = "Account type is required";
    }
  }

  if (isRequired('bankRouting', customRequirements)) {
    if (!data.bankRouting.trim()) {
      errors.bankRouting = "Routing number is required";
    } else if (!isValidRoutingNumber(data.bankRouting)) {
      errors.bankRouting = "Please enter a valid routing number";
    }
  } else if (data.bankRouting.trim() && !ROUTING_REGEX.test(data.bankRouting)) {
    errors.bankRouting = "Please enter a valid 9-digit routing number";
  }

  if (isRequired('bankAccount', customRequirements)) {
    if (!data.bankAccount.trim()) {
      errors.bankAccount = "Account number is required";
    } else if (data.bankAccount.length < 8) {
      errors.bankAccount = "Please enter a valid account number (8-17 digits)";
    }
  }

  return errors;
}

function validateProducts(data: FormData, customRequirements?: FieldRequirements): FieldErrors {
  const errors: FieldErrors = {};

  if (isRequired('productDescription', customRequirements)) {
    if (!data.productDescription.trim()) {
      errors.productDescription = "Product description is required";
    } else if (data.productDescription.trim().length < 10) {
      errors.productDescription = "Please provide more detail about your products/services";
    }
  } else if (data.productDescription.trim() && data.productDescription.trim().length < 10) {
    errors.productDescription = "Please provide more detail about your products/services";
  }

  if (isRequired('deliveryMethod', customRequirements)) {
    if (!data.deliveryMethod) {
      errors.deliveryMethod = "Delivery method is required";
    }
  }

  if (isRequired('refundPolicy', customRequirements)) {
    if (!data.refundPolicy) {
      errors.refundPolicy = "Refund policy is required";
    }
  }

  if (isRequired('acquisitionMethods', customRequirements)) {
    if (!data.acquisitionMethods) {
      errors.acquisitionMethods = "Customer acquisition method is required";
    }
  }

  return errors;
}

function validateDocuments(_data: FormData, _customRequirements?: FieldRequirements): FieldErrors {
  return {};
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function getErrorCount(errors: FieldErrors): number {
  return Object.keys(errors).length;
}
