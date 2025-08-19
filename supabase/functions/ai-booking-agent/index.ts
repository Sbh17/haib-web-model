import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingRequest {
  message: string;
  userId: string;
}

interface BookingDetails {
  service: string;
  date: string;
  time: string;
  preferences?: string[];
}

interface AvailabilityResult {
  available: boolean;
  salon?: any;
  service?: any;
  suggestedTimes?: string[];
  message: string;
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[AI-BOOKING-AGENT] ${step}${detailsStr}`);
};

// Parse user message using OpenAI to extract booking details
async function parseBookingRequest(message: string): Promise<BookingDetails | null> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    logStep("Parsing booking request", { message });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a booking assistant for beauty salons. Extract booking details from user messages.
            
Available services: "Women Haircut", "Men Haircut", "Hair Coloring", "Manicure", "Pedicure", "Facial Treatment", "Massage Therapy", "Beard Trim"

Return a JSON object with:
- service: exact service name from the list above (or closest match)
- date: in YYYY-MM-DD format (if relative like "tomorrow", "next week", calculate based on today being ${new Date().toISOString().split('T')[0]})
- time: in HH:MM format (24-hour)
- preferences: array of any specific preferences mentioned

If the message doesn't contain enough booking information, return null.

Examples:
"I want a haircut tomorrow at 2pm" → {"service": "Women Haircut", "date": "2025-08-20", "time": "14:00"}
"Book me a manicure next Friday morning" → {"service": "Manicure", "date": "2025-08-23", "time": "10:00"}
"Can I get a massage this afternoon?" → {"service": "Massage Therapy", "date": "2025-08-19", "time": "15:00"}`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.3,
        max_tokens: 200
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    
    logStep("OpenAI parsing result", { content });

    // Try to parse the JSON response
    try {
      return JSON.parse(content);
    } catch (parseError) {
      logStep("Failed to parse JSON from OpenAI", { content, parseError });
      return null;
    }

  } catch (error) {
    logStep("Error parsing booking request", { error: error.message });
    throw error;
  }
}

// Check availability and find suitable salon/service
async function checkAvailability(supabase: any, bookingDetails: BookingDetails): Promise<AvailabilityResult> {
  try {
    logStep("Checking availability", bookingDetails);

    // Find services that match the request
    const { data: services, error: serviceError } = await supabase
      .from('services')
      .select(`
        *,
        salons (*)
      `)
      .ilike('name', `%${bookingDetails.service}%`)
      .eq('is_active', true);

    if (serviceError) {
      logStep("Error fetching services", serviceError);
      throw serviceError;
    }

    if (!services || services.length === 0) {
      return {
        available: false,
        message: `Sorry, I couldn't find the service "${bookingDetails.service}". Available services include Women Haircut, Men Haircut, Hair Coloring, Manicure, Pedicure, Facial Treatment, Massage Therapy, and Beard Trim.`
      };
    }

    logStep("Found services", { count: services.length });

    // Check each service for availability
    for (const service of services) {
      const salon = service.salons;
      
      // Check if salon is open on the requested date
      const requestDate = new Date(bookingDetails.date);
      const dayOfWeek = requestDate.toLocaleDateString('en-US', { weekday: 'lowercase' });
      
      const openingHours = salon.opening_hours[dayOfWeek];
      if (!openingHours || openingHours.closed) {
        continue; // Skip this salon, it's closed
      }

      // Check if requested time is within opening hours
      const requestedTime = bookingDetails.time;
      const [requestHour, requestMin] = requestedTime.split(':').map(Number);
      const [openHour, openMin] = openingHours.open.split(':').map(Number);
      const [closeHour, closeMin] = openingHours.close.split(':').map(Number);

      const requestMinutes = requestHour * 60 + requestMin;
      const openMinutes = openHour * 60 + openMin;
      const closeMinutes = closeHour * 60 + closeMin;

      if (requestMinutes < openMinutes || requestMinutes + service.duration_minutes > closeMinutes) {
        continue; // Skip, outside opening hours
      }

      // Check for existing appointments at this time
      const endTime = new Date(`2000-01-01 ${requestedTime}`);
      endTime.setMinutes(endTime.getMinutes() + service.duration_minutes);
      const endTimeStr = endTime.toTimeString().substring(0, 5);

      const { data: existingAppointments, error: appointmentError } = await supabase
        .from('appointments')
        .select('*')
        .eq('salon_id', salon.id)
        .eq('appointment_date', bookingDetails.date)
        .eq('appointment_time', requestedTime);

      if (appointmentError) {
        logStep("Error checking appointments", appointmentError);
        continue;
      }

      if (existingAppointments && existingAppointments.length > 0) {
        continue; // Time slot taken
      }

      // Found an available slot!
      logStep("Found available slot", { salon: salon.name, service: service.name });
      
      return {
        available: true,
        salon,
        service,
        message: `Perfect! I found availability for ${service.name} at ${salon.name} on ${bookingDetails.date} at ${requestedTime}. The appointment will take ${service.duration_minutes} minutes and costs $${service.price}. Would you like me to book this for you?`
      };
    }

    // No exact time available, suggest alternatives
    const suggestedTimes = await generateSuggestedTimes(supabase, services[0], bookingDetails.date);
    
    return {
      available: false,
      salon: services[0].salons,
      service: services[0],
      suggestedTimes,
      message: `The requested time ${requestedTime} isn't available, but I found these alternative times at ${services[0].salons.name}: ${suggestedTimes.join(', ')}. Would any of these work for you?`
    };

  } catch (error) {
    logStep("Error checking availability", { error: error.message });
    return {
      available: false,
      message: "I'm sorry, I encountered an error while checking availability. Please try again."
    };
  }
}

