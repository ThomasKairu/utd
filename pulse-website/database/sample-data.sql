-- Sample Data for Pulse UTD News
-- Run this after the main schema to populate with test articles

-- Insert sample articles for testing
INSERT INTO articles (title, slug, content, summary, category, source_url, image_url, published_at) VALUES

-- Politics Articles
('Kenya Launches New Digital Identity Program for Citizens', 
 'kenya-digital-identity-program-2024',
 'The Kenyan government has officially launched a comprehensive digital identity program aimed at modernizing citizen identification and improving access to government services. The initiative, dubbed "Digital Kenya ID," will provide citizens with secure digital credentials that can be used for various government and private sector services.

Why it matters: This digital transformation represents a significant step toward Kenya''s vision of becoming a fully digital economy, potentially improving efficiency in service delivery and reducing bureaucratic bottlenecks.

The Big Picture:
• Over 50 million Kenyan citizens will be eligible for the new digital ID system
• The program is expected to save the government millions in administrative costs annually
• Integration with mobile money platforms will enable seamless financial services access',
 'Kenya introduces a revolutionary digital identity system to modernize citizen services and boost economic efficiency.',
 'Politics',
 'https://example.com/kenya-digital-id',
 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=800&h=400&fit=crop',
 NOW() - INTERVAL '2 hours'),

('East African Community Summit Addresses Regional Trade Challenges',
 'eac-summit-regional-trade-2024',
 'Leaders from the East African Community (EAC) convened in Nairobi for a crucial summit addressing persistent trade barriers and economic integration challenges. The three-day summit focused on harmonizing customs procedures and reducing non-tariff barriers that have hindered regional commerce.

Why it matters: Enhanced regional trade integration could boost Kenya''s GDP by an estimated 15% over the next five years, creating thousands of jobs and improving living standards across the region.

The Big Picture:
• Six EAC member states committed to eliminating 80% of trade barriers by 2025
• New digital customs platform will reduce border crossing times by 50%
• Regional infrastructure projects worth $2.5 billion were approved for development',
 'EAC leaders commit to eliminating trade barriers and boosting regional economic integration through digital reforms.',
 'Politics',
 'https://example.com/eac-summit-trade',
 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=400&fit=crop',
 NOW() - INTERVAL '4 hours'),

-- Business Articles
('Kenyan Fintech Startup Raises $50 Million in Series B Funding',
 'kenyan-fintech-series-b-funding-2024',
 'Nairobi-based fintech company PayFlow has successfully closed a $50 million Series B funding round, marking one of the largest fintech investments in East Africa this year. The funding will be used to expand operations across the continent and develop new AI-powered financial products.

Why it matters: This investment demonstrates growing international confidence in Kenya''s fintech sector and positions the country as a leading hub for financial innovation in Africa.

The Big Picture:
• PayFlow serves over 2 million customers across Kenya, Uganda, and Tanzania
• The company plans to launch in five additional African markets by 2025
• New AI features will provide personalized financial advice to underbanked populations',
 'PayFlow secures major funding to expand AI-powered financial services across Africa, boosting Kenya''s fintech reputation.',
 'Business',
 'https://example.com/payflow-funding',
 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=400&fit=crop',
 NOW() - INTERVAL '6 hours'),

('Kenya''s Coffee Exports Hit Record High Despite Global Market Challenges',
 'kenya-coffee-exports-record-2024',
 'Kenya''s coffee industry has achieved unprecedented export volumes, with earnings reaching $300 million in the first quarter of 2024, representing a 25% increase compared to the same period last year. The growth comes despite global supply chain disruptions and climate challenges affecting other major coffee-producing regions.

Why it matters: Coffee is one of Kenya''s top foreign exchange earners, and this growth provides crucial economic stability while supporting over 700,000 smallholder farmers nationwide.

The Big Picture:
• Premium Kenyan coffee prices increased by 40% in international markets
• New direct trade partnerships with specialty roasters in Europe and North America
• Government investment in climate-resilient farming techniques is paying dividends',
 'Kenyan coffee industry breaks export records, earning $300 million and supporting hundreds of thousands of farmers.',
 'Business',
 'https://example.com/kenya-coffee-exports',
 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=400&fit=crop',
 NOW() - INTERVAL '8 hours'),

-- Technology Articles
('Nairobi Tech Hub Launches Africa''s First Quantum Computing Research Center',
 'nairobi-quantum-computing-center-2024',
 'The University of Nairobi, in partnership with international tech giants, has inaugurated Africa''s first dedicated quantum computing research facility. The center will focus on developing quantum solutions for African challenges, including climate modeling, financial optimization, and healthcare diagnostics.

Why it matters: This positions Kenya at the forefront of next-generation computing technology and could attract significant international research partnerships and investment.

The Big Picture:
• The facility houses a 20-qubit quantum computer, the most advanced in Africa
• Research partnerships established with MIT, Oxford, and leading tech companies
• Expected to train over 500 quantum computing specialists over the next five years',
 'University of Nairobi opens Africa''s first quantum computing center, positioning Kenya as a continental tech leader.',
 'Technology',
 'https://example.com/nairobi-quantum-center',
 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop',
 NOW() - INTERVAL '10 hours'),

