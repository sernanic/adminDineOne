import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { HexColorPicker } from "react-colorful";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native-web';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { themeService } from "@/services/themeService";
import { useToast } from "@/hooks/use-toast"

const defaultTheme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#ffffff',
    text: '#000000',
    accent: '#FF2D55'
  },
  typography: {
    headingSize: 24,
    bodySize: 16,
    buttonSize: 18,
    lineHeight: 1.5,
    fontFamily: 'System'
  },
  spacing: {
    padding: 16,
    gap: 12,
    containerPadding: 20
  },
  borders: {
    width: 1,
    style: 'solid',
    radius: {
      small: 4,
      medium: 8,
      large: 12
    }
  },
  shadows: {
    offset: {
      width: 0,
      height: 2
    },
    opacity: 0.25,
    radius: 3.84,
    elevation: 5,
    color: '#000000'
  }
};

export default function AppConfigurations() {
  const [theme, setTheme] = useState({ ...defaultTheme });
  const [selectedColor, setSelectedColor] = useState('primary');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleColorChange = (color) => {
    setTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [selectedColor]: color
      }
    }));
  };

  const handleTypographyChange = (key, value) => {
    setTheme(prev => ({
      ...prev,
      typography: {
        ...prev.typography,
        [key]: value
      }
    }));
  };

  const handleSpacingChange = (key, value) => {
    setTheme(prev => ({
      ...prev,
      spacing: {
        ...prev.spacing,
        [key]: value
      }
    }));
  };

  const handleBorderChange = (key, value, category = null) => {
    setTheme(prev => ({
      ...prev,
      borders: {
        ...prev.borders,
        ...(category 
          ? {
              [category]: {
                ...prev.borders[category],
                [key]: value
              }
            }
          : { [key]: value }
        )
      }
    }));
  };

  const handleShadowChange = (key, value, category = null) => {
    setTheme(prev => ({
      ...prev,
      shadows: {
        ...prev.shadows,
        ...(category 
          ? {
              [category]: {
                ...prev.shadows[category],
                [key]: value
              }
            }
          : { [key]: value }
        )
      }
    }));
  };

  const getShadowStyles = () => ({
    shadowColor: theme?.shadows?.color || defaultTheme.shadows.color,
    shadowOffset: {
      width: theme?.shadows?.offset?.width ?? defaultTheme.shadows.offset.width,
      height: theme?.shadows?.offset?.height ?? defaultTheme.shadows.offset.height
    },
    shadowOpacity: theme?.shadows?.opacity ?? defaultTheme.shadows.opacity,
    shadowRadius: theme?.shadows?.radius ?? defaultTheme.shadows.radius,
    elevation: theme?.shadows?.elevation ?? defaultTheme.shadows.elevation
  });

  const handleSaveTheme = async () => {
    setIsSaving(true);
    try {
      await themeService.saveTheme(theme);
      toast({
        title: "Success",
        description: "Theme saved successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save theme. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportTheme = () => {
    const themeString = JSON.stringify(theme, null, 2);
    const blob = new Blob([themeString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'theme.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const PreviewButton = ({ style, label }) => (
    <TouchableOpacity 
      style={[
        styles.button, 
        { 
          ...style,
          padding: theme.spacing.padding,
          borderRadius: theme.borders.radius.medium
        }
      ]}
    >
      <Text 
        style={[
          styles.buttonText, 
          { 
            color: style.color || '#FFFFFF',
            fontSize: theme.typography.buttonSize,
            lineHeight: theme.typography.lineHeight
          }
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">App Theme Customization</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleExportTheme}
          >
            Export Theme
          </Button>
          <Button 
            onClick={handleSaveTheme} 
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Theme"}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customization Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Theme Customization</h2>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="colors">
                <TabsList className="mb-4">
                  <TabsTrigger value="colors">Colors</TabsTrigger>
                  <TabsTrigger value="typography">Typography</TabsTrigger>
                  <TabsTrigger value="spacing">Spacing</TabsTrigger>
                  <TabsTrigger value="borders">Borders</TabsTrigger>
                  <TabsTrigger value="shadows">Shadows</TabsTrigger>
                </TabsList>

                <TabsContent value="colors">
                  <div className="space-y-6">
                    {Object.entries(theme.colors).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="capitalize">{key}</Label>
                          <div 
                            className="w-10 h-10 rounded cursor-pointer border"
                            style={{ backgroundColor: value }}
                            onClick={() => setSelectedColor(key)}
                          />
                        </div>
                        <Input 
                          value={value}
                          onChange={(e) => handleColorChange(e.target.value)}
                          className="font-mono"
                        />
                      </div>
                    ))}
                    
                    <div className="mt-4">
                      <HexColorPicker 
                        color={theme.colors[selectedColor]} 
                        onChange={(color) => handleColorChange(color)}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="typography">
                  <div className="space-y-6">
                    {Object.entries(theme.typography).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                        {key === 'fontFamily' ? (
                          <Input 
                            value={value}
                            onChange={(e) => handleTypographyChange(key, e.target.value)}
                          />
                        ) : (
                          <div className="flex gap-4 items-center">
                            <Slider
                              value={[value]}
                              min={key.includes('Size') ? 8 : 1}
                              max={key.includes('Size') ? 48 : 2}
                              step={key.includes('Size') ? 1 : 0.1}
                              onValueChange={([val]) => handleTypographyChange(key, val)}
                            />
                            <span className="w-12 text-right">{value}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="spacing">
                  <div className="space-y-6">
                    {Object.entries(theme.spacing).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                        <div className="flex gap-4 items-center">
                          <Slider
                            value={[value]}
                            min={0}
                            max={40}
                            step={1}
                            onValueChange={([val]) => handleSpacingChange(key, val)}
                          />
                          <span className="w-12 text-right">{value}px</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="borders">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Border Width</Label>
                      <div className="flex gap-4 items-center">
                        <Slider
                          value={[theme.borders.width]}
                          min={0}
                          max={5}
                          step={1}
                          onValueChange={([val]) => handleBorderChange('width', val)}
                        />
                        <span className="w-12 text-right">{theme.borders.width}px</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Border Style</Label>
                      <select
                        className="w-full p-2 border rounded"
                        value={theme.borders.style}
                        onChange={(e) => handleBorderChange('style', e.target.value)}
                      >
                        <option value="solid">Solid</option>
                        <option value="dashed">Dashed</option>
                        <option value="dotted">Dotted</option>
                      </select>
                    </div>

                    <div className="space-y-4">
                      <Label>Border Radius</Label>
                      {Object.entries(theme.borders.radius).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                          <Label className="capitalize">{key}</Label>
                          <div className="flex gap-4 items-center">
                            <Slider
                              value={[value]}
                              min={0}
                              max={24}
                              step={1}
                              onValueChange={([val]) => handleBorderChange(key, val, 'radius')}
                            />
                            <span className="w-12 text-right">{value}px</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="shadows">
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold">Shadow Settings</h3>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <Label>Shadow Offset X</Label>
                          <div className="flex items-center gap-4">
                            <Slider
                              value={[theme?.shadows?.offset?.width ?? defaultTheme.shadows.offset.width]}
                              min={-10}
                              max={10}
                              step={1}
                              onValueChange={([value]) =>
                                handleShadowChange('width', value, 'offset')
                              }
                            />
                            <span className="w-12 text-sm">{theme?.shadows?.offset?.width ?? 0}px</span>
                          </div>
                        </div>

                        <div>
                          <Label>Shadow Offset Y</Label>
                          <div className="flex items-center gap-4">
                            <Slider
                              value={[theme?.shadows?.offset?.height ?? defaultTheme.shadows.offset.height]}
                              min={-10}
                              max={10}
                              step={1}
                              onValueChange={([value]) =>
                                handleShadowChange('height', value, 'offset')
                              }
                            />
                            <span className="w-12 text-sm">{theme?.shadows?.offset?.height ?? 0}px</span>
                          </div>
                        </div>

                        <div>
                          <Label>Shadow Opacity</Label>
                          <div className="flex items-center gap-4">
                            <Slider
                              value={[(theme?.shadows?.opacity ?? defaultTheme.shadows.opacity) * 100]}
                              min={0}
                              max={100}
                              step={1}
                              onValueChange={([value]) =>
                                handleShadowChange('opacity', value / 100)
                              }
                            />
                            <span className="w-12 text-sm">{((theme?.shadows?.opacity ?? defaultTheme.shadows.opacity) * 100).toFixed(0)}%</span>
                          </div>
                        </div>

                        <div>
                          <Label>Shadow Radius</Label>
                          <div className="flex items-center gap-4">
                            <Slider
                              value={[theme?.shadows?.radius ?? defaultTheme.shadows.radius]}
                              min={0}
                              max={20}
                              step={0.1}
                              onValueChange={([value]) =>
                                handleShadowChange('radius', value)
                              }
                            />
                            <span className="w-12 text-sm">{(theme?.shadows?.radius ?? 0).toFixed(1)}px</span>
                          </div>
                        </div>

                        <div>
                          <Label>Shadow Elevation (Android)</Label>
                          <div className="flex items-center gap-4">
                            <Slider
                              value={[theme?.shadows?.elevation ?? defaultTheme.shadows.elevation]}
                              min={0}
                              max={24}
                              step={1}
                              onValueChange={([value]) =>
                                handleShadowChange('elevation', value)
                              }
                            />
                            <span className="w-12 text-sm">{theme?.shadows?.elevation ?? 0}</span>
                          </div>
                        </div>

                        <div>
                          <Label>Shadow Color</Label>
                          <div className="flex items-center gap-4">
                            <HexColorPicker
                              color={theme?.shadows?.color ?? defaultTheme.shadows.color}
                              onChange={(color) =>
                                handleShadowChange('color', color)
                              }
                            />
                            <Input
                              value={theme?.shadows?.color ?? defaultTheme.shadows.color}
                              onChange={(e) =>
                                handleShadowChange('color', e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2 mt-6">
                <Button onClick={() => setTheme(defaultTheme)}>Reset to Default</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Preview Section */}
        <Card className="h-full">
          <CardHeader>
            <h2 className="text-xl font-semibold">Live Preview (iPhone 14)</h2>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <div className="relative">
              {/* Status Bar */}
              <div className="absolute top-[10px] left-[30px] right-[30px] flex justify-between z-10 text-xs text-gray-200">
                <span>9:41</span>
                <div className="flex gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11.5a.5.5 0 01.5-.5h14a.5.5 0 010 1h-14a.5.5 0 01-.5-.5z"/>
                    <path d="M2 7.5a.5.5 0 01.5-.5h14a.5.5 0 010 1h-14a.5.5 0 01-.5-.5z"/>
                    <path d="M2 3.5a.5.5 0 01.5-.5h14a.5.5 0 010 1h-14a.5.5 0 01-.5-.5z"/>
                  </svg>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" clipRule="evenodd"/>
                  </svg>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 4.5A2.5 2.5 0 014.5 2h11A2.5 2.5 0 0118 4.5v11a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 012 15.5v-11zm2.5-1a1 1 0 00-1 1v11a1 1 0 001 1h11a1 1 0 001-1v-11a1 1 0 00-1-1h-11z"/>
                    <path d="M4.5 5.5c0-.276.224-.5.5-.5h10c.276 0 .5.224.5.5v9c0 .276-.224.5-.5.5H5a.5.5 0 01-.5-.5v-9z"/>
                  </svg>
                </div>
              </div>
              <View 
                style={[
                  styles.previewContainer, 
                  { 
                    backgroundColor: theme.colors.background,
                    padding: theme.spacing.containerPadding,
                    gap: theme.spacing.gap
                  }
                ]}
              >
                <Text 
                  style={[
                    styles.heading, 
                    { 
                      color: theme.colors.text,
                      fontSize: theme.typography.headingSize,
                      lineHeight: theme.typography.lineHeight,
                      fontFamily: theme.typography.fontFamily,
                      marginTop: 40
                    }
                  ]}
                >
                  Restaurant App
                </Text>
                
                <View style={[styles.buttonContainer, { gap: theme.spacing.gap }]}>
                  <PreviewButton 
                    style={{ backgroundColor: theme.colors.primary }}
                    label="Order Now"
                  />
                  
                  <PreviewButton 
                    style={{ backgroundColor: theme.colors.secondary }}
                    label="View Menu"
                  />
                  
                  <PreviewButton 
                    style={{ 
                      backgroundColor: theme.colors.background,
                      borderColor: theme.colors.accent,
                      borderWidth: theme.borders.width,
                      borderStyle: theme.borders.style,
                      color: theme.colors.accent
                    }}
                    label="Special Offers"
                  />
                </View>

                <View 
                  style={[
                    styles.card,
                    {
                      borderRadius: theme?.borders?.radius?.large ?? defaultTheme.borders.radius.large,
                      padding: theme?.spacing?.padding ?? defaultTheme.spacing.padding,
                      ...getShadowStyles()
                    }
                  ]}
                >
                  <Text 
                    style={[
                      styles.cardTitle,
                      {
                        color: theme.colors.text,
                        fontSize: theme.typography.headingSize * 0.75,
                        lineHeight: theme.typography.lineHeight,
                        fontFamily: theme.typography.fontFamily
                      }
                    ]}
                  >
                    Featured Items
                  </Text>
                  <View 
                    style={[
                      styles.featuredItem,
                      { 
                        borderColor: theme.colors.accent,
                        borderBottomWidth: theme.borders.width,
                        borderStyle: theme.borders.style
                      }
                    ]}
                  >
                    <Text 
                      style={{ 
                        color: theme.colors.text,
                        fontSize: theme.typography.bodySize,
                        lineHeight: theme.typography.lineHeight,
                        fontFamily: theme.typography.fontFamily
                      }}
                    >
                      Signature Dish
                    </Text>
                    <Text 
                      style={{ 
                        color: theme.colors.secondary,
                        fontSize: theme.typography.bodySize,
                        lineHeight: theme.typography.lineHeight,
                        fontFamily: theme.typography.fontFamily
                      }}
                    >
                      $19.99
                    </Text>
                  </View>
                </View>
              </View>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  previewContainer: {
    width: 390, 
    height: 844, 
    borderRadius: 50,
    minHeight: 'unset',
    position: 'relative',
    overflow: 'hidden',
    border: '10px solid #1a1a1a',
    boxShadow: '0 0 0 2px #000, 0 20px 30px rgba(0, 0, 0, 0.2)',
    margin: '20px auto',
    // Notch
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '40%',
      height: '25px',
      backgroundColor: '#1a1a1a',
      borderBottomLeftRadius: '20px',
      borderBottomRightRadius: '20px',
      zIndex: 2
    }
  },
  heading: {
    fontWeight: 'bold',
    marginTop: 40, 
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontWeight: '600',
    marginBottom: 10,
  },
  featuredItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
});
