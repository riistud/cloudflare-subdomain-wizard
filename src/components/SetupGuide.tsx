import { Card } from "@/components/ui/card";
import { Info, ExternalLink } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const SetupGuide = () => {
  return (
    <section className="py-12 bg-muted/20">
      <div className="container px-4">
        <Card className="max-w-4xl mx-auto glass-card p-8">
          <div className="flex items-start gap-3 mb-6">
            <Info className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-2xl font-bold mb-2">Setup Instructions</h3>
              <p className="text-muted-foreground">
                Follow these steps to configure your Cloudflare Zone IDs
              </p>
            </div>
          </div>

          <Alert className="mb-6 bg-primary/10 border-primary/20">
            <AlertTitle className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Important: Configure Zone IDs
            </AlertTitle>
            <AlertDescription className="mt-2">
              Before using the subdomain generator, you need to add your Cloudflare Zone IDs to the backend function.
            </AlertDescription>
          </Alert>

          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">
                  1
                </span>
                Get Your Cloudflare Zone IDs
              </h4>
              <ul className="space-y-2 ml-8 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Login to your Cloudflare dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Select your domain (e.g., riicode.my.id)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Scroll down to find the <strong>Zone ID</strong> on the right sidebar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Copy the Zone ID for each domain you want to use</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">
                  2
                </span>
                Update the Backend Function
              </h4>
              <ul className="space-y-2 ml-8 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Open the file: <code className="px-2 py-1 bg-muted rounded text-foreground">supabase/functions/create-subdomain/index.ts</code></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Find the <code className="px-2 py-1 bg-muted rounded text-foreground">ZONE_MAP</code> constant (around line 9)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Replace <code className="px-2 py-1 bg-muted rounded text-foreground">YOUR_ZONE_ID_1</code> and <code className="px-2 py-1 bg-muted rounded text-foreground">YOUR_ZONE_ID_2</code> with your actual Zone IDs</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">
                  3
                </span>
                Test the Setup
              </h4>
              <p className="ml-8 text-muted-foreground">
                Once configured, use the form above to create your first subdomain and test the integration!
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-accent/10 rounded-lg border border-accent/20">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Note:</strong> The Cloudflare API token is already securely stored in your backend. 
              You only need to configure the Zone IDs once per domain.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default SetupGuide;
