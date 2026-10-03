import SettingsClient from '@/components/SettingsClient';
export const metadata = { title: 'Settings · BlackFlix' };
export default function Settings() {
  return (
    <div className="page">
      <h1>Settings</h1>
      <SettingsClient />
    </div>
  );
}
