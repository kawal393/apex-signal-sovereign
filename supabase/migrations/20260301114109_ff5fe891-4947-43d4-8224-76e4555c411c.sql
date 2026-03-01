
-- Add unique passcode column to profiles
ALTER TABLE public.profiles ADD COLUMN passcode text UNIQUE DEFAULT lpad(floor(random() * 1000000)::text, 6, '0');

-- Backfill existing profiles with unique passcodes
UPDATE public.profiles SET passcode = lpad(floor(random() * 1000000)::text, 6, '0') WHERE passcode IS NULL;

-- Update the handle_new_user function to generate a passcode
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, passcode)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    lpad(floor(random() * 1000000)::text, 6, '0')
  );
  RETURN NEW;
END;
$function$;
