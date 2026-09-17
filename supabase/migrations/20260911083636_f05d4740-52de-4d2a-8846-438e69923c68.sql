CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE TABLE public.builds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loader text NOT NULL,
  mc_version text NOT NULL,
  file_name text NOT NULL,
  download_url text NOT NULL,
  file_size_bytes bigint,
  is_latest boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.builds TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.builds TO authenticated;
GRANT ALL ON public.builds TO service_role;
ALTER TABLE public.builds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view builds" ON public.builds FOR SELECT USING (true);
CREATE POLICY "Admins can insert builds" ON public.builds FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update builds" ON public.builds FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete builds" ON public.builds FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.page_views TO anon;
GRANT SELECT, INSERT ON public.page_views TO authenticated;
GRANT ALL ON public.page_views TO service_role;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can record a page view" ON public.page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read page views" ON public.page_views FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.download_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  build_id uuid REFERENCES public.builds(id) ON DELETE SET NULL,
  loader text,
  mc_version text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.download_clicks TO anon;
GRANT SELECT, INSERT ON public.download_clicks TO authenticated;
GRANT ALL ON public.download_clicks TO service_role;
ALTER TABLE public.download_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can record a download click" ON public.download_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read download clicks" ON public.download_clicks FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_page_views_created_at ON public.page_views (created_at DESC);
CREATE INDEX idx_download_clicks_created_at ON public.download_clicks (created_at DESC);

INSERT INTO public.builds (loader, mc_version, file_name, download_url, file_size_bytes, is_latest) VALUES
  ('Fabric', '1.21.4', 'baritone-api-fabric-1.21.4.jar', 'https://baritonemc.net/downloads/baritone-api-fabric-1.21.4.jar', 4404019, true),
  ('Forge', '1.21.4', 'baritone-api-forge-1.21.4.jar', 'https://github.com/cabaletta/baritone/releases', 4610000, true),
  ('NeoForge', '1.21.4', 'baritone-api-neoforge-1.21.4.jar', 'https://github.com/cabaletta/baritone/releases', 4620000, true);