import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ApexButton } from "@/components/ui/apex-button";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";

const enquirySchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  organization: z.string().optional(),
  message: z.string().min(10, "Please provide more detail").max(2000),
});

type EnquiryData = z.infer<typeof enquirySchema>;

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EnquiryModal({ isOpen, onClose }: EnquiryModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const form = useForm<EnquiryData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { name: "", email: "", organization: "", message: "" },
  });

  const onSubmit = async (data: EnquiryData) => {
    setIsProcessing(true);
    try {
      const { error } = await supabase.from("access_requests").insert({
        intent: data.message,
        name: data.name,
        email: data.email,
        organization: data.organization || null,
        notes: "[ENQUIRY] Via contact modal",
        status: "pending",
      });

      if (error) {
        toast({ title: "Transmission failed", description: "Please try again.", variant: "destructive" });
        setIsProcessing(false);
        return;
      }

      setSubmitted(true);
    } catch {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset after animation
    setTimeout(() => {
      setSubmitted(false);
      form.reset();
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center px-4"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg glass-card border-primary/20 p-0 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gold top accent */}
            <div className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />

            <div className="p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.4em] text-primary/70 block mb-2">
                    Secure Channel
                  </span>
                  <h2 className="text-xl font-medium text-foreground tracking-wide">
                    Contact APEX
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-muted-foreground text-xs uppercase tracking-widest">Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your name" className="bg-black/50 border-border/50 focus:border-primary text-foreground" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-muted-foreground text-xs uppercase tracking-widest">Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="you@domain.com" className="bg-black/50 border-border/50 focus:border-primary text-foreground" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>

                        <FormField control={form.control} name="organization" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-muted-foreground text-xs uppercase tracking-widest">
                              Organization <span className="text-muted-foreground/50">(optional)</span>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Company or entity" className="bg-black/50 border-border/50 focus:border-primary text-foreground" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <FormField control={form.control} name="message" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-muted-foreground text-xs uppercase tracking-widest">Message</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your enquiry, decision context, or partnership interest..."
                                className="bg-black/50 border-border/50 focus:border-primary text-foreground min-h-[120px] resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <ApexButton
                          type="submit"
                          variant="primary"
                          size="lg"
                          className="w-full gap-2"
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              TRANSMITTING...
                            </span>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              TRANSMIT ENQUIRY
                            </>
                          )}
                        </ApexButton>

                        <p className="text-center text-muted-foreground/60 text-xs tracking-wide">
                          Or email directly: apexinfrastructure369@gmail.com
                        </p>
                      </form>
                    </Form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="w-16 h-16 rounded-full border border-primary/40 flex items-center justify-center mx-auto mb-6"
                      style={{ boxShadow: '0 0 40px hsl(42 95% 55% / 0.15)' }}
                    >
                      <span className="text-2xl text-primary">◆</span>
                    </motion.div>
                    <h3 className="text-xl font-medium text-foreground mb-2">Transmission Received</h3>
                    <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                      Your enquiry has been logged. Response within 24–48 hours.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
