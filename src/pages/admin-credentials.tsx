import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, Copy, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AdminCredentialsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const adminCredentials = {
    email: "admin@hotel.com",
    password: "admin123"
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
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
            <CardTitle className="text-2xl text-primary">Admin Credentials</CardTitle>
            <p className="text-muted-foreground">Default login information for hotel management</p>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800 mb-3">
                <strong>Default Administrator Account:</strong>
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded border">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Email</label>
                    <p className="font-mono text-sm">{adminCredentials.email}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(adminCredentials.email, "Email")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded border">
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-500">Password</label>
                    <p className="font-mono text-sm">
                      {showPassword ? adminCredentials.password : "••••••••"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyToClipboard(adminCredentials.password, "Password")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => navigate('/admin-login')}
                className="flex-1"
              >
                <Shield className="mr-2 h-4 w-4" />
                Go to Admin Login
              </Button>
            </div>

            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Security Notice:</strong> Change these default credentials after first login. This information should only be accessible to authorized personnel.
              </p>
            </div>

            <div className="text-center">
              <Badge variant="secondary" className="text-xs">
                For Development & Demo Purposes
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-white/70">
            Need to access the dashboard?{" "}
            <button 
              onClick={() => navigate('/admin-dashboard')}
              className="text-white hover:underline"
            >
              Admin Dashboard
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}