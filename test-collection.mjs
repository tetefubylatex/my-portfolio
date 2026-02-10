import { getCollection } from 'astro:content';

async function testCollection() {
  try {
    const works = await getCollection('works');
    console.log('✅ Successfully loaded collection');
    console.log('📚 Total works:', works.length);
    
    if (works.length > 0) {
      console.log('First work:', {
        slug: works[0].slug,
        title: works[0].data.title,
        id: works[0].id
      });
    }
  } catch (error) {
    console.error('❌ Error loading collection:', error);
  }
}

testCollection();
