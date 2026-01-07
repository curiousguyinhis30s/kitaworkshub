const asianCities = [
  { name: 'Kuala Lumpur', country: 'Malaysia', slug: 'kuala-lumpur', kizomba: 7, salsa: 8, bachata: 8, vibe: 'mixed' },
  { name: 'Penang', country: 'Malaysia', slug: 'penang', kizomba: 6, salsa: 7, bachata: 7, vibe: 'beginner_friendly' },
  { name: 'Bangkok', country: 'Thailand', slug: 'bangkok', kizomba: 8, salsa: 9, bachata: 9, vibe: 'hardcore' },
  { name: 'Chiang Mai', country: 'Thailand', slug: 'chiang-mai', kizomba: 5, salsa: 6, bachata: 6, vibe: 'beginner_friendly' },
  { name: 'Phuket', country: 'Thailand', slug: 'phuket', kizomba: 4, salsa: 5, bachata: 5, vibe: 'mixed' },
  { name: 'Singapore', country: 'Singapore', slug: 'singapore', kizomba: 9, salsa: 10, bachata: 10, vibe: 'hardcore' },
  { name: 'Manila', country: 'Philippines', slug: 'manila', kizomba: 7, salsa: 9, bachata: 9, vibe: 'mixed' },
  { name: 'Cebu', country: 'Philippines', slug: 'cebu', kizomba: 5, salsa: 7, bachata: 7, vibe: 'beginner_friendly' },
  { name: 'Jakarta', country: 'Indonesia', slug: 'jakarta', kizomba: 7, salsa: 8, bachata: 8, vibe: 'mixed' },
  { name: 'Bali', country: 'Indonesia', slug: 'bali', kizomba: 6, salsa: 7, bachata: 7, vibe: 'beginner_friendly' },
  { name: 'Shanghai', country: 'China', slug: 'shanghai', kizomba: 7, salsa: 8, bachata: 8, vibe: 'hardcore' },
  { name: 'Beijing', country: 'China', slug: 'beijing', kizomba: 6, salsa: 7, bachata: 7, vibe: 'mixed' },
  { name: 'Hong Kong', country: 'China', slug: 'hong-kong', kizomba: 8, salsa: 9, bachata: 9, vibe: 'hardcore' },
  { name: 'Taipei', country: 'Taiwan', slug: 'taipei', kizomba: 7, salsa: 8, bachata: 8, vibe: 'mixed' },
  { name: 'Tokyo', country: 'Japan', slug: 'tokyo', kizomba: 8, salsa: 9, bachata: 9, vibe: 'hardcore' },
  { name: 'Osaka', country: 'Japan', slug: 'osaka', kizomba: 6, salsa: 7, bachata: 7, vibe: 'mixed' },
  { name: 'Seoul', country: 'South Korea', slug: 'seoul', kizomba: 7, salsa: 8, bachata: 8, vibe: 'hardcore' },
  { name: 'Ho Chi Minh City', country: 'Vietnam', slug: 'ho-chi-minh-city', kizomba: 6, salsa: 7, bachata: 7, vibe: 'beginner_friendly' },
];

const PB_URL = 'http://127.0.0.1:8090';

async function addCities() {
  const authRes = await fetch(`${PB_URL}/api/collections/_superusers/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: 'admin@test.com', password: 'password' })
  });
  const authData = await authRes.json();
  const token = authData.token;

  for (const city of asianCities) {
    const overall = Math.round((city.kizomba * 1.5 + city.salsa + city.bachata) / 3.5);
    const styles = [];
    if (city.kizomba >= 7) styles.push('kizomba');
    if (city.salsa >= 7) styles.push('salsa');
    if (city.bachata >= 7) styles.push('bachata');

    const communitySize = overall >= 85 ? 'large' : overall >= 70 ? 'medium' : 'small';

    await fetch(`${PB_URL}/api/collections/cities/records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({
        name: city.name,
        country: city.country,
        slug: city.slug,
        primary_dance_styles: styles,
        scene_vibe: city.vibe,
        community_size: communitySize,
        overall_score: overall,
        description: `AI-rated dance scene in ${city.name}, ${city.country}. Specializes in ${styles.join(', ')}.`
      })
    });
    console.log(`Added ${city.name}, ${city.country}`);
  }
  console.log('Done!');
}

addCities();
