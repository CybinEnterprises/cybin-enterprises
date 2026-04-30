'use client';

import { useState } from 'react';
import { Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { DEFAULT_FIELD_REQUIREMENTS } from '@/app/portal/validation';

interface FieldRequirementsSelectorProps {
  value: Record<string, boolean>;
  onChange: (requirements: Record<string, boolean>) => void;
}

const FIELD_GROUPS = {
  'About You': [
    { key: 'ownerName', label: 'Full Name' },
    { key: 'ownerEmail', label: 'Email' },
    { key: 'ownerPhone', label: 'Phone' },
    { key: 'ownerDOB', label: 'Date of Birth' },
    { key: 'ssn', label: 'SSN' },
    { key: 'ownerAddress', label: 'Home Address' },
    { key: 'ownerCity', label: 'City' },
    { key: 'ownerState', label: 'State' },
    { key: 'ownerZip', label: 'ZIP Code' },
  ],
  'Business': [
    { key: 'businessName', label: 'Legal Business Name' },
    { key: 'dba', label: 'DBA / Trade Name' },
    { key: 'businessType', label: 'Business Type' },
    { key: 'industry', label: 'Industry' },
    { key: 'ein', label: 'EIN' },
    { key: 'website', label: 'Website' },
    { key: 'yearsInBusiness', label: 'Years in Business' },
    { key: 'businessAddress', label: 'Business Address' },
    { key: 'businessCity', label: 'City' },
    { key: 'businessState', label: 'State' },
    { key: 'businessZip', label: 'ZIP Code' },
  ],
  'Processing': [
    { key: 'monthlyVolume', label: 'Monthly Volume' },
    { key: 'avgTicket', label: 'Average Ticket' },
    { key: 'highestTicket', label: 'Highest Ticket' },
    { key: 'currentProcessor', label: 'Current Processor' },
    { key: 'monthsProcessing', label: 'Months Processing' },
    { key: 'chargebackRate', label: 'Chargeback Rate' },
    { key: 'previousIssues', label: 'Previous Issues' },
  ],
  'Banking': [
    { key: 'bankName', label: 'Bank Name' },
    { key: 'bankRouting', label: 'Routing Number' },
    { key: 'bankAccount', label: 'Account Number' },
    { key: 'bankAccountType', label: 'Account Type' },
  ],
  'Products': [
    { key: 'productDescription', label: 'Product/Service Description' },
    { key: 'deliveryMethod', label: 'Delivery Method' },
    { key: 'refundPolicy', label: 'Refund Policy' },
    { key: 'acquisitionMethods', label: 'Customer Acquisition' },
  ],
};

export function FieldRequirementsSelector({ value, onChange }: FieldRequirementsSelectorProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['About You', 'Banking'));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const toggleField = (key: string) => {
    onChange({ ...value, [key]: !value[key] });
  };

  const setAllInSection = (section: string, required: boolean) => {
    const fields = FIELD_GROUPS[section as keyof typeof FIELD_GROUPS];
    const newRequirements = { ...value };
    fields.forEach(f => {
      newRequirements[f.key] = required;
    });
    onChange(newRequirements);
  };

  const resetToDefaults = () => onChange(DEFAULT_FIELD_REQUIREMENTS);

  const makeAllOptional = () => {
    const allOptional: Record<string, boolean> = {};
    Object.keys(DEFAULT_FIELD_REQUIREMENTS).forEach(key => {
      allOptional[key] = false;
    });
    onChange(allOptional);
  };

  const requiredCount = Object.values(value).filter(v => v).length;
  const totalCount = Object.keys(value).length || totalCount;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-brand-teal" />
          <span className="font-medium text-text-primary">Field Requirements</span>
        </div>
        <div className="text-sm text-text-secondary">
          {requiredCount} of {Object.keys(DEFAULT_FIELD_REQUIREMENTS).length} required
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={resetToDefaults}
          className="text-xs px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        >
          Reset to Defaults
        </button>
        <button
          type="button"
          onClick={makeAllOptional}
          className="text-xs px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        >
          Make All Optional
        </button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        {Object.entries(FIELD_GROUPS).map(([section, fields]) => {
          const isExpanded = expandedSections.has(section);
          const sectionRequired = fields.filter(f => value[f.key] !== false).length;
          const sectionTotal = fields.length;

          return (
            <div key={section} className="border-b last:border-b-0">
              <button
                type="button"
                onClick={() => toggleSection(section)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-text-primary">{section}</span>
                  <span className="text-xs text-text-secondary">
                    ({sectionRequired}/{sectionTotal} required)
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-text-secondary" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-text-secondary" />
                )}
              </button>

              {isExpanded && (
                <div className="px-4 py-3 bg-white">
                  <div className="flex gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setAllInSection(section, true)}
                      className="text-xs px-2 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                      Require All
                    </button>
                    <button
                      type="button"
                      onClick={() => setAllInSection(section, false)}
                      className="text-xs px-2 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                      Optional All
                    </button>
                  </div>

                  <div className="space-y-2">
                    {fields.map(field => {
                      const isRequired = value[field.key] !== false;
                      return (
                        <label
                          key={field.key}
                          className="flex items-center justify-between cursor-pointer group"
                        >
                          <span className="text-sm text-text-primary group-hover:text-brand-teal transition-colors">
                            {field.label}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleField(field.key)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              isRequired ? 'bg-brand-teal' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                isRequired ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}