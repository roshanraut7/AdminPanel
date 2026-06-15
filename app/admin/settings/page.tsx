"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useTheme } from "next-themes";
import type { LucideIcon } from "lucide-react";
import {
  Brush,
  CheckCircle2,
  Globe2,
  KeyRound,
  Palette,
  RotateCcw,
  Save,
  UserCog,
} from "lucide-react";

import { ChangePasswordForm } from "@/components/form/change-password";
import {
  adminThemePresets,
  applyAdminTheme,
  defaultAdminTheme,
  getPresetTheme,
  loadAdminTheme,
  resetAdminTheme,
  saveAdminTheme,
  updateAdminThemeColor,
  type AdminThemeConfig,
  type AdminThemeMode,
  type AdminThemePalette,
} from "@/lib/admin-theme";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function SettingsPage() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [requireEmailVerification, setRequireEmailVerification] =
    useState(true);
  const [requireDocumentVerification, setRequireDocumentVerification] =
    useState(true);
  const [compactMode, setCompactMode] = useState(false);

  const [themeConfig, setThemeConfig] =
    useState<AdminThemeConfig>(defaultAdminTheme);

  const [customizeMode, setCustomizeMode] =
    useState<AdminThemeMode>("light");

  const currentMode: AdminThemeMode =
    resolvedTheme === "dark" ? "dark" : "light";

  useEffect(() => {
    const savedTheme = loadAdminTheme();

    if (savedTheme) {
      setThemeConfig(savedTheme);
      applyAdminTheme(savedTheme, currentMode);
      return;
    }

    applyAdminTheme(defaultAdminTheme, currentMode);
  }, [currentMode]);

  const handleThemeModeChange = (value: string) => {
    setTheme(value);
  };

  const handleThemePresetChange = (presetId: string) => {
    const presetTheme = getPresetTheme(presetId);

    if (!presetTheme) return;

    setThemeConfig(presetTheme);
    applyAdminTheme(presetTheme, currentMode);
  };

  const handleThemeColorChange = (
    key: keyof AdminThemePalette,
    value: string,
  ) => {
    setThemeConfig((previous) => {
      const updatedTheme = updateAdminThemeColor({
        themeConfig: previous,
        mode: customizeMode,
        key,
        value,
      });

      applyAdminTheme(updatedTheme, currentMode);

      return updatedTheme;
    });
  };

  const handleSaveTheme = () => {
    saveAdminTheme(themeConfig);
  };

  const handleResetTheme = () => {
    setThemeConfig(defaultAdminTheme);
    resetAdminTheme();
  };

  return (
    <section className="min-h-full bg-background p-5 md:p-7">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/10 text-primary"
            >
              Admin Settings
            </Badge>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
              Settings
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Manage platform details, user account rules, password security,
              and dashboard appearance.
            </p>
          </div>

          <Button type="button" className="w-full sm:w-auto">
            <Save className="mr-2 size-4" />
            Save changes
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-5">
          <TabsList variant="line">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="account">User & Account</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-5">
            <SettingsCard
              icon={Globe2}
              title="General Settings"
              description="Basic platform information and default system behaviour."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <FieldGroup label="Application name">
                  <Input
                    defaultValue="PasalGuff Admin"
                    placeholder="Enter application name"
                  />
                </FieldGroup>

                <FieldGroup label="Support email">
                  <Input
                    defaultValue="support@example.com"
                    placeholder="support@example.com"
                  />
                </FieldGroup>

                <FieldGroup label="Default language">
                  <Select defaultValue="english">
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="nepali">Nepali</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldGroup>

                <FieldGroup label="Timezone">
                  <Select defaultValue="asia-kathmandu">
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="asia-kathmandu">
                        Asia/Kathmandu
                      </SelectItem>
                      <SelectItem value="europe-london">
                        Europe/London
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FieldGroup>
              </div>

              <div className="mt-5 rounded-xl border border-border bg-muted/30 p-4">
                <SettingSwitch
                  title="Maintenance mode"
                  description="Temporarily disable public access while admins update the platform."
                  checked={maintenanceMode}
                  onCheckedChange={setMaintenanceMode}
                />
              </div>
            </SettingsCard>
          </TabsContent>

          <TabsContent value="account" className="space-y-5">
            <SettingsCard
              icon={UserCog}
              title="User & Account Settings"
              description="Control registration, verification, and account-level platform rules."
            >
              <div className="space-y-4">
                <SettingSwitch
                  title="Allow new user registration"
                  description="Allow new users to create accounts on the platform."
                  checked={allowRegistration}
                  onCheckedChange={setAllowRegistration}
                />

                <SettingSwitch
                  title="Require email verification"
                  description="Users must verify their email address before using account features."
                  checked={requireEmailVerification}
                  onCheckedChange={setRequireEmailVerification}
                />

                <SettingSwitch
                  title="Require document verification"
                  description="Users must submit documents before getting verified status."
                  checked={requireDocumentVerification}
                  onCheckedChange={setRequireDocumentVerification}
                />

                <div className="grid gap-5 border-t border-border pt-5 md:grid-cols-2">
                  <FieldGroup label="Default community creation limit">
                    <Input type="number" defaultValue="3" min={1} />
                  </FieldGroup>

                  <FieldGroup label="Default user status">
                    <Select defaultValue="active">
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </FieldGroup>
                </div>
              </div>
            </SettingsCard>

            <SettingsCard
              icon={KeyRound}
              title="Password Security"
              description="Update your admin password to keep your account secure."
            >
              <ChangePasswordForm />
            </SettingsCard>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-5">
            <SettingsCard
              icon={Palette}
              title="Appearance Settings"
              description="Change dashboard colours, theme mode, and visual style."
            >
              <div className="grid gap-5 md:grid-cols-3">
                <FieldGroup label="Theme mode">
                  <Select
                    value={theme ?? "system"}
                    onValueChange={handleThemeModeChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldGroup>

                <FieldGroup label="Theme preset">
                  <Select
                    value={themeConfig.presetId}
                    onValueChange={handleThemePresetChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select preset" />
                    </SelectTrigger>

                    <SelectContent>
                      {themeConfig.presetId === "custom" && (
                        <SelectItem value="custom" disabled>
                          Custom
                        </SelectItem>
                      )}

                      {adminThemePresets.map((preset) => (
                        <SelectItem key={preset.id} value={preset.id}>
                          {preset.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldGroup>

                <FieldGroup label="Customize colours for">
                  <Select
                    value={customizeMode}
                    onValueChange={(value) =>
                      setCustomizeMode(value as AdminThemeMode)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select palette" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="light">Light palette</SelectItem>
                      <SelectItem value="dark">Dark palette</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldGroup>
              </div>

              <div className="mt-5 rounded-xl border border-border bg-muted/30 p-4">
                <SettingSwitch
                  title="Compact mode"
                  description="Reduce spacing and padding for a denser admin dashboard layout."
                  checked={compactMode}
                  onCheckedChange={setCompactMode}
                />
              </div>

              <div className="mt-5">
                <div className="mb-3 flex items-center gap-2">
                  <Brush className="size-4 text-primary" />
                  <p className="text-sm font-semibold text-foreground">
                    Custom dashboard colours
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <ColorPicker
                    label="Primary"
                    value={themeConfig[customizeMode].primary}
                    onChange={(value) =>
                      handleThemeColorChange("primary", value)
                    }
                  />

                  <ColorPicker
                    label="Accent"
                    value={themeConfig[customizeMode].accent}
                    onChange={(value) =>
                      handleThemeColorChange("accent", value)
                    }
                  />

                  <ColorPicker
                    label="Focus ring"
                    value={themeConfig[customizeMode].ring}
                    onChange={(value) =>
                      handleThemeColorChange("ring", value)
                    }
                  />

                  <ColorPicker
                    label="Background"
                    value={themeConfig[customizeMode].background}
                    onChange={(value) =>
                      handleThemeColorChange("background", value)
                    }
                  />

                  <ColorPicker
                    label="Card"
                    value={themeConfig[customizeMode].card}
                    onChange={(value) =>
                      handleThemeColorChange("card", value)
                    }
                  />

                  <ColorPicker
                    label="Border"
                    value={themeConfig[customizeMode].border}
                    onChange={(value) =>
                      handleThemeColorChange("border", value)
                    }
                  />
                </div>

                <div className="mt-5 flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResetTheme}
                    className="border-border bg-card"
                  >
                    <RotateCcw className="mr-2 size-4" />
                    Reset default
                  </Button>

                  <Button type="button" onClick={handleSaveTheme}>
                    <Save className="mr-2 size-4" />
                    Save theme
                  </Button>
                </div>
              </div>
            </SettingsCard>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <CheckCircle2 className="size-5" />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    Dashboard colour preview
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    The dashboard uses the selected palette for the current
                    light or dark mode. Save the theme to keep it after refresh.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-border bg-background p-4">
                      <p className="text-xs font-medium text-muted-foreground">
                        Background
                      </p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        Page colour
                      </p>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-4">
                      <p className="text-xs font-medium text-muted-foreground">
                        Card
                      </p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        Widget colour
                      </p>
                    </div>

                    <div className="rounded-xl bg-primary p-4 text-primary-foreground">
                      <p className="text-xs font-medium opacity-80">
                        Primary
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        Button colour
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

function SettingsCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <Icon className="size-5" />
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground">
            {title}
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      {children}
    </div>
  );
}

function FieldGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      {children}
    </div>
  );
}

function SettingSwitch({
  title,
  description,
  checked,
  onCheckedChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-5">
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>

      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="mt-1"
      />
    </div>
  );
}

function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const colorValue = /^#[0-9A-Fa-f]{6}$/.test(value) ? value : "#000000";

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <Label className="text-sm font-medium text-foreground">{label}</Label>

      <div className="mt-3 flex items-center gap-3">
        <Input
          type="color"
          value={colorValue}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-14 cursor-pointer rounded-lg border-border p-1"
        />

        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="font-mono text-sm"
        />
      </div>
    </div>
  );
}