// Generate suggested alternative times
async function generateSuggestedTimes(supabase: any, service: any, date: string): Promise<string[]> {
  const suggestions: string[] = [];
  const salon = service.salons;
  
  const requestDate = new Date(date);
  const dayOfWeek = requestDate.toLocaleDateString('en-US', { weekday: 'lowercase' });
  const openingHours = salon.opening_hours[dayOfWeek];
  
  if (!openingHours || openingHours.closed) {
    return [];
  }

  const [openHour] = openingHours.open.split(':').map(Number);
  const [closeHour] = openingHours.close.split(':').map(Number);

  // Get existing appointments for this day
  const { data: appointments } = await supabase
    .from('appointments')
    .select('appointment_time, end_time')
    .eq('salon_id', salon.id)
    .eq('appointment_date', date);

  const bookedTimes = new Set(appointments?.map(a => a.appointment_time) || []);

  // Suggest times every hour from opening to 3 hours before closing
  for (let hour = openHour; hour < closeHour - 2; hour++) {
    const timeStr = `${hour.toString().padStart(2, '0')}:00`;
    if (!bookedTimes.has(timeStr) && suggestions.length < 3) {
      suggestions.push(timeStr);
    }
  }

  return suggestions;
}

// Book the appointment
async function bookAppointment(supabase: any, userId: string, salon: any, service: any, bookingDetails: BookingDetails): Promise<any> {
  try {
    logStep("Booking appointment", { userId, salon: salon.name, service: service.name });

    const endTime = new Date(`2000-01-01 ${bookingDetails.time}`);
    endTime.setMinutes(endTime.getMinutes() + service.duration_minutes);
    const endTimeStr = endTime.toTimeString().substring(0, 5);

    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert({
        user_id: userId,
        salon_id: salon.id,
        service_id: service.id,
        appointment_date: bookingDetails.date,
        appointment_time: bookingDetails.time,
        end_time: endTimeStr,
        total_price: service.price,
        status: 'confirmed'
      })
      .select()
      .single();

    if (error) {
      logStep("Error booking appointment", error);
      throw error;
    }

    logStep("Successfully booked appointment", { appointmentId: appointment.id });
    return appointment;

  } catch (error) {
    logStep("Error in bookAppointment", { error: error.message });
    throw error;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("AI Booking Agent request received");

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { message, userId } = await req.json() as BookingRequest;
    
    if (!message || !userId) {
      return new Response(JSON.stringify({ 
        error: "Message and userId are required" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    logStep("Processing request", { userId, message });

    // Parse the booking request using AI
    const bookingDetails = await parseBookingRequest(message);
    
    if (!bookingDetails) {
      return new Response(JSON.stringify({
        success: false,
        message: "I couldn't understand your booking request. Please specify the service you'd like (e.g., haircut, manicure), your preferred date, and time. For example: 'I'd like to book a haircut tomorrow at 2pm'"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    logStep("Parsed booking details", bookingDetails);

    // Check availability
    const availability = await checkAvailability(supabase, bookingDetails);
    
    if (availability.available && availability.salon && availability.service) {
      // Book the appointment
      try {
        const appointment = await bookAppointment(
          supabase, 
          userId, 
          availability.salon, 
          availability.service, 
          bookingDetails
        );

        return new Response(JSON.stringify({
          success: true,
          booked: true,
          appointment,
          message: `🎉 Excellent! Your ${availability.service.name} appointment is confirmed at ${availability.salon.name} on ${bookingDetails.date} at ${bookingDetails.time}. Total cost: $${availability.service.price}. See you then!`
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });

      } catch (bookingError) {
        logStep("Failed to book appointment", bookingError);
        return new Response(JSON.stringify({
          success: false,
          message: "I found availability but couldn't complete the booking. Please try again or contact the salon directly."
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }
    } else {
      // Return availability information (with suggestions if applicable)
      return new Response(JSON.stringify({
        success: true,
        booked: false,
        availability,
        message: availability.message
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in AI booking agent", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: "I'm experiencing technical difficulties. Please try again in a moment." 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});