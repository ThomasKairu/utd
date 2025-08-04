'use client';

import { DefaultSeo } from 'next-seo';
import defaultSEO from '../../../next-seo.config';

export default function SEOProvider() {
  return <DefaultSeo {...defaultSEO} />;
}