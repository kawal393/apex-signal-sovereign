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
import AmbientParticles from "@/components/effects/AmbientParticles";
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
import { APEX_NODES } from "@/data/nodes";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  organization: z.string().optional(),
  nodeOfInterest: z.string().min(1, "Please select a node"),
  message: z.string().max(1000).optional(),
});

type FormData = z.infer<typeof formSchema>;

const RequestAccess = () => {
  const isMobile = useIsMobile();
  const [submitted, setSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const sealedAndDormant = APEX_NODES.filter(n => n.status !== 'live');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", organization: "", nodeOfInterest: "", message: "" },
  });

  const onSubmit = async (data: FormData) => {
    setIsProcessing(true);
    try {
      const { error } = await supabase.from('access_requests').insert({
        intent: `[ACCESS REQUEST] Node: ${data.nodeOfInterest}. ${data.message || ''}`,
        name: data.name,
        email: data.email,
        organization: data.organization || null,
        decision_area: data.nodeOfInterest,
      });
      if (error) {
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
      <AmbientParticles />
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
                <div className="text-center mb-12">
                  <span className="text-[10px] uppercase tracking-[0.6em] text-grey-500 block mb-4">Access Gate</span>
                  <h1 className="text-3xl md:text-4xl font-semibold text-foreground tracking-wide mb-6">Request Access</h1>
                  <p className="text-grey-400 max-w-lg mx-auto text-sm leading-relaxed">
                    Express interest in sealed or dormant nodes. We review every request.
                  </p>
                </div>

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

                      <FormField control={form.control} name="organization" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-grey-300">Organization <span className="text-grey-600">(optional)</span></FormLabel>
                          <FormControl><Input placeholder="Company or entity" className="bg-black/50 border-grey-700 focus:border-primary" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="nodeOfInterest" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-grey-300">Node of Interest</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-black/50 border-grey-700 focus:border-primary"><SelectValue placeholder="Select a node" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sealedAndDormant.map(n => (
                                <SelectItem key={n.id} value={n.id}>
                                  {n.name} ({n.status.toUpperCase()})
                                </SelectItem>
                              ))}
                              <SelectItem value="general">General Interest</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="message" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-grey-300">Message <span className="text-grey-600">(optional)</span></FormLabel>
                          <FormControl>
                            <Textarea placeholder="Anything you'd like us to know" className="bg-black/50 border-grey-700 focus:border-primary min-h-[100px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="text-center py-4 border-t border-grey-800/30">
                      <p className="text-grey-600 text-xs mb-2">Direct contact</p>
                      <Link to="/nodes/ghost-protocol" className="text-primary hover:text-primary/80 text-sm tracking-wide transition-colors">Emergency Protocol</Link>
                    </div>

                    <ApexButton type="submit" variant="primary" size="lg" className="w-full" disabled={isProcessing}>
                      {isProcessing ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />PROCESSING...</span> : "SUBMIT REQUEST"}
                    </ApexButton>
                  </form>
                </Form>
              </motion.div>
            ) : (
              <motion.div key="confirmation" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="text-center py-24">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }} className="w-20 h-20 rounded-full border border-primary/40 flex items-center justify-center mx-auto mb-8">
                  <span className="text-3xl text-primary">◆</span>
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">Request Received.</h2>
                <p className="text-grey-400 max-w-md mx-auto">We review every access request. You will be contacted if your profile matches.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <ApexFooter />
    </div>
  );
};

export default RequestAccess;
