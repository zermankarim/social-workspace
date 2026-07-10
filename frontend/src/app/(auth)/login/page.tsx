import { LoginForm } from "@/presentation/components/auth/login-form";

export const metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold text-foreground">Sign in</h2>
      <LoginForm />
    </div>
  );
}
