"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";

export function OTPForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* Title */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold text-foreground">Verify Your Email</h1>
        <p className="text-sm text-muted-foreground">
          We&apos;ve sent a verification code to your email address.
          <br />
          Please enter it below.
        </p>
      </div>

      {/* OTP Input */}
      <div className="flex justify-center">
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} className="h-14 w-12 text-lg" />
            <InputOTPSlot index={1} className="h-14 w-12 text-lg" />
            <InputOTPSlot index={2} className="h-14 w-12 text-lg" />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} className="h-14 w-12 text-lg" />
            <InputOTPSlot index={4} className="h-14 w-12 text-lg" />
            <InputOTPSlot index={5} className="h-14 w-12 text-lg" />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {/* Verify Button */}
      <Button
        type="submit"
        className="w-full h-10 font-medium"
      >
        Verify
      </Button>

      {/* Resend Code */}
      <div className="flex flex-col items-center gap-2 text-sm">
        <p className="text-muted-foreground">
          Didn&apos;t receive the code?{" "}
          <button
            type="button"
            className="text-foreground underline underline-offset-4 hover:text-primary"
          >
            Resend
          </button>
        </p>
      </div>

      {/* Back to Login */}
      <div className="flex justify-center">
        <a
          href="/login"
          className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Back to login
        </a>
      </div>
    </div>
  );
}
