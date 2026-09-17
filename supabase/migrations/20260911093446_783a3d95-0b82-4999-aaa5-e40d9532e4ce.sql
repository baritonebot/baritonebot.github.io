UPDATE public.builds
SET download_url =
  'https://github.com/cabaletta/baritone/releases/download/v' ||
  CASE mc_version
    WHEN '1.21' THEN '1.11.3'
    WHEN '1.21.1' THEN '1.11.3'
    WHEN '1.21.2' THEN '1.12.0'
    WHEN '1.21.3' THEN '1.12.0'
    WHEN '1.21.4' THEN '1.13.1'
    WHEN '1.21.5' THEN '1.14.0'
    WHEN '1.21.6' THEN '1.15.0'
    WHEN '1.21.7' THEN '1.15.0'
    WHEN '1.21.8' THEN '1.15.0'
    WHEN '1.21.9' THEN '1.16.0'
    WHEN '1.21.10' THEN '1.16.0'
    WHEN '1.21.11' THEN '1.17.0'
  END ||
  '/baritone-api-' || lower(loader) || '-' ||
  CASE mc_version
    WHEN '1.21' THEN '1.11.3'
    WHEN '1.21.1' THEN '1.11.3'
    WHEN '1.21.2' THEN '1.12.0'
    WHEN '1.21.3' THEN '1.12.0'
    WHEN '1.21.4' THEN '1.13.1'
    WHEN '1.21.5' THEN '1.14.0'
    WHEN '1.21.6' THEN '1.15.0'
    WHEN '1.21.7' THEN '1.15.0'
    WHEN '1.21.8' THEN '1.15.0'
    WHEN '1.21.9' THEN '1.16.0'
    WHEN '1.21.10' THEN '1.16.0'
    WHEN '1.21.11' THEN '1.17.0'
  END || '.jar',
  file_name =
  'baritone-api-' || lower(loader) || '-' ||
  CASE mc_version
    WHEN '1.21' THEN '1.11.3'
    WHEN '1.21.1' THEN '1.11.3'
    WHEN '1.21.2' THEN '1.12.0'
    WHEN '1.21.3' THEN '1.12.0'
    WHEN '1.21.4' THEN '1.13.1'
    WHEN '1.21.5' THEN '1.14.0'
    WHEN '1.21.6' THEN '1.15.0'
    WHEN '1.21.7' THEN '1.15.0'
    WHEN '1.21.8' THEN '1.15.0'
    WHEN '1.21.9' THEN '1.16.0'
    WHEN '1.21.10' THEN '1.16.0'
    WHEN '1.21.11' THEN '1.17.0'
  END || '.jar'
WHERE loader IN ('Forge', 'NeoForge')
  AND mc_version LIKE '1.21%'
  AND download_url NOT LIKE '%/releases/download/%';