import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/ui/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, UserPlus, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('signin-email') as string;
    const password = formData.get('signin-password') as string;

    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error.message,
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You've been successfully signed in.",
      });
    }
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('signup-email') as string;
    const password = formData.get('signup-password') as string;
    const confirmPassword = formData.get('confirm-password') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const phone = formData.get('phone') as string;

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Please ensure both passwords are identical.",
      });
      setIsLoading(false);
      return;
    }

    const { error } = await signUp(email, password, {
      first_name: firstName,
      last_name: lastName,
      phone: phone
    });
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error.message,
      });
    } else {
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });
    }
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      toast({
        variant: "destructive",
        title: "Google sign in failed",
        description: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome</h1>
            <p className="text-muted-foreground">Sign in to your account or create a new one</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center text-primary">Account Access</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                {/* Sign In Tab */}
                <TabsContent value="signin" className="space-y-4">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                      <label htmlFor="signin-email" className="block text-sm font-medium text-foreground mb-2">
                        Email Address
                      </label>
                       <Input 
                         id="signin-email" 
                         name="signin-email"
                         type="email" 
                         required 
                         placeholder="Enter your email"
                       />
                    </div>

                    <div>
                      <label htmlFor="signin-password" className="block text-sm font-medium text-foreground mb-2">
                        Password
                      </label>
                      <div className="relative">
                         <Input 
                           id="signin-password" 
                           name="signin-password"
                           type={showPassword ? "text" : "password"} 
                           required 
                           placeholder="Enter your password"
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
                        <span className="text-sm text-muted-foreground">Remember me</span>
                      </label>
                      <a href="#" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </a>
                    </div>

                     <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                       <LogIn className="mr-2 h-4 w-4" />
                       {isLoading ? "Signing In..." : "Sign In"}
                     </Button>
                  </form>
                </TabsContent>

                {/* Sign Up Tab */}
                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                          First Name
                        </label>
                         <Input 
                           id="firstName" 
                           name="firstName"
                           required 
                           placeholder="First name"
                         />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                          Last Name
                        </label>
                         <Input 
                           id="lastName" 
                           name="lastName"
                           required 
                           placeholder="Last name"
                         />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="signup-email" className="block text-sm font-medium text-foreground mb-2">
                        Email Address
                      </label>
                       <Input 
                         id="signup-email" 
                         name="signup-email"
                         type="email" 
                         required 
                         placeholder="Enter your email"
                       />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                       <Input 
                         id="phone" 
                         name="phone"
                         type="tel" 
                         placeholder="Enter your phone number"
                       />
                    </div>

                    <div>
                      <label htmlFor="signup-password" className="block text-sm font-medium text-foreground mb-2">
                        Password
                      </label>
                      <div className="relative">
                         <Input 
                           id="signup-password" 
                           name="signup-password"
                           type={showPassword ? "text" : "password"} 
                           required 
                           placeholder="Create a password"
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

                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-foreground mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                         <Input 
                           id="confirm-password" 
                           name="confirm-password"
                           type={showConfirmPassword ? "text" : "password"} 
                           required 
                           placeholder="Confirm your password"
                         />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <input type="checkbox" required className="rounded border-input mt-1" />
                      <span className="text-sm text-muted-foreground">
                        I agree to the{" "}
                        <a href="#" className="text-primary hover:underline">Terms of Service</a>
                        {" "}and{" "}
                        <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                      </span>
                    </div>

                     <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                       <UserPlus className="mr-2 h-4 w-4" />
                       {isLoading ? "Creating Account..." : "Create Account"}
                     </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Social Login Placeholder */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                 <div className="mt-4 grid grid-cols-2 gap-3">
                   <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                     Google
                   </Button>
                   <Button variant="outline" className="w-full" disabled>
                     Facebook
                   </Button>
                 </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Need help?{" "}
              <a href="/contact" className="text-primary hover:underline">
                Contact our support team
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}