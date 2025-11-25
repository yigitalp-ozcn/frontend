"use client";

import { OTPForm } from "@/components/auth/otp-form";

export default function VerifyPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-[45%_55%]">
      {/* Left Panel - Form Area */}
      <div className="flex flex-col items-center justify-center bg-background px-6 py-12 md:px-12 lg:px-16">
        <div className="w-full max-w-[400px]">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <a href="/" className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-8 text-foreground"
              >
                <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
              </svg>
            </a>
          </div>

          <OTPForm />
        </div>
      </div>

      {/* Right Panel - Placeholder Image Area */}
      <div className="bg-muted relative hidden lg:block">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-24 opacity-50"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
            <span className="text-lg font-medium">Your Image Here</span>
          </div>
        </div>
      </div>
    </div>
  );
}
