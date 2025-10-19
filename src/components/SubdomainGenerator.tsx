import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const DNS_TYPES = ["A", "AAAA", "CNAME", "TXT"] as const;
const DOMAINS = ["riicode.my.id", "riistore-vvip.my.id"] as const;

type DnsType = typeof DNS_TYPES[number];
type Domain = typeof DOMAINS[number];

const SubdomainGenerator = () => {
  const [domain, setDomain] = useState<Domain>("riicode.my.id");
  const [alias, setAlias] = useState("");
  const [target, setTarget] = useState("");
  const [recordType, setRecordType] = useState<DnsType>("A");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!alias || !target) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-subdomain", {
        body: {
          domain,
          alias,
          target,
          type: recordType,
        },
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: `Subdomain ${alias}.${domain} created successfully`,
      });

      // Reset form
      setAlias("");
      setTarget("");
    } catch (error) {
      console.error("Error creating subdomain:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create subdomain";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20">
      <div className="container px-4">
        <Card className="max-w-2xl mx-auto glass-card glow p-8 animate-scale-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Create DNS Record</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Domain Selection */}
            <div className="space-y-2">
              <Label htmlFor="domain" className="text-base">Domain</Label>
              <Select value={domain} onValueChange={(value) => setDomain(value as Domain)}>
                <SelectTrigger id="domain" className="bg-muted/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {DOMAINS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Alias Input */}
            <div className="space-y-2">
              <Label htmlFor="alias" className="text-base">Subdomain Alias</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="alias"
                  placeholder="e.g., api, blog, shop"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  className="bg-muted/50 border-border/50"
                />
                <span className="text-muted-foreground">.{domain}</span>
              </div>
            </div>

            {/* Target Input */}
            <div className="space-y-2">
              <Label htmlFor="target" className="text-base">Target / Value</Label>
              <Input
                id="target"
                placeholder={recordType === "A" ? "e.g., 192.168.1.1" : recordType === "CNAME" ? "e.g., example.com" : "Target value"}
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="bg-muted/50 border-border/50"
              />
            </div>

            {/* Record Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="type" className="text-base">DNS Record Type</Label>
              <Select value={recordType} onValueChange={(value) => setRecordType(value as DnsType)}>
                <SelectTrigger id="type" className="bg-muted/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {DNS_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {recordType === "A" && "IPv4 address"}
                {recordType === "AAAA" && "IPv6 address"}
                {recordType === "CNAME" && "Canonical name (alias)"}
                {recordType === "TXT" && "Text record"}
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-lg h-12"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-5 w-5" />
                  Create Subdomain
                </>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
};

export default SubdomainGenerator;
