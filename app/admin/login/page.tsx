import { AdminLoginForm } from "@/components/auth/admin-login-form";

export const metadata = { title: "Admin Login" };

export default function AdminLoginPage() {
  return (
    <div className="page-wrap py-16">
      <AdminLoginForm />
    </div>
  );
}
