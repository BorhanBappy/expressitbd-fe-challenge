/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { NextPage } from "next";
import { InputField } from "@/app/task1/components/InputField";
import { SelectField } from "@/app/task1/components/SelectField";
import { StoreSchema, StoreFormData } from "./components/schemas";
import { FORM_CONFIG } from "./components/formConfig";
import { z } from "zod";

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
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => prev.filter((e) => e.path[0] !== field));
    validateField(field, value);
  };

  const validateField = (field: keyof StoreFormData, value: string) => {
    const result = StoreSchema.safeParse({ ...formData, [field]: value });
    setSuccessMessage("");
    !result.success
      ? setErrors(result.error.errors)
      : setErrors((prev) => prev.filter((e) => e.path[0] !== field));
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">
          Create New Store
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 sm:space-y-6 bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md"
        >
          <InputField
            label="Store Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            errors={errors}
            disabled={isSubmitting}
          />

          <InputField
            label="Domain"
            name="domain"
            value={formData.domain}
            onChange={handleInputChange}
            errors={errors}
            disabled={isSubmitting}
            suffix=".expressitbd.com"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField
              label="Country"
              name="country"
              value={formData.country}
              options={FORM_CONFIG.countryOptions}
              onChange={handleInputChange}
              errors={errors}
              disabled={isSubmitting}
            />

            <SelectField
              label="Category"
              name="category"
              value={formData.category}
              options={FORM_CONFIG.categoryOptions}
              onChange={handleInputChange}
              errors={errors}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField
              label="Currency"
              name="currency"
              value={formData.currency}
              options={FORM_CONFIG.currencyOptions}
              onChange={handleInputChange}
              errors={errors}
              disabled={isSubmitting}
            />

            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              errors={errors}
              disabled={isSubmitting}
            />
          </div>

          {serverError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {serverError}
            </div>
          )}

          {successMessage && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
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
