DELETE FROM public.builds;

INSERT INTO public.builds (loader, mc_version, file_name, download_url, file_size_bytes, is_latest)
SELECT 'Fabric', v, 'baritone-api-fabric-' || v || '.jar',
       'https://baritonemc.net/downloads/baritone-api-fabric-' || v || '.jar',
       4400000, true
FROM unnest(ARRAY['1.21','1.21.1','1.21.2','1.21.3','1.21.4','1.21.5','1.21.6','1.21.7','1.21.8','1.21.9','1.21.10','1.21.11']) AS v;

INSERT INTO public.builds (loader, mc_version, file_name, download_url, file_size_bytes, is_latest)
SELECT 'Forge', v, 'baritone-api-forge-' || v || '.jar',
       'https://github.com/cabaletta/baritone/releases', 4610000, true
FROM unnest(ARRAY['1.21','1.21.1','1.21.2','1.21.3','1.21.4','1.21.5','1.21.6','1.21.7','1.21.8','1.21.9','1.21.10','1.21.11']) AS v;

INSERT INTO public.builds (loader, mc_version, file_name, download_url, file_size_bytes, is_latest)
SELECT 'NeoForge', v, 'baritone-api-neoforge-' || v || '.jar',
       'https://github.com/cabaletta/baritone/releases', 4620000, true
FROM unnest(ARRAY['1.21','1.21.1','1.21.2','1.21.3','1.21.4','1.21.5','1.21.6','1.21.7','1.21.8','1.21.9','1.21.10','1.21.11']) AS v;