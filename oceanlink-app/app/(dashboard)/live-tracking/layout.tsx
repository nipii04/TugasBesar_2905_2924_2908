import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Global Tracking | OceanLink Dashboard',
};

export default function LiveTrackingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
