import { supabase } from "@/integrations/supabase/client";
import { Review } from "@/types";

export interface DatabaseReview {
  id: string;
  user_id: string;
  salon_id: string;
  staff_id: string | null;
  appointment_id: string | null;
  rating: number;
  comment: string;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateReviewData {
  salon_id: string;
  staff_id?: string;
  appointment_id?: string;
  rating: number;
  comment: string;
}

export interface HelpfulVoteData {
  review_id: string;
  is_helpful: boolean;
}

class ReviewService {
  // Convert database review to frontend Review type
  private mapDatabaseReview(dbReview: DatabaseReview): Review {
    return {
      id: dbReview.id,
      userId: dbReview.user_id,
      salonId: dbReview.salon_id,
      appointmentId: dbReview.appointment_id || undefined,
      rating: dbReview.rating,
      comment: dbReview.comment,
      createdAt: dbReview.created_at,
    };
  }

  async getReviewsForSalon(salonId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
      .eq('salon_id', salonId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }

    return data.map(this.mapDatabaseReview);
  }

  async getReviewsForStaff(staffId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
      .eq('staff_id', staffId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching staff reviews:', error);
      return [];
    }

    return data.map(this.mapDatabaseReview);
  }

  async createReview(reviewData: CreateReviewData): Promise<Review | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to create a review');
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        user_id: user.id,
        salon_id: reviewData.salon_id,
        staff_id: reviewData.staff_id || null,
        appointment_id: reviewData.appointment_id || null,
        rating: reviewData.rating,
        comment: reviewData.comment,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating review:', error);
      throw error;
    }

    return this.mapDatabaseReview(data);
  }

  async updateReview(reviewId: string, updates: Partial<CreateReviewData>): Promise<Review | null> {
    const { data, error } = await supabase
      .from('reviews')
      .update({
        rating: updates.rating,
        comment: updates.comment,
      })
      .eq('id', reviewId)
      .select()
      .single();

    if (error) {
      console.error('Error updating review:', error);
      throw error;
    }

    return this.mapDatabaseReview(data);
  }

  async deleteReview(reviewId: string): Promise<boolean> {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (error) {
      console.error('Error deleting review:', error);
      throw error;
    }

    return true;
  }

  async voteHelpful(reviewId: string, isHelpful: boolean): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to vote');
    }

    // Use upsert to handle existing votes
    const { error } = await supabase
      .from('review_helpful_votes')
      .upsert({
        review_id: reviewId,
        user_id: user.id,
        is_helpful: isHelpful,
      });

    if (error) {
      console.error('Error voting on review:', error);
      throw error;
    }
  }

  async getUserHelpfulVotes(reviewIds: string[]): Promise<Record<string, boolean>> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return {};
    }

    const { data, error } = await supabase
      .from('review_helpful_votes')
      .select('review_id, is_helpful')
      .eq('user_id', user.id)
      .in('review_id', reviewIds);

    if (error) {
      console.error('Error fetching user votes:', error);
      return {};
    }

    return data.reduce((acc, vote) => {
      acc[vote.review_id] = vote.is_helpful;
      return acc;
    }, {} as Record<string, boolean>);
  }
}

export const reviewService = new ReviewService();