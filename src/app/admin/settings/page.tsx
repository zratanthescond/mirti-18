"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/presentation/components/ui/card"
import { Button } from "@/src/presentation/components/ui/button"
import { Input } from "@/src/presentation/components/ui/input"
import { Label } from "@/src/presentation/components/ui/label"
import { Textarea } from "@/src/presentation/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/presentation/components/ui/tabs"
import { useToast } from "@/src/presentation/hooks/use-toast"
import { Save, Upload, MapPin, Clock, Phone, Mail, Truck } from "lucide-react"

interface RestaurantSettings {
  _id?: string
  name: string
  description: string
  address: string
  phone: string
  email: string
  website: string
  logo: string
  openingHours: {
    [key: string]: { open: string; close: string; closed: boolean }
  }
  deliverySettings: {
    enabled: boolean
    freeDeliveryThreshold: number
    deliveryFee: number
    deliveryRadius: number
    estimatedTime: string
  }
  paymentMethods: {
    cash: boolean
    card: boolean
    paypal: boolean
    stripe: boolean
  }
  notifications: {
    emailOrders: boolean
    smsOrders: boolean
    lowStock: boolean
    dailyReports: boolean
  }
  socialMedia: {
    facebook: string
    instagram: string
    twitter: string
  }
}

const defaultSettings: RestaurantSettings = {
  name: "Pizzeria Mirti",
  description:
    "Authentic Italian bakery and deli products made with traditional recipes and the finest ingredients since 1970.",
  address: "Via Roma 123, 00100 Roma, Italy",
  phone: "+39 06 1234 5678",
  email: "info@pizzeriamirti.com",
  website: "https://pizzeriamirti.com",
  logo: "/images/pizzeria-mirti-logo.png",
  openingHours: {
    monday: { open: "07:00", close: "20:00", closed: false },
    tuesday: { open: "07:00", close: "20:00", closed: false },
    wednesday: { open: "07:00", close: "20:00", closed: false },
    thursday: { open: "07:00", close: "20:00", closed: false },
    friday: { open: "07:00", close: "21:00", closed: false },
    saturday: { open: "07:00", close: "21:00", closed: false },
    sunday: { open: "08:00", close: "19:00", closed: false },
  },
  deliverySettings: {
    enabled: true,
    freeDeliveryThreshold: 25.0,
    deliveryFee: 3.5,
    deliveryRadius: 10,
    estimatedTime: "30-45 minutes",
  },
  paymentMethods: {
    cash: true,
    card: true,
    paypal: false,
    stripe: true,
  },
  notifications: {
    emailOrders: true,
    smsOrders: false,
    lowStock: true,
    dailyReports: true,
  },
  socialMedia: {
    facebook: "https://facebook.com/pizzeriamirti",
    instagram: "https://instagram.com/pizzeriamirti",
    twitter: "https://twitter.com/pizzeriamirti",
  },
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<RestaurantSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings")
      const data = await response.json()
      if (data.settings) {
        setSettings({ ...defaultSettings, ...data.settings })
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        toast({
          title: "Settings saved!",
          description: "Restaurant settings have been updated successfully.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const updateOpeningHours = (day: string, field: string, value: string | boolean) => {
    setSettings({
      ...settings,
      openingHours: {
        ...settings.openingHours,
        [day]: {
          ...settings.openingHours[day],
          [field]: value,
        },
      },
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-heading text-brown">Restaurant Settings</h1>
          <p className="text-gray-600 mt-1">Manage your restaurant's configuration and preferences.</p>
        </div>
        <Button onClick={saveSettings} disabled={saving} className="mt-4 sm:mt-0 bg-red hover:bg-red-dark">
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="hours">Hours</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-brown">Restaurant Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Restaurant Name</Label>
                  <Input
                    id="name"
                    value={settings.name}
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={settings.website}
                    onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                    placeholder="https://yourrestaurant.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={settings.description}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="address"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="phone"
                      value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="logo">Logo URL</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="logo"
                    value={settings.logo}
                    onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
                    placeholder="Logo URL"
                  />
                  <Button variant="outline" size="icon">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-brown">Social Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={settings.socialMedia.facebook}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialMedia: { ...settings.socialMedia, facebook: e.target.value },
                    })
                  }
                  placeholder="https://facebook.com/yourrestaurant"
                />
              </div>
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={settings.socialMedia.instagram}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialMedia: { ...settings.socialMedia, instagram: e.target.value },
                    })
                  }
                  placeholder="https://instagram.com/yourrestaurant"
                />
              </div>
              <div>
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={settings.socialMedia.twitter}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialMedia: { ...settings.socialMedia, twitter: e.target.value },
                    })
                  }
                  placeholder="https://twitter.com/yourrestaurant"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-brown">Opening Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(settings.openingHours).map(([day, hours]) => (
                <div key={day} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-24">
                    <span className="font-medium capitalize">{day}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!hours.closed}
                      onChange={(e) => updateOpeningHours(day, "closed", !e.target.checked)}
                      className="rounded border-gray-300 text-red focus:ring-red"
                    />
                    <span className="text-sm">Open</span>
                  </div>
                  {!hours.closed && (
                    <>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <Input
                          type="time"
                          value={hours.open}
                          onChange={(e) => updateOpeningHours(day, "open", e.target.value)}
                          className="w-32"
                        />
                        <span className="text-sm text-gray-500">to</span>
                        <Input
                          type="time"
                          value={hours.close}
                          onChange={(e) => updateOpeningHours(day, "close", e.target.value)}
                          className="w-32"
                        />
                      </div>
                    </>
                  )}
                  {hours.closed && <span className="text-sm text-gray-500 italic">Closed</span>}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-brown">Delivery Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.deliverySettings.enabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      deliverySettings: { ...settings.deliverySettings, enabled: e.target.checked },
                    })
                  }
                  className="rounded border-gray-300 text-red focus:ring-red"
                />
                <Label>Enable Delivery Service</Label>
              </div>

              {settings.deliverySettings.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="deliveryFee">Delivery Fee (€)</Label>
                    <div className="relative">
                      <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="deliveryFee"
                        type="number"
                        step="0.01"
                        value={settings.deliverySettings.deliveryFee}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            deliverySettings: {
                              ...settings.deliverySettings,
                              deliveryFee: Number.parseFloat(e.target.value),
                            },
                          })
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="freeDeliveryThreshold">Free Delivery Threshold (€)</Label>
                    <Input
                      id="freeDeliveryThreshold"
                      type="number"
                      step="0.01"
                      value={settings.deliverySettings.freeDeliveryThreshold}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          deliverySettings: {
                            ...settings.deliverySettings,
                            freeDeliveryThreshold: Number.parseFloat(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="deliveryRadius">Delivery Radius (km)</Label>
                    <Input
                      id="deliveryRadius"
                      type="number"
                      value={settings.deliverySettings.deliveryRadius}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          deliverySettings: {
                            ...settings.deliverySettings,
                            deliveryRadius: Number.parseInt(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="estimatedTime">Estimated Delivery Time</Label>
                    <Input
                      id="estimatedTime"
                      value={settings.deliverySettings.estimatedTime}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          deliverySettings: { ...settings.deliverySettings, estimatedTime: e.target.value },
                        })
                      }
                      placeholder="30-45 minutes"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-brown">Payment Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.paymentMethods.cash}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        paymentMethods: { ...settings.paymentMethods, cash: e.target.checked },
                      })
                    }
                    className="rounded border-gray-300 text-red focus:ring-red"
                  />
                  <Label>Cash Payment</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.paymentMethods.card}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        paymentMethods: { ...settings.paymentMethods, card: e.target.checked },
                      })
                    }
                    className="rounded border-gray-300 text-red focus:ring-red"
                  />
                  <Label>Credit/Debit Card</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.paymentMethods.paypal}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        paymentMethods: { ...settings.paymentMethods, paypal: e.target.checked },
                      })
                    }
                    className="rounded border-gray-300 text-red focus:ring-red"
                  />
                  <Label>PayPal</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.paymentMethods.stripe}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        paymentMethods: { ...settings.paymentMethods, stripe: e.target.checked },
                      })
                    }
                    className="rounded border-gray-300 text-red focus:ring-red"
                  />
                  <Label>Stripe</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-brown">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.notifications.emailOrders}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, emailOrders: e.target.checked },
                      })
                    }
                    className="rounded border-gray-300 text-red focus:ring-red"
                  />
                  <Label>Email notifications for new orders</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.notifications.smsOrders}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, smsOrders: e.target.checked },
                      })
                    }
                    className="rounded border-gray-300 text-red focus:ring-red"
                  />
                  <Label>SMS notifications for new orders</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.notifications.lowStock}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, lowStock: e.target.checked },
                      })
                    }
                    className="rounded border-gray-300 text-red focus:ring-red"
                  />
                  <Label>Low stock alerts</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.notifications.dailyReports}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, dailyReports: e.target.checked },
                      })
                    }
                    className="rounded border-gray-300 text-red focus:ring-red"
                  />
                  <Label>Daily sales reports</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
