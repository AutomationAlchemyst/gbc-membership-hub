"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema, type RegistrationFormValues } from '@/lib/types';
import { addMember } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Loader2 } from 'lucide-react';

const businessRegTypes = ["Home-based", "Sole-Proprietor", "LP / LLP / Pte Ltd / Private Company / Public Company"];
const businessTypes = ["F&B (dine in)", "F&B (delivery / pick up)", "On Site Retail", "Online Retail", "Service", "Sales & Consultation"];

export function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: '',
      name: '',
      designation: '',
      business: '',
      whatsappNumber: '',
      businessWebsite: '',
      socialHandle: '',
      businessSummary: '',
      businessRegistrationType: undefined,
      businessType: undefined,
    },
  });

  async function onSubmit(values: RegistrationFormValues) {
    setIsSubmitting(true);
    try {
      const result = await addMember(values);
      
      if (result.success) {
        setIsSubmitted(true);
        form.reset();
      } else {
        console.error("Submission failed:", result.message);
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: result.message || "There was a problem with your request. Please try again.",
        });
      }
    } catch (error: any) {
      console.error("Error calling addMember action: ", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg bg-green-50 border border-green-200">
        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-green-800 font-headline">Success!</h2>
        <p className="mt-2 text-lg text-green-700">Your application has been received. We'll be in touch soon!</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="designation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Designation</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Founder, CEO, Director" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="business"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business</FormLabel>
                <FormControl>
                  <Input placeholder="Your business name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="whatsappNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp Number</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+65 1234 5678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="socialHandle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instagram/TikTok/Facebook Handle</FormLabel>
                <FormControl>
                  <Input placeholder="@yourbusiness" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="businessWebsite"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Website (Optional)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="https://yourbusiness.com" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="businessRegistrationType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Business Registration Type</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-2">
                  {businessRegTypes.map((type) => (
                    <FormItem key={type} className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={type} />
                      </FormControl>
                      <FormLabel className="font-normal">{type}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="businessType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Business Type</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-2">
                  {businessTypes.map((type) => (
                    <FormItem key={type} className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={type} />
                      </FormControl>
                      <FormLabel className="font-normal">{type}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="businessSummary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short summary of your business</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us a little bit about your business" className="resize-y min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Application'
          )}
        </Button>
      </form>
    </Form>
  );
}
