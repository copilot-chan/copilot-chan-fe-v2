"use client";

import { useTheme } from "@/components/providers/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { ThemeConfig } from "@/types/theme";

export function TestThemeRegister() {
  const { registerTheme, availableThemes, currentTheme, setTheme, unregisterTheme,themeMode,themesForCurrentMode,setThemeMode } = useTheme();
  const [status, setStatus] = useState<string>("");

  const testTheme: ThemeConfig = {
    id: "test-purple-theme",
    name: "Test Purple Theme",
    type: "light",
    colors: {
            background: 'hsl(30 50% 98%)',
            foreground: 'hsl(30 40% 15%)',
            card: 'hsl(30 40% 95%)',
            cardForeground: 'hsl(30 40% 15%)',
            popover: 'hsl(30 40% 95%)',
            popoverForeground: 'hsl(30 40% 15%)',
            primary: 'hsla(35, 67%, 88%, 1.00)',
            primaryForeground: 'hsl(0 0% 100%)',
            secondary: 'hsl(35 60% 90%)',
            secondaryForeground: 'hsl(30 40% 15%)',
            muted: 'hsl(35 60% 90%)',
            mutedForeground: 'hsl(30 30% 45%)',
            accent: 'hsl(45 90% 60%)',
            accentForeground: 'hsl(30 40% 15%)',
            destructive: 'hsl(0 84% 60%)',
            destructiveForeground: 'hsl(0 0% 100%)',
            border: 'hsl(30 30% 85%)',
            input: 'hsl(30 30% 85%)',
            ring: 'hsl(15 85% 55%)',
            chart1: 'hsl(15 85% 55%)',
            chart2: 'hsl(30 85% 60%)',
            chart3: 'hsl(45 90% 60%)',
            chart4: 'hsl(10 80% 50%)',
            chart5: 'hsl(35 75% 55%)',
            sidebarBackground: 'hsl(30 40% 95%)',
            sidebarForeground: 'hsl(30 40% 15%)',
            sidebarPrimary: 'hsl(15 85% 55%)',
            sidebarPrimaryForeground: 'hsl(0 0% 100%)',
            sidebarAccent: 'hsl(35 60% 90%)',
            sidebarAccentForeground: 'hsl(30 40% 15%)',
            sidebarBorder: 'hsl(30 30% 85%)',
            sidebarRing: 'hsl(15 85% 55%)',
    },
  };

  const handleRegister = () => {
    try {
      registerTheme(testTheme);
      setStatus("Theme registered successfully! Check list below.");
    } catch (error) {
      setStatus(`Error registering theme: ${error}`);
    }
  };

  const handleUnregister = () => {
    try {
        unregisterTheme(testTheme.id);
        setStatus("Theme unregistered successfully.");
    } catch (error) {
        setStatus(`Error unregistering theme: ${error}`);
    }
  }

  return (
    <div className="p-8 space-y-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Manual Test: registerTheme</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={handleRegister}>Register "Test Purple Theme"</Button>
            <Button variant="destructive" onClick={handleUnregister}>Unregister Theme</Button>
          </div>
          
          {status && (
            <div className="p-4 bg-muted rounded-md text-sm font-medium">
              Status: {status}
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-bold">Current Theme ID:</h3>
            <div className="p-2 bg-secondary rounded font-mono text-sm">
              {currentTheme.id}
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold">Current Theme Name:</h3>
            <div className="p-2 bg-secondary rounded font-mono text-sm">
              {themeMode}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold">Available Themes ({availableThemes.length}):</h3>
            <div className="max-h-60 overflow-auto border rounded-md">
              <pre className="p-4 text-xs">
                {JSON.stringify(availableThemes.map(t => ({ id: t.id, name: t.name, type: t.type })), null, 2)}
              </pre>
            </div>
          </div>
          
          <div className="space-y-2">
             <h3 className="font-bold">Actions:</h3>
             <h4 className="font-bold">Set Theme Mode:</h4>
             <div className="flex flex-wrap">
                <Button onClick={() => setThemeMode("light")}>Set Light Mode</Button>
                <Button onClick={() => setThemeMode("dark")}>Set Dark Mode</Button>
                <Button onClick={() => setThemeMode("auto")}>Set Auto Mode</Button>
             </div>
             <h4 className="font-bold">Set Theme:</h4>
             <div className="flex gap-2 flex-wrap">
                {themesForCurrentMode.map(t => (
                    <Button key={t.id} variant="outline" size="sm" onClick={() => setTheme(t.id)}>
                        Set {t.name}
                    </Button>
                ))}
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
