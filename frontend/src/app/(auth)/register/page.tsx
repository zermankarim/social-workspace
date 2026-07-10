import { RegisterForm } from "@/presentation/components/auth/register-form";

export const metadata = {
  title: "Create account",
};

export default function RegisterPage() {
  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold text-foreground">
        Create account
      </h2>
      <RegisterForm />
    </div>
  );
}
