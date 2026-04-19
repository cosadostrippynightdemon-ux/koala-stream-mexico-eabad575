-- Update settings to new pricing model
UPDATE public.settings
SET exchange_rate = 1,
    multiplier_individual = 1,
    multiplier_compartida = 1,
    multiplier_perfil = 0.6;

-- Reset catalog
DELETE FROM public.products;

-- Insert full catalog with MXN monthly prices (already at half price)
INSERT INTO public.products (name, category, description, base_price_usd, modalities, durations, featured, sort_order, image_url) VALUES
('Netflix Premium', 'Streaming', '4K UHD, 4 pantallas. Series, películas y estrenos exclusivos.', 165, '["individual","compartida","perfil"]'::jsonb, '[1,3,6,12]'::jsonb, true, 1, 'netflix'),
('Disney+ Premium', 'Streaming', 'Marvel, Star Wars, Pixar, National Geographic y más.', 125, '["individual","compartida","perfil"]'::jsonb, '[1,3,6,12]'::jsonb, true, 2, 'disney'),
('Max (HBO)', 'Streaming', 'House of the Dragon, Harry Potter y catálogo HBO completo.', 115, '["individual","compartida","perfil"]'::jsonb, '[1,3,6,12]'::jsonb, true, 3, 'max'),
('Prime Video', 'Streaming', 'Series originales de Amazon y estrenos semanales.', 50, '["individual","compartida","perfil"]'::jsonb, '[1,3,6,12]'::jsonb, false, 4, 'prime'),
('Paramount+', 'Streaming', 'NFL, Yellowstone, Star Trek y series originales.', 50, '["individual","compartida","perfil"]'::jsonb, '[1,3,6,12]'::jsonb, false, 5, 'paramount'),
('Apple TV+', 'Streaming', 'Ted Lasso, Severance y producciones premium de Apple.', 65, '["individual","compartida","perfil"]'::jsonb, '[1,3,6,12]'::jsonb, false, 6, 'appletv'),
('Vix Premium', 'Streaming', 'Telenovelas, deportes y contenido exclusivo en español.', 60, '["individual","compartida","perfil"]'::jsonb, '[1,3,6,12]'::jsonb, false, 7, 'vix'),
('Crunchyroll Premium', 'Anime', 'Anime sin anuncios, simulcast y series clásicas.', 65, '["individual","compartida","perfil"]'::jsonb, '[1,3,6,12]'::jsonb, true, 8, 'crunchyroll'),
('Spotify Premium', 'Música', 'Música sin anuncios, descargas offline y alta calidad.', 65, '["individual","compartida","perfil"]'::jsonb, '[1,3,6,12]'::jsonb, true, 9, 'spotify'),
('YouTube Premium', 'Música', 'YouTube sin anuncios + YouTube Music incluido.', 70, '["individual","compartida","perfil"]'::jsonb, '[1,3,6,12]'::jsonb, false, 10, 'youtube'),
('Deezer Premium', 'Música', 'Más de 90 millones de canciones en HiFi.', 65, '["individual","compartida","perfil"]'::jsonb, '[1,3,6,12]'::jsonb, false, 11, 'deezer'),
('ChatGPT Plus', 'IA', 'GPT-5, generación de imágenes y respuestas prioritarias.', 200, '["individual","compartida","perfil"]'::jsonb, '[1,3,6,12]'::jsonb, true, 12, 'chatgpt'),
('Canva Pro', 'Software', 'Diseños premium, fondos transparentes y plantillas Pro.', 75, '["individual","compartida","perfil"]'::jsonb, '[1,3,6,12]'::jsonb, false, 13, 'canva'),
('CapCut Pro', 'Software', 'Edición de video con efectos premium y exportación 4K.', 85, '["individual","compartida","perfil"]'::jsonb, '[1,3,6,12]'::jsonb, false, 14, 'capcut'),
('DirecTV GO', 'Deportes', 'Liga MX, Champions, fútbol y deportes en vivo.', 150, '["individual","compartida","perfil"]'::jsonb, '[1,3,6,12]'::jsonb, true, 15, 'directv'),
('Combo Deportes Total', 'Combos', 'Champions, LaLiga, Premier, F1, NBA, NFL y UFC en un paquete.', 250, '["individual","compartida","perfil"]'::jsonb, '[1,3,6,12]'::jsonb, true, 16, 'sports');