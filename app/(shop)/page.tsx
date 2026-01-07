import { CopilotkitPopup } from '@/components/chat/CopilotkitPopup';
import { Carousel } from '@/components/ecomerce/carousel';
import { ThreeItemGrid } from '@/components/ecomerce/grid/three-items';
import Footer from '@/components/ecomerce/layout/footer';

export const metadata = {
  description:
    'High-performance ecommerce store built with Next.js, Vercel, and Shopify.',
  openGraph: {
    type: 'website'
  }
};

export default function HomePage() {
  return (
    <>
    <CopilotkitPopup/>
      <ThreeItemGrid />
      <Carousel />
      <Footer />
    </>
  );
}
