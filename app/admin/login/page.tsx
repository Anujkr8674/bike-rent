import { AdminLoginForm } from "@/components/auth/admin-login-form";
import { siteAssets } from "@/lib/site-assets";

export const metadata = { title: "Admin Login" };

export default function AdminLoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center py-16">
      {/* Full-screen Background Image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        // style={{ backgroundImage: "url(${siteAssets.hero.poster})" }}
        style={{ backgroundImage: `url(${siteAssets.hero.poster})` }}
      />

      {/* Login Form Container */}
      <div className="relative z-10 w-full px-4">
        <AdminLoginForm />
      </div>
    </div>
  );
}
