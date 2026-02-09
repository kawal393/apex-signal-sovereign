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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name is required").max(200),
  email: z.string().email("Valid email required").max(255),
  organisation: z.string().optional(),
  decisionArea: z.string().min(1, "Decision area is required"),
  urgency: z.string().min(1, "Urgency is required"),
  decisionDescription: z.string()
    .min(20, "Please provide context (minimum 20 characters)")
    .max(2000, "Description must be under 2000 characters"),
});

type FormData = z.infer<typeof formSchema>;

const RequestVerdict = () => {
  const isMobile = useIsMobile();
  const [submitted, setSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "", email: "", organisation: "", decisionArea: "", urgency: "", decisionDescription: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsProcessing(true);
    try {
      const { error: insertError } = await supabase
        .from('access_requests')
        .insert({
          intent: data.decisionDescription,
          notes: `[VERDICT REQUEST] Urgency: ${data.urgency}`,
          name: data.name,
          email: data.email,
          organization: data.organisation || null,
          decision_area: data.decisionArea,
          urgency: data.urgency,
          budget_range: 'pending-quote',
        });

      if (insertError) {
        toast({ title: 'Submission failed', description: 'Please try again.', variant: 'destructive' });
        setIsProcessing(false);
        return;
      }
      setSubmitted(true);
    } catch {
      toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black">
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
              <motion.div key="form" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
                {/* Header */}
                <div className="text-center mb-12">
                  <span className="text-[10px] uppercase tracking-[0.6em] text-grey-500 block mb-4">Verdict Authority</span>
                  <h1 className="text-3xl md:text-4xl font-semibold text-foreground tracking-wide mb-6">Request a Verdict Brief</h1>
                  <p className="text-grey-400 max-w-lg mx-auto text-sm leading-relaxed">
                    Verdict Briefs are structured judgment for irreversible decisions.
                    You receive a quote + timeline before payment.
                  </p>
                </div>

                {/* Form */}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="glass-card p-8 space-y-6">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-grey-300">Name</FormLabel>
                          <FormControl><Input placeholder="Your name" className="bg-black/50 border-grey-700 focus:border-primary" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-grey-300">Email</FormLabel>
                          <FormControl><Input type="email" placeholder="contact@organisation.com" className="bg-black/50 border-grey-700 focus:border-primary" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="organisation" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-grey-300">Organization <span className="text-grey-600">(optional)</span></FormLabel>
                          <FormControl><Input placeholder="Company or entity name" className="bg-black/50 border-grey-700 focus:border-primary" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="decisionArea" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-grey-300">Sector</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-black/50 border-grey-700 focus:border-primary"><SelectValue placeholder="Select sector" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ndis">NDIS</SelectItem>
                              <SelectItem value="corporate">Corporate</SelectItem>
                              <SelectItem value="pharma">Pharmaceutical</SelectItem>
                              <SelectItem value="grid">Energy / Grid</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="urgency" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-grey-300">Urgency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-black/50 border-grey-700 focus:border-primary"><SelectValue placeholder="Select delivery window" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="7">7 days</SelectItem>
                              <SelectItem value="14">14 days</SelectItem>
                              <SelectItem value="30">30 days</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="decisionDescription" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-grey-300">Decision Context <span className="text-grey-600">(max 200 words)</span></FormLabel>
                          <FormControl>
                            <Textarea placeholder="What irreversible decision are you facing?" className="bg-black/50 border-grey-700 focus:border-primary min-h-[140px]" {...field} />
                          </FormControl>
                          <p className="text-grey-600 text-xs mt-2">{field.value.length}/2000 characters</p>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    {/* Contact */}
                    <div className="text-center py-4 border-t border-grey-800/30">
                      <p className="text-grey-600 text-xs mb-2">Prefer direct contact?</p>
                      <a href="mailto:apex@apex-infrastructure.com" className="text-primary hover:text-primary/80 text-sm tracking-wide transition-colors">
                        apex@apex-infrastructure.com
                      </a>
                    </div>

                    <div className="space-y-4">
                      <ApexButton type="submit" variant="primary" size="lg" className="w-full" disabled={form.formState.isSubmitting || isProcessing}>
                        {isProcessing ? (
                          <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />PROCESSING...</span>
                        ) : "SUBMIT VERDICT REQUEST"}
                      </ApexButton>
                      <p className="text-grey-600 text-xs text-center">
                        You receive a quote + timeline before payment. No upfront commitment.
                      </p>
                    </div>
                  </form>
                </Form>
              </motion.div>
            ) : (
              <motion.div key="confirmation" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="text-center py-24">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="w-20 h-20 rounded-full border border-primary/40 flex items-center justify-center mx-auto mb-8">
                  <span className="text-3xl text-primary">◆</span>
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">Acknowledged.</h2>
                <p className="text-grey-400 max-w-md mx-auto">If accepted, you will receive a quote and timeline. No upfront commitment required.</p>
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
