import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ApexNav from "@/components/layout/ApexNav";
import ApexFooter from "@/components/layout/ApexFooter";
import MobileVoid from "@/components/effects/MobileVoid";
import { useIsMobile } from "@/hooks/use-mobile";
import { ApexButton } from "@/components/ui/apex-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  organization: z.string().optional(),
  decisionArea: z.string().min(1, "Decision area is required"),
  description: z.string().min(20, "Please describe your decision context (minimum 20 characters)"),
  deadline: z.string().min(1, "Please indicate urgency"),
  budget: z.string().min(1, "Please select a budget range"),
});

type FormData = z.infer<typeof formSchema>;

const RequestAccess = () => {
  const isMobile = useIsMobile();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      organization: "",
      decisionArea: "",
      description: "",
      deadline: "",
      budget: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log("Verdict Brief Request:", data);
    // TODO: Wire to backend
    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen bg-black">
      {/* Background */}
      {isMobile && <MobileVoid />}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(42_50%_20%/0.06)_0%,transparent_60%)]" />
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
                <div className="text-center mb-16">
                  <span className="text-[10px] uppercase tracking-[0.6em] text-grey-500 block mb-4">
                    Access Gate
                  </span>
                  <h1 className="text-4xl md:text-5xl font-semibold text-foreground tracking-wide mb-6">
                    Request Verdict Brief
                  </h1>
                  <p className="text-grey-400 max-w-lg mx-auto">
                    Submit your decision context. If accepted, an invoice is issued. 
                    Delivery is a one-page Verdict Brief.
                  </p>
                </div>

                {/* Form */}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="glass-card p-8 space-y-6">
                      {/* Name */}
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-grey-300">Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your name" 
                                className="bg-black/50 border-grey-700 focus:border-primary" 
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
                            <FormLabel className="text-grey-300">Email</FormLabel>
                            <FormControl>
                              <Input 
                                type="email"
                                placeholder="your@email.com" 
                                className="bg-black/50 border-grey-700 focus:border-primary" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Organization */}
                      <FormField
                        control={form.control}
                        name="organization"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-grey-300">
                              Organization <span className="text-grey-500">(optional)</span>
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Company or entity name" 
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
                            <FormLabel className="text-grey-300">Decision Area</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-black/50 border-grey-700 focus:border-primary">
                                  <SelectValue placeholder="Select decision domain" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ndis">NDIS</SelectItem>
                                <SelectItem value="corporate">Corporate</SelectItem>
                                <SelectItem value="pharma">Pharma</SelectItem>
                                <SelectItem value="grid">Grid / Energy</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Description */}
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-grey-300">Describe the Decision</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="What irreversible decision are you facing? What outcome do you need clarity on?"
                                className="bg-black/50 border-grey-700 focus:border-primary min-h-[120px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Deadline */}
                      <FormField
                        control={form.control}
                        name="deadline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-grey-300">Deadline / Urgency</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-black/50 border-grey-700 focus:border-primary">
                                  <SelectValue placeholder="When do you need this?" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="urgent">Urgent (within 48 hours)</SelectItem>
                                <SelectItem value="soon">Soon (within 1 week)</SelectItem>
                                <SelectItem value="standard">Standard (2-3 weeks)</SelectItem>
                                <SelectItem value="flexible">Flexible</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Budget */}
                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-grey-300">Budget Range</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-black/50 border-grey-700 focus:border-primary">
                                  <SelectValue placeholder="Select budget range" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="under-1k">Under $1,000</SelectItem>
                                <SelectItem value="1k-5k">$1,000 - $5,000</SelectItem>
                                <SelectItem value="5k-15k">$5,000 - $15,000</SelectItem>
                                <SelectItem value="15k-plus">$15,000+</SelectItem>
                                <SelectItem value="discuss">Prefer to discuss</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <ApexButton 
                      type="submit" 
                      variant="primary" 
                      size="lg" 
                      className="w-full"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? "SUBMITTING..." : "SUBMIT REQUEST"}
                    </ApexButton>
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
                <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-4">
                  Acknowledged.
                </h2>
                <p className="text-grey-400 max-w-md mx-auto">
                  Your request has been received. If accepted, you will receive an invoice.
                </p>
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