('Kenyan Startup Develops AI Solution for Crop Disease Detection',
 'kenyan-ai-crop-disease-detection-2024',
 'AgriTech Kenya, a local startup, has developed an innovative AI-powered mobile application that can detect crop diseases with 95% accuracy using smartphone cameras. The solution addresses a critical challenge facing smallholder farmers who often lack access to agricultural extension services.

Why it matters: Early disease detection could save Kenyan farmers millions of dollars annually and improve food security by preventing crop losses that affect both local consumption and export revenues.

The Big Picture:
• The app works offline, making it accessible to farmers in remote areas
• Integration with mobile money platforms enables instant access to treatment recommendations
• Pilot programs show 30% reduction in crop losses among participating farmers',
 'Kenyan startup creates AI app for crop disease detection, potentially saving millions for smallholder farmers.',
 'Technology',
 'https://example.com/ai-crop-disease-detection',
 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=400&fit=crop',
 NOW() - INTERVAL '12 hours'),

-- Sports Articles
('Kenyan Marathon Team Dominates World Championships with Historic Triple Win',
 'kenya-marathon-world-championships-2024',
 'Kenyan athletes achieved a historic clean sweep at the World Athletics Championships marathon events, with Kenyan runners claiming gold, silver, and bronze in both men''s and women''s categories. This unprecedented achievement solidifies Kenya''s position as the world''s premier distance running nation.

Why it matters: These victories not only bring international prestige to Kenya but also inspire a new generation of athletes and contribute significantly to the country''s sports tourism industry.

The Big Picture:
• Six Kenyan athletes will receive substantial prize money and endorsement deals
• The victories are expected to boost Kenya''s sports tourism by an estimated 20%
• Government announces increased investment in athletics infrastructure and training programs',
 'Kenyan marathoners achieve unprecedented clean sweep at World Championships, inspiring national pride and boosting sports tourism.',
 'Sports',
 'https://example.com/kenya-marathon-championships',
 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
 NOW() - INTERVAL '14 hours'),

('New Sports Complex in Mombasa to Host International Rugby Tournament',
 'mombasa-sports-complex-rugby-tournament-2024',
 'Mombasa''s newly constructed multi-billion shilling sports complex will host its first major international event with the East Africa Rugby Championship. The state-of-the-art facility features a 30,000-seat stadium and world-class training facilities that meet international standards.

Why it matters: This development positions Kenya as a premier destination for international sporting events and could generate significant revenue through sports tourism while inspiring local youth participation in rugby.

The Big Picture:
• The tournament will attract over 50,000 visitors to Mombasa over two weeks
• Eight countries will participate, including traditional rugby powerhouses
• Local businesses expect a $10 million economic boost from the event',
 'Mombasa''s new sports complex debuts with international rugby championship, boosting tourism and local economy.',
 'Sports',
 'https://example.com/mombasa-rugby-tournament',
 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=400&fit=crop',
 NOW() - INTERVAL '16 hours'),

-- Entertainment Articles
('Kenyan Film Industry Celebrates International Recognition at Cannes',
 'kenyan-film-cannes-recognition-2024',
 'Kenyan cinema achieved a major milestone with three films selected for screening at the prestigious Cannes Film Festival. The selections represent diverse storytelling from emerging and established Kenyan filmmakers, showcasing the country''s rich cultural narratives to a global audience.

Why it matters: International recognition at Cannes opens doors for Kenyan filmmakers to access global distribution networks and funding opportunities, potentially transforming the local film industry.

The Big Picture:
• The films explore themes of urbanization, cultural identity, and social change in modern Kenya
• International co-production deals worth $5 million were signed during the festival
• Government announces new tax incentives to attract international film productions to Kenya',
 'Three Kenyan films selected for Cannes Festival, marking a breakthrough moment for the country''s cinema industry.',
 'Entertainment',
 'https://example.com/kenyan-films-cannes',
 'https://images.unsplash.com/photo-1489599162163-3f4b2c5b8b5b?w=800&h=400&fit=crop',
 NOW() - INTERVAL '18 hours'),

('Nairobi Music Festival Attracts Record International Attendance',
 'nairobi-music-festival-international-2024',
 'The annual Nairobi International Music Festival concluded with record-breaking attendance, welcoming over 100,000 music enthusiasts from across Africa and beyond. The three-day event featured a diverse lineup of local and international artists, celebrating Kenya''s vibrant music scene.

Why it matters: The festival''s success demonstrates Kenya''s growing influence in the global music industry and its potential as a major cultural tourism destination in Africa.

The Big Picture:
• Artists from 15 countries performed across multiple stages and genres
• The event generated an estimated $25 million in economic activity for Nairobi
• New partnerships established between Kenyan musicians and international record labels',
 'Nairobi Music Festival breaks attendance records, showcasing Kenya''s cultural influence and boosting tourism revenue.',
 'Entertainment',
 'https://example.com/nairobi-music-festival',
 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop',
 NOW() - INTERVAL '20 hours');

-- Update the updated_at timestamps to match created_at for consistency
UPDATE articles SET updated_at = created_at WHERE updated_at > created_at;