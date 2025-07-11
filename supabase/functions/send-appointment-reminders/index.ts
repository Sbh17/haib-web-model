import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AppointmentReminder {
  id: string;
  userId: string;
  salonName: string;
  serviceName: string;
  appointmentTime: string;
  userEmail: string;
  pushToken?: string;
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[APPOINTMENT-REMINDERS] ${step}${detailsStr}`);
};

// Mock function to send push notification
// In production, you'd integrate with FCM (Firebase Cloud Messaging) or Apple Push Notification service
async function sendPushNotification(token: string, title: string, body: string) {
  try {
    // This is a mock implementation
    // You would replace this with actual FCM or APN API calls
    logStep("Sending push notification", { token: token.substring(0, 10) + "...", title, body });
    
    // For FCM, you would do something like:
    // const response = await fetch('https://fcm.googleapis.com/fcm/send', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `key=${Deno.env.get('FCM_SERVER_KEY')}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     to: token,
    //     notification: { title, body },
    //     data: { type: 'appointment_reminder' }
    //   })
    // });
    
    return { success: true };
  } catch (error) {
    logStep("Error sending push notification", { error: error.message });
    return { success: false, error: error.message };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Starting appointment reminder check");

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Calculate time range for appointments due in 30 minutes
    const now = new Date();
    const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);
    const thirtyFiveMinutesFromNow = new Date(now.getTime() + 35 * 60 * 1000);

    logStep("Checking for appointments", {
      from: thirtyMinutesFromNow.toISOString(),
      to: thirtyFiveMinutesFromNow.toISOString()
    });

    // For now, we'll use the mock data approach since we don't have tables set up
    // In production, you would query your actual appointments table
    const mockAppointments: AppointmentReminder[] = [
      {
        id: "1",
        userId: "3",
        salonName: "Elegant Beauty",
        serviceName: "Women's Haircut",
        appointmentTime: thirtyMinutesFromNow.toISOString(),
        userEmail: "jane.client@example.com",
        pushToken: "mock_push_token_123"
      }
    ];

    const upcomingAppointments = mockAppointments.filter(apt => {
      const aptTime = new Date(apt.appointmentTime);
      return aptTime >= thirtyMinutesFromNow && aptTime <= thirtyFiveMinutesFromNow;
    });

    logStep("Found upcoming appointments", { count: upcomingAppointments.length });

    const notificationResults = [];

    for (const appointment of upcomingAppointments) {
      const title = "Appointment Reminder";
      const body = `Your ${appointment.serviceName} appointment at ${appointment.salonName} starts in 30 minutes!`;

      // Send push notification if user has a push token
      if (appointment.pushToken) {
        const pushResult = await sendPushNotification(
          appointment.pushToken,
          title,
          body
        );
        notificationResults.push({
          appointmentId: appointment.id,
          type: 'push',
          success: pushResult.success,
          error: pushResult.error
        });
      }

      // Could also send email notifications here as backup
      logStep("Processed reminder", {
        appointmentId: appointment.id,
        salonName: appointment.salonName,
        serviceName: appointment.serviceName
      });
    }

    logStep("Completed reminder processing", {
      appointmentsChecked: upcomingAppointments.length,
      notificationsSent: notificationResults.filter(r => r.success).length
    });

    return new Response(JSON.stringify({
      success: true,
      appointmentsChecked: upcomingAppointments.length,
      notificationsSent: notificationResults.filter(r => r.success).length,
      results: notificationResults
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in appointment reminders", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});