import ThemeToggle from '../../components/ThemeToggle/theme-toggle';
import { useAuth } from '../../context/AuthContext';
import { DarkTheme, LightTheme } from '../../style/colors';
import './UserPreference.scss';

export default function UserPreference() {
    const { user } = useAuth();
    
  return (
    <div className="user-preference">
      <h1>User Preference</h1>
      <p>This page will allow users to manage their preferences.</p>
      <ThemeToggle DarkTheme={DarkTheme} LightTheme={LightTheme} userEmail={user?.email}></ThemeToggle>
    </div>
  );
}