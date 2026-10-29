import { Redirect } from 'expo-router';

/** Native placeholder — portal is web-first like RoadAngel. */
export default function OsPortalNative() {
  return <Redirect href="/os/login" />;
}
