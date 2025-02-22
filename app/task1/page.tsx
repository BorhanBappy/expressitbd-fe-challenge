"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import Head from "next/head";
import { NextPage } from "next";
import { z } from "zod";

// Zod Schema
const StoreSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  domain: z
    .string()
    .min(3, "Domain must be at least 3 characters")
    .refine((val) => !val.includes(" "), "Domain cannot contain spaces")
    .refine(
      (val) => /^[a-z0-9-]+$/.test(val),
      "Domain can only contain lowercase letters, numbers, and hyphens"
    )
    .refine(
      (val) => !val.startsWith("-") && !val.endsWith("-"),
      "Domain cannot start or end with a hyphen"
    ),
  country: z.string().min(1, "Please select a country"),
  category: z.string().min(1, "Please select a category"),
  currency: z.string().length(3, "Currency must be 3 characters"),
  email: z.string().email("Invalid email address"),
});

type StoreFormData = z.infer<typeof StoreSchema>;

const countryOptions = [{ value: "Bangladesh", label: "Bangladesh" }];

const categoryOptions = [
  { value: "healthcare", label: "Healthcare" },
  { value: "fashion", label: "Fashion" },
  { value: "beauty", label: "Beauty & Personal Care" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "retail", label: "Retail" },
];
const currencyOptions = [{ value: "BDT", label: "Bangladeshi Taka (BDT)" }];

const Task1: NextPage = () => {
  const [formData, setFormData] = useState<StoreFormData>({
    name: "",
    domain: "",
    country: "",
    category: "",
    currency: "",
    email: "",
  });
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);
    setServerError(null);

    // Validate form data
    const validationResult = StoreSchema.safeParse(formData);

    if (!validationResult.success) {
      setErrors(validationResult.error.errors);
      setIsSubmitting(false);
      return;
    }

    // Add ".expressitbd.com" to the domain
    const fullDomain = formData.domain.trim().toLowerCase(); // Trim spaces and

    const finalDomain = `${fullDomain}.expressitbd.com`;

    try {
      // Domain Check: Check availability of the domain
      const domainCheck = await axios.get<{ available: boolean }>(
        `https://interview-task-green.vercel.app/task/domains/check/${finalDomain}`
      );

      if (domainCheck.data.available) {
        setServerError("Domain is already taken");
        setIsSubmitting(false);
        return; // Stop execution if the domain is taken
      } else {
        // Proceed to create store if domain is unavailable
        await axios.post(
          "https://interview-task-green.vercel.app/task/stores/create",
          {
            name: formData.name,
            currency: formData.currency,
            country: formData.country, // Use full country name
            domain: fullDomain, // Use the full domain with '.expressitbd.com'
            category: formData.category,
            email: formData.email,
          }
        );

        setSuccessMessage("Store created successfully!");
        setFormData({
          name: "",
          domain: "",
          country: "",
          category: "",
          currency: "",
          email: "",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setServerError(axiosError.response?.data?.message || axiosError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof StoreFormData, value: string) => {
    // Update the field value in formData
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear any errors for the current field as soon as the user starts typing
    setErrors((prev) => prev.filter((e) => e.path[0] !== field));

    // Trigger the validation function to validate the specific field
    validateField(field, value);
  };

  const validateField = (field: keyof StoreFormData, value: string) => {
    // Validate the updated field and all the other form data
    const validationResult = StoreSchema.safeParse({
      ...formData,
      [field]: value, // Update only the field being changed
    });
    setSuccessMessage("");
    // If validation fails, set the errors for the specific field
    if (!validationResult.success) {
      setErrors(validationResult.error.errors);
    } else {
      // Otherwise, clear any previous errors related to that field
      setErrors((prev) => prev.filter((e) => e.path[0] !== field));
    }
  };

  return (
    <div className="min-h-screen p-8">
      <Head>
        <title>Create Store - Express IT Task</title>
        <meta
          name="description"
          content="Create a new store with domain verification"
        />
      </Head>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create New Store</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Store Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                handleInputChange("name", e.target.value); // Triggering validation on change
              }}
              className={`w-full p-2 border rounded-md ${
                errors.some((e) => e.path[0] === "name") ? "border-red-500" : ""
              }`}
              disabled={isSubmitting}
            />
            {errors.some((e) => e.path[0] === "name") && (
              <p className="text-red-500 text-sm font-semibold">
                Name must be at least 3 characters
              </p>
            )}
          </div>

          {/* Domain Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Domain</label>
            <input
              type="text"
              value={formData.domain}
              onChange={(e) => {
                handleInputChange("domain", e.target.value); // Triggering validation on change
              }}
              className={`w-full p-2 border rounded-md ${
                errors.some((e) => e.path[0] === "domain")
                  ? "border-red-500"
                  : ""
              }`}
              disabled={isSubmitting}
            />
            {errors.some((e) => e.path[0] === "domain") && (
              <p className="text-red-500 text-sm font-semibold">
                Domain must be at least 3 characters
              </p>
            )}
          </div>

          {/* Country Select */}
          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <select
              value={formData.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
              className={`w-full p-2 border rounded-md ${
                errors.some((e) => e.path[0] === "country")
                  ? "border-red-500"
                  : ""
              }`}
              disabled={isSubmitting}
            >
              <option value="">Select Country</option>
              {countryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.some((e) => e.path[0] === "country") && (
              <p className="text-red-500 text-sm font-semibold">
                Please select a country
              </p>
            )}
          </div>

          {/* Category Select */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className={`w-full p-2 border rounded-md ${
                errors.some((e) => e.path[0] === "category")
                  ? "border-red-500"
                  : ""
              }`}
              disabled={isSubmitting}
            >
              <option value="">Select Category</option>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.some((e) => e.path[0] === "category") && (
              <p className="text-red-500 text-sm font-semibold">
                Please select a category
              </p>
            )}
          </div>

          {/* Currency Select */}
          <div>
            <label className="block text-sm font-medium mb-1">Currency</label>
            <select
              value={formData.currency}
              onChange={(e) => handleInputChange("currency", e.target.value)}
              className={`w-full p-2 border rounded-md ${
                errors.some((e) => e.path[0] === "currency")
                  ? "border-red-500"
                  : ""
              }`}
              disabled={isSubmitting}
            >
              <option value="">Select Currency</option>
              {currencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.some((e) => e.path[0] === "currency") && (
              <p className="text-red-500 text-sm font-semibold">
                Please select a currency
              </p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="text"
              value={formData.email}
              onChange={(e) => {
                handleInputChange("email", e.target.value); // Triggering validation on change
              }}
              className={`w-full p-2 border rounded-md ${
                errors.some((e) => e.path[0] === "email")
                  ? "border-red-500"
                  : ""
              }`}
              disabled={isSubmitting}
            />
            {errors.some((e) => e.path[0] === "email") && (
              <p className="text-red-500 text-sm font-semibold">
                Invalid email address
              </p>
            )}
          </div>

          {/* Server Error */}
          {serverError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{serverError}</span>
              </div>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{successMessage}</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Creating Store...
              </div>
            ) : (
              "Create Store"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Task1;
