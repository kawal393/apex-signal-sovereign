-- Enable realtime on node_signals table so the frontend 
-- can subscribe once instead of polling ~100 requests
ALTER PUBLICATION supabase_realtime ADD TABLE public.node_signals;