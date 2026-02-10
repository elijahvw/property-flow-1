import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, BarChart3, Brain } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect authenticated users to their respective dashboards
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/platform-admin");
      } else if (user.role === "landlord") {
        navigate("/admin");
      }
    }
  }, [user, navigate]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-secondary to-white py-20 md:py-32">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute -bottom-8 left-10 w-72 h-72 bg-ai rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6">
                Streamline Your Property Management
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                PropertyFlow combines powerful property management tools with
                AI-powered document analysis to help landlords manage
                properties, screen tenants, and collect rent—all in one
                platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button
                  size="lg"
                  onClick={() => navigate("/login")}
                  className="bg-primary hover:bg-primary/90"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="relative">
                <div className="bg-gradient-ai rounded-2xl p-8 text-white shadow-2xl">
                  <div className="space-y-4">
                    <div className="h-12 bg-white/20 rounded-lg"></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-20 bg-white/20 rounded-lg"></div>
                      <div className="h-20 bg-white/20 rounded-lg"></div>
                    </div>
                    <div className="h-32 bg-white/20 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Powerful Features for Modern Property Management
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage properties efficiently and make
              data-driven decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl border border-border hover:border-primary hover:shadow-lg transition bg-white">
              <div className="w-12 h-12 bg-ai/20 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-ai" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Property Management
              </h3>
              <p className="text-sm text-muted-foreground">
                Manage multiple properties, track maintenance requests, and
                monitor occupancy.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl border border-border hover:border-primary hover:shadow-lg transition bg-white">
              <div className="w-12 h-12 bg-ai/20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-ai" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Rent Collection
              </h3>
              <p className="text-sm text-muted-foreground">
                Automate rent collection, track payments, and manage late fees
                with ease.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl border border-border hover:border-primary hover:shadow-lg transition bg-white">
              <div className="w-12 h-12 bg-ai/20 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-ai" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Analytics & Reports
              </h3>
              <p className="text-sm text-muted-foreground">
                Get insights into property performance and tenant metrics with
                detailed reports.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-xl border border-border hover:border-primary hover:shadow-lg transition bg-white">
              <div className="w-12 h-12 bg-ai/20 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-ai" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                AI Document Analysis
              </h3>
              <p className="text-sm text-muted-foreground">
                Upload leases and documents for intelligent analysis and key
                insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Integration Section */}
      <section className="py-20 md:py-32 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-ai/10 rounded-2xl p-8 border border-ai/20">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-ai/20 rounded-full text-ai">
                    <Brain className="w-4 h-4" />
                    <span className="text-sm font-medium">AI-Powered</span>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    Document Intelligence
                  </h3>
                  <p className="text-muted-foreground">
                    Upload lease agreements, property documents, and tenant
                    applications. Our AI analyzes them to provide key insights:
                  </p>
                  <ul className="space-y-2 mt-4">
                    <li className="flex items-start gap-3">
                      <span className="text-ai mt-1">✓</span>
                      <span className="text-sm">
                        Lease term analysis and red flags
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-ai mt-1">✓</span>
                      <span className="text-sm">
                        Property valuation insights
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-ai mt-1">✓</span>
                      <span className="text-sm">Tenant risk assessment</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-ai mt-1">✓</span>
                      <span className="text-sm">
                        Market analysis recommendations
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                AI-Powered Insights for Better Decisions
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                PropertyFlow uses advanced AI to analyze your documents and
                provide actionable insights. Review leases, understand property
                metrics, and make data-driven decisions faster.
              </p>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Learn More About AI Features
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Ready to Transform Your Property Management?
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            Join hundreds of landlords managing their properties smarter with
            PropertyFlow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/login")}
              className="bg-primary hover:bg-primary/90"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
