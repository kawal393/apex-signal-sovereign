export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      access_requests: {
        Row: {
          ai_assessment: string | null
          ai_processed_at: string | null
          ai_recommendation: string | null
          ai_risk_score: number | null
          behavioral_data: Json | null
          budget_range: string | null
          created_at: string
          decision_area: string | null
          email: string | null
          id: string
          intent: string
          name: string | null
          notes: string | null
          organization: string | null
          patience_score_at_request: number | null
          reviewed_at: string | null
          reviewed_by: string | null
          scroll_depth_at_request: number | null
          status: string
          time_spent_before_request: number | null
          urgency: string | null
          visitor_id: string | null
        }
        Insert: {
          ai_assessment?: string | null
          ai_processed_at?: string | null
          ai_recommendation?: string | null
          ai_risk_score?: number | null
          behavioral_data?: Json | null
          budget_range?: string | null
          created_at?: string
          decision_area?: string | null
          email?: string | null
          id?: string
          intent: string
          name?: string | null
          notes?: string | null
          organization?: string | null
          patience_score_at_request?: number | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          scroll_depth_at_request?: number | null
          status?: string
          time_spent_before_request?: number | null
          urgency?: string | null
          visitor_id?: string | null
        }
        Update: {
          ai_assessment?: string | null
          ai_processed_at?: string | null
          ai_recommendation?: string | null
          ai_risk_score?: number | null
          behavioral_data?: Json | null
          budget_range?: string | null
          created_at?: string
          decision_area?: string | null
          email?: string | null
          id?: string
          intent?: string
          name?: string | null
          notes?: string | null
          organization?: string | null
          patience_score_at_request?: number | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          scroll_depth_at_request?: number | null
          status?: string
          time_spent_before_request?: number | null
          urgency?: string | null
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "access_requests_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "visitor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_intelligence_logs: {
        Row: {
          created_at: string
          id: string
          input_data: Json | null
          log_type: string
          model_used: string | null
          output_data: Json | null
          processing_time_ms: number | null
          request_id: string | null
          tokens_used: number | null
          trigger_source: string
          visitor_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          input_data?: Json | null
          log_type: string
          model_used?: string | null
          output_data?: Json | null
          processing_time_ms?: number | null
          request_id?: string | null
          tokens_used?: number | null
          trigger_source: string
          visitor_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          input_data?: Json | null
          log_type?: string
          model_used?: string | null
          output_data?: Json | null
          processing_time_ms?: number | null
          request_id?: string | null
          tokens_used?: number | null
          trigger_source?: string
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_intelligence_logs_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "access_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_intelligence_logs_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "visitor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mining_signals: {
        Row: {
          action: string
          company: string
          content_hash: string | null
          created_at: string
          date: string | null
          description: string | null
          id: string
          mine: string | null
          penalty: string | null
          risk: string
          source: string
          source_url: string | null
          state: string
          status: string | null
        }
        Insert: {
          action: string
          company: string
          content_hash?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          mine?: string | null
          penalty?: string | null
          risk?: string
          source: string
          source_url?: string | null
          state: string
          status?: string | null
        }
        Update: {
          action?: string
          company?: string
          content_hash?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          mine?: string | null
          penalty?: string | null
          risk?: string
          source?: string
          source_url?: string | null
          state?: string
          status?: string | null
        }
        Relationships: []
      }
      monitored_sources: {
        Row: {
          active: boolean
          check_interval_hours: number
          country_code: string
          created_at: string
          id: string
          jurisdiction: string
          last_checked_at: string | null
          last_content_hash: string | null
          source_name: string
          source_url: string
        }
        Insert: {
          active?: boolean
          check_interval_hours?: number
          country_code: string
          created_at?: string
          id?: string
          jurisdiction: string
          last_checked_at?: string | null
          last_content_hash?: string | null
          source_name: string
          source_url: string
        }
        Update: {
          active?: boolean
          check_interval_hours?: number
          country_code?: string
          created_at?: string
          id?: string
          jurisdiction?: string
          last_checked_at?: string | null
          last_content_hash?: string | null
          source_name?: string
          source_url?: string
        }
        Relationships: []
      }
      node_signals: {
        Row: {
          created_at: string
          id: string
          message: string | null
          metadata: Json | null
          node_id: number
          node_name: string
          signal_strength: number | null
          signal_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          metadata?: Json | null
          node_id: number
          node_name: string
          signal_strength?: number | null
          signal_type: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          metadata?: Json | null
          node_id?: number
          node_name?: string
          signal_strength?: number | null
          signal_type?: string
        }
        Relationships: []
      }
      oracle_conversations: {
        Row: {
          context: Json | null
          created_at: string
          id: string
          messages: Json
          session_id: string
          status: string
          visitor_id: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string
          id?: string
          messages?: Json
          session_id: string
          status?: string
          visitor_id?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string
          id?: string
          messages?: Json
          session_id?: string
          status?: string
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "oracle_conversations_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "visitor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          partner_id: string | null
          passcode: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          partner_id?: string | null
          passcode?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          partner_id?: string | null
          passcode?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          commission_amount: number
          created_at: string
          id: string
          partner_user_id: string
          referred_email: string
          status: string
        }
        Insert: {
          commission_amount?: number
          created_at?: string
          id?: string
          partner_user_id: string
          referred_email: string
          status?: string
        }
        Update: {
          commission_amount?: number
          created_at?: string
          id?: string
          partner_user_id?: string
          referred_email?: string
          status?: string
        }
        Relationships: []
      }
      regulatory_updates: {
        Row: {
          ai_analysis: Json | null
          content_hash: string | null
          country_code: string
          created_at: string
          detected_at: string
          id: string
          jurisdiction: string
          raw_content: string | null
          severity: string
          source_domain: string
          source_url: string
          summary: string
          title: string
        }
        Insert: {
          ai_analysis?: Json | null
          content_hash?: string | null
          country_code: string
          created_at?: string
          detected_at?: string
          id?: string
          jurisdiction: string
          raw_content?: string | null
          severity?: string
          source_domain: string
          source_url: string
          summary: string
          title: string
        }
        Update: {
          ai_analysis?: Json | null
          content_hash?: string | null
          country_code?: string
          created_at?: string
          detected_at?: string
          id?: string
          jurisdiction?: string
          raw_content?: string | null
          severity?: string
          source_domain?: string
          source_url?: string
          summary?: string
          title?: string
        }
        Relationships: []
      }
      scheduled_insights: {
        Row: {
          content: string
          delivered: boolean | null
          delivered_at: string | null
          generated_at: string
          id: string
          insight_type: string
          metadata: Json | null
          target_visitor_id: string | null
        }
        Insert: {
          content: string
          delivered?: boolean | null
          delivered_at?: string | null
          generated_at?: string
          id?: string
          insight_type: string
          metadata?: Json | null
          target_visitor_id?: string | null
        }
        Update: {
          content?: string
          delivered?: boolean | null
          delivered_at?: string | null
          generated_at?: string
          id?: string
          insight_type?: string
          metadata?: Json | null
          target_visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_insights_target_visitor_id_fkey"
            columns: ["target_visitor_id"]
            isOneToOne: false
            referencedRelation: "visitor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      session_events: {
        Row: {
          event_data: Json | null
          event_type: string
          id: string
          session_id: string
          timestamp: string
          visitor_id: string | null
        }
        Insert: {
          event_data?: Json | null
          event_type: string
          id?: string
          session_id: string
          timestamp?: string
          visitor_id?: string | null
        }
        Update: {
          event_data?: Json | null
          event_type?: string
          id?: string
          session_id?: string
          timestamp?: string
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_events_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "visitor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      visitor_profiles: {
        Row: {
          access_level: string
          created_at: string
          curiosity_score: number | null
          deepest_scroll_depth: number | null
          fingerprint: string
          first_visit: string
          id: string
          impatience_events: number
          last_visit: string
          metadata: Json | null
          nodes_viewed: string[] | null
          patience_score: number | null
          promotion_probability: number | null
          total_time_seconds: number
          updated_at: string
          visit_count: number
        }
        Insert: {
          access_level?: string
          created_at?: string
          curiosity_score?: number | null
          deepest_scroll_depth?: number | null
          fingerprint: string
          first_visit?: string
          id?: string
          impatience_events?: number
          last_visit?: string
          metadata?: Json | null
          nodes_viewed?: string[] | null
          patience_score?: number | null
          promotion_probability?: number | null
          total_time_seconds?: number
          updated_at?: string
          visit_count?: number
        }
        Update: {
          access_level?: string
          created_at?: string
          curiosity_score?: number | null
          deepest_scroll_depth?: number | null
          fingerprint?: string
          first_visit?: string
          id?: string
          impatience_events?: number
          last_visit?: string
          metadata?: Json | null
          nodes_viewed?: string[] | null
          patience_score?: number | null
          promotion_probability?: number | null
          total_time_seconds?: number
          updated_at?: string
          visit_count?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
