import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Shield, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // This would integrate with Supabase authentication for admin role
    alert("Admin authentication requires Supabase integration with role-based access");
  };

  return (
    <div className="min-h-screen bg-gradient-elegant flex items-center justify-center relative">
      <div className="absolute inset-0 bg-black/30"></div>
      
      <div className="relative z-10 w-full max-w-md mx-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6 text-white hover:text-white/80 hover:bg-white/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Website
        </Button>

        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-primary">Admin Access</CardTitle>
            <p className="text-muted-foreground">Secure login for hotel management</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="admin-email" className="block text-sm font-medium text-foreground mb-2">
                  Administrator Email
                </label>
                <Input 
                  id="admin-email" 
                  type="email" 
                  required 
                  placeholder="admin@grandluxehotel.com"
                  className="transition-all focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label htmlFor="admin-password" className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input 
                    id="admin-password" 
                    type={showPassword ? "text" : "password"} 
                    required 
                    placeholder="Enter admin password"
                    className="transition-all focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-input" />
                  <span className="text-sm text-muted-foreground">Keep me signed in</span>
                </label>
                <a href="#" className="text-sm text-primary hover:underline">
                  Request access?
                </a>
              </div>

              <Button type="submit" className="w-full" size="lg">
                <Shield className="mr-2 h-4 w-4" />
                Access Admin Panel
              </Button>
            </form>

            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Security Notice:</strong> This is a restricted area. All login attempts are monitored.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-white/70">
            Need technical support?{" "}
            <a href="/contact" className="text-white hover:underline">
              Contact IT department
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}