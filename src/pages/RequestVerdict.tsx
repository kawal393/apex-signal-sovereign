import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import ApexNav from "@/components/layout/ApexNav";
import ApexFooter from "@/components/layout/ApexFooter";
import MobileVoid from "@/components/effects/MobileVoid";
import { useIsMobile } from "@/hooks/use-mobile";
import { ApexButton } from "@/components/ui/apex-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  organisationName: z.string().min(2, "Organisation name is required").max(200),
  abn: z.string()
    .min(11, "ABN must be 11 digits")
    .max(14, "ABN must be 11 digits")
    .regex(/^[\d\s]+$/, "ABN must contain only numbers"),
  email: z.string().email("Valid email required").max(255),
  decisionArea: z.string().min(1, "Decision area is required"),
  decisionDescription: z.string()
    .min(50, "Please provide a detailed description (minimum 50 characters)")
    .max(2000, "Description must be under 2000 characters"),
});

type FormData = z.infer<typeof formSchema>;

const notices = [
  "APEX does not execute actions on your behalf",
  "Conditional previews are watermarked and not citeable",
  "Sealed verdicts are permanently recorded in the ATA Ledger",
  "Identity authorization ($1 AUD) is required before verdict generation",
];

const RequestVerdict = () => {
  const isMobile = useIsMobile();
  const [submitted, setSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organisationName: "",
      abn: "",
      email: "",
      decisionArea: "",
      decisionDescription: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsProcessing(true);
    
    try {
      const { error: insertError } = await supabase
        .from('access_requests')
        .insert({
          intent: data.decisionDescription,
          notes: `[CONDITIONAL VERDICT REQUEST] ABN: ${data.abn.replace(/\s/g, '')}`,
          name: data.organisationName,
          email: data.email,
          organization: data.organisationName,
          decision_area: data.decisionArea,
          urgency: 'conditional-verdict',
          budget_range: 'pending-authorization',
        });

      if (insertError) {
        console.error('Insert error:', insertError);
        toast({ 
          title: 'Submission failed', 
          description: 'Please try again.', 
          variant: 'destructive' 
        });
        setIsProcessing(false);
        return;
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      toast({ 
        title: 'Error', 
        description: 'Something went wrong.', 
        variant: 'destructive' 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black">
      {/* Background */}
      {isMobile && <MobileVoid />}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(42_50%_20%/0.04)_0%,transparent_60%)]" />
      </div>

      <ApexNav />

      <main className="relative z-10 pt-32 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Header */}
                <div className="text-center mb-12">
                  <span className="text-[10px] uppercase tracking-[0.6em] text-grey-500 block mb-4">
                    Verdict Authority
                  </span>
                  <h1 className="text-3xl md:text-4xl font-semibold text-foreground tracking-wide mb-6">
                    Request Conditional Verdict
                  </h1>
                  <p className="text-grey-400 max-w-lg mx-auto text-sm leading-relaxed">
                    Submit your decision context for formal assessment. 
                    Conditional verdicts begin unsealed and become citeable only when sealed.
                  </p>
                </div>

                {/* Notices */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="glass-card p-6 mb-8 border-grey-700/50"
                >
                  <h3 className="text-[10px] uppercase tracking-[0.3em] text-grey-500 mb-4">
                    Important Notices
                  </h3>
                  <ul className="space-y-2">
                    {notices.map((notice, i) => (
                      <li key={i} className="flex items-start gap-3 text-grey-400 text-sm">
                        <span className="text-grey-600 mt-0.5">◇</span>
                        <span>{notice}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Form */}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="glass-card p-8 space-y-6">
                      {/* Organisation Name */}
                      <FormField
                        control={form.control}
                        name="organisationName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-grey-300">Organisation Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Registered entity name" 
                                className="bg-black/50 border-grey-700 focus:border-primary" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* ABN */}
                      <FormField
                        control={form.control}
                        name="abn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-grey-300">ABN</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="00 000 000 000" 
                                className="bg-black/50 border-grey-700 focus:border-primary font-mono" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Email */}
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-grey-300">Authorised Contact Email</FormLabel>
                            <FormControl>
                              <Input 
                                type="email"
                                placeholder="contact@organisation.com" 
                                className="bg-black/50 border-grey-700 focus:border-primary" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Decision Area */}
                      <FormField
                        control={form.control}
                        name="decisionArea"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-grey-300">Decision Domain</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-black/50 border-grey-700 focus:border-primary">
                                  <SelectValue placeholder="Select domain" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ndis">NDIS Operations</SelectItem>
                                <SelectItem value="corporate">Corporate Structure</SelectItem>
                                <SelectItem value="pharma">Pharmaceutical</SelectItem>
                                <SelectItem value="grid">Energy / Grid</SelectItem>
                                <SelectItem value="property">Property / Development</SelectItem>
                                <SelectItem value="regulatory">Regulatory Compliance</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Decision Description */}
                      <FormField
                        control={form.control}
                        name="decisionDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-grey-300">Decision Being Considered</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe the decision you are facing. Include relevant context, constraints, and what outcome you are seeking clarity on."
                                className="bg-black/50 border-grey-700 focus:border-primary min-h-[160px]"
                                {...field} 
                              />
                            </FormControl>
                            <p className="text-grey-600 text-xs mt-2">
                              {field.value.length}/2000 characters
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Submit */}
                    <div className="space-y-4">
                      <ApexButton 
                        type="submit" 
                        variant="primary" 
                        size="lg" 
                        className="w-full"
                        disabled={form.formState.isSubmitting || isProcessing}
                      >
                        {isProcessing ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            PROCESSING...
                          </span>
                        ) : form.formState.isSubmitting ? (
                          "SUBMITTING..."
                        ) : (
                          "SUBMIT VERDICT REQUEST"
                        )}
                      </ApexButton>
                      <p className="text-grey-600 text-xs text-center">
                        Submission does not guarantee acceptance. Identity authorization required to proceed.
                      </p>
                    </div>
                  </form>
                </Form>
              </motion.div>
            ) : (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-center py-24"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="w-20 h-20 rounded-full border border-primary/40 flex items-center justify-center mx-auto mb-8"
                >
                  <span className="text-3xl text-primary">◆</span>
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
                  Request Received
                </h2>
                <p className="text-grey-400 max-w-md mx-auto mb-6">
                  Your conditional verdict request has been logged. 
                  If accepted, you will receive identity authorization instructions.
                </p>
                <div className="glass-card p-6 max-w-sm mx-auto text-left">
                  <h3 className="text-[10px] uppercase tracking-[0.3em] text-grey-500 mb-4">
                    Next Steps
                  </h3>
                  <ol className="space-y-3 text-grey-400 text-sm">
                    <li className="flex gap-3">
                      <span className="text-primary">1.</span>
                      <span>Identity authorization ($1 AUD)</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-grey-600">2.</span>
                      <span>Conditional preview delivery</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-grey-600">3.</span>
                      <span>Optional: Seal request + ledger recording</span>
                    </li>
                  </ol>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <ApexFooter />
    </div>
  );
};

export default RequestVerdict;